import { IProductItem } from "../../types";

export interface IProductItemDataModel {
  productCards: IProductItem[];
  selectedСard: IProductItem;
  setPreview(item: IProductItem): void;
}