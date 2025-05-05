using System.ComponentModel.DataAnnotations;

namespace Greenhouse.Domain.DatabaseDtos;

public class Log
{
    public Guid Id { get; set; }
    [Required]
    public Guid DeviceId { get; set; }
    [Required]
    public string Unit { get; set; }
    [Required]
    public decimal Value { get; set; }
    [Required]
    public string Type { get; set; }
    public DateTime Date { get; set; }
}