using System.ComponentModel.DataAnnotations;

namespace Greenhouse.API.FrontendDtos;

public class SubscirbeToTopicDto
{
    [Required] public List<string> TopicNames { get; set; } = null!;
    [Required] public int UserId { get; set; }
}