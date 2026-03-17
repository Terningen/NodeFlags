export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Node Flags Entrypoint",
    alias: "NodeFlags.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
