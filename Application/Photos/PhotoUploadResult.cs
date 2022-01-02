using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Photos
{
    // Class which is the result from Cloudinary call
    public class PhotoUploadResult
    {
        public string PublicId {get; set;}

        public string Url {get; set;}
    }
}