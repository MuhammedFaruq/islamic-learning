const grid = document.getElementById("surahGrid");
const audio = document.getElementById("audio");

let currentPlaying = null;

/* =========================
   FETCH SURAH LIST
========================= */
async function loadSurahs() {
  const res = await fetch("https://api.quran.com/api/v4/chapters");
  const data = await res.json();

  grid.innerHTML = "";

  data.chapters.forEach((s) => {
    const card = document.createElement("div");
    card.className = "surah-card";

    card.innerHTML = `
      <div class="surah-info" onclick="openSurah(${s.id})">
        <div class="surah-number">${s.id}</div>
        <div>
          <div class="surah-name">${s.name_simple}</div>
          <div class="meta">
            ${s.revelation_place === "makkah" ? "Makki" : "Madani"}
          </div>
        </div>
      </div>

      <div class="surah-right">
        <div class="arabic">${s.name_arabic}</div>
        <div class="count">${s.verses_count} Ayat</div>
        <button class="play-btn" onclick="playSurah(event, ${s.id})">▶</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* =========================
   PLAY SURAH (FIRST AYAH)
========================= */
async function playSurah(e, surahId) {
  e.stopPropagation();

  if (currentPlaying === surahId) {
    audio.pause();
    currentPlaying = null;
    return;
  }

  currentPlaying = surahId;

  const surah = surahId.toString().padStart(3, "0");
  audio.src =
    `https://verses.quran.com/AbdulBaset/Mujawwad/mp3/${surah}001.mp3`;

  try {
    await audio.play();
  } catch {
    alert("Use Live Server to enable audio.");
  }
}

/* =========================
   OPEN SURAH READER
========================= */
function openSurah(id) {
  window.location.href = `quran-read.html?surah=${id}`;
}

/* INIT */
loadSurahs();
