using Microsoft.Extensions.Logging;
using System.Threading;
using TaskManagement.DataAccess.Interfaces;
using TaskManagement.Web.Interfaces;
using Thread = System.Threading.Tasks.Task;
using Task = TaskManagement.Web.Models.Task;
using TaskDB = TaskManagement.DataAccess.Models.Task;
using EmailTask = TaskManagement.EmailService.Models.Task;
using System;
using TaskManagement.EmailService.Models;
using TaskManagement.EmailService.Interfaces;
using AutoMapper;

namespace TaskManagement.Web.BackgroundFeatures
{
    public class TimeBasedNotifier : ITimeBasedNotifier
    {
        private readonly IService<TaskDB> _service;
        private readonly IEmailSender _emailSender;
        private readonly IMapper _mapper;
        private readonly ILogger<TimeBasedNotifier> _logger;

        public TimeBasedNotifier(IService<TaskDB> service, IEmailSender emailSender, IMapper mapper, ILogger<TimeBasedNotifier> logger)
        {
            _service = service;
            _emailSender = emailSender;
            _mapper = mapper;
            _logger = logger;
        }

        public async Thread NotifyAll(CancellationToken token)
        {
            while(!token.IsCancellationRequested)
            {
                _service.GetAll().ForEach(async t =>
                {
                    if (t.IsNeedNotify &&
                        t.FinishDate < DateTime.UtcNow)
                    {
                        _logger.LogInformation($"!!! Notifier is notifing {t.UserEmail} !!!");

                        t.IsNeedNotify = false;

                        _service.Update(t);

                        await NotifyByTask(_mapper.Map<Task>(t));
                    }
                });

                await Thread.Delay(1000);
            }
        }

        private async Thread NotifyByTask(Task task)
        {
            var message = new Message(new string[] { "catpuff13337@gmail.com", task.UserEmail },
                                      $"You forgot to «{task.Name}»!",
                                      string.Empty);

            await _emailSender.SendTaskEmailAsync(_mapper.Map<EmailTask>(task), message);
        }
    }
}
