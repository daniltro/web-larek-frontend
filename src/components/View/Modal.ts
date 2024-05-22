export interface IModal {
  openModal(): void;
  closeModal(): void;
  render(): HTMLElement
}

export interface ISuccessModal {
  successImage: HTMLImageElement;
  decription: HTMLElement;
  totalPrice: HTMLElement;
  buttonToMainPage: HTMLButtonElement;
  render(): HTMLElement;
}