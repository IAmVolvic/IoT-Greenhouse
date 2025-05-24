using System.ComponentModel.DataAnnotations;
using Greenhouse.Application.Exceptions;
using Greenhouse.Application.Repositories;
using Greenhouse.Application.Security;
using Greenhouse.Application.Security.Requests;
using Greenhouse.Application.Services.User;
using Greenhouse.Domain;
using Greenhouse.Domain.DatabaseDtos;
using Greenhouse.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Moq;
using NUnit.Framework;

namespace Greenhouse.Tests;

[TestFixture]
public class UserServiceTests
{
    private Mock<IPasswordHasher<User>> _mockPasswordHasher;
    private Mock<IJwtManager> _mockJwtManager;
    private Mock<IUserRepository> _mockUserRepo;
    private IUserService _userService;

    [SetUp]
    public void Setup()
    {
        _mockPasswordHasher = new Mock<IPasswordHasher<User>>();
        _mockJwtManager = new Mock<IJwtManager>();
        _mockUserRepo = new Mock<IUserRepository>();
        
        _userService = new UserService(_mockPasswordHasher.Object, _mockJwtManager.Object, _mockUserRepo.Object);
    }

    // USER SIGN UP
    [Test]
    public void SignUp_ShouldCreateUser_AndReturnResponse()
    {
        // Arrange
        var signupDto = new UserSignupDto { Name = "test", Password = "test123456" };

        // Act
        var result = _userService.SignUp(signupDto);

        // Assert
        _mockUserRepo.Verify(u => u.CreateUser(It.IsAny<User>()), Times.Once);
        Assert.IsNotNull(result);
        Assert.AreNotEqual(Guid.Empty.ToString(), result.Id);
    }

    [Test]
    public void SignUp_Should_Fail_To_Create_User_As_User_Exists()
    {
        // Arrange
        var signupDto = new UserSignupDto { Name = "test", Password = "1234567890" };

        _mockUserRepo
            .Setup(repo => repo.CreateUser(It.IsAny<User>()))
            .Throws(new ErrorException("User", "A user with this name already exists."));

        // Act & Assert
        var ex = Assert.Throws<ErrorException>(() => _userService.SignUp(signupDto));
        Assert.AreEqual("A user with this name already exists.", ex.Message);
    }

    [Test]
    public void SignUp_Should_Throw_When_Password_Is_Too_Short()
    {
        // Arrange
        var signupDto = new UserSignupDto { Name = "test", Password = "123" };

        // Act & Assert
        var ex = Assert.Throws<ValidationException>(() => _userService.SignUp(signupDto));
        Assert.AreEqual("Password is too short.", ex.Message);
    }

    [Test]
    public void SignUp_Should_Throw_When_Password_Is_Empty()
    {
        // Arrange
        var signupDto = new UserSignupDto { Name = "test", Password = "" };

        // Act & Assert
        var ex = Assert.Throws<ValidationException>(() => _userService.SignUp(signupDto));
        Assert.AreEqual("Password is required.", ex.Message);
    }

    // USER LOGIN
    [Test]
    public void Login_Should_Return_Response()
    {
        // Arrange
        var loginDto = new UserLoginDto { Name = "test", Password = "test123456" };
        var userFromDb = new User
        {
            Id = Guid.NewGuid(),
            Name = "test",
            Passwordhash = "hashed-password"
        };

        _mockUserRepo
            .Setup(repo => repo.GetUserByName("test"))
            .Returns(userFromDb);

        _mockPasswordHasher
            .Setup(ph => ph.VerifyHashedPassword(userFromDb, "hashed-password", "test123456"))
            .Returns(PasswordVerificationResult.Success);

        _mockJwtManager
            .Setup(jwt => jwt.CreateJwt(It.IsAny<User>()))
            .Returns("fake-jwt-token");

        // Act
        var result = _userService.Login(loginDto);

        // Assert
        Assert.IsNotNull(result);
        Assert.AreEqual(userFromDb.Id.ToString(), result.Id);
        Assert.AreEqual("fake-jwt-token", result.JwtToken);
    }

    [Test]
    public void Login_Should_Fail_If_User_Does_Not_Exist()
    {
        // Arrange
        var loginDto = new UserLoginDto { Name = "nonexistent", Password = "password" };

        _mockUserRepo
            .Setup(repo => repo.GetUserByName("nonexistent"))
            .Throws(new ErrorException("User", "User does not exist"));

        // Act & Assert
        var ex = Assert.Throws<ErrorException>(() => _userService.Login(loginDto));
        Assert.AreEqual("User does not exist", ex.Message);
    }

    [Test]
    public void Login_Should_Fail_If_Password_Is_Incorrect()
    {
        // Arrange
        var loginDto = new UserLoginDto { Name = "test", Password = "wrongpassword" };
        var userFromDb = new User
        {
            Id = Guid.NewGuid(),
            Name = "test",
            Passwordhash = "hashed-password"
        };

        _mockUserRepo
            .Setup(repo => repo.GetUserByName("test"))
            .Returns(userFromDb);

        _mockPasswordHasher
            .Setup(ph => ph.VerifyHashedPassword(userFromDb, "hashed-password", "wrongpassword"))
            .Returns(PasswordVerificationResult.Failed);

        // Act & Assert
        var ex = Assert.Throws<ErrorException>(() => _userService.Login(loginDto));
        Assert.AreEqual("Password does not match", ex.Message);
    }
}
