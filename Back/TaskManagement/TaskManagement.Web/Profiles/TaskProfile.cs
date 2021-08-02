using AutoMapper;

namespace TaskManagement.Web.Profiles
{
    public class TaskProfile : Profile
    {
        public TaskProfile()
        {
            CreateMap<Web.Models.Task, DataAccess.Models.Task>().ReverseMap();
            CreateMap<Web.Models.Task, EmailService.Models.Task>().ReverseMap();
            CreateMap<DataAccess.Models.Task, EmailService.Models.Task>().ReverseMap();
        }
    }
}
