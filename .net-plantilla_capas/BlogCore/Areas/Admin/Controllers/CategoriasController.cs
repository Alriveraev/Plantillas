using BlogCoreSolution.DataAccess.Data.Repository.IRepository;
using BlogCoreSolution.Models;
using Microsoft.AspNetCore.Mvc;

namespace BlogCore.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class CategoriasController : Controller
    {
        private readonly IContenedorTrabajo _contenedorTrabajo;

        public CategoriasController(IContenedorTrabajo contenedorTrabajo)
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
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Categoria categoria)
        {
            if (ModelState.IsValid)
            {
                _contenedorTrabajo.Categoria.Add(categoria);
                _contenedorTrabajo.Save();
                return RedirectToAction(nameof(Index));
            }

            return View();
        }


        [HttpGet]
        public IActionResult Edit(int id)
        {

            Categoria categoria = _contenedorTrabajo.Categoria.Get(id);

            if(categoria == null) {
                return NotFound();
            }

 
            return View(categoria);
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Categoria categoria)
        {
            if (ModelState.IsValid)
            {
                _contenedorTrabajo.Categoria.Update(categoria);
                _contenedorTrabajo.Save();
                return RedirectToAction(nameof(Index));
            }
            return View();
        }

        #region API CALLS
        [HttpGet]
        public IActionResult GetAll()
        {
            var lista = _contenedorTrabajo.Categoria.GetAll();
            return Json(new { data = lista });
        }


        [HttpDelete]
        public IActionResult Delete(int id)
        {
            var categoria = _contenedorTrabajo.Categoria.Get(id);
            if (categoria == null)
            {
                return Json(new { success = false, message = "Error al eliminar la categoría" });
            }

            _contenedorTrabajo.Categoria.Remove(categoria);
            _contenedorTrabajo.Save();
            return Json(new { success = true, message = "Categoría eliminada correctamente" });
        }
        #endregion
    }
}
