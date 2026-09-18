document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const button = form.querySelector("button[type='submit']");
      const originalText = button.textContent;
      button.textContent = "Danke! Wir melden uns.";
      button.disabled = true;
      setTimeout(() => {
        form.reset();
        button.textContent = originalText;
        button.disabled = false;
      }, 2500);
    });
  }

  // Seamless logo marquee: duplicate the items in place so the -50% loop is invisible
  const logoTrack = document.getElementById("logoTrack");
  if (logoTrack) {
    const items = Array.from(logoTrack.children);
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      logoTrack.appendChild(clone);
    });
  }

  // Category cards flip on hover (desktop) or tap (touch)
  const canHover = window.matchMedia("(hover: hover)").matches;
  document.querySelectorAll(".category-card[data-flip]").forEach((card) => {
    if (canHover) {
      card.addEventListener("mouseenter", () => card.classList.add("is-flipped"));
      card.addEventListener("mouseleave", () => card.classList.remove("is-flipped"));
      card.addEventListener("focusin", () => card.classList.add("is-flipped"));
      card.addEventListener("focusout", () => card.classList.remove("is-flipped"));
    } else {
      card.addEventListener("click", (event) => {
        if (!card.classList.contains("is-flipped")) {
          event.preventDefault();
          document.querySelectorAll(".category-card.is-flipped").forEach((other) => {
            if (other !== card) other.classList.remove("is-flipped");
          });
          card.classList.add("is-flipped");
        }
      });
    }
  });

  // Hero cards drift slightly toward the cursor
  const floatCards = document.querySelectorAll(".float-card");
  const heroVisual = document.querySelector(".hero-visual");
  if (heroVisual && floatCards.length && canHover) {
    heroVisual.addEventListener("mousemove", (event) => {
      const bounds = heroVisual.getBoundingClientRect();
      const relX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const relY = (event.clientY - bounds.top) / bounds.height - 0.5;
      floatCards.forEach((card) => {
        card.style.setProperty("--mx", `${relX * 10}px`);
        card.style.setProperty("--my", `${relY * 10}px`);
      });
    });
    heroVisual.addEventListener("mouseleave", () => {
      floatCards.forEach((card) => {
        card.style.setProperty("--mx", "0px");
        card.style.setProperty("--my", "0px");
      });
    });
  }

  // Preloader: reveal the page once everything is ready
  const showPage = () => document.body.classList.add("page-ready");
  if (document.readyState === "complete") {
    setTimeout(showPage, 300);
  } else {
    window.addEventListener("load", () => setTimeout(showPage, 300));
  }
});
