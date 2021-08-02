using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TaskManagement.DataAccess.Configurations;
using TaskManagement.DataAccess.Interfaces;
using TaskManagement.DataAccess.Services;
using TaskManagement.EmailService.Configurations;
using TaskManagement.EmailService.EmailSenders;
using TaskManagement.EmailService.Interfaces;
using TaskManagement.Web.BackgroundFeatures;
using TaskManagement.Web.Interfaces;
using TaskManagement.Web.Models;

namespace TaskManagement.Web
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var emailConfig = Configuration.GetSection("EmailConfiguration").Get<EmailConfiguration>();

            services.Configure<ConfigurationDB>(Configuration);
            services.AddHostedService<TimeService>();
            services.AddSingleton<IService<DataAccess.Models.Account>, AccountService>();
            services.AddSingleton<IService<DataAccess.Models.Task>, TaskService>();
            services.AddSingleton<ITimeBasedNotifier, TimeBasedNotifier>();
            services.AddSingleton(emailConfig);
            services.AddSingleton<IEmailSender, EmailSender>();
            services.AddAutoMapper(typeof(Startup));
            services.AddControllers();

            var authOptionsConfiguration = Configuration.GetSection("Auth");
            services.Configure<AuthOptions>(authOptionsConfiguration);

            var authOptions = Configuration.GetSection("Auth").Get<AuthOptions>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        options.RequireHttpsMetadata = false;
                        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidIssuer = authOptions.Issuer,

                            ValidateAudience = true,
                            ValidAudience = authOptions.Audience,

                            ValidateLifetime = true,

                            IssuerSigningKey = authOptions.GetSymmetricSecurityKey(),
                            ValidateIssuerSigningKey = true
                        };
                    });

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
