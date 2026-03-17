import type {
  UmbEntryPointOnInit,
  UmbEntryPointOnUnload,
} from "@umbraco-cms/backoffice/extension-api";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import "../styles/tailwind.css";
import { client } from "../api/client.gen.js";
import { startNodeFlagsTreeDecorator } from "../content/tree-decorator.js";

let stopTreeDecorator: (() => void) | undefined;

export const onInit: UmbEntryPointOnInit = (_host, _extensionRegistry) => {
  _host.consumeContext(UMB_AUTH_CONTEXT, async (authContext) => {
    const config = authContext?.getOpenApiConfiguration();

    client.setConfig({
      auth: config?.token ?? undefined,
      baseUrl: config?.base ?? "",
      credentials: config?.credentials ?? "same-origin",
    });

    stopTreeDecorator?.();
    stopTreeDecorator = startNodeFlagsTreeDecorator();
  });
};

export const onUnload: UmbEntryPointOnUnload = (_host, _extensionRegistry) => {
  stopTreeDecorator?.();
  stopTreeDecorator = undefined;
};
