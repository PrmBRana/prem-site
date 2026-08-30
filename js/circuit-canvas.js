/**
 * Minimalist, Professional Ambient Canvas Engine
 * Clean, subtle, and non-distracting: soft celestial drift and elegant orbital arc.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('circuit-bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;
  let stars = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    const count = Math.floor((width * height) / 18000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.6 + Math.random() * 1.2,
        alpha: 0.15 + Math.random() * 0.45,
        speed: 0.05 + Math.random() * 0.15
      });
    }
  }

  window.addEventListener('resize', resize);

  function render(time) {
    ctx.clearRect(0, 0, width, height);

    // Subtle starfield drift
    ctx.fillStyle = '#ffffff';
    stars.forEach((s) => {
      s.y -= s.speed;
      if (s.y < 0) s.y = height;

      ctx.globalAlpha = s.alpha * (0.8 + Math.sin(time * 0.001 + s.x) * 0.2);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Quiet, elegant orbital trajectory in upper-right corner
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(width * 0.85, height * 0.25, 340, 180, -Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();

    // Satellite beacon on orbit path
    const orbitT = (time * 0.00018) % (Math.PI * 2);
    const satX = width * 0.85 + Math.cos(orbitT) * 340 * Math.cos(-Math.PI / 6) - Math.sin(orbitT) * 180 * Math.sin(-Math.PI / 6);
    const satY = height * 0.25 + Math.cos(orbitT) * 340 * Math.sin(-Math.PI / 6) + Math.sin(orbitT) * 180 * Math.cos(-Math.PI / 6);

    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(satX, satY, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    animationFrameId = requestAnimationFrame(render);
  }

  resize();
  animationFrameId = requestAnimationFrame(render);
})();
