using System.ComponentModel.DataAnnotations;

namespace Greenhouse.API.FrontendDtos;

public class SubscirbeToTopicDto
{
    [Required] public List<string> TopicNames { get; set; }
    [Required] public int userId { get; set; }
}