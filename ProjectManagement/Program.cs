using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ProjectManagement.Data;
using ProjectManagement.Models;
using ProjectManagement.Services.Common;
using ProjectManagement.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseLazyLoadingProxies().UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

//builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
//    .AddEntityFrameworkStores<ApplicationDbContext>();

// IdentityUser servisi ekleme
builder.Services.AddIdentity<ApplicationUser, ApplicationRole>() // AddIdentity ile identity servisi eklenmistir
    .AddEntityFrameworkStores<ApplicationDbContext>() // Entity framework core ile Identity User yapisi ortak calismaktadir
    .AddDefaultTokenProviders(); // TOken yapisi, guvenlik icin iretilen bir keydir.
builder.Services.AddControllersWithViews();

// Kullan�c� servisini ekle
builder.Services.AddScoped<IUserService, UserService>(); //UserService`ni asp.net core`da tanimlatiyoruz ki Dependecy Incejtion yapabilmek icin
builder.Services.AddScoped<IdentityService>(); // Kendi yazdigim IdentityService DI yapabilmek icin servisi register ettim.
builder.Services.AddHttpContextAccessor(); // HttpContext'e eri�mek i�in gerekli

//Authorize Routing
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login"; // Yetkisiz kullan�c�lar� Login sayfas�na y�nlendir
    options.AccessDeniedPath = "/Account/Login"; // Yetkisi olmayanlar� buraya y�nlendir
});

var app = builder.Build();

// Roller ve admin kullan�c�s�n� olu�tur (Service'i burada �a��r�yoruz)
using (var scope = app.Services.CreateScope())
{
    IdentityService identityService = scope.ServiceProvider.GetRequiredService<IdentityService>();
    await identityService.SeedRolesAndAdminUser();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();//Kimlik dogrulama

app.UseAuthorization();//Yetkilendirme

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
//app.MapRazorPages();

app.Run();


//int? myInt = null;
//DateTime? createDate = null;

// non-nullable = null de�er atanamayan de�i�kenler.
// nullable = null de�er atanabilen de�i�kenler.