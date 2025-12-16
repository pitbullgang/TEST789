document.addEventListener("DOMContentLoaded", async () => {
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

  // 🎵 Background Music
  const music = document.getElementById("bg-music");
  music.src = settings.backgroundMusic;
  music.volume = 0.4;
  let isPlaying = true;
  document.addEventListener("keydown", e => {
    if (e.code === "Space") {
      isPlaying ? music.pause() : music.play();
      isPlaying = !isPlaying;
    }
  });

  // 🌓 Dark / Light Toggle
  const toggle = document.getElementById("themeToggle");
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
  });

  // ⏳ Loading
  const loading = document.getElementById("loading-screen");
  setTimeout(() => loading.classList.add("hidden"), 1500);

  // 🟣 Circle Follow
  const circle = document.getElementById("circle");
  let mouseX = 0, mouseY = 0, circleX = 0, circleY = 0;
  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  function animateCircle() {
    circleX += (mouseX - circleX) * 0.1;
    circleY += (mouseY - circleY) * 0.1;
    circle.style.transform = `translate(${circleX - 125}px, ${circleY - 125}px)`;
    requestAnimationFrame(animateCircle);
  }
  animateCircle();

  // ✨ Particle Effect
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  const particles = [];
  function createParticle() {
    particles.push({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.8 + 0.3,
      opacity: Math.random() * 0.8 + 0.2
    });
  }
  function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      p.y -= p.speedY;
      p.opacity -= 0.005;
      if (p.opacity <= 0) particles.splice(i, 1);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
      ctx.fill();
    });
  }
  function loop() {
    if (Math.random() < 0.2) createParticle();
    updateParticles();
    requestAnimationFrame(loop);
  }
  loop();

  // Button Click
    document.getElementById("memberBtn").addEventListener("click", () => {
    window.location.href = "person.html";
    });
});
