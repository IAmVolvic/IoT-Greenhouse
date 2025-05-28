namespace Greenhouse.Application.Exceptions
{
    public class ErrorException(string source, string description) : Exception(description)
    {
        public sealed override string Source { get; set; } = source;
        public string Description { get; set; } = description;
    }
}