export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Node Flags Dashboard",
    alias: "NodeFlags.Dashboard",
    type: "dashboard",
    js: () => import("./node-flags-dashboard.element.js"),
    weight: 100,
    meta: {
      label: "Node Flags",
      pathname: "node-flags",
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Settings",
      },
    ],
  },
  {
    type: "modal",
    alias: "NodeFlags.Modal.NodeFlag",
    name: "Node Flag Modal",
    element: () => import("./node-flag-modal.element.js"),
  },
];
