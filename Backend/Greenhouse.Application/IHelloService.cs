namespace Greenhouse.Application;

public interface IHelloService
{
    Task<HelloResponseDto> GetHelloAsync();
}