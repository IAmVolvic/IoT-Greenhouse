namespace Service.Auth.Dto;

public record RegisterResponse(string Jwt);

public record LoginResponse(string Jwt);

public record AuthUserInfo(string Username, bool IsAdmin);