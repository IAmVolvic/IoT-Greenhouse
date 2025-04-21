using System.ComponentModel.DataAnnotations;

namespace Greenhouse.Application.Security.Requests;

public class UserLoginDto
{
    [Required(ErrorMessage = "Name is required.")]
    public string Name { get; set; } = null!;
    
    [Required(ErrorMessage = "Password is required.")]
    [MinLength(5, ErrorMessage = "Password is too short.")]
    public string Password { get; set; } = null!;
}