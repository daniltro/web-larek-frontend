import { IOrderProducts } from "../../types";

export interface IFormModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  setOrderAddress(field: string, value: string): void
  validateOrder(): boolean;
  setOrderContacts(field: string, value: string): void
  validateContacts(): boolean;
  getOrderProducts(): IOrderProducts;
}