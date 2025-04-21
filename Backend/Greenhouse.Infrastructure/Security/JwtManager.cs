using System.Security.Claims;
using System.Text;
using Greenhouse.Application.Security;
using Greenhouse.Domain;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace Greenhouse.Infrastructure.Security;

public class JwtManager : IJwtManager
{
    
    private readonly string _jwtToken = Environment.GetEnvironmentVariable("JWT_TOKEN")!;
    private readonly string _jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")!;
    private readonly string _jtwAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")!;
    
    public string CreateJwt(User user)
    {
        // Get the secret key for signing the token
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtToken));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        
        var tokenDescritor = new SecurityTokenDescriptor
        {
            Issuer = _jwtIssuer,
            Audience = _jtwAudience,
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
        var securityKey =  new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtToken));
        var tokenHandler = new JsonWebTokenHandler();
      
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = _jwtIssuer,
            ValidateAudience = true,
            ValidAudience = _jtwAudience,
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