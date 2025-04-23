using API.Exceptions;
using Greenhouse.Application.Repositories;
using Greenhouse.Domain;
using Service.TransferModels.Responses;

namespace Greenhouse.DataAccess.Repositories;

public class UserRepository(AppDbContext context): IUserRepository
{
    public User CreateUser(User newUser)
    {
        if (context.Users.Any(u => u.Name == newUser.Name))
        {
            throw new ErrorException("User", "A user with this name already exists.");
        }
        
        context.Users.Add(newUser);
        context.SaveChanges();
        return newUser;
    }

    public AuthorizedUserResponseDTO GetUserByName(string username)
    {
        var user = context.Users.FirstOrDefault(u => u.Name == username);
        if (user == null)
        {
            throw new ErrorException("User", "User does not exist");
        }
        
        return AuthorizedUserResponseDTO.FromEntity(user);
    }
    
    public AuthorizedUserResponseDTO GetUserById(Guid userId)
    {
        var user = context.Users.FirstOrDefault(u => u.Id == userId);
        if (user == null)
        {
            throw new ErrorException("User", "User does not exist");
        }
        
        return AuthorizedUserResponseDTO.FromEntity(user);
    }
}