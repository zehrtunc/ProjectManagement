using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProjectManagement.Models;

namespace ProjectManagement.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {

        // Base siniftaki configureleri (tum configureler option classinda toplanmistir) kendimizde uygulayabilmek icin constractor da yazariz.
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Database`de kod uzeriinde degisiklik yapmamizi saglayan configure(tablo isimleri gibi vs.) 
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(Program).Assembly);
            base.OnModelCreating(modelBuilder);
            //Asembly : Derlenmis kod
        }

        // Database`de tablo olusturma
        public DbSet<ApplicationUser> Users { get; set; }
        public DbSet<ApplicationRole> Roles { get; set; }
        public DbSet<TaskCard> TaskCards { get; set; }
        public DbSet<TaskCardNote> TaskCardNotes { get; set; }
        public DbSet<NoteFile> NoteFiles { get; set; }
    }
}
