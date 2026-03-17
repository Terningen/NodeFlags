import { LitElement, css, html, customElement, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { umbOpenModal, umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { UMB_NOTIFICATION_CONTEXT } from "@umbraco-cms/backoffice/notification";
import {
  nodeFlagsApi,
  type NodeFlagDefinition,
  type NodeFlagDefinitionSaveModel,
} from "../api/node-flags.js";
import { UMB_NODE_FLAG_MODAL } from "./node-flag-modal.token.js";

@customElement("node-flags-dashboard")
export class NodeFlagsDashboardElement extends UmbElementMixin(LitElement) {
  @state()
  private _definitions: Array<NodeFlagDefinition> = [];

  @state()
  private _loading = false;

  @state()
  private _saving = false;

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

  async #openCreateModal() {
    const value = await umbOpenModal(this, UMB_NODE_FLAG_MODAL, {
      data: { headline: "Create flag" },
      value: {
        name: "",
        icon: "icon-flag",
        iconColor: "#000000",
        backgroundColor: "#f3f4f6",
        sortOrder: 0,
        isEnabled: true,
      },
    }).catch(() => undefined);

    if (!value) {
      return;
    }

    await this.#save(value);
  }

  async #openEditModal(definition: NodeFlagDefinition) {
    const value = await umbOpenModal(this, UMB_NODE_FLAG_MODAL, {
      data: { headline: "Edit flag" },
      value: {
        name: definition.name,
        icon: definition.icon,
        iconColor: definition.iconColor,
        backgroundColor: definition.backgroundColor,
        sortOrder: definition.sortOrder,
        isEnabled: definition.isEnabled,
      },
    }).catch(() => undefined);

    if (!value) {
      return;
    }

    await this.#save(value, definition.key);
  }

  async #save(payload: NodeFlagDefinitionSaveModel, key?: string) {
    this._saving = true;
    this._error = "";

    try {
      if (!payload.name?.trim()) {
        throw new Error("A flag name is required.");
      }

      if (key) {
        await nodeFlagsApi.updateDefinition(key, payload);
        this.#notify("positive", "Node flag updated", payload.name);
      } else {
        await nodeFlagsApi.createDefinition(payload);
        this.#notify("positive", "Node flag created", payload.name);
      }

      await this.#loadDefinitions();
    } catch (error) {
      this._error = this.#toMessage(error);
      this.#notify("danger", "Unable to save node flag", this._error);
    } finally {
      this._saving = false;
    }
  }

  async #delete(definition: NodeFlagDefinition) {
    const confirmed = await umbConfirmModal(this, {
      color: "danger",
      headline: `Delete ${definition.name}`,
      content: `Are you sure you want to delete ${definition.name}?`,
      confirmLabel: "Delete",
    })
      .then(() => true)
      .catch(() => false);

    if (!confirmed) {
      return;
    }

    this._saving = true;

    try {
      await nodeFlagsApi.deleteDefinition(definition.key);
      this.#notify("positive", "Node flag deleted", definition.name);
      await this.#loadDefinitions();
    } catch (error) {
      this._error = this.#toMessage(error);
      this.#notify("danger", "Unable to delete node flag", this._error);
    } finally {
      this._saving = false;
    }
  }

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

  #renderRows() {
    if (this._loading) {
      return html`
        <uui-table-row>
          <uui-table-cell colspan="5" style="padding: 16px 20px;">Loading flags...</uui-table-cell>
        </uui-table-row>
      `;
    }

    if (this._definitions.length === 0) {
      return html`
        <uui-table-row>
          <uui-table-cell colspan="5" style="padding: 16px 20px;">No flags created yet.</uui-table-cell>
        </uui-table-row>
      `;
    }

    return this._definitions.map(
      (definition) => html`
      <umb-table>
      
      
      
      </umb-table>
        <uui-table-row class="definition-row">
          <uui-table-cell role="cell" class="icon-column">
            <umb-icon name=${definition.icon} style=${`color:${definition.iconColor}`}></umb-icon>
          </uui-table-cell>
          <uui-table-cell role="cell" class="name-column">
            <uui-button
              look="default"
              color="default"
              label=${definition.name}
              @click=${() => this.#openEditModal(definition)}
              ?disabled=${this._saving}
            >
              ${definition.name}
            </uui-button>
          </uui-table-cell>
          <uui-table-cell role="cell" class="status-column">
            <uui-tag size="s">${definition.isEnabled ? "Enabled" : "Disabled"}</uui-tag>
          </uui-table-cell>
          <uui-table-cell role="cell" class="priority-column">${definition.sortOrder}</uui-table-cell>
          <uui-table-cell role="cell" class="actions-column">
            <div class="row-actions">
              <uui-button
                compact
                look="outline"
                color="default"
                label="Edit"
                @click=${() => this.#openEditModal(definition)}
                ?disabled=${this._saving}
              ></uui-button>
              <uui-button
                compact
                look="outline"
                color="danger"
                label="Delete"
                @click=${() => this.#delete(definition)}
                ?disabled=${this._saving}
              ></uui-button>
            </div>
          </uui-table-cell>
        </uui-table-row>
      `
    );
  }

  render() {
    return html`
      <uui-box>
        <umb-collection-toolbar slot="header">
          <uui-button
            look="outline"
            color="default"
            label="Create"
            @click=${this.#openCreateModal}
            ?disabled=${this._saving}
          >
            Create
            <uui-symbol-expand></uui-symbol-expand>
          </uui-button>
        </umb-collection-toolbar>
        ${this._error ? html`<p class="error">${this._error}</p>` : ""}
        <uui-table class="definitions-table">
          <uui-table-head>
            <uui-table-head-cell class="icon-column"></uui-table-head-cell>
            <uui-table-head-cell class="name-column">Name</uui-table-head-cell>
            <uui-table-head-cell class="status-column">Status</uui-table-head-cell>
            <uui-table-head-cell class="priority-column">Priority</uui-table-head-cell>
            <uui-table-head-cell class="actions-column"></uui-table-head-cell>
          </uui-table-head>
          ${this.#renderRows()}
        </uui-table>
      </uui-box>
    `;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: var(--uui-size-layout-1);
        box-sizing: border-box;
      }

      .intro {
        margin: 0 0 var(--uui-size-layout-3);
        color: var(--uui-color-text-alt);
      }

      .row-actions {
        display: flex;
        gap: var(--uui-size-space-2);
        justify-content: flex-end;
      }

      .definitions-table {
        width: 100%;
      }

      .definition-row:hover > uui-table-cell {
        background: var(--uui-color-surface-alt);
      }

      .icon-column {
        width: 0;
        text-align: center;
        --uui-table-cell-padding: 0;
      }

      .name-column {
        --uui-table-cell-padding: 0 var(--uui-size-5);
        text-align: left;
      }

      .name-column uui-button {
        --uui-button-padding-left-factor: 0;
        --uui-button-padding-right-factor: 0;
      }

      .status-column {
        width: 0;
        --uui-table-cell-padding: 0 var(--uui-size-5);
      }

      .priority-column {
        width: 0;
        text-align: right;
        --uui-table-cell-padding: 0 var(--uui-size-5);
      }

      .actions-column {
        width: 0;
        text-align: right;
        --uui-table-cell-padding: 0 var(--uui-size-5);
      }

      umb-icon {
        font-size: 16px;
      }

      .error {
        color: #b42318;
        margin: 0 0 var(--uui-size-layout-3);
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
