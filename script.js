const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const heroName = document.querySelector("[data-name]");
const roleTarget = document.getElementById("typing-role");
const revealItems = document.querySelectorAll(".reveal");
const counterItems = document.querySelectorAll("[data-counter]");
const progressBar = document.querySelector(".scroll-progress span");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");
const tiltCards = document.querySelectorAll(".tilt-card");
const heroSection = document.querySelector(".hero");

let heroPointerFrame = 0;
let heroPointerX = 0;
let heroPointerY = 0;

const typeText = (target, text, speed = 80) => {
  let index = 0;
  const tick = () => {
    target.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) {
      window.setTimeout(tick, speed);
    }
  };
  tick();
};

const typeLoop = async (target, words) => {
  if (prefersReducedMotion) {
    target.textContent = words[0];
    return;
  }

  const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  while (true) {
    for (const word of words) {
      for (let i = 0; i <= word.length; i += 1) {
        target.textContent = word.slice(0, i);
        await sleep(60);
      }
      await sleep(900);
      for (let i = word.length; i >= 0; i -= 1) {
        target.textContent = word.slice(0, i);
        await sleep(24);
      }
    }
  }
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        if (entry.target.hasAttribute("data-counter")) {
          animateCounter(entry.target);
        }
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
);

const animateCounter = (element) => {
  const end = Number(element.getAttribute("data-counter")) || 0;
  if (element.dataset.counted === "true") return;
  element.dataset.counted = "true";

  if (prefersReducedMotion) {
    element.textContent = end;
    return;
  }

  const duration = 1200;
  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(end * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

const updateProgress = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
};

const filterProjects = (filter) => {
  projectCards.forEach((card) => {
    const categories = (card.dataset.category || "").split(" ");
    const visible = filter === "all" || categories.includes(filter);
    card.style.display = visible ? "" : "none";
    if (visible) {
      window.requestAnimationFrame(() => card.classList.add("is-visible"));
    }
  });
};

const syncNavState = () => {
  const open = header.classList.contains("nav-open");
  menuToggle.setAttribute("aria-expanded", String(open));
};

const createParticles = () => {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const state = {
    width: 0,
    height: 0,
    particles: [],
    pointer: { x: null, y: null },
  };
  const count = window.matchMedia("(max-width: 760px)").matches ? 18 : 34;

  const resize = () => {
    state.width = canvas.width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
    state.height = canvas.height = Math.floor(canvas.clientHeight * window.devicePixelRatio);
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  };

  const random = (min, max) => min + Math.random() * (max - min);

  const init = () => {
    state.particles = Array.from({ length: count }, () => ({
      x: random(0, canvas.clientWidth),
      y: random(0, canvas.clientHeight),
      vx: random(-0.25, 0.25),
      vy: random(-0.2, 0.2),
      radius: random(1.4, 2.8),
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    state.particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > canvas.clientWidth) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.clientHeight) particle.vy *= -1;

      const dx = state.pointer.x === null ? 0 : particle.x - state.pointer.x;
      const dy = state.pointer.y === null ? 0 : particle.y - state.pointer.y;
      const distanceToPointer = Math.hypot(dx, dy);

      if (state.pointer.x !== null && distanceToPointer < 120) {
        const repulse = (120 - distanceToPointer) / 120;
        particle.x += (dx / (distanceToPointer || 1)) * repulse * 1.4;
        particle.y += (dy / (distanceToPointer || 1)) * repulse * 1.4;
      }

      ctx.beginPath();
      ctx.fillStyle = "rgba(145, 178, 255, 0.82)";
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();

      for (let i = index + 1; i < state.particles.length; i += 1) {
        const other = state.particles[i];
        const lineDistance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (lineDistance < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(121, 167, 255, ${(1 - lineDistance / 150) * 0.23})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  };

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    state.pointer.x = event.clientX - rect.left;
    state.pointer.y = event.clientY - rect.top;
  });

  canvas.addEventListener("pointerleave", () => {
    state.pointer.x = null;
    state.pointer.y = null;
  });

  window.addEventListener("resize", () => {
    resize();
    init();
  });

  resize();
  init();
  draw();
};

const attachTilt = (card) => {
  const reset = () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  });

  card.addEventListener("pointerleave", reset);
  card.addEventListener("blur", reset);
};

const resetHeroParallax = () => {
  if (!heroSection) return;
  heroSection.style.setProperty("--hero-x", "0");
  heroSection.style.setProperty("--hero-y", "0");
};

const updateHeroParallax = () => {
  if (!heroSection) return;
  heroSection.style.setProperty("--hero-x", heroPointerX.toFixed(4));
  heroSection.style.setProperty("--hero-y", heroPointerY.toFixed(4));
  heroPointerFrame = 0;
};

const onHeroPointerMove = (event) => {
  if (!heroSection || prefersReducedMotion || window.matchMedia("(max-width: 760px)").matches) {
    return;
  }

  const rect = heroSection.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) - 0.5;
  const y = ((event.clientY - rect.top) / rect.height) - 0.5;
  heroPointerX = Math.max(-1, Math.min(1, x));
  heroPointerY = Math.max(-1, Math.min(1, y));

  if (!heroPointerFrame) {
    heroPointerFrame = window.requestAnimationFrame(updateHeroParallax);
  }
};

if (heroSection && !prefersReducedMotion) {
  heroSection.addEventListener("pointermove", onHeroPointerMove);
  heroSection.addEventListener("pointerleave", resetHeroParallax);
  heroSection.addEventListener("pointercancel", resetHeroParallax);
  window.addEventListener("resize", resetHeroParallax, { passive: true });
  resetHeroParallax();
}

if (heroSection) {
  window.requestAnimationFrame(() => {
    heroSection.classList.add("is-loaded");
  });
}

typeText(heroName, "Software Engineer | AI & SaaS Builder");
typeLoop(roleTarget, [
  "Building AI-driven applications",
  "Shipping scalable SaaS products",
  "Designing premium user experiences",
]);

revealItems.forEach((item) => revealObserver.observe(item));
counterItems.forEach((item) => revealObserver.observe(item));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    filterProjects(button.dataset.filter || "all");
  });
});

projectCards.forEach((card) => revealObserver.observe(card));

menuToggle.addEventListener("click", () => {
  header.classList.toggle("nav-open");
  syncNavState();
});

document.querySelectorAll(".primary-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("nav-open");
    syncNavState();
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !subject || !message) {
    formStatus.textContent = "Please fill in every field so I can respond properly.";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    formStatus.textContent = "Please enter a valid email address.";
    return;
  }

  const mailto = `mailto:hello@varshini.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Varshini,\r\n\r\n${message}\r\n\r\nFrom: ${name} (${email})`)}`;
  formStatus.textContent = "Opening your email app so the message can be sent.";
  window.location.href = mailto;
  contactForm.reset();
});

tiltCards.forEach(attachTilt);

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();
syncNavState();

if (!prefersReducedMotion) {
  createParticles();
} else {
  const canvas = document.getElementById("particle-canvas");
  if (canvas) {
    canvas.style.display = "none";
  }
}
