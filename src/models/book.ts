export interface Book {
	id: number;
	name: string;
	author: string;
	unitsSold: number;
	price: number;
}

export interface ApiBookResponse {
	id: number;
	name: string;
	author: string;
	units_sold: number;
	price: number;
}
