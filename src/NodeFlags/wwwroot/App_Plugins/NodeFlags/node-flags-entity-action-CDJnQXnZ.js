import { UmbEntityActionBase as $ } from "@umbraco-cms/backoffice/entity-action";
import { css as I, state as h, customElement as F, LitElement as E, html as u } from "@umbraco-cms/backoffice/external/lit";
import { n as l } from "./node-flags-CQwlbdJU.js";
var N = Object.defineProperty, k = Object.getOwnPropertyDescriptor, m = (t) => {
  throw TypeError(t);
}, r = (t, e, n, c) => {
  for (var o = c > 1 ? void 0 : c ? k(e, n) : e, p = t.length - 1, f; p >= 0; p--)
    (f = t[p]) && (o = (c ? f(e, n, o) : f(o)) || o);
  return c && o && N(e, n, o), o;
}, C = (t, e, n) => e.has(t) || m("Cannot " + n), P = (t, e, n) => e.has(t) ? m("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), a = (t, e, n) => (C(t, e, "access private method"), n), i, y, v, w, x, g, _, d, b;
let s = class extends E {
  constructor() {
    super(...arguments), P(this, i), this._contentIdentifier = "", this._loading = !1, this._error = "";
  }
  open(t) {
    this._contentIdentifier = t, this.style.display = "block", a(this, i, y).call(this);
  }
  close() {
    this.style.display = "none", this._error = "";
  }
  render() {
    const t = new Set(this._state?.activeFlags.map((e) => e.flagKey) ?? []);
    return u`
      <div class="backdrop" @click=${() => this.close()}></div>
      <section class="panel">
        <header class="panel-header">
          <div class="panel-title">Node Flags</div>
          <uui-button look="outline" color="default" label="Close" @click=${() => this.close()}></uui-button>
        </header>

        <div class="panel-body">
          <p class="intro">Toggle one or more flags for this content node.</p>

          ${this._loading && !this._state ? u`<p class="empty-state">Loading…</p>` : ""}
          ${this._error ? u`<p class="error">${this._error}</p>` : ""}

          <uui-table>
            <uui-table-head>
              <uui-table-head-cell style="text-align:center; width: 0;"></uui-table-head-cell>
              <uui-table-head-cell>Name</uui-table-head-cell>
              <uui-table-head-cell style="width: 0; text-align:right;"></uui-table-head-cell>
            </uui-table-head>

            ${(this._state?.availableFlags ?? []).map(
      (e) => u`
                <uui-table-row style=${`--flag-bg:${e.backgroundColor};--flag-icon:${e.iconColor};`}>
                  <uui-table-cell class="icon-cell">
                    <umb-icon name=${e.icon}></umb-icon>
                  </uui-table-cell>
                  <uui-table-cell class="name-cell">${e.name}</uui-table-cell>
                  <uui-table-cell class="action-cell">
                    <uui-button
                      look=${t.has(e.key) ? "primary" : "outline"}
                      color=${t.has(e.key) ? "positive" : "default"}
                      label=${t.has(e.key) ? "Disable" : "Enable"}
                      @click=${() => a(this, i, v).call(this, e)}
                      ?disabled=${this._loading}
                    >
                      ${t.has(e.key) ? "Disable" : "Enable"}
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
};
i = /* @__PURE__ */ new WeakSet();
y = async function() {
  this._loading = !0, this._error = "";
  try {
    this._state = await a(this, i, w).call(this);
  } catch (t) {
    this._error = a(this, i, b).call(this, t, "Unable to load flags.");
  } finally {
    this._loading = !1;
  }
};
v = async function(t) {
  this._loading = !0;
  try {
    const e = await a(this, i, x).call(this, t.key);
    this._state = e.state, window.dispatchEvent(
      new CustomEvent("node-flags-changed", {
        detail: { contentKey: this._contentIdentifier }
      })
    );
  } catch (e) {
    this._error = a(this, i, b).call(this, e, "Unable to toggle flag.");
  } finally {
    this._loading = !1;
  }
};
w = async function() {
  if (a(this, i, g).call(this, this._contentIdentifier))
    return l.getNodeFlagsByKey(this._contentIdentifier);
  if (a(this, i, _).call(this, this._contentIdentifier))
    return l.getNodeFlags(Number(this._contentIdentifier));
  try {
    return await l.getNodeFlagsByKey(this._contentIdentifier);
  } catch {
    if (a(this, i, d).call(this, this._contentIdentifier) !== null)
      return l.getNodeFlags(a(this, i, d).call(this, this._contentIdentifier));
    throw new Error(`Unsupported content identifier: ${this._contentIdentifier}`);
  }
};
x = async function(t) {
  if (a(this, i, g).call(this, this._contentIdentifier))
    return l.toggleFlagByKey(this._contentIdentifier, t);
  if (a(this, i, _).call(this, this._contentIdentifier))
    return l.toggleFlag(Number(this._contentIdentifier), t);
  const e = a(this, i, d).call(this, this._contentIdentifier);
  return e !== null ? l.toggleFlag(e, t) : l.toggleFlagByKey(this._contentIdentifier, t);
};
g = function(t) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(t);
};
_ = function(t) {
  return /^\d+$/.test(t);
};
d = function(t) {
  const e = t.match(/\d+/);
  return e ? Number(e[0]) : null;
};
b = function(t, e) {
  if (typeof t == "string")
    return t;
  if (t && typeof t == "object") {
    const n = t;
    return n.detail ?? n.message ?? n.error?.detail ?? n.error?.message ?? e;
  }
  return e;
};
s.styles = [
  I`
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
    `
];
r([
  h()
], s.prototype, "_contentIdentifier", 2);
r([
  h()
], s.prototype, "_state", 2);
r([
  h()
], s.prototype, "_loading", 2);
r([
  h()
], s.prototype, "_error", 2);
s = r([
  F("node-flags-panel")
], s);
const S = () => {
  let t = document.querySelector("node-flags-panel");
  return t || (t = document.createElement("node-flags-panel"), document.body.appendChild(t)), t;
};
class A extends $ {
  async execute() {
    if (!this.args.unique)
      throw new Error("Unable to determine the selected content item.");
    S().open(this.args.unique);
  }
}
export {
  A as NodeFlagsEntityAction,
  A as api
};
//# sourceMappingURL=node-flags-entity-action-CDJnQXnZ.js.map
