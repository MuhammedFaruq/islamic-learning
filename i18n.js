const switcher = document.getElementById("languageSwitcher");
let currentLang = localStorage.getItem("lang") || "en";

async function loadLanguage(lang) {
  try {
    const res = await fetch(`lang/${lang}.json`);
    const translations = await res.json();

    // Text content
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const keys = el.dataset.i18n.split(".");
      let text = translations;

      keys.forEach(k => {
        text = text?.[k];
      });

      if (text) el.textContent = text;
    });

    // Placeholders (THIS WAS MISSING)
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const keys = el.dataset.i18nPlaceholder.split(".");
      let text = translations;

      keys.forEach(k => {
        text = text?.[k];
      });

      if (text) el.placeholder = text;
    });

    // RTL support
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;

    localStorage.setItem("lang", lang);

  } catch (err) {
    console.error("Language error:", err);
  }
}

// VERY IMPORTANT: wait for DOM
document.addEventListener("DOMContentLoaded", () => {
  loadLanguage(currentLang);
  switcher.value = currentLang;
});

// Switch language
switcher.addEventListener("change", e => {
  loadLanguage(e.target.value);
});
