import { UMB_DOCUMENT_ENTITY_TYPE } from "@umbraco-cms/backoffice/document";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "entityAction",
    kind: "default",
    alias: "NodeFlags.EntityAction.Document.Flags",
    name: "Node Flags Document Action",
    api: () => import("./node-flags-entity-action.js"),
    forEntityTypes: [UMB_DOCUMENT_ENTITY_TYPE],
    weight: 250,
    meta: {
      label: "Flags",
      icon: "icon-flag",
    },
  },
];
