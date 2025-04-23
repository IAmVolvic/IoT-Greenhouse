using Greenhouse.Application.Exceptions;
using Greenhouse.Application.Repositories;
using Greenhouse.Domain.DatabaseDtos;

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

    public User GetUserByName(string username)
    {
        var user = context.Users.FirstOrDefault(u => u.Name == username);
        if (user == null)
        {
            throw new ErrorException("User", "User does not exist");
        }
        
        return user;
    }
    
    public User GetUserById(Guid userId)
    {
        var user = context.Users.FirstOrDefault(u => u.Id == userId);
        if (user == null)
        {
            throw new ErrorException("User", "User does not exist");
        }
        
        return user;
    }
}