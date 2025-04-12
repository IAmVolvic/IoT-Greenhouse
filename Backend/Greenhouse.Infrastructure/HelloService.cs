using Greenhouse.Application;
using Greenhouse.Domain;
using Microsoft.EntityFrameworkCore;

namespace Greenhouse.Infrastructure;

public class HelloService : IHelloService
{
    private readonly AppDbContext _context;

    public HelloService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<HelloResponseDto> GetHelloAsync()
    {
        var countEntry = await _context.RequestCounts.FirstOrDefaultAsync();

        if (countEntry == null)
        {
            countEntry = new RequestCount { Count = 1 };
            _context.RequestCounts.Add(countEntry);
        }
        else
        {
            countEntry.Count++;
        }

        await _context.SaveChangesAsync();

        return new HelloResponseDto
        {
            Message = "Hello, world!",
            RequestCount = countEntry.Count
        };
    }
}