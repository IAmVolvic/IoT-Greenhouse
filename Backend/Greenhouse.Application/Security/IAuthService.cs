using Service.TransferModels.Responses;

namespace Service.Services.Interfaces;

public interface IAuthService
{
    public Task<AuthorizedUserResponseDTO> GetAuthorizedUser(string jwtToken);
    public void IsUserAuthenticated(string jwtToken);
    public void IsUserAuthorized(string[] roles, string jwtToken);
}