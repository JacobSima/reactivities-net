using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
  public class List
  {
      public class Query : IRequest<Result<List<ActivityDto>>>{};

      public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
      {
          private readonly DataContext _context;
          private readonly IMapper _mapper;
          private readonly IUserAccessor _userAccessor;
          public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
          {
              _userAccessor = userAccessor;
              _mapper = mapper;
              _context = context;
          }

          public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
          {
            var Activities = await _context.Activities
                              // .Include(a => a.Attendees)
                              // .ThenInclude(u => u.AppUser)
                              .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                              new{currentUsername = _userAccessor.GetUsername()})
                              .ToListAsync(cancellationToken);
            
            // var activitiesToReturn = _mapper.Map<List<ActivityDto>>(Activities);
            // return Result<List<ActivityDto>>.Success(activitiesToReturn);
            
            return Result<List<ActivityDto>>.Success(Activities);
          }
      }
  }
}