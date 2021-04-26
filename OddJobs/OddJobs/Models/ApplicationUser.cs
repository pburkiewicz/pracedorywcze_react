﻿using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OddJobs.Models
{
    public class ApplicationUser : IdentityUser
    {
        public List<JobOrder> JobOrders;
        
        public List<JobOrder> JobsDone;
        
    }
}