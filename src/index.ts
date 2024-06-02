import './scss/styles.scss';
import { API_URL, CDN_URL } from './types/constants';

import { IProductItem, IOrderRequest, IOrderResult } from './types';
import { EventEmitter } from './components/base/events';
import { AppState } from './components/model/AppState';
import { Page } from './components/View/page';
import { ProductListItem } from './components/View/ProductItem';

import { WebLarekApi } from './components/model/ApiModel';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/View/Modal';
import { ProductPreview } from './components/View/ProductItem';
import { IModalData } from './components/View/Modal';

const pageWrapper = document.querySelector('.page') as HTMLElement;
const cardItemTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const api = new WebLarekApi(CDN_URL, API_URL);
const events = new EventEmitter();
const appState = new AppState({}, events);
const page = new Page(pageWrapper, events);
const modalContainer = ensureElement<HTMLTemplateElement>('#modal-container') as HTMLElement;
const itemPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modal = new Modal(modalContainer, events);


events.on('productList:changed', ()  => { 
	page.catalog = appState.getCards.map((item) => {
		const card = new ProductListItem(
			'card',
			cloneTemplate(cardItemTemplate), events);
		return card.render({
			id: item.id,
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
})

events.on('item:selected', (data) => {
	const itemData = data as ProductListItem;
	const item = appState.getCards.find((item) => item.id === itemData.id);
	const productPreviewreviewItem = new ProductPreview('card', cloneTemplate(itemPreviewTemplate), events);
	const itemContent = productPreviewreviewItem.render(item); 
	modal.render({ content: itemContent });
});


events.on('modal:open', () => {
	page.locked = true;
})

events.on('modal:close', ()  =>  {
	page.locked = false;
});

api.getProductList()
.then((data) => {
	appState.setCards = data
})
.catch(err => {
	console.log(err)
})