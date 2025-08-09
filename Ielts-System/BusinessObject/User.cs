using System;
using System.Collections.Generic;

namespace BusinessObject;

public partial class User
{
    public int Id { get; set; }

    public string? Username { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public string? Role { get; set; }

    public DateTime? Createdat { get; set; }

    public virtual ICollection<WritingTask1> WritingTask1s { get; set; } = new List<WritingTask1>();
}
