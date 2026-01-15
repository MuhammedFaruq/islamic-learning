const reader = document.getElementById("reader");
const audio = document.getElementById("audio");
const title = document.getElementById("surahTitle");

const params = new URLSearchParams(window.location.search);
const surah = params.get("surah");

const RECITER = "AbdulBaset/Mujawwad";

// STATE
let ayahList = [];
let currentIndex = -1;
let currentVerseKey = null;

if (!surah) {
  reader.innerHTML = "<p>No surah selected.</p>";
  throw new Error("Missing surah param");
}

/* =========================
   LOAD SURAH
========================= */
async function loadSurah() {
  try {
    // Surah info
    const surahRes = await fetch(
      `https://api.quran.com/api/v4/chapters/${surah}`
    );
    const surahData = await surahRes.json();

    title.innerHTML = `
      Read Surah ${surahData.chapter.name_simple}
      <span style="display:block;font-size:1.3rem;color:#666;">
        ${surahData.chapter.name_arabic}
      </span>
      <small>Arabic with English translation</small>
    `;

    // Verses
    const res = await fetch(
      `https://api.quran.com/api/v4/verses/by_chapter/${surah}?translations=131&language=en&fields=text_uthmani`
    );
    const data = await res.json();

    reader.innerHTML = "";
    ayahList = data.verses.map(v => v.verse_key);

    data.verses.forEach(v => {
      const translation = v.translations?.[0]?.text || "";

      const ayah = document.createElement("div");
      ayah.className = "ayah";
      ayah.id = `ayah-${v.verse_key}`;

      ayah.innerHTML = `
        <div class="ayah-left">
          <button class="ayah-play-desktop">▶</button>
          <span class="ayah-number">${v.verse_key}</span>
        </div>

        <div class="ayah-content">
          <div class="ayah-ar">${v.text_uthmani}</div>
          <div class="ayah-en">${translation}</div>
          <button class="ayah-play-mobile">▶ Play Ayah</button>
        </div>
      `;

      ayah.querySelector(".ayah-play-desktop").onclick = () =>
        togglePlay(v.verse_key);

      ayah.querySelector(".ayah-play-mobile").onclick = () =>
        togglePlay(v.verse_key);

      reader.appendChild(ayah);
    });

  } catch (err) {
    console.error(err);
    reader.innerHTML = "<p>Failed to load Quran.</p>";
  }
}

/* =========================
   TOGGLE PLAY / PAUSE
========================= */
async function togglePlay(verseKey) {
  // Same ayah clicked → toggle pause/play
  if (currentVerseKey === verseKey) {
    if (audio.paused) {
      await audio.play();
      updateButtons("pause");
    } else {
      audio.pause();
      updateButtons("play");
    }
    return;
  }

  // New ayah clicked
  currentVerseKey = verseKey;
  currentIndex = ayahList.indexOf(verseKey);

  document.querySelectorAll(".ayah").forEach(a => {
    a.classList.remove("playing");
  });

  const el = document.getElementById(`ayah-${verseKey}`);
  el.classList.add("playing");
  el.scrollIntoView({ behavior: "smooth", block: "center" });

  const [s, a] = verseKey.split(":");
  audio.src =
    `https://verses.quran.com/${RECITER}/mp3/${s.padStart(3,"0")}${a.padStart(3,"0")}.mp3`;

  await audio.play();
  updateButtons("pause");
}

/* =========================
   UPDATE BUTTON ICONS
========================= */
function updateButtons(state) {
  document.querySelectorAll(".ayah").forEach(a => {
    const btnDesktop = a.querySelector(".ayah-play-desktop");
    const btnMobile = a.querySelector(".ayah-play-mobile");

    if (a.classList.contains("playing")) {
      btnDesktop.textContent = state === "pause" ? "⏸" : "▶";
      btnMobile.textContent = state === "pause" ? "⏸ Pause Ayah" : "▶ Play Ayah";
    } else {
      btnDesktop.textContent = "▶";
      btnMobile.textContent = "▶ Play Ayah";
    }
  });
}

/* =========================
   AUTO PLAY NEXT AYAH
========================= */
audio.addEventListener("ended", () => {
  const nextIndex = currentIndex + 1;
  if (nextIndex < ayahList.length) {
    togglePlay(ayahList[nextIndex]);
  }
});

/* Pause state sync */
audio.addEventListener("pause", () => updateButtons("play"));
audio.addEventListener("play", () => updateButtons("pause"));

// INIT
loadSurah();

