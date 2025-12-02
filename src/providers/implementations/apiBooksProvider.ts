import axios, { AxiosError } from "axios";
import { Book, ApiBookResponse } from "../../models/book";
import { BooksProvider } from "../books";

/**
 * URL de la API externa de libros
 */
const API_URL = "https://6781684b85151f714b0aa5db.mockapi.io/api/v1/books";

/**
 * Timeout para las peticiones HTTP (en milisegundos)
 */
const REQUEST_TIMEOUT = 5000;

/**
 * Implementación del BooksProvider que obtiene datos de una API externa
 * @returns {BooksProvider} Provider configurado para usar la API real
 */
const apiBooksProvider = (): BooksProvider => {
  /**
   * Mapea la respuesta de la API (snake_case) al modelo interno (camelCase)
   * @param {ApiBookResponse} apiBook - Libro en formato de API
   * @returns {Book} Libro en formato interno
   */
  const mapApiResponseToBook = (apiBook: ApiBookResponse): Book => {
    return {
      id: apiBook.id,
      name: apiBook.name,
      author: apiBook.author,
      unitsSold: apiBook.units_sold,
      price: apiBook.price,
    };
  };

  /**
   * Obtiene la lista de libros desde la API externa
   * @returns {Promise<Book[]>} Lista de libros
   * @throws {Error} Si hay un error en la petición HTTP
   */
  const getBooks = async (): Promise<Book[]> => {
    try {
      const response = await axios.get<ApiBookResponse[]>(API_URL, {
        timeout: REQUEST_TIMEOUT,
      });

      // Mapear los datos de la API al formato interno
      const books = response.data.map(mapApiResponseToBook);

      return books;
    } catch (error) {
      // Manejo de errores específicos de axios
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        if (axiosError.response) {
          // El servidor respondió con un código de error
          throw new Error(
            `Error al obtener libros de la API: ${axiosError.response.status} - ${axiosError.response.statusText}`
          );
        } else if (axiosError.request) {
          // La petición fue hecha pero no se recibió respuesta
          throw new Error("No se pudo conectar con la API de libros. Verifique su conexión.");
        }
      }

      // Error genérico
      throw new Error(`Error inesperado al obtener libros: ${error}`);
    }
  };

  return {
    getBooks,
  };
};

export default apiBooksProvider;

