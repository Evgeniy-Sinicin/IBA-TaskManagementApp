using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Task = TaskManagement.Web.Models.Task;
using TaskDB = TaskManagement.DataAccess.Models.Task;
using AutoMapper;
using TaskManagement.DataAccess.Interfaces;

namespace TaskManagement.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly IService<TaskDB> _service;
        private readonly IMapper _mapper;
        private Guid UserId => Guid.Parse(User.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value);

        public TasksController(IService<TaskDB> service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize]
        [Route("")]
        public IActionResult GetTasks()
        {
            return Ok(_mapper.Map<List<Task>>(_service.GetAll()).Where(t => t.UserId.Equals(UserId)).ToList());
        }

        [HttpGet]
        [Authorize]
        [Route("task")]
        public IActionResult GetTask([FromHeader] Guid id)
        {
            var task = _mapper.Map<Task>(_service.Get(id));

            if (task == null)
            {
                return BadRequest($"Task is not found by id {id}");
            }

            if (!UserId.Equals(task.UserId))
            {
                BadRequest("You can't get foreign task");
            }

            return Ok(task);
        }

        [HttpPut]
        [Authorize]
        [Route("")]
        public IActionResult AddTask([FromBody] Task task)
        {
            task.Id = Guid.NewGuid();
            task.UserId = UserId;
            _service.Add(_mapper.Map<TaskDB>(task));

            return Ok();
        }

        [HttpPost]
        [Authorize]
        [Route("")]
        public IActionResult UpdateTask([FromBody] Task task)
        {
            _service.Update(_mapper.Map<TaskDB>(task));

            return Ok();
        }

        [HttpDelete]
        [Authorize]
        [Route("")]
        public IActionResult DeleteTask([FromHeader] Guid id)
        {
            _service.Delete(id);

            return Ok();
        }
    }
}
