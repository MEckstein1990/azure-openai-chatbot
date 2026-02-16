using Azure.AI.OpenAI;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = null;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AzureOpenAIChatbot API", Version = "v1" });
});


var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "AzureOpenAIChatbot API V1");
});

app.UseCors(policy =>
    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

// Configuration - Get API key and endpoint from environment variables
string? azureOpenAIKey = Environment.GetEnvironmentVariable("AZURE_OPENAI_API_KEY");
string? azureOpenAIEndpoint = Environment.GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT");
string? azureOpenAIDeploymentName = Environment.GetEnvironmentVariable("AZURE_OPENAI_DEPLOYMENT_NAME");

if (string.IsNullOrEmpty(azureOpenAIKey) || string.IsNullOrEmpty(azureOpenAIEndpoint) || string.IsNullOrEmpty(azureOpenAIDeploymentName))
{
    Console.WriteLine("Missing Azure OpenAI environment variables. Please set AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_DEPLOYMENT_NAME.");
    return;
}

var client = new OpenAIClient(new Uri(azureOpenAIEndpoint), new Azure.AzureKeyCredential(azureOpenAIKey));

app.MapPost("/api/chat", async (ChatRequest request) =>
{
    if (string.IsNullOrEmpty(request.Message))
        return Results.BadRequest(new { error = "Message is required." });

    var chatMessages = new List<ChatMessage>
    {
        ChatMessage.FromSystem("You are a helpful assistant."),
        ChatMessage.FromUser(request.Message)
    };

    try
    {
        var response = await client.GetChatCompletionsAsync(azureOpenAIDeploymentName, chatMessages);
        var completion = response.Value.Choices[0].Message.Content;
        return Results.Ok(new { response = completion });
    }
    catch (Exception ex)
    {
        return Results.Problem("Error calling Azure OpenAI service.", detail: ex.Message);
    }

});

app.Run();

record ChatRequest(string Message);