using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace OddJobs.Models
{
    [Index(nameof(Id))]
    public class Thread
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public ApplicationUser Principal { get; set; }
        
        [Required]
        public ApplicationUser Worker { get; set; }
        
        [Required]
        public JobOrder JobOrder { get; set; }
        
    }
}