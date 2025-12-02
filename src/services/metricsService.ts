import { Book } from "../models/book";

/**
 * Servicio que contiene la lógica de negocio para calcular métricas de libros
 */

/**
 * Calcula la media de unidades vendidas de una lista de libros
 * @param {Book[]} books - Lista de libros
 * @returns {number} Media de unidades vendidas (0 si la lista está vacía)
 */
export const calculateMeanUnitsSold = (books: Book[]): number => {
  if (books.length === 0) {
    return 0;
  }

  const totalUnitsSold = books.reduce((sum, book) => sum + book.unitsSold, 0);
  return totalUnitsSold / books.length;
};

/**
 * Encuentra el libro más barato de una lista
 * @param {Book[]} books - Lista de libros
 * @returns {Book | null} El libro más barato, o null si la lista está vacía
 */
export const findCheapestBook = (books: Book[]): Book | null => {
  if (books.length === 0) {
    return null;
  }

  return books.reduce((cheapest, book) => {
    return book.price < cheapest.price ? book : cheapest;
  }, books[0]);
};

/**
 * Filtra libros por autor (búsqueda case-insensitive)
 * @param {Book[]} books - Lista de libros
 * @param {string} author - Nombre del autor a buscar
 * @returns {Book[]} Lista de libros del autor especificado
 */
export const filterBooksByAuthor = (books: Book[], author: string): Book[] => {
  const authorLowerCase = author.toLowerCase();
  return books.filter(book => book.author.toLowerCase() === authorLowerCase);
};

