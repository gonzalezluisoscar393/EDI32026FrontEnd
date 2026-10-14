// Espejo de Libros.Application.Dtos.Autor.AutorRequestDto
// fechaNacimiento viaja como texto ISO (yyyy-MM-dd); la API lo convierte a DateTime
export interface AutorRequestDto {
  nombre: string
  apellido: string
  email: string
  fechaNacimiento: string
}
