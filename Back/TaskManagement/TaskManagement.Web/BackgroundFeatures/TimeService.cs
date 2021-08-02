using Microsoft.Extensions.Hosting;
using Task = System.Threading.Tasks.Task;
using TaskManagement.Web.Interfaces;
using System.Threading;

namespace TaskManagement.Web.BackgroundFeatures
{
    public class TimeService : BackgroundService
    {
        private ITimeBasedNotifier _notifier;

        public TimeService(ITimeBasedNotifier notifier)
        {
            _notifier = notifier;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await _notifier.NotifyAll(stoppingToken);
        }
    }
}
