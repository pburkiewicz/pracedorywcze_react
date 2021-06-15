using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
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
            UserManager<ApplicationUser> userManager) =>
            (_context, _logger, _userManager) = (context, logger, userManager);


        [HttpGet("api/{threadId:Guid}/messages")]
        [Authorize]
        /**
        * Get messages from given threadId sorted in chronological order
        * User must be logged and added to conversation
        **/
        public async Task<IActionResult> GetMessages(Guid threadId)
        {
            var threads = await _context.Threads.Where(t => t.Id == threadId)
                .Include(t => t.JobOrder).Include(t => t.InterestedUser).ToListAsync();

            if (threads.Count == 0) return NotFound();

            var thread = threads.First();

            var user = await _userManager.GetUserAsync(User);

            if (!(user.Id != thread.InterestedUser.Id || user.Id != thread.JobOrder.PrincipalId)) return Unauthorized();

            var query = await _context.Messages.Where(m => m.Thread.Id == threadId)
                .Include(m => m.Sender).OrderByDescending(m => m.SendTime).ToListAsync();

            return Ok(query);
        }

        [HttpGet("api/{threadId:Guid}")]
        [Authorize]
        /**
        * Get threat with the given threadId
        * User must be logged and added to conversation
                **/
        public async Task<IActionResult> GetThread(Guid threadId)
        {
            var user = await _userManager.GetUserAsync(User);

            var query = await _context.Threads.Where(t => t.Id == threadId).Include(t => t.InterestedUser)
                .Include(t => t.JobOrder).ThenInclude(t => t.Principal).ToListAsync();

            if (query.Count == 0) return NotFound();

            var thread = query.First();

            if (!(user.Id != thread.InterestedUser.Id || user.Id != thread.JobOrder.PrincipalId)) return Unauthorized();

            return Ok(thread);
        }


        [HttpPost("api/{threadId:Guid}")]
        [Authorize]
        /**
        * Add given message (from body) to thread with given id
        * User must be logged and added to conversation
            **/
        public async Task<IActionResult> SendMessage(Guid threadId, [FromBody] BasicMessage message)
        {
            if (message.MessageText.Length == 0 || message.MessageText.Length > 200) return BadRequest();
            var threads = await _context.Threads.Where(t => t.Id == threadId)
                .Include(t => t.JobOrder).Include(t => t.InterestedUser).ToListAsync();

            if (threads.Count == 0) return NotFound();

            var thread = threads.First();

            var user = await _userManager.GetUserAsync(User);

            if (!(user.Id != thread.InterestedUser.Id || user.Id != thread.JobOrder.PrincipalId)) return Unauthorized();

            if (user.Id == thread.InterestedUser.Id)
            {
                thread.InterestedUserRead = true;
                thread.PrincipalRead = false;
            }
            else
            {
                thread.InterestedUserRead = false;
                thread.PrincipalRead = true;
            }

            var mes = new Message
            {
                MessageText = message.MessageText,
                Thread = thread,
                SendTime = DateTime.Now,
                Sender = user,
                SpecialMessage = false
            };

            _context.Messages.Add(mes);

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("api/getThreads")]
        [Authorize]
        /**
        * Get list of threads to whose user is added
        * User must be logged
                **/
        public async Task<IActionResult> GetThreads()
        {
            var user = await _userManager.GetUserAsync(User);

            var messages = _context.Messages.Where(message => message.Thread.JobOrder.PrincipalId == user.Id
                                                              || message.Thread.InterestedUser.Id == user.Id)
                .Include("Thread").Include("Thread.JobOrder").Include("Thread.JobOrder.Principal")
                .Include("Thread.InterestedUser")
                .AsEnumerable()
                .GroupBy(x => x.Thread.Id).Select(x => x.Last())
                .Select(m => new
                {
                    message = m,
                    correspondent = user.Id == m.Thread.InterestedUser.Id
                        ? m.Thread.JobOrder.Principal
                        : m.Thread.InterestedUser
                });

            return user != null ? Ok(messages) : Ok(false);
        }

        [HttpPost("api/{jobId:int}/getThread")]
        [Authorize]
        /**
        * Get thread for job witch given jobId. Thread is returned based on user.
        * User must be logged
                **/
        public async Task<IActionResult> GetThreadFromJobId(int jobId)
        {
            var user = await _userManager.GetUserAsync(User);

            var thread = await _context.Threads.Where(t => t.JobOrder.ID == jobId && t.InterestedUser.Id == user.Id)
                .ToListAsync();

            return thread.Count != 0 ? Ok(thread.First().Id) : Ok(false);
        }

        [HttpGet("api/{jobId:int}/getInterestedUsers")]
        [Authorize]
        /**
        * Get list of users who subscribed (send message) to job offer with the given id
        * User must be logged
                **/
        public async Task<IActionResult> GetInterestedUsers(int jobId)
        {
            var user = await _userManager.GetUserAsync(User);
            var job = await _context.JobOrders.FindAsync(jobId);

            if (job == null) return NotFound();
            if (job.PrincipalId != user.Id) return Unauthorized();

            var interestedUsers = await _context.Threads.Where(t => t.JobOrder.ID == jobId)
                .Select(t => t.InterestedUser).ToListAsync();

            return Ok(interestedUsers);
        }

        [HttpPut("api/{threadId:guid}")]
        [Authorize]
        /**
        * Mark thread with the given number as seen
        * User must be logged
                **/
        public async Task<IActionResult> ReadMessage(Guid threadId)
        {
            var user = await _userManager.GetUserAsync(User);
            var thread = await _context.Threads.Include(t => t.JobOrder)
                .Include(t => t.InterestedUser).FirstOrDefaultAsync(t => t.Id == threadId);

            if (thread == null) return NotFound();
            if (!(user.Id != thread.InterestedUser.Id || user.Id != thread.JobOrder.PrincipalId)) return Unauthorized();

            if (user.Id == thread.InterestedUser.Id)
            {
                thread.InterestedUserRead = true;
            }
            else
            {
                thread.PrincipalRead = true;
            }

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("api/unread")]
        [Authorize]
        /**
        * Remove seen flag from thread with given id.
        * User must be logged
                **/
        public async Task<IActionResult> UnreadMessages()
        {
            var user = await _userManager.GetUserAsync(User);
            var threads = await _context.Threads.Include(t => t.JobOrder)
                .Include(t => t.InterestedUser)
                .Where(t => t.JobOrder.PrincipalId == user.Id && t.PrincipalRead == false ||
                            t.InterestedUser.Id == user.Id && t.InterestedUserRead == false)
                .ToListAsync();

            return Ok(threads.Count);
        }
    }
}