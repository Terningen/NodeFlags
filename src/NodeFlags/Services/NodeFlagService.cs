using Microsoft.Extensions.Logging;
using NodeFlags.Models;
using NodeFlags.Persistence;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Infrastructure.Scoping;

namespace NodeFlags.Services
{
    public class NodeFlagService : INodeFlagService
    {
        private readonly IScopeProvider _scopeProvider;
        private readonly IContentService _contentService;
        private readonly ILogger<NodeFlagService> _logger;

        public NodeFlagService(IScopeProvider scopeProvider, IContentService contentService, ILogger<NodeFlagService> logger)
        {
            _scopeProvider = scopeProvider;
            _contentService = contentService;
            _logger = logger;
        }

        public Task<IReadOnlyCollection<NodeFlagDefinitionModel>> GetDefinitionsAsync(CancellationToken cancellationToken = default)
        {
            using var scope = _scopeProvider.CreateScope(autoComplete: true);
            var records = scope.Database.Fetch<NodeFlagDefinitionRecord>($"SELECT * FROM {Constants.FlagDefinitionsTableName} ORDER BY SortOrder ASC, Name ASC");
            return Task.FromResult<IReadOnlyCollection<NodeFlagDefinitionModel>>(records.Select(MapDefinition).ToArray());
        }

        public Task<NodeFlagDefinitionModel?> GetDefinitionAsync(Guid key, CancellationToken cancellationToken = default)
        {
            using var scope = _scopeProvider.CreateScope(autoComplete: true);
            var record = scope.Database.SingleOrDefaultById<NodeFlagDefinitionRecord>(key);
            return Task.FromResult(record is null ? null : MapDefinition(record));
        }

        public Task<NodeFlagDefinitionModel> CreateDefinitionAsync(NodeFlagDefinitionSaveModel model, CancellationToken cancellationToken = default)
        {
            var now = DateTime.UtcNow;
            var record = new NodeFlagDefinitionRecord
            {
                Key = Guid.NewGuid(),
                Name = model.Name.Trim(),
                Icon = NormalizeIcon(model.Icon),
                IconColor = NormalizeColor(model.IconColor, "#ffffff"),
                BackgroundColor = NormalizeColor(model.BackgroundColor, "#d0021b"),
                SortOrder = model.SortOrder,
                IsEnabled = model.IsEnabled,
                CreatedUtc = now,
                UpdatedUtc = now,
            };

            using var scope = _scopeProvider.CreateScope();
            scope.Database.Insert(record);
            scope.Complete();
            return Task.FromResult(MapDefinition(record));
        }

        public Task<NodeFlagDefinitionModel?> UpdateDefinitionAsync(Guid key, NodeFlagDefinitionSaveModel model, CancellationToken cancellationToken = default)
        {
            using var scope = _scopeProvider.CreateScope();
            var record = scope.Database.SingleOrDefaultById<NodeFlagDefinitionRecord>(key);
            if (record is null)
            {
                return Task.FromResult<NodeFlagDefinitionModel?>(null);
            }

            record.Name = model.Name.Trim();
            record.Icon = NormalizeIcon(model.Icon);
            record.IconColor = NormalizeColor(model.IconColor, record.IconColor);
            record.BackgroundColor = NormalizeColor(model.BackgroundColor, record.BackgroundColor);
            record.SortOrder = model.SortOrder;
            record.IsEnabled = model.IsEnabled;
            record.UpdatedUtc = DateTime.UtcNow;

            scope.Database.Update(record);
            scope.Complete();
            return Task.FromResult<NodeFlagDefinitionModel?>(MapDefinition(record));
        }

        public Task<bool> DeleteDefinitionAsync(Guid key, CancellationToken cancellationToken = default)
        {
            using var scope = _scopeProvider.CreateScope();
            var assignments = scope.Database.Fetch<NodeFlagAssignmentRecord>($"SELECT * FROM {Constants.FlagAssignmentsTableName} WHERE FlagKey = @0", key);
            foreach (var assignment in assignments)
            {
                scope.Database.Delete(assignment);
            }

            var record = scope.Database.SingleOrDefaultById<NodeFlagDefinitionRecord>(key);
            if (record is null)
            {
                return Task.FromResult(false);
            }

            scope.Database.Delete(record);
            scope.Complete();
            return Task.FromResult(true);
        }

        public Task<NodeFlagsForNodeModel> GetNodeFlagsAsync(int nodeId, CancellationToken cancellationToken = default)
        {
            var result = GetNodeStates(new[] { nodeId }).Single();
            return Task.FromResult(result);
        }

        public Task<NodeFlagsForNodeModel> GetNodeFlagsByKeyAsync(Guid contentKey, CancellationToken cancellationToken = default)
        {
            var content = _contentService.GetById(contentKey) ?? throw new InvalidOperationException($"Content node with key {contentKey} was not found.");
            return GetNodeFlagsAsync(content.Id, cancellationToken);
        }

        public Task<IReadOnlyCollection<NodeFlagsForNodeModel>> GetNodeFlagsAsync(IEnumerable<int> nodeIds, CancellationToken cancellationToken = default)
        {
            var ids = nodeIds.Distinct().ToArray();
            var states = GetNodeStates(ids);
            return Task.FromResult<IReadOnlyCollection<NodeFlagsForNodeModel>>(states);
        }

        public Task<IReadOnlyCollection<NodeFlagsForNodeModel>> GetNodeFlagsByKeyAsync(IEnumerable<Guid> contentKeys, CancellationToken cancellationToken = default)
        {
            var ids = contentKeys
                .Select(contentKey => _contentService.GetById(contentKey)?.Id)
                .Where(nodeId => nodeId.HasValue)
                .Select(nodeId => nodeId!.Value)
                .Distinct()
                .ToArray();

            return GetNodeFlagsAsync(ids, cancellationToken);
        }

        public Task<NodeFlagToggleResultModel> ToggleFlagAsync(int nodeId, Guid flagKey, CancellationToken cancellationToken = default)
        {
            if (_contentService.GetById(nodeId) is null)
            {
                throw new InvalidOperationException($"Content node with id {nodeId} was not found.");
            }

            using var scope = _scopeProvider.CreateScope();
            var definition = scope.Database.SingleOrDefaultById<NodeFlagDefinitionRecord>(flagKey);
            if (definition is null || definition.IsEnabled is false)
            {
                throw new InvalidOperationException($"Flag with key {flagKey} is not available.");
            }

            var existing = scope.Database.SingleOrDefault<NodeFlagAssignmentRecord>($"WHERE NodeId = @0 AND FlagKey = @1", nodeId, flagKey);
            var isActive = false;

            if (existing is null)
            {
                var now = DateTime.UtcNow;
                scope.Database.Insert(new NodeFlagAssignmentRecord
                {
                    Key = Guid.NewGuid(),
                    NodeId = nodeId,
                    FlagKey = flagKey,
                    CreatedUtc = now,
                    UpdatedUtc = now,
                });
                isActive = true;
            }
            else
            {
                scope.Database.Delete(existing);
            }

            scope.Complete();

            _logger.LogInformation("Node flag {FlagKey} toggled for node {NodeId}. Active: {IsActive}", flagKey, nodeId, isActive);

            var state = GetNodeStates(new[] { nodeId }).Single();
            return Task.FromResult(new NodeFlagToggleResultModel
            {
                NodeId = nodeId,
                FlagKey = flagKey,
                IsActive = isActive,
                State = state,
            });
        }

        public Task<NodeFlagToggleResultModel> ToggleFlagByKeyAsync(Guid contentKey, Guid flagKey, CancellationToken cancellationToken = default)
        {
            var content = _contentService.GetById(contentKey) ?? throw new InvalidOperationException($"Content node with key {contentKey} was not found.");
            return ToggleFlagAsync(content.Id, flagKey, cancellationToken);
        }

        private NodeFlagsForNodeModel[] GetNodeStates(IReadOnlyCollection<int> nodeIds)
        {
            using var scope = _scopeProvider.CreateScope(autoComplete: true);
            var definitions = scope.Database.Fetch<NodeFlagDefinitionRecord>($"SELECT * FROM {Constants.FlagDefinitionsTableName} WHERE IsEnabled = @0 ORDER BY SortOrder ASC, Name ASC", true);
            var availableFlags = definitions.Select(MapDefinition).ToArray();
            var activeAssignments = nodeIds.Count == 0
                ? Array.Empty<NodeFlagAssignmentModel>()
                : scope.Database.Fetch<NodeFlagAssignmentJoinRecord>($@"
SELECT assignment.NodeId, assignment.FlagKey, definition.Name, definition.Icon, definition.IconColor, definition.BackgroundColor, definition.SortOrder, assignment.CreatedUtc AS AssignedUtc
FROM {Constants.FlagAssignmentsTableName} assignment
INNER JOIN {Constants.FlagDefinitionsTableName} definition ON definition.Key = assignment.FlagKey
WHERE assignment.NodeId IN ({string.Join(",", nodeIds)}) AND definition.IsEnabled = @0
ORDER BY definition.SortOrder ASC, definition.Name ASC", true).Select(MapAssignment).ToArray();

            return nodeIds.Select(nodeId =>
            {
                var currentAssignments = activeAssignments.Where(x => x.NodeId == nodeId).OrderBy(x => x.SortOrder).ThenBy(x => x.Name).ToArray();
                return new NodeFlagsForNodeModel
                {
                    NodeId = nodeId,
                    AvailableFlags = availableFlags,
                    ActiveFlags = currentAssignments,
                    EffectiveFlag = currentAssignments.FirstOrDefault(),
                };
            }).ToArray();
        }

        private static NodeFlagDefinitionModel MapDefinition(NodeFlagDefinitionRecord record) => new()
        {
            Key = record.Key,
            Name = record.Name,
            Icon = record.Icon,
            IconColor = record.IconColor,
            BackgroundColor = record.BackgroundColor,
            SortOrder = record.SortOrder,
            IsEnabled = record.IsEnabled,
            CreatedUtc = record.CreatedUtc,
            UpdatedUtc = record.UpdatedUtc,
        };

        private static NodeFlagAssignmentModel MapAssignment(NodeFlagAssignmentJoinRecord record) => new()
        {
            NodeId = record.NodeId,
            FlagKey = record.FlagKey,
            Name = record.Name,
            Icon = record.Icon,
            IconColor = record.IconColor,
            BackgroundColor = record.BackgroundColor,
            SortOrder = record.SortOrder,
            AssignedUtc = record.AssignedUtc,
        };

        private static string NormalizeIcon(string? icon)
        {
            return string.IsNullOrWhiteSpace(icon) ? Constants.FallbackIcon : icon.Trim();
        }

        private static string NormalizeColor(string? value, string fallback)
        {
            return string.IsNullOrWhiteSpace(value) ? fallback : value.Trim();
        }

        private class NodeFlagAssignmentJoinRecord
        {
            public int NodeId { get; set; }
            public Guid FlagKey { get; set; }
            public string Name { get; set; } = string.Empty;
            public string Icon { get; set; } = Constants.FallbackIcon;
            public string IconColor { get; set; } = "#ffffff";
            public string BackgroundColor { get; set; } = "#d0021b";
            public int SortOrder { get; set; }
            public DateTime AssignedUtc { get; set; }
        }
    }
}
