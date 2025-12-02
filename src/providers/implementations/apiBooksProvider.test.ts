import { describe, it, expect, vi, beforeEach } from "vitest";
import { Book } from "../../models/book";
import { BooksProvider } from "../../providers/books";

const mockBooksProviderFactory = (): BooksProvider => {
	const shownBookIds = new Set<number>();

	const staticBooks: Book[] = [
		{ id: 1, name: "Book 1", author: "Author 1", unitsSold: 100, price: 20 },
		{ id: 2, name: "Book 2", author: "Author 2", unitsSold: 200, price: 15 },
		{ id: 3, name: "Book 3", author: "Author 1", unitsSold: 300, price: 25 },
	];

	const getBooks = vi.fn(async (): Promise<Book[]> => {
		const newBooks = staticBooks.filter(book => !shownBookIds.has(book.id));
		newBooks.forEach(book => shownBookIds.add(book.id));
		return newBooks.length > 0 ? newBooks : staticBooks;
	});

	return { getBooks };
};

describe("apiBooksProvider (mock)", () => {
	let provider: BooksProvider;

	beforeEach(() => {
		provider = mockBooksProviderFactory();
	});

	it("debe obtener libros correctamente", async () => {
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
		const firstCall = await provider.getBooks();
		expect(firstCall).toHaveLength(3);

		const secondCall = await provider.getBooks();
		expect(secondCall).toHaveLength(3);
	});

	it("debe retornar la estructura correcta de Book", async () => {
		const books = await provider.getBooks();

		books.forEach(book => {
			expect(book).toHaveProperty("id");
			expect(book).toHaveProperty("name");
			expect(book).toHaveProperty("author");
			expect(book).toHaveProperty("unitsSold");
			expect(book).toHaveProperty("price");
			expect(typeof book.id).toBe("number");
			expect(typeof book.name).toBe("string");
			expect(typeof book.author).toBe("string");
			expect(typeof book.unitsSold).toBe("number");
			expect(typeof book.price).toBe("number");
		});
	});

	it("debe validar que getBooks retorna una promesa", () => {
		const result = provider.getBooks();
		expect(result).toBeInstanceOf(Promise);
	});

	it("debe tener datos consistentes en múltiples llamadas", async () => {
		const firstCall = await provider.getBooks();
		const secondCall = await provider.getBooks();

		expect(firstCall[0].id).toBe(secondCall[0].id);
		expect(firstCall[0].name).toBe(secondCall[0].name);
	});
});

describe("apiBooksProvider - Error Handling Simulation", () => {
	it("debe simular manejo de error cuando no hay libros", async () => {
		const emptyProvider = (): BooksProvider => {
			const getBooks = vi.fn(async (): Promise<Book[]> => {
				throw new Error("No se pudo conectar con la API de libros");
			});
			return { getBooks };
		};

		const provider = emptyProvider();
		await expect(provider.getBooks()).rejects.toThrow("No se pudo conectar con la API de libros");
	});

	it("debe simular timeout de la API", async () => {
		const timeoutProvider = (): BooksProvider => {
			const getBooks = vi.fn(async (): Promise<Book[]> => {
				throw new Error("Error al obtener libros de la API: 408 - Request Timeout");
			});
			return { getBooks };
		};

		const provider = timeoutProvider();
		await expect(provider.getBooks()).rejects.toThrow("Request Timeout");
	});

	it("debe simular respuesta 404 de la API", async () => {
		const notFoundProvider = (): BooksProvider => {
			const getBooks = vi.fn(async (): Promise<Book[]> => {
				throw new Error("Error al obtener libros de la API: 404 - Not Found");
			});
			return { getBooks };
		};

		const provider = notFoundProvider();
		await expect(provider.getBooks()).rejects.toThrow("404 - Not Found");
	});

	it("debe simular respuesta 500 de la API", async () => {
		const serverErrorProvider = (): BooksProvider => {
			const getBooks = vi.fn(async (): Promise<Book[]> => {
				throw new Error("Error al obtener libros de la API: 500 - Internal Server Error");
			});
			return { getBooks };
		};

		const provider = serverErrorProvider();
		await expect(provider.getBooks()).rejects.toThrow("500 - Internal Server Error");
	});

	it("debe simular datos malformados de la API", async () => {
		const malformedProvider = (): BooksProvider => {
			const getBooks = vi.fn(async (): Promise<Book[]> => {
				throw new Error("Error inesperado al obtener libros");
			});
			return { getBooks };
		};

		const provider = malformedProvider();
		await expect(provider.getBooks()).rejects.toThrow("Error inesperado");
	});
});

