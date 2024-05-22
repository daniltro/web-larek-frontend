import { IOrderRequest, IProductItem } from "../../types";

interface IWebLArekApi {
  cdn: string;
  items: IProductItem;
  getProdutList: () => Promise<IProductItem[]>;
  postOrder: (order: IOrderRequest) => Promise<IProductItem>;
}