import { initFormValidation } from '../../scripts/formValidation';

export function initLeadModal() {
  const backdrop = document.getElementById('lead-modal-backdrop');
  if (!backdrop) return;

  const modalInner = backdrop.querySelector('[data-modal-inner]');
  const form = document.getElementById('lead-modal-form') as HTMLFormElement | null;

  const originalOverflow = document.body.style.overflow;
  const originalPaddingRight = document.body.style.paddingRight;

  const getScrollbarWidth = () =>
    window.innerWidth - document.documentElement.clientWidth;

  function lockBodyScroll() {
    const scrollbarWidth = getScrollbarWidth();

    document.body.style.overflow = 'hidden';
  }

  function unlockBodyScroll() {
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
  }

  function openLeadModal() {
    backdrop?.classList.add('open');
    backdrop?.setAttribute('aria-hidden', 'false');
    lockBodyScroll();

    const firstInput = backdrop?.querySelector('input:not([type="hidden"])');
    if (firstInput instanceof HTMLElement) {
      firstInput.focus();
    }
  }

  function closeLeadModal() {
    backdrop?.classList.remove('open');
    backdrop?.setAttribute('aria-hidden', 'true');
    unlockBodyScroll();
  }

  document.querySelectorAll('[data-open-lead]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openLeadModal();
    });
  });

  backdrop.querySelectorAll('[data-close-lead]').forEach((el) => {
    el.addEventListener('click', () => closeLeadModal());
  });

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeLeadModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeLeadModal();
    }
  });

  backdrop.addEventListener(
    'touchmove',
    (e) => {
      if (modalInner && !modalInner.contains(e.target as Node)) {
        e.preventDefault();
      }
    },
    { passive: false },
  );

  if (form) {
    initFormValidation(form, (formData) => {
      console.log('Lead form submitted:', formData);
      alert('Заявка отправлена!');
      form.reset();
      closeLeadModal();
    });
  }
}
