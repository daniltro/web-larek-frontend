import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IOrderRequest } from '../../types/index';

export interface IOrderForm {
	address?: string;
	email?: string;
	phone?: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
}
export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
		this.container.addEventListener('input', this.handleInput.bind(this));
		this._submit.addEventListener('click', this.handleSubmit.bind(this));
		this.events.on('modal:close', this.clearForm.bind(this));
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}

	handleSubmit(e: Event) {
		e.preventDefault();
		this.events.emit(`orderForm:submit`);
	}

	handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const field = target.name as keyof T;
		const value = target.value;
		this.onInputChange(field, value);
	}

	clearForm() {
		this.container.reset(); // Сброс формы
		this.setText(this._errors, ''); // Очистка ошибок
		this.valid = false; // Сброс валидации
	}
}


export class FormOrder extends Form<IOrderRequest> {
	inputAddress: HTMLInputElement;
	paymentMethodCash: HTMLButtonElement;
	paymentMethodOnline: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.inputAddress = ensureElement<HTMLInputElement>(
			'.form__input',
			this.container
		);
		this.paymentMethodCash = ensureElement<HTMLButtonElement>(
			'button[data-method=cash]',
			this.container
		);
		this.paymentMethodOnline = ensureElement<HTMLButtonElement>(
			'button[data-method=online]',
			this.container
		);
		this.setAddEventListeners();
	}

	setAddEventListeners() {
		this.inputAddress.addEventListener(
			'input',
			this.handleAddressInput.bind(this)
		);
		this.paymentMethodCash.addEventListener(
			'click',
			this.handleCashPayment.bind(this)
		);
		this.paymentMethodOnline.addEventListener(
			'click',
			this.handleOnlinePayment.bind(this)
		);
	}

	handleAddressInput() {
		const value = this.inputAddress.value;
		this.onInputChange('address', value);
	}

	handleCashPayment() {
		this.handlePayment(
			'cash',
			this.paymentMethodCash,
			'paymentCash:changed',
			this.paymentMethodOnline
		);
	}

	handleOnlinePayment() {
		this.handlePayment(
			'online',
			this.paymentMethodOnline,
			'paymentOnline:changed',
			this.paymentMethodCash
		);
	}

	handlePayment(
		method: string,
		currentButton: HTMLButtonElement,
		eventName: string,
		otherButton: HTMLButtonElement
	) {
		const currentMethod = currentButton.getAttribute('data-method') || '';
		if (currentMethod === method) {
			currentButton.classList.add('button_alt-active');
			this.events.emit(eventName, { method });
			otherButton.classList.remove('button_alt-active');
		}
	}

	clearForm() {
		super.clearForm(); // Вызываем метод clearForm из базового класса для сброса формы
		// Удаление активных классов с кнопок оплаты
		this.paymentMethodCash.classList.remove('button_alt-active');
		this.paymentMethodOnline.classList.remove('button_alt-active');
	}
}

export class ContactsForm extends Form<IOrderRequest> {
	inputEmail: HTMLInputElement;
	inputPhone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.inputEmail = ensureElement<HTMLInputElement>(
			'.form__input[name=email]',
			this.container
		);
		this.inputPhone = ensureElement<HTMLInputElement>(
			'.form__input[name=phone]',
			this.container
		);

		this.setAddEventListeners();
	}

	setAddEventListeners() {
		this.inputEmail.addEventListener('input', this.handleEmailInput.bind(this));
		this.inputPhone.addEventListener('input', this.handlePhoneInput.bind(this));
	}

	handleSubmit(e: Event) {
		// Проверяем, является ли текущая форма формой контактов
		if (this instanceof ContactsForm) {
			// Если это форма контактов, просто возвращаем значение true без отправки запроса
			e.preventDefault();

			this.events.emit('contactsForm:submit');
			return true;
		} else {
			// Если это другая форма, вызываем метод handleSubmit базового класса
			super.handleSubmit(e);
		}
	}

	handleEmailInput() {
		const value = this.inputEmail.value;
		this.onInputChange('email', value);
	}

	handlePhoneInput() {
		const value = this.inputPhone.value;
		this.onInputChange('phone', value);
	}
}
