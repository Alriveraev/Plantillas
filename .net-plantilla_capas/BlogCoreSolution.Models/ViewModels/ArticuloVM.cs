using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Text;

namespace BlogCoreSolution.Models.ViewModels
{
    public class ArticuloVM
    {
        public Articulo Articulo { get; set; }
        
        [ValidateNever]
        public IEnumerable<SelectListItem> ListaCategorias { get; set; }

    }
}
