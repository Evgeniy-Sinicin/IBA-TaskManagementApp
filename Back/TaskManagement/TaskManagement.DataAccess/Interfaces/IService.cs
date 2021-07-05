using MongoDB.Driver;
using System;
using System.Collections.Generic;

namespace TaskManagement.DataAccess.Interfaces
{
    public interface IService<T>
    {
        public List<T> GetAll();
        public T Get(string id);
        public void Add(T item);
        public void Update(T item);
        public void Delete(string id);
    }
}
