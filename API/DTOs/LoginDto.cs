using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs  // Data transfer Object
// is an object that carries data between processes
{
    public class LoginDto
    {
        public string Email {get; set;}

        public string Password {get; set;}
    }
}