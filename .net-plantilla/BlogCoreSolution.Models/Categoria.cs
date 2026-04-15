using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace BlogCoreSolution.Models
{
    public class Categoria
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio")]
        [MaxLength(60)]
        [Display(Name = "Nombre de Categoría")]
        public string Nombre { get; set; }

        [Display(Name = "Orden de Visualización")]
        [Range(1, 10, ErrorMessage = "El valor debe estar entre 1 y 10")]
        public int Orden { get; set; }

        public DateTime FechaCreacion { get; set; }

    }
}
