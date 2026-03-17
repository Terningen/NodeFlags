import { UmbEntityActionBase } from "@umbraco-cms/backoffice/entity-action";
import { ensureNodeFlagsPanel } from "./node-flags-panel.element.js";

type EntityActionArgs = {
  unique: string;
};

export class NodeFlagsEntityAction extends UmbEntityActionBase<EntityActionArgs> {
  override async execute() {
    if (!this.args.unique) {
      throw new Error("Unable to determine the selected content item.");
    }

    const panel = ensureNodeFlagsPanel();
    panel.open(this.args.unique);
  }
}

export { NodeFlagsEntityAction as api };
