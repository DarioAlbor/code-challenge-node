/**
 * Representa un libro en el sistema
 */
export interface Book {
  id: number
  name: string
  author: string
  unitsSold: number
  price: number
}

/**
 * Estructura de respuesta de la API externa (usa snake_case)
 */
export interface ApiBookResponse {
  id: number
  name: string
  author: string
  units_sold: number
  price: number
}
