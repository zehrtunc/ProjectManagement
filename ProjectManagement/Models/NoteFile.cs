using ProjectManagement.Models.Enums;

namespace ProjectManagement.Models
{
    public class NoteFile
    {
        public int Id { get; set; }
        public byte[] Bytes { get; set; }
        public string Name { get; set; }
        public NoteFileType FileType { get; set; } // bu bir enum tipinden olusuturulmus tipten turemis properydir.
    }
}
