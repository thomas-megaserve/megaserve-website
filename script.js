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
     NEW: Multi-slide hero background rotation
  -------------------- */
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    const heroImages = [
      "assets/hero-office.png",
      "assets/hero-building.jpg", // example second slide
      "assets/hero-city.jpg"      // example third slide
    ];
    let currentIndex = 0;
    setInterval(() => {
      currentIndex = (currentIndex + 1) % heroImages.length;
      heroSection.style.backgroundImage = `url('${heroImages[currentIndex]}')`;
    }, 8000);
  }

  /* -------------------
     Parallax effect for hero background
  -------------------- */
  if (heroSection) {
    window.addEventListener("scroll", () => {
      const offset = window.scrollY * 0.3;
      heroSection.style.backgroundPosition = `center calc(50% + ${offset}px)`;
    });
  }

  /* -------------------
     Gold shimmer & hover glow for all CTA buttons
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
