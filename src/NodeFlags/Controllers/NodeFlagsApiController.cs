using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NodeFlags.Models;
using NodeFlags.Services;
using Umbraco.Cms.Web.Common.Authorization;

namespace NodeFlags.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "NodeFlags")]
    public class NodeFlagsApiController : NodeFlagsApiControllerBase
    {
        private readonly INodeFlagService _nodeFlagService;

        public NodeFlagsApiController(INodeFlagService nodeFlagService)
        {
            _nodeFlagService = nodeFlagService;
        }

        [HttpGet("definitions")]
        [Authorize(Policy = AuthorizationPolicies.SectionAccessSettings)]
        [ProducesResponseType(typeof(IEnumerable<NodeFlagDefinitionModel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<NodeFlagDefinitionModel>>> GetDefinitions(CancellationToken cancellationToken)
            => Ok(await _nodeFlagService.GetDefinitionsAsync(cancellationToken));

        [HttpGet("definitions/{key:guid}")]
        [Authorize(Policy = AuthorizationPolicies.SectionAccessSettings)]
        [ProducesResponseType(typeof(NodeFlagDefinitionModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<NodeFlagDefinitionModel>> GetDefinition(Guid key, CancellationToken cancellationToken)
        {
            var definition = await _nodeFlagService.GetDefinitionAsync(key, cancellationToken);
            return definition is null ? NotFound() : Ok(definition);
        }

        [HttpPost("definitions")]
        [Authorize(Policy = AuthorizationPolicies.SectionAccessSettings)]
        [ProducesResponseType(typeof(NodeFlagDefinitionModel), StatusCodes.Status201Created)]
        public async Task<ActionResult<NodeFlagDefinitionModel>> CreateDefinition([FromBody] NodeFlagDefinitionSaveModel model, CancellationToken cancellationToken)
        {
            var created = await _nodeFlagService.CreateDefinitionAsync(model, cancellationToken);
            return CreatedAtAction(nameof(GetDefinition), new { key = created.Key, version = "1" }, created);
        }

        [HttpPut("definitions/{key:guid}")]
        [Authorize(Policy = AuthorizationPolicies.SectionAccessSettings)]
        [ProducesResponseType(typeof(NodeFlagDefinitionModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<NodeFlagDefinitionModel>> UpdateDefinition(Guid key, [FromBody] NodeFlagDefinitionSaveModel model, CancellationToken cancellationToken)
        {
            var updated = await _nodeFlagService.UpdateDefinitionAsync(key, model, cancellationToken);
            return updated is null ? NotFound() : Ok(updated);
        }

        [HttpDelete("definitions/{key:guid}")]
        [Authorize(Policy = AuthorizationPolicies.SectionAccessSettings)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> DeleteDefinition(Guid key, CancellationToken cancellationToken)
        {
            var deleted = await _nodeFlagService.DeleteDefinitionAsync(key, cancellationToken);
            return deleted ? NoContent() : NotFound();
        }

        [HttpGet("nodes/{nodeId:int}/flags")]
        [Authorize(Policy = AuthorizationPolicies.SectionAccessContent)]
        [ProducesResponseType(typeof(NodeFlagsForNodeModel), StatusCodes.Status200OK)]
        public async Task<ActionResult<NodeFlagsForNodeModel>> GetNodeFlags(int nodeId, CancellationToken cancellationToken)
            => Ok(await _nodeFlagService.GetNodeFlagsAsync(nodeId, cancellationToken));

        [HttpGet("nodes/by-key/{contentKey:guid}/flags")]
        [Authorize(Policy = AuthorizationPolicies.SectionAccessContent)]
        [ProducesResponseType(typeof(NodeFlagsForNodeModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<NodeFlagsForNodeModel>> GetNodeFlagsByKey(Guid contentKey, CancellationToken cancellationToken)
        {
            try
            {
                return Ok(await _nodeFlagService.GetNodeFlagsByKeyAsync(contentKey, cancellationToken));
            }
            catch (InvalidOperationException exception)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Unable to load node flags",
                    Detail = exception.Message,
                    Status = StatusCodes.Status400BadRequest,
                });
            }
        }

        [HttpGet("nodes/flags")]
        [Authorize(Policy = AuthorizationPolicies.SectionAccessContent)]
        [ProducesResponseType(typeof(IEnumerable<NodeFlagsForNodeModel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<NodeFlagsForNodeModel>>> GetManyNodeFlags([FromQuery] int[] nodeIds, CancellationToken cancellationToken)
            => Ok(await _nodeFlagService.GetNodeFlagsAsync(nodeIds, cancellationToken));

        [HttpGet("nodes/by-key/flags")]
        [Authorize(Policy = AuthorizationPolicies.SectionAccessContent)]
        [ProducesResponseType(typeof(IEnumerable<NodeFlagsForNodeModel>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<NodeFlagsForNodeModel>>> GetManyNodeFlagsByKey([FromQuery] Guid[] contentKeys, CancellationToken cancellationToken)
            => Ok(await _nodeFlagService.GetNodeFlagsByKeyAsync(contentKeys, cancellationToken));

        [HttpPost("nodes/{nodeId:int}/flags/{flagKey:guid}/toggle")]
        [Authorize(Policy = AuthorizationPolicies.SectionAccessContent)]
        [ProducesResponseType(typeof(NodeFlagToggleResultModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<NodeFlagToggleResultModel>> ToggleFlag(int nodeId, Guid flagKey, CancellationToken cancellationToken)
        {
            try
            {
                return Ok(await _nodeFlagService.ToggleFlagAsync(nodeId, flagKey, cancellationToken));
            }
            catch (InvalidOperationException exception)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Unable to toggle node flag",
                    Detail = exception.Message,
                    Status = StatusCodes.Status400BadRequest,
                });
            }
        }

        [HttpPost("nodes/by-key/{contentKey:guid}/flags/{flagKey:guid}/toggle")]
        [Authorize(Policy = AuthorizationPolicies.SectionAccessContent)]
        [ProducesResponseType(typeof(NodeFlagToggleResultModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<NodeFlagToggleResultModel>> ToggleFlagByKey(Guid contentKey, Guid flagKey, CancellationToken cancellationToken)
        {
            try
            {
                return Ok(await _nodeFlagService.ToggleFlagByKeyAsync(contentKey, flagKey, cancellationToken));
            }
            catch (InvalidOperationException exception)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Unable to toggle node flag",
                    Detail = exception.Message,
                    Status = StatusCodes.Status400BadRequest,
                });
            }
        }
    }
}
