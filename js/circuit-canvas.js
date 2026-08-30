/**
 * Advanced Orbital Avionics & Silicon Semiconductor Telemetry Engine 5.0
 * 
 * Upgrades:
 * 1. Big 3D Rotating Earth: Substantially larger globe with rich atmosphere,
 *    continents (South Asia, Himalayas, Africa, Americas), and Kathmandu ground beacon.
 * 2. Larger Satellite: Detailed 1U CubeSat model with multi-cell solar wings,
 *    gold busbars, optic aperture, and dipole antennas. No satellite text name label.
 * 3. Dedicated Left-Side Animated Silicon Chip:
 *    - Prominent ASIC Die layout on the left side with wire-bond pads.
 *    - RV32I Core with register flashes, IPCC Mailbox SRAM, and Quad-Mag DSP filter.
 *    - Active RF Power Amplifier (PA) block with glowing planar inductor coils.
 *    - Clock distribution pulses and electron packets along M1-M5 metal tracks.
 *    - High-frequency microstrip RF trace transmitting signals from the chip across to the satellite & Earth!
 * 4. Travelling RF signals: Electromagnetic wavefronts and data packets flowing smoothly.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('circuit-bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;
  let isPaused = false;

  // Track cursor for electromagnetic induction
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
    goldPad: '#f59e0b'
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

  /* =============================================================
     1. CONTINUOUSLY ROTATING 3D EARTH MODEL (BIGGER)
     ============================================================= */
  let earth = {
    x: 0,
    y: 0,
    radius: 280, // Noticeably larger globe
    rotation: 0,
    rotSpeed: 0.003, // Smooth continuous rotation
    tilt: 0.26 // Axial tilt
  };

  // Continent polygons in spherical coordinates [lat (deg), lon (deg)]
  const CONTINENTS = [
    // Eurasia & South Asia (including Indian subcontinent & Himalayas/Nepal)
    [
      { lat: 70, lon: 30 }, { lat: 72, lon: 90 }, { lat: 65, lon: 140 }, { lat: 50, lon: 140 },
      { lat: 35, lon: 120 }, { lat: 22, lon: 114 }, { lat: 10, lon: 105 }, { lat: 5, lon: 80 },
      { lat: 20, lon: 70 }, { lat: 28, lon: 84 }, /* Nepal / Himalayas */ { lat: 28, lon: 60 },
      { lat: 30, lon: 35 }, { lat: 42, lon: 28 }, { lat: 55, lon: 10 }, { lat: 65, lon: 15 }
    ],
    // Africa
    [
      { lat: 35, lon: -5 }, { lat: 32, lon: 32 }, { lat: 12, lon: 51 }, { lat: -5, lon: 40 },
      { lat: -34, lon: 20 }, { lat: -20, lon: 12 }, { lat: 5, lon: 9 }, { lat: 15, lon: -17 },
      { lat: 30, lon: -10 }
    ],
    // Americas
    [
      { lat: 70, lon: -130 }, { lat: 60, lon: -80 }, { lat: 45, lon: -60 }, { lat: 25, lon: -80 },
      { lat: 10, lon: -75 }, { lat: -10, lon: -38 }, { lat: -45, lon: -65 }, { lat: -55, lon: -70 },
      { lat: -15, lon: -75 }, { lat: 15, lon: -90 }, { lat: 35, lon: -120 }, { lat: 55, lon: -135 }
    ],
    // Australia
    [
      { lat: -15, lon: 130 }, { lat: -12, lon: 142 }, { lat: -25, lon: 152 }, { lat: -38, lon: 145 },
      { lat: -32, lon: 116 }, { lat: -20, lon: 118 }
    ]
  ];

  // Kathmandu Ground Station coordinates (27.7°N, 85.3°E)
  const KTM_LAT = 27.7 * (Math.PI / 180);
  const KTM_LON = 85.3 * (Math.PI / 180);

  /* =============================================================
     2. 3D ORBITING SATELLITE (BIGGER, NO NAME LABEL)
     ============================================================= */
  let satellite = {
    orbitAngle: 0,
    orbitSpeed: 0.007,
    orbitRadiusX: 380,
    orbitRadiusY: 150,
    orbitInclination: 0.42,
    x: 0,
    y: 0,
    z: 0,
    isOccluded: false
  };

  /* =============================================================
     3. DEDICATED LEFT-SIDE ANIMATED SILICON CHIP (ASIC DIE)
     ============================================================= */
  let leftChip = {
    x: 35,
    y: 90,
    w: 360,
    h: 460,
    blocks: [],
    pads: [],
    electrons: [],
    ctsWave: 0
  };

  let starfield = [];
  let travellingSignals = [];

  function initScene() {
    const isMobile = width < 768;

    // 1. Earth Size & Position (significantly bigger)
    earth.radius = isMobile ? Math.min(width * 0.42, 190) : Math.min(width * 0.25, 290);
    earth.x = isMobile ? width * 0.5 : width * 0.72;
    earth.y = isMobile ? height * 0.68 : height * 0.52;

    satellite.orbitRadiusX = earth.radius * 1.72;
    satellite.orbitRadiusY = earth.radius * 0.78;

    // 2. Left-Side Silicon Chip Configuration
    const chipWidth = isMobile ? Math.min(width * 0.88, 320) : Math.min(width * 0.32, 400);
    const chipHeight = isMobile ? 320 : Math.min(height * 0.78, 540);
    leftChip.x = isMobile ? (width - chipWidth) / 2 : Math.max(30, width * 0.04);
    leftChip.y = isMobile ? 80 : (height - chipHeight) / 2;
    leftChip.w = chipWidth;
    leftChip.h = chipHeight;

    // Internal ASIC Blocks on Left Chip
    const padMargin = 28;
    const innerW = chipWidth - padMargin * 2;
    const innerH = chipHeight - padMargin * 2;
    const startX = leftChip.x + padMargin;
    const startY = leftChip.y + padMargin;

    leftChip.blocks = [
      {
        x: startX,
        y: startY,
        w: innerW * 0.58,
        h: innerH * 0.46,
        label: 'RV32I_5STAGE_CPU',
        sub: '32-BIT PIPELINED CORE',
        type: 'core',
        color: COLORS.cyan
      },
      {
        x: startX + innerW * 0.62,
        y: startY,
        w: innerW * 0.38,
        h: innerH * 0.46,
        label: 'IPCC_SRAM',
        sub: 'MAILBOX FIFO',
        type: 'ram',
        color: COLORS.amber
      },
      {
        x: startX,
        y: startY + innerH * 0.52,
        w: innerW * 0.46,
        h: innerH * 0.48,
        label: 'QUAD_MAG_DSP',
        sub: 'UBSS FILTER & DMA',
        type: 'dsp',
        color: COLORS.purple
      },
      {
        x: startX + innerW * 0.5,
        y: startY + innerH * 0.52,
        w: innerW * 0.5,
        h: innerH * 0.48,
        label: 'RF_PA_MODEM_437M',
        sub: 'GMSK/GFSK TRANSMITTER',
        type: 'rf_tx',
        color: COLORS.emerald
      }
    ];

    // Wire-bond Pads around chip perimeter
    leftChip.pads = [];
    const padCountSide = 6;
    for (let i = 0; i < padCountSide; i++) {
      // Top pads
      leftChip.pads.push({ x: leftChip.x + 30 + (i * (leftChip.w - 60) / (padCountSide - 1)), y: leftChip.y + 8, label: `P_T${i}` });
      // Bottom pads
      leftChip.pads.push({ x: leftChip.x + 30 + (i * (leftChip.w - 60) / (padCountSide - 1)), y: leftChip.y + leftChip.h - 8, label: `P_B${i}` });
    }
    for (let i = 1; i < 5; i++) {
      // Left pads
      leftChip.pads.push({ x: leftChip.x + 8, y: leftChip.y + (i * leftChip.h / 5), label: `P_L${i}` });
      // Right pads (RF output pads)
      leftChip.pads.push({ x: leftChip.x + leftChip.w - 8, y: leftChip.y + (i * leftChip.h / 5), label: `P_RF${i}`, isRfOut: true });
    }

    // Electron current pulses inside left chip
    leftChip.electrons = [];
    for (let i = 0; i < 28; i++) {
      leftChip.electrons.push({
        x: startX + Math.random() * innerW,
        y: startY + Math.random() * innerH,
        speed: 0.8 + Math.random() * 1.5,
        direction: Math.random() > 0.5 ? 1 : -1,
        color: Math.random() > 0.5 ? COLORS.cyan : COLORS.emerald
      });
    }

    // Starfield
    starfield = [];
    for (let i = 0; i < 110; i++) {
      starfield.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.8 + Math.random() * 1.8,
        alpha: 0.15 + Math.random() * 0.75,
        twinkleSpeed: 0.002 + Math.random() * 0.004
      });
    }

    // Travelling signal packets
    travellingSignals = [];
    for (let i = 0; i < 8; i++) {
      travellingSignals.push({
        progress: (i / 8),
        speed: 0.006,
        type: (i % 3 === 0) ? 'AX.25 UI_FRAME' : (i % 3 === 1) ? 'EPDM_QUAD_MAG' : 'GMSK_9600'
      });
    }
  }

  /* =============================================================
     RENDER LAYER 1: DEDICATED LEFT-SIDE ANIMATED SILICON CHIP
     ============================================================= */
  function drawLeftSiliconChip(time) {
    const c = leftChip;

    // 1. Silicon Package Frame & Substrate
    ctx.fillStyle = 'rgba(6, 11, 24, 0.82)';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(c.x, c.y, c.w, c.h);
    ctx.fillRect(c.x, c.y, c.w, c.h);

    // Package Corner Cutout / Pin 1 Chamfer
    ctx.fillStyle = COLORS.amber;
    ctx.beginPath();
    ctx.arc(c.x + 14, c.y + 14, 4, 0, Math.PI * 2);
    ctx.fill();

    // Chip Package Header Label
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = COLORS.cyan;
    ctx.fillText('SKY130 // PRM-ASIC-RV32I // ON-BOARD TRANSMITTER', c.x + 26, c.y + 17);

    // 2. Wire-bond Pads (Gold Contacts)
    c.pads.forEach((pad) => {
      ctx.fillStyle = pad.isRfOut ? COLORS.emerald : COLORS.goldPad;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.fillRect(pad.x - 5, pad.y - 5, 10, 10);
      ctx.strokeRect(pad.x - 5, pad.y - 5, 10, 10);
    });

    // 3. Internal Functional Blocks (RV32I Core, SRAM Mailbox, DSP, RF Transmitter)
    c.blocks.forEach((blk) => {
      ctx.fillStyle = 'rgba(10, 18, 38, 0.75)';
      ctx.strokeStyle = blk.color + '0.45)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(blk.x, blk.y, blk.w, blk.h);
      ctx.fillRect(blk.x, blk.y, blk.w, blk.h);

      // Block header
      ctx.font = 'bold 9.5px monospace';
      ctx.fillStyle = blk.color;
      ctx.fillText(blk.label, blk.x + 8, blk.y + 16);

      ctx.font = '7.5px monospace';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.65)';
      ctx.fillText(blk.sub, blk.x + 8, blk.y + 28);

      // Block-specific dynamic animations
      if (blk.type === 'core') {
        // CPU logic standard cell rows flashing
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.lineWidth = 1;
        for (let ly = blk.y + 36; ly < blk.y + blk.h - 8; ly += 9) {
          ctx.beginPath();
          ctx.moveTo(blk.x + 8, ly);
          ctx.lineTo(blk.x + blk.w - 8, ly);
          ctx.stroke();

          // Blinking register states
          const step = Math.floor((time * 0.005 + ly) % 6);
          ctx.fillStyle = (step === 0) ? COLORS.cyan : 'rgba(0, 240, 255, 0.25)';
          ctx.fillRect(blk.x + 12 + step * 14, ly - 3, 7, 5);
        }
      } else if (blk.type === 'ram') {
        // Memory cell matrix array
        const cols = 5;
        const cellW = (blk.w - 20) / cols;
        for (let cx = 0; cx < cols; cx++) {
          for (let cy = 0; cy < 6; cy++) {
            const isRead = ((time * 0.008 + cx * 2 + cy) % 8 < 1);
            ctx.fillStyle = isRead ? COLORS.amber : 'rgba(255, 183, 3, 0.1)';
            ctx.fillRect(blk.x + 10 + cx * cellW, blk.y + 36 + cy * 12, cellW - 4, 7);
          }
        }
      } else if (blk.type === 'dsp') {
        // DSP waveform spectrum
        ctx.strokeStyle = COLORS.purple;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let dx = 0; dx < blk.w - 16; dx += 4) {
          const dy = Math.sin(dx * 0.15 + time * 0.008) * 12;
          const px = blk.x + 8 + dx;
          const py = blk.y + blk.h * 0.65 + dy;
          if (dx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      } else if (blk.type === 'rf_tx') {
        // RF Power Amplifier (PA) stage with concentric inductor coil pulses
        const paCenterX = blk.x + blk.w * 0.55;
        const paCenterY = blk.y + blk.h * 0.58;

        // Planar spiral inductor coil
        ctx.strokeStyle = COLORS.emerald;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 6; a += 0.2) {
          const r = 4 + a * 2.2;
          const px = paCenterX + Math.cos(a + time * 0.005) * r;
          const py = paCenterY + Math.sin(a + time * 0.005) * r;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Pulsing transmitter active core
        const pulse = 0.5 + Math.sin(time * 0.012) * 0.45;
        ctx.fillStyle = `rgba(0, 255, 157, ${pulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(paCenterX, paCenterY, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '8px monospace';
        ctx.fillStyle = COLORS.emerald;
        ctx.fillText('437.375MHz TX PA', blk.x + 8, blk.y + blk.h - 10);
      }
    });

    // 4. Clock Tree Synthesis (CTS) Global Synchronizing Pulse across Chip
    c.ctsWave = (time * 0.07) % Math.max(c.w, c.h);
    ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, 0.35 - c.ctsWave / (c.w * 1.1))})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(c.x + c.w * 0.5, c.y + c.h * 0.5, c.ctsWave, 0, Math.PI * 2);
    ctx.stroke();

    // 5. Electron packet traffic along multi-layer metal tracks
    c.electrons.forEach((el) => {
      el.x += el.speed * el.direction;
      if (el.x > c.x + c.w - 30) { el.x = c.x + 30; el.y = c.y + 40 + Math.random() * (c.h - 80); }
      if (el.x < c.x + 30) { el.x = c.x + c.w - 30; el.y = c.y + 40 + Math.random() * (c.h - 80); }

      ctx.fillStyle = el.color;
      ctx.shadowColor = el.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(el.x, el.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 6. High-Frequency RF Transmission Line from Left Chip to Satellite & Earth
    // Output launches from RF PA Block pad on the right of the chip
    const rfOutX = c.x + c.w;
    const rfOutY = c.y + c.h * 0.76;

    // Launch trajectory curving into space
    const launchDist = Math.hypot(satellite.x - rfOutX, satellite.y - rfOutY);
    ctx.strokeStyle = 'rgba(0, 255, 157, 0.45)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    const steps = Math.floor(launchDist / 6);

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      // Quadratic bezier control point lifting towards upper orbit
      const cx = (rfOutX + satellite.x) * 0.5 - 40;
      const cy = Math.min(rfOutY, satellite.y) - 60;

      const bx = (1 - t) * (1 - t) * rfOutX + 2 * (1 - t) * t * cx + t * t * satellite.x;
      const by = (1 - t) * (1 - t) * rfOutY + 2 * (1 - t) * t * cy + t * t * satellite.y;

      // High frequency carrier sine ripple on transmission line
      const wave = Math.sin(s * 0.35 - time * 0.015) * 5 * (1 - t * 0.2);
      if (s === 0) ctx.moveTo(bx, by + wave);
      else ctx.lineTo(bx, by + wave);
    }
    ctx.stroke();

    // Data label on RF feedline
    ctx.font = '8px monospace';
    ctx.fillStyle = COLORS.emerald;
    ctx.fillText('RF_TRANSMIT_BUS >>', rfOutX + 15, rfOutY - 8);
  }

  /* =============================================================
     RENDER LAYER 2: BIGGER 3D ROTATING EARTH GLOBE & KATHMANDU BEACON
     ============================================================= */
  function projectSpherePoint(latRad, lonRad, rotAngle) {
    const lon = lonRad + rotAngle;
    const cosLat = Math.cos(latRad);
    const sinLat = Math.sin(latRad);

    const x3 = earth.radius * cosLat * Math.sin(lon);
    const y3 = -earth.radius * sinLat;
    const z3 = earth.radius * cosLat * Math.cos(lon);

    // Apply tilt around X-axis
    const cosTilt = Math.cos(earth.tilt);
    const sinTilt = Math.sin(earth.tilt);
    const yProj = y3 * cosTilt - z3 * sinTilt;
    const zProj = y3 * sinTilt + z3 * cosTilt;

    return {
      x: earth.x + x3,
      y: earth.y + yProj,
      z: zProj,
      visible: zProj > 0
    };
  }

  let ktmPos = { x: 0, y: 0, visible: true };

  function drawRotatingEarth(time) {
    earth.rotation += earth.rotSpeed;

    // Atmospheric Ozone Rim Glow
    const atmosGrad = ctx.createRadialGradient(earth.x, earth.y, earth.radius * 0.88, earth.x, earth.y, earth.radius * 1.25);
    atmosGrad.addColorStop(0, 'rgba(14, 165, 233, 0.32)');
    atmosGrad.addColorStop(0.55, 'rgba(0, 240, 255, 0.14)');
    atmosGrad.addColorStop(1, 'rgba(4, 7, 17, 0)');

    ctx.fillStyle = atmosGrad;
    ctx.beginPath();
    ctx.arc(earth.x, earth.y, earth.radius * 1.25, 0, Math.PI * 2);
    ctx.fill();

    // Deep Ocean Sphere with lighting gradient
    const oceanGrad = ctx.createRadialGradient(earth.x - earth.radius * 0.3, earth.y - earth.radius * 0.3, earth.radius * 0.08, earth.x, earth.y, earth.radius);
    oceanGrad.addColorStop(0, '#0c4a6e');
    oceanGrad.addColorStop(0.65, '#072540');
    oceanGrad.addColorStop(1, '#020d18');

    ctx.fillStyle = oceanGrad;
    ctx.beginPath();
    ctx.arc(earth.x, earth.y, earth.radius, 0, Math.PI * 2);
    ctx.fill();

    // Clip rendering to the Earth disc
    ctx.save();
    ctx.beginPath();
    ctx.arc(earth.x, earth.y, earth.radius, 0, Math.PI * 2);
    ctx.clip();

    // 1. Latitude & Longitude Meridians (Wireframe Grid)
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.13)';
    ctx.lineWidth = 1;

    for (let lat = -60; lat <= 60; lat += 30) {
      const latRad = lat * (Math.PI / 180);
      ctx.beginPath();
      let started = false;
      for (let lon = -180; lon <= 180; lon += 6) {
        const pt = projectSpherePoint(latRad, lon * (Math.PI / 180), earth.rotation);
        if (pt.visible) {
          if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
          else { ctx.lineTo(pt.x, pt.y); }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    for (let lon = -180; lon < 180; lon += 30) {
      const lonRad = lon * (Math.PI / 180);
      ctx.beginPath();
      let started = false;
      for (let lat = -90; lat <= 90; lat += 5) {
        const pt = projectSpherePoint(lat * (Math.PI / 180), lonRad, earth.rotation);
        if (pt.visible) {
          if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
          else { ctx.lineTo(pt.x, pt.y); }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    // 2. Continents & Landmass Polygons Rotating
    ctx.fillStyle = 'rgba(16, 185, 129, 0.32)';
    ctx.strokeStyle = 'rgba(0, 255, 157, 0.5)';
    ctx.lineWidth = 1.4;

    CONTINENTS.forEach((poly) => {
      ctx.beginPath();
      let hasVisible = false;
      let first = true;

      poly.forEach((coord) => {
        const pt = projectSpherePoint(coord.lat * (Math.PI / 180), coord.lon * (Math.PI / 180), earth.rotation);
        if (pt.visible) {
          hasVisible = true;
          if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
          else { ctx.lineTo(pt.x, pt.y); }
        }
      });

      if (hasVisible) {
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    });

    // 3. Kathmandu Ground Station Beacon (27.7°N, 85.3°E)
    ktmPos = projectSpherePoint(KTM_LAT, KTM_LON, earth.rotation);

    if (ktmPos.visible) {
      const ktmPulse = (time * 0.005) % 1;
      ctx.strokeStyle = `rgba(255, 183, 3, ${1 - ktmPulse})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(ktmPos.x, ktmPos.y, 8 + ktmPulse * 20, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = COLORS.amber;
      ctx.shadowColor = COLORS.amber;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(ktmPos.x, ktmPos.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = 'bold 9.5px monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText('APN_KATHMANDU (27.7°N)', ktmPos.x + 9, ktmPos.y - 6);
    }

    ctx.restore();

    // Earth Limb Atmosphere Ring
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.48)';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(earth.x, earth.y, earth.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  /* =============================================================
     RENDER LAYER 3: CONTINUOUSLY ORBITING SATELLITE (LARGER, NO NAME)
     ============================================================= */
  function updateSatelliteOrbit() {
    satellite.orbitAngle += satellite.orbitSpeed;

    const cosA = Math.cos(satellite.orbitAngle);
    const sinA = Math.sin(satellite.orbitAngle);

    const orbitX3 = satellite.orbitRadiusX * cosA;
    const orbitY3 = satellite.orbitRadiusY * sinA;

    const cosInc = Math.cos(satellite.orbitInclination);
    const sinInc = Math.sin(satellite.orbitInclination);

    satellite.x = earth.x + orbitX3;
    satellite.y = earth.y + (orbitY3 * cosInc);
    satellite.z = orbitY3 * sinInc;

    const distFromCenter = Math.hypot(satellite.x - earth.x, satellite.y - earth.y);
    satellite.isOccluded = (satellite.z < 0 && distFromCenter < earth.radius * 0.95);
  }

  function drawSatelliteTrajectory() {
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.16)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();

    const steps = 64;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const ox = earth.x + satellite.orbitRadiusX * Math.cos(a);
      const oy = earth.y + (satellite.orbitRadiusY * Math.sin(a) * Math.cos(satellite.orbitInclination));
      if (i === 0) ctx.moveTo(ox, oy);
      else ctx.lineTo(ox, oy);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawSatelliteBody(time) {
    if (satellite.isOccluded) return;

    ctx.save();
    ctx.translate(satellite.x, satellite.y);

    // Subtle attitude motion
    ctx.rotate(Math.sin(time * 0.001) * 0.16 + 0.08);

    // Scale with 3D depth (moderately larger size)
    const depthScale = 1.05 + (satellite.z / satellite.orbitRadiusY) * 0.3;
    ctx.scale(depthScale, depthScale);

    // --- Solar Wings (Larger, Multi-Cell Grid with Gold Busbars) ---
    // Left Wing
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.fillRect(-48, -12, 32, 24);
    ctx.strokeRect(-48, -12, 32, 24);

    // Left solar cells divisions
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.moveTo(-32, -12); ctx.lineTo(-32, 12);
    ctx.moveTo(-48, 0); ctx.lineTo(-16, 0);
    ctx.stroke();

    // Right Wing
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.fillRect(16, -12, 32, 24);
    ctx.strokeRect(16, -12, 32, 24);

    // Right solar cells divisions
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.moveTo(32, -12); ctx.lineTo(32, 12);
    ctx.moveTo(16, 0); ctx.lineTo(48, 0);
    ctx.stroke();

    // --- 1U CubeSat Chassis (Larger: 32x32px) ---
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 2.2;
    ctx.fillRect(-16, -16, 32, 32);
    ctx.strokeRect(-16, -16, 32, 32);

    // Aluminum Rail Standoffs
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-17, -17, 5, 5);
    ctx.fillRect(12, -17, 5, 5);
    ctx.fillRect(-17, 12, 5, 5);
    ctx.fillRect(12, 12, 5, 5);

    // Optical Camera Aperture / Quad-Mag Sensor Port
    ctx.fillStyle = COLORS.amber;
    ctx.beginPath();
    ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#040711';
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Transceiver Dipole Whip Antennas with Glowing Beacon Tips
    ctx.strokeStyle = COLORS.emerald;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.lineTo(0, 42);
    ctx.stroke();

    ctx.fillStyle = COLORS.emerald;
    ctx.beginPath();
    ctx.arc(0, 42, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(0, -38);
    ctx.stroke();

    ctx.fillStyle = COLORS.emerald;
    ctx.beginPath();
    ctx.arc(0, -38, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    // NOTICE: Satellite text name label removed per user directive!
  }

  /* =============================================================
     RENDER LAYER 4: CONTINUOUS TRAVELLING COMMUNICATION SIGNALS
     ============================================================= */
  function drawTravellingSignals(time) {
    if (satellite.isOccluded) return;

    const targetX = ktmPos.visible ? ktmPos.x : earth.x;
    const targetY = ktmPos.visible ? ktmPos.y : earth.y;

    const sourceX = satellite.x;
    const sourceY = satellite.y;

    const dist = Math.hypot(targetX - sourceX, targetY - sourceY);
    if (dist < 5) return;

    // 1. Concentrated RF Carrier Downlink Beam (437.375 MHz)
    const beamPulse = (time * 0.09) % 80;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.38)';
    ctx.lineWidth = 1.6;
    ctx.setLineDash([8, 8]);
    ctx.lineDashOffset = -beamPulse;
    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Continuous Spherical RF Wavefronts Radiating from Satellite Antenna
    for (let w = 1; w <= 4; w++) {
      const waveRadius = ((time * 0.06 + (w * 35)) % 140);
      const alpha = Math.max(0, 0.45 * (1 - waveRadius / 140));

      ctx.strokeStyle = `rgba(0, 255, 157, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const angleToEarth = Math.atan2(targetY - sourceY, targetX - sourceX);
      ctx.arc(sourceX, sourceY, waveRadius, angleToEarth - 0.9, angleToEarth + 0.9);
      ctx.stroke();
    }

    // 3. Modulated Sinusoidal RF Ripple along the beam
    ctx.strokeStyle = 'rgba(0, 255, 157, 0.6)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    const steps = Math.floor(dist / 4);
    const normalX = -(targetY - sourceY) / dist;
    const normalY = (targetX - sourceX) / dist;

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const bx = sourceX + (targetX - sourceX) * t;
      const by = sourceY + (targetY - sourceY) * t;
      const wave = Math.sin(s * 0.28 - time * 0.015) * 6 * (1 - t * 0.3);
      const px = bx + normalX * wave;
      const py = by + normalY * wave;

      if (s === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // 4. Discreet Travelling Digital Telemetry Packets
    travellingSignals.forEach((pkt) => {
      pkt.progress += pkt.speed;
      if (pkt.progress > 1) pkt.progress = 0;

      const px = sourceX + (targetX - sourceX) * pkt.progress;
      const py = sourceY + (targetY - sourceY) * pkt.progress;

      ctx.fillStyle = COLORS.cyan;
      ctx.shadowColor = COLORS.cyan;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (pkt.progress > 0.15 && pkt.progress < 0.85) {
        ctx.font = 'bold 8.5px monospace';
        ctx.fillStyle = COLORS.emerald;
        ctx.fillText(pkt.type, px + 8, py - 4);
      }
    });
  }

  /* =============================================================
     MAIN ENGINE LOOP
     ============================================================= */
  function loop(time) {
    if (!isPaused) {
      ctx.clearRect(0, 0, width, height);

      // 1. Starfield background
      starfield.forEach((s) => {
        const twinkle = Math.sin(time * s.twinkleSpeed + s.x) * 0.25;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, s.alpha + twinkle)})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });

      // 2. Dedicated Left-Side Animated Silicon Chip (ASIC & RF Transmitter)
      drawLeftSiliconChip(time);

      // 3. Orbital Trajectory line
      drawSatelliteTrajectory();

      // 4. Update satellite 3D orbit
      updateSatelliteOrbit();

      // 5. Draw satellite if behind Earth
      if (satellite.z <= 0) {
        drawSatelliteBody(time);
      }

      // 6. Big 3D Rotating Earth (continuous rotation & Kathmandu beacon)
      drawRotatingEarth(time);

      // 7. Draw satellite if in front of Earth
      if (satellite.z > 0) {
        drawSatelliteBody(time);
      }

      // 8. Continuous Travelling Communication Signals (RF wavefronts & packets)
      drawTravellingSignals(time);

      // 9. Interactive Mouse Induction Probe
      if (mouse.active) {
        const indRadius = 50 + Math.sin(time * 0.005) * 10;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.lineWidth = 1.4;
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

    animationFrameId = requestAnimationFrame(loop);
  }

  resize();
  animationFrameId = requestAnimationFrame(loop);

  window.toggleCircuitPause = function () {
    isPaused = !isPaused;
    return isPaused;
  };
})();
