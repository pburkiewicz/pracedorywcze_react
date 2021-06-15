using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace OddJobs.Models
{
    [Index(nameof(Id))]
    public class Message
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        public string MessageText { get; set; }
        
        [Required]
        public Thread Thread { get; set; }
        
        [Required]
        public ApplicationUser Sender { get; set; }
        
        [Required]
        public DateTime SendTime { get; set; }
        
        public bool SpecialMessage { get; set; }
    }
}