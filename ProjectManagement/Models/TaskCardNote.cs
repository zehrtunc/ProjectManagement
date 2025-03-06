using Microsoft.CodeAnalysis.CodeActions;
using ProjectManagement.Models.Enums;

namespace ProjectManagement.Models
{
    public class TaskCardNote
    {
        public int Id { get; set; }
        public string Header { get; set; }
        public string Context { get; set; }
        public DateTime CreateDate { get; set; }
        public virtual ApplicationUser CreatedBy { get; set; } // bir`e bir iliski
        public virtual List<NoteFile> Files { get; set; } // bir`e cok iliski

    }
}
