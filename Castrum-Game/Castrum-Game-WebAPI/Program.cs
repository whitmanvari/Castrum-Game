using Castrum_Game_Core.Interfaces;
using Castrum_Game_Data;
using Castrum_Game_Service.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// --- GEVŞEK CORS AYARI  ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()  // <-- Hangi adresten gelirse gelsin kabul et!
               .AllowAnyMethod()  // GET, POST, PUT, DELETE... Hepsi serbest
               .AllowAnyHeader(); // Her türlü bilgi başlığına izin ver
    });
});

// Add services to the container.

builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Servis Katmanı Tanımları (Dependency Injection)
// IGameService istenirse, GameService verilecek.
builder.Services.AddScoped<IGameService, GameService>();

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll"); 

app.UseAuthorization();

app.MapControllers();

app.Run();
