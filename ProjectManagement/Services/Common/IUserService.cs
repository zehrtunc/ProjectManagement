using ProjectManagement.Models;
using ProjectManagement.Models.ViewModels.UserViewModels;
using System.Threading.Tasks;

namespace ProjectManagement.Services.Common
{
    public interface IUserService
    {
        Task<ApplicationUser> GetCurrentUserAsync();
        Task<UserInfoViewModel> GetCurrentUserInfoViewModelAsync();
    }
}
