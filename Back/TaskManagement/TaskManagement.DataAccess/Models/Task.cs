using MongoDB.Bson.Serialization.Attributes;
using System;

namespace TaskManagement.DataAccess.Models
{
    public enum Priority
    {
        Usual,
        Important,
        Critical,
    }

    public class Task
    {
        public bool IsNeedNotify { get; set; }
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string UserEmail { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime FinishDate { get; set; }
        public Priority Priority { get; set; }
    }
}
