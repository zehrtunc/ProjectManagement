using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using ProjectManagement.Data;
using ProjectManagement.Models;
using ProjectManagement.Models.ViewModels.UserViewModels;
using ProjectManagement.Services.Common;

namespace ProjectManagement.Controllers
{
    
    public class UserController : Controller
    {    
        private readonly IUserService _userService;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(IUserService userService, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _userService = userService;
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> List()
        {
            List<UserListViewModel> users = new List<UserListViewModel>();

            foreach(ApplicationUser user in _context.Users)
            {
                // Her kullanıcının rollerini çekiyoruz.
                var roles = await _userManager.GetRolesAsync(user);

                // application useri UserInfoViewModel tipine dönüştürdük
                UserListViewModel userModal = new UserListViewModel()
                {
                    Id = user.Id, // User model`in idsine, entity modelimizin idsini atiyoruz yani View modelimizi entity modelden(aslinda veritabanimizin verilerini tutan model) veri cekerek dolduruyoruz 
                    FullName = user.Name + " " + user.SurName,
                    Email = user.Email,
                    Role = roles.Any() ? string.Join(", ", roles) : "Rol yok"
                };

                // UserInfoViewModel tipine dönüştürülen nesneyi listeye ekledik
                users.Add(userModal);
            }
            
            return View(users);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> Edit(string id) // Frontend to backend
        {
            ApplicationUser user = _context.Users.Find(id);

            List<SelectListItem> roles = _context.Roles
                .Select(role =>  new SelectListItem { Text = role.Name, Value = role.Name, Selected = false })
                .ToList(); // asliunda bir foreach donuyor foreach(var role in roles){ return role.Name } her bir role`un ismine erisebiliyoruz.

            var userRoles = await _userManager.GetRolesAsync(user);
            foreach(SelectListItem role in roles)
            {
                if (userRoles.Contains(role.Value))
                    role.Selected = true;
            }

            UserEditViewModel model = new UserEditViewModel();
            model.Name = user.Name;
            model.SurName = user.SurName;
            model.Roles = roles;
            model.Id = user.Id;

            return View(model); //Backend to frontend
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Edit(UserEditViewModel model)
        {
            // Edit edilecek Useri bul
            // User bilgilerini guncelle
            // User ile iliskilendirilmis rolleri temizle
            // Modelde selectedRoles icerisinde gelen roller ile useri iliskilendir

            ApplicationUser user = _context.Users.Find(model.Id); // ViewModel ile toplu olarak alinan veriden Id, onyuzde hidden olarak verilip bind edildigi icin erisebilmekteyiz.

            user.Name = model.Name; // Onyuzden cekilen veri db deki veriye atandi(veri guncellendi)
            user.SurName = model.SurName;

            var userRoles = await _userManager.GetRolesAsync(user); // user ile iliskilendirmis rol(leri)getir.
            await _userManager.RemoveFromRolesAsync(user, userRoles); // User ile iliskilendirilmis rolleri temizle

            await _userManager.AddToRolesAsync(user, model.SelectedRoles); // onyuzde select edilen roller kullanici uzerine atanir.

            _context.SaveChanges();

            return RedirectToAction("List", "User");
        }

        //[HttpGet]
        //public async Task<IActionResult> Delete(string id)
        //{
        //    ApplicationUser user = _context.Users.Find(id); // urlden gelen id, databasedeki id ile eslestigi kullaniciyi elde ederiz.
        //                                                    //_context.Users.Remove(user); // elde ettigim useri. db`deki users tablosundan sileriz. Kullanicinin alakali oldugu diger verileri temizleyemez(EF Core)
        //    if (user == null)
        //    {
        //        return NotFound("Kullanıcı bulunamadı.");
        //    }

        //    await _userManager.DeleteAsync(user); // useri db`den siler, kullanıcı ile ilişkili diğer verileri (roller, tokenler, claimler vs.) de otomatik olarak temizler.*(Asp.Net Core Identity)
        // Ancak manuel olarak kurulan iliskilerdeki kayitlari silmez Orn: Task Card => User.Id

        //    //  _context.SaveChanges(); Buna gerek yoktur cunku bu bir EF Core yapisina aittir.DeleteAsync() son durumu kayit eder

        //    return RedirectToAction("List", "User");
        //}


        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> Delete(string id)
        {
            Console.WriteLine($"Gelen ID: {id}"); // Konsolda kontrol et

            if (string.IsNullOrEmpty(id))
            {
                return BadRequest("ID boş olamaz.");
            }


            ApplicationUser user = _context.Users.Find(id); // User`in db`den gelen Id`si actiona gelen arguman ile ayniysa
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            Console.WriteLine($"Silinen Kullanıcı: {user.Name}");

            await _userManager.DeleteAsync(user);

            return RedirectToAction("List", "User");
        }

    }
}
