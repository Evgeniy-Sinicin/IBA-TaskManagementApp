using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using TaskManagement.DataAccess.Configurations;
using TaskManagement.DataAccess.Interfaces;
using TaskManagement.DataAccess.Models;

namespace TaskManagement.DataAccess.Services
{
    public class AccountService : IService<Account>
    {
        private readonly IMongoCollection<Account> _collection;

        public AccountService(IOptions<ConfigurationDB> config)
        {
            var mongoClient = new MongoClient(config.Value.ConnectionString);
            var db = mongoClient.GetDatabase(config.Value.DatabaseName);
            _collection = db.GetCollection<Account>(config.Value.AccountCollectionName);
        }

        public List<Account> GetAll()
        {
            return _collection.Find(a => true).ToList();
        }

        public Account Get(string id)
        {
            return _collection.Find(a => a.Id.Equals(id)).FirstOrDefault();
        }

        public void Add(Account item)
        {
            _collection.InsertOne(item);
        }

        public void Update(Account item)
        {
            _collection.ReplaceOne(a => a.Id.Equals(item.Id), item);
        }

        public void Delete(string id)
        {
            _collection.DeleteOne(a => a.Id.Equals(id));
        }
    }
}
