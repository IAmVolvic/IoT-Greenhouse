using Greenhouse.API.Controllers;
using Greenhouse.API.FrontendDtos;
using Greenhouse.Application.Security.Requests;
using Greenhouse.Application.Services.FeatureToggle;
using Greenhouse.Application.Services.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;

namespace Greenhouse.Tests;

[TestFixture]
public class AuthControllerTests
{
    private Mock<IUserService> _userServiceMock;
    private Mock<IFeatureToggleService> _featureToggleMock;
    private AuthController _controller;

    [SetUp]
    public void SetUp()
    {
        _userServiceMock = new Mock<IUserService>();
        _featureToggleMock = new Mock<IFeatureToggleService>();

        _controller = new AuthController(_userServiceMock.Object, _featureToggleMock.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };
    }

    [Test]
    public void GetUser_ShouldReturnOk_WhenFeaturesEnabled()
    {
        // Arrange
        var expectedUser = new AuthorizedUserResponseDto { Name = "testuser" };
        _controller.HttpContext.Items["AuthenticatedUser"] = expectedUser;

        _featureToggleMock.Setup(f => f.IsEnabled("feature_login")).Returns(true);
        _featureToggleMock.Setup(f => f.IsEnabled("feature_signup")).Returns(true);

        // Act
        var result = _controller.GetUser();

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        Assert.That(okResult!.Value, Is.EqualTo(expectedUser));
    }

    [Test]
    public void GetUser_ShouldReturnUnauthorized_WhenFeatureDisabled()
    {
        // Arrange
        _featureToggleMock.Setup(f => f.IsEnabled("feature_login")).Returns(false);
        _featureToggleMock.Setup(f => f.IsEnabled("feature_signup")).Returns(true);

        // Act
        var result = _controller.GetUser();

        // Assert
        Assert.That(result.Result, Is.InstanceOf<UnauthorizedResult>());
    }

    [Test]
    public void PLogin_ShouldReturnOkAndSetCookie_WhenFeatureEnabled()
    {
        // Arrange
        var loginDto = new UserLoginDto { Name = "user", Password = "pass" };
        var jwt = "fake-jwt-token";

        _featureToggleMock.Setup(f => f.IsEnabled("feature_login")).Returns(true);

        _userServiceMock
            .Setup(us => us.Login(loginDto))
            .Returns(new UserLoginResponseDto { JwtToken = jwt });

        var responseCookiesMock = new Mock<IResponseCookies>();
        var responseMock = new Mock<HttpResponse>();
        responseMock.Setup(r => r.Cookies).Returns(responseCookiesMock.Object);

        var contextMock = new Mock<HttpContext>();
        contextMock.Setup(c => c.Response).Returns(responseMock.Object);

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = contextMock.Object
        };

        // Act
        var result = _controller.PLogin(loginDto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        responseCookiesMock.Verify(c => c.Append(
            "Authentication",
            jwt,
            It.Is<CookieOptions>(opt =>
                opt.HttpOnly &&
                opt.Secure &&
                opt.SameSite == SameSiteMode.None
            )
        ), Times.Once);
    }


    [Test]
    public void PLogin_ShouldReturnUnauthorized_WhenFeatureDisabled()
    {
        // Arrange
        _featureToggleMock.Setup(f => f.IsEnabled("feature_login")).Returns(false);
        var loginDto = new UserLoginDto();

        // Act
        var result = _controller.PLogin(loginDto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<UnauthorizedResult>());
    }

    [Test]
    public void PSignup_ShouldReturnOkAndSetCookie_WhenFeatureEnabled()
    {
        // Arrange
        var signupDto = new UserSignupDto { Name = "test@example.com", Password = "pass" };
        var jwt = "signup-jwt-token";
        var userId = Guid.NewGuid();

        _featureToggleMock.Setup(f => f.IsEnabled("feature_signup")).Returns(true);

        _userServiceMock
            .Setup(us => us.SignUp(signupDto))
            .Returns(new UserSignupResponseDto { JwtToken = jwt, Id = userId.ToString() });

        var responseCookiesMock = new Mock<IResponseCookies>();
        var responseMock = new Mock<HttpResponse>();
        responseMock.Setup(r => r.Cookies).Returns(responseCookiesMock.Object);

        var contextMock = new Mock<HttpContext>();
        contextMock.Setup(c => c.Response).Returns(responseMock.Object);

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = contextMock.Object
        };

        // Act
        var result = _controller.PSignup(signupDto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var ok = result.Result as OkObjectResult;
        var user = ok!.Value as AuthorizedUser;

        Assert.Multiple(() =>
        {
            Assert.That(user!.Jwt, Is.EqualTo(jwt));
            Assert.That(user.UserId, Is.EqualTo(userId.ToString()));
        });

        responseCookiesMock.Verify(c => c.Append(
            "Authentication",
            jwt,
            It.Is<CookieOptions>(opt =>
                opt.HttpOnly &&
                opt.Secure &&
                opt.SameSite == SameSiteMode.None
            )
        ), Times.Once);
    }


    [Test]
    public void PSignup_ShouldReturnUnauthorized_WhenFeatureDisabled()
    {
        // Arrange
        _featureToggleMock.Setup(f => f.IsEnabled("feature_signup")).Returns(false);
        var signupDto = new UserSignupDto();

        // Act
        var result = _controller.PSignup(signupDto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<UnauthorizedResult>());
    }
}