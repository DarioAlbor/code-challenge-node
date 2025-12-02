import { Book } from "../models/book";

export const calculateMeanUnitsSold = (books: Book[]): number => {
	if (books.length === 0) {
		return 0;
	}

	const totalUnitsSold = books.reduce((sum, book) => sum + book.unitsSold, 0);
	return totalUnitsSold / books.length;
};

export const findCheapestBook = (books: Book[]): Book | null => {
	if (books.length === 0) {
		return null;
	}

	return books.reduce((cheapest, book) => {
		return book.price < cheapest.price ? book : cheapest;
	}, books[0]);
};

export const filterBooksByAuthor = (books: Book[], author: string): Book[] => {
	const authorLowerCase = author.toLowerCase();
	return books.filter(book => book.author.toLowerCase() === authorLowerCase);
};

