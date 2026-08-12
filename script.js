const yearNode = document.getElementById("year");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".site-nav");
const bookingForm = document.getElementById("booking-form");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const button = bookingForm.querySelector("button");
    const originalText = button.textContent;

    button.textContent = "Request Sent";
    button.disabled = true;

    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      bookingForm.reset();
    }, 2000);
  });
}
