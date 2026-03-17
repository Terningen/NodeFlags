import {
  LitElement,
  css,
  html,
  customElement,
  state,
  unsafeCSS,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import {
  nodeFlagsApi,
  type NodeFlagDefinition,
  type NodeFlagDefinitionSaveModel,
} from "../api/node-flags.js";
import dashboardTailwindCss from "./node-flags-dashboard.tailwind.css?inline";

type EditorState = NodeFlagDefinitionSaveModel & {
  key?: string;
};

const ICON_OPTIONS = [
  { value: "icon-flag", label: "Flag" },
  { value: "icon-alert", label: "Alert" },
  { value: "icon-wand", label: "Wand" },
] as const;

const createDefaultEditorState = (): EditorState => ({
  name: "Flag name",
  icon: "icon-flag",
  iconColor: "#000000",
  backgroundColor: "#f3f4f6",
  sortOrder: 0,
  isEnabled: true,
});

@customElement("node-flags-dashboard")
export class NodeFlagsDashboardElement extends UmbElementMixin(LitElement) {
  @state()
  private _definitions: Array<NodeFlagDefinition> = [];

  @state()
  private _loading = false;

  @state()
  private _saving = false;

  @state()
  private _editor: EditorState = createDefaultEditorState();

  @state()
  private _error = "";

  #notificationContext?: typeof UMB_NOTIFICATION_CONTEXT.TYPE;

  constructor() {
    super();

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (notificationContext) => {
      this.#notificationContext = notificationContext;
    });

    void this.#loadDefinitions();
  }

  async #loadDefinitions() {
    this._loading = true;
    this._error = "";

    try {
      this._definitions = await nodeFlagsApi.getDefinitions();
    } catch (error) {
      this._error = this.#toMessage(error);
      this.#notify("danger", "Unable to load node flags", this._error);
    } finally {
      this._loading = false;
    }
  }

  #startCreate = () => {
    this._editor = createDefaultEditorState();
  };

  #startEdit(definition: NodeFlagDefinition) {
    this._editor = {
      key: definition.key,
      name: definition.name,
      icon: definition.icon,
      iconColor: definition.iconColor,
      backgroundColor: definition.backgroundColor,
      sortOrder: definition.sortOrder,
      isEnabled: definition.isEnabled,
    };
  }

  #onInput =
    (field: keyof EditorState) =>
    (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLSelectElement;
      const value =
        field === "isEnabled"
          ? (target as HTMLInputElement).checked
          : field === "sortOrder"
            ? Number(target.value || 0)
            : target.value;

      this._editor = {
        ...this._editor,
        [field]: value,
      };
    };

  #save = async () => {
    this._saving = true;
    this._error = "";

    const payload: NodeFlagDefinitionSaveModel = {
      name: this._editor.name.trim(),
      icon: this._editor.icon?.trim() || "icon-flag",
      iconColor: this._editor.iconColor,
      backgroundColor: this._editor.backgroundColor,
      sortOrder: this._editor.sortOrder,
      isEnabled: this._editor.isEnabled,
    };

    try {
      if (!payload.name) {
        throw new Error("A flag name is required.");
      }

      if (this._editor.key) {
        await nodeFlagsApi.updateDefinition(this._editor.key, payload);
        this.#notify("positive", "Node flag updated", payload.name);
      } else {
        await nodeFlagsApi.createDefinition(payload);
        this.#notify("positive", "Node flag created", payload.name);
      }

      this._editor = createDefaultEditorState();
      await this.#loadDefinitions();
    } catch (error) {
      this._error = this.#toMessage(error);
      this.#notify("danger", "Unable to save node flag", this._error);
    } finally {
      this._saving = false;
    }
  };

  #delete = async (definition: NodeFlagDefinition) => {
    this._saving = true;

    try {
      await nodeFlagsApi.deleteDefinition(definition.key);
      this.#notify("positive", "Node flag deleted", definition.name);
      if (this._editor.key === definition.key) {
        this._editor = createDefaultEditorState();
      }
      await this.#loadDefinitions();
    } catch (error) {
      this._error = this.#toMessage(error);
      this.#notify("danger", "Unable to delete node flag", this._error);
    } finally {
      this._saving = false;
    }
  };

  #notify(color: "positive" | "danger" | "warning", headline: string, message: string) {
    this.#notificationContext?.peek(color, {
      data: {
        headline,
        message,
      },
    });
  }

  #toMessage(error: unknown) {
    if (typeof error === "string") {
      return error;
    }

    if (error && typeof error === "object") {
      const maybe = error as { detail?: string; message?: string };
      return maybe.detail ?? maybe.message ?? "Unknown error";
    }

    return "Unknown error";
  }

  render() {
    return html`
      <div class="layout tw-dashboard-layout">
        <uui-box>
          <div class="box-headline tw-dashboard-box-headline">
            <span class="box-headline-title">${this._editor.key ? "Edit flag" : "Create flag"}</span>
            <uui-button
              look="primary"
              color="default"
              label="New flag"
              @click=${this.#startCreate}
              ?disabled=${this._saving}
            ></uui-button>
          </div>

          <p class="intro">Create reusable flags for editors to apply in the Content tree.</p>

          <div class="form tw-dashboard-form">
            <label class="field">
              <span class="field-label">Name</span>
              <input
                class="text-input"
                .value=${this._editor.name}
                @input=${this.#onInput("name")}
                placeholder="Flag name"
              />
            </label>

            <label class="field">
              <span class="field-label">Icon</span>
              <select class="text-input" .value=${this._editor.icon ?? "icon-flag"} @change=${this.#onInput("icon")}>
                ${ICON_OPTIONS.map(
                  (option) => html`<option value=${option.value}>${option.label}</option>`
                )}
              </select>
            </label>

            <div class="field-grid tw-dashboard-field-grid">
              <label class="field">
                <span class="field-label">Icon color</span>
                <div class="color-field">
                  <input
                    class="color-input"
                    type="color"
                    .value=${this._editor.iconColor}
                    @input=${this.#onInput("iconColor")}
                  />
                  <span class="color-value">${this._editor.iconColor}</span>
                </div>
              </label>

              <label class="field">
                <span class="field-label">Background</span>
                <div class="color-field">
                  <input
                    class="color-input"
                    type="color"
                    .value=${this._editor.backgroundColor}
                    @input=${this.#onInput("backgroundColor")}
                  />
                  <span class="color-value">${this._editor.backgroundColor}</span>
                </div>
              </label>
            </div>

            <div class="field-grid compact">
              <label class="field">
                <span class="field-label">Priority</span>
                <input
                  class="text-input"
                  type="number"
                  .value=${String(this._editor.sortOrder)}
                  @input=${this.#onInput("sortOrder")}
                />
              </label>

              <label class="toggle-field">
                <span class="field-label">Enabled</span>
                <uui-toggle
                  ?checked=${this._editor.isEnabled}
                  @change=${this.#onInput("isEnabled")}
                ></uui-toggle>
              </label>
            </div>
          </div>

          <div
            class="preview"
            style=${`--flag-bg:${this._editor.backgroundColor};--flag-icon:${this._editor.iconColor};`}
          >
            <div class="preview-row">
              <span class="preview-icon">
                <uui-icon name=${this._editor.icon || "icon-flag"}></uui-icon>
              </span>
              <span class="preview-name">${this._editor.name || "Preview node name"}</span>
            </div>
          </div>

          ${this._error ? html`<p class="error">${this._error}</p>` : ""}

          <div class="actions">
            <uui-button
              look="primary"
              color="positive"
              label=${this._saving ? "Saving..." : this._editor.key ? "Save changes" : "Create flag"}
              @click=${this.#save}
              ?disabled=${this._saving || this._loading}
            ></uui-button>
          </div>
        </uui-box>

        <uui-box headline="Existing flags">
          <p class="intro">Lower priority numbers win the visible row styling when multiple flags are active.</p>

          ${this._loading
            ? html`<p class="empty-state">Loading flags...</p>`
            : this._definitions.length === 0
              ? html`<p class="empty-state">No flags created yet.</p>`
              : html`
                  <div class="definitions tw-dashboard-definitions">
                    ${this._definitions.map(
                      (definition) => html`
                        <article
                          class="definition"
                          style=${`--flag-bg:${definition.backgroundColor};--flag-icon:${definition.iconColor};`}
                        >
                          <div class="definition-main tw-dashboard-definition-main">
                            <span class="preview-icon">
                              <uui-icon name=${definition.icon}></uui-icon>
                            </span>
                            <strong class="definition-title">${definition.name}</strong>
                            <uui-tag size="s">${definition.isEnabled ? "Enabled" : "Disabled"}</uui-tag>
                            <span class="definition-priority">Priority ${definition.sortOrder}</span>
                          </div>
                          <div class="definition-actions tw-dashboard-actions">
                            <uui-button
                              look="outline"
                              color="default"
                              label="Edit"
                              @click=${() => this.#startEdit(definition)}
                              ?disabled=${this._saving}
                            ></uui-button>
                            <uui-button
                              look="outline"
                              color="danger"
                              label="Delete"
                              @click=${() => this.#delete(definition)}
                              ?disabled=${this._saving}
                            ></uui-button>
                          </div>
                        </article>
                      `
                    )}
                  </div>
                `}
        </uui-box>
      </div>
    `;
  }

  static styles = [
    unsafeCSS(dashboardTailwindCss),
    css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
        color: var(--uui-color-text);
        box-sizing: border-box;
      }

      .layout {
        display: grid;
        grid-template-columns: minmax(320px, 420px) minmax(0, 1fr);
        gap: var(--uui-size-layout-1);
        align-items: start;
      }

      uui-box {
        min-width: 0;
      }

      .box-headline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--uui-size-layout-2);
        width: 100%;
        border-bottom: 1px solid var(--uui-color-divider);
      }

      .box-headline-title {
        flex: 1 1 auto;
        min-width: 0;
        text-align: left;
      }

      .box-headline uui-button {
        margin-left: auto;
        flex: 0 0 auto;
      }

      .intro {
        padding-top:15px;
        margin: 0 0 var(--uui-size-layout-3);
        color: var(--uui-color-text-alt);
      }

      .form {
        display: grid;
        gap: var(--uui-size-layout-3);
      }

      .field,
      .toggle-field {
        display: grid;
        gap: var(--uui-size-space-2);
      }

      .field-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--uui-size-layout-3);
      }

      .field-grid.compact {
        align-items: end;
      }

      .field-label {
        font-size: 12px;
        font-weight: 700;
        color: var(--uui-color-text-alt);
      }

      .text-input {
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
        min-height: 40px;
        border: 1px solid var(--uui-color-divider-emphasis);
        border-radius: var(--uui-border-radius);
        padding: 0 12px;
        font: inherit;
        background: var(--uui-color-surface);
        color: var(--uui-color-text);
      }

      select.text-input {
        appearance: auto;
      }

      .color-field {
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 40px;
      }

      .color-input {
        width: 48px;
        height: 40px;
        padding: 4px;
        border: 1px solid var(--uui-color-divider-emphasis);
        border-radius: var(--uui-border-radius);
        background: var(--uui-color-surface);
      }

      .color-value {
        font-family: var(--uui-font-family-monospace, monospace);
        font-size: 12px;
        color: var(--uui-color-text-alt);
      }

      .toggle-field {
        align-content: center;
      }

      .preview {
        margin-bottom: 15px;
        margin-top: var(--uui-size-layout-3);
        padding: 14px 16px;
        background: color-mix(in srgb, var(--flag-bg) 18%, var(--uui-color-surface));
        border: 1px solid color-mix(in srgb, var(--flag-bg) 45%, var(--uui-color-divider));
        border-radius: var(--uui-border-radius-xl);
      }

      .definition {
        background: color-mix(in srgb, var(--flag-bg) 12%, var(--uui-color-surface));
        border: 1px solid color-mix(in srgb, var(--flag-bg) 35%, var(--uui-color-divider));
        border-radius: var(--uui-border-radius-xl);
      }

      .preview-row,
      .definition-main {
        display: flex;
        align-items: center;
        gap: 3px;
        min-width: 0;
      }

      .preview-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        min-width: 18px;
        min-height: 18px;
        padding: 0;
      }

      .preview-icon uui-icon {
        color: var(--flag-icon);
        font-size: 16px;
      }

      .definition .preview-icon uui-icon {
        color: var(--flag-icon);
      }

      .preview-name {
        min-width: 0;
      }

      .actions,
      .definition-actions {
        display: flex;
        gap: var(--uui-size-space-3);
        flex-wrap: nowrap;
        align-items: center;
      }

      .definitions {
        display: grid;
        gap: var(--uui-size-layout-1);
      }

      .definition {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      .definition-title,
      .definition-priority {
        white-space: nowrap;
      }

      .definition-main {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: nowrap;
        min-width: 0;
      }

      .definition-title {
        font-weight: 700;
      }

      .definition-priority {
        color: var(--uui-color-text-alt);
        font-size: 12px;
      }

      .empty-state {
        color: var(--uui-color-text-alt);
      }

      .error {
        color: #b42318;
        margin: var(--uui-size-layout-3) 0 0;
      }

      @media (max-width: 1100px) {
        .layout {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 700px) {
        :host {
          padding: var(--uui-size-layout-3);
        }

        .field-grid,
        .definition {
          grid-template-columns: 1fr;
          display: grid;
        }

        .box-headline {
          align-items: start;
        }

        .definition-main {
          flex-wrap: wrap;
        }

        .definition-actions {
          justify-content: start;
          flex-wrap: nowrap;
        }
      }

      .definition-actions uui-button::part(button) {
        min-height: 28px;
        padding-block: 0;
      }
    `,
  ];
}

export default NodeFlagsDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    "node-flags-dashboard": NodeFlagsDashboardElement;
  }
}
