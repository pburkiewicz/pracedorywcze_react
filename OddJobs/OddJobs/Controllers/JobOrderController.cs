using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
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

        public JobOrderController(ApplicationDbContext context, ILogger<JobOrderController> logger)
        {
            _context = context;
            _logger = logger;
        }

        //https://localhost:5001/JobOrder/FetchData/l=18.997853&r=18.973813&u=50.199828&d=50.193317
        [HttpGet("fetchdata/{left}/{right}/{up}/{down}")]
        public IEnumerable<JobOrder> FetchData(double left,double right, double up, double down)
        {
            return (from jobOrder in _context.JobOrders
                where jobOrder.Latitude>down && jobOrder.Latitude<up &&
                      jobOrder.Longitude>left && jobOrder.Longitude<right 
                        select jobOrder).ToList();
        }
        
    }
}