interface IFormOrder {
  formOrder: HTMLFormElement;
	inputAdress: HTMLInputElement;
	paymentMethod: HTMLElement;
  buttonSubmit: HTMLButtonElement;
	formErrors: HTMLElement;
	render(): HTMLElement;
}

export interface IContacts {
  formContacts: HTMLFormElement;
  inputEmail: HTMLInputElement;
  inputPhone: HTMLInputElement;
  buttonSubmit: HTMLButtonElement;
  formErrors: HTMLElement;
  render(): HTMLElement;
}