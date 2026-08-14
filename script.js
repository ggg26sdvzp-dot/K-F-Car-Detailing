/*
  SCRIPT GUIDE (script.js)
  ------------------------
  What this file does (and how to edit it):

  - Auto-fill current year: the element with id="year" is updated automatically.
    To change where the year appears, move or rename that <span> in the footer and
    update the id here.
  - Mobile navigation: .nav-toggle toggles the .is-open class on .site-nav.
    To change the trigger or animation, edit the event listener below.
  - Booking form: forms with id="booking-form" now submit for real using Formspree
    (https://formspree.io). Formspree emails you every submission, and you can turn on
    a Zapier/webhook add-on in your Formspree dashboard to also fire a text message.

    TO ACTIVATE THIS:
      1) Go to https://formspree.io and create a free account.
      2) Create a new form and copy its endpoint, e.g. https://formspree.io/f/abc1234
      3) Paste that URL into FORMSPREE_ENDPOINT below, replacing the placeholder.
      4) Deploy/reload the site and submit a test booking — Formspree will ask you to
         confirm your email address the first time.

    That's it — no server or API key required. See the note at the bottom of this file
    for how to also get a text message alert.
  - Page-load animation: the code adds `page-loaded` to the <body> on DOMContentLoaded
    which triggers CSS transitions in `style.css`. Change the animation timing in CSS.
*/

// STEP 3 ABOVE: replace this placeholder with your real Formspree endpoint.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

const yearNode = document.getElementById("year");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".site-nav");
const bookingForms = document.querySelectorAll("#booking-form");

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

function ensureStatusNode(form) {
  let status = form.querySelector(".form-status");
  if (!status) {
    status = document.createElement("p");
    status.className = "form-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    form.appendChild(status);
  }
  return status;
}

bookingForms.forEach((bookingForm) => {
  const status = ensureStatusNode(bookingForm);

  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = bookingForm.querySelector("button");
    const originalText = button.textContent;

    if (FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID")) {
      status.textContent =
        "Booking form isn't connected yet — add your Formspree endpoint in script.js.";
      status.classList.add("form-status-error");
      return;
    }

    button.textContent = "Sending...";
    button.disabled = true;
    status.textContent = "";
    status.classList.remove("form-status-error", "form-status-success");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(bookingForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        button.textContent = "Request Sent";
        status.textContent = "Thanks! We'll text or call you back shortly.";
        status.classList.add("form-status-success");
        bookingForm.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      status.textContent =
        "Something went wrong sending your request. Please call or text us directly.";
      status.classList.add("form-status-error");
    } finally {
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);
    }
  });
});

// Page-load animation: adds `page-loaded` to <body> to trigger CSS transitions.
document.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => document.body.classList.add("page-loaded"));
});

/*
  WANT A TEXT MESSAGE INSTEAD OF (OR IN ADDITION TO) EMAIL?
  -----------------------------------------------------------
  Formspree only sends email by default, but you have two free/easy options:

  OPTION A — Email-to-text via your carrier (fastest, no extra signup):
    Set up an email forwarding rule (e.g., in Gmail) so any email from Formspree
    is auto-forwarded to your phone's carrier email gateway:
      AT&T:      10digitnumber@txt.att.net
      Verizon:   10digitnumber@vtext.com
      T-Mobile:  10digitnumber@tmomail.net
    This is free but can be a little unreliable/delayed depending on carrier.

  OPTION B — Formspree + Zapier (reliable, still free tier available):
    In your Formspree dashboard, connect a "Zapier" or "Webhook" integration,
    then set up a free Zapier account with a Zap: "New Formspree submission" ->
    "Send SMS via Twilio" (or "Send SMS via Zapier's built-in SMS action" if on
    a paid Zapier/Twilio plan). This gives instant, reliable text alerts.
*/
