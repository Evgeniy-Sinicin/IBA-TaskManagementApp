﻿using System;

namespace TaskManagement.EmailService.Models
{
    public enum Priority
    {
        Usual,
        Important,
        Critical,
    }

    public class Task
    {
        public bool IsNeedNotify { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string UserEmail { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime FinishDate { get; set; }
        public Priority Priority { get; set; }
    }
}
