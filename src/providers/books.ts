import { Book } from "../models/book";

/**
 * Interfaz para proveedores de libros
 * Permite diferentes implementaciones (API, mock, base de datos, etc.)
 */
export type BooksProvider = {
  /**
   * Obtiene la lista de todos los libros disponibles
   * @returns {Promise<Book[]>} Lista de libros
   */
  getBooks: () => Promise<Book[]>;
};
