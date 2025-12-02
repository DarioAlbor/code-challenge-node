import { describe, it, expect } from "vitest";
import {
  calculateMeanUnitsSold,
  findCheapestBook,
  filterBooksByAuthor,
} from "./metricsService";
import { Book } from "../models/book";

describe("metricsService", () => {
  // Mock data
  const mockBooks: Book[] = [
    { id: 1, name: "Book 1", author: "Author 1", unitsSold: 100, price: 20 },
    { id: 2, name: "Book 2", author: "Author 2", unitsSold: 200, price: 15 },
    { id: 3, name: "Book 3", author: "Author 1", unitsSold: 300, price: 25 },
  ];

  describe("calculateMeanUnitsSold", () => {
    it("debe calcular la media de unidades vendidas correctamente", () => {
      const result = calculateMeanUnitsSold(mockBooks);
      expect(result).toBe(200); // (100 + 200 + 300) / 3 = 200
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
      expect(result).toEqual(mockBooks[1]); // Book 2 con precio 15
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
      // Debe retornar el primero con precio mínimo
      expect(result).toEqual(books[0]);
    });
  });

  describe("filterBooksByAuthor", () => {
    it("debe filtrar libros por autor correctamente", () => {
      const result = filterBooksByAuthor(mockBooks, "Author 1");
      expect(result).toHaveLength(2);
      expect(result).toEqual([mockBooks[0], mockBooks[2]]);
    });

    it("debe ser case-insensitive", () => {
      const result = filterBooksByAuthor(mockBooks, "AUTHOR 1");
      expect(result).toHaveLength(2);
      expect(result).toEqual([mockBooks[0], mockBooks[2]]);
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

    it("debe filtrar con coincidencia parcial de mayúsculas/minúsculas", () => {
      const result = filterBooksByAuthor(mockBooks, "author 2");
      expect(result).toHaveLength(1);
      expect(result).toEqual([mockBooks[1]]);
    });
  });
});

