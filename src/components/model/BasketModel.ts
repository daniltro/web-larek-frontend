    import { IProductItem } from '../../types'

export interface IBasketModel {
  basketProducts: IProductItem[];
  getCounter: () => number;
  getSumPrice: () => number;
  addSelectedProductToBasket(data: IProductItem): void;
  deleteProductToBasket(item: IProductItem): void;
  clearBasket(): void
}