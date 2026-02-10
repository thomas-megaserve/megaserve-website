document.addEventListener("DOMContentLoaded", () => {

  /* -------------------
     Constants
  -------------------- */
  const DROPDOWN_BREAKPOINT = 768; // keep in sync with CSS

  /* -------------------
     Mobile menu toggle
  -------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  navToggle?.addEventListener("click", () => {
    mainNav.classList.toggle("active");
  });

  /* -------------------
     Dropdowns (level 1) – click/tap on mobile, hover via CSS on desktop
  -------------------- */
  const dropdownParents = document.querySelectorAll("#main-nav .has-dropdown > a");

  dropdownParents.forEach(anchor => {
    const parentLi = anchor.parentElement;

    // Improve a11y: set proper ARIA state initially
    anchor.setAttribute("aria-expanded", "false");

    anchor.addEventListener("click", (e) => {
      const isMobile = window.innerWidth <= DROPDOWN_BREAKPOINT || mainNav.classList.contains("active");
      if (!isMobile) return; // desktop handled by CSS hover
      e.preventDefault();

      // close sibling dropdowns
      parentLi.parentElement.querySelectorAll(":scope > .has-dropdown.open").forEach(sib => {
        if (sib !== parentLi) {
          sib.classList.remove("open");
          const a = sib.querySelector(":scope > a");
          if (a) a.setAttribute("aria-expanded", "false");
          // also collapse any open flyouts inside the sibling
          sib.querySelectorAll(".has-flyout.open").forEach(f => {
            f.classList.remove("open");
            const fa = f.querySelector(":scope > a");
            if (fa) fa.setAttribute("aria-expanded", "false");
          });
        }
      });

      // toggle this dropdown
      const willOpen = !parentLi.classList.contains("open");
      parentLi.classList.toggle("open", willOpen);
      anchor.setAttribute("aria-expanded", String(willOpen));
    });

    // keyboard accessibility (Enter/Space) for mobile behavior
    anchor.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const isMobile = window.innerWidth <= DROPDOWN_BREAKPOINT || mainNav.classList.contains("active");
        if (isMobile) {
          e.preventDefault();
          anchor.click();
        }
      }
    });
  });

  /* -------------------
     Flyouts (level 2) – nested menus inside dropdowns
     - Desktop: CSS hover shows them.
     - Mobile: click to expand under parent row like an accordion.
  -------------------- */
  const flyoutTriggers = document.querySelectorAll("#main-nav .dropdown li.has-flyout > a");

  flyoutTriggers.forEach(anchor => {
    const li = anchor.parentElement;
    const flyout = li.querySelector(":scope > .flyout");

    // ARIA
    anchor.setAttribute("aria-expanded", "false");

    // Desktop overflow guard: flip to .align-right if spilling off-screen
    function alignFlyoutIfNeeded() {
      if (!flyout) return;
      // only attempt on desktop
      const isDesktop = window.innerWidth > DROPDOWN_BREAKPOINT && !mainNav.classList.contains("active");
      flyout.classList.remove("align-right");
      if (!isDesktop) return;
      // temporarily show to measure without flicker
      const wasHidden = getComputedStyle(flyout).visibility === "hidden";
      if (wasHidden) {
        flyout.style.visibility = "hidden";
        flyout.style.opacity = "0";
        flyout.style.transform = "translateY(0)";
        flyout.style.display = "block";
      }
      const rect = flyout.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        flyout.classList.add("align-right");
      }
      if (wasHidden) {
        flyout.style.removeProperty("visibility");
        flyout.style.removeProperty("opacity");
        flyout.style.removeProperty("transform");
        flyout.style.removeProperty("display");
      }
    }

    // Re-check alignment when first hovered/focused (desktop)
    li.addEventListener("mouseenter", alignFlyoutIfNeeded);
    anchor.addEventListener("focus", alignFlyoutIfNeeded);

    // Mobile click toggle
    anchor.addEventListener("click", (e) => {
      const isMobile = window.innerWidth <= DROPDOWN_BREAKPOINT || mainNav.classList.contains("active");
      if (!isMobile) return; // desktop via CSS
      e.preventDefault();

      // close sibling flyouts under the same dropdown list
      const siblings = li.parentElement.querySelectorAll(":scope > .has-flyout.open");
      siblings.forEach(sib => {
        if (sib !== li) {
          sib.classList.remove("open");
          const a = sib.querySelector(":scope > a");
          if (a) a.setAttribute("aria-expanded", "false");
        }
      });

      const willOpen = !li.classList.contains("open");
      li.classList.toggle("open", willOpen);
      anchor.setAttribute("aria-expanded", String(willOpen));
    });

    // Keyboard a11y for mobile behavior
    anchor.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const isMobile = window.innerWidth <= DROPDOWN_BREAKPOINT || mainNav.classList.contains("active");
        if (isMobile) {
          e.preventDefault();
          anchor.click();
        }
      }
    });
  });

  // Close open dropdowns/flyouts when clicking outside (mobile only)
  document.addEventListener("click", (e) => {
    const isMobile = window.innerWidth <= DROPDOWN_BREAKPOINT || mainNav.classList.contains("active");
    if (!isMobile) return;
    const header = document.getElementById("site-header");
    if (header && !header.contains(e.target)) {
      document.querySelectorAll("#main-nav .has-dropdown.open").forEach(li => {
        li.classList.remove("open");
        const a = li.querySelector(":scope > a");
        if (a) a.setAttribute("aria-expanded", "false");
      });
      document.querySelectorAll("#main-nav .has-flyout.open").forEach(li => {
        li.classList.remove("open");
        const a = li.querySelector(":scope > a");
        if (a) a.setAttribute("aria-expanded", "false");
      });
    }
  });

  // Reset states when resizing up to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > DROPDOWN_BREAKPOINT && !mainNav.classList.contains("active")) {
      document.querySelectorAll("#main-nav .has-dropdown.open, #main-nav .has-flyout.open").forEach(li => {
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
     SAFE CountUp animations
     - Must render EXACTLY:
       1,355 | €550M+ | 110+ | 475
  -------------------- */
  try {
    const hasCountUp = typeof window.countUp !== "undefined" && typeof window.countUp.CountUp === "function";
    const options = { duration: 3 };

    // Gold glow helper (applies to ALL stats, animated or not)
    const glowStatIcon = (el) => {
      const statEl = el?.closest(".stat");
      if (!statEl) return;
      const icon = statEl.querySelector("svg");
      if (!icon) return;
      icon.style.color = "var(--color-gold)";
      setTimeout(() => { icon.style.color = "var(--color-primary)"; }, 1500);
    };

    // Final display strings (exact)
    const stats = [
      { id: "clients",   value: 1355, finalText: "1,355",  useCountUp: true  },
      { id: "assets",    finalText: "€550M+",              useCountUp: false },
      { id: "projects",  finalText: "110+",                useCountUp: false },
      { id: "companies", value: 475,  finalText: "475",    useCountUp: true  }
    ];

    stats.forEach(stat => {
      const el = document.getElementById(stat.id);
      if (!el) return;

      // Always trigger the glow for consistent visual behavior
      glowStatIcon(el);

      // Fallback: always show the final text if CountUp isn't available
      if (!hasCountUp) {
        el.textContent = stat.finalText;
        return;
      }

      // Animate only numeric-only targets; force exact final formatting after animation
      if (stat.useCountUp) {
        const counter = new countUp.CountUp(stat.id, stat.value, {
          ...options,
          separator: ",",
          decimalPlaces: 0
        });

        if (!counter.error) {
          counter.start(() => {
            el.textContent = stat.finalText; // force exact format (e.g., 1,355)
          });
        } else {
          el.textContent = stat.finalText;
        }
      } else {
        // String-based targets like "€550M+" and "110+"
        el.textContent = stat.finalText;
      }
    });
  } catch { /* ignore */ }

  /* -------------------
     Fade-up animation
  -------------------- */
  const REDUCE_MOTION = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const elements = document.querySelectorAll(".fade-up");

  const makeVisible = (el) => {
    const delay = el.getAttribute("data-anim-delay") || "0";
    el.style.transition = `opacity 0.9s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.9s cubic-bezier(0.25, 0.1, 0.25, 1)`;
    el.style.transitionDelay = `${delay}s`;
    el.classList.add("visible");
  };

  if (REDUCE_MOTION) {
    elements.forEach(el => el.classList.add("visible"));
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          makeVisible(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => makeVisible(el));
  }

  /* -------------------
     Hero text load + CTA pulses
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

    // Auto shimmer once after load
    setTimeout(() => {
      heroCTA.classList.add("shimmer");
      setTimeout(() => heroCTA.classList.remove("shimmer"), 1200);
    }, 1400);

    // Periodic CTA pulse
    setInterval(() => {
      heroCTA.classList.add("btn-pulse");
      setTimeout(() => heroCTA.classList.remove("btn-pulse"), 1500);
    }, 10000);
  }

  /* -------------------
     Hero crossfade slideshow with manual controls
  -------------------- */
  const hero = document.querySelector(".hero");
  const fader = document.querySelector(".hero .hero-fader");
  const prevBtn = document.querySelector(".hero .hero-nav.prev");
  const nextBtn = document.querySelector(".hero .hero-nav.next");

  if (hero && fader && prevBtn && nextBtn) {
    const slides = [
      "assets/hero-office.png",
      "assets/hero-meeting.png",
      "assets/hero-sofa.png"
    ];
    let current = 0;
    let timer = null;
    const INTERVAL = 8000;

    // initial slide onto the base layer (::before via CSS var)
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
      fader.addEventListener("transitionend", onEnd, { once: true });
      // Fallback if transitionend doesn’t fire
      setTimeout(onEnd, 1100);
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function start() {
      if (REDUCE_MOTION) return;
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
      if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); start(); }
    });
    hero.setAttribute("tabindex", "-1"); // allow focus if needed

    start();
  }

  /* -------------------
     Staggered testimonial reveal
  -------------------- */
  const testimonialCards = document.querySelectorAll(".testimonial");
  if (testimonialCards.length) {
    const testimonialObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          testimonialCards.forEach((card, index) => {
            setTimeout(() => card.classList.add("visible"), index * 300);
          });
          testimonialObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });

    testimonialObserver.observe(testimonialCards[0]);
  }

  /* -------------------
     Optional: auto-highlight current nav item
  -------------------- */
  (function highlightCurrentNav() {
    const currentPath = (location.pathname.replace(/\/$/, '') || '/index.html').toLowerCase();
    document.querySelectorAll('#main-nav a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const url = new URL(href, location.origin);
      const path = (url.pathname.replace(/\/$/, '') || '/index.html').toLowerCase();
      if (currentPath.endsWith(path)) {
        a.setAttribute('aria-current', 'page');
        a.classList.add('active');
      }
    });
  })();

});
