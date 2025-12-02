import { Book } from "../../models/book";
import { BooksProvider } from "../books";

/**
 * Implementación mock del BooksProvider para testing
 * @returns {BooksProvider} Provider con datos mockeados
 */
const mockBooksProvider = (): BooksProvider => {
  /**
   * Obtiene una lista de libros mockeados
   * @returns {Promise<Book[]>} Lista de libros de prueba
   */
  const getBooks = async (): Promise<Book[]> => {
    return [
      { id: 1, name: "Node.js Design Patterns", author: "Mario Casciaro", unitsSold: 5000, price: 40 },
      { id: 2, name: "Clean Code", author: "Robert C. Martin", unitsSold: 15000, price: 50 },
      { id: 3, name: "The Pragmatic Programmer", author: "Andrew Hunt", unitsSold: 13000, price: 45 },
    ];
  };

  return {
    getBooks,
  };
};

export default mockBooksProvider;

