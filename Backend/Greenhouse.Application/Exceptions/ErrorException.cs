namespace API.Exceptions
{
    public class ErrorException : Exception
    {
        public string Source { get; set; }
        public string Description { get; set; }

        public ErrorException(string source, string description)
            : base(description)
        {
            Source = source;
            Description = description;
        }
    }
}