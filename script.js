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
     Fade-up animation with delay support
  -------------------- */
  const elements = document.querySelectorAll(".fade-up");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute("data-anim-delay") || "0";
        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));

});
