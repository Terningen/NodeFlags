import { html as b, css as v, property as p, state as _, customElement as g } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement as y } from "@umbraco-cms/backoffice/modal";
import { U as I } from "./node-flag-modal.token-BnVZQ6oN.js";
var C = Object.defineProperty, O = Object.getOwnPropertyDescriptor, f = (e) => {
  throw TypeError(e);
}, d = (e, o, i, u) => {
  for (var l = u > 1 ? void 0 : u ? O(o, i) : o, n = e.length - 1, s; n >= 0; n--)
    (s = e[n]) && (l = (u ? s(o, i, l) : s(l)) || l);
  return u && l && C(o, i, l), l;
}, E = (e, o, i) => o.has(e) || f("Cannot " + i), a = (e, o, i) => (E(e, o, "read from private field"), i ? i.call(e) : o.get(e)), m = (e, o, i) => o.has(e) ? f("Cannot add the same private member more than once") : o instanceof WeakSet ? o.add(e) : o.set(e, i), t, c;
const k = [
  { name: "Flag", value: "icon-flag" },
  { name: "Alert", value: "icon-alert" },
  { name: "Wand", value: "icon-wand" }
], h = () => ({
  name: "",
  icon: "icon-flag",
  iconColor: "#000000",
  backgroundColor: "#f3f4f6",
  sortOrder: 0,
  isEnabled: !0
});
let r = class extends y {
  constructor() {
    super(...arguments), this._value = h(), m(this, t, (e) => (o) => {
      const i = o.target, u = e === "isEnabled" ? i.checked : e === "sortOrder" ? Number(i.value || 0) : i.value;
      this._value = {
        ...this._value,
        [e]: u
      };
    }), m(this, c, (e) => {
      e.preventDefault();
      const o = {
        name: this._value.name.trim(),
        icon: this._value.icon?.trim() || "icon-flag",
        iconColor: this._value.iconColor,
        backgroundColor: this._value.backgroundColor,
        sortOrder: this._value.sortOrder,
        isEnabled: this._value.isEnabled
      };
      o.name && (this.value = o, this._submitModal());
    });
  }
  connectedCallback() {
    if (super.connectedCallback(), this.value) {
      this._value = this.value;
      return;
    }
    if (this.definition) {
      this._value = {
        name: this.definition.name,
        icon: this.definition.icon,
        iconColor: this.definition.iconColor,
        backgroundColor: this.definition.backgroundColor,
        sortOrder: this.definition.sortOrder,
        isEnabled: this.definition.isEnabled
      };
      return;
    }
    this._value = h();
  }
  render() {
    return b`
      <uui-dialog-layout headline=${this.data?.headline ?? "Node Flag"}>
        <uui-form>
          <form id="NodeFlagForm" @submit=${a(this, c)}>
            <uui-form-layout-item>
              <uui-label slot="label" for="name" required>Name</uui-label>
              <uui-input
                id="name"
                name="name"
                label="Name"
                .value=${this._value.name}
                @input=${a(this, t).call(this, "name")}
                required
              ></uui-input>
            </uui-form-layout-item>

            <uui-form-layout-item>
              <uui-label slot="label" for="icon">Icon</uui-label>
              <uui-select
                id="icon"
                label="Icon"
                .options=${k.map((e) => ({
      ...e,
      selected: e.value === (this._value.icon ?? "icon-flag")
    }))}
                @change=${a(this, t).call(this, "icon")}
              ></uui-select>
            </uui-form-layout-item>

            <uui-form-layout-item>
              <uui-label slot="label" for="iconColor">Icon color</uui-label>
              <uui-input
                id="iconColor"
                name="iconColor"
                type="color"
                label="Icon color"
                .value=${this._value.iconColor}
                @input=${a(this, t).call(this, "iconColor")}
              ></uui-input>
            </uui-form-layout-item>

            <uui-form-layout-item>
              <uui-label slot="label" for="backgroundColor">Background color</uui-label>
              <uui-input
                id="backgroundColor"
                name="backgroundColor"
                type="color"
                label="Background color"
                .value=${this._value.backgroundColor}
                @input=${a(this, t).call(this, "backgroundColor")}
              ></uui-input>
            </uui-form-layout-item>

            <uui-form-layout-item>
              <uui-label slot="label" for="sortOrder">Priority</uui-label>
              <uui-input
                id="sortOrder"
                name="sortOrder"
                type="number"
                label="Priority"
                .value=${String(this._value.sortOrder)}
                @input=${a(this, t).call(this, "sortOrder")}
              ></uui-input>
            </uui-form-layout-item>

            <uui-form-layout-item>
              <uui-label slot="label" for="isEnabled">Enabled</uui-label>
              <uui-toggle
                id="isEnabled"
                name="isEnabled"
                ?checked=${this._value.isEnabled}
                @change=${a(this, t).call(this, "isEnabled")}
              ></uui-toggle>
            </uui-form-layout-item>
          </form>
        </uui-form>

        <uui-button slot="actions" look="secondary" label="Cancel" @click=${this._rejectModal}></uui-button>
        <uui-button
          slot="actions"
          form="NodeFlagForm"
          type="submit"
          look="primary"
          color="positive"
          label=${this.definition ? "Save" : "Create"}
        ></uui-button>
      </uui-dialog-layout>
    `;
  }
};
t = /* @__PURE__ */ new WeakMap();
c = /* @__PURE__ */ new WeakMap();
r.styles = [
  v`
      uui-input,
      uui-select {
        width: 100%;
      }
    `
];
d([
  p({ attribute: !1 })
], r.prototype, "definition", 2);
d([
  _()
], r.prototype, "_value", 2);
r = d([
  g("node-flag-modal")
], r);
const F = r;
export {
  r as NodeFlagModalElement,
  I as UMB_NODE_FLAG_MODAL,
  F as default
};
//# sourceMappingURL=node-flag-modal.element-CbKAxESB.js.map
