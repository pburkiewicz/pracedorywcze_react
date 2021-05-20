using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OddJobs.Data;
using OddJobs.Models;
using System;
using Microsoft.Extensions.Logging.EventSource;

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

        //https://localhost:5001/JobOrder/FetchDataBorders/l=18.997853&r=18.973813&u=50.199828&d=50.193317
        [HttpGet("fetchdata/{left}/{right}/{up}/{down}")]
        public IEnumerable<JobOrder> FetchDataBorders(double left,double right, double up, double down)
        {
            return (from jobOrder in _context.JobOrders
                where jobOrder.Active && jobOrder.Latitude>down && jobOrder.Latitude<up &&
                      jobOrder.Longitude>left && jobOrder.Longitude<right 
                        select jobOrder).ToList();
        }

        [HttpGet("fetchdata/{lat}/{lng}/{buff}")]
        public IEnumerable<Tuple<JobOrder, double>> FetchDataBUffer(double lat, double lng, double buff)
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
    

    }
}

// SELECT id, ( 6371 * acos( cos( radians(@LAT) ) * cos( radians( lat ) ) * 
//     cos( radians( lng ) - radians(@lng) ) + sin( radians(@LAT) ) * 
//     sin( radians( lat ) ) ) ) AS distance FROM your_table_name HAVING
// distance < 25 ORDER BY distance LIMIT 0 , 20;