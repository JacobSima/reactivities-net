using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command  : IRequest<Result<Unit>>
        {
            public Guid Id {get; set;}

        }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        public Handler(DataContext context, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _context = context;

        }

        public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await _context.Activities
                            .Include(a => a.Attendees)
                            .ThenInclude(u => u.AppUser)
                            .FirstOrDefaultAsync(x => x.Id == request.Id);

            if(activity == null) return null;   // This will result to 404 

            var user = await _context.Users
                        .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

            if(user == null) return null;

            var HostUsername = activity
                                .Attendees
                                .FirstOrDefault(x => x.IsHost)?
                                .AppUser?
                                .UserName;

            var attendance  = activity
                                .Attendees
                                .FirstOrDefault(x => x.AppUser.UserName == user.UserName);
            
            // The user making this request is really the host
            // Then Toggle this to cancel or not cancelled
            if(attendance != null && HostUsername == user.UserName) 
            {
                activity.IsCancelled = !activity.IsCancelled;
            }

            // The user making this request is not the host
            // Remove the User to the list of the attendance
            if(attendance != null && HostUsername != user.UserName) 
            {
                activity.Attendees.Remove(attendance);
            }

            // Add the User to the list of the attendance
            if(attendance == null)
            {
                var NewAttendance = new ActivityAttendee 
                {
                    AppUser = user,
                    Activity = activity,
                    IsHost = false
                };
                activity.Attendees.Add(NewAttendance);
            }

            var result = await _context.SaveChangesAsync() > 0;

            return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failure updating attendance");

        }
    }
  }
}