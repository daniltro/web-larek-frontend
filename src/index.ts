import './scss/styles.scss';
import { API_URL, CDN_URL } from './types/constants';
import { IProductItem, IOrderRequest } from './types';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/model/AppState';
import { Page } from './components/View/Page';
import { ProductListItem } from './components/View/ProductItem';
import { WebLarekApi } from './components/model/ApiModel';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/View/Modal';
import { ProductPreview } from './components/View/ProductItem';
import { Basket, BasketItem, IBasketView } from './components/View/Basket';
import { ContactsForm, FormOrder } from './components/View/Forms';
import { IFormState } from './components/View/Forms';
import { IOrderForm } from './components/View/Forms';
import { IPaymentChangedEvent } from './types/index';
import { SuccessModal } from './components/View/Modal';
const pageWrapper = document.querySelector('.page') as HTMLElement;
const cardItemTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appState = new AppState({}, events);
const page = new Page(pageWrapper, events);
const modalContainer = ensureElement<HTMLTemplateElement>(
	'#modal-container'
) as HTMLElement;
const itemPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modal = new Modal(modalContainer, events);
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const formOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const formOrder = new FormOrder(cloneTemplate(formOrderTemplate), events);

events.on('productList:changed', () => {
	page.catalog = appState.getCards.map((item) => {
		const card = new ProductListItem('card', cloneTemplate(cardItemTemplate), {
			onClick: () => {
				events.emit('product:select', item);
			},
		});

		return card.render({
			id: item.id,
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

events.on('product:select', (item: IProductItem) => {
	const productPreviewItem = new ProductPreview(
		'card',
		cloneTemplate(itemPreviewTemplate),
		{
			onClick: () => {
				events.emit('product:added', item);
			},
		}
	);
	modal.render({ content: productPreviewItem.render(item) });

	if (item.price === null || item.price === undefined) {
		productPreviewItem.buttonDisable(true);
	} else if (
		appState.getBasket().some((basketItem) => basketItem.id === item.id)
	) {
		productPreviewItem.buttonDisable(true);
	}
});

events.on('product:added', (item: IProductItem) => {
	appState.addCardToBasket(item);
	page.counter = appState.getBasket().length;
	modal.closeModal();
});

events.on('basket:changed', (item: IProductItem) => {
	appState.removeCardFromBasket(item);
	page.counter = appState.getBasket().length;
	events.emit('basket:open', item);
	modal.closeModal();
});

events.on('basket:open', () => {
	// Очисщаем данные заказа перед заполнением новыми данными
	appState.setOrderField('items', []);
	appState.setOrderField('total', 0);

	const basket = new Basket(cloneTemplate(basketTemplate), {
		onClick: () => {
			events.emit('order:open');
		},
	});
	const basketArray = appState.getBasket();
	const cardBasketElements = basketArray.map((item, index, price) => {
		const cardBasketElement = cloneTemplate(basketItemTemplate);
		const cardBasket = new BasketItem(cardBasketElement, {
			onClick: () => events.emit('basket:changed', item),
		});
		cardBasket.index = index + 1;
		cardBasket.title = item.title;
		cardBasket.price = item.price;

		// записываем id в объект заказа
		appState.setOrderField('items', [...appState.order.items, item.id]);

		return cardBasketElement;
	});

	const totalPrice = basketArray.reduce(
		(total, item) => total + (item.price || 0),
		0
	);
	appState.setOrderField('total', totalPrice);
	basket.items = cardBasketElements;
	basket.total = totalPrice;
	modal.render({ content: basket.render() });
});

events.on('order:open', () => {
	if (appState.getBasket().length) {
		const initialState: Partial<IOrderRequest> & IFormState = {
			valid: false, // Начальное состояние валидации
			errors: [], // Начальное состояние ошибок
			address: '', // Начальное значение поля address
		};

		modal.render({ content: formOrder.render(initialState) });
	}
});

// Изменилось состояние валидации формы

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { address, email, phone } = errors;
	// валидируем поле ввода адреса
	formOrder.valid = !address;
	formOrder.errors = Object.values({ address, phone, email })
		.filter((i) => !!i)
		.join('; ');

	// валидируем поля ввода почты и телефона
	formContacts.valid = !email && !phone;
	formContacts.errors = Object.values({ address, phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appState.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appState.setContactsField(data.field, data.value);
	}
);

events.on('paymentCash:changed', (payment: IPaymentChangedEvent) => {
	appState.setOrderField('payment', payment.method);
});

events.on('paymentOnline:changed', (payment: IPaymentChangedEvent) => {
	appState.setOrderField('payment', payment.method);
});

const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const formContacts = new ContactsForm(
	cloneTemplate(formContactsTemplate),
	events
);

const SuccessModalTemplate = ensureElement<HTMLTemplateElement>('#success');
const SuccessWindow = new SuccessModal(
	cloneTemplate(SuccessModalTemplate),
	events
);

events.on('orderForm:submit', () => {
	const initialState: Partial<IOrderRequest> & IFormState = {
		valid: false, // Начальное состояние валидации
		errors: [], // Начальное состояние ошибок
		email: '', // Начальное значение поля email
		phone: '', // Начальное значение поля phone
	};
	modal.render({ content: formContacts.render(initialState) });
});

events.on('contactsForm:submit', () => {
	api.postOrder(appState.order as IOrderRequest).then((res) => {
		const SuccessModalTemplate = ensureElement<HTMLTemplateElement>('#success');
		const SuccessWindow = new SuccessModal(
			cloneTemplate(SuccessModalTemplate),
			events
		);
		SuccessWindow.description = `Списано: ${res.total} синапсов`;
		modal.render({ content: SuccessWindow.render() });
		console.log(res);

// очщаем корзину и счетчик после усешного заказа

		appState.clearBasket();
		page.counter = appState.getBasket().length;
	});
});

events.on('modalSucces:close', () => {
	modal.closeModal();
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getProductList()
	.then((data) => {
		appState.setCards = data;
	})
	.catch((err) => {
		console.log(err);
	});
