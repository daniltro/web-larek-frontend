import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { CategoryType } from '../../types/index';

export interface IProductItem {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: CategoryType;
	price: number;
	buttonDisable(state: boolean): void;
}

export interface IActions {
	onClick: (event: MouseEvent) => void;
}

export class ProductListItem extends Component<IProductItem> {
	protected _id: string;
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IActions
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

		if (actions && actions.onClick) {
			this.clickHandler(actions.onClick);
		}
	}

	clickHandler(handler: (event: MouseEvent) => void) {
		this.container.addEventListener('click', handler);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: CategoryType) {
    // Сначала убираем все возможные классы категорий
    this._category.classList.remove(
        'card__category_soft',
        'card__category_other',
        'card__category_soft',
        'card__category_hard',
        'card__category_additional',
        'card__category_button'
    );

    // Затем устанавливаем текст категории
    this.setText(this._category, value);

    // И добавляем новый класс в зависимости от значения категории
    if (value === 'другое') {
        this._category.classList.add('card__category_other');
    } else if (value === 'софт-скил') {
        this._category.classList.add('card__category_soft');
    } else if (value === 'хард-скил') {
        this._category.classList.add('card__category_hard');
    } else if (value === 'дополнительное') {
        this._category.classList.add('card__category_additional');
    } else if (value === 'кнопка') {
        this._category.classList.add('card__category_button');
    }
}

	set price(value: number) {
		this.setText(this._price, `${value} cинапсов`);
		if (value === null) {
			this.setText(this._price, `Бесценно`);
		}
	}
}

export class ProductPreview extends ProductListItem {
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;
	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IActions
	) {
		super(blockName, container, actions);
		this._description = ensureElement<HTMLElement>(
			`.${this.blockName}__text`,
			container
		);
		this._button = ensureElement<HTMLButtonElement>(
			`.${this.blockName}__button`,
			container
		);

		if (this._button) {
			this.clickHandler(actions.onClick);
		}
	}

	set description(value: string) {
		this._description.textContent = value;
	}

	set button (value: string)  {
		this._button.textContent  = value;
	}

	buttonDisable(state: boolean) {
		this.setDisabled(this._button, state);
	}

	clickHandler(handler: (event: MouseEvent) => void) {
		if (this._button) {
			this._button.addEventListener('click', handler);
		}
	}
}
