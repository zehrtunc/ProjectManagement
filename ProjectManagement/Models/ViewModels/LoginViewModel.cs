using System.ComponentModel.DataAnnotations;

namespace ProjectManagement.Models.ViewModels;

public class LoginViewModel
{
    [Required(ErrorMessage = "Email zorunludur.")]
    [EmailAddress(ErrorMessage = "Email formatında giriniz.")]
    public string Email { get; set; }

    [MinLength(6, ErrorMessage = "Şifre 6 karakterden az olamaz")]
    public string Password { get; set; }

    public bool RememberMe { get; set; }
}
