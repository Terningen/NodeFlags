import {
  LitElement,
  css,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import {
  nodeFlagsApi,
  type NodeFlagsForNode,
  type NodeFlagDefinition,
} from "../api/node-flags.js";

declare global {
  interface WindowEventMap {
    "node-flags-changed": CustomEvent<{ contentKey: string }>;
  }
}

@customElement("node-flags-panel")
export class NodeFlagsPanelElement extends LitElement {
  @state()
  private _contentIdentifier = "";

  @state()
  private _state?: NodeFlagsForNode;

  @state()
  private _loading = false;

  @state()
  private _error = "";

  open(contentIdentifier: string) {
    this._contentIdentifier = contentIdentifier;
    this.style.display = "block";
    void this.#load();
  }

  close() {
    this.style.display = "none";
    this._error = "";
  }

  async #load() {
    this._loading = true;
    this._error = "";

    try {
      this._state = await this.#loadState();
    } catch (error) {
      this._error = this.#toMessage(error, "Unable to load flags.");
    } finally {
      this._loading = false;
    }
  }

  async #toggle(flag: NodeFlagDefinition) {
    this._loading = true;

    try {
      const result = await this.#toggleState(flag.key);
      this._state = result.state;
      window.dispatchEvent(
        new CustomEvent("node-flags-changed", {
          detail: { contentKey: this._contentIdentifier },
        })
      );
    } catch (error) {
      this._error = this.#toMessage(error, "Unable to toggle flag.");
    } finally {
      this._loading = false;
    }
  }

  async #loadState() {
    if (this.#isGuid(this._contentIdentifier)) {
      return nodeFlagsApi.getNodeFlagsByKey(this._contentIdentifier);
    }

    if (this.#isNumeric(this._contentIdentifier)) {
      return nodeFlagsApi.getNodeFlags(Number(this._contentIdentifier));
    }

    try {
      return await nodeFlagsApi.getNodeFlagsByKey(this._contentIdentifier);
    } catch {
      if (this.#extractNumeric(this._contentIdentifier) !== null) {
        return nodeFlagsApi.getNodeFlags(this.#extractNumeric(this._contentIdentifier)!);
      }

      throw new Error(`Unsupported content identifier: ${this._contentIdentifier}`);
    }
  }

  async #toggleState(flagKey: string) {
    if (this.#isGuid(this._contentIdentifier)) {
      return nodeFlagsApi.toggleFlagByKey(this._contentIdentifier, flagKey);
    }

    if (this.#isNumeric(this._contentIdentifier)) {
      return nodeFlagsApi.toggleFlag(Number(this._contentIdentifier), flagKey);
    }

    const numeric = this.#extractNumeric(this._contentIdentifier);
    if (numeric !== null) {
      return nodeFlagsApi.toggleFlag(numeric, flagKey);
    }

    return nodeFlagsApi.toggleFlagByKey(this._contentIdentifier, flagKey);
  }

  #isGuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  #isNumeric(value: string) {
    return /^\d+$/.test(value);
  }

  #extractNumeric(value: string) {
    const match = value.match(/\d+/);
    return match ? Number(match[0]) : null;
  }

  #toMessage(error: unknown, fallback: string) {
    if (typeof error === "string") {
      return error;
    }

    if (error && typeof error === "object") {
      const maybe = error as {
        detail?: string;
        message?: string;
        error?: { detail?: string; message?: string };
      };

      return maybe.detail ?? maybe.message ?? maybe.error?.detail ?? maybe.error?.message ?? fallback;
    }

    return fallback;
  }

  render() {
    const activeKeys = new Set(this._state?.activeFlags.map((flag) => flag.flagKey) ?? []);

    return html`
      <div class="backdrop" @click=${() => this.close()}></div>
      <section class="panel">
        <header class="panel-header">
          <div class="panel-title">Node Flags</div>
          <uui-button look="outline" color="default" label="Close" @click=${() => this.close()}></uui-button>
        </header>

        <div class="panel-body">
          <p class="intro">Toggle one or more flags for this content node.</p>

          ${this._loading && !this._state ? html`<p class="empty-state">Loading…</p>` : ""}
          ${this._error ? html`<p class="error">${this._error}</p>` : ""}

          <uui-table>
            <uui-table-head>
              <uui-table-head-cell style="text-align:center; width: 0;"></uui-table-head-cell>
              <uui-table-head-cell>Name</uui-table-head-cell>
              <uui-table-head-cell style="width: 0; text-align:right;"></uui-table-head-cell>
            </uui-table-head>

            ${(this._state?.availableFlags ?? []).map(
              (flag) => html`
                <uui-table-row style=${`--flag-bg:${flag.backgroundColor};--flag-icon:${flag.iconColor};`}>
                  <uui-table-cell class="icon-cell">
                    <umb-icon name=${flag.icon}></umb-icon>
                  </uui-table-cell>
                  <uui-table-cell class="name-cell">${flag.name}</uui-table-cell>
                  <uui-table-cell class="action-cell">
                    <uui-button
                      look=${activeKeys.has(flag.key) ? "primary" : "outline"}
                      color=${activeKeys.has(flag.key) ? "positive" : "default"}
                      label=${activeKeys.has(flag.key) ? "Disable" : "Enable"}
                      @click=${() => this.#toggle(flag)}
                      ?disabled=${this._loading}
                    >
                      ${activeKeys.has(flag.key) ? "Disable" : "Enable"}
                    </uui-button>
                  </uui-table-cell>
                </uui-table-row>
              `
            )}
          </uui-table>
        </div>
      </section>
    `;
  }

  static styles = [
    css`
      :host {
        position: fixed;
        inset: 0;
        display: none;
        z-index: 10000;
      }

      .backdrop {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 42, 0.45);
      }

      .panel {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 420px;
        max-width: min(420px, 100vw);
        background: var(--uui-color-surface);
        border-left: 1px solid var(--uui-color-divider);
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.16);
        display: grid;
        grid-template-rows: auto 1fr;
      }

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--uui-size-space-3);
        padding: var(--uui-size-layout-1);
        border-bottom: 1px solid var(--uui-color-divider);
      }

      .panel-title {
        font-weight: 700;
      }

      .panel-body {
        overflow: auto;
        padding: var(--uui-size-layout-1);
      }

      .intro,
      p {
        margin: 0;
      }

      .intro {
        margin-bottom: 12px;
        color: var(--uui-color-text-alt);
      }

      .icon-cell,
      .action-cell {
        width: 0;
      }

      .action-cell {
        text-align: right;
      }

      .icon-cell {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        min-width: 18px;
      }

      .icon-cell umb-icon {
        color: var(--flag-icon);
        font-size: 16px;
      }

      .name-cell {
        min-width: 0;
      }

      .error {
        color: #b42318;
        margin: 0 0 12px;
      }

      .empty-state {
        color: var(--uui-color-text-alt);
      }
    `,
  ];
}

export const ensureNodeFlagsPanel = () => {
  let panel = document.querySelector("node-flags-panel") as NodeFlagsPanelElement | null;
  if (!panel) {
    panel = document.createElement("node-flags-panel") as NodeFlagsPanelElement;
    document.body.appendChild(panel);
  }

  return panel;
};
