using AutoMapper;

namespace TaskManagement.Web.Profiles
{
    public class AccountProfile : Profile
    {
        public AccountProfile()
        {
            CreateMap<Web.Models.Account, DataAccess.Models.Account>().ReverseMap();
        }
    }
}
