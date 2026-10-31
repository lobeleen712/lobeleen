/* Personalise the values below when contact links are ready. */
const portfolioConfig = {
  email: "",       // Example: "name@example.com"
  linkedin: "",    // Full URL, e.g. "https://www.linkedin.com/in/your-profile/"
  github: ""       // Full URL, e.g. "https://github.com/your-username"
};

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      menuButton.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
      nav.classList.toggle("open", !expanded);
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
      });
    });
  }

  // Reveal elements only when motion is allowed; content remains visible without JS.
  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  const emailValue = document.getElementById("email-value");
  const emailRow = document.querySelector('[data-copy="email"]');
  if (portfolioConfig.email && emailValue) {
    emailValue.textContent = portfolioConfig.email;
    emailValue.closest(".contact-row").querySelector("small").textContent = "EMAIL";
    if (emailRow) {
      emailRow.disabled = false;
      emailRow.setAttribute("aria-label", "Copy email address");
      emailRow.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(portfolioConfig.email);
          emailRow.textContent = "✓";
          emailRow.setAttribute("aria-label", "Email copied");
        } catch {
          window.location.href = `mailto:${portfolioConfig.email}`;
        }
      });
    }
    emailValue.closest(".contact-row").querySelector(".pending").textContent = "EMAIL AVAILABLE";
  }

  const profileLinks = [
    { selector: '[data-placeholder-link][aria-label="LinkedIn link pending"]', url: portfolioConfig.linkedin, label: "LinkedIn profile" },
    { selector: '[data-placeholder-link][aria-label="GitHub link pending"]', url: portfolioConfig.github, label: "GitHub profile" }
  ];
  profileLinks.forEach(item => {
    const link = document.querySelector(item.selector);
    if (!link || !item.url) return;
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `Open ${item.label}`);
    link.closest(".contact-row").querySelector(".pending").textContent = "PROFILE ADDED";
    link.closest(".contact-row").querySelector("strong").textContent = item.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  });
});