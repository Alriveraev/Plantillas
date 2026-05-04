using BlogCoreSolution.DataAccess.Data.Repository.IRepository;
using BlogCoreSolution.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace BlogCore.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class ArticulosController : Controller
    {
        private readonly IContenedorTrabajo _contenedorTrabajo;

        public ArticulosController(IContenedorTrabajo contenedorTrabajo)
        {
            _contenedorTrabajo = contenedorTrabajo;
        }


        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Create()
        {
            ArticuloVM articuloVM = new ArticuloVM()
            {
               Articulo = new BlogCoreSolution.Models.Articulo(),
               ListaCategorias = _contenedorTrabajo.Categoria.GetListaCategorias(),
            };

            return View(articuloVM);
        }



        #region API CALLS
        [HttpGet]
        public IActionResult GetAll()
        {
            var lista = _contenedorTrabajo.Articulo.GetAll();
            return Json(new { data = lista });
        }


        //[HttpDelete]
        //public IActionResult Delete(int id)
        //{
        //    var categoria = _contenedorTrabajo.Categoria.Get(id);
        //    if (categoria == null)
        //    {
        //        return Json(new { success = false, message = "Error al eliminar la categoría" });
        //    }

        //    _contenedorTrabajo.Categoria.Remove(categoria);
        //    _contenedorTrabajo.Save();
        //    return Json(new { success = true, message = "Categoría eliminada correctamente" });
        //}
        #endregion
    }
}
