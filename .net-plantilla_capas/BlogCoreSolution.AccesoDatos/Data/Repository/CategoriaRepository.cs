using BlogCoreSolution.DataAccess.Data;
using BlogCoreSolution.DataAccess.Data.Repository;
using BlogCoreSolution.DataAccess.Data.Repository.IRepository;
using BlogCoreSolution.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BlogCoreSolution.DataAccess.Data.Repository
{
    public class CategoriaRepository : Repository<Categoria>, ICategoriaRepository
    {
        private readonly ApplicationDbContext _db;
        public CategoriaRepository(ApplicationDbContext db) : base(db)
        {  
            _db = db;
        }

        public void Update(Categoria categoria)
        {
            var objFromDb = _db.Categorias.FirstOrDefault(s => s.Id == categoria.Id);
            if (objFromDb != null)
            {
                objFromDb.Nombre = categoria.Nombre;
                objFromDb.Orden = categoria.Orden;
            }
        }

    }
}
