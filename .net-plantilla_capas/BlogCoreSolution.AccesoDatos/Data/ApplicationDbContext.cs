using BlogCoreSolution.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BlogCoreSolution.AccesoDatos.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {}

        // Aqui iran los DbSet de las tablas que se van a crear en la base de datos
        public DbSet<Categoria> Categorias { get; set; }
    }
}
