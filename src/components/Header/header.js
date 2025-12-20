export function initHeaderScrollEffect() {
  const header = document.getElementById("site-header");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}


export function initHeaderMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  function openMenu() {
    menuBtn.classList.add('active');
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    menuBtn.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('no-scroll');

    // дождаться fade-out, затем скрыть display
    mobileMenu.addEventListener(
      'transitionend',
      () => {
        if (!mobileMenu.classList.contains('open')) {
          mobileMenu.classList.add('hidden');
        }
      },
      { once: true }
    );
  }

  menuBtn?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.contains('open');

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

}
