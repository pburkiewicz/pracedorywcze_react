using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OddJobs.Models
{
    public class ApplicationUser : IdentityUser
    {
        // public Guid UserGuid { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public uint HouseNumber { get; set; }
        public uint FlatNumber { get; set; }
        public string ZipCode { get; set; }
    }
}