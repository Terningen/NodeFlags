using Umbraco.Cms.Infrastructure.Migrations;

namespace NodeFlags.Migrations
{
    public class NodeFlagsMigrationPlan : MigrationPlan
    {
        public NodeFlagsMigrationPlan() : base(Constants.PackageName)
        {
            From(string.Empty)
                .To<CreateNodeFlagsSchemaMigration>("nodeflags-schema-001");
        }
    }
}
