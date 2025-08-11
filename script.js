document.addEventListener("DOMContentLoaded", () => {

  /* -------------------
     Mobile menu toggle
  -------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  navToggle?.addEventListener("click", () => {
    mainNav.classList.toggle("active");
  });

  /* -------------------
     NEW: Dropdown (click/tap on mobile, hover on desktop)
  -------------------- */
  const DROPDOWN_BREAKPOINT = 768; // match CSS
  const dropdownParents = document.querySelectorAll("#main-nav .has-dropdown > a");

  dropdownParents.forEach(anchor => {
    const parentLi = anchor.parentElement;

    // Improve a11y: set proper ARIA state initially
    anchor.setAttribute("aria-expanded", "false");

    anchor.addEventListener("click", (e) => {
      const isMobile = window.innerWidth <= DROPDOWN_BREAKPOINT || mainNav.classList.contains("active");
      if (isMobile) {
        e.preventDefault();

        // close siblings
        const siblings = parentLi.parentElement.querySelectorAll(".has-dropdown.open");
        siblings.forEach(sib => {
          if (sib !== parentLi) {
            sib.classList.remove("open");
            const a = sib.querySelector(":scope > a");
            if (a) a.setAttribute("aria-expanded", "false");
          }
        });

        // toggle this one
        const willOpen = !parentLi.classList.contains("open");
        parentLi.classList.toggle("open", willOpen);
        anchor.setAttribute("aria-expanded", String(willOpen));
      }
    });

    // keyboard accessibility (Enter/Space) for desktop users
    anchor.addEventListener("keydown", (e) => {
      const key = e.key;
      if (key === "Enter" || key === " ") {
        const isMobile = window.innerWidth <= DROPDOWN_BREAKPOINT || mainNav.classList.contains("active");
        if (isMobile) {
          e.preventDefault();
          anchor.click();
        }
      }
    });
  });

  // Close open dropdowns when clicking outside on mobile
  document.addEventListener("click", (e) => {
    const isMobile = window.innerWidth <= DROPDOWN_BREAKPOINT || mainNav.classList.contains("active");
    if (!isMobile) return;
    const nav = document.getElementById("site-header");
    if (nav && !nav.contains(e.target)) {
      document.querySelectorAll("#main-nav .has-dropdown.open").forEach(li => {
        li.classList.remove("open");
        const a = li.querySelector(":scope > a");
        if (a) a.setAttribute("aria-expanded", "false");
      });
    }
  });

  // Reset state on resize up to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > DROPDOWN_BREAKPOINT) {
      document.querySelectorAll("#main-nav .has-dropdown.open").forEach(li => {
        li.classList.remove("open");
        const a = li.querySelector(":scope > a");
        if (a) a.setAttribute("aria-expanded", "false");
      });
    }
  });

  /* -------------------
     Sticky header shadow on scroll
  -------------------- */
  const siteHeader = document.getElementById("site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  });

  /* -------------------
     CountUp animations
  -------------------- */
  const options = { duration: 3 };
  const stats = [
    { id: 'clients', value: 832 },
    { id: 'assets', value: 2.1, isCurrency: true, suffix: 'B' },
    { id: 'projects', value: 2394 },
    { id: 'companies', value: 470 }
  ];

  stats.forEach(stat => {
    let counter;
    if (stat.isCurrency) {
      counter = new countUp.CountUp(stat.id, stat.value, {
        ...options,
        prefix: '€',
        suffix: stat.suffix || '',
        decimalPlaces: 1
      });
    } else {
      counter = new countUp.CountUp(stat.id, stat.value, options);
    }
    if (!counter.error) {
      counter.start();

      /* NEW: Gold glow effect on stat icons when count starts */
      const statEl = document.getElementById(stat.id)?.closest('.stat');
      if (statEl) {
        const icon = statEl.querySelector('svg');
        if (icon) {
          icon.style.color = 'var(--color-gold)';
          setTimeout(() => { icon.style.color = 'var(--color-primary)'; }, 1500);
        }
      }
    }
  });

  /* -------------------
     Fade-up animation with smoother ease
  -------------------- */
  const elements = document.querySelectorAll(".fade-up");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute("data-anim-delay") || "0";
        entry.target.style.transition = `opacity 0.9s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.9s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));

  /* -------------------
     Hero text load animation
  -------------------- */
  const heroHeading = document.querySelector(".hero h1");
  const heroSubheading = document.querySelector(".hero p");
  const heroCTA = document.querySelector(".hero .btn-primary");

  if (heroHeading && heroSubheading && heroCTA) {
    [heroHeading, heroSubheading, heroCTA].forEach(el => {
      el.style.opacity = 0;
      el.style.transform = "translateY(20px)";
    });

    setTimeout(() => {
      heroHeading.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
      heroHeading.style.opacity = 1;
      heroHeading.style.transform = "translateY(0)";
    }, 200);

    setTimeout(() => {
      heroSubheading.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
      heroSubheading.style.opacity = 1;
      heroSubheading.style.transform = "translateY(0)";
    }, 500);

    setTimeout(() => {
      heroCTA.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
      heroCTA.style.opacity = 1;
      heroCTA.style.transform = "translateY(0)";
    }, 800);

    /* Auto shimmer once after load */
    setTimeout(() => {
      heroCTA.classList.add("shimmer");
      setTimeout(() => {
        heroCTA.classList.remove("shimmer");
      }, 1200);
    }, 1400);

    /* NEW: Periodic CTA pulse every 10 seconds */
    setInterval(() => {
      heroCTA.classList.add("btn-pulse");
      setTimeout(() => heroCTA.classList.remove("btn-pulse"), 1500);
    }, 10000);
  }

  /* -------------------
     Simple crossfade slideshow with manual controls
  -------------------- */
  const hero = document.querySelector(".hero");
  const fader = document.querySelector(".hero .hero-fader");
  const prevBtn = document.querySelector(".hero .hero-nav.prev");
  const nextBtn = document.querySelector(".hero .hero-nav.next");

  if (hero && fader && prevBtn && nextBtn) {
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Keep the three images you already use in /assets
    const slides = [
      "assets/hero-office.png",
      "assets/hero-meeting.png",
      "assets/hero-sofa.png"
    ];
    let current = 0;
    let timer = null;
    const INTERVAL = 8000;

    // Set initial slide onto the base layer (::before via CSS var)
    hero.style.setProperty("--hero-bg", `url('${slides[current]}')`);

    function goTo(index) {
      const next = (index + slides.length) % slides.length;
      if (next === current) return;

      // Prepare fader with target image
      fader.style.backgroundImage = `url('${slides[next]}')`;
      // Crossfade in
      fader.classList.add("show");

      // After fade completes, swap base and hide fader
      const onEnd = () => {
        hero.style.setProperty("--hero-bg", `url('${slides[next]}')`);
        fader.classList.remove("show");
        fader.removeEventListener("transitionend", onEnd);
        current = next;
      };
      // In case transitionend doesn’t fire (very rare), fallback
      fader.addEventListener("transitionend", onEnd, { once: true });
      setTimeout(onEnd, 1100);
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function start() {
      if (reduceMotion) return;
      stop();
      timer = setInterval(next, INTERVAL);
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    nextBtn.addEventListener("click", () => { next(); start(); });
    prevBtn.addEventListener("click", () => { prev(); start(); });

    // Pause on hover/focus for better control
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    hero.addEventListener("focusin", stop);
    hero.addEventListener("focusout", start);

    // Keyboard arrows
    hero.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next(); start(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); start(); }
    });
    hero.setAttribute("tabindex", "-1"); // allow focus if needed

    start();
  }

  /* -------------------
     (Removed) Old background-rotation & parallax code to avoid conflicts
  -------------------- */

  /* -------------------
     NEW: Staggered testimonial reveal
  -------------------- */
  const testimonialCards = document.querySelectorAll(".testimonial");
  const testimonialObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        testimonialCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("visible");
          }, index * 300);
        });
        testimonialObserver.disconnect();
      }
    });
  }, { threshold: 0.2 });

  if (testimonialCards.length > 0) {
    testimonialObserver.observe(testimonialCards[0]);
  }

});
