using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TaskManagement.Web.ModelsDB;
using Task = TaskManagement.Web.ModelsDB.Task;

namespace TaskManagement.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OwnersController : ControllerBase
    {
        private readonly TaskStore store;

        private Guid UserId => Guid.Parse(User.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value);

        public OwnersController(TaskStore store)
        {
            this.store = store;
        }

        [HttpGet]
        [Authorize (Roles = "User")]
        [Route("")]
        public IActionResult GetTasks()
        {
            if (!store.Owners.ContainsKey(UserId))
            {
                return Ok(Enumerable.Empty<Task>());
            }

            var orderedTaskIds = store.Owners.Single(o => o.Key == UserId).Value;
            var orderedTasks = store.Tasks.Where(t => orderedTaskIds.Contains(t.Id));

            return Ok(orderedTasks);
        }
    }
}
