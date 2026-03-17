using NPoco;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace NodeFlags.Persistence
{
    [TableName(Constants.FlagAssignmentsTableName)]
    [PrimaryKey(nameof(Key), AutoIncrement = false)]
    [ExplicitColumns]
    public class NodeFlagAssignmentRecord
    {
        [Column(nameof(Key))]
        [PrimaryKeyColumn(AutoIncrement = false)]
        public Guid Key { get; set; }

        [Column(nameof(NodeId))]
        [Index(IndexTypes.NonClustered, Name = "IX_NodeFlags_NodeId")]
        [NullSetting(NullSetting = NullSettings.NotNull)]
        public int NodeId { get; set; }

        [Column(nameof(FlagKey))]
        [Index(IndexTypes.NonClustered, Name = "IX_NodeFlags_FlagKey")]
        [NullSetting(NullSetting = NullSettings.NotNull)]
        public Guid FlagKey { get; set; }

        [Column(nameof(CreatedUtc))]
        [NullSetting(NullSetting = NullSettings.NotNull)]
        public DateTime CreatedUtc { get; set; }

        [Column(nameof(UpdatedUtc))]
        [NullSetting(NullSetting = NullSettings.NotNull)]
        public DateTime UpdatedUtc { get; set; }
    }
}
