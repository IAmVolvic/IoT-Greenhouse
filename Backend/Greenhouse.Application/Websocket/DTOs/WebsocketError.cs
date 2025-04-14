using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Greenhouse.Application.Websocket.DTOs;

public class WebsocketError
{
    [JsonConverter(typeof(StringEnumConverter))]
    public ErrorType ErrorType { get; set; }
    
    public string Message { get; set; }
    
    public WebsocketError(ErrorType errorType, string message)
    {
        ErrorType = errorType;
        Message = message;
    }
    
    public override string ToString()
    {
        return JsonConvert.SerializeObject(this);
    }
}

public enum ErrorType
{
    SOFT,
    CRITICAL,
    FATAL,
    WARNING,
    INFORMATIONAL
}