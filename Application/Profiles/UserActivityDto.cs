using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Profiles
{
    public class UserActivityDto
    {
        public Guid Id { get; set; }

        public string Title { get; set; }

        public string Category { get; set; }

        public DateTime Date { get; set; }

        [JsonIgnore]   // DO not return this property to the client, ignore it
        // But can be used within the API project
        public string HostUsername { get; set; }
    }
}