# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы используемые в приложении

Карточка товара

```
interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: CategoryType;
	price: number | null;
}
```

Тип для категории товара

```
type CategoryType = {
  string: "софт-скилл" | "другое" | "дополнительное" | "кнопка" | "хард-скилд";
}
```


Интерфейс для описания данных передаваемых в запросе на покупку

```
interface IOrderRequest {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}
```

Тип для описания выбора метода оплаты

```

type PaymentMethod = {
  payment: 'CASH' | 'CARD';
};
```

Интерфейс для описания типа данных возвращающихся после успешного запроса на покупку

```
export interface IOrderResult {
	id: string;
	total: number;
}
```

Интерфейс апи для запросов на сервер

```
export interface IWebLarekApi {
	getProductLIst: () => Promise<IProductList>;
	getProductItem: (id: string) => Promise<IProductItem>;
	postOrder: (order: IOrderRequest) => Promise<IOrderResult>;
}
```

Интерфейс корзины

```
export interface IBasket {
  items: BasketItem[];
  total: number;
}
```

Интерфейс элемента в корзине (товара)

```
type BasketItem = {
  id: string;
  title: string;
  price: number;
}
```

Интерфейс базового модального окна

```
export interface IModal {
  isOpen: boolean;
  content: any;
  open: (content: any) => void; 
  close: () => void; 
}
```

Интерфейс модального окна карточки товара

```
export interface IProductModal {
  product: IProductItem;
  closeModal: () => void;
}
```

Интерфейс модального окна с формой выбора способа оплаты и ввода адреса

```
export interface IPaymentModal {
  formData: IPaymentForm;
  updateFormData: (data: Partial<IPaymentForm>) => void;
  submitForm: () => void;
  closeModal: () => void;
}
```

Интерфейс модального окна с формой данных пользователя

```
export interface IContactModal {
  formData: IContactForm;
  updateFormData: (data: Partial<IContactForm>) => void;
  submitForm: () => void;
  closeModal: () => void;
}
```

Интерфейс формы выбора способа оплаты и ввода адреса

```
export interface IPaymentForm {
  payment: PaymentMethod;
  address: string;
}
```

Интерфейс формы данных пользователя

```
export interface IContactForm {
  email: string;
  phone: string;
}
```



## Архитектура приложения

Код приложения разделяется на слои согласно MVP парадигме:

- слой представления отвечает за отображение данных на странице
- слой данных отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных

## Базовый код

#### Класс Api

Содержит в себе базовую логику отправки зарпосов.

Содержит методы:

- 'get' - выполняет GET запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, которым ответил сервер
- 'post' в теле принимает данные в виде объекта в формате JSON в теле запроса и отправляет эти данные на эндпоинт переданный в качестве параметра при вызове метода.

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Используется в презентере для обработки событий и в слоях приложения для генерации событий.
Основные методы, реализуемые описанным интерфейсом 'IEvents':

- 'on' - подписка на событие
- 'off - отписка от события
- 'emit' - инициализация события
- 'onAll' - слушает все события
- 'offAll' - сбрасывает все события
- 'trigger' - возвращает функцию, при вызове которой инициализируется содержимое передаваемое в параметрах собыития

### Слой данных

## класс ApiWebLarekModel 
Имплементирует интерфейс IWebLarekApi
```
interface IWebLArekApi {
  cdn: string;
  items: IProductItem;
  getProdutList: () => Promise<IProductItem[]>;
  postOrder: (order: IOrderRequest) => Promise<IProductItem>;
}
```
 будет наследовать от Api и иметь методы:
- getProductList - полчует список товаров
- postOrder - получает ответ от сервера по заказу товара



## класс BasketModel
Имлементирует интерфейс IBasketModel

```
interface IBasketModel {
  basketProducts: IProductItem[];
  getCounter: () => number;
  getSumPrice: () => number;
  addProductToBasket(data: IProductItem): void;
  deleteProductToBasket(item: IProductItem): void;
  clearBasket(): void
}
```
методы:
- getCounter - возвращает количество товаров в корзине
- getSumPrice - возвращает общую стоимость товаров
- addProductToBasket - добавляет выбранный товар в корзину
- deleteProductToBasket - удаляет вбранный товар из корзины
- clearBasket - очищает козину

## класс FormModel
Имплементирует интерфейс IFormModel

```
interface IFormModel {
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
```

методы:
- setOrderAddress - устанавливает адрес пользователя
- validationOrder - проверяет наличие ошибок валидации в поле адреса / что способ оплаты выбран
- setOrderContacts - устанавливает данные в полях e-mail и номера телефона
- validateContacts - проверяет наличие ошибок валидации в полях ввода e-mail и номера телефона
- getOrderProducts - возврашает объект с данными пользователя и выбранныим товарами

## Класс ProductItemDataModel 
Имплементирует интерфейс IProductItemDataModel 

```
export interface IProductItemDataModel {
  productCards: IProductItem[];
  selectedСard: IProductItem;
  setPreview(item: IProductItem): void;
}
```

метод:

- setPreview - устанавливает данные карточки товара которую открыл пользователь

### Слой отображения
Позволет отображать элементы и окна страницы

## Класс Busket 
Имплементирует интерфейс IBasket

```
export interface IBasket {
  closeButton: HTMLButtonElement;
  title: HTMLTitleElement;
  productsList: HTMLElement;
  submitButton: HTMLButtonElement;
  totalPrice: HTMLSpanElement;
  counterAtPage: HTMLElement;
  busketButtonAtPage: HTMLButtonElement;
  renderCounterAtPage(value: number): HTMLElement;
  renderTotalPrice(totaPrice: number): HTMLElement;
}
```

методы: 
- renderCounterAtPage - отрисовывает число добавленных товаров в корзину на главной странице
- renderTotalPrice - отрисовывает общую стоимость товаров в корзине
- render - возвращает элемент корзины

## Класс BasektItem 
имплементирует интерфейс IBasketItem

методы: 
- deleteBusketItem - удаляет товар из корзины
- render - возвращает элемент товара в корзине

## Класс ProductItem 
Имплементирует интерфейс IProductItem

```
interface IProductItem {
  id: HTMLElement;
  description: HTMLElement;
  image: HTMLElement;
  title:  HTMLElement;
  category: HTMLElement; 
  price: HTMLElement;

  render(): HTMLElement;
}
```

методы:

render - возвращает элемент карточки товара

## Класс Modal 
Имплементирует интерфейс IModal

```
export interface IModal {
  openModal(): void;
  closeModal(): void;
  render(): HTMLElement
}
```

методы:

- openModal - открывает модальное окно
- closeModal - закрывает модальное окно
- render - возвращае HTML элемент модального окна

## Класс SuccessModal
Имплементирует интерфейс ISuccessModal

```
interface ISuccessModal {
  successImage: HTMLImageElement;
  decription: HTMLElement;
  totalPrice: HTMLElement;
  buttonToMainPage: HTMLButtonElement;
  render(): HTMLElement;
}
```

метод:
- render - возвращает HTML элемент модального окна успешной покупки твоара

## Класс FormOrder
Имплементирует интерфейс IFormOrder 

```
interface IFormOrder {
	inputAdress: HTMLInputElement
	paymentMethod: HTMLElement;
	formErrors: HTMLElement;
	render(): HTMLElement;
}
```

метод:
- render - возвращает HTML элемент формы заказа с полем ввода адреса и выбором способа оплаты

## Класс IContacts
Имплементирует интерфейс IContacts

```
interface IContacts {
  formContacts: HTMLFormElement;
  inputEmail: HTMLInputElement;
  inputPhone: HTMLInputElement;
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  render(): HTMLElement;
}
```

метод:
- render - возвращает HTML элемент формы заказа с полями ввода электронной почты и адрема


## UML схема 
https://drive.google.com/file/d/1Y5noT96jFqOuTmXITkjYnVTbrXovkHLA/view?usp=sharing