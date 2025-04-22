using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Text;
using Greenhouse.Application.Environment;
using Greenhouse.Domain;
using Konscious.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace Greenhouse.Infrastructure.Security;

public class PasswordManger(IOptions<PasswordSettings> passwordSettings)
{
    private readonly PasswordSettings _passwordSettings = passwordSettings.Value;
    
    public string HashPassword(User user, string password)
    {
        var saltCount = _passwordSettings.ByteSizeA / _passwordSettings.ByteSizeB;
        var salt = RandomNumberGenerator.GetBytes(saltCount);
        var hash = GenerateHash(password, salt);
        return $"{_passwordSettings.Salt}${Encode(salt)}${Encode(hash)}";
    }

    public PasswordVerificationResult VerifyHashedPassword(User user, string hashedPassword, string providedPassword)
    {
        var parts = hashedPassword.Split('$');
        var salt = Decode(parts[1]);
        var storedHash = Decode(parts[2]);
        var providedHash = GenerateHash(providedPassword, salt);
        return ByteArraysEqual(storedHash, providedHash)
            ? PasswordVerificationResult.Success
            : PasswordVerificationResult.Failed;
    }

    public byte[] GenerateHash(string password, byte[] salt)
    {
        using var hashAlgo = new Argon2id(Encoding.UTF8.GetBytes(password))
        {
            Salt = salt,
            MemorySize = _passwordSettings.MemorySize,
            Iterations = _passwordSettings.Iterations,
            DegreeOfParallelism = _passwordSettings.DegreeOfParallelism
        };
        return hashAlgo.GetBytes(256 / 8);
    }

    protected byte[] Decode(string value)
    {
        return Convert.FromBase64String(value);
    }

    protected string Encode(byte[] value)
    {
        return Convert.ToBase64String(value);
    }

   
    [MethodImpl(MethodImplOptions.NoOptimization)]
    private static bool ByteArraysEqual(byte[] a, byte[] b)
    {
        if (a.Length != b.Length) return false;
        var areSame = true;
        for (var i = 0; i < a.Length; i++) areSame &= a[i] == b[i];
        return areSame;
    }
}