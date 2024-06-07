import { IProductItem } from '../../components/View/ProductItem';
import { Model } from '../base/model';
import { FormErrors } from '../View/Forms';
import { IOrderRequest } from '../../types';

export interface IAppStateData {
	cards: IProductItem[];
	selectedCard: IProductItem;
}

export class AppState extends Model<IAppStateData> {
	protected basket: IProductItem[] = [];
	protected _cards: IProductItem[];
	protected _selectedCard: IProductItem;

	order: IOrderRequest = {
		payment: '',
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: [],
	};

	formErrors: FormErrors = {};

	set setCards(cards: IProductItem[]) {
		this._cards = cards;
		this.events.emit('productList:changed', this._cards);
	}

	get getCards() {
		return this._cards;
	}

	addCardToBasket(card: IProductItem) {
		if (this.basket.some((item) => item.id === card.id)) {
			return;
		}
		this.basket.push(card);
	}

	removeCardFromBasket(card: IProductItem) {
		this.basket = this.basket.filter((item) => item.id !== card.id);
	}

	clearBasket() {
		this.basket = [];
	}

	getBasket(): IProductItem[] {
		return this.basket;
	}

	setOrderField<K extends keyof IOrderRequest>(
		field: K,
		value: IOrderRequest[K]
	) {
		this.order[field] = value;
		this.validateOrder();
	}

	setContactsField<K extends keyof IOrderRequest>(
		field: K,
		value: IOrderRequest[K]
	) {
		this.order[field] = value;
		this.validateContacts();
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
