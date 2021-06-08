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
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging.EventSource;

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
            _logger.LogDebug("{Lat}, {Lng}, {Buff}",lat, lng, buff);
            var x =  _context.JobOrders.Select(jobOrder => new
                {
                    jobOrder,
                    dist = 6371 * Math.Acos(
                        Math.Cos(Math.PI / 180 * lat) * Math.Cos(Math.PI / 180 * jobOrder.Latitude) *
                        Math.Cos(Math.PI / 180 * jobOrder.Longitude - Math.PI / 180 * lng) +
                        Math.Sin(Math.PI / 180 * lat) * Math.Sin(Math.PI / 180 * jobOrder.Latitude))
                })
                .Where(@t => @t.jobOrder.Active && @t.dist < buff)
                .OrderBy(@t => @t.dist).Take(100)
                .Select(@t =>   new Tuple<JobOrder,double>(@t.jobOrder, @t.dist)).ToList();
            _logger.LogDebug("{Count}",x.Count);
            return x;
        }

        [HttpGet("fetchdata/{principalName}")]
        public IEnumerable<JobOrder> FetchDataUser(string principalName)
        {
            var id = (from user in _context.Users where user.UserName.Equals(principalName) select user.Id).First();
            return (from jobOrder in _context.JobOrders
                where jobOrder.PrincipalId.Equals(id)
                select jobOrder).ToList();
        }
        
        [HttpGet("fetchdataReported")]
        [Authorize(Roles="Moderator")]
        public IEnumerable<JobOrder> FetchDataReported(string principalName)
        {
            var id = (from user in _context.Users where user.UserName.Equals(principalName) select user.Id).First();
            return (from jobOrder in _context.JobOrders
                where jobOrder.PrincipalId.Equals(id)
                select jobOrder).ToList();
        }



        [HttpGet("api/{id:int}")]
        public async Task<IActionResult> GetJob(int id)
        {
            var job = await _context.JobOrders.Where(j => j.ID == id).Include(j => j.Worker)
                .Include(j=> j.Principal).ToListAsync();
            if (job != null) return Ok(job.First());
            return NotFound();
        }
        
        [HttpPut("api/{id:int}")]
        [Authorize]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] JobForm jobForm)
        {
            var job = await _context.JobOrders.FindAsync(id);
            if (job == null) return NotFound();
            if (job.Principal != await _userManager.GetUserAsync(User)) return Unauthorized();
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
        
        [HttpPut("status/{id:int}")]
        [Authorize]
        public async Task<IActionResult> ChangeStatus(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            var job = await _context.JobOrders.FindAsync(id);
            
            if (job == null) return NotFound();
            if(user.Id != job.PrincipalId) return Unauthorized();
            
            job.Active = !job.Active;

            if (job.Active && job.WorkerId != null) {
                job.Worker = null;
                job.WorkerId = null;
            }
            
            await _context.SaveChangesAsync();
            return Ok();
        }
        
        [HttpPut("api/{id:int}/assignWorker")]
        [Authorize]
        public async Task<IActionResult> AssignWorker(int id, [FromBody] string workerId)
        {
            var user = await _userManager.GetUserAsync(User);
            var job = await _context.JobOrders.FindAsync(id);
            
            if (job == null) return NotFound();
            if(user.Id != job.PrincipalId) return Unauthorized();

            var worker = await _context.ApplicationUsers.FindAsync(workerId);
            
            job.Active = false;
            job.Worker = worker;
            job.WorkerId = workerId;
            
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("api/{id:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.JobOrders.FindAsync(id);
            if (job == null) return NotFound();
            if (job.Principal != await _userManager.GetUserAsync(User)) return Unauthorized();
            _context.Entry(job).State = EntityState.Deleted;
            await _context.SaveChangesAsync();
            return Ok();
        }
        
        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> AddJob([FromBody] JobForm jobForm)
        {
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
        
        [HttpPost("api/{jobId:int}/send")]
        [Authorize]
        public async Task<IActionResult> SendFirstMessage(int jobId, [FromBody] BasicMessage message)
        {
            var jobOrder = await _context.JobOrders.FindAsync(jobId);
            var user = await _userManager.FindByIdAsync(message.User);

            var thread = new Thread {
                JobOrder = jobOrder,
                InterestedUser = user,
            };
            
            var mes = new Message {
                MessageText = message.MessageText,
                Thread = thread,
                SendTime = DateTime.Now,
                Sender = user,
            };
            
            _context.Threads.Add(thread);
            _context.Messages.Add(mes);
            
            await _context.SaveChangesAsync();
            
            return Ok(thread);
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
    public class BasicMessage
    {
        public string MessageText { get; set; }
        public string User { get; set; }
    }
}