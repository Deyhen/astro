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
