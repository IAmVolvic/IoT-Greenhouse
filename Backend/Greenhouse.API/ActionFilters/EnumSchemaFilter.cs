using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.OpenApi.Any;
using System.Linq;

namespace API.ActionFilters
{
    public class EnumSchemaFilter : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            // Check if the property is an enum and has possible values
            if (schema.Enum != null && context.Type.IsEnum)
            {
                // Remove integer-based enums from the schema
                var enumValues = schema.Enum
                    .Where(e => e is OpenApiString)  // Only keep OpenApiString values
                    .ToList();  // Create a new list with only string-based enums

                // Update the enum list to include only strings
                schema.Enum = enumValues;
            }
        }
    }
}