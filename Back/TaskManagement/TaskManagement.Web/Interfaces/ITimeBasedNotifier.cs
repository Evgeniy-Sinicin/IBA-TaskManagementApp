using System.Threading;
using Task = System.Threading.Tasks.Task;

namespace TaskManagement.Web.Interfaces
{
    public interface ITimeBasedNotifier
    {
        public Task NotifyAll(CancellationToken token);
    }
}
