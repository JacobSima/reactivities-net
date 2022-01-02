using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Persistence;
using Application.Activities;
using Application.Core;
using Application.Interfaces;
using Infrastructure.Security;
using Infrastructure.Photos;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
             services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });


             // Add Data Context as a Service
            services.AddDbContext<DataContext>(opt => 
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            // Add CORS policy
            services.AddCors(opt => 
            {
                opt.AddPolicy("CorsPolicy",policy =>
                {
                    policy
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .WithOrigins("http://localhost:3000");
                });
            });

            // Add MediatR
            services.AddMediatR(typeof(List.Handler).Assembly);

            // Add AutoMapper as Service
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            // Add IUserAccessor and  UserAccessor from application and infrastructure project 
            // respectively as a service
            services.AddScoped<IUserAccessor, UserAccessor>();

            // Add IPhotoAccessor and PhotoAccessor from application and infrastructure project
             // respectively as a service 
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();

            // Add the cloudinary configuration from appsettings as a service
            // CloudinarySettings from infrastructure
            services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));

            return services;

        }
    }
}