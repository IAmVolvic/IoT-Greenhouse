namespace API.Attributes;

[AttributeUsage(AttributeTargets.Method, Inherited = false)]
public class RolepolicyAttribute : Attribute
{
    public string[] Roles { get; }

    public RolepolicyAttribute(params string[] roles)
    {
        Roles = roles;
    }
}