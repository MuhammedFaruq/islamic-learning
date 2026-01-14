async function loadPrayerTimes() {
  const city = "Kano";        // change later
  const country = "Nigeria";         // change later
  const method = 2;             // Islamic Society of North America

  const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const timings = data.data.timings;

    const prayerGrid = document.getElementById("prayerGrid");

    prayerGrid.innerHTML = `
      ${createPrayerBox("FAJR", timings.Fajr)}
      ${createPrayerBox("ZUHR", timings.Dhuhr)}
      ${createPrayerBox("ASR", timings.Asr)}
      ${createPrayerBox("MAGHRIB", timings.Maghrib)}
      ${createPrayerBox("ISHA", timings.Isha)}
      ${createJummahBox()}
    `;
  } catch (error) {
    document.getElementById("prayerGrid").innerHTML =
      "<p>Unable to load prayer times.</p>";
    console.error(error);
  }
}

function createPrayerBox(name, time) {
  return `
    <div class="prayer-box">
      <h3>${name}</h3>
      <p>Begins: <strong>${time}</strong></p>
    </div>
  `;
}

function createJummahBox() {
  return `
    <div class="prayer-box jummah">
      <h3>JUMMAH</h3>
      <p>Start: <strong>1:30 PM</strong></p>
    </div>
  `;
}

loadPrayerTimes();


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
