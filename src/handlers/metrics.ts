import { Request, Response } from "express";
import { BooksProvider } from "../providers/books";
import { MetricsResponse } from "../models/metrics";
import {
  calculateMeanUnitsSold,
  findCheapestBook,
  filterBooksByAuthor,
} from "../services/metricsService";

/**
 * Query parameters para el endpoint de métricas
 */
interface GetMetricsQuery {
  author?: string;
}

/**
 * Handler HTTP para el endpoint de métricas
 * Solo se encarga de la capa de presentación (HTTP)
 * La lógica de negocio está en metricsService
 * @param {BooksProvider} booksProvider - Proveedor de libros
 */
const metricsHandler = (booksProvider: BooksProvider) => {
  /**
   * GET handler para obtener métricas de libros
   * @param {Request} req - Request de Express con query params opcionales
   * @param {Response<MetricsResponse>} res - Response tipado con MetricsResponse
   */
  const get = async (
    req: Request<{}, {}, {}, GetMetricsQuery>,
    res: Response<MetricsResponse>
  ): Promise<void> => {
    try {
      const { author } = req.query;

      // Obtener libros del proveedor (puede ser API, mock, etc.)
      const books = await booksProvider.getBooks();

      // Calcular métricas usando el servicio de lógica de negocio
      const meanUnitsSold = calculateMeanUnitsSold(books);
      const cheapestBook = findCheapestBook(books);
      const booksWrittenByAuthor = author ? filterBooksByAuthor(books, author) : [];

      // Responder con las métricas calculadas
      res.status(200).json({
        mean_units_sold: meanUnitsSold,
        cheapest_book: cheapestBook,
        books_written_by_author: booksWrittenByAuthor,
      });
    } catch (error) {
      // Manejo de errores HTTP
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      console.error("Error al procesar métricas:", errorMessage);

      res.status(500).json({
        mean_units_sold: 0,
        cheapest_book: null,
        books_written_by_author: [],
      });
    }
  };

  return {
    get,
  };
};

export default metricsHandler;
