(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch =
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 980px)").matches;

  const journeyCopy = [
    {
      kicker: "Negocio",
      heading: "Empezamos por cómo operas.",
      text: "Antes del software, está tu forma de trabajar. La escuchamos con atención.",
    },
    {
      kicker: "Necesidades",
      heading: "Lo que duele, lo que falta, lo que importa.",
      text: "Nombramos el problema real. No el que cabe en un formulario genérico.",
    },
    {
      kicker: "Diseño",
      heading: "La interfaz nace de tu operación.",
      text: "Cada pantalla tiene un motivo. Nada decorativo. Nada prestado.",
    },
    {
      kicker: "Desarrollo",
      heading: "Lo construimos contigo, no para un promedio.",
      text: "Iteramos sobre tu ritmo. El código sigue a la operación, no al revés.",
    },
    {
      kicker: "Software",
      heading: "Deja de ser un proyecto. Empieza a ser tuyo.",
      text: "Una herramienta que ya habla el idioma de tu equipo.",
    },
    {
      kicker: "Resultados",
      heading: "Lo ves. Lo usas. Encaja.",
      text: "Interfaces que ya existen porque alguien las necesitaba de verdad.",
    },
  ];

  const splitWords = (el) => {
    if (!el || el.dataset.splitDone) return;
    const text = el.textContent.trim();
    el.innerHTML = text
      .split(/\s+/)
      .map((word) => `<span class="word-wrap"><span class="word">${word}</span></span>`)
      .join(" ");
    el.dataset.splitDone = "true";
  };

  document.querySelectorAll("[data-split]").forEach(splitWords);

  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const mobile = document.querySelector("[data-nav-mobile]");
  const lightZones = ["#diseno", "#software", "#resultados"];

  const closeMobile = () => {
    toggle?.classList.remove("is-open");
    mobile?.classList.remove("is-open");
  };

  toggle?.addEventListener("click", () => {
    toggle.classList.toggle("is-open");
    mobile?.classList.toggle("is-open");
  });

  mobile?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobile);
  });

  const updateNav = () => {
    const y = window.scrollY;
    nav?.classList.toggle("is-scrolled", y > 12);

    const mid = 80;
    const light = lightZones.some((sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top <= mid && r.bottom > mid;
    });
    nav?.classList.toggle("is-light", light);
    document.body.classList.toggle("is-light-nav", light);
  };

  const cursor = document.querySelector(".cursor");
  const ring = document.querySelector(".cursor-ring");
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;

  const moveCursor = (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (cursor) {
      cursor.style.transform = `translate3d(${mx - 5}px, ${my - 5}px, 0)`;
    }
  };

  const tickCursor = () => {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    if (ring) {
      ring.style.translate = `${rx - mx}px ${ry - my}px`;
    }
    requestAnimationFrame(tickCursor);
  };

  if (cursor && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce) {
    document.addEventListener("mousemove", moveCursor);
    tickCursor();

    document.querySelectorAll("a, button, input, textarea, .media, .phone, .tablet").forEach((el) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("is-hover"));
    });
  }

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".media, .phone, .tablet").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    });
  }

  const form = document.querySelector("[data-form]");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const need = String(data.get("message") || "").trim();
    const message = `Hola *MeWare* soy ${name}, me gustaría contar con sus servicios: *${need}*, mi correo es ${email}`;
    window.open(
      `https://wa.me/529984079026?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  });

  const journeyPairs = [
    [journeyCopy[0], journeyCopy[1]],
    [journeyCopy[2], journeyCopy[3]],
    [journeyCopy[4], journeyCopy[5]],
  ];

  const fillJourneyCard = (card, step) => {
    const kicker = card.querySelector(".journey-kicker");
    const heading = card.querySelector(".journey-heading");
    const text = card.querySelector(".journey-text");
    if (kicker) kicker.textContent = step.kicker;
    if (heading) {
      heading.textContent = step.heading;
      delete heading.dataset.splitDone;
    }
    if (text) text.textContent = step.text;
  };

  const paintJourneyTrack = (pairIndex) => {
    const lastStep = pairIndex * 2 + 1;
    const items = document.querySelectorAll("[data-journey-track] li");
    const line = document.querySelector("[data-journey-line]");
    items.forEach((li, i) => li.classList.toggle("is-active", i <= lastStep));
    if (line && !line.dataset.scrub) {
      line.style.transform = `scaleX(${(pairIndex + 1) / journeyPairs.length})`;
    }
  };

  const revealJourneyPair = (pair) => {
    const cards = document.querySelectorAll("[data-journey-slot]");
    cards.forEach((card, i) => {
      const step = pair[i];
      if (!step) return;
      fillJourneyCard(card, step);
      const heading = card.querySelector(".journey-heading");
      if (heading) splitWords(heading);
      const words = card.querySelectorAll(".word");
      gsap.set(card, { opacity: 1, y: 0 });
      gsap.fromTo(
        card.querySelector(".journey-kicker"),
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, delay: i * 0.06, ease: "power2.out" }
      );
      gsap.fromTo(
        words,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.04,
          delay: i * 0.06,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        card.querySelector(".journey-text"),
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, delay: 0.1 + i * 0.06, ease: "power2.out" }
      );
    });
  };

  const setJourney = (pairIndex) => {
    const pair = journeyPairs[pairIndex];
    if (!pair) return;
    paintJourneyTrack(pairIndex);

    const cards = document.querySelectorAll("[data-journey-slot]");
    if (reduce || isTouch || typeof gsap === "undefined") {
      cards.forEach((card, i) => {
        if (pair[i]) fillJourneyCard(card, pair[i]);
      });
      return;
    }

    cards.forEach((card) => {
      gsap.killTweensOf(card.querySelectorAll(".journey-kicker, .journey-heading, .journey-text, .word"));
    });
    revealJourneyPair(pair);
  };

  document.querySelectorAll("[data-journey-track] button").forEach((btn, i) => {
    btn.addEventListener("click", () => setJourney(Math.floor(i / 2)));
  });

  const boot = () => {
    document.body.classList.add("is-ready");
    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });

    if (reduce || typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    let lenis = null;
    if (typeof Lenis !== "undefined" && !isTouch) {
      lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1,
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        closeMobile();
        if (lenis) lenis.scrollTo(target, { offset: 0 });
        else target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    gsap.from(".hero .word", {
      yPercent: 110,
      opacity: 0,
      duration: 1.15,
      stagger: 0.055,
      ease: "power3.out",
      delay: 0.15,
    });

    gsap.from(".hero .eyebrow", {
      y: 16,
      opacity: 0,
      duration: 0.9,
      ease: "power2.out",
    });

    if (!isTouch) {
      gsap.to(".hero-inner", {
        y: -70,
        opacity: 0,
        scale: 0.97,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-glow", {
        y: 120,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    const storyWords = document.querySelectorAll("[data-chapter] .word, .results-intro .word");
    if (isTouch) {
      gsap.set(storyWords, { yPercent: 0, opacity: 1 });
      document.querySelectorAll("[data-chapter] h2, .results-intro h2").forEach((heading) => {
        gsap.from(heading, {
          y: 18,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 88%",
            once: true,
          },
        });
      });
    } else {
      gsap.set(storyWords, { yPercent: 110, opacity: 0 });
      storyWords.forEach((word) => {
        gsap.to(word, {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: word.closest("h2"),
            start: "top 82%",
            once: true,
          },
        });
      });
    }

    const ctaWords = document.querySelectorAll(".cta .word");
    gsap.set(ctaWords, { yPercent: 110, opacity: 0 });
    gsap.to(ctaWords, {
      yPercent: 0,
      opacity: 1,
      duration: 0.95,
      stagger: 0.05,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".cta-copy",
        start: "top 82%",
        once: true,
      },
    });

    document.querySelectorAll(".reveal-fade").forEach((el) => {
      gsap.set(el, { y: 24, opacity: 0 });
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 86%",
          once: true,
        },
      });
    });

    if (!isTouch) {
      document.querySelectorAll(".chapter-dark").forEach((section) => {
        section.querySelectorAll(".orb").forEach((orb, i) => {
          const rise = [160, 260, 120, 300, 200][i] || 180;
          gsap.fromTo(
            orb,
            { y: 80 },
            {
              y: -rise,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            }
          );
        });
      });

      gsap.fromTo(
        ".meware-portrait",
        { y: 50 },
        {
          y: -120,
          ease: "none",
          scrollTrigger: {
            trigger: ".meware",
            start: "top 90%",
            end: "bottom top",
            scrub: 0.85,
          },
        }
      );
    }

    const journey = document.querySelector("[data-journey]");
    const journeyLine = document.querySelector("[data-journey-line]");
    if (journeyLine) journeyLine.dataset.scrub = "true";
    if (journey) {
      let last = -1;
      ScrollTrigger.create({
        trigger: journey,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const progress = Math.min(1, Math.max(0, self.progress));
          if (journeyLine) {
            journeyLine.style.transform = `scaleX(${Math.max(0.08, progress)})`;
          }
          const index = Math.min(
            journeyPairs.length - 1,
            Math.floor(progress * 0.999 * journeyPairs.length)
          );
          if (index !== last) {
            last = index;
            setJourney(index);
          }
        },
      });
    }

    const progressBar = document.querySelector(".scroll-progress");
    if (progressBar && !CSS.supports("animation-timeline", "scroll()")) {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          progressBar.style.transform = `scaleX(${self.progress})`;
        },
      });
    }

    if (!isTouch) {
      document.querySelectorAll("[data-feature]").forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            once: true,
          },
        });
      });
    }

    if (!isTouch) {
      const driftMap = {
        left: { x: 64, y: 0 },
        right: { x: -64, y: 0 },
        up: { x: 0, y: 56 },
      };

      document.querySelectorAll("[data-drift]").forEach((el) => {
        const from = driftMap[el.dataset.drift] || driftMap.up;
        gsap.fromTo(
          el,
          { x: from.x, y: from.y },
          {
            x: 0,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "top 38%",
              scrub: 0.9,
            },
          }
        );
      });
    }

    const navLinks = [...document.querySelectorAll(".nav-links a")];
    const sections = [
      ["#negocio", 0],
      ["#necesidades", 1],
      ["#diseno", 2],
      ["#desarrollo", 3],
      ["#software", 4],
      ["#resultados", 5],
    ];

    sections.forEach(([sel, i]) => {
      const el = document.querySelector(sel);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => {
          if (!self.isActive) return;
          navLinks.forEach((link, idx) => link.classList.toggle("is-active", idx === i));
        },
      });
    });
  };

  let booted = false;
  const start = () => {
    if (booted) return;
    booted = true;
    boot();
  };

  if (document.fonts?.ready) {
    Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, 1200)),
    ]).then(start);
  } else {
    window.addEventListener("load", start);
  }
})();
