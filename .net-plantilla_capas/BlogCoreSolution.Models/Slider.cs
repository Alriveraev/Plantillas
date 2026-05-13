using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BlogCoreSolution.Models
{
    public class Slider
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio")]
        [MaxLength(60)]
        [Display(Name = "Nombre del Slider")]
        public string Nombre { get; set; }

        [DataType(DataType.ImageUrl)]
        [Required(ErrorMessage = "La URL de la imagen es obligatoria")]
        [Display(Name = "URL de la Imagen")]
        public string UrlImagen { get; set; }

        [Display(Name = "Estado del Slider")]
        public bool Estado { get; set; } = false;
    }
}
