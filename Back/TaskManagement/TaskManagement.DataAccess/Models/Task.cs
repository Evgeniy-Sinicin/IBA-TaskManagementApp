using MongoDB.Bson.Serialization.Attributes;

namespace TaskManagement.DataAccess.Models
{
    public class Task
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string UserEmail { get; set; }
    }
}
