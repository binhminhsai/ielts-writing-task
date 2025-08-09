using System;
using System.Collections.Generic;

namespace BusinessObject;

public partial class WritingTask1
{
    public int Id { get; set; }

    public int? Usersid { get; set; }

    public string? Question { get; set; }

    public string? ImagePath { get; set; }

    public string? Answer { get; set; }

    public virtual User? Users { get; set; }
}
