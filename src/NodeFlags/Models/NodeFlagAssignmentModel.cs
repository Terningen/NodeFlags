namespace NodeFlags.Models
{
    public class NodeFlagAssignmentModel
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
