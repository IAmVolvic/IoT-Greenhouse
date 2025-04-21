namespace Greenhouse.Application.Environment;

public class JwtSettings
{
    public string Token { get; set; }
    public string Issuer { get; set; }
    public string Audience { get; set; }
}