const chapterView = document.getElementById("chapterView");
const hadithView = document.getElementById("hadithView");
const hadithList = document.getElementById("hadithList");
const bookSelect = document.getElementById("bookSelect");
const backBtn = document.getElementById("backToChapters");

const API_KEY = "$2y$10$DxfyArYuFcqBP3jbDRKkJwc227ycNpXKRbTXqbKuxPOdLyO"; 

let currentBook = "sahih-bukhari";

/* =========================
   BOOK CHANGE
========================= */
bookSelect.addEventListener("change", () => {
  currentBook = bookSelect.value;
  showChapters();
});

/* =========================
   CHAPTER CLICK
========================= */
document.querySelectorAll(".chapter-item").forEach(item => {
  item.addEventListener("click", () => {
    const chapterNumber = item.dataset.chapter;
    loadHadiths(currentBook, chapterNumber);
  });
});

/* =========================
   LOAD HADITHS
========================= */
async function loadHadiths(book, chapter) {
  chapterView.style.display = "none";
  hadithView.style.display = "block";
  hadithList.innerHTML = "<p>Loading hadith…</p>";

  try {
    const res = await fetch(
      `https://hadithapi.com/api/hadiths?apiKey=${API_KEY}&book=${book}&chapter=${chapter}`
    );

    if (!res.ok) throw new Error("API failed");

    const data = await res.json();

    if (!data.hadiths || !data.hadiths.data.length) {
      hadithList.innerHTML = "<p>No hadith found.</p>";
      return;
    }

    renderHadiths(data.hadiths.data);

  } catch (err) {
    console.error(err);
    hadithList.innerHTML = "<p>Failed to load hadith.</p>";
  }
}

/* =========================
   RENDER HADITHS
========================= */
function renderHadiths(hadiths) {
  hadithList.innerHTML = "";

  hadiths.forEach(h => {
    const card = document.createElement("div");
    card.className = "hadith-card";

    card.innerHTML = `
      <div class="hadith-ar">${h.hadithArabic}</div>
      <div class="hadith-en">${h.hadithEnglish}</div>
      <div class="hadith-ref">
        ${h.book} • Hadith ${h.hadithNumber}
      </div>
    `;

    hadithList.appendChild(card);
  });
}

/* =========================
   BACK TO CHAPTERS
========================= */
backBtn.addEventListener("click", showChapters);

function showChapters() {
  hadithView.style.display = "none";
  chapterView.style.display = "block";
}
