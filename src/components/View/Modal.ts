import { IEvents } from '../base/events';
import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';

export interface IModalData {
	content: HTMLElement;
}

export interface ISuccessModal {
	title: HTMLElement;
	totalPrice: HTMLElement;
	buttonToMainPage: HTMLButtonElement;
}

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.closeModal.bind(this));
		this.container.addEventListener('click', this.closeModal.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	openModal() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	closeModal() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.openModal();
		return this.container;
	}
}



export class SuccessModal extends Component<ISuccessModal> {
	protected title: HTMLElement;
	protected _description: HTMLElement;
	protected buttonToMainPage: HTMLButtonElement;
	
	

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.title  = this.container.querySelector('.order-success__title');
		this._description  = this.container.querySelector('.order-success__description');
		this.buttonToMainPage  = this.container.querySelector('.order-success__close');
		this.buttonToMainPage.addEventListener('click', this.handleSuccessSubmit.bind(this));
	}

	set description(value: string)  {
		this._description.textContent = value;
	}

	handleSuccessSubmit() {
		this.events.emit('modalSucces:close');
	}

}
