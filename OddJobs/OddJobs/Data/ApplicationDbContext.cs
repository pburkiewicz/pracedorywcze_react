using OddJobs.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OddJobs.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public virtual DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public virtual DbSet<JobOrder> JobOrders { get; set; }
        
        public virtual DbSet<Message> Messages { get; set; }
        
        public virtual DbSet<Thread> Threads { get; set; }

        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
            ;
        }
    }
}