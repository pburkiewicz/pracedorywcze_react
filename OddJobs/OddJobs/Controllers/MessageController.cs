using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OddJobs.Data;
using OddJobs.Models;

namespace OddJobs.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<MessageController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;

        public MessageController(ApplicationDbContext context, ILogger<MessageController> logger,
            UserManager<ApplicationUser> userManager) => (_context, _logger, _userManager) = (context, logger, userManager);
        
        // [HttpPost]
        // public async Task<IActionResult> Send()
        // {
        //     
        // }
    }
}