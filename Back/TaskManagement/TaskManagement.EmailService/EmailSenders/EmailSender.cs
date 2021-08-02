using MailKit.Net.Smtp;
using MimeKit;
using System;
using TaskManagement.EmailService.Configurations;
using TaskManagement.EmailService.Interfaces;
using TaskManagement.EmailService.Models;
using Thread = System.Threading.Tasks.Task;

namespace TaskManagement.EmailService.EmailSenders
{
    public class EmailSender : IEmailSender
    {
        private readonly EmailConfiguration _emailConfig;

        public EmailSender(EmailConfiguration emailConfig)
        {
            _emailConfig = emailConfig;
        }

        public async Thread SendTaskEmailAsync(Task task, Message message)
        {
            var emailMessage = CreateTaskEmailMessage(task, message);

            await SendAsync(emailMessage);
        }

        private async Thread SendAsync(MimeMessage emailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(_emailConfig.SmtpServer, _emailConfig.Port, true);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    await client.AuthenticateAsync(_emailConfig.UserName, _emailConfig.Password);

                    await client.SendAsync(emailMessage);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    await client.DisconnectAsync(true);
                    client.Dispose();
                }
            }
        }

        private MimeMessage CreateTaskEmailMessage(Task task, Message message)
        {
            var emailMessage = new MimeMessage();

            emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
            emailMessage.To.AddRange(message.To);
            emailMessage.Subject = message.Subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text =
                "<!DOCTYPE html>" +
                "<html lang='en' xmlns='http://www.w3.org/1999/xhtml' xmlns:o='urn:schemas-microsoft-com:office:office'>" +
                "" +
                "<head>" +
                "<meta charset='UTF - 8'>" +
                "<meta name='viewport' content='width=device-width,initial-scale=1'>" +
                "<meta name='x-apple-disable-message-reformatting'>" +
                "<title></title>" +
                "<style>" +
                "table, td, div, h1, p, s { font - family: Arial, sans-serif; hyphens: auto; }" +
                "</style>" +
                "</head>" +
                "<body style='margin:0;padding:0;'>" +
                "<table role='presentation' style='width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;'>" +
                "<tr>" +
                "<td align='center' style='padding:0;'>" +
                "<table role='presentation' style='width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;'>" +
                "<tr>" +
                "<td align='center' style='padding:0px 0 0px 0;background:#ffffff;'>" +
                "<img src='https://st4.depositphotos.com/1007566/26468/v/600/depositphotos_264686922-stock-illustration-cute-animal-cartoon.jpg' alt='' width='300' style='height:auto;display:block;' />" +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='padding:0px 20px 20px 20px;'>" +
                "<table role='presentation' style='width:100%;border-collapse:collapse;border:0;border-spacing:0;'>" +
                "<tr>" +
                "<td style='padding:0 0 20px 0;color:#153643;'>" +
                "<h1 style='font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;'>Time for completing your task has expired &#9201;</h1>" +
                "<p style='margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>" +
                "Good day! 😜<br />" +
                $"Let me inform you that you did not have time to «{task.Name}» in time," +
                "but this is not terrible, since our web application did it for you. 😎" +
                "<br />" +
                "But just in case, we would recommend you to watch the guide from Shia" +
                "LaBeouf &#128373;, which will teach you not to be such a slacker. 🤣" +
                "</p>" +
                "<p style='margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>" +
                "<a href='https://www.youtube.com/watch?v=ZXsQAXx_ao0' style='color:#ee4c50;text-decoration:underline;font-weight:bold;'>Shia LaBeouf Guide? 🤔 <br /> What's this ... 🧐</a>" +
                "</p>" +
                "</td>" +
                "</tr>" +
                "<td style='padding:0;'>" +
                "<table role='presentation' style='width:100%;border-collapse:collapse;border:0;border-spacing:0;'>" +
                "<tr>" +
                "<td style='width:260px;padding:0;vertical-align:top;color:#153643;'>" +
                "<p style='margin:0 0 25px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>" +
                "<img src='https://sun9-35.userapi.com/impg/m_P94C4_QVldjuYINULtPXLg9s2Bdt_pPen3Rg/T3-wIsdet0s.jpg?size=250x140&quality=96&sign=431b9ef7eadd54802a47061ed29ee955&type=album' alt='' width='260' style='height:auto;display:block;' />" +
                "</p>" +
                "<p style='margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>" +
                "Our application is just wonderful! 🌈 <br />" +
                "It's completely free! 🙅‍♂️ 💰 <br />" +
                "If you don't believe our words," +
                "then go to it and see for yourself! 😉 <br />" +
                "But if after that there are no funds left on your credit card 💳, " +
                "we have nothing to do with it. 🙃" +
                "</p>" +
                "<p style='margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>" +
                "<a href='http://localhost:4200/' style='color:#ee4c50;text-decoration:underline;font-weight:bold;'>" +
                "Go to App 👉💻 <s>(Sponsor 💰)</s>" +
                "</a>" +
                "</p>" +
                "</td>" +
                "<td style='width:20px;padding:0;font-size:0;line-height:0;'>&nbsp;</td>" +
                "<td style='width:260px;padding:0;vertical-align:top;color:#153643;'>" +
                "<p style='margin:0 0 25px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>" +
                "<img src='https://sun9-60.userapi.com/impg/P030v7L-gBjn6mnt_ewAFKwOmqwzDZVjdJxADg/0SAnPheYR9M.jpg?size=250x140&quality=96&sign=403154c874621fc5d2420d9ffe1ebe6b&type=album' alt='' width='260' style='height:auto;display:block;' />" +
                "</p>" +
                "<p style='margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>" +
                "<div class='example-element-detail-content'>" +
                "<b style='color: #ee4c50;'>🤓 Task Info 👇</b>" +
                $"<div class='detail-content-field'><b>💬 Name: </b>{task.Name} " +
                $"<b>[ {task.Priority.ToString()} ⚠ ]" +
                "</b>" +
                "</div>" +
                "<div>" +
                $"<b>📃 Description: </b>{task.Description}" +
                "</div>" +
                "<div>" +
                $"<b>⏳ Start Date: </b>{task.StartDate.ToString("dd/MM/yyyy")}" +
                "</div>" +
                "<div>" +
                $"<b>⌛ Finish Date: </b>{task.FinishDate.ToString("dd/MM/yyyy")}" +
                "</div>" +
                "</div>" +
                "</p>" +
                "<p style='margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;'>" +
                "<a href='http://localhost:4200/login' style='color:#ee4c50;text-decoration:underline;font-weight:bold;'>" +
                "Rather Login & Edit It 📝🚪🏃‍♂️" +
                "</a>" +
                "</p>" +
                "</td>" +
                "</tr>" +
                "</table>" +
                "</td>" +
                "</tr>" +
                "</table>" +
                "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='padding:20px;background:#ee4c50;'>" +
                "<table role='presentation' style='width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;'>" +
                "<tr>" +
                "<td style='padding:0;width:75%;' align='left'>" +
                "<p style='margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;'>" +
                "&reg; Task Management App Specially for IBA at 2021 <br /> P.S. I'll be very grateful, If you support & listen my audios 🖤🎧🎸" +
                "</p>" +
                "</td>" +
                "<td style='padding:0;width:25%;' align='right'>" +
                "<table role='presentation' style='border-collapse:collapse;border:0;border-spacing:0;'>" +
                "<tr>" +
                "<td style='padding:0 0 0 10px;width:38px;'>" +
                "<a href='https://vk.com/music/playlist/173873859_80492970' style='color:#ffffff;'>" +
                "<img src='https://d338t8kmirgyke.cloudfront.net/icons/icon_pngs/000/008/356/original/romantic-music.png' alt='Music' width='38' style='height:auto;display:block;border:0;' />" +
                "</a>" +
                "</td>" +
                "<td style='padding:0 0 0 10px;width:38px;'>" +
                "<a href='https://vk.com/sample__text/' style='color:#ffffff;'>" +
                "<img src='https://cdn.iconscout.com/icon/free/png-256/vk-2690407-2232900.png' alt='VK' width='38' style='height:auto;display:block;border:0;' />" +
                "</a>" +
                "</td>" +
                "</tr>" +
                "</table>" +
                "</td>" +
                "</tr>" +
                "</table>" +
                "</td>" +
                "</tr>" +
                "</table>" +
                "</td>" +
                "</tr>" +
                "</table>" +
                "</body>" +
                "</html>"
            };

            return emailMessage;
        }
    }
}
