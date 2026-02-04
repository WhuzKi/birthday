document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('surpriseBtn');
  const audio = document.getElementById('bgMusic');
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext && canvas.getContext('2d');

  // Resize canvas to viewport
  function resize() {
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // One-time reveal
  btn.addEventListener('click', async function onClick(e) {
    // prevent double clicks
    if (btn.disabled) return;
    btn.disabled = true;

    // reveal visually
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');

    // try to play audio (user gesture present)
    try {
      audio.currentTime = 0;
      await audio.play();
    } catch (err) {
      // play blocked — fallback to muted play attempt
      try { audio.muted = true; await audio.play(); } catch (_) { /* ignore */ }
    }

    // start confetti for 3s
    startConfetti(3000);
  });

  // Simple confetti
  function startConfetti(duration) {
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const colors = ['#ff4d7a','#ffb3c6','#ffd166','#ff9f1c','#f72585','#ff6b9a'];
    const pieces = [];
    const COUNT = Math.min(200, Math.floor((W * H) / 8000));

    for (let i = 0; i < COUNT; i++) {
      pieces.push({
        x: Math.random() * W,
        y: Math.random() * -H * 0.5,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 6,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let start = performance.now();
    let raf;

    function step(now) {
      const t = now - start;
      ctx.clearRect(0, 0, W, H);

      for (let p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // gravity
        p.rot += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }

      if (t < duration) raf = requestAnimationFrame(step);
      else { ctx.clearRect(0,0,W,H); cancelAnimationFrame(raf); }
    }

    raf = requestAnimationFrame(step);
  }
});
