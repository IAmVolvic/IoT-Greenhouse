using API.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.ActionFilters;

public class ExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        if (context.Exception is ErrorException errorExcep)
        {
            var errorResponse = new ErrorResponseDTO();
            errorResponse.AddError(errorExcep.Source, errorExcep.Description);
            context.Result = new BadRequestObjectResult(errorResponse);
            context.ExceptionHandled = true;
        }
    }
}