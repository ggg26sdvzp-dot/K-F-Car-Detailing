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
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xdendvyg";

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

function formatPhoneNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function isValidPhoneNumber(value) {
  return value.replace(/\D/g, "").length === 10;
}

bookingForms.forEach((bookingForm) => {
  const status = ensureStatusNode(bookingForm);
  const phoneInput = bookingForm.querySelector('input[name="phone"]');

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      const formattedPhone = formatPhoneNumber(phoneInput.value);
      phoneInput.value = formattedPhone;

      if (isValidPhoneNumber(formattedPhone)) {
        phoneInput.setCustomValidity("");
      } else {
        phoneInput.setCustomValidity("Please enter a valid 10-digit phone number.");
      }
    });
  }

  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = bookingForm.querySelector("button");
    const originalText = button.textContent;
    const currentPhone = phoneInput ? phoneInput.value : "";

    if (phoneInput && !isValidPhoneNumber(currentPhone)) {
      phoneInput.focus();
      phoneInput.setCustomValidity("Please enter a valid 10-digit phone number.");
      phoneInput.reportValidity();
      status.textContent = "Please enter a valid 10-digit phone number.";
      status.classList.add("form-status-error");
      return;
    }

    if (FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID")) {
      status.textContent =
        "Booking form isn't connected yet — add your Formspree endpoint in script.js.";
      status.classList.add("form-status-error");
      return;
    }

    if (phoneInput) {
      phoneInput.value = formatPhoneNumber(currentPhone);
      phoneInput.setCustomValidity("");
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

// Gallery slideshow (gallery.html)
const slideshow = document.querySelector(".slideshow");
if (slideshow) {
  const track = slideshow.querySelector(".slideshow-track");
  const dotsWrap = slideshow.querySelector(".slide-dots");
  const prevBtn = slideshow.querySelector(".slide-prev");
  const nextBtn = slideshow.querySelector(".slide-next");

  const galleryMedia = [
    { type: "image", src: "images&videos/businessinfo/octoberflyer.png", alt: "October promotional flyer" },
    { type: "image", src: "images&videos/businessinfo/kfpackages.PNG", alt: "K&F Car Detailing service packages" },
    { type: "video", src: "images&videos/carsreel/IMG_6855.MOV", poster: "images&videos/carsreel/IMG_6855.JPEG", alt: "Detailing video preview" },
    { type: "video", src: "images&videos/carsreel/IMG_6856.MOV", poster: "images&videos/carsreel/IMG_6856.JPEG", alt: "Detailing work showcase video" },
    { type: "video", src: "images&videos/carsreel/IMG_6857.MOV", poster: "images&videos/carsreel/IMG_6857.JPEG", alt: "Vehicle detail video" },
    { type: "image", src: "images&videos/carsreel/cleaningfrontofcar.JPEG", alt: "Professional front car cleaning" },
    { type: "image", src: "images&videos/carsreel/cleaningfrontofcar2.JPEG", alt: "Front bumper detail result" },
    { type: "image", src: "images&videos/carsreel/foamonbackcar.JPEG", alt: "Foam application on the back of the vehicle" },
    { type: "image", src: "images&videos/carsreel/foamonbackcar2.JPEG", alt: "Foam detail on vehicle exterior" },
    { type: "image", src: "images&videos/carsreel/foamoncar.JPEG", alt: "Foam treatment across the car" },
    { type: "image", src: "images&videos/carsreel/resultoffront.JPEG", alt: "Detailing result of front of car" },
    { type: "image", src: "images&videos/carsreel/resultofengine.JPEG", alt: "Detailing result of the engine bay" },
    { type: "image", src: "images&videos/carsreel/resultoffrantofcarwithdoorsclosed.JPEG", alt: "Finished car detail with doors closed" },
    { type: "image", src: "images&videos/carsreel/dashboardresultofcar.JPEG", alt: "Dashboard detailing result" },
    { type: "image", src: "images&videos/carsreel/driverseatresult.JPEG", alt: "Driver seat detailing result" },
    { type: "image", src: "images&videos/carsreel/insidefrontresult.JPEG", alt: "Inside front detailing result" },
    { type: "image", src: "images&videos/carsreel/backseatresult.JPEG", alt: "Back seat detailing result" }
  ];

  if (!track) {
    console.warn("Gallery slideshow skipped: missing slideshow track.");
  } else {
    const slides = [];

    galleryMedia.forEach((item, i) => {
      const slide = document.createElement("figure");
      slide.className = "slide";
      const media = item.type === "video" ? document.createElement("video") : document.createElement("img");

      if (item.type === "video") {
        media.src = item.src;
        media.poster = item.poster;
        media.controls = true;
        media.muted = true;
        media.loop = true;
        media.autoplay = true;
        media.playsInline = true;
        media.preload = "metadata";
      } else {
        media.src = item.src;
        media.alt = item.alt;
        media.loading = "lazy";
        media.decoding = "async";
      }

      media.setAttribute("aria-label", item.alt);
      media.setAttribute("tabindex", "0");
      media.setAttribute("role", "button");
      media.addEventListener("click", () => openFullscreenMedia(slide));
      media.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openFullscreenMedia(slide);
        }
      });

      slide.appendChild(media);
      track.appendChild(slide);
      slides.push(slide);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slide-dot";
      dot.setAttribute("aria-label", `Go to image ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    let index = 0;
    let autoplayTimer = null;
    let isFullscreen = false;
    const dots = Array.from(dotsWrap.children);

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    }

    function goTo(i) {
      if (isFullscreen) return;
      index = (i + slides.length) % slides.length;
      render();
    }

    function startAutoplay() {
      if (isFullscreen || slides.length < 2) return;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => goTo(index + 1), 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }

    function openFullscreenMedia(slide) {
      const media = slide.querySelector("img, video");
      if (!media || isFullscreen) return;

      const overlay = document.createElement("div");
      overlay.className = "gallery-fullscreen";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");

      const panel = document.createElement("div");
      panel.className = "gallery-fullscreen-panel";

      const fullMedia = media.tagName === "VIDEO" ? document.createElement("video") : document.createElement("img");

      if (fullMedia.tagName === "VIDEO") {
        fullMedia.src = media.src;
        fullMedia.poster = media.poster;
        fullMedia.controls = true;
        fullMedia.autoplay = true;
        fullMedia.muted = true;
        fullMedia.loop = true;
        fullMedia.playsInline = true;
      } else {
        fullMedia.src = media.src;
        fullMedia.alt = media.alt;
      }

      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "gallery-fullscreen-close";
      closeBtn.setAttribute("aria-label", "Close fullscreen view");
      closeBtn.textContent = "×";

      closeBtn.addEventListener("click", closeFullscreenMedia);
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
          closeFullscreenMedia();
        }
      });

      panel.appendChild(closeBtn);
      panel.appendChild(fullMedia);
      overlay.appendChild(panel);
      document.body.appendChild(overlay);
      document.body.classList.add("gallery-fullscreen-open");
      isFullscreen = true;
      stopAutoplay();

      document.addEventListener("keydown", handleEscapeKey);

      function handleEscapeKey(event) {
        if (event.key === "Escape") {
          closeFullscreenMedia();
        }
      }

      function closeFullscreenMedia() {
        overlay.remove();
        document.body.classList.remove("gallery-fullscreen-open");
        isFullscreen = false;
        document.removeEventListener("keydown", handleEscapeKey);
        startAutoplay();
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        goTo(index - 1);
        stopAutoplay();
        startAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        goTo(index + 1);
        stopAutoplay();
        startAutoplay();
      });
    }

    slideshow.addEventListener("mouseenter", () => {
      if (!isFullscreen) stopAutoplay();
    });
    slideshow.addEventListener("mouseleave", () => {
      if (!isFullscreen) startAutoplay();
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    track.addEventListener(
      "touchstart",
      (event) => {
        if (isFullscreen) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        isSwiping = true;
        stopAutoplay();
      },
      { passive: true }
    );

    track.addEventListener(
      "touchmove",
      (event) => {
        if (!isSwiping || isFullscreen) return;
        const deltaX = event.touches[0].clientX - touchStartX;
        const deltaY = event.touches[0].clientY - touchStartY;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          event.preventDefault();
        }
      },
      { passive: false }
    );

    track.addEventListener("touchend", (event) => {
      if (!isSwiping || isFullscreen) return;
      isSwiping = false;
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const SWIPE_THRESHOLD = 40;
      if (deltaX > SWIPE_THRESHOLD) {
        goTo(index - 1);
      } else if (deltaX < -SWIPE_THRESHOLD) {
        goTo(index + 1);
      }
      startAutoplay();
    });

    render();
    startAutoplay();
  }
}

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
