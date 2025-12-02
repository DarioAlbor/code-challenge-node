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

		it("debe manejar números muy grandes sin perder precisión", () => {
			const books: Book[] = [
				{ id: 1, name: "Book", author: "Author", unitsSold: 999999999, price: 10 },
				{ id: 2, name: "Book", author: "Author", unitsSold: 1, price: 10 },
			];
			const result = calculateMeanUnitsSold(books);
			expect(result).toBe(500000000);
		});

		it("debe manejar múltiples libros con ventas muy variadas", () => {
			const books: Book[] = [
				{ id: 1, name: "Book", author: "Author", unitsSold: 1000000, price: 10 },
				{ id: 2, name: "Book", author: "Author", unitsSold: 1, price: 10 },
				{ id: 3, name: "Book", author: "Author", unitsSold: 500000, price: 10 },
			];
			const result = calculateMeanUnitsSold(books);
			expect(result).toBeCloseTo(500000.33, 2);
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

		it("debe manejar precios con decimales", () => {
			const books: Book[] = [
				{ id: 1, name: "Book", author: "Author", unitsSold: 100, price: 10.99 },
				{ id: 2, name: "Book", author: "Author", unitsSold: 100, price: 10.50 },
				{ id: 3, name: "Book", author: "Author", unitsSold: 100, price: 11.00 },
			];
			const result = findCheapestBook(books);
			expect(result?.price).toBe(10.50);
		});

		it("debe manejar precio 0 como válido", () => {
			const books: Book[] = [
				{ id: 1, name: "Free Book", author: "Author", unitsSold: 100, price: 0 },
				{ id: 2, name: "Paid Book", author: "Author", unitsSold: 100, price: 10 },
			];
			const result = findCheapestBook(books);
			expect(result?.price).toBe(0);
			expect(result?.name).toBe("Free Book");
		});

		it("debe manejar precios muy altos", () => {
			const books: Book[] = [
				{ id: 1, name: "Expensive", author: "Author", unitsSold: 100, price: 99999.99 },
				{ id: 2, name: "Super Expensive", author: "Author", unitsSold: 100, price: 199999.99 },
			];
			const result = findCheapestBook(books);
			expect(result?.price).toBe(99999.99);
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

	describe("Performance Tests", () => {
		it("debe calcular métricas rápidamente con 1000 libros", () => {
			const manyBooks: Book[] = Array.from({ length: 1000 }, (_, i) => ({
				id: i,
				name: `Book ${i}`,
				author: `Author ${i % 10}`,
				unitsSold: Math.floor(Math.random() * 10000),
				price: Math.floor(Math.random() * 100),
			}));

			const start = performance.now();
			calculateMeanUnitsSold(manyBooks);
			findCheapestBook(manyBooks);
			filterBooksByAuthor(manyBooks, "Author 1");
			const end = performance.now();

			expect(end - start).toBeLessThan(100);
		});

		it("debe manejar 10000 libros sin problemas de memoria", () => {
			const manyBooks: Book[] = Array.from({ length: 10000 }, (_, i) => ({
				id: i,
				name: `Book ${i}`,
				author: `Author ${i % 100}`,
				unitsSold: Math.floor(Math.random() * 10000),
				price: Math.floor(Math.random() * 100),
			}));

			const start = performance.now();
			const mean = calculateMeanUnitsSold(manyBooks);
			const cheapest = findCheapestBook(manyBooks);
			const filtered = filterBooksByAuthor(manyBooks, "Author 50");
			const end = performance.now();

			expect(mean).toBeGreaterThan(0);
			expect(cheapest).not.toBeNull();
			expect(filtered.length).toBeGreaterThan(0);
			expect(end - start).toBeLessThan(500);
		});

		it("debe ser eficiente con filtrado de muchos libros del mismo autor", () => {
			const manyBooks: Book[] = Array.from({ length: 5000 }, (_, i) => ({
				id: i,
				name: `Book ${i}`,
				author: "Popular Author",
				unitsSold: Math.floor(Math.random() * 10000),
				price: Math.floor(Math.random() * 100),
			}));

			const start = performance.now();
			const filtered = filterBooksByAuthor(manyBooks, "Popular Author");
			const end = performance.now();

			expect(filtered).toHaveLength(5000);
			expect(end - start).toBeLessThan(100);
		});

		it("debe calcular media con dataset grande sin overflow", () => {
			const manyBooks: Book[] = Array.from({ length: 100 }, (_, i) => ({
				id: i,
				name: `Book ${i}`,
				author: "Author",
				unitsSold: 1000000,
				price: 10,
			}));

			const result = calculateMeanUnitsSold(manyBooks);
			expect(result).toBe(1000000);
			expect(Number.isFinite(result)).toBe(true);
		});
	});
});

