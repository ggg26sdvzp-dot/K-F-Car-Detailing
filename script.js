/*
  SCRIPT GUIDE (script.js)
  ------------------------
  What this file does (and how to edit it):

  - Auto-fill current year: the element with id="year" is updated automatically.
    To change where the year appears, move or rename that <span> in the footer and
    update the id here.
  - Mobile navigation: .nav-toggle toggles the .is-open class on .site-nav.
    To change the trigger or animation, edit the event listener below.
  - Booking form demo: the form with id="booking-form" prevents real submission and
    shows a temporary "Request Sent" message. To actually submit data:
      * Remove the JS submit handler and add a server `action` to the form, or
      * Replace the JS handler with an AJAX/fetch call to your API endpoint.
  - Page-load animation: the code adds `page-loaded` to the <body> on DOMContentLoaded
    which triggers CSS transitions in `style.css`. Change the animation timing in CSS.
*/

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

// Add page-loaded class after DOM is ready to trigger CSS page-load animation
document.addEventListener("DOMContentLoaded", () => {
  // Use requestAnimationFrame to ensure styles have been applied before toggling
  requestAnimationFrame(() => document.body.classList.add("page-loaded"));
});
