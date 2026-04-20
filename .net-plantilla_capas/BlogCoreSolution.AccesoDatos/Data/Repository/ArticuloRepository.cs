using BlogCoreSolution.DataAccess.Data;
using BlogCoreSolution.DataAccess.Data.Repository;
using BlogCoreSolution.DataAccess.Data.Repository.IRepository;
using BlogCoreSolution.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BlogCoreSolution.DataAccess.Data.Repository
{
    public class ArticuloRepository : Repository<Articulo>, IArticuloRepository
    {
        private readonly ApplicationDbContext _db;
        public ArticuloRepository(ApplicationDbContext db) : base(db)
        {  
            _db = db;
        }

        public void Update(Articulo articulo)
        {
            var objFromDb = _db.Articulos.FirstOrDefault(s => s.Id == articulo.Id);
            if (objFromDb != null)
            {
                objFromDb.Nombre = articulo.Nombre;
                objFromDb.Descripcion = articulo.Descripcion;
                objFromDb.UrlImagen = articulo.UrlImagen;
                objFromDb.CategoriaId = articulo.CategoriaId;
            }
        }

    }
}
