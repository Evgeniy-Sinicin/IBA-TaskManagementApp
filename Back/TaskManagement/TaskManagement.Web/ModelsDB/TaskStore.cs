using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaskManagement.Web.ModelsDB
{
    public class TaskStore
    {
        public List<Task> Tasks => new List<Task>()
        {
            new Task { Id = 1, Name = "Task 1", Description = "Description 1"},
            new Task { Id = 2, Name = "Task 2", Description = "Description 2"},
            new Task { Id = 3, Name = "Task 3", Description = "Description 3"},
            new Task { Id = 4, Name = "Task 4", Description = "Description 4"}
        };

        public Dictionary<Guid, int[]> Owners => new Dictionary<Guid, int[]>
        {
            { Guid.Parse("78976017-e3bc-441b-9149-e60e0d8426b3"), new int[] { 1, 3, 4 } },
            { Guid.Parse("b896ab24-edb4-4dc7-a4ef-fe6184003f02"), new int[] { 2 } }
        };
    }
}
