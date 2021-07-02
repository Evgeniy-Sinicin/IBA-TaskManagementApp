using System;
using System.Collections.Generic;
using TaskManagement.DataAccess.Models;

namespace TaskManagement.DataAccess.Interfaces
{
    public interface IService<T>
    {
        public List<T> GetAll();
        public T Get(Guid id);
        public void Add(T item);
        public void Update(T item);
        public void Delete(Guid id);
    }
}
