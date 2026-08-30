/**
 * Advanced Electronic, Silicon & Satellite Orbital Canvas Engine 2.0
 * Modes:
 * 1. CHIP: SkyWater 130nm ASIC Floorplan & Clock Tree Synthesis
 * 2. FPGA: Configurable Logic Block (CLB) Matrix & Bitstream Routing
 * 3. PCB: Multi-Layer Copper Signal Routing & Electron Drift
 * 4. ORBIT: Slippers2Sat LEO Orbit & Kathmandu Ground Station Telemetry Link
 */

(function () {
  'use strict';

  const canvas = document.getElementById('circuit-bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;
  let currentMode = 'chip'; // 'chip', 'fpga', 'pcb', 'orbit'
  let isPaused = false;

  // Track cursor position for subtle magnetic field effect
  const mouse = { x: -1000, y: -1000, active: false };

  // Palette constants
  const COLORS = {
    cyan: '#00f0ff',
    cyanAlpha: 'rgba(0, 240, 255, ',
    emerald: '#00ff9d',
    emeraldAlpha: 'rgba(0, 255, 157, ',
    amber: '#ffb703',
    amberAlpha: 'rgba(255, 183, 3, ',
    purple: '#a855f7',
    purpleAlpha: 'rgba(168, 85, 247, '
  };

  // Resize handling
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
     MODE 1: CHIP DESIGN / ASIC FLOORPLAN & CLOCK TREE SYNTHESIS
     ------------------------------------------------------------- */
  let chipBlocks = [];
  let chipTraces = [];
  let chipElectrons = [];

  function initChipScene() {
    chipBlocks = [];
    chipTraces = [];
    chipElectrons = [];

    const cols = Math.max(3, Math.floor(width / 260));
    const rows = Math.max(3, Math.floor(height / 200));
    const cellW = width / cols;
    const cellH = height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const padding = 28;
        const bx = c * cellW + padding;
        const by = r * cellH + padding;
        const bw = cellW - padding * 2;
        const bh = cellH - padding * 2;

        const isMainCore = (r === 1 && c === 1);
        const label = isMainCore ? 'RV32I_PIPELINE' :
                      (r === 0 && c === 1) ? 'IPCC_MAILBOX_RAM' :
                      (r === 1 && c === 0) ? 'QUAD_RM3100_IF' :
                      (r === 2 && c === 1) ? 'AX25_GMSK_MODEM' :
                      (r === 0 && c === 0) ? 'SKY130_PLL_480M' :
                      (r === 2 && c === 0) ? 'MT25QL_QSPI_CTRL' : `STD_CELL_${r}_${c}`;

        chipBlocks.push({
          x: bx,
          y: by,
          w: bw,
          h: bh,
          label: label,
          isCore: isMainCore
        });
      }
    }

    // Interconnect metal traces (M1-M5 layers)
    for (let i = 0; i < chipBlocks.length; i++) {
      const b1 = chipBlocks[i];
      if (i + 1 < chipBlocks.length && (i + 1) % cols !== 0) {
        const b2 = chipBlocks[i + 1];
        const traceY = b1.y + b1.h / 2;
        chipTraces.push({
          x1: b1.x + b1.w,
          y1: traceY,
          x2: b2.x,
          y2: traceY,
          color: COLORS.cyanAlpha
        });
      }
      if (i + cols < chipBlocks.length) {
        const b2 = chipBlocks[i + cols];
        const traceX = b1.x + b1.w / 2;
        chipTraces.push({
          x1: traceX,
          y1: b1.y + b1.h,
          x2: traceX,
          y2: b2.y,
          color: COLORS.emeraldAlpha
        });
      }
    }

    // Electron current pulses
    for (let i = 0; i < 48; i++) {
      const trace = chipTraces[Math.floor(Math.random() * chipTraces.length)];
      if (trace) {
        chipElectrons.push({
          trace: trace,
          progress: Math.random(),
          speed: 0.005 + Math.random() * 0.009,
          size: 2.2 + Math.random() * 2,
          color: Math.random() > 0.5 ? COLORS.cyan : COLORS.emerald
        });
      }
    }
  }

  function renderChipScene(time) {
    ctx.clearRect(0, 0, width, height);

    // Silicon Wafer Substrate Grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.035)';
    ctx.lineWidth = 1;
    const gridStep = 44;
    for (let x = 0; x < width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Macro Blocks
    chipBlocks.forEach((block) => {
      ctx.strokeStyle = block.isCore ? 'rgba(0, 240, 255, 0.5)' : 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = block.isCore ? 2 : 1;
      ctx.fillStyle = block.isCore ? 'rgba(0, 240, 255, 0.05)' : 'rgba(8, 14, 30, 0.45)';
      
      ctx.strokeRect(block.x, block.y, block.w, block.h);
      ctx.fillRect(block.x, block.y, block.w, block.h);

      // Internal standard cell rows
      ctx.strokeStyle = 'rgba(0, 255, 157, 0.07)';
      for (let ty = block.y + 12; ty < block.y + block.h - 10; ty += 12) {
        ctx.beginPath();
        ctx.moveTo(block.x + 8, ty);
        ctx.lineTo(block.x + block.w - 8, ty);
        ctx.stroke();
      }

      ctx.font = '9px monospace';
      ctx.fillStyle = block.isCore ? COLORS.cyan : 'rgba(148, 163, 184, 0.5)';
      ctx.fillText(block.label, block.x + 8, block.y + 16);
    });

    // Traces
    chipTraces.forEach((trace) => {
      ctx.strokeStyle = trace.color + '0.22)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(trace.x1, trace.y1);
      ctx.lineTo(trace.x2, trace.y2);
      ctx.stroke();
    });

    // Clock Tree Synthesis Pulse
    const pulseRad = (time * 0.08) % (Math.max(width, height) * 0.85);
    const centerX = width / 2;
    const centerY = height / 2;
    ctx.strokeStyle = 'rgba(0, 240, 255, ' + Math.max(0, 0.28 - pulseRad / 1200) + ')';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRad, 0, Math.PI * 2);
    ctx.stroke();

    // Electrons
    chipElectrons.forEach((el) => {
      el.progress += el.speed;
      if (el.progress > 1) el.progress = 0;

      const curX = el.trace.x1 + (el.trace.x2 - el.trace.x1) * el.progress;
      const curY = el.trace.y1 + (el.trace.y2 - el.trace.y1) * el.progress;

      ctx.fillStyle = el.color;
      ctx.shadowColor = el.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(curX, curY, el.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  /* -------------------------------------------------------------
     MODE 2: FPGA LOGIC MATRIX
     ------------------------------------------------------------- */
  let fpgaCLBs = [];
  let fpgaSwitchMatrices = [];
  let fpgaRoutingLines = [];

  function initFpgaScene() {
    fpgaCLBs = [];
    fpgaSwitchMatrices = [];
    fpgaRoutingLines = [];

    const spacing = 88;
    const cols = Math.floor(width / spacing);
    const rows = Math.floor(height / spacing);

    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        const x = c * spacing;
        const y = r * spacing;

        if ((r + c) % 2 === 0) {
          fpgaCLBs.push({
            x: x,
            y: y,
            lut: 'LUT4_' + (r * cols + c),
            state: Math.random() > 0.4
          });
        } else {
          fpgaSwitchMatrices.push({
            x: x,
            y: y
          });
        }
      }
    }

    for (let i = 0; i < fpgaCLBs.length; i++) {
      const clb = fpgaCLBs[i];
      const targetSM = fpgaSwitchMatrices[Math.floor(Math.random() * fpgaSwitchMatrices.length)];
      if (targetSM && Math.hypot(clb.x - targetSM.x, clb.y - targetSM.y) < spacing * 2.3) {
        fpgaRoutingLines.push({
          x1: clb.x,
          y1: clb.y,
          x2: targetSM.x,
          y2: targetSM.y,
          active: Math.random() > 0.25
        });
      }
    }
  }

  function renderFpgaScene(time) {
    ctx.clearRect(0, 0, width, height);

    fpgaRoutingLines.forEach((line) => {
      ctx.strokeStyle = line.active ? 'rgba(0, 255, 157, 0.28)' : 'rgba(148, 163, 184, 0.06)';
      ctx.lineWidth = line.active ? 1.5 : 1;
      ctx.beginPath();
      const midX = (line.x1 + line.x2) / 2;
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(midX, line.y1);
      ctx.lineTo(midX, line.y2);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
    });

    fpgaSwitchMatrices.forEach((sm) => {
      ctx.fillStyle = 'rgba(255, 183, 3, 0.18)';
      ctx.strokeStyle = 'rgba(255, 183, 3, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sm.x, sm.y, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    fpgaCLBs.forEach((clb) => {
      const active = (Math.sin(time * 0.003 + clb.x * 0.01 + clb.y * 0.01) > 0);
      ctx.fillStyle = active ? 'rgba(0, 240, 255, 0.14)' : 'rgba(8, 14, 30, 0.85)';
      ctx.strokeStyle = active ? COLORS.cyan : 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 1;

      ctx.fillRect(clb.x - 14, clb.y - 14, 28, 28);
      ctx.strokeRect(clb.x - 14, clb.y - 14, 28, 28);

      ctx.fillStyle = active ? COLORS.emerald : 'rgba(148, 163, 184, 0.4)';
      ctx.fillRect(clb.x - 4, clb.y - 4, 8, 8);
    });

    const sweepY = (time * 0.055) % height;
    ctx.strokeStyle = 'rgba(0, 255, 157, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, sweepY);
    ctx.lineTo(width, sweepY);
    ctx.stroke();
  }

  /* -------------------------------------------------------------
     MODE 3: PCB SIGNAL ROUTING & ELECTRON DRIFT
     ------------------------------------------------------------- */
  let pcbNodes = [];

  function initPcbScene() {
    pcbNodes = [];
    const count = Math.floor((width * height) / 28000);
    for (let i = 0; i < count; i++) {
      pcbNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: 2.2 + Math.random() * 2.5,
        padType: Math.random() > 0.7 ? 'via' : 'pad'
      });
    }
  }

  function renderPcbScene(time) {
    ctx.clearRect(0, 0, width, height);

    pcbNodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      if (mouse.active) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 190 && dist > 10) {
          node.x += (dx / dist) * 0.9;
          node.y += (dy / dist) * 0.9;
        }
      }
    });

    for (let i = 0; i < pcbNodes.length; i++) {
      for (let j = i + 1; j < pcbNodes.length; j++) {
        const p1 = pcbNodes[i];
        const p2 = pcbNodes[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

        if (dist < 150) {
          const alpha = 1 - dist / 150;
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.25})`;
          ctx.lineWidth = 1.3;

          ctx.beginPath();
          const midX = p1.x + (p2.x - p1.x) * 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(midX, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    pcbNodes.forEach((node) => {
      ctx.fillStyle = node.padType === 'via' ? COLORS.amber : COLORS.cyan;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (node.padType === 'via') {
        ctx.fillStyle = '#040711';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  /* -------------------------------------------------------------
     MODE 4: SLIPPERS2SAT LEO ORBIT & KATHMANDU GROUND STATION
     ------------------------------------------------------------- */
  let stars = [];
  function initOrbitScene() {
    stars = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        size: 0.8 + Math.random() * 1.5,
        alpha: 0.2 + Math.random() * 0.7
      });
    }
  }

  function renderOrbitScene(time) {
    ctx.clearRect(0, 0, width, height);

    // Starfield
    stars.forEach((s) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * (0.8 + Math.sin(time * 0.002 + s.x) * 0.2)})`;
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    // Earth Limb Curve at bottom
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

    // Atmospheric Glow
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(earthCenterX, earthCenterY, earthRadius, Math.PI + 0.5, Math.PI * 2 - 0.5);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Kathmandu Ground Station Antenna
    const ktmX = width * 0.45;
    const ktmY = height - 70;
    ctx.fillStyle = COLORS.amber;
    ctx.beginPath();
    ctx.arc(ktmX, ktmY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '10px monospace';
    ctx.fillStyle = COLORS.amber;
    ctx.fillText('APN_KATHMANDU_GS (27.7°N)', ktmX - 60, ktmY + 22);

    // Slippers2Sat CubeSat in Low Earth Orbit
    const orbitT = (time * 0.0004) % 1;
    const satX = width * 0.15 + orbitT * (width * 0.7);
    const satY = height * 0.28 + Math.sin(orbitT * Math.PI) * 40;

    // Draw CubeSat 1U Body (10x10cm)
    ctx.save();
    ctx.translate(satX, satY);
    ctx.rotate(Math.sin(time * 0.001) * 0.15);

    // Solar panels
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.fillRect(-28, -7, 18, 14); // Left wing
    ctx.fillRect(10, -7, 18, 14);  // Right wing
    ctx.strokeRect(-28, -7, 18, 14);
    ctx.strokeRect(10, -7, 18, 14);

    // 1U Chassis
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 1.5;
    ctx.fillRect(-10, -10, 20, 20);
    ctx.strokeRect(-10, -10, 20, 20);

    // Antenna whip
    ctx.strokeStyle = COLORS.emerald;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(0, 25);
    ctx.stroke();

    ctx.restore();

    // Satellite label & Telemetry RF Downlink Beam to Kathmandu
    ctx.font = '10px monospace';
    ctx.fillStyle = COLORS.cyan;
    ctx.fillText('SLIPPERS2SAT (1U CubeSat // 520km LEO)', satX - 90, satY - 20);

    // RF Telemetry Downlink Beam
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
  function initScene() {
    if (currentMode === 'chip') initChipScene();
    else if (currentMode === 'fpga') initFpgaScene();
    else if (currentMode === 'pcb') initPcbScene();
    else if (currentMode === 'orbit') initOrbitScene();
  }

  function loop(time) {
    if (!isPaused) {
      if (currentMode === 'chip') renderChipScene(time);
      else if (currentMode === 'fpga') renderFpgaScene(time);
      else if (currentMode === 'pcb') renderPcbScene(time);
      else if (currentMode === 'orbit') renderOrbitScene(time);
    }
    animationFrameId = requestAnimationFrame(loop);
  }

  resize();
  animationFrameId = requestAnimationFrame(loop);

  window.setCircuitMode = function (mode) {
    if (['chip', 'fpga', 'pcb', 'orbit'].includes(mode)) {
      currentMode = mode;
      initScene();
      const labelEl = document.getElementById('circuit-mode-name');
      if (labelEl) {
        labelEl.textContent = mode.toUpperCase() + ' MODE';
      }
    }
  };

  window.toggleCircuitPause = function () {
    isPaused = !isPaused;
    return isPaused;
  };
})();
