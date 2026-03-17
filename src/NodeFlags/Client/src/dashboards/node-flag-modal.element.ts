import { css, html, customElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import type {
  NodeFlagDefinition,
  NodeFlagDefinitionSaveModel,
} from "../api/node-flags.js";
import { UMB_NODE_FLAG_MODAL, type NodeFlagModalData } from "./node-flag-modal.token.js";

const ICON_OPTIONS = [
  { name: "Flag", value: "icon-flag" },
  { name: "Alert", value: "icon-alert" },
  { name: "Wand", value: "icon-wand" },
] as const;

const createDefaultValue = (): NodeFlagDefinitionSaveModel => ({
  name: "",
  icon: "icon-flag",
  iconColor: "#000000",
  backgroundColor: "#f3f4f6",
  sortOrder: 0,
  isEnabled: true,
});

@customElement("node-flag-modal")
export class NodeFlagModalElement extends UmbModalBaseElement<
  NodeFlagModalData,
  NodeFlagDefinitionSaveModel
> {
  @property({ attribute: false })
  definition?: NodeFlagDefinition;

  @state()
  private _value: NodeFlagDefinitionSaveModel = createDefaultValue();

  connectedCallback() {
    super.connectedCallback();

    if (this.value) {
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
        isEnabled: this.definition.isEnabled,
      };
      return;
    }

    this._value = createDefaultValue();
  }

  #onInput =
    (field: keyof NodeFlagDefinitionSaveModel) =>
    (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLSelectElement;
      const value =
        field === "isEnabled"
          ? (target as HTMLInputElement).checked
          : field === "sortOrder"
            ? Number(target.value || 0)
            : target.value;

      this._value = {
        ...this._value,
        [field]: value,
      };
    };

  #onSubmit = (event: Event) => {
    event.preventDefault();

    const payload: NodeFlagDefinitionSaveModel = {
      name: this._value.name.trim(),
      icon: this._value.icon?.trim() || "icon-flag",
      iconColor: this._value.iconColor,
      backgroundColor: this._value.backgroundColor,
      sortOrder: this._value.sortOrder,
      isEnabled: this._value.isEnabled,
    };

    if (!payload.name) {
      return;
    }

    this.value = payload;
    this._submitModal();
  };

  render() {
    return html`
      <uui-dialog-layout headline=${this.data?.headline ?? "Node Flag"}>
        <uui-form>
          <form id="NodeFlagForm" @submit=${this.#onSubmit}>
            <uui-form-layout-item>
              <uui-label slot="label" for="name" required>Name</uui-label>
              <uui-input
                id="name"
                name="name"
                label="Name"
                .value=${this._value.name}
                @input=${this.#onInput("name")}
                required
              ></uui-input>
            </uui-form-layout-item>

            <uui-form-layout-item>
              <uui-label slot="label" for="icon">Icon</uui-label>
              <uui-select
                id="icon"
                label="Icon"
                .options=${ICON_OPTIONS.map((option) => ({
                  ...option,
                  selected: option.value === (this._value.icon ?? "icon-flag"),
                }))}
                @change=${this.#onInput("icon")}
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
                @input=${this.#onInput("iconColor")}
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
                @input=${this.#onInput("backgroundColor")}
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
                @input=${this.#onInput("sortOrder")}
              ></uui-input>
            </uui-form-layout-item>

            <uui-form-layout-item>
              <uui-label slot="label" for="isEnabled">Enabled</uui-label>
              <uui-toggle
                id="isEnabled"
                name="isEnabled"
                ?checked=${this._value.isEnabled}
                @change=${this.#onInput("isEnabled")}
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

  static styles = [
    css`
      uui-input,
      uui-select {
        width: 100%;
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    "node-flag-modal": NodeFlagModalElement;
  }
}

export default NodeFlagModalElement;
export { UMB_NODE_FLAG_MODAL };
