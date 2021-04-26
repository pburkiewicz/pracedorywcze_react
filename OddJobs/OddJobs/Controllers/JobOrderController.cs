using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OddJobs.Data;
using OddJobs.Models;

namespace OddJobs.Controllers
{
    [Route("[controller]")]
    public class JobOrderController
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<JobOrderController> _logger;

        public JobOrderController(ApplicationDbContext context, ILogger<JobOrderController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("{l}/{r}/{u}/{d}")]
        public IEnumerable<JobOrder> FetchData(double left,double right, double up, double down)
        {
            return from jobOrder in _context.JobOrders
                where jobOrder.Latitude>down && jobOrder.Latitude<up &&
                      jobOrder.Longitude>left && jobOrder.Longitude>right 
                        select jobOrder;
        }
        
    }
}