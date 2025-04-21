namespace Greenhouse.Application.Environment;

public class PasswordSettings
{
    public required string Salt { get; set; }
    public required int ByteSizeA { get; set; }
    public required int ByteSizeB { get; set; }
    public required int MemorySize { get; set; }
    public required int Iterations { get; set; }
    public required int DegreeOfParallelism { get; set; }
}