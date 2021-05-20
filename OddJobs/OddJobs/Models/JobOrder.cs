using System;
using System.ComponentModel.DataAnnotations;

using Microsoft.EntityFrameworkCore;

namespace OddJobs.Models
{
    [Index(nameof(Latitude), nameof(Longitude))]
    public class JobOrder
    {
        [Required]
        public int ID { get; set; }

        [Required]
        public int ProposedPayment { get; set; }

        [Required]
        public DateTime RegisteredTime { get; set;}

        public DateTime ExpirationTime{ get; set;}
        
        [Required]
        public DateTime StartDate { get; set;}

        [Required]
        public double Latitude{ get; set;}
        
        [Required]
        public double Longitude{ get; set;}

        [Required]
        public bool Reported{ get; set;}

        [Required]
        public bool Active{ get; set;}
        
        [Required]
        public double Salary{ get; set;}

        [Required]
        public string Title{ get; set;}

        public string Description{ get; set;}
        
        [Required]
        public string Address { get; set; }

        [Required]
        public ApplicationUser Principal{ get; set;}

        public ApplicationUser Worker{ get; set;}
        
        [Required]
        public string PrincipalId{ get; set;}
        
        public string WorkerId{ get; set;}
    }
}