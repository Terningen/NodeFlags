namespace NodeFlags.Models
{
    public class NodeFlagsForNodeModel
    {
        public int NodeId { get; set; }
        public IReadOnlyCollection<NodeFlagDefinitionModel> AvailableFlags { get; set; } = Array.Empty<NodeFlagDefinitionModel>();
        public IReadOnlyCollection<NodeFlagAssignmentModel> ActiveFlags { get; set; } = Array.Empty<NodeFlagAssignmentModel>();
        public NodeFlagAssignmentModel? EffectiveFlag { get; set; }
    }
}
