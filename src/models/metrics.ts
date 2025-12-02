import { Book } from "./book";

/**
 * Respuesta del endpoint de métricas
 */
export interface MetricsResponse {
  mean_units_sold: number;
  cheapest_book: Book | null;
  books_written_by_author: Book[];
}

