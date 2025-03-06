using Microsoft.AspNetCore.Mvc.Rendering;

namespace ProjectManagement.Models.ViewModels.UserViewModels;

public class UserEditViewModel
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string SurName { get; set; }
    public List<SelectListItem> Roles { get; set; }
    public List<string> SelectedRoles { get; set; }
}
