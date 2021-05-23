using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OddJobs.Data;
using OddJobs.Models;

namespace OddJobs.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class JobOrderController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<JobOrderController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;

        public JobOrderController(ApplicationDbContext context, ILogger<JobOrderController> logger, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _logger = logger;
            _userManager = userManager;
        }

        //https://localhost:5001/JobOrder/FetchData/l=18.997853&r=18.973813&u=50.199828&d=50.193317
        [HttpGet("fetchdata/{left:double}/{right:double}/{up:double}/{down:double}")]
        public IEnumerable<JobOrder> FetchData(double left,double right, double up, double down)
        {
            return (from jobOrder in _context.JobOrders
                where jobOrder.Active && jobOrder.Latitude>down && jobOrder.Latitude<up &&
                      jobOrder.Longitude>left && jobOrder.Longitude<right 
                        select jobOrder).ToList();
        }

        [HttpGet("api/{id:int}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var job = await _context.JobOrders.FindAsync(id);
            if (job != null) return Ok(job);
            return NotFound();
        }
        
        [HttpPut("api/{id:int}")]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] JobForm jobForm)
        {
            var job = await _context.JobOrders.FindAsync(id);
            if (job == null) return NotFound();
            job.Title = jobForm.Title;
            job.Description = jobForm.Description;
            job.Latitude = jobForm.Lat;
            job.Longitude = jobForm.Lng;
            job.ProposedPayment = jobForm.ProposedPayment;
            job.Address = jobForm.Address;
            job.StartDate = jobForm.Date;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("report/{id:int}")]
        public async Task<IActionResult> ReportJob(int id, [FromBody] string userId)
        {
            var job = await _context.JobOrders.FindAsync(id);
            if (job == null) return NotFound();
            job.Reported = true;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("api/{id:int}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = new JobOrder() { ID = id };
            _context.Entry(job).State = EntityState.Deleted;
            await _context.SaveChangesAsync();
            return Ok();
        }
        
        [HttpPost("add")]
        public async Task<IActionResult> AddJob([FromBody] JobForm jobForm)
        {
            // var user = HttpContext.User.Identity.Name;

            var user = await _userManager.FindByIdAsync(jobForm.User);
            var jobOrder = new JobOrder
            {
                Title = jobForm.Title,
                Description = jobForm.Description,
                Latitude = jobForm.Lat,
                Longitude = jobForm.Lng,
                ProposedPayment = jobForm.ProposedPayment,
                Address = jobForm.Address,
                Active = true,
                Reported = false,
                ExpirationTime = DateTime.Now.AddDays(60),
                RegisteredTime = DateTime.Now,
                StartDate = jobForm.Date,
                Principal = user,
                PrincipalId = jobForm.User
            };
            _context.JobOrders.Add(jobOrder);
            await _context.SaveChangesAsync();
            
            return Ok(jobOrder);
        }

    }
    
    public class JobForm
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public double ProposedPayment { get; set; }
        public DateTime Date { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public string Address { get; set; }
        public string User { get; set; }
    }
}