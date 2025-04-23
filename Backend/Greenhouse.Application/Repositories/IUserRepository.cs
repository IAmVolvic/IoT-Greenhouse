using Greenhouse.Domain;
using Service.TransferModels.Responses;

namespace Greenhouse.Application.Repositories;

public interface IUserRepository
{
    public User CreateUser(User newUser);

    public AuthorizedUserResponseDTO GetUserByName(string username);

    public AuthorizedUserResponseDTO GetUserById(Guid userId);
}