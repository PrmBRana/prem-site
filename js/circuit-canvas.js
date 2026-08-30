/**
 * Electronic & Silicon Background Canvas Engine
 * Renders interactive ASIC silicon floorplan, FPGA logic matrix, and PCB signal traces.
 * Highly optimized with dynamic particle electron currents.
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
    purple: '#9d4edd',
    purpleAlpha: 'rgba(157, 78, 221, ',
    grid: 'rgba(255, 255, 255, 0.03)'
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

    // Silicon standard cells & macro blocks
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const padding = 28;
        const bx = c * cellW + padding;
        const by = r * cellH + padding;
        const bw = cellW - padding * 2;
        const bh = cellH - padding * 2;

        chipBlocks.push({
          x: bx,
          y: by,
          w: bw,
          h: bh,
          label: (r === 1 && c === 1) ? 'RV32I_CORE' :
                 (r === 0 && c === 1) ? 'IPCC_MAILBOX' :
                 (r === 1 && c === 0) ? 'SRAM_D2_DOMAIN' :
                 (r === 2 && c === 1) ? 'AX25_MODEM' :
                 (r === 0 && c === 0) ? 'SKY130_PLL' : 'STD_CELL_ROW_' + (r * cols + c),
          isCore: (r === 1 && c === 1)
        });
      }
    }

    // Interconnect metal traces (M1-M5 layers)
    for (let i = 0; i < chipBlocks.length; i++) {
      const b1 = chipBlocks[i];
      // Connect to neighbor
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
    for (let i = 0; i < 40; i++) {
      const trace = chipTraces[Math.floor(Math.random() * chipTraces.length)];
      if (trace) {
        chipElectrons.push({
          trace: trace,
          progress: Math.random(),
          speed: 0.004 + Math.random() * 0.008,
          size: 2.5 + Math.random() * 2,
          color: Math.random() > 0.5 ? COLORS.cyan : COLORS.emerald
        });
      }
    }
  }

  function renderChipScene(time) {
    ctx.clearRect(0, 0, width, height);

    // Draw Silicon Wafer Grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
    ctx.lineWidth = 1;
    const gridStep = 40;
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

    // Draw Macro Blocks
    chipBlocks.forEach((block) => {
      ctx.strokeStyle = block.isCore ? 'rgba(0, 240, 255, 0.4)' : 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = block.isCore ? 2 : 1;
      ctx.fillStyle = block.isCore ? 'rgba(0, 240, 255, 0.04)' : 'rgba(11, 18, 36, 0.4)';
      
      ctx.strokeRect(block.x, block.y, block.w, block.h);
      ctx.fillRect(block.x, block.y, block.w, block.h);

      // Block internal tracks
      ctx.strokeStyle = 'rgba(0, 255, 157, 0.06)';
      for (let ty = block.y + 12; ty < block.y + block.h - 10; ty += 12) {
        ctx.beginPath();
        ctx.moveTo(block.x + 8, ty);
        ctx.lineTo(block.x + block.w - 8, ty);
        ctx.stroke();
      }

      // Block labels
      ctx.font = '9px monospace';
      ctx.fillStyle = block.isCore ? COLORS.cyan : 'rgba(148, 163, 184, 0.4)';
      ctx.fillText(block.label, block.x + 8, block.y + 16);
    });

    // Draw Interconnect traces
    chipTraces.forEach((trace) => {
      ctx.strokeStyle = trace.color + '0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(trace.x1, trace.y1);
      ctx.lineTo(trace.x2, trace.y2);
      ctx.stroke();
    });

    // Draw Clock Tree Synthesis Pulse
    const pulseRad = (time * 0.08) % (Math.max(width, height) * 0.8);
    const centerX = width / 2;
    const centerY = height / 2;
    ctx.strokeStyle = 'rgba(0, 240, 255, ' + Math.max(0, 0.25 - pulseRad / 1200) + ')';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRad, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Electron Pulses
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
     MODE 2: FPGA LOGIC MATRIX & SWITCH MATRIX ROUTING
     ------------------------------------------------------------- */
  let fpgaCLBs = [];
  let fpgaSwitchMatrices = [];
  let fpgaRoutingLines = [];

  function initFpgaScene() {
    fpgaCLBs = [];
    fpgaSwitchMatrices = [];
    fpgaRoutingLines = [];

    const spacing = 90;
    const cols = Math.floor(width / spacing);
    const rows = Math.floor(height / spacing);

    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        const x = c * spacing;
        const y = r * spacing;

        // Alternating CLB and Switch Matrix
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
            y: y,
            activeWays: [Math.random() > 0.5, Math.random() > 0.5, Math.random() > 0.5, Math.random() > 0.5]
          });
        }
      }
    }

    // Connect routing channels
    for (let i = 0; i < fpgaCLBs.length; i++) {
      const clb = fpgaCLBs[i];
      const targetSM = fpgaSwitchMatrices[Math.floor(Math.random() * fpgaSwitchMatrices.length)];
      if (targetSM && Math.hypot(clb.x - targetSM.x, clb.y - targetSM.y) < spacing * 2.2) {
        fpgaRoutingLines.push({
          x1: clb.x,
          y1: clb.y,
          x2: targetSM.x,
          y2: targetSM.y,
          active: Math.random() > 0.3
        });
      }
    }
  }

  function renderFpgaScene(time) {
    ctx.clearRect(0, 0, width, height);

    // Draw Routing Channels
    fpgaRoutingLines.forEach((line) => {
      ctx.strokeStyle = line.active ? 'rgba(0, 255, 157, 0.25)' : 'rgba(148, 163, 184, 0.06)';
      ctx.lineWidth = line.active ? 1.5 : 1;
      ctx.beginPath();
      // 90-degree Manhattan routing
      const midX = (line.x1 + line.x2) / 2;
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(midX, line.y1);
      ctx.lineTo(midX, line.y2);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
    });

    // Draw Switch Matrices (SM)
    fpgaSwitchMatrices.forEach((sm) => {
      ctx.fillStyle = 'rgba(255, 183, 3, 0.15)';
      ctx.strokeStyle = 'rgba(255, 183, 3, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sm.x, sm.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Draw Configurable Logic Blocks (CLBs)
    fpgaCLBs.forEach((clb) => {
      const active = (Math.sin(time * 0.003 + clb.x * 0.01 + clb.y * 0.01) > 0);
      ctx.fillStyle = active ? 'rgba(0, 240, 255, 0.12)' : 'rgba(11, 18, 36, 0.8)';
      ctx.strokeStyle = active ? COLORS.cyan : 'rgba(0, 240, 255, 0.2)';
      ctx.lineWidth = 1;

      ctx.fillRect(clb.x - 14, clb.y - 14, 28, 28);
      ctx.strokeRect(clb.x - 14, clb.y - 14, 28, 28);

      // Internal FF symbol
      ctx.fillStyle = active ? COLORS.emerald : 'rgba(148, 163, 184, 0.4)';
      ctx.fillRect(clb.x - 4, clb.y - 4, 8, 8);
    });

    // Bitstream configuration line sweep
    const sweepY = (time * 0.05) % height;
    ctx.strokeStyle = 'rgba(0, 255, 157, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, sweepY);
    ctx.lineTo(width, sweepY);
    ctx.stroke();
  }

  /* -------------------------------------------------------------
     MODE 3: PCB SIGNAL ROUTING WITH ELECTRON DRIFT
     ------------------------------------------------------------- */
  let pcbNodes = [];
  let pcbTraces = [];

  function initPcbScene() {
    pcbNodes = [];
    pcbTraces = [];

    const count = Math.floor((width * height) / 32000);
    for (let i = 0; i < count; i++) {
      pcbNodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 2 + Math.random() * 2.5,
        padType: Math.random() > 0.7 ? 'via' : 'pad'
      });
    }
  }

  function renderPcbScene(time) {
    ctx.clearRect(0, 0, width, height);

    // Update node positions gently
    pcbNodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      // Mouse attraction
      if (mouse.active) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180 && dist > 10) {
          node.x += (dx / dist) * 0.8;
          node.y += (dy / dist) * 0.8;
        }
      }
    });

    // Draw interconnect traces between nearby nodes (PCB bus style)
    for (let i = 0; i < pcbNodes.length; i++) {
      for (let j = i + 1; j < pcbNodes.length; j++) {
        const p1 = pcbNodes[i];
        const p2 = pcbNodes[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

        if (dist < 140) {
          const alpha = 1 - dist / 140;
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.22})`;
          ctx.lineWidth = 1.2;

          ctx.beginPath();
          // Orthogonal trace with 45-degree bevel (PCB style)
          const midX = p1.x + (p2.x - p1.x) * 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(midX, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // Draw solder pads & Vias
    pcbNodes.forEach((node) => {
      ctx.fillStyle = node.padType === 'via' ? COLORS.amber : COLORS.cyan;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (node.padType === 'via') {
        ctx.fillStyle = '#060913';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  /* -------------------------------------------------------------
     MAIN ENGINE LOOP & CONTROLS
     ------------------------------------------------------------- */
  function initScene() {
    if (currentMode === 'chip') initChipScene();
    else if (currentMode === 'fpga') initFpgaScene();
    else if (currentMode === 'pcb') initPcbScene();
  }

  function loop(time) {
    if (!isPaused) {
      if (currentMode === 'chip') renderChipScene(time);
      else if (currentMode === 'fpga') renderFpgaScene(time);
      else if (currentMode === 'pcb') renderPcbScene(time);
    }
    animationFrameId = requestAnimationFrame(loop);
  }

  // Initialize
  resize();
  animationFrameId = requestAnimationFrame(loop);

  // Global control interface for buttons
  window.setCircuitMode = function (mode) {
    if (['chip', 'fpga', 'pcb'].includes(mode)) {
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
