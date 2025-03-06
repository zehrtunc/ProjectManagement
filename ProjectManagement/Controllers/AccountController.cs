using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjectManagement.Models;
using ProjectManagement.Models.ViewModels;

namespace ProjectManagement.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        // DEPENDECY INJECTION
        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }
        [AllowAnonymous] // Giriş yapmadan erişilebilir
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if(ModelState.IsValid)
            {
                ApplicationUser user = new ApplicationUser(); // ApplicationUser nesnesi tipinde bir instance oluştulur.
                user.Email = model.Email;
                user.UserName = model.Email;
                user.Name = model.Name;
                user.SurName = model.SurName;

                // UserManager classinin CreateAsync() methodunun  password ile back store(db) user oluşturma
                IdentityResult result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "User"); // olusturulan user`a User rolu atandi(user basarili sekilde olusturulduysa)

                    return RedirectToAction("Login", "Account");
                }
                else
                {
                    foreach(IdentityError error in result.Errors)
                    {
                        ModelState.AddModelError("", error.Description);
                    }
                    return View(model); // Girilen bilgilerle beraber Register ekranina geri doner.
                }
                // ModelState içerisinde ConfirmPassword`e verdigimiz data annotation sayesinde password ile uyumluluğu kontrol edilir
                // ve uyumsuzluk durumunda hata mesajı basılır.
            }
            return View(model); // if içindeki durum karşılanmazsa kod akışı buraya gelecektir, elimizdeki veriler ekrana döndürülsün.
        }

        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if(ModelState.IsValid)
            {
                // Bu email adresine sahip kullanıcı var mı?
                await _signInManager.SignOutAsync(); //giris yapildiysa oncesinde cikisini yap
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);

                if (result.Succeeded)
                {
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ModelState.AddModelError("", "Giriş yapılamadı!!");
                    return View(model);
                }
            }

            ModelState.AddModelError("", "Bir hata olıştu!!");
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync(); //Cikis yaptir
            return RedirectToAction("Login");
        }
    }
}
