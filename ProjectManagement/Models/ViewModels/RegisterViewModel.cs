using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ProjectManagement.Models.ViewModels
{
    public class RegisterViewModel
    {
        public string Name { get; set; }
        public string SurName { get; set; }
        [EmailAddress]
        public string Email { get; set; }

        [PasswordPropertyText]
        public string Password { get; set; }

        [PasswordPropertyText]
        [Compare("Password", ErrorMessage = "Şifreler Uyuşmuyor!")]
        public string ConfirmPassword { get; set; }

    }
}
