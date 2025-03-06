using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManagement.Models
{
    public class TaskCard
    {
        public int Id { get; set; }
        public string Header { get; set; }
        public string Context { get; set; }
        public short Status { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime DeadlineDate { get; set; }
        public DateTime LastModifiedDate { get; set; }

        //[ForeignKey("CreatedUser")]
        //public string CreatedBy { get; set; }
        public virtual ApplicationUser CreatedBy { get; set; } // CreatedBy_Id
        public virtual ApplicationUser DevelopedBy { get; set; }
        public virtual ApplicationUser LastModifiedBy { get; set; }
        public virtual List<TaskCardNote> Notes { get; set;  }
    }
}


//1.Yontem : sadece application user ile iliskilendirilirse
// AppliccationUser myUser = GetMyUser();
// Card myCard = new Card();
// myCard.CreatedUser = myUser;

//2.Yontem : Foreign Key kullanilirsa
// string myUserId = getMyId();
//  Card myCard = new Card();
// myCard.CreatedBy = myUserId;