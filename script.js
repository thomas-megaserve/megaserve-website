document.addEventListener("DOMContentLoaded", () => {

  /* -------------------
     Mobile menu toggle
  -------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");
  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("active");
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
     Parallax effect for hero background
  -------------------- */
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    window.addEventListener("scroll", () => {
      const offset = window.scrollY * 0.3;
      heroSection.style.backgroundPosition = `center calc(50% + ${offset}px)`;
    });
  }

  /* -------------------
     Gold shimmer on CTA buttons
  -------------------- */
  const ctaButtons = document.querySelectorAll(".btn-primary");
  ctaButtons.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      btn.style.boxShadow = "0 0 10px rgba(176, 141, 87, 0.6), 0 3px 6px rgba(0,0,0,0.2)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.boxShadow = "0 3px 6px rgba(0,0,0,0.2)";
    });
  });

});
