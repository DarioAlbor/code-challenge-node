import { describe, it, expect, vi, beforeEach } from "vitest";
import metricsHandler from "./metrics";
import { Request, Response } from "express";
import { BooksProvider } from "../providers/books";
import { Book } from "../models/book";
import { MetricsResponse } from "../models/metrics";

describe("metricsHandler", () => {
	const mockBooks: Book[] = [
		{ id: 1, name: "Book 1", author: "Author 1", unitsSold: 100, price: 20 },
		{ id: 2, name: "Book 2", author: "Author 2", unitsSold: 200, price: 15 },
		{ id: 3, name: "Book 3", author: "Author 1", unitsSold: 300, price: 25 },
	];

	const mockBooksProvider: BooksProvider = {
		getBooks: vi.fn().mockResolvedValue(mockBooks),
	};

	const handler = metricsHandler(mockBooksProvider);

	let mockReq: Partial<Request>;
	let mockRes: Partial<Response<MetricsResponse>>;
	let jsonMock: ReturnType<typeof vi.fn>;
	let statusMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		jsonMock = vi.fn();
		statusMock = vi.fn().mockReturnThis();
		mockRes = {
			status: statusMock,
			json: jsonMock,
		};
		mockReq = {
			query: {},
		};
		vi.clearAllMocks();
	});

	describe("get", () => {
		it("debe retornar métricas sin query de autor", async () => {
			await handler.get(mockReq as Request, mockRes as Response<MetricsResponse>);

			expect(mockBooksProvider.getBooks).toHaveBeenCalled();
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				mean_units_sold: 200,
				cheapest_book: mockBooks[1],
				books_written_by_author: [],
			});
		});

		it("debe retornar métricas con filtro por autor", async () => {
			mockReq.query = { author: "Author 1" };

			await handler.get(mockReq as Request, mockRes as Response<MetricsResponse>);

			expect(mockBooksProvider.getBooks).toHaveBeenCalled();
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				mean_units_sold: 200,
				cheapest_book: mockBooks[1],
				books_written_by_author: [mockBooks[0], mockBooks[2]],
			});
		});

		it("debe ser case-insensitive al filtrar por autor", async () => {
			mockReq.query = { author: "AUTHOR 1" };

			await handler.get(mockReq as Request, mockRes as Response<MetricsResponse>);

			expect(jsonMock).toHaveBeenCalledWith(
				expect.objectContaining({
					books_written_by_author: [mockBooks[0], mockBooks[2]],
				})
			);
		});

		it("debe manejar errores del provider y retornar 500", async () => {
			const errorProvider: BooksProvider = {
				getBooks: vi.fn().mockRejectedValue(new Error("API Error")),
			};
			const errorHandler = metricsHandler(errorProvider);

			await errorHandler.get(mockReq as Request, mockRes as Response<MetricsResponse>);

			expect(statusMock).toHaveBeenCalledWith(500);
			expect(jsonMock).toHaveBeenCalledWith({
				mean_units_sold: 0,
				cheapest_book: null,
				books_written_by_author: [],
			});
		});

		it("debe retornar lista vacía cuando el autor no existe", async () => {
			mockReq.query = { author: "Nonexistent Author" };

			await handler.get(mockReq as Request, mockRes as Response<MetricsResponse>);

			expect(jsonMock).toHaveBeenCalledWith(
				expect.objectContaining({
					books_written_by_author: [],
				})
			);
		});

		it("debe manejar lista vacía de libros", async () => {
			const emptyProvider: BooksProvider = {
				getBooks: vi.fn().mockResolvedValue([]),
			};
			const emptyHandler = metricsHandler(emptyProvider);

			await emptyHandler.get(mockReq as Request, mockRes as Response<MetricsResponse>);

			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				mean_units_sold: 0,
				cheapest_book: null,
				books_written_by_author: [],
			});
		});
	});
});

