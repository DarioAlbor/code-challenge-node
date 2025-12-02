import { Book } from "../models/book";

export type BooksProvider = {
	getBooks: () => Promise<Book[]>;
};
