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
        speedX: Math.random() * 0.2 - 0.1,
        opacity: Math.random() * 0.2 + 0.1,
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
        ctx.globalAlpha = s.opacity;
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
  }

  // 🔘 4. Member Button Click
  const memberBtn = document.getElementById("memberBtn");
  if (memberBtn) {
    memberBtn.addEventListener("click", () => {
      window.location.href = "person.html";
    });
  }

  // 📑 5. MEMBER PAGINATION (ระบบแบ่งหน้าสำเร็จรูป)
  if (window.location.pathname.includes("person.html")) {
    const memberGrid = document.querySelector('#memberlist'); // อ้างอิง ID ตาม CSS ของคุณ
    const itemsPerPage = 8; // จำนวนสมาชิกต่อ 1 หน้า (ปรับเปลี่ยนได้ตามใจชอบ)
    
    if (memberGrid) {
      // ดึงเฉพาะการ์ดที่อยู่ในส่วน Member เท่านั้น (ไม่รวม Leader/Founder)
      const members = Array.from(memberGrid.querySelectorAll('.card'));
      
      if (members.length > 0) {
        const totalPages = Math.ceil(members.length / itemsPerPage);
        let currentPage = 1;

        const showPage = (page) => {
          currentPage = page;
          const start = (page - 1) * itemsPerPage;
          const end = start + itemsPerPage;

          members.forEach((member, index) => {
            member.style.display = (index >= start && index < end) ? 'block' : 'none';
          });
          updateButtons();
        };

        const updateButtons = () => {
          let controls = document.getElementById('pagination-controls');
          if (!controls) {
            controls = document.createElement('div');
            controls.id = 'pagination-controls';
            controls.className = 'pagination-container';
            memberGrid.after(controls);
          }

          controls.innerHTML = '';
          for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.innerText = i;
            btn.className = (i === currentPage) ? 'page-btn active' : 'page-btn';
            btn.onclick = () => {
              showPage(i);
              // เลื่อนหน้าจอไปที่จุดเริ่มของรายชื่อสมาชิก
              const section = document.getElementById('memberSection');
              if (section) section.scrollIntoView({ behavior: 'smooth' });
            };
            controls.appendChild(btn);
          }
        };

        showPage(1); // เริ่มที่หน้าแรก
      }
    }
  }
});
