using BlogCoreSolution.DataAccess.Data;
using BlogCoreSolution.DataAccess.Data.Repository;
using BlogCoreSolution.DataAccess.Data.Repository.IRepository;
using BlogCoreSolution.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BlogCoreSolution.DataAccess.Data.Repository
{
    public class SliderRepository : Repository<Slider>, ISliderRepository
    {
        private readonly ApplicationDbContext _db;
        public SliderRepository(ApplicationDbContext db) : base(db)
        {  
            _db = db;
        }

        public void Update(Slider slider)
        {
            var objFromDb = _db.Sliders.FirstOrDefault(s => s.Id == slider.Id);

            objFromDb.Nombre = slider.Nombre;
            objFromDb.Estado = slider.Estado;
            objFromDb.UrlImagen = slider.UrlImagen;
        }

    }
}
