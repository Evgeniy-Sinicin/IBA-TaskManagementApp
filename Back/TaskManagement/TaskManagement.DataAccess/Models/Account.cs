using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

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
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public Role[] Roles { get; set; }
    }
}
