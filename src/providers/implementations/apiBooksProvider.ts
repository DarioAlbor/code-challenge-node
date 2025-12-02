import axios, { AxiosError } from "axios";
import { Book, ApiBookResponse } from "../../models/book";
import { BooksProvider } from "../books";

const API_URL = process.env.BOOKS_API_URL;
const REQUEST_TIMEOUT = Number(process.env.REQUEST_TIMEOUT) || 5000;

if (!API_URL) {
	throw new Error("BOOKS_API_URL no está definida en las variables de entorno");
}

const apiBooksProvider = (): BooksProvider => {
	const mapApiResponseToBook = (apiBook: ApiBookResponse): Book => {
		return {
			id: apiBook.id,
			name: apiBook.name,
			author: apiBook.author,
			unitsSold: apiBook.units_sold,
			price: apiBook.price,
		};
	};

	const getBooks = async (): Promise<Book[]> => {
		try {
			const response = await axios.get<ApiBookResponse[]>(API_URL, {
				timeout: REQUEST_TIMEOUT,
			});

			return response.data.map(mapApiResponseToBook);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError;

				if (axiosError.response) {
					throw new Error(
						`Error al obtener libros de la API: ${axiosError.response.status} - ${axiosError.response.statusText}`
					);
				} else if (axiosError.request) {
					throw new Error("No se pudo conectar con la API de libros. Verifique su conexión.");
				}
			}

			throw new Error(`Error inesperado al obtener libros: ${error}`);
		}
	};

	return {
		getBooks,
	};
};

export default apiBooksProvider;

