
using Microsoft.EntityFrameworkCore;
using Repository;
using Service.JWT;
using Service;
using DAL;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using Microsoft.AspNetCore.Builder;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;

namespace Ielts_System
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });
            builder.Services.AddDbContext<WritingAiHubDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Repository Registration
            builder.Services.AddScoped<IUserRepository, UserRepository>();

            // Service Registration
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IJwtService, JWTService>();
            // JWT Authentication Configuration
            var jwtKey = builder.Configuration["Jwt:Key"];
            var key = Encoding.ASCII.GetBytes(jwtKey);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false; // Set to true in production
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

            // Authorization
            builder.Services.AddAuthorization();
            // Add OpenAPI (for both Swagger and Scalar)
            builder.Services.AddOpenApi();

            // Add Swagger services
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
                {
                    Title = "IELTS System API",
                    Version = "v1",
                    Description = "API for IELTS Writing AI Hub System"
                });

                // Add JWT support to Swagger
                c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token",
                    Name = "Authorization",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference = new Microsoft.OpenApi.Models.OpenApiReference
                            {
                                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });
            builder.Services.AddOpenApi("v1", options =>
            {
                options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();

                // Enable Swagger UI (Traditional Documentation)
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "IELTS System API v1");
                    c.RoutePrefix = "swagger"; // Swagger will be at /swagger
                    c.DocumentTitle = "IELTS System API Documentation";
                });
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowAll");

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
    internal sealed class BearerSecuritySchemeTransformer : IOpenApiDocumentTransformer
    {
        private readonly Microsoft.AspNetCore.Authentication.IAuthenticationSchemeProvider _authenticationSchemeProvider;

        public BearerSecuritySchemeTransformer(Microsoft.AspNetCore.Authentication.IAuthenticationSchemeProvider authenticationSchemeProvider)
        {
            _authenticationSchemeProvider = authenticationSchemeProvider;
        }

        public async Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken)
        {
            var authenticationSchemes = await _authenticationSchemeProvider.GetAllSchemesAsync();
            if (authenticationSchemes.Any(authScheme => authScheme.Name == JwtBearerDefaults.AuthenticationScheme))
            {
                var securityScheme = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    In = ParameterLocation.Header,
                    BearerFormat = "JWT",
                    Reference = new OpenApiReference
                    {
                        Id = "Bearer",
                        Type = ReferenceType.SecurityScheme
                    }
                };

                document.Components ??= new OpenApiComponents();
                document.Components.SecuritySchemes ??= new Dictionary<string, OpenApiSecurityScheme>();
                document.Components.SecuritySchemes["Bearer"] = securityScheme;

                // Modify to only apply security to endpoints with [Authorize]
                foreach (var path in document.Paths)
                {
                    foreach (var operation in path.Value.Operations)
                    {
                        // Check if the operation has an Authorize attribute (simplified check)
                        // You may need to customize this logic based on your needs
                        if (operation.Value.Extensions.TryGetValue("x-require-auth", out var auth) && auth.ToString() == "true")
                        {
                            operation.Value.Security ??= new List<OpenApiSecurityRequirement>();
                            operation.Value.Security.Add(new OpenApiSecurityRequirement
                            {
                                [securityScheme] = Array.Empty<string>()
                            });
                        }
                    }
                }
            }
        }
    }
    }
