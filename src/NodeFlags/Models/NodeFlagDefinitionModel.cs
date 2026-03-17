namespace NodeFlags.Models
{
    public class NodeFlagDefinitionModel
    {
        public Guid Key { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Icon { get; set; } = Constants.FallbackIcon;
        public string IconColor { get; set; } = "#ffffff";
        public string BackgroundColor { get; set; } = "#d0021b";
        public int SortOrder { get; set; }
        public bool IsEnabled { get; set; }
        public DateTime CreatedUtc { get; set; }
        public DateTime UpdatedUtc { get; set; }
    }
}
