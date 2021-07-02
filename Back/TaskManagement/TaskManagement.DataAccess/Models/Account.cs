using MongoDB.Bson.Serialization.Attributes;
using System;

namespace TaskManagement.DataAccess.Models
{
    public enum Role
    {
        User,
        Admin
    }

    public class Account
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public Guid Id { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public Role[] Roles { get; set; }
    }
}
