export type CategoryType = "софт-скилл" | "другое" | "дополнительное" | "кнопка" | "хард-скилл";
export type PaymentMethod = "CASH" | "CARD";

export interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: CategoryType;
  price: number;
}

export interface IOrderProducts {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}


export interface IOrderRequest {
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
  total: number;
}

export interface IOrderResult {
  id: string;
  total: number;
  status: 'pending' | 'completed' | 'failed';
}



// -----------------------------------Модель данных--------------------------------------------------------



