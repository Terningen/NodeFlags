import { LitElement as O, html as u, css as N, state as b, customElement as z } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as M } from "@umbraco-cms/backoffice/element-api";
import { umbOpenModal as x, umbConfirmModal as U } from "@umbraco-cms/backoffice/modal";
import { UMB_NOTIFICATION_CONTEXT as A } from "@umbraco-cms/backoffice/notification";
import { n as d } from "./node-flags-CQwlbdJU.js";
import { U as C } from "./node-flag-modal.token-BnVZQ6oN.js";
var F = Object.defineProperty, L = Object.getOwnPropertyDescriptor, $ = (e) => {
  throw TypeError(e);
}, c = (e, t, l, n) => {
  for (var s = n > 1 ? void 0 : n ? L(t, l) : t, g = e.length - 1, p; g >= 0; g--)
    (p = e[g]) && (s = (n ? p(t, l, s) : p(s)) || s);
  return n && s && F(t, l, s), s;
}, v = (e, t, l) => t.has(e) || $("Cannot " + l), P = (e, t, l) => (v(e, t, "read from private field"), t.get(e)), y = (e, t, l) => t.has(e) ? $("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, l), T = (e, t, l, n) => (v(e, t, "write to private field"), t.set(e, l), l), i = (e, t, l) => (v(e, t, "access private method"), l), h, a, f, E, _, w, k, r, m, D;
let o = class extends M(O) {
  constructor() {
    super(), y(this, a), this._definitions = [], this._loading = !1, this._saving = !1, this._error = "", y(this, h), this.consumeContext(A, (e) => {
      T(this, h, e);
    }), i(this, a, f).call(this);
  }
  render() {
    return u`
      <uui-box>
        <umb-collection-toolbar slot="header">
          <uui-button
            look="outline"
            color="default"
            label="Create"
            @click=${i(this, a, E)}
            ?disabled=${this._saving}
          >
            Create
            <uui-symbol-expand></uui-symbol-expand>
          </uui-button>
        </umb-collection-toolbar>
        ${this._error ? u`<p class="error">${this._error}</p>` : ""}
        <uui-table class="definitions-table">
          <uui-table-head>
            <uui-table-head-cell class="icon-column"></uui-table-head-cell>
            <uui-table-head-cell class="name-column">Name</uui-table-head-cell>
            <uui-table-head-cell class="status-column">Status</uui-table-head-cell>
            <uui-table-head-cell class="priority-column">Priority</uui-table-head-cell>
            <uui-table-head-cell class="actions-column"></uui-table-head-cell>
          </uui-table-head>
          ${i(this, a, D).call(this)}
        </uui-table>
      </uui-box>
    `;
  }
};
h = /* @__PURE__ */ new WeakMap();
a = /* @__PURE__ */ new WeakSet();
f = async function() {
  this._loading = !0, this._error = "";
  try {
    this._definitions = await d.getDefinitions();
  } catch (e) {
    this._error = i(this, a, m).call(this, e), i(this, a, r).call(this, "danger", "Unable to load node flags", this._error);
  } finally {
    this._loading = !1;
  }
};
E = async function() {
  const e = await x(this, C, {
    data: { headline: "Create flag" },
    value: {
      name: "",
      icon: "icon-flag",
      iconColor: "#000000",
      backgroundColor: "#f3f4f6",
      sortOrder: 0,
      isEnabled: !0
    }
  }).catch(() => {
  });
  e && await i(this, a, w).call(this, e);
};
_ = async function(e) {
  const t = await x(this, C, {
    data: { headline: "Edit flag" },
    value: {
      name: e.name,
      icon: e.icon,
      iconColor: e.iconColor,
      backgroundColor: e.backgroundColor,
      sortOrder: e.sortOrder,
      isEnabled: e.isEnabled
    }
  }).catch(() => {
  });
  t && await i(this, a, w).call(this, t, e.key);
};
w = async function(e, t) {
  this._saving = !0, this._error = "";
  try {
    if (!e.name?.trim())
      throw new Error("A flag name is required.");
    t ? (await d.updateDefinition(t, e), i(this, a, r).call(this, "positive", "Node flag updated", e.name)) : (await d.createDefinition(e), i(this, a, r).call(this, "positive", "Node flag created", e.name)), await i(this, a, f).call(this);
  } catch (l) {
    this._error = i(this, a, m).call(this, l), i(this, a, r).call(this, "danger", "Unable to save node flag", this._error);
  } finally {
    this._saving = !1;
  }
};
k = async function(e) {
  if (await U(this, {
    color: "danger",
    headline: `Delete ${e.name}`,
    content: `Are you sure you want to delete ${e.name}?`,
    confirmLabel: "Delete"
  }).then(() => !0).catch(() => !1)) {
    this._saving = !0;
    try {
      await d.deleteDefinition(e.key), i(this, a, r).call(this, "positive", "Node flag deleted", e.name), await i(this, a, f).call(this);
    } catch (l) {
      this._error = i(this, a, m).call(this, l), i(this, a, r).call(this, "danger", "Unable to delete node flag", this._error);
    } finally {
      this._saving = !1;
    }
  }
};
r = function(e, t, l) {
  P(this, h)?.peek(e, {
    data: {
      headline: t,
      message: l
    }
  });
};
m = function(e) {
  if (typeof e == "string")
    return e;
  if (e && typeof e == "object") {
    const t = e;
    return t.detail ?? t.message ?? "Unknown error";
  }
  return "Unknown error";
};
D = function() {
  return this._loading ? u`
        <uui-table-row>
          <uui-table-cell colspan="5" style="padding: 16px 20px;">Loading flags...</uui-table-cell>
        </uui-table-row>
      ` : this._definitions.length === 0 ? u`
        <uui-table-row>
          <uui-table-cell colspan="5" style="padding: 16px 20px;">No flags created yet.</uui-table-cell>
        </uui-table-row>
      ` : this._definitions.map(
    (e) => u`
      <umb-table>
      
      
      
      </umb-table>
        <uui-table-row class="definition-row">
          <uui-table-cell role="cell" class="icon-column">
            <umb-icon name=${e.icon} style=${`color:${e.iconColor}`}></umb-icon>
          </uui-table-cell>
          <uui-table-cell role="cell" class="name-column">
            <uui-button
              look="default"
              color="default"
              label=${e.name}
              @click=${() => i(this, a, _).call(this, e)}
              ?disabled=${this._saving}
            >
              ${e.name}
            </uui-button>
          </uui-table-cell>
          <uui-table-cell role="cell" class="status-column">
            <uui-tag size="s">${e.isEnabled ? "Enabled" : "Disabled"}</uui-tag>
          </uui-table-cell>
          <uui-table-cell role="cell" class="priority-column">${e.sortOrder}</uui-table-cell>
          <uui-table-cell role="cell" class="actions-column">
            <div class="row-actions">
              <uui-button
                compact
                look="outline"
                color="default"
                label="Edit"
                @click=${() => i(this, a, _).call(this, e)}
                ?disabled=${this._saving}
              ></uui-button>
              <uui-button
                compact
                look="outline"
                color="danger"
                label="Delete"
                @click=${() => i(this, a, k).call(this, e)}
                ?disabled=${this._saving}
              ></uui-button>
            </div>
          </uui-table-cell>
        </uui-table-row>
      `
  );
};
o.styles = [
  N`
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
    `
];
c([
  b()
], o.prototype, "_definitions", 2);
c([
  b()
], o.prototype, "_loading", 2);
c([
  b()
], o.prototype, "_saving", 2);
c([
  b()
], o.prototype, "_error", 2);
o = c([
  z("node-flags-dashboard")
], o);
const R = o;
export {
  o as NodeFlagsDashboardElement,
  R as default
};
//# sourceMappingURL=node-flags-dashboard.element-B8nvYPcn.js.map
