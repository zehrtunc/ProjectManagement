using Microsoft.AspNetCore.Mvc;
using ProjectManagement.Models.ViewModels.UserViewModels;
using ProjectManagement.Services.Common;
using System.ComponentModel;

namespace ProjectManagement.ViewComponents
{
    public class UserInfoViewComponent : ViewComponent
    {
        private readonly IUserService _userService;

        public UserInfoViewComponent(IUserService userService)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService)); ;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            UserInfoViewModel model = await _userService.GetCurrentUserInfoViewModelAsync();

            return View(model);
        }
    }
}
