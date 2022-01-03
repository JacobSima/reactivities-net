using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName {get; set;}

        public string Bio {get; set;}

        // Many to Many Relationship with Activities Via ActivityAttendee Middle Table
        public ICollection<ActivityAttendee> Activities {get; set;}   

        // One to Many Relationship with the Photo entity
        public ICollection<Photo> Photos {get; set;}

        // Add the Following relationship
        public ICollection<UserFollowing> Followings {get; set;}

        public ICollection<UserFollowing> Followers {get; set;}

        
    }
}