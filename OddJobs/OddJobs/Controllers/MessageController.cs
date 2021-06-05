using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NpgsqlTypes;
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


        [HttpGet("api/{threadId:Guid}")]
        [Authorize]
        public async Task<IActionResult> GetMessages(Guid threadId)
        {
            var query = await _context.Messages.Where(message => message.Thread.Id == threadId)
                .Include(m => m.Thread)
                .Include(m => m.Sender).ToListAsync();
            return Ok(query);
        }
        
        [HttpPost("api/{threadId:Guid}")]
        [Authorize]
        public async Task<IActionResult> SendFirstMessage(Guid threadId, [FromBody] BasicMessage message)
        {
            var thread = await _context.Threads.FindAsync(threadId);
            var user = await _userManager.FindByIdAsync(message.User);

            var mes = new Message {
                MessageText = message.MessageText,
                Thread = thread,
                SendTime = DateTime.Now,
                Sender = user,
            };
            _context.Messages.Add(mes);
            
            await _context.SaveChangesAsync();
            
            return Ok();
        }

    }
}