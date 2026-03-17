import { UMB_DOCUMENT_ENTITY_TYPE as a } from "@umbraco-cms/backoffice/document";
const t = [
  {
    name: "Node Flags Entrypoint",
    alias: "NodeFlags.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-CCICCTbP.js")
  }
], o = [
  {
    type: "entityAction",
    kind: "default",
    alias: "NodeFlags.EntityAction.Document.Flags",
    name: "Node Flags Document Action",
    api: () => import("./node-flags-entity-action-CDJnQXnZ.js"),
    forEntityTypes: [a],
    weight: 250,
    meta: {
      label: "Flags",
      icon: "icon-flag"
    }
  }
], e = [
  {
    name: "Node Flags Dashboard",
    alias: "NodeFlags.Dashboard",
    type: "dashboard",
    js: () => import("./node-flags-dashboard.element-B8nvYPcn.js"),
    weight: 100,
    meta: {
      label: "Node Flags",
      pathname: "node-flags"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Settings"
      }
    ]
  },
  {
    type: "modal",
    alias: "NodeFlags.Modal.NodeFlag",
    name: "Node Flag Modal",
    element: () => import("./node-flag-modal.element-CbKAxESB.js")
  }
], i = [
  ...t,
  ...o,
  ...e
];
export {
  i as manifests
};
//# sourceMappingURL=node-flags.js.map
