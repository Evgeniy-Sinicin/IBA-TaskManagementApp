﻿using System;

namespace TaskManagement.Web.Models
{
    public class Task
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string UserEmail { get; set; }
    }
}