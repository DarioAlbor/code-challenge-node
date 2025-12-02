import { Book } from "./book";

export interface MetricsData {
	mean_units_sold: number;
	cheapest_book: Book | null;
	books_written_by_author: string[];
}

export interface MetricsResponse {
	books: Book[];
	metrics: MetricsData;
}

