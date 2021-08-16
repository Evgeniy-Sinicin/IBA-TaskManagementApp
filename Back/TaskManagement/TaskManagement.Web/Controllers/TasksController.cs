using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Task = TaskManagement.Web.Models.Task;
using TaskDB = TaskManagement.DataAccess.Models.Task;
using AutoMapper;
using TaskManagement.DataAccess.Interfaces;
using System;
using Microsoft.Extensions.Logging;

namespace TaskManagement.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly IService<TaskDB> _service;
        private readonly IMapper _mapper;
        private string UserEmail => User.Claims.Single(c => c.Type == ClaimTypes.Email).Value;

        public TasksController(IService<TaskDB> service, IMapper mapper, ILogger<TasksController> logger)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Route("all")]
        public IActionResult GetAllTasks()
        {
            return Ok(_mapper.Map<List<Task>>(_service.GetAll()).ToList());
        }

        [HttpGet]
        [Authorize]
        [Route("")]
        public IActionResult GetTasks()
        {
            return Ok(_mapper.Map<List<Task>>(_service.GetAll()).Where(t => t.UserEmail.Equals(UserEmail)).ToList());
        }
        
        [HttpGet]
        [Authorize]
        [Route("{id}")]
        public IActionResult GetTask(string id)
        {
            var task = _mapper.Map<Task>(_service.Get(id));

            if (task == null)
            {
                return BadRequest($"Task is not found by id {id}");
            }

            if (!task.UserEmail.Equals(UserEmail))
            {
                return BadRequest("You can't get foreign task");
            }

            return Ok(task);
        }

        [HttpPut]
        [Authorize]
        [Route("")]
        public IActionResult AddTask([FromBody] Task task)
        {
            if (!task.UserEmail.Equals(UserEmail))
            {
                return BadRequest("You aren't allowed to add task to foreign user");
            }

            task.StartDate = DateTime.Now;

            _service.Add(_mapper.Map<TaskDB>(task));

            return Ok();
        }

        [HttpPost]
        [Authorize]
        [Route("")]
        public IActionResult UpdateTask([FromBody] Task task)
        {
            if (_mapper.Map<Task>(_service.Get(task.Id)) == null)
            {
                return BadRequest($"Task is not found by id {task.Id}");
            }

            if (!task.UserEmail.Equals(UserEmail))
            {
                return BadRequest("You aren't allowed to update task of foreign user");
            }

            _service.Update(_mapper.Map<TaskDB>(task));

            return Ok();
        }

        [HttpDelete]
        [Authorize]
        [Route("{id}")]
        public IActionResult DeleteTask(string id)
        {
            var task = _mapper.Map<Task>(_service.Get(id));

            if (task == null)
            {
                return BadRequest($"Task is not found by id {id}");
            }

            if (!task.UserEmail.Equals(UserEmail))
            {
                return BadRequest("You aren't allowed to delete task of foreign user");
            }

            _service.Delete(id);

            return Ok();
        }
    }
}
