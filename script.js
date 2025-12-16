document.addEventListener("DOMContentLoaded", async () => {
  // 🎨 Load Settings
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
    console.log("Settings skip");
  }

  // ⏳ Loading Screen
  const loading = document.getElementById("loading-screen");
  if (loading) setTimeout(() => loading.classList.add("hidden"), 1500);

  // 💀 MINIMAL SKULL EFFECT (ปรับให้ดูคลีนขึ้น)
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const skulls = [];
  const skullCount = 20; // ลดจำนวนลงเหลือแค่ 20 อัน (จากเดิม 60)

  for (let i = 0; i < skullCount; i++) {
    skulls.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 10 + 10, // ขนาดเล็กลงหน่อย
      speedY: Math.random() * 0.5 + 0.3, // ตกช้าๆ นุ่มๆ
      speedX: Math.random() * 0.2 - 0.1,
      opacity: Math.random() * 0.2 + 0.1, // ปรับให้จางลงมาก (เห็นแค่ลางๆ)
      rotation: Math.random() * Math.PI * 2,
      spin: Math.random() * 0.02 - 0.01
    });
  }

  function drawSkulls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "18px serif"; 
    ctx.textAlign = "center";

    skulls.forEach(s => {
      ctx.save();
      ctx.globalAlpha = s.opacity; // ความจางแบบ Minimal
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.fillText("💀", 0, 0);
      ctx.restore();

      s.y += s.speedY;
      s.x += s.speedX;
      s.rotation += s.spin;

      if (s.y > canvas.height + 50) {
        s.y = -50;
        s.x = Math.random() * canvas.width;
      }
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
