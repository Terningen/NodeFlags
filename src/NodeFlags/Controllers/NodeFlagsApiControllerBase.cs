using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Web.Common.Routing;

namespace NodeFlags.Controllers
{
    [ApiController]
    [BackOfficeRoute("nodeflags/api/v{version:apiVersion}")]
    [MapToApi(Constants.ApiName)]
    public abstract class NodeFlagsApiControllerBase : ControllerBase
    {
    }
}
