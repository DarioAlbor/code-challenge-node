import { describe, it, expect } from "vitest";
import {
	calculateMeanUnitsSold,
	findCheapestBook,
	filterBooksByAuthor,
} from "./metricsService";
import { Book } from "../models/book";

describe("metricsService", () => {
	const mockBooks: Book[] = [
		{ id: 1, name: "Book 1", author: "Author 1", unitsSold: 100, price: 20 },
		{ id: 2, name: "Book 2", author: "Author 2", unitsSold: 200, price: 15 },
		{ id: 3, name: "Book 3", author: "Author 1", unitsSold: 300, price: 25 },
	];

	describe("calculateMeanUnitsSold", () => {
		it("debe calcular la media de unidades vendidas correctamente", () => {
			const result = calculateMeanUnitsSold(mockBooks);
			expect(result).toBe(200);
		});

		it("debe retornar 0 cuando la lista está vacía", () => {
			const result = calculateMeanUnitsSold([]);
			expect(result).toBe(0);
		});

		it("debe calcular correctamente con un solo libro", () => {
			const singleBook: Book[] = [mockBooks[0]];
			const result = calculateMeanUnitsSold(singleBook);
			expect(result).toBe(100);
		});

		it("debe manejar correctamente números decimales", () => {
			const books: Book[] = [
				{ id: 1, name: "Book 1", author: "Author", unitsSold: 100, price: 10 },
				{ id: 2, name: "Book 2", author: "Author", unitsSold: 150, price: 10 },
			];
			const result = calculateMeanUnitsSold(books);
			expect(result).toBe(125);
		});
	});

	describe("findCheapestBook", () => {
		it("debe encontrar el libro más barato", () => {
			const result = findCheapestBook(mockBooks);
			expect(result).toEqual(mockBooks[1]);
		});

		it("debe retornar null cuando la lista está vacía", () => {
			const result = findCheapestBook([]);
			expect(result).toBeNull();
		});

		it("debe retornar el único libro cuando hay solo uno", () => {
			const singleBook: Book[] = [mockBooks[0]];
			const result = findCheapestBook(singleBook);
			expect(result).toEqual(mockBooks[0]);
		});

		it("debe manejar múltiples libros con el mismo precio mínimo", () => {
			const books: Book[] = [
				{ id: 1, name: "Book 1", author: "Author", unitsSold: 100, price: 10 },
				{ id: 2, name: "Book 2", author: "Author", unitsSold: 200, price: 10 },
				{ id: 3, name: "Book 3", author: "Author", unitsSold: 150, price: 15 },
			];
			const result = findCheapestBook(books);
			expect(result).toEqual(books[0]);
		});
	});

	describe("filterBooksByAuthor", () => {
		it("debe filtrar libros por autor y retornar solo los nombres", () => {
			const result = filterBooksByAuthor(mockBooks, "Author 1");
			expect(result).toHaveLength(2);
			expect(result).toEqual(["Book 1", "Book 3"]);
		});

		it("debe ser case-insensitive", () => {
			const result = filterBooksByAuthor(mockBooks, "AUTHOR 1");
			expect(result).toHaveLength(2);
			expect(result).toEqual(["Book 1", "Book 3"]);
		});

		it("debe retornar lista vacía cuando no hay coincidencias", () => {
			const result = filterBooksByAuthor(mockBooks, "Nonexistent Author");
			expect(result).toHaveLength(0);
			expect(result).toEqual([]);
		});

		it("debe manejar lista vacía de libros", () => {
			const result = filterBooksByAuthor([], "Author 1");
			expect(result).toHaveLength(0);
			expect(result).toEqual([]);
		});

		it("debe filtrar con coincidencia parcial de mayúsculas/minúsculas y retornar solo el nombre", () => {
			const result = filterBooksByAuthor(mockBooks, "author 2");
			expect(result).toHaveLength(1);
			expect(result).toEqual(["Book 2"]);
		});

		it("debe retornar solo strings con los nombres de los libros", () => {
			const result = filterBooksByAuthor(mockBooks, "Author 1");
			result.forEach(item => {
				expect(typeof item).toBe("string");
			});
		});

		it("debe filtrar correctamente múltiples libros del mismo autor", () => {
			const booksWithMultipleByAuthor: Book[] = [
				{ id: 1, name: "Book A", author: "J.R.R. Tolkien", unitsSold: 100, price: 20 },
				{ id: 2, name: "Book B", author: "C.S. Lewis", unitsSold: 200, price: 15 },
				{ id: 3, name: "Book C", author: "J.R.R. Tolkien", unitsSold: 300, price: 25 },
				{ id: 4, name: "Book D", author: "J.R.R. Tolkien", unitsSold: 150, price: 18 },
			];
			const result = filterBooksByAuthor(booksWithMultipleByAuthor, "J.R.R. Tolkien");
			expect(result).toHaveLength(3);
			expect(result).toEqual(["Book A", "Book C", "Book D"]);
		});
	});
});

