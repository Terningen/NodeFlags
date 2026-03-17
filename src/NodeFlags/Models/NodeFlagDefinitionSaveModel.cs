using System.ComponentModel.DataAnnotations;

namespace NodeFlags.Models
{
    public class NodeFlagDefinitionSaveModel
    {
        [Required]
        [MaxLength(128)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(128)]
        public string? Icon { get; set; }

        [Required]
        [MaxLength(32)]
        public string IconColor { get; set; } = "#ffffff";

        [Required]
        [MaxLength(32)]
        public string BackgroundColor { get; set; } = "#d0021b";

        public int SortOrder { get; set; }

        public bool IsEnabled { get; set; } = true;
    }
}
