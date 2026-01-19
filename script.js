
// ===============================
// QURAN FULL SURAH PLAYER
// ===============================

// DOM
const audio = document.getElementById("quranAudio");
const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const progress = document.querySelector(".progress");
const timeEl = document.getElementById("time");
const titleEl = document.getElementById("trackTitle");
const reciterSelect = document.getElementById("reciterSelect");

// CONFIG
const SURAH_NUMBER = "001"; // Al-Fatiha
const TOTAL_AYAHS = 7;

let currentAyah = 1;
let isPlaying = false;

// Build audio URL
function getAudioUrl(ayah) {
  const reciter = reciterSelect.value;
  const ayahNumber = `${SURAH_NUMBER}${ayah.toString().padStart(3, "0")}`;

  return `https://verses.quran.com/${reciter}/mp3/${ayahNumber}.mp3`;
}

// Load ayah
function loadAyah(ayah) {
  currentAyah = ayah;
  audio.src = getAudioUrl(ayah);
  titleEl.textContent = `Surah Al-Fatiha · Ayah ${ayah}`;
}

// Play / Pause
playBtn.addEventListener("click", async () => {
  try {
    if (!isPlaying) {
      await audio.play();
      playBtn.textContent = "❚❚";
      isPlaying = true;
    } else {
      audio.pause();
      playBtn.textContent = "▶";
      isPlaying = false;
    }
  } catch (err) {
    alert("Audio could not play.");
    console.error(err);
  }
});

// Next Ayah
nextBtn.addEventListener("click", () => {
  if (currentAyah < TOTAL_AYAHS) {
    loadAyah(currentAyah + 1);
    autoPlay();
  }
});

// Previous Ayah
prevBtn.addEventListener("click", () => {
  if (currentAyah > 1) {
    loadAyah(currentAyah - 1);
    autoPlay();
  }
});

// Auto play helper
async function autoPlay() {
  try {
    await audio.play();
    playBtn.textContent = "❚❚";
    isPlaying = true;
  } catch (e) {
    console.error(e);
  }
}

// When ayah ends → go next automatically
audio.addEventListener("ended", () => {
  if (currentAyah < TOTAL_AYAHS) {
    loadAyah(currentAyah + 1);
    autoPlay();
  } else {
    playBtn.textContent = "▶";
    isPlaying = false;
  }
});

// Progress bar
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + "%";

  const minutes = Math.floor(audio.currentTime / 60);
  const seconds = Math.floor(audio.currentTime % 60)
    .toString()
    .padStart(2, "0");

  timeEl.textContent = `${minutes}:${seconds}`;
});

// Reciter change
reciterSelect.addEventListener("change", () => {
  loadAyah(currentAyah);
  if (isPlaying) autoPlay();
});

// Init
loadAyah(1);



const prayerEl = document.getElementById("topPrayer");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchCity");


/* =========================
   HAMBURGER
========================= */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

/* =========================
   TOGGLE MENU
========================= */
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

/* =========================
   CLOSE MENU ON LINK CLICK
========================= */
document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

/* =========================
   CLOSE MENU WHEN CLICK OUTSIDE
========================= */
document.addEventListener("click", (e) => {
  if (
    !navLinks.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    navLinks.classList.remove("open");
  }
});


/* =========================
   PRAYER TIMES
========================= */
async function loadPrayerTimes(city = "Makkah") {
  prayerEl.textContent = "Loading prayer times…";

  try {
    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=2`
    );

    if (!res.ok) throw new Error("Failed");

    const data = await res.json();
    const t = data.data.timings;

    prayerEl.innerHTML = `
      Fajr ${t.Fajr} • 
      Dhuhr ${t.Dhuhr} • 
      Asr ${t.Asr} • 
      Maghrib ${t.Maghrib} • 
      Isha ${t.Isha}
    `;
  } catch (err) {
    prayerEl.textContent = "Unable to load prayer times";
  }
}

/* =========================
   CITY SEARCH
========================= */
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) loadPrayerTimes(city);
});

/* =========================
   AUTO LOAD (USER LOCATION)
========================= */
navigator.geolocation?.getCurrentPosition(
  pos => {
    fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`
    )
      .then(res => res.json())
      .then(loc => loadPrayerTimes(loc.city || "Makkah"))
      .catch(() => loadPrayerTimes());
  },
  () => loadPrayerTimes()
);



