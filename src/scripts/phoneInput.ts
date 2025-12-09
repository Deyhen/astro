import intlTelInput from "intl-tel-input";

const initialized = new WeakSet<HTMLInputElement>();

export function initPhoneInput(input: HTMLInputElement): void {
  if (initialized.has(input)) return;
  initialized.add(input);

  const iti = intlTelInput(input, {
    initialCountry: 'ua',
    separateDialCode: true,
    nationalMode: false,
    formatAsYouType: true,
    formatOnDisplay: true,
    autoPlaceholder: 'polite',
    strictMode: true,
    loadUtils: () => import("intl-tel-input/utils")
  });


  (input as any).intlTelInputInstance = iti;

  input.addEventListener('change', () => {
    iti.setNumber(input.value);
  })

}

export function initAllPhoneInputs(): void {
  const inputs = document.querySelectorAll<HTMLInputElement>('[data-phone-input]');
  inputs.forEach((input) => initPhoneInput(input));
}
