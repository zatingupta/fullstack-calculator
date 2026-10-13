var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// React से कनेक्शन की अनुमति देने के लिए (CORS)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowReact");
app.UseAuthorization();
app.MapControllers();

app.Run();