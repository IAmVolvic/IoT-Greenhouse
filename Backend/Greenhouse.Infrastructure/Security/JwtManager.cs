using System.Security.Claims;
using System.Text;
using Greenhouse.Application.Environment;
using Greenhouse.Application.Security;
using Greenhouse.Domain;
using Greenhouse.Domain.DatabaseDtos;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace Greenhouse.Infrastructure.Security;

public class JwtManager(IOptions<JwtSettings> jwtSettings) : IJwtManager
{
    private readonly JwtSettings _jwtSettings = jwtSettings.Value;

    public string CreateJwt(User user)
    {
        // Get the secret key for signing the token
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Token));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        
        var tokenDescritor = new SecurityTokenDescriptor
        {
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience,
            Claims = new Dictionary<string, object>
            {
                ["uuid"] = user.Id,
            },
            IssuedAt = null,
            NotBefore = DateTime.UtcNow,
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = credentials
        };
        
        var handler = new JsonWebTokenHandler();
        handler.SetDefaultTimesOnTokenCreation = false;

        return handler.CreateToken(tokenDescritor);
    }
    
    
    public ClaimsPrincipal IsJwtValid(string token)
    {
        var securityKey =  new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Token));
        var tokenHandler = new JsonWebTokenHandler();
      
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = _jwtSettings.Issuer,
            ValidateAudience = true,
            ValidAudience = _jwtSettings.Audience,
            ValidateLifetime = true,
            IssuerSigningKey = securityKey,
            ClockSkew = TimeSpan.Zero,
            ValidateIssuerSigningKey = true
        };
        
        var result = tokenHandler.ValidateTokenAsync(token, validationParameters).Result;
        
        if (result.IsValid)
        {
            return new ClaimsPrincipal(result.ClaimsIdentity);
        }

        return null;
    }
}