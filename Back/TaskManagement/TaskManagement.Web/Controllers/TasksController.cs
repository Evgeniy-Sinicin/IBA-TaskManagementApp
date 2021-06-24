using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskManagement.Web.ModelsDB;

namespace TaskManagement.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly TaskStore store;

        public TasksController(TaskStore store)
        {
            this.store = store;
        }

        // TODO: This method is excess. It needs to delete.
        [HttpGet]
        [Route("")]
        public IActionResult GetTasks()
        {
            return Ok(store.Tasks);
        }
    }
}
