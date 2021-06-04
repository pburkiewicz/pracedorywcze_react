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
        public ApplicationUser InterestedUser { get; set; }
        
        [Required]
        public JobOrder JobOrder { get; set; }
        
    }
}