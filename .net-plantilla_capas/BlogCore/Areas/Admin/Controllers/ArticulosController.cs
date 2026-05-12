using BlogCoreSolution.DataAccess.Data.Repository.IRepository;
using BlogCoreSolution.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace BlogCore.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class ArticulosController : Controller
    {
        private readonly IContenedorTrabajo _contenedorTrabajo;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public ArticulosController(IContenedorTrabajo contenedorTrabajo, IWebHostEnvironment hostingEnvironment)
        {
            _contenedorTrabajo = contenedorTrabajo;
            _hostingEnvironment = hostingEnvironment;
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

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(ArticuloVM artiVm)
        {

            if (!ModelState.IsValid) 
            {
                string rutaPrincipal = _hostingEnvironment.WebRootPath;
                var archivos = HttpContext.Request.Form.Files;

                if(artiVm.Articulo.Id == 0 && archivos.Count > 0) 
                {
                    //Nuevo articulo
                    string nombreArchivo = Guid.NewGuid().ToString();
                    var subidas = Path.Combine(rutaPrincipal, @"imagenes\articulos");
                    var extension = Path.GetExtension(archivos[0].FileName);
                    using (var fileStreams = new FileStream(Path.Combine(subidas, nombreArchivo + extension), FileMode.Create))
                    {
                        archivos[0].CopyTo(fileStreams);
                    }
                    artiVm.Articulo.UrlImagen = @"\imagenes\articulos\" + nombreArchivo + extension;
                    _contenedorTrabajo.Articulo.Add(artiVm.Articulo);
                    _contenedorTrabajo.Save();

                    return RedirectToAction(nameof(Index));
                } else {
                    ModelState.AddModelError("Imagen", "Seleccione una imagen para el artículo.");
                }

            }

            artiVm.ListaCategorias = _contenedorTrabajo.Categoria.GetListaCategorias();
            return View(artiVm);
        }


        [HttpGet]
        public IActionResult Edit(int? id)
        {
            ArticuloVM articuloVM = new ArticuloVM()
            {
                Articulo = new BlogCoreSolution.Models.Articulo(),
                ListaCategorias = _contenedorTrabajo.Categoria.GetListaCategorias(),
            };

            if(id != null) {
                articuloVM.Articulo = _contenedorTrabajo.Articulo.Get(id.GetValueOrDefault());
            }

            return View(articuloVM);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(ArticuloVM artiVm)
        {
           
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
