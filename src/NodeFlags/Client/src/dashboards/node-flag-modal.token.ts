import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import type { NodeFlagDefinitionSaveModel } from "../api/node-flags.js";

export type NodeFlagModalData = {
  headline: string;
};

export type NodeFlagModalValue = NodeFlagDefinitionSaveModel;

export const UMB_NODE_FLAG_MODAL = new UmbModalToken<NodeFlagModalData, NodeFlagModalValue>(
  "NodeFlags.Modal.NodeFlag",
  {
    modal: {
      type: "sidebar",
      size: "small",
    },
  }
);
