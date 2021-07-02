using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using TaskManagement.DataAccess.Interfaces;
using TaskManagement.DataAccess.Models;

namespace TaskManagement.DataAccess.Services
{
    public class AccountService : IService<Account>
    {
        private const string FILE_PATH = "users.json";
        private List<Account> _accounts = new List<Account>();

        public List<Account> GetAll()
        {
            ReadAccs();

            return _accounts;
        }

        public Account Get(Guid id)
        {
            return GetAll().SingleOrDefault(a => a.Id.Equals(id));
        }

        public void Add(Account item)
        {
            ReadAccs();

            _accounts.Add(item);

            WriteAccs();
        }

        public void Update(Account item)
        {
            var original = Get(item.Id);

            original.Phone = item.Phone;
            original.Email = item.Email;
            original.PasswordHash = item.PasswordHash;
            original.Roles = item.Roles;

            WriteAccs();
        }

        public void Delete(Guid id)
        {
            ReadAccs();

            _accounts = _accounts.Where(a => !a.Id.Equals(id)).ToList();

            WriteAccs();
        }

        private async void ReadAccs()
        {
            var json = await System.IO.File.ReadAllTextAsync(FILE_PATH);
            _accounts = JsonConvert.DeserializeObject<List<Account>>(json);
        }

        private async void WriteAccs()
        {
            var json = JsonConvert.SerializeObject(_accounts);
            await System.IO.File.WriteAllTextAsync(FILE_PATH, json);
        }
    }
}
