using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Text;
using Konscious.Security.Cryptography;
using Microsoft.AspNetCore.Identity;

namespace Greenhouse.Application.Security;

public class PasswordManger<TUser> : IPasswordHasher<TUser> where TUser : class
{
    public string HashPassword(TUser user, string password)
    {
        var saltCount = Int32.Parse(Environment.GetEnvironmentVariable("PM_BYTES_SIZE_A")!) / Int32.Parse(Environment.GetEnvironmentVariable("PM_BYTES_SIZE_B")!);
        var salt = RandomNumberGenerator.GetBytes(saltCount);
        var hash = GenerateHash(password, salt);
        return $"{Environment.GetEnvironmentVariable("PM_SALT")!}${Encode(salt)}${Encode(hash)}";
    }

    public PasswordVerificationResult VerifyHashedPassword(TUser user, string hashedPassword, string providedPassword)
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
            MemorySize = Int32.Parse(Environment.GetEnvironmentVariable("PM_SALT_MEMORYSIZE")!),
            Iterations = Int32.Parse(Environment.GetEnvironmentVariable("PM_ITERATIONS")!),
            DegreeOfParallelism = Int32.Parse(Environment.GetEnvironmentVariable("PM_DEGREEOFPARALLELISM")!)
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