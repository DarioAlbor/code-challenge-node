import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import apiBooksProvider from "./apiBooksProvider";
import { ApiBookResponse } from "../../models/book";

vi.mock("axios");
const mockedAxios = axios as ReturnType<typeof vi.mocked<typeof axios>>;

describe("apiBooksProvider", () => {
	const mockApiResponse: ApiBookResponse[] = [
		{ id: 1, name: "Book 1", author: "Author 1", units_sold: 100, price: 20 },
		{ id: 2, name: "Book 2", author: "Author 2", units_sold: 200, price: 15 },
		{ id: 3, name: "Book 3", author: "Author 1", units_sold: 300, price: 25 },
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("debe obtener libros de la API y mapear correctamente", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockApiResponse });

		const provider = apiBooksProvider();
		const books = await provider.getBooks();

		expect(books).toHaveLength(3);
		expect(books[0]).toEqual({
			id: 1,
			name: "Book 1",
			author: "Author 1",
			unitsSold: 100,
			price: 20,
		});
	});

	it("debe evitar retornar libros duplicados en llamadas sucesivas", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockApiResponse });

		const provider = apiBooksProvider();

		const firstCall = await provider.getBooks();
		expect(firstCall).toHaveLength(3);

		const secondCall = await provider.getBooks();
		expect(secondCall).toHaveLength(0);
	});

	it("debe retornar todos los libros si todos ya fueron mostrados", async () => {
		mockedAxios.get.mockResolvedValue({ data: mockApiResponse });

		const provider = apiBooksProvider();

		await provider.getBooks();
		const secondCall = await provider.getBooks();

		expect(secondCall).toHaveLength(3);
	});

	it("debe filtrar solo los libros nuevos", async () => {
		const firstResponse: ApiBookResponse[] = [mockApiResponse[0], mockApiResponse[1]];
		const secondResponse: ApiBookResponse[] = [
			mockApiResponse[1],
			mockApiResponse[2],
		];

		mockedAxios.get.mockResolvedValueOnce({ data: firstResponse });
		const provider = apiBooksProvider();

		const firstCall = await provider.getBooks();
		expect(firstCall).toHaveLength(2);
		expect(firstCall.map(b => b.id)).toEqual([1, 2]);

		mockedAxios.get.mockResolvedValueOnce({ data: secondResponse });
		const secondCall = await provider.getBooks();
		expect(secondCall).toHaveLength(1);
		expect(secondCall[0].id).toBe(3);
	});

	it("debe manejar errores de la API correctamente", async () => {
		mockedAxios.get.mockRejectedValue(new Error("Network Error"));
		mockedAxios.isAxiosError = vi.fn().mockReturnValue(false);

		const provider = apiBooksProvider();

		await expect(provider.getBooks()).rejects.toThrow("Error inesperado al obtener libros");
	});
});

