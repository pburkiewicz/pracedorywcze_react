using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OddJobs.Data;

namespace OddJobs.Controllers
{
    public class ValidationController : ControllerBase
    {
        
        private readonly ApplicationDbContext _context;

        public ValidationController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        [HttpPost]
        public IActionResult CheckUserExist(string Email)
        {
            var applicationUsers =  _context.ApplicationUsers.Where(u => u.Email.Equals(Email));
            return Content(!applicationUsers.Any() ? "true" : "false");
        }
    }
}