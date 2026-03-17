using NodeFlags.Persistence;
using Umbraco.Cms.Infrastructure.Migrations;

namespace NodeFlags.Migrations
{
    public class CreateNodeFlagsSchemaMigration : MigrationBase
    {
        public CreateNodeFlagsSchemaMigration(IMigrationContext context) : base(context)
        {
        }

        protected override void Migrate()
        {
            if (TableExists(Constants.FlagDefinitionsTableName) is false)
            {
                Create.Table<NodeFlagDefinitionRecord>().Do();
            }

            if (TableExists(Constants.FlagAssignmentsTableName) is false)
            {
                Create.Table<NodeFlagAssignmentRecord>().Do();
                Database.Execute($"CREATE UNIQUE INDEX IX_NodeFlags_NodeAssignment_Unique ON {Constants.FlagAssignmentsTableName} (NodeId, FlagKey)");
            }
        }
    }
}
