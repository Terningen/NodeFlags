using NPoco;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace NodeFlags.Persistence
{
    [TableName(Constants.FlagDefinitionsTableName)]
    [PrimaryKey(nameof(Key), AutoIncrement = false)]
    [ExplicitColumns]
    public class NodeFlagDefinitionRecord
    {
        [Column(nameof(Key))]
        [PrimaryKeyColumn(AutoIncrement = false)]
        public Guid Key { get; set; }

        [Column(nameof(Name))]
        [Length(128)]
        [NullSetting(NullSetting = NullSettings.NotNull)]
        public string Name { get; set; } = string.Empty;

        [Column(nameof(Icon))]
        [Length(128)]
        [NullSetting(NullSetting = NullSettings.NotNull)]
        public string Icon { get; set; } = Constants.FallbackIcon;

        [Column(nameof(IconColor))]
        [Length(32)]
        [NullSetting(NullSetting = NullSettings.NotNull)]
        public string IconColor { get; set; } = "#ffffff";

        [Column(nameof(BackgroundColor))]
        [Length(32)]
        [NullSetting(NullSetting = NullSettings.NotNull)]
        public string BackgroundColor { get; set; } = "#d0021b";

        [Column(nameof(SortOrder))]
        [NullSetting(NullSetting = NullSettings.NotNull)]
        public int SortOrder { get; set; }

        [Column(nameof(IsEnabled))]
        [NullSetting(NullSetting = NullSettings.NotNull)]
        public bool IsEnabled { get; set; }

        [Column(nameof(CreatedUtc))]
        [NullSetting(NullSetting = NullSettings.NotNull)]
        public DateTime CreatedUtc { get; set; }

        [Column(nameof(UpdatedUtc))]
        [NullSetting(NullSetting = NullSettings.NotNull)]
        public DateTime UpdatedUtc { get; set; }
    }
}
