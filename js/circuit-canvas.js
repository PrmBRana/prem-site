/**
 * Advanced Semiconductor Fabrication & RF Electromagnetic Wave Canvas Engine 3.0
 * Features:
 * 1. Silicon Wafer & Photolithography Laser Stepper (Chip Manufacturing)
 * 2. Multi-layer VLSI Interconnects (M1-M5, vias, standard cells, clock distribution)
 * 3. Electromagnetic RF Wavefronts (Concentric radiating waves, continuous phase carriers)
 * 4. Microstrip RF Transmission Lines with traveling modulated signals
 * 5. Interactive Magnetic/Electromagnetic Induction cursor deflection
 */

(function () {
  'use strict';

  const canvas = document.getElementById('circuit-bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;
  let isPaused = false;
  let currentMode = 'fab_rf'; // 'fab_rf', 'litho', 'rf_waves', 'orbit'

  // Cursor tracking
  const mouse = { x: -1000, y: -1000, active: false };

  const COLORS = {
    cyan: '#00f0ff',
    cyanGlow: 'rgba(0, 240, 255, ',
    emerald: '#00ff9d',
    emeraldGlow: 'rgba(0, 255, 157, ',
    amber: '#ffb703',
    amberGlow: 'rgba(255, 183, 3, ',
    purple: '#c084fc',
    purpleGlow: 'rgba(192, 132, 252, ',
    laser: '#ff007f',
    laserGlow: 'rgba(255, 0, 127, '
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initScene();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  /* -------------------------------------------------------------
     FABRICATION & RF SILICON DIE STATE
     ------------------------------------------------------------- */
  let dies = [];
  let rfMicrostrips = [];
  let rfEmitters = [];
  let lithoLaser = { x: 0, y: 0, targetX: 0, targetY: 0, angle: 0, speed: 1.5 };
  let electronPulses = [];
  let starfield = [];

  function initScene() {
    dies = [];
    rfMicrostrips = [];
    rfEmitters = [];
    electronPulses = [];
    starfield = [];

    // Wafer Grid Reticles (Silicon Stepper Dies)
    const dieW = Math.max(140, Math.floor(width / 7));
    const dieH = Math.max(120, Math.floor(height / 6));
    const cols = Math.ceil(width / dieW) + 1;
    const rows = Math.ceil(height / dieH) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * dieW;
        const y = r * dieH;
        const isRFFab = (r % 2 === 1 && c % 2 === 1);
        const isCore = (r === 2 && c === 2);

        dies.push({
          x: x,
          y: y,
          w: dieW,
          h: dieH,
          id: `DIE_${r}_${c}`,
          label: isCore ? 'SKY130_RV32I_CORE' :
                 isRFFab ? 'RF_TRANSCEIVER_MODEM' :
                 (r === 1 && c === 2) ? 'IPCC_SRAM3_MAILBOX' :
                 (r === 2 && c === 1) ? 'QUAD_PNI_RM3100_IF' :
                 (r === 3 && c === 2) ? 'MT25QL_QSPI_FLASH' : `STD_CELL_BLK_${r}${c}`,
          isCore: isCore,
          isRFFab: isRFFab,
          gateCount: Math.floor(1200 + Math.random() * 4000)
        });
      }
    }

    // High-Frequency RF Microstrip Transmission Lines
    for (let i = 0; i < 8; i++) {
      const startX = (i % 2 === 0) ? 0 : width;
      const startY = (height / 9) * (i + 1);
      const endX = width * 0.5 + (Math.random() - 0.5) * 300;
      const endY = startY + (Math.random() - 0.5) * 80;

      rfMicrostrips.push({
        x1: startX,
        y1: startY,
        x2: endX,
        y2: endY,
        freq: 0.04 + (i * 0.012),
        phase: Math.random() * Math.PI * 2,
        carrierMod: (i % 2 === 0) ? 'GMSK' : 'GFSK'
      });
    }

    // On-Chip RF Antenna Radiation Centers
    rfEmitters.push({ x: width * 0.28, y: height * 0.38, label: 'TX_ANTENNA_437MHz', maxRadius: 280, freq: 0.08 });
    rfEmitters.push({ x: width * 0.72, y: height * 0.62, label: 'RX_LNA_FRONTEND', maxRadius: 240, freq: 0.06 });

    // Photolithography Scanner
    lithoLaser.x = 0;
    lithoLaser.y = 0;

    // Electron current pulses
    for (let i = 0; i < 55; i++) {
      const d = dies[Math.floor(Math.random() * dies.length)];
      electronPulses.push({
        x: d.x + Math.random() * d.w,
        y: d.y + Math.random() * d.h,
        targetX: d.x + Math.random() * d.w,
        targetY: d.y + Math.random() * d.h,
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.014,
        color: (Math.random() > 0.5) ? COLORS.cyan : COLORS.emerald
      });
    }

    // Starfield for Orbit Mode
    for (let i = 0; i < 110; i++) {
      starfield.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.75,
        size: 0.8 + Math.random() * 1.6,
        alpha: 0.2 + Math.random() * 0.75
      });
    }
  }

  /* -------------------------------------------------------------
     RENDER: SEMICONDUCTOR FABRICATION & CHIP DESIGN
     ------------------------------------------------------------- */
  function drawSemiconductorFab(time) {
    // 1. Silicon Wafer Substrate Grid & Stepper Scribe Lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.06)';
    ctx.lineWidth = 1;

    dies.forEach((die) => {
      // Scribe street borders between dies
      ctx.strokeRect(die.x + 2, die.y + 2, die.w - 4, die.h - 4);

      // Silicon cell interior glow
      if (die.isCore) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.04)';
        ctx.fillRect(die.x + 4, die.y + 4, die.w - 8, die.h - 8);
      } else if (die.isRFFab) {
        ctx.fillStyle = 'rgba(0, 255, 157, 0.03)';
        ctx.fillRect(die.x + 4, die.y + 4, die.w - 8, die.h - 8);
      }

      // Metal layer standard cell rows (M1/M2)
      ctx.strokeStyle = die.isCore ? 'rgba(0, 240, 255, 0.12)' : 'rgba(148, 163, 184, 0.05)';
      const rowSpacing = 10;
      for (let ry = die.y + 16; ry < die.y + die.h - 10; ry += rowSpacing) {
        ctx.beginPath();
        ctx.moveTo(die.x + 8, ry);
        ctx.lineTo(die.x + die.w - 8, ry);
        ctx.stroke();
      }

      // Die Label
      ctx.font = '8.5px monospace';
      ctx.fillStyle = die.isCore ? COLORS.cyan : die.isRFFab ? COLORS.emerald : 'rgba(148, 163, 184, 0.45)';
      ctx.fillText(die.label, die.x + 8, die.y + 14);
    });

    // 2. Clock Tree Synthesis (CTS) Global Distribution Pulse
    const ctsRadius = (time * 0.1) % (Math.max(width, height) * 0.9);
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, 0.3 - ctsRadius / 1400)})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(centerX, centerY, ctsRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Secondary harmonic clock pulse
    ctx.strokeStyle = `rgba(0, 255, 157, ${Math.max(0, 0.22 - ctsRadius / 1800)})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, ctsRadius * 0.65, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Photolithography Laser Stepper Beam (EUV Semiconductor Manufacturing)
    const scanPeriod = 8000; // 8 seconds per sweep
    const scanPhase = (time % scanPeriod) / scanPeriod;
    const laserX = scanPhase * (width + 200) - 100;
    const laserY = (Math.sin(time * 0.001) * 0.5 + 0.5) * height;

    // Glowing Laser Line
    const laserGrad = ctx.createLinearGradient(laserX, 0, laserX, height);
    laserGrad.addColorStop(0, 'rgba(255, 0, 127, 0)');
    laserGrad.addColorStop(0.5, 'rgba(255, 0, 127, 0.45)');
    laserGrad.addColorStop(1, 'rgba(255, 0, 127, 0)');

    ctx.strokeStyle = laserGrad;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(laserX, 0);
    ctx.lineTo(laserX, height);
    ctx.stroke();

    // Laser focus reticle dot
    ctx.fillStyle = COLORS.laser;
    ctx.shadowColor = COLORS.laser;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(laserX, laserY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Laser exposure status text
    ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(255, 0, 127, 0.8)';
    ctx.fillText(`EUV_LITHOGRAPHY_STEPPER // SCAN: ${(scanPhase * 100).toFixed(1)}%`, laserX + 10, laserY - 10);

    // 4. Electron Current Drifts
    electronPulses.forEach((p) => {
      p.progress += p.speed;
      if (p.progress > 1) {
        p.progress = 0;
        const d = dies[Math.floor(Math.random() * dies.length)];
        p.x = d.x + Math.random() * d.w;
        p.y = d.y + Math.random() * d.h;
      }

      const curX = p.x + (p.targetX - p.x) * p.progress;
      const curY = p.y + (p.targetY - p.y) * p.progress;

      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(curX, curY, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  /* -------------------------------------------------------------
     RENDER: RF ELECTROMAGNETIC SIGNALS & TRAVELING WAVES
     ------------------------------------------------------------- */
  function drawRfSignals(time) {
    // 1. Concentric Electromagnetic Waves from Antenna Centers
    rfEmitters.forEach((emitter) => {
      const waveCount = 5;
      for (let i = 0; i < waveCount; i++) {
        const waveProgress = ((time * 0.05 + (i * emitter.maxRadius / waveCount)) % emitter.maxRadius);
        const alpha = Math.max(0, 0.35 * (1 - waveProgress / emitter.maxRadius));

        ctx.strokeStyle = `rgba(0, 255, 157, ${alpha})`;
        ctx.lineWidth = 1.8;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(emitter.x, emitter.y, waveProgress, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Antenna pad symbol
      ctx.fillStyle = COLORS.amber;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(emitter.x, emitter.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = '9px monospace';
      ctx.fillStyle = COLORS.emerald;
      ctx.fillText(emitter.label, emitter.x - 45, emitter.y - 12);
    });

    // 2. Modulated RF Carrier Waves on Microstrip Transmission Lines
    rfMicrostrips.forEach((strip, sIdx) => {
      ctx.strokeStyle = (sIdx % 2 === 0) ? 'rgba(0, 240, 255, 0.45)' : 'rgba(0, 255, 157, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      const dx = strip.x2 - strip.x1;
      const dy = strip.y2 - strip.y1;
      const dist = Math.hypot(dx, dy);
      const steps = Math.floor(dist / 4);

      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const baseX = strip.x1 + dx * t;
        const baseY = strip.y1 + dy * t;

        // Modulated RF sinusoidal wave perpendicular to trace
        const normalX = -dy / dist;
        const normalY = dx / dist;

        // Gaussian continuous phase frequency modulation
        const waveFreq = strip.freq + Math.sin(t * 10 + time * 0.002) * 0.015;
        const waveOffset = Math.sin(s * waveFreq - time * 0.005 + strip.phase) * 9;

        const posX = baseX + normalX * waveOffset;
        const posY = baseY + normalY * waveOffset;

        if (s === 0) ctx.moveTo(posX, posY);
        else ctx.lineTo(posX, posY);
      }
      ctx.stroke();

      // RF Wave packet packet header label
      ctx.font = '8px monospace';
      ctx.fillStyle = (sIdx % 2 === 0) ? COLORS.cyan : COLORS.emerald;
      ctx.fillText(`RF_${strip.carrierMod}_437M`, strip.x1 + dx * 0.3, strip.y1 + dy * 0.3 - 10);
    });

    // 3. Interactive Mouse Electromagnetic Induction
    if (mouse.active) {
      const pulseTime = time * 0.004;
      const indRadius = 55 + Math.sin(pulseTime) * 12;

      // Magnetic field flux rings
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, indRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(0, 255, 157, 0.25)';
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, indRadius * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = '9px monospace';
      ctx.fillStyle = COLORS.cyan;
      ctx.fillText('EM_INDUCTION_PROBE', mouse.x + 14, mouse.y - 12);
    }
  }

  /* -------------------------------------------------------------
     RENDER: ORBIT MODE (SATELLITE TELEMETRY)
     ------------------------------------------------------------- */
  function drawOrbit(time) {
    starfield.forEach((s) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * (0.8 + Math.sin(time * 0.002 + s.x) * 0.2)})`;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    const earthCenterX = width / 2;
    const earthCenterY = height + 420;
    const earthRadius = height * 0.85 + 400;

    const earthGrad = ctx.createRadialGradient(earthCenterX, earthCenterY - earthRadius + 120, 10, earthCenterX, earthCenterY, earthRadius);
    earthGrad.addColorStop(0, 'rgba(0, 240, 255, 0.16)');
    earthGrad.addColorStop(0.2, 'rgba(0, 150, 255, 0.08)');
    earthGrad.addColorStop(0.5, 'rgba(4, 7, 17, 0.95)');
    earthGrad.addColorStop(1, '#040711');

    ctx.fillStyle = earthGrad;
    ctx.beginPath();
    ctx.arc(earthCenterX, earthCenterY, earthRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(earthCenterX, earthCenterY, earthRadius, Math.PI + 0.5, Math.PI * 2 - 0.5);
    ctx.stroke();
    ctx.shadowBlur = 0;

    const ktmX = width * 0.45;
    const ktmY = height - 70;
    ctx.fillStyle = COLORS.amber;
    ctx.beginPath();
    ctx.arc(ktmX, ktmY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '10px monospace';
    ctx.fillStyle = COLORS.amber;
    ctx.fillText('APN_KATHMANDU_GS (27.7°N)', ktmX - 60, ktmY + 22);

    const orbitT = (time * 0.0004) % 1;
    const satX = width * 0.15 + orbitT * (width * 0.7);
    const satY = height * 0.28 + Math.sin(orbitT * Math.PI) * 40;

    ctx.save();
    ctx.translate(satX, satY);
    ctx.rotate(Math.sin(time * 0.001) * 0.15);

    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.fillRect(-28, -7, 18, 14);
    ctx.fillRect(10, -7, 18, 14);
    ctx.strokeRect(-28, -7, 18, 14);
    ctx.strokeRect(10, -7, 18, 14);

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 1.5;
    ctx.fillRect(-10, -10, 20, 20);
    ctx.strokeRect(-10, -10, 20, 20);

    ctx.strokeStyle = COLORS.emerald;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(0, 25);
    ctx.stroke();

    ctx.restore();

    ctx.font = '10px monospace';
    ctx.fillStyle = COLORS.cyan;
    ctx.fillText('SLIPPERS2SAT (1U CubeSat // 520km LEO)', satX - 90, satY - 20);

    const beamPulse = (time * 0.08) % 100;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([6, 6]);
    ctx.lineDashOffset = -beamPulse;
    ctx.beginPath();
    ctx.moveTo(satX, satY + 15);
    ctx.lineTo(ktmX, ktmY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /* -------------------------------------------------------------
     MAIN ENGINE LOOP & CONTROLS
     ------------------------------------------------------------- */
  function loop(time) {
    if (!isPaused) {
      ctx.clearRect(0, 0, width, height);

      if (currentMode === 'fab_rf') {
        // Combined Semiconductor Manufacturing + RF Wave Propagation
        drawSemiconductorFab(time);
        drawRfSignals(time);
      } else if (currentMode === 'litho') {
        drawSemiconductorFab(time);
      } else if (currentMode === 'rf_waves') {
        drawRfSignals(time);
      } else if (currentMode === 'orbit') {
        drawOrbit(time);
      }
    }
    animationFrameId = requestAnimationFrame(loop);
  }

  resize();
  animationFrameId = requestAnimationFrame(loop);

  window.setCircuitMode = function (mode) {
    if (['fab_rf', 'litho', 'rf_waves', 'orbit'].includes(mode)) {
      currentMode = mode;
      const labelEl = document.getElementById('circuit-mode-name');
      if (labelEl) {
        labelEl.textContent = (mode === 'fab_rf') ? 'FAB & RF WAFER' :
                             (mode === 'litho') ? 'LITHO SCAN' :
                             (mode === 'rf_waves') ? 'RF PROPAGATION' : 'ORBIT LEO';
      }
    }
  };

  window.toggleCircuitPause = function () {
    isPaused = !isPaused;
    return isPaused;
  };
})();
