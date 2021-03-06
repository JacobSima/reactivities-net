using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace Persistence
{
  public class DataContext : IdentityDbContext<AppUser>
  {
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Activity> Activities {get; set;}

    public DbSet<ActivityAttendee> ActivityAttendees {get; set;}

    // DB Set for the Photos in Case with want to query the phot link
    public DbSet<Photo> Photos {get; set;} 

    // Add Comment in DB
    public DbSet<Comment> Comments {get; set;}

    // Add DB set for Userfollowings
    // and will add the configurations as well
    public DbSet<UserFollowing> UserFollowings {get; set;}


    // Configuration for Many-to-Many relations between
    // Activity-AppUser 
    // Activity : ICollection<ActivityAttendee> Attendees
    // AppUser  : ICollection<ActivityAttendee> Activities
    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);

      builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new{aa.AppUserId, aa.ActivityId}));

      builder.Entity<ActivityAttendee>()
        .HasOne(u => u.AppUser)
        .WithMany(a => a.Activities)
        .HasForeignKey(aa => aa.AppUserId);

      builder.Entity<ActivityAttendee>()
        .HasOne(u => u.Activity)
        .WithMany(a => a.Attendees)
        .HasForeignKey(aa => aa.ActivityId);

      // add the Cascade deleting, if Activity deleted then delete all comment related 
      // to the activity
      builder.Entity<Comment>()
        .HasOne(a => a.Activity)
        .WithMany(c => c.Comments)
        .OnDelete(DeleteBehavior.Cascade);

      // Configuration for UserFollowing
      // Using the builder action
      builder.Entity<UserFollowing>(b => 
      {
        b.HasKey(k => new {k.ObserverId, k.TargetId});

        b.HasOne(o => o.Observer)
            .WithMany(f => f.Followings)
            .HasForeignKey(o => o.ObserverId)
            .OnDelete(DeleteBehavior.Cascade); // delete userFollowing if user deleted


        b.HasOne(o => o.Target)
            .WithMany(f => f.Followers)
            .HasForeignKey(o => o.TargetId)
            .OnDelete(DeleteBehavior.Cascade); // delete userFollower if user deleted
      });

    }

    
  }
}