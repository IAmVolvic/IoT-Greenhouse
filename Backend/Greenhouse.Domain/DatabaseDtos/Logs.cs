namespace Greenhouse.Domain.DatabaseDtos;

public class Logs
{
    public int Id { get; set; }
    public int DeviceId { get; set; }
    public string Unit { get; set; }
    public decimal Value { get; set; }
    public string Type { get; set; }
    public DateTime Date { get; set; }
}