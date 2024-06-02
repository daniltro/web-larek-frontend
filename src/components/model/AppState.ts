import { IProductItem } from '../../types';
import { IEvents } from '../base/events';
import { Model } from '../base/model';
import { ProductListItem } from '../View/ProductItem';

export interface IAppStateData {
	cards: IProductItem[];
	selectedCard: IProductItem;

}

export class AppState extends Model<IAppStateData> {

  protected basket: IProductItem[] = [];
	protected _cards: IProductItem[];
	protected _selectedCard: IProductItem;
	protected events: IEvents;

  set setCards(cards: IProductItem[]) {
    this._cards = cards;
    this.events.emit('productList:changed');
  }

  get getCards() {
    return this._cards;
  }

  getCard( cardId: string): IProductItem | undefined {
    return this._cards.find(item => item.id === cardId);
  }

  set selectedCard(card: IProductItem)  {
    this._selectedCard  =  card;
    this.events.emit('selectedCard:changed');
  }

	get selectedCard () {
  return this._selectedCard
  }
  
  addCardToBasket(card: IProductItem)   {
    this.basket = [card,...this._cards];
    this.events.emit('cards:changed');
  }

  removeCardFromBasket(card: IProductItem)  {
    this.basket = this.basket.filter(item => item.id !== card.id);
    this.events.emit('cards:changed');
  }

  checkValidation() {

  }
}
