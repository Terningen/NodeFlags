using Microsoft.Extensions.DependencyInjection;
using NodeFlags.Migrations;
using NodeFlags.Services;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace NodeFlags.Composers
{
    public class NodeFlagsComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.Services.AddScoped<INodeFlagService, NodeFlagService>();
            builder.Components().Append<NodeFlagsMigrationComponent>();
        }
    }
}
