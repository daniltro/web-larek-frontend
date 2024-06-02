export type CategoryType =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';


export type PaymentMethod = 'CASH' | 'CARD';

export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: CategoryType;
	price: number;
}

export interface IOrderRequest {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

// -----------------------------------Модель данных--------------------------------------------------------
