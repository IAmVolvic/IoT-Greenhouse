using System.Text;
using Greenhouse.Application.Environment;
using Greenhouse.Domain.DatabaseDtos;
using Greenhouse.Infrastructure.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using NUnit.Framework;

namespace Greenhouse.Tests;

[TestFixture]
public class PasswordManagerTests
{
    private PasswordManger _passwordManager;
    private PasswordSettings _passwordSettings;

    [SetUp]
    public void Setup()
    {
        _passwordSettings = new PasswordSettings
        {
            Salt = "argon2id",  // Marker string
            ByteSizeA = 64,
            ByteSizeB = 8,
            MemorySize = 65536,
            Iterations = 4,
            DegreeOfParallelism = 2
        };

        var options = Options.Create(_passwordSettings);
        _passwordManager = new PasswordManger(options);
    }

    [Test]
    public void HashPassword_GeneratesCorrectlyFormattedHash()
    {
        var user = new User { Id = Guid.NewGuid() };
        var password = "TestPassword123!";

        var hash = _passwordManager.HashPassword(user, password);

        Assert.That(hash, Is.Not.Null);
        var parts = hash.Split('$');
        Assert.That(parts.Length, Is.EqualTo(3), "Hashed password format is incorrect");
        Assert.That(parts[0], Is.EqualTo(_passwordSettings.Salt), "Prefix doesn't match configured salt");
    }

    [Test]
    public void VerifyHashedPassword_ReturnsSuccess_ForCorrectPassword()
    {
        var user = new User { Id = Guid.NewGuid()  };
        var password = "SecureP@ssword!";

        var hashedPassword = _passwordManager.HashPassword(user, password);
        var result = _passwordManager.VerifyHashedPassword(user, hashedPassword, password);

        Assert.That(result, Is.EqualTo(PasswordVerificationResult.Success));
    }

    [Test]
    public void VerifyHashedPassword_ReturnsFailed_ForIncorrectPassword()
    {
        var user = new User { Id = Guid.NewGuid()  };
        var originalPassword = "OriginalP@ss";
        var wrongPassword = "WrongP@ss";

        var hashedPassword = _passwordManager.HashPassword(user, originalPassword);
        var result = _passwordManager.VerifyHashedPassword(user, hashedPassword, wrongPassword);

        Assert.That(result, Is.EqualTo(PasswordVerificationResult.Failed));
    }

    [Test]
    public void GenerateHash_ProducesDeterministicResult_ForSameInputs()
    {
        var password = "RepeatablePassword";
        var salt = Encoding.UTF8.GetBytes("FixedSalt12345678");

        var hash1 = _passwordManager.GenerateHash(password, salt);
        var hash2 = _passwordManager.GenerateHash(password, salt);

        Assert.That(hash1, Is.EqualTo(hash2), "Hashes with same input should match");
    }

    [Test]
    public void EncodeDecode_RoundTripPreservesData()
    {
        var data = new byte[] { 1, 2, 3, 4, 5, 100, 255 };
        var encoded = typeof(PasswordManger)
            .GetMethod("Encode", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic)
            ?.Invoke(_passwordManager, new object[] { data }) as string;

        if (encoded == null) return;
        var decoded = typeof(PasswordManger)
            .GetMethod("Decode", System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic)
            ?.Invoke(_passwordManager, [encoded]) as byte[];

        Assert.That(decoded, Is.EqualTo(data), "Base64 encode/decode mismatch");
    }
}