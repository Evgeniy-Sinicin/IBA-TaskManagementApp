using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using TaskManagement.DataAccess.Configurations;
using TaskManagement.DataAccess.Interfaces;
using TaskManagement.DataAccess.Models;

namespace TaskManagement.DataAccess.Services
{
    public class TaskService : IService<Task>
    {
        private readonly IMongoCollection<Task> _collection;

        public TaskService(IOptions<ConfigurationDB> config)
        {
            var mongoClient = new MongoClient(config.Value.Connection_String);
            var db = mongoClient.GetDatabase(config.Value.Database_Name);
            _collection = db.GetCollection<Task>(config.Value.Task_Collection_Name);
        }

        public List<Task> GetAll()
        {
            return _collection.Find(t => true).ToList();
        }

        public Task Get(string id)
        {
            try
            {
                return _collection.Find(t => t.Id.Equals(id)).FirstOrDefault();
            }
            catch (Exception)
            {
                return null;
            }
        }

        public void Add(Task task)
        {
            _collection.InsertOne(task);
        }

        public void Update(Task task)
        {
            _collection.ReplaceOne(t => t.Id.Equals(task.Id), task);
        }

        public void Delete(string id)
        {
            _collection.DeleteOne(t => t.Id.Equals(id));
        }
    }
}
