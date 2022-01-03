using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]   // api/activities or api/buggy
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if(result == null) return NotFound();
            
            if(result.IsSuccess && result.Value != null) return Ok(result.Value);

            if(result.IsSuccess && result.Value == null) return NotFound();

            return BadRequest(result.Error);
        }

        protected ActionResult HandlePageResult<T>(Result<PageList<T>> result)
        {
            if(result == null) return NotFound();
            
            if(result.IsSuccess && result.Value != null) 
            {
                // Add Custom Headers to the response
                Response.AddPaginationHeader(
                    result.Value.CurrentPage,
                    result.Value.PageSize,
                    result.Value.TotalCount,
                    result.Value.TotalPages
                );
                return Ok(result.Value);
            };

            if(result.IsSuccess && result.Value == null) return NotFound();

            return BadRequest(result.Error);
        }
        
        
    }
}