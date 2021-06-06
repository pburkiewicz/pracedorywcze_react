﻿using System;
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
            UserManager<ApplicationUser> userManager) => (_context, _logger, _userManager) = (context, logger, userManager);


        [HttpGet("api/{threadId:Guid}/messages")]
        [Authorize]
        public async Task<IActionResult> GetMessages(Guid threadId)
        {
            var query = await _context.Messages.Where(m => m.Thread.Id == threadId)
                .Include(m=>m.Sender).OrderByDescending(m=> m.SendTime).ToListAsync();
            return Ok(query);
        }
        
        [HttpGet("api/{threadId:Guid}")]
        [Authorize]
        public async Task<IActionResult> GetThread(Guid threadId)
        {
            var query = await _context.Threads.Where(t => t.Id == threadId)
                .Include(t => t.JobOrder).ToListAsync();
            return Ok(query.First());
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

        [HttpGet("api/getThreads")]
        [Authorize]
        public async Task<IActionResult> GetThreads()
        {
            var user = await _userManager.GetUserAsync(User);
           
            var messages = _context.Messages.Where(message => message.Thread.JobOrder.PrincipalId == user.Id
                                                                    || message.Thread.InterestedUser.Id == user.Id)
                .Include("Thread").Include("Thread.JobOrder").Include("Thread.JobOrder.Principal").Include("Thread.InterestedUser").AsEnumerable()
                .GroupBy(x => x.Thread.Id).Select(x => x.Last());
       
            if (user != null)
            {
                return Ok(messages);
            }
            
            
            return Ok(false);
        }

        [HttpPost("api/{jobId:int}/getThread")]
        [Authorize]
        public async Task<IActionResult> GetThreadFromJobId(int jobId)
        {
            var user = await _userManager.GetUserAsync(User);
            
            var thread = await _context.Threads.Where(t => t.JobOrder.ID == jobId && t.InterestedUser.Id == user.Id)
                .ToListAsync();

            if (thread.Count != 0)
            {
                return Ok(thread.First().Id);
            }

            return Ok(false);
        }

        [HttpGet("api/{jobId:int}/getInterestedUsers")]
        [Authorize]
        public async Task<IActionResult> GetInterestedUsers(int jobId)
        {
            var user = await _userManager.GetUserAsync(User);
            var job = await _context.JobOrders.FindAsync(jobId);

            if (job == null) return NotFound();
            if(job.PrincipalId != user.Id) return Unauthorized();
            
            var interestedUsers = await _context.Threads.Where(t => t.JobOrder.ID == jobId)
                .Select(t => t.InterestedUser).ToListAsync();

            return Ok(interestedUsers);
        }
    }
}