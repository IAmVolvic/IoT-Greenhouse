using Greenhouse.Domain;
using Service.TransferModels.Responses;

namespace Greenhouse.Application.Repositories;

public interface IUserRepository
{
    public User CreateUser(User newUser);

    public User GetUserByName(string username);

    public User GetUserById(Guid userId);
}