export type CategoryType =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: CategoryType;
	price: number;
	buttonDisable(state: boolean): void;
}

export interface IOrderRequest {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IPaymentChangedEvent {
	method: string;
}

// -----------------------------------Модель данных--------------------------------------------------------
