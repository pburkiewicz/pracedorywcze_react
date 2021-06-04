using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OddJobs.Data;
using OddJobs.Models;
using System;
using Microsoft.AspNetCore.Authorization;


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

        [HttpGet("fetchdata/{lat}/{lng}/{buff}")]
        public IEnumerable<Tuple<JobOrder, double>> FetchDataBuffer(double lat, double lng, double buff)
        {
            return GetByDistance(lat,lng,buff);
        }

        [HttpGet("fetchdata/{principalName}")]
        public IEnumerable<JobOrder> FetchDataUser(string principalName)
        {
            var id = (from user in _context.Users where user.UserName.Equals(principalName) select user.Id).First();
            return (from jobOrder in _context.JobOrders
                where jobOrder.PrincipalId.Equals(id)
                select jobOrder).ToList();
        }
        
        [HttpGet("fetchReported/{lat}/{lng}")]
        [Authorize(Roles="Moderator")]
        public   IEnumerable<Tuple<JobOrder, double>> FetchReported(double lat, double lng)
        {
        return GetByDistance(lat, lng, 500, true);
        }
        

        [HttpGet("api/{id:int}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var job = await _context.JobOrders.FindAsync(id);
            if (job != null) return Ok(job);
            return NotFound();
        }
        
        [HttpPut("api/{id:int}")]
        [Authorize]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] JobForm jobForm)
        {
            var job = await _context.JobOrders.FindAsync(id);
            if (job == null) return NotFound();
            var user = await _userManager.GetUserAsync(User);
            if (job.Principal != user) return Unauthorized();
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
        [Authorize]
        public async Task<IActionResult> ReportJob(int id, [FromBody] string userId)
        {
            var job = await _context.JobOrders.FindAsync(id);
            if (job == null) return NotFound();
            job.Reported = true;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("api/{id:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.JobOrders.FindAsync(id);
            if (job == null) return NotFound();
            var user = await _userManager.GetUserAsync(User);
            if (job.Principal != user) return Unauthorized();
            _context.Entry(job).State = EntityState.Deleted;
            await _context.SaveChangesAsync();
            return Ok();
        }
        
        [HttpPost("add")]
        [Authorize]
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

        public IEnumerable<Tuple<JobOrder, double>> GetByDistance(double lat, double lng, double buff, bool report = false)
        {
            return  _context.JobOrders.Select(jobOrder => new
                {
                    jobOrder,
                    dist = 6371 * Math.Acos(
                        Math.Cos(Math.PI / 180 * lat) * Math.Cos(Math.PI / 180 * jobOrder.Latitude) *
                        Math.Cos(Math.PI / 180 * jobOrder.Longitude - Math.PI / 180 * lng) +
                        Math.Sin(Math.PI / 180 * lat) * Math.Sin(Math.PI / 180 * jobOrder.Latitude))
                })
                .Where(@t => @t.jobOrder.Active && @t.dist < buff && (!report || t.jobOrder.Reported))
                .OrderBy(@t => @t.dist).Take(100)
                .Select(@t =>   new Tuple<JobOrder,double>(@t.jobOrder, @t.dist)).ToList();
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