import { UmbEntityActionBase as I } from "@umbraco-cms/backoffice/entity-action";
import { css as $, state as u, customElement as F, LitElement as E, html as d } from "@umbraco-cms/backoffice/external/lit";
import { n as a } from "./node-flags-CQwlbdJU.js";
var N = Object.defineProperty, k = Object.getOwnPropertyDescriptor, y = (t) => {
  throw TypeError(t);
}, l = (t, e, n, c) => {
  for (var s = c > 1 ? void 0 : c ? k(e, n) : e, g = t.length - 1, p; g >= 0; g--)
    (p = t[g]) && (s = (c ? p(e, n, s) : p(s)) || s);
  return c && s && N(e, n, s), s;
}, C = (t, e, n) => e.has(t) || y("Cannot " + n), P = (t, e, n) => e.has(t) ? y("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), o = (t, e, n) => (C(t, e, "access private method"), n), i, v, b, x, w, f, _, h, m;
let r = class extends E {
  constructor() {
    super(...arguments), P(this, i), this._contentIdentifier = "", this._loading = !1, this._error = "";
  }
  open(t) {
    this._contentIdentifier = t, this.style.display = "block", o(this, i, v).call(this);
  }
  close() {
    this.style.display = "none", this._error = "";
  }
  render() {
    const t = new Set(this._state?.activeFlags.map((e) => e.flagKey) ?? []);
    return d`
      <div class="backdrop" @click=${() => this.close()}></div>
      <uui-box class="panel" headline="Node Flags">
        <div slot="header">
          <uui-button look="outline" color="default" label="Close" @click=${() => this.close()}></uui-button>
        </div>

        <p class="intro">Toggle one or more flags for this content node.</p>

        ${this._loading && !this._state ? d`<p class="empty-state">Loading…</p>` : ""}
        ${this._error ? d`<p class="error">${this._error}</p>` : ""}

        <div class="flags">
          ${(this._state?.availableFlags ?? []).map(
      (e) => d`
              <button
                class=${t.has(e.key) ? "flag active" : "flag"}
                style=${`--flag-bg:${e.backgroundColor};--flag-icon:${e.iconColor};`}
                @click=${() => o(this, i, b).call(this, e)}
                ?disabled=${this._loading}
              >
                <span class="icon">
                  <uui-icon name=${e.icon}></uui-icon>
                </span>
                <span class="name">${e.name}</span>
                <uui-tag size="s">${t.has(e.key) ? "Enabled" : "Disabled"}</uui-tag>
              </button>
            `
    )}
        </div>
      </uui-box>
    `;
  }
};
i = /* @__PURE__ */ new WeakSet();
v = async function() {
  this._loading = !0, this._error = "";
  try {
    this._state = await o(this, i, x).call(this);
  } catch (t) {
    this._error = o(this, i, m).call(this, t, "Unable to load flags.");
  } finally {
    this._loading = !1;
  }
};
b = async function(t) {
  this._loading = !0;
  try {
    const e = await o(this, i, w).call(this, t.key);
    this._state = e.state, window.dispatchEvent(
      new CustomEvent("node-flags-changed", {
        detail: { contentKey: this._contentIdentifier }
      })
    );
  } catch (e) {
    this._error = o(this, i, m).call(this, e, "Unable to toggle flag.");
  } finally {
    this._loading = !1;
  }
};
x = async function() {
  if (o(this, i, f).call(this, this._contentIdentifier))
    return a.getNodeFlagsByKey(this._contentIdentifier);
  if (o(this, i, _).call(this, this._contentIdentifier))
    return a.getNodeFlags(Number(this._contentIdentifier));
  try {
    return await a.getNodeFlagsByKey(this._contentIdentifier);
  } catch {
    if (o(this, i, h).call(this, this._contentIdentifier) !== null)
      return a.getNodeFlags(o(this, i, h).call(this, this._contentIdentifier));
    throw new Error(`Unsupported content identifier: ${this._contentIdentifier}`);
  }
};
w = async function(t) {
  if (o(this, i, f).call(this, this._contentIdentifier))
    return a.toggleFlagByKey(this._contentIdentifier, t);
  if (o(this, i, _).call(this, this._contentIdentifier))
    return a.toggleFlag(Number(this._contentIdentifier), t);
  const e = o(this, i, h).call(this, this._contentIdentifier);
  return e !== null ? a.toggleFlag(e, t) : a.toggleFlagByKey(this._contentIdentifier, t);
};
f = function(t) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(t);
};
_ = function(t) {
  return /^\d+$/.test(t);
};
h = function(t) {
  const e = t.match(/\d+/);
  return e ? Number(e[0]) : null;
};
m = function(t, e) {
  if (typeof t == "string")
    return t;
  if (t && typeof t == "object") {
    const n = t;
    return n.detail ?? n.message ?? n.error?.detail ?? n.error?.message ?? e;
  }
  return e;
};
r.styles = [
  $`
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
        right: 24px;
        top: 24px;
        width: 360px;
        max-width: calc(100vw - 48px);
        max-height: calc(100vh - 48px);
        overflow: auto;
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.16);
      }

      .intro,
      p {
        margin: 0;
      }

      .intro {
        margin-bottom: 12px;
        color: var(--uui-color-text-alt);
      }

      .flags {
        display: grid;
        gap: 8px;
      }

      .flag {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 8px;
        width: 100%;
        text-align: left;
        border-radius: var(--uui-border-radius);
        border: 1px solid var(--uui-color-divider);
        background: color-mix(in srgb, var(--flag-bg) 14%, var(--uui-color-surface));
        padding: 10px 12px;
        cursor: pointer;
        font: inherit;
      }

      .flag.active {
        border-color: color-mix(in srgb, var(--flag-bg) 35%, var(--uui-color-divider-emphasis));
        background: color-mix(in srgb, var(--flag-bg) 24%, var(--uui-color-surface));
      }

      .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        min-width: 18px;
      }

      .icon uui-icon {
        color: var(--flag-icon);
        font-size: 16px;
      }

      .name {
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
l([
  u()
], r.prototype, "_contentIdentifier", 2);
l([
  u()
], r.prototype, "_state", 2);
l([
  u()
], r.prototype, "_loading", 2);
l([
  u()
], r.prototype, "_error", 2);
r = l([
  F("node-flags-panel")
], r);
const S = () => {
  let t = document.querySelector("node-flags-panel");
  return t || (t = document.createElement("node-flags-panel"), document.body.appendChild(t)), t;
};
class K extends I {
  async execute() {
    if (!this.args.unique)
      throw new Error("Unable to determine the selected content item.");
    S().open(this.args.unique);
  }
}
export {
  K as NodeFlagsEntityAction,
  K as api
};
//# sourceMappingURL=node-flags-entity-action-C3O8ERVt.js.map
