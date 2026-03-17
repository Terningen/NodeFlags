using NodeFlags.Models;

namespace NodeFlags.Services
{
    public interface INodeFlagService
    {
        Task<IReadOnlyCollection<NodeFlagDefinitionModel>> GetDefinitionsAsync(CancellationToken cancellationToken = default);
        Task<NodeFlagDefinitionModel?> GetDefinitionAsync(Guid key, CancellationToken cancellationToken = default);
        Task<NodeFlagDefinitionModel> CreateDefinitionAsync(NodeFlagDefinitionSaveModel model, CancellationToken cancellationToken = default);
        Task<NodeFlagDefinitionModel?> UpdateDefinitionAsync(Guid key, NodeFlagDefinitionSaveModel model, CancellationToken cancellationToken = default);
        Task<bool> DeleteDefinitionAsync(Guid key, CancellationToken cancellationToken = default);
        Task<NodeFlagsForNodeModel> GetNodeFlagsAsync(int nodeId, CancellationToken cancellationToken = default);
        Task<NodeFlagsForNodeModel> GetNodeFlagsByKeyAsync(Guid contentKey, CancellationToken cancellationToken = default);
        Task<IReadOnlyCollection<NodeFlagsForNodeModel>> GetNodeFlagsAsync(IEnumerable<int> nodeIds, CancellationToken cancellationToken = default);
        Task<IReadOnlyCollection<NodeFlagsForNodeModel>> GetNodeFlagsByKeyAsync(IEnumerable<Guid> contentKeys, CancellationToken cancellationToken = default);
        Task<NodeFlagToggleResultModel> ToggleFlagAsync(int nodeId, Guid flagKey, CancellationToken cancellationToken = default);
        Task<NodeFlagToggleResultModel> ToggleFlagByKeyAsync(Guid contentKey, Guid flagKey, CancellationToken cancellationToken = default);
    }
}
