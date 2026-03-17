import { UMB_DOCUMENT_ENTITY_TYPE as t } from "@umbraco-cms/backoffice/document";
const a = [
  {
    name: "Node Flags Entrypoint",
    alias: "NodeFlags.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-CJ3bi_k7.js")
  }
], o = [
  {
    type: "entityAction",
    kind: "default",
    alias: "NodeFlags.EntityAction.Document.Flags",
    name: "Node Flags Document Action",
    api: () => import("./node-flags-entity-action-C3O8ERVt.js"),
    forEntityTypes: [t],
    weight: 250,
    meta: {
      label: "Flags",
      icon: "icon-flag"
    }
  }
], n = [
  {
    name: "Node Flags Dashboard",
    alias: "NodeFlags.Dashboard",
    type: "dashboard",
    js: () => import("./node-flags-dashboard.element-1bmyONLC.js"),
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
  }
], e = [
  ...a,
  ...o,
  ...n
];
export {
  e as manifests
};
//# sourceMappingURL=node-flags.js.map
