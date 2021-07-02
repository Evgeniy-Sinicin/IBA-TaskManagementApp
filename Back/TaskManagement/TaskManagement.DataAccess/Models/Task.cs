using MongoDB.Bson.Serialization.Attributes;
using System;

namespace TaskManagement.DataAccess.Models
{
    public class Task
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid UserId { get; set; }
    }
}
