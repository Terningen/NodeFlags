import { LitElement as O, html as c, css as N, state as g, customElement as D } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as M } from "@umbraco-cms/backoffice/element-api";
import { UMB_NOTIFICATION_CONTEXT as F } from "@umbraco-cms/backoffice/notification";
import { n as v } from "./node-flags-CQwlbdJU.js";
var I = Object.defineProperty, P = Object.getOwnPropertyDescriptor, E = (i) => {
  throw TypeError(i);
}, h = (i, e, t, n) => {
  for (var d = n > 1 ? void 0 : n ? P(e, t) : e, x = i.length - 1, y; x >= 0; x--)
    (y = i[x]) && (d = (n ? y(e, t, d) : y(d)) || d);
  return n && d && I(e, t, d), d;
}, C = (i, e, t) => e.has(i) || E("Cannot " + t), l = (i, e, t) => (C(i, e, "read from private field"), t ? t.call(i) : e.get(i)), p = (i, e, t) => e.has(i) ? E("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(i) : e.set(i, t), S = (i, e, t, n) => (C(i, e, "write to private field"), e.set(i, t), t), o = (i, e, t) => (C(i, e, "access private method"), t), m, a, b, w, z, s, $, k, u, _;
const W = [
  { value: "icon-flag", label: "Flag" },
  { value: "icon-alert", label: "Alert" },
  { value: "icon-wand", label: "Wand" }
], f = () => ({
  name: "Flag name",
  icon: "icon-flag",
  iconColor: "#000000",
  backgroundColor: "#f3f4f6",
  sortOrder: 0,
  isEnabled: !0
});
let r = class extends M(O) {
  constructor() {
    super(), p(this, a), this._definitions = [], this._loading = !1, this._saving = !1, this._editor = f(), this._error = "", p(this, m), p(this, w, () => {
      this._editor = f();
    }), p(this, s, (i) => (e) => {
      const t = e.target, n = i === "isEnabled" ? t.checked : i === "sortOrder" ? Number(t.value || 0) : t.value;
      this._editor = {
        ...this._editor,
        [i]: n
      };
    }), p(this, $, async () => {
      this._saving = !0, this._error = "";
      const i = {
        name: this._editor.name.trim(),
        icon: this._editor.icon?.trim() || "icon-flag",
        iconColor: this._editor.iconColor,
        backgroundColor: this._editor.backgroundColor,
        sortOrder: this._editor.sortOrder,
        isEnabled: this._editor.isEnabled
      };
      try {
        if (!i.name)
          throw new Error("A flag name is required.");
        this._editor.key ? (await v.updateDefinition(this._editor.key, i), o(this, a, u).call(this, "positive", "Node flag updated", i.name)) : (await v.createDefinition(i), o(this, a, u).call(this, "positive", "Node flag created", i.name)), this._editor = f(), await o(this, a, b).call(this);
      } catch (e) {
        this._error = o(this, a, _).call(this, e), o(this, a, u).call(this, "danger", "Unable to save node flag", this._error);
      } finally {
        this._saving = !1;
      }
    }), p(this, k, async (i) => {
      this._saving = !0;
      try {
        await v.deleteDefinition(i.key), o(this, a, u).call(this, "positive", "Node flag deleted", i.name), this._editor.key === i.key && (this._editor = f()), await o(this, a, b).call(this);
      } catch (e) {
        this._error = o(this, a, _).call(this, e), o(this, a, u).call(this, "danger", "Unable to delete node flag", this._error);
      } finally {
        this._saving = !1;
      }
    }), this.consumeContext(F, (i) => {
      S(this, m, i);
    }), o(this, a, b).call(this);
  }
  render() {
    return c`
      <div class="layout">
        <uui-box>
          <div class="box-headline">
            <span class="box-headline-title">${this._editor.key ? "Edit flag" : "Create flag"}</span>
            <uui-button
              look="primary"
              color="default"
              label="New flag"
              @click=${l(this, w)}
              ?disabled=${this._saving}
            ></uui-button>
          </div>

          <p class="intro">Create reusable flags for editors to apply in the Content tree.</p>

          <div class="form">
            <label class="field">
              <span class="field-label">Name</span>
              <input
                class="text-input"
                .value=${this._editor.name}
                @input=${l(this, s).call(this, "name")}
                placeholder="Flag name"
              />
            </label>

            <label class="field">
              <span class="field-label">Icon</span>
              <select class="text-input" .value=${this._editor.icon ?? "icon-flag"} @change=${l(this, s).call(this, "icon")}>
                ${W.map(
      (i) => c`<option value=${i.value}>${i.label}</option>`
    )}
              </select>
            </label>

            <div class="field-grid">
              <label class="field">
                <span class="field-label">Icon color</span>
                <div class="color-field">
                  <input
                    class="color-input"
                    type="color"
                    .value=${this._editor.iconColor}
                    @input=${l(this, s).call(this, "iconColor")}
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
                    @input=${l(this, s).call(this, "backgroundColor")}
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
                  @input=${l(this, s).call(this, "sortOrder")}
                />
              </label>

              <label class="toggle-field">
                <span class="field-label">Enabled</span>
                <uui-toggle
                  ?checked=${this._editor.isEnabled}
                  @change=${l(this, s).call(this, "isEnabled")}
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

          ${this._error ? c`<p class="error">${this._error}</p>` : ""}

          <div class="actions">
            <uui-button
              look="primary"
              color="positive"
              label=${this._saving ? "Saving..." : this._editor.key ? "Save changes" : "Create flag"}
              @click=${l(this, $)}
              ?disabled=${this._saving || this._loading}
            ></uui-button>
          </div>
        </uui-box>

        <uui-box headline="Existing flags">
          <p class="intro">Lower priority numbers win the visible row styling when multiple flags are active.</p>

          ${this._loading ? c`<p class="empty-state">Loading flags...</p>` : this._definitions.length === 0 ? c`<p class="empty-state">No flags created yet.</p>` : c`
                  <div class="definitions">
                    ${this._definitions.map(
      (i) => c`
                        <article
                          class="definition"
                          style=${`--flag-bg:${i.backgroundColor};--flag-icon:${i.iconColor};`}
                        >
                          <div class="definition-main">
                            <span class="preview-icon">
                              <uui-icon name=${i.icon}></uui-icon>
                            </span>
                            <strong class="definition-title">${i.name}</strong>
                            <uui-tag size="s">${i.isEnabled ? "Enabled" : "Disabled"}</uui-tag>
                            <span class="definition-priority">Priority ${i.sortOrder}</span>
                          </div>
                          <div class="definition-actions">
                            <uui-button
                              look="outline"
                              color="default"
                              label="Edit"
                              @click=${() => o(this, a, z).call(this, i)}
                              ?disabled=${this._saving}
                            ></uui-button>
                            <uui-button
                              look="outline"
                              color="danger"
                              label="Delete"
                              @click=${() => l(this, k).call(this, i)}
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
};
m = /* @__PURE__ */ new WeakMap();
a = /* @__PURE__ */ new WeakSet();
b = async function() {
  this._loading = !0, this._error = "";
  try {
    this._definitions = await v.getDefinitions();
  } catch (i) {
    this._error = o(this, a, _).call(this, i), o(this, a, u).call(this, "danger", "Unable to load node flags", this._error);
  } finally {
    this._loading = !1;
  }
};
w = /* @__PURE__ */ new WeakMap();
z = function(i) {
  this._editor = {
    key: i.key,
    name: i.name,
    icon: i.icon,
    iconColor: i.iconColor,
    backgroundColor: i.backgroundColor,
    sortOrder: i.sortOrder,
    isEnabled: i.isEnabled
  };
};
s = /* @__PURE__ */ new WeakMap();
$ = /* @__PURE__ */ new WeakMap();
k = /* @__PURE__ */ new WeakMap();
u = function(i, e, t) {
  l(this, m)?.peek(i, {
    data: {
      headline: e,
      message: t
    }
  });
};
_ = function(i) {
  if (typeof i == "string")
    return i;
  if (i && typeof i == "object") {
    const e = i;
    return e.detail ?? e.message ?? "Unknown error";
  }
  return "Unknown error";
};
r.styles = [
  N`
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
    `
];
h([
  g()
], r.prototype, "_definitions", 2);
h([
  g()
], r.prototype, "_loading", 2);
h([
  g()
], r.prototype, "_saving", 2);
h([
  g()
], r.prototype, "_editor", 2);
h([
  g()
], r.prototype, "_error", 2);
r = h([
  D("node-flags-dashboard")
], r);
const j = r;
export {
  r as NodeFlagsDashboardElement,
  j as default
};
//# sourceMappingURL=node-flags-dashboard.element-1bmyONLC.js.map
