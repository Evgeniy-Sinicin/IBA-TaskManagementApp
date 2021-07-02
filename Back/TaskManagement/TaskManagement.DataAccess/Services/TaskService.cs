using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using TaskManagement.DataAccess.Interfaces;
using TaskManagement.DataAccess.Models;

namespace TaskManagement.DataAccess.Services
{
    public class TaskService : IService<Task>
    {
        private const string FILE_PATH = "tasks.json";
        private List<Task> _tasks = new List<Task>();

        public List<Task> GetAll()
        {
            ReadTasks();

            return _tasks;
        }

        public Task Get(Guid id)
        {
            return GetAll().SingleOrDefault(t => t.Id.Equals(id));
        }

        public void Add(Task task)
        {
            ReadTasks();

            _tasks.Add(task);

            WriteTasks();
        }

        public void Update(Task task)
        {
            var original = Get(task.Id);

            original.Name = task.Name;
            original.Description = task.Description;
            original.UserId = task.UserId;

            WriteTasks();
        }

        public void Delete(Guid id)
        {
            ReadTasks();

            _tasks = _tasks.Where(t => !t.Id.Equals(id)).ToList();

            WriteTasks();
        }

        private async void ReadTasks()
        {
            var json = await System.IO.File.ReadAllTextAsync(FILE_PATH);
            _tasks = JsonConvert.DeserializeObject<List<Task>>(json);
        }

        private async void WriteTasks()
        {
            var json = JsonConvert.SerializeObject(_tasks);
            await System.IO.File.WriteAllTextAsync(FILE_PATH, json);
        }
    }
}
