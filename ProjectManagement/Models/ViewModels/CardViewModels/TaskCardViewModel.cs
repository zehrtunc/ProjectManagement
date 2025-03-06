namespace ProjectManagement.Models.ViewModels.CardViewModels
{
    public class TaskCardViewModel
    {
        public int Id { get; set; }
        public string Header { get; set; }
        public string Context { get; set; }
        public short Status { get; set; }

        public DateTime CreateDate { get; set; }
        public DateTime DeadlineDate { get; set; }
        public string CreatedByAvatar { get; set; }

    }
}
