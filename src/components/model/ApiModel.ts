import { IOrderRequest, IOrderResult, IProductItem } from "../../types";
import { Api,  ApiListResponse  } from "../base/api";


interface IWebLarekApi {
  cdn: string;
  getProductItem: (id: string) => Promise<IProductItem>;
  getProductList: () => Promise<IProductItem[]>;
  postOrder: (order: IOrderRequest) => Promise<IOrderResult>;
}

export class WebLarekApi extends Api implements IWebLarekApi {
   cdn: string;
  
  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl);
    this.cdn = cdn;
  }

  getProductList(): Promise<IProductItem[]> {
    return this.get('/product')
    .then((data: ApiListResponse<IProductItem>) =>
      data.items.map((item) => ({
        ...item,
        image: `${this.cdn}/${item.image}`,
      }))
      
    )
  }

  getProductItem(id: string): Promise<IProductItem> {
    return this.get(`/product/${id}`)
    .then((data: IProductItem) => ({
      ...data,
      image: `${this.cdn}/${data.image}`,
    }))
  
  }

  postOrder(order: IOrderRequest): Promise<IOrderResult> {
    return this.post('/order/', order)
    .then((data: IOrderResult)  =>  data)
  }

}

