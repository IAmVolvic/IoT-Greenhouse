namespace Greenhouse.Application.Environment;

public class JwtSettings
{
    public required string Token { get; set; }
    public required string Issuer { get; set; }
    public required string Audience { get; set; }
}