// Validation rules
interface ValidationRule {
  required?: boolean; // defaults to true
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  messages: {
    required?: string;
    minLength?: string;
    maxLength?: string;
    pattern?: string;
  };
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

const VALIDATION_RULES: ValidationRules = {
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s'-]+$/,
    messages: {
      required: 'Пожалуйста, введите имя',
      minLength: 'Имя должно содержать минимум 2 символа',
      maxLength: 'Имя не должно превышать 50 символов',
      pattern: 'Имя может содержать только буквы, пробелы, дефис и апостроф'
    }
  },
};

interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validateField(fieldName: string, value: string): ValidationResult {
  const rules = VALIDATION_RULES[fieldName];
  if (!rules) return { valid: true };

  const trimmedValue = value.trim();
  const isRequired = rules.required !== false; // defaults to true

  if (!trimmedValue) {
    if (isRequired) {
      return {
        valid: false,
        message: rules.messages.required
      };
    }
    return { valid: true };
  }

  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return {
      valid: false,
      message: rules.messages.minLength
    };
  }

  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    return {
      valid: false,
      message: rules.messages.maxLength
    };
  }

  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    return {
      valid: false,
      message: rules.messages.pattern
    };
  }

  return { valid: true };
}

export function validatePhone(input: HTMLInputElement, required: boolean = true): ValidationResult {
  const iti = (input as any).intlTelInputInstance;

  if (!iti) {
    return {
      valid: false,
      message: 'Телефон не инициализирован'
    };
  }

  const value = input.value.trim();

  if (!value) {
    if (required) {
      return {
        valid: false,
        message: 'Пожалуйста, введите телефон'
      };
    }
    return { valid: true };
  }

  console.log(iti.isValidNumber(), iti.getNumberType())

  if (!iti.isValidNumber() || iti.getNumberType() < 1) {
    return {
      valid: false,
      message: 'Некорректный формат телефона'
    };
  }

  return { valid: true };
}

export function showError(input: HTMLInputElement, message: string): void {
  const wrapper = input.closest('.input-wrapper') as HTMLElement;
  if (!wrapper) return;

  const span = wrapper.querySelector('.error-message span') as HTMLElement;
  if (span) span.textContent = message;

  wrapper.classList.remove('is-hiding-error');
  wrapper.classList.add('has-error');

  if (input.hasAttribute('data-phone-input')) {
    wrapper.querySelector('.iti')?.classList.add('error');
  } else {
    input.classList.add('error');
  }
}


export function hideError(input: HTMLInputElement): void {
  const wrapper = input.closest('.input-wrapper') as HTMLElement;
  if (!wrapper) return;

  if (!wrapper.classList.contains('has-error')) return;

  const span = wrapper.querySelector('.error-message span') as HTMLElement;
  if (!span) return;

  wrapper.classList.add('is-hiding-error');

  if (input.hasAttribute('data-phone-input')) {
    wrapper.querySelector('.iti')?.classList.remove('error');
  } else {
    input.classList.remove('error');
  }

  const onTransitionEnd = (e: TransitionEvent) => {
    if (e.target !== span || e.propertyName !== 'opacity') return;

    span.textContent = '';
    wrapper.classList.remove('has-error');
    wrapper.classList.remove('is-hiding-error');

    span.removeEventListener('transitionend', onTransitionEnd);
  };

  span.addEventListener('transitionend', onTransitionEnd);
}


interface FormData {
  [key: string]: string;
}

export function initFormValidation(
  form: HTMLFormElement,
  onSubmitSuccess?: (formData: FormData) => void
): void {
  const inputs = form.querySelectorAll<HTMLInputElement>('input[name]');
  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;

  if (!submitBtn) return;

  const validationState: { [key: string]: boolean } = {};
  inputs.forEach(input => {
    const isRequired = !input.hasAttribute('data-optional');
    validationState[input.name] = !isRequired; // optional fields start as valid
  });

  function updateSubmitButton(): void {
    const allValid = Object.values(validationState).every(valid => valid);
    submitBtn.disabled = !allValid;
  }

  function validateInput(input: HTMLInputElement): void {
    let validation: ValidationResult;
    const isRequired = !input.hasAttribute('data-optional');

    if (input.hasAttribute('data-phone-input')) {
      validation = validatePhone(input, isRequired);
    } else {
      validation = validateField(input.name, input.value);
    }

    if (!validation.valid && validation.message) {
      showError(input, validation.message);
      validationState[input.name] = false;
    } else {
      hideError(input);
      validationState[input.name] = true;
    }

    updateSubmitButton();
  }

  inputs.forEach(input => {
    let hasBlurred = false;

    input.addEventListener('blur', () => {
      hasBlurred = true;
      validateInput(input);
    });

    input.addEventListener('input', () => {
      if (hasBlurred || validationState[input.name]) {
        validateInput(input);
      }
    });

    if (input.hasAttribute('data-phone-input')) {
      const iti = (input as any).intlTelInputInstance;
      if (iti) {
        input.addEventListener('countrychange', () => {
          if (hasBlurred || validationState[input.name]) {
            validateInput(input);
          }
        });

        input.addEventListener('paste', () => {
          setTimeout(() => {
            validateInput(input);
          }, 0);
        });
      }
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasErrors = false;
    inputs.forEach(input => {
      let validation: ValidationResult;
      const isRequired = !input.hasAttribute('data-optional');

      if (input.hasAttribute('data-phone-input')) {
        validation = validatePhone(input, isRequired);
      } else {
        validation = validateField(input.name, input.value);
      }

      if (!validation.valid && validation.message) {
        showError(input, validation.message);
        validationState[input.name] = false;
        hasErrors = true;
      } else {
        hideError(input);
        validationState[input.name] = true;
      }
    });

    updateSubmitButton();

    if (!hasErrors && onSubmitSuccess) {
      const formData: FormData = {};
      inputs.forEach(input => {
        if (input.hasAttribute('data-phone-input')) {
          const iti = (input as any).intlTelInputInstance;
          formData[input.name] = iti ? iti.getNumber() : input.value;
        } else {
          formData[input.name] = input.value;
        }
      });

      onSubmitSuccess(formData);
    }
  });

  updateSubmitButton();
}
