import { client } from "./client.gen.js";

export type NodeFlagDefinition = {
  key: string;
  name: string;
  icon: string;
  iconColor: string;
  backgroundColor: string;
  sortOrder: number;
  isEnabled: boolean;
  createdUtc: string;
  updatedUtc: string;
};

export type NodeFlagDefinitionSaveModel = {
  name: string;
  icon?: string | null;
  iconColor: string;
  backgroundColor: string;
  sortOrder: number;
  isEnabled: boolean;
};

export type NodeFlagAssignment = {
  nodeId: number;
  flagKey: string;
  name: string;
  icon: string;
  iconColor: string;
  backgroundColor: string;
  sortOrder: number;
  assignedUtc: string;
};

export type NodeFlagsForNode = {
  nodeId: number;
  availableFlags: Array<NodeFlagDefinition>;
  activeFlags: Array<NodeFlagAssignment>;
  effectiveFlag?: NodeFlagAssignment | null;
};

export type NodeFlagToggleResult = {
  nodeId: number;
  flagKey: string;
  isActive: boolean;
  state: NodeFlagsForNode;
};

async function unwrap<T>(promise: Promise<{ data?: unknown; error?: unknown }>): Promise<T> {
  const { data, error } = await promise;
  if (error) {
    throw error;
  }

  return data as T;
}

export const nodeFlagsApi = {
  getDefinitions() {
    return unwrap<Array<NodeFlagDefinition>>(
      client.get({
        url: "/umbraco/nodeflags/api/v1/definitions",
        security: [{ scheme: "bearer", type: "http" }],
      })
    );
  },

  createDefinition(model: NodeFlagDefinitionSaveModel) {
    return unwrap<NodeFlagDefinition>(
      client.post({
        url: "/umbraco/nodeflags/api/v1/definitions",
        body: model,
        security: [{ scheme: "bearer", type: "http" }],
      })
    );
  },

  updateDefinition(key: string, model: NodeFlagDefinitionSaveModel) {
    return unwrap<NodeFlagDefinition>(
      client.put({
        url: `/umbraco/nodeflags/api/v1/definitions/${key}`,
        body: model,
        security: [{ scheme: "bearer", type: "http" }],
      })
    );
  },

  deleteDefinition(key: string) {
    return unwrap<void>(
      client.delete({
        url: `/umbraco/nodeflags/api/v1/definitions/${key}`,
        security: [{ scheme: "bearer", type: "http" }],
      })
    );
  },

  getNodeFlags(nodeId: number) {
    return unwrap<NodeFlagsForNode>(
      client.get({
        url: `/umbraco/nodeflags/api/v1/nodes/${nodeId}/flags`,
        security: [{ scheme: "bearer", type: "http" }],
      })
    );
  },

  getNodeFlagsByKey(contentKey: string) {
    return unwrap<NodeFlagsForNode>(
      client.get({
        url: `/umbraco/nodeflags/api/v1/nodes/by-key/${contentKey}/flags`,
        security: [{ scheme: "bearer", type: "http" }],
      })
    );
  },

  toggleFlag(nodeId: number, flagKey: string) {
    return unwrap<NodeFlagToggleResult>(
      client.post({
        url: `/umbraco/nodeflags/api/v1/nodes/${nodeId}/flags/${flagKey}/toggle`,
        security: [{ scheme: "bearer", type: "http" }],
      })
    );
  },

  toggleFlagByKey(contentKey: string, flagKey: string) {
    return unwrap<NodeFlagToggleResult>(
      client.post({
        url: `/umbraco/nodeflags/api/v1/nodes/by-key/${contentKey}/flags/${flagKey}/toggle`,
        security: [{ scheme: "bearer", type: "http" }],
      })
    );
  },

  getManyNodeFlags(nodeIds: Array<number>) {
    const params = new URLSearchParams();
    nodeIds.forEach((nodeId) => params.append("nodeIds", nodeId.toString()));
    const query = params.toString();

    return unwrap<Array<NodeFlagsForNode>>(
      client.get({
        url: `/umbraco/nodeflags/api/v1/nodes/flags${query ? `?${query}` : ""}`,
        security: [{ scheme: "bearer", type: "http" }],
      })
    );
  },

  getManyNodeFlagsByKey(contentKeys: Array<string>) {
    const params = new URLSearchParams();
    contentKeys.forEach((contentKey) => params.append("contentKeys", contentKey));
    const query = params.toString();

    return unwrap<Array<NodeFlagsForNode>>(
      client.get({
        url: `/umbraco/nodeflags/api/v1/nodes/by-key/flags${query ? `?${query}` : ""}`,
        security: [{ scheme: "bearer", type: "http" }],
      })
    );
  },
};
