using System.Collections.Generic;

public class ErrorResponseDTO
{
    public Dictionary<string, List<string>> Errors { get; set; }

    public ErrorResponseDTO()
    {
        Errors = new Dictionary<string, List<string>>();
    }
    
    public void AddError(string source, string description)
    {
        if (!Errors.ContainsKey(source))
        {
            Errors[source] = new List<string>();
        }
        Errors[source].Add(description);
    }
}