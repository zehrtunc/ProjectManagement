using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using ProjectManagement.Data;
using ProjectManagement.Models;
using ProjectManagement.Models.Common;
using ProjectManagement.Models.ViewModels.CardViewModels;
using ProjectManagement.Services.Common;
using System.Data;

namespace ProjectManagement.Controllers
{
    [Authorize]
    public class KanbanController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;
        private readonly UserManager<ApplicationUser> _userManager;
        public KanbanController(ApplicationDbContext context, IUserService userService, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userService = userService;
            _userManager = userManager;
        }


        [Produces("application/json")]
        [HttpPost]
        public async Task<IActionResult> GetCard()
        {
            List<TaskCardViewModel> cards = new();

            foreach(TaskCard card in _context.TaskCards)
            {
                TaskCardViewModel cardModel = new TaskCardViewModel() // TaskCardViewModel`ine TaskCard entity modelinden verileri dolduruyoruz.
                {
                    Id = card.Id,
                    Header = card.Header,
                    Context = card.Context,
                    Status = card.Status,
                    CreateDate = card.CreateDate,
                    DeadlineDate = card.DeadlineDate,
                    CreatedByAvatar = card.CreatedBy.Name[0].ToString() + card.CreatedBy.SurName[0].ToString()
                };
                cards.Add(cardModel); // TaskCardViewModel liste tipindeki cards`ima entityden cekilen ve TaskCardViewModel tipine donusturulen her bir cardi ekle.
            }

            return Ok(cards);

            //List<TaskCard> myCards = _context.TaskCards.ToList(); //veri tabanindan tum cardlari liste halinde cek

            //foreach (var card in _context.TaskCards.ToList()) { } // ToList dendiği vakit tablodaki bütün kartlar toplu çekilip belleğe alınır. Bellek yönetimi açısından riskli.
            //foreach (var card in _context.TaskCards) { } // Döngü içerisinde kart verilerini birer birer veri tabanından çeker.


            // TaskCardViewModel
            // Header, Context, DeadLineDate, CreateDate,
            // // string CreatedAvatar = "ZT"

            //string SurnameFirstLetter = myCards[0].CreatedBy.FullName.Split(' ')[1][0].ToString();   // Zehra Tunc
            //string createdAvatar = myCards[0].CreatedBy.FullName[0] + SurnameFirstLetter;


        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddCard([FromBody] AddTaskCardViewModel model)
        {
            Thread.Sleep(2000);
            try
            {
                ApplicationUser currentUser = await _userService.GetCurrentUserAsync(); // -> Db`den current user cekildi

                TaskCard task = new TaskCard()
                {
                    Header = model.Header,
                    Context = model.Context,
                    DeadlineDate = model.DeadlineDate,
                    CreateDate = DateTime.Now,
                    LastModifiedDate = DateTime.Now,
                    Status = 0,
                    CreatedBy = currentUser,
                    DevelopedBy = currentUser,
                    LastModifiedBy = currentUser
                };

                await _context.TaskCards.AddAsync(task);
                await _context.SaveChangesAsync();

                // Olusturulan bu anonim nesnesi JSON nesnesi olarak dündürülür: kanban.js`de declare edilen addCardToKanban(), board.cshtml`de cagrilarak Ajax cagrisi yapan kod tarafindan islenebilir
                // AJAX çağrısında bu veriyi alır ve Kanban Board'a yeni kart olarak ekler.
                return Ok(new
                {
                    Id = task.Id,
                    Header = task.Header,
                    Context = task.Context,
                    DeadlineDate = task.DeadlineDate,
                    Status = task.Status
                });
            }
            catch(Exception ex)
            {

                return BadRequest(new {message = "Hata oluştu", error = ex.Message });
            }
        }// requestin bodysinde bu model verisini arar

        public IActionResult Board() // Kanban Board yapisinin renderlayan action
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> UpdateCardStatus([FromBody] UpdateCardStatusViewModel model)
        {
            // Result adinda bir sınıf oluşturucaz. Message ve Success propertlerin olacak ve her ajax post actionlarında bu Result nesnesini döneceğiz.
            Result result = new Result();

            try
            {
                if(await IsUserAllowedAsync(model.Id, model.Status))
                {
                    var card = await _context.TaskCards.FindAsync(model.Id);
                    card.Status = model.Status;
                    _context.SaveChanges();

                    result = Result.Ok("Kartın statüsü başarılı bir şekilde güncellenmiştir.");

                    return Ok(result);
                }
                else
                {
                    // Kullanıcının yetkisi yoksa 403 Forbidden dönüyoruz
                    result = Result.Fail("Bu statü değişikliği için yetkiniz yok.");
                    return StatusCode(StatusCodes.Status403Forbidden, result);
                }
                

            }
            catch (Exception ex)
            {
                result = Result.Fail("Statü güncellenirken bir hata ile karşılaşıldı.");

                return BadRequest(result);
            }
        }

        /// <summary>
        /// Bir kartın satatüsü değiştirildiğinde, kullanıcının buna yetkisinin olup olmadığını kontrol eder.
        /// </summary>
        /// <param name="cardId">Statüsü güncellenecek olan kartın ID'si</param>
        /// <param name="status">Güncellenilmek istenilen yeni statü</param>
        /// <returns>Eğer kullanıcının yetkisi var ise True, yok ise False</returns>
        private async Task<bool> IsUserAllowedAsync(int cardId, short newStatus)
        {
            // Kullanıcının sahip olduğu rolleri çek

            var user = await _userService.GetCurrentUserAsync();
            var userRoles = await _userManager.GetRolesAsync(user);
            var card = _context.TaskCards.Find(cardId);
            short oldCardStatus = card.Status;

            

            if (oldCardStatus == newStatus) return false;

            if (userRoles.Contains("Admin")) return true;

            //if (oldCardStatus == 0 && newStatus == 1)
            //    requiredRoles.AddRange(new[] { "Developer", "ProjectManager" });
            //else if (oldCardStatus == 0 && newStatus == 2)
            //    requiredRoles.AddRange(new[] { "Developer" });
            //else if (oldCardStatus == 1 &&  newStatus == 0)
            //    requiredRoles.AddRange(new[] { "Developer", "ProjectManager" });
            //else if (oldCardStatus == 1 && newStatus == 2)
            //    requiredRoles.AddRange(new[] { "Developer" });
            //else if (oldCardStatus == 2 && newStatus == 0)
            //    requiredRoles.AddRange(new[] { "ProjectManager" });
            //else if (oldCardStatus == 2 && newStatus == 1)
            //    requiredRoles.AddRange(new[] { "Developer", "ProjectManager" });
            //else if (oldCardStatus == 2 && newStatus == 3)
            //    requiredRoles.AddRange(new[] { "ProjectManager" });
            //else if (oldCardStatus == 3 && newStatus == 1)
            //    requiredRoles.AddRange(new[] { "Developer", "ProjectManager" });

            var requiredRoles = new List<string>();

            if ((oldCardStatus == 0 && newStatus == 1)
                || (oldCardStatus == 1 && newStatus == 0)
                || (oldCardStatus == 2 && newStatus == 1)
                || (oldCardStatus == 3 && newStatus == 1))
                requiredRoles.AddRange(new[] { "Developer", "ProjectManager" });
            else if ((oldCardStatus == 0 && newStatus == 2) || (oldCardStatus == 1 && newStatus == 2))
                requiredRoles.AddRange(new[] { "Developer" });
            else if ((oldCardStatus == 2 && newStatus == 0) || (oldCardStatus == 2 && newStatus == 3))
                requiredRoles.AddRange(new[] { "ProjectManager" });
            else
                return false;


            // Eğer required rollerden herhangi birine sahipsem true
            // userRoles = { "User", "Developer" }
            // requiredRoles = { "PM", "Admin" }

            if (userRoles.Any(role => requiredRoles.Contains(role))) return true; //userRoleslerimden biri requiredrole listesinde bulunuyor mu
            else return false;
        }
    }
}
