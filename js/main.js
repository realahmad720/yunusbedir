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

  // Hero cards tilt and drift toward the cursor, like a card floating in space
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
        card.style.setProperty("--rx", `${relY * -7}deg`);
        card.style.setProperty("--ry", `${relX * 9}deg`);
      });
    });
    heroVisual.addEventListener("mouseleave", () => {
      floatCards.forEach((card) => {
        card.style.setProperty("--mx", "0px");
        card.style.setProperty("--my", "0px");
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  // Portfolio pieces tilt toward the cursor with a glossy highlight, like a laminated print catching light
  if (canHover) {
    document.querySelectorAll(".work").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const bounds = card.getBoundingClientRect();
        const px = ((event.clientX - bounds.left) / bounds.width) * 100;
        const py = ((event.clientY - bounds.top) / bounds.height) * 100;
        const rx = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10;
        const ry = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
        card.style.setProperty("--px", `${px}%`);
        card.style.setProperty("--py", `${py}%`);
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Scroll reveal: sections and cards rise into place with a slight 3D tilt
  const revealTargets = document.querySelectorAll(".reveal");
  if (revealTargets.length) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      revealTargets.forEach((el) => el.classList.add("in-view"));
    } else {
      const groups = new Map();
      revealTargets.forEach((el) => {
        const parent = el.parentElement;
        const index = groups.has(parent) ? groups.get(parent) : 0;
        groups.set(parent, index + 1);
        el.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
      });
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealTargets.forEach((el) => observer.observe(el));
    }
  }

  // Preloader: reveal the page once everything is ready
  const showPage = () => document.body.classList.add("page-ready");
  if (document.readyState === "complete") {
    setTimeout(showPage, 300);
  } else {
    window.addEventListener("load", () => setTimeout(showPage, 300));
  }
});
