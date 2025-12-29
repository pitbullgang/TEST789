document.addEventListener("DOMContentLoaded", async () => {
  // 🎨 1. Load Settings (Theme & Music)
  try {
    const response = await fetch("settings.json");
    const settings = await response.json();
    const theme = settings.theme;

    // ตั้งค่า CSS Variables จาก JSON
    Object.entries({
      "--gradient-start": theme.gradientStart,
      "--gradient-end": theme.gradientEnd,
      "--circle-color": theme.circleColor,
      "--button-gradient-start": theme.buttonGradientStart,
      "--button-gradient-end": theme.buttonGradientEnd,
      "--button-text-color": theme.buttonTextColor,
      "--font": theme.fontFamily
    }).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));

    // ระบบเพลงพื้นหลัง
    const music = document.getElementById("bg-music");
    if (music && settings.backgroundMusic) {
      music.src = settings.backgroundMusic;
      music.volume = 0.4;
      let isPlaying = true;
      document.addEventListener("keydown", e => {
        if (e.code === "Space") { // กด Spacebar เพื่อเล่น/หยุดเพลง
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

  // 💀 3. MINIMAL SKULL EFFECT (ฝนหัวกะโหลก)
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
    const skullCount = 20; // จำนวน 20 อันตามที่ต้องการ (ไม่รก)

    for (let i = 0; i < skullCount; i++) {
      skulls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 10 + 10, 
        speedY: Math.random() * 0.5 + 0.3, // ตกช้าๆ นุ่มนวล
        speedX: Math.random() * 0.2 - 0.1,
        opacity: Math.random() * 0.2 + 0.1, // จางๆ ลึกลับ
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

        // อัปเดตตำแหน่ง
        s.y += s.speedY;
        s.x += s.speedX;
        s.rotation += s.spin;

        // วนลูปเมื่อตกจอ
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

  // 🌓 5. Theme Toggle (ถ้ามี)
  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
    });
  }

  // 📑 6. MEMBER PAGINATION (เพิ่มส่วนนี้)
const memberGrid = document.querySelector('.member-list'); // ใส่ Class ของ Container ที่เก็บ Member
const itemsPerPage = 8; // กำหนดจำนวนคนต่อ 1 หน้า
let currentPage = 1;

async function initPagination() {
    // ดึงข้อมูลสมาชิก (สมมติว่าคุณเก็บข้อมูลไว้ใน JSON หรือดึงจาก DOM)
    const members = Array.from(document.querySelectorAll('.member-card')); // หรือ Class ของการ์ดสมาชิก
    if (members.length === 0) return;

    const totalPages = Math.ceil(members.length / itemsPerPage);

    function showPage(page) {
        currentPage = page;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        members.forEach((member, index) => {
            member.style.display = (index >= start && index < end) ? 'block' : 'none';
        });

        updatePaginationButtons(totalPages);
    }

    function updatePaginationButtons(total) {
        let paginationContainer = document.getElementById('pagination-controls');
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.id = 'pagination-controls';
            paginationContainer.className = 'pagination-container';
            // วางปุ่มไว้ล่างสุดของ Member List
            memberGrid.after(paginationContainer);
        }

        paginationContainer.innerHTML = '';
        for (let i = 1; i <= total; i++) {
            const btn = document.createElement('button');
            btn.innerText = i;
            btn.className = (i === currentPage) ? 'page-btn active' : 'page-btn';
            btn.addEventListener('click', () => {
                showPage(i);
                window.scrollTo({ top: memberGrid.offsetTop - 100, behavior: 'smooth' });
            });
            paginationContainer.appendChild(btn);
        }
    }

    showPage(1); // เริ่มต้นที่หน้า 1
}

// เรียกใช้งานฟังก์ชัน
if (window.location.pathname.includes("person.html")) {
    initPagination();
}
  
});

