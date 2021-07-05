namespace TaskManagement.Web.Models
{
    public enum Role
    {
        User,
        Admin
    }

    public class Account
    {
        public string Id { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public Role[] Roles { get; set; }
    }
}
