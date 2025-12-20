import { initFormValidation } from '../../scripts/formValidation';

const API_URL =
  import.meta.env.PUBLIC_API_URL || 'https://app-server.arcticautotrade.workers.dev';

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
    initFormValidation(form, async (formData) => {
      const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalText = submitBtn.textContent;

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        const response = await fetch(`${API_URL}/api/apply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            message: formData.car || undefined,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit');
        }

        alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
        form.reset();
        closeLeadModal();
      } catch (error) {
        console.error('Form submission error:', error);
        alert('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
}
