namespace NodeFlags.Models
{
    public class NodeFlagToggleResultModel
    {
        public int NodeId { get; set; }
        public Guid FlagKey { get; set; }
        public bool IsActive { get; set; }
        public NodeFlagsForNodeModel State { get; set; } = new();
    }
}
