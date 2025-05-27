namespace Greenhouse.API.FrontendDtos;

public class AuthorizedUser
{
    public required string Jwt { get; set; }
    public string UserId { get; set; } = null!;
}