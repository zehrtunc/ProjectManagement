using Microsoft.AspNetCore.Identity;

namespace ProjectManagement.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public string SurName { get; set; }
    }
}

