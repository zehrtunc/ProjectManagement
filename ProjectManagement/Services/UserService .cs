using Microsoft.AspNetCore.Identity;
using ProjectManagement.Models;
using ProjectManagement.Models.ViewModels.UserViewModels;
using ProjectManagement.Services.Common;
using System.Security.Claims;

namespace ProjectManagement.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(UserManager<ApplicationUser> userManager, IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
        }


        public async Task<ApplicationUser> GetCurrentUserAsync()
        {
            // HTTP Context kontrolü
            if (_httpContextAccessor.HttpContext == null)
            {
                return null; // Eğer HTTP bağlamı yoksa null döndür
            }

            // Kullanıcının oturum açıp açmadığını kontrol et
            if (!_httpContextAccessor.HttpContext.User.Identity.IsAuthenticated)
            {
                return null;
            }

            // HttpContext üzerinden oturumdaki kullanıcı kimliğini al
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return null; // Eğer kullanıcı oturum açmamışsa
            }

            // Veritabanından kullanıcıyı çek
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return null;
            }

            return user;
        }

        public async Task<UserInfoViewModel> GetCurrentUserInfoViewModelAsync()
        {
            ApplicationUser user = await GetCurrentUserAsync();

            if (user == null)
            {
                return new UserInfoViewModel
                {
                    FullName = "Guest",
                    Email = "guest@example.com",
                    Role = "Guest"
                };
            }

            // ViewModel'e map et ve döndür
            return new UserInfoViewModel
            {
                FullName = user.UserName, // Eğer tam isim tutuluyorsa buraya ekle
                Email = user.Email,
                //Role = (await _userManager.GetRolesAsync(user)).FirstOrDefault() // Kullanıcının rolünü al
                Role = string.Empty // Kullanıcının rolünü al
            };
        }
    }
}
