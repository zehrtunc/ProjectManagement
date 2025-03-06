using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using ProjectManagement.Models;
using System;
using System.Threading.Tasks;

namespace ProjectManagement.Services
{
    public class IdentityService
    {
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public IdentityService(RoleManager<ApplicationRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        public async Task SeedRolesAndAdminUser()
        {
            string[] roleNames = { "User", "Developer", "ProjectManager", "Admin" };

            foreach (var roleName in roleNames)
            {
                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    await _roleManager.CreateAsync(new ApplicationRole { Name = roleName });
                }
            }

            await CreateAdminUser();
        }

        private async Task CreateAdminUser()
        {
            string adminEmail = "admin@admin.com";
            string adminPassword = "Asd123."; // Daha güvenli bir şifre belirleyin!

            var adminUser = await _userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(adminUser, adminPassword);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }
    }
}
