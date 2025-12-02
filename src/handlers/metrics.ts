import { Request, Response } from "express";
import { BooksProvider } from "../providers/books";
import { MetricsResponse } from "../models/metrics";
import {
	calculateMeanUnitsSold,
	findCheapestBook,
	filterBooksByAuthor,
} from "../services/metricsService";

interface GetMetricsQuery {
	author?: string;
}

const metricsHandler = (booksProvider: BooksProvider) => {
	const get = async (
		req: Request<{}, {}, {}, GetMetricsQuery>,
		res: Response<MetricsResponse>
	): Promise<void> => {
		try {
			const { author } = req.query;
			const books = await booksProvider.getBooks();

			const meanUnitsSold = calculateMeanUnitsSold(books);
			const cheapestBook = findCheapestBook(books);
			const booksWrittenByAuthor = author ? filterBooksByAuthor(books, author) : [];

			res.status(200).json({
				mean_units_sold: meanUnitsSold,
				cheapest_book: cheapestBook,
				books_written_by_author: booksWrittenByAuthor,
			});
		} catch (error) {
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
