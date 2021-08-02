using MimeKit;
using System.Collections.Generic;
using System.Linq;

namespace TaskManagement.EmailService.Models
{
    public class Message
    {
        public List<MailboxAddress> To { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }

        public Message(IEnumerable<string> to, string subject, string content)
        {
            To = new List<MailboxAddress>();
            Subject = subject;
            Content = content;

            To.AddRange(to.Select(x => new MailboxAddress(x)));
        }
    }
}
