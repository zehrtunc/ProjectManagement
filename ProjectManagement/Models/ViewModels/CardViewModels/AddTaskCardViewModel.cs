using System.ComponentModel.DataAnnotations;

namespace ProjectManagement.Models.ViewModels.CardViewModels
{
    public class AddTaskCardViewModel
    {
        [Required]
        public string Header { get; set; }
        [Required]
        public string Context { get; set; }

        [Required]
        public DateTime DeadlineDate { get; set; }
    }
}
