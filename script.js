document.addEventListener("DOMContentLoaded", async () => {
  // 🎨 Load Settings (จัดการเรื่องธีมและตัวแปรต่างๆ)
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

    // 🎵 Background Music
    const music = document.getElementById("bg-music");
    if (music) {
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
    console.log("Settings file not found, skipping theme load.");
  }

  // ⏳ Loading Screen
  const loading = document.getElementById("loading-screen");
  if (loading) setTimeout(() => loading.classList.add("hidden"), 1500);

  // 💀 SKULL EFFECT (เปลี่ยนจาก Particle เดิม)
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const skulls = [];
  const skullCount = 60; // จำนวนหัวกะโหลก

  // สร้างหัวกะโหลกเริ่มต้น
  for (let i = 0; i < skullCount; i++) {
    skulls.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 15 + 15, // ขนาด 15-30px
      speedY: Math.random() * 1.5 + 0.8, // ความเร็วการตก
      speedX: Math.random() * 0.6 - 0.3, // ส่ายซ้ายขวานิดๆ
      opacity: Math.random() * 0.5 + 0.2, // ความจาง
      rotation: Math.random() * Math.PI * 2, // มุมหมุนเริ่มต้น
      spin: Math.random() * 0.04 - 0.02 // ความเร็วในการหมุนตัว
    });
  }

  function drawSkulls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px serif"; // ขนาด Emoji
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    skulls.forEach(s => {
      ctx.save();
      ctx.globalAlpha = s.opacity;
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.fillText("💀", 0, 0);
      ctx.restore();

      // อัปเดตตำแหน่ง
      s.y += s.speedY;
      s.x += s.speedX;
      s.rotation += s.spin;

      // ตกเลยจอให้กลับไปเกิดใหม่ด้านบน
      if (s.y > canvas.height + 50) {
        s.y = -50;
        s.x = Math.random() * canvas.width;
        s.opacity = Math.random() * 0.5 + 0.2;
      }
      
      // วนขอบจอซ้ายขวา
      if (s.x > canvas.width + 20) s.x = -20;
      if (s.x < -20) s.x = canvas.width + 20;
    });

    requestAnimationFrame(drawSkulls);
  }
  drawSkulls();

  // 🔘 Button Click
  const memberBtn = document.getElementById("memberBtn");
  if (memberBtn) {
    memberBtn.addEventListener("click", () => {
      window.location.href = "person.html";
    });
  }
});
