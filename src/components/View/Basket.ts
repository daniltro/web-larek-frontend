import { Component } from '../base/Component';
import { ensureElement, createElement  } from '../../utils/utils';
import { IActions } from './ProductItem';

export interface IBasketView {
	title: HTMLElement;
	basketList: HTMLElement[];
	basketButton: HTMLButtonElement;
	totalPrice: HTMLElement;
}

interface IBasketItem {
	index: number;
	title: string;
	price: number;
}

export class Basket extends Component<IBasketView> {
	protected _basketList: HTMLElement;
	protected _totalPrice: HTMLElement;
	protected _basketButton: HTMLElement;
	constructor(container: HTMLElement, actions?:IActions) {
		super(container);

		this._basketList = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this._totalPrice = this.container.querySelector('.basket__price');
		this._basketButton = this.container.querySelector('.basket__button');

		if (this._basketButton) {
			this._basketButton.addEventListener('click', actions.onClick);
		}
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._basketList.replaceChildren(...items);
		} else {
			this._basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	set total(total: number) {
		this.setText(this._totalPrice, `${total} синапсов`);
	}

	buttonDisable(state: boolean) {
		this.setDisabled(this._basketButton, state);
	}
}

export class BasketItem extends Component<IBasketItem> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);

		this._index = ensureElement<HTMLElement>(
			`.basket__item-index`,
			this.container
		);
		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._deleteButton = this.container.querySelector('.card__button');

		this._deleteButton.addEventListener('click', actions.onClick);
	}

	set index(index: number) {
		this._index.textContent = index.toString();
	}
	set title(title: string) {
		this._title.textContent = title;
	}
	set price(price: number) {
		this._price.textContent = price.toString();
	}
	
}
