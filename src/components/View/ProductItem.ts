import { IEvents } from '../base/events';
import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { CategoryType } from '../../types/index';
import { Modal } from './Modal'

export interface IPROductList {
	events: IEvents;
	products: IProductItem[];
	render(): HTMLElement;
}

export interface IProductItem {
	events: IEvents;

	id: string;
	description?: string;
	image: string;
	title: string;
	category: CategoryType;
	price: number;
}

// interface ICardActions {
// 	onClick: (event: MouseEvent) => void;
// }

export class ProductListItem extends Component<IProductItem> {
	protected _id: string;
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		protected events: IEvents
	) {
		super(container);

		this._category = ensureElement<HTMLElement>(
			`.${blockName}__category`,
			container
		);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);

		this._image = ensureElement<HTMLImageElement>(
			`.${blockName}__image`,
			container
		);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);

		this.container.addEventListener('click', () => {
			this.events.emit('item:selected', this)
		});

	}

	set id(value: string) {
		this._id = value;
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: CategoryType) {
		this.setText(this._category, value);
		this.toggleClass(this._category, 'card__category_soft');
		if (value === 'другое') {
			this.toggleClass(this._category, 'card__category_other');
		} else if (value === 'софт-скил') {
			this.toggleClass(this._category, 'card__category_soft');
		} else if (value === 'хард-скил') {
			this.toggleClass(this._category, 'card__category_hard');
		} else if (value === 'дополнительное') {
			this.toggleClass(this._category, 'card__category_additional');
		} else if (value === 'кнопка') {
			this.toggleClass(this._category, 'card__category_button');
		}
	}

	set price(value: number) {
		this.setText(this._price, `${value} cинапсов`);
		if (value === null) {
			this.setText(this._price, `Бесценно`);
		}
	}
}



// ---------------------------------------------------

export class ProductPreview extends ProductListItem { 
	protected _description: HTMLElement; 
	protected _button: HTMLButtonElement; 
	
	constructor(protected blockName: string, container: HTMLElement, events:IEvents) { 
	 super(blockName, container, events); 
	 this._description = ensureElement<HTMLElement>(`.${this.blockName}__text`, container); 
	 this._button = ensureElement<HTMLButtonElement>(`.${this.blockName}__button`, container); 
	
	 this._button.addEventListener('click', () => { 
		this.events.emit('card:addtobasket', {id: this.id, title: this.title, price: this.price}); 
	 }) 
	} 
	
	set description(value:string) { 
	 this._description.textContent = value; 
	} 
	
	get description() { 
	 return this._description.textContent || ''; 
	} 
 }