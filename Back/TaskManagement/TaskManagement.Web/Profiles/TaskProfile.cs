using AutoMapper;

namespace TaskManagement.Web.Profiles
{
    public class TaskProfile : Profile
    {
        public TaskProfile()
        {
            CreateMap<Web.Models.Task, DataAccess.Models.Task>().ReverseMap();
        }
    }
}
