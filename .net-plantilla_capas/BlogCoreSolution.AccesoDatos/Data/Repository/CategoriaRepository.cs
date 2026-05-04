using BlogCoreSolution.DataAccess.Data;
using BlogCoreSolution.DataAccess.Data.Repository;
using BlogCoreSolution.DataAccess.Data.Repository.IRepository;
using BlogCoreSolution.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
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

        public IEnumerable<SelectListItem> GetListaCategorias()
        {
            return _db.Categorias.Select(c => new SelectListItem
            {
                Text = c.Nombre,
                Value = c.Id.ToString()
            });
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
