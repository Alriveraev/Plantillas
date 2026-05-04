using BlogCoreSolution.DataAccess.Data.Repository.IRepository;
using BlogCoreSolution.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Text;

namespace BlogCoreSolution.DataAccess.Data.Repository.IRepository
{
    public interface ICategoriaRepository: IRepository<Categoria>
    {
        void Update(Categoria categoria);

       IEnumerable<SelectListItem> GetListaCategorias();
    }
}
