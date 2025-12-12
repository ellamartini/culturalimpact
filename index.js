const popupBtn = document.getElementById('popupBtn');
const popupBox = document.getElementById('popup');

popupBtn.addEventListener('click', () => {
    popup.style.visibility = 'visible';
    buttonClick();
})

// CLOSE POPUP ON BUTTON CLICK
function closeModal() {
    popup.style.visibility = 'hidden';
}



// BUTTON COUNTER

var i = 1128;
// document.getElementById('voteCount').innerHTML = localStorage.clickcount;

function buttonClick() {
    i++
    document.getElementById('voteCount').innerText = i;
    
}



// function buttonIncrease() {
//   if (localStorage.clickcount) {
//     localStorage.clickcount = Number(localStorage.clickcount)+1;
//   } else {
//     localStorage.clickcount = 1;
//   }
// document.getElementById("demo").innerHTML = localStorage.clickcount;
// }











// CONFETTI

(() => {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");

  // Handle high-DPI and resize
  const resize = () => {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const { innerWidth: w, innerHeight: h } = window;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  window.addEventListener("resize", resize, { passive: true });
  resize();

  // Particle system
  const TAU = Math.PI * 2;
  const COLORS = [
    "#ef4444",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#22d3ee"
  ];

  const particles = new Set();
  let rafId = null;

  class Confetti {
    constructor(x, y, options = {}) {
      const angle = options.angle ?? Math.random() * TAU;
      const speed = options.speed ?? 6 + Math.random() * 6;
      const spread = options.spread ?? TAU / 4;
      const a = angle + (Math.random() - 0.5) * spread;

      this.x = x;
      this.y = y;
      this.vx = Math.cos(a) * speed;
      this.vy = Math.sin(a) * speed - 6 * Math.random(); // initial upward kick
      this.w = 6 + Math.random() * 6;
      this.h = 10 + Math.random() * 10;
      this.color = COLORS[(Math.random() * COLORS.length) | 0];
      this.rotation = Math.random() * TAU;
      this.rotationSpeed = (Math.random() - 0.5) * 0.3;
      this.opacity = 1;
      this.drag = 0.998; // air resistance
      this.gravity = 0.15; // downward force
      this.life = 80 + Math.random() * 40; // frames
      this.spinFlip = Math.random() < 0.5 ? 1 : -1; // simulate flutter
    }
    step() {
      this.vx *= this.drag;
      this.vy = this.vy * this.drag + this.gravity;
      this.x += this.vx;
      this.y += this.vy;

      this.rotation += this.rotationSpeed;
      // Flutter by flipping height scale
      this.spinFlip *= 0.98;
      this.life -= 1;
      if (this.life < 20) this.opacity = Math.max(0, this.life / 20);
      return (
        this.opacity > 0 &&
        this.y < window.innerHeight + 50 &&
        this.x > -50 &&
        this.x < window.innerWidth + 50
      );
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.w / 2, (-this.h / 2) * this.spinFlip, this.w, this.h);
      ctx.restore();
    }
  }

  function spawnConfetti(x, y, count = 120) {
    for (let i = 0; i < count; i++) {
      particles.add(
        new Confetti(x, y, {
          angle: -Math.PI / 2, // mostly upwards
          spread: Math.PI, // 180° spread
          speed: 2 + Math.random() * 7
        })
      );
    }
    startLoop();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      if (!p.step()) particles.delete(p);
      else p.draw(ctx);
    }
    if (particles.size) {
      rafId = requestAnimationFrame(loop);
    } else {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function startLoop() {
    if (rafId == null) rafId = requestAnimationFrame(loop);
  }

  // Helper to get the center of the button in viewport coords
  function getButtonCenter(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  // Fire from button center on click
  popupBtn.addEventListener("click", () => {
    const { x, y } = getButtonCenter(popupBox);
    spawnConfetti(x, y, 150);
  });

})();
