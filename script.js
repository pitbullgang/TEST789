document.addEventListener("DOMContentLoaded", async () => {
  // 🎨 1. Load Settings (Theme & Music)
  try {
    const response = await fetch("settings.json");
    const settings = await response.json();
    const theme = settings.theme;

    Object.entries({
      "--gradient-start": theme.gradientStart,
      "--gradient-end": theme.gradientEnd,
      "--circle-color": theme.circleColor,
      "--button-gradient-start": theme.buttonGradientStart,
      "--button-gradient-end": theme.buttonGradientEnd,
      "--button-text-color": theme.buttonTextColor,
      "--font": theme.fontFamily
    }).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));

    const music = document.getElementById("bg-music");
    if (music && settings.backgroundMusic) {
      music.src = settings.backgroundMusic;
      music.volume = 0.4;
      let isPlaying = true;
      document.addEventListener("keydown", e => {
        if (e.code === "Space") {
          isPlaying ? music.pause() : music.play();
          isPlaying = !isPlaying;
        }
      });
    }
  } catch (error) {
    console.log("Settings file not found or error, skipping theme load.");
  }

  // ⏳ 2. Loading Screen
  const loading = document.getElementById("loading-screen");
  if (loading) {
    setTimeout(() => loading.classList.add("hidden"), 1500);
  }

  // 💀 3. MINIMAL SKULL EFFECT
  const canvas = document.getElementById("particleCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const skulls = [];
    for (let i = 0; i < 20; i++) {
      skulls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedY: Math.random() * 0.5 + 0.3,
        speedX: Math.random() * 0.2 - 0.1
