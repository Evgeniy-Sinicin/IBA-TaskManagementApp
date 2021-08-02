using TaskManagement.EmailService.Models;
using Thread = System.Threading.Tasks.Task;

namespace TaskManagement.EmailService.Interfaces
{
    public interface IEmailSender
    {
        public Thread SendTaskEmailAsync(Task task, Message message);
    }
}
