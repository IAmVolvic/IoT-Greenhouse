using FluentValidation;

namespace Service.Auth.Dto;

public record RegisterRequest(string Password, string Name);

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Password).MinimumLength(6);
        RuleFor(x => x.Name).NotEmpty();
    }
}

public record LoginRequest(string Name, string Password);

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
        RuleFor(x => x.Password).NotEmpty();
    }
}