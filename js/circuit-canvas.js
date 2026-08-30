/**
 * Advanced Orbital Avionics & Silicon Semiconductor Telemetry Engine 4.0
 * 
 * Feat:
 * 1. Deep Silicon Semiconductor Substrate: SkyWater 130nm ASIC dies, CTS clock pulses,
 *    standard cell rows, microstrip transmission lines actively generating RF carrier waves.
 * 2. 3D Continuously Rotating Earth:
 *    - Orthographic 3D projection of rotating globe with latitude/longitude meridians,
 *      atmospheric ozone glow, and rotating landmass contours (including Himalayas/Nepal).
 *    - Kathmandu Ground Station (27.7°N, 85.3°E) beacon rotating with Earth.
 * 3. Continuously Orbiting Satellite (Slippers2Sat 1U CubeSat):
 *    - Full 3D orbital trajectory with inclined plane and depth occlusion (orbiting in front and behind Earth).
 *    - Deployed solar arrays, chassis, and dipole antenna.
 * 4. Travelling Communication Signals:
 *    - RF transceiver block on the silicon chip synthesizes the modulated signal.
 *    - High-speed transmission line directs RF power to the satellite antenna.
 *    - Continuous travelling electromagnetic sinusoidal wavefronts and telemetry data packets (AX.25, GMSK, EPDM)
 *      propagating through space towards the rotating Earth and ground station.
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
    earthBlue: '#0ea5e9',
    earthLand: '#10b981'
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
     1. CONTINUOUSLY ROTATING 3D EARTH MODEL
     ============================================================= */
  let earth = {
    x: 0,
    y: 0,
    radius: 160,
    rotation: 0,
    rotSpeed: 0.0035, // Smooth continuous rotation
    tilt: 0.28 // Earth axial tilt (~16 degrees for projection)
  };

  // Simplified continent polygons in spherical coordinates [lat (deg), lon (deg)]
  const CONTINENTS = [
    // Eurasia & South Asia (including Indian subcontinent & Himalayas)
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
     2. 3D ORBITING SATELLITE (SLIPPERS2SAT 1U CUBESAT)
     ============================================================= */
  let satellite = {
    orbitAngle: 0,
    orbitSpeed: 0.0075, // continuous orbit
    orbitRadiusX: 280,
    orbitRadiusY: 110,
    orbitInclination: 0.45, // 3D tilt
    x: 0,
    y: 0,
    z: 0, // Depth relative to Earth center (>0 in front, <0 behind)
    isOccluded: false
  };

  /* =============================================================
     3. DEEP SILICON SEMICONDUCTOR FAB SUBSTRATE
     ============================================================= */
  let siliconDies = [];
  let siliconTraces = [];
  let starfield = [];
  let travellingSignals = [];

  function initScene() {
    // Dynamic Earth positioning: placed comfortably in lower center/right for maximum visual balance
    const isMobile = width < 768;
    earth.radius = isMobile ? Math.min(width * 0.28, 120) : Math.min(width * 0.18, 190);
    earth.x = isMobile ? width * 0.5 : width * 0.72;
    earth.y = isMobile ? height * 0.65 : height * 0.52;

    satellite.orbitRadiusX = earth.radius * 1.85;
    satellite.orbitRadiusY = earth.radius * 0.75;

    // Starfield
    starfield = [];
    for (let i = 0; i < 90; i++) {
      starfield.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.8 + Math.random() * 1.7,
        alpha: 0.15 + Math.random() * 0.7,
        twinkleSpeed: 0.002 + Math.random() * 0.004
      });
    }

    // Silicon Substrate Chips (Transmitting Hardware on Earth/Die)
    siliconDies = [];
    const chipW = Math.max(160, Math.floor(width / 6.5));
    const chipH = Math.max(120, Math.floor(height / 5.5));
    const cols = Math.ceil(width / chipW);
    const rows = Math.ceil(height / chipH);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * chipW;
        const y = r * chipH;
        const isTxModem = (c === 0 && r === 1);
        const isCore = (c === 1 && r === 1);

        siliconDies.push({
          x: x,
          y: y,
          w: chipW,
          h: chipH,
          id: `DIE_${r}_${c}`,
          label: isTxModem ? 'RF_TX_GMSK_MODEM' :
                 isCore ? 'RV32I_5STAGE_CORE' :
                 (c === 0 && r === 2) ? 'IPCC_SRAM3_MAILBOX' :
                 (c === 1 && r === 2) ? 'QUAD_PNI_RM3100_IF' :
                 (c === 0 && r === 0) ? 'MT25QL_1GB_FLASH' : `STD_CELL_${r}${c}`,
          isTxModem: isTxModem,
          isCore: isCore
        });
      }
    }

    // High-speed Microstrip RF Feedlines from Chip to Space Link
    siliconTraces = [];
    const txDie = siliconDies.find(d => d.isTxModem) || siliconDies[0];
    if (txDie) {
      siliconTraces.push({
        x1: txDie.x + txDie.w * 0.85,
        y1: txDie.y + txDie.h * 0.45,
        x2: txDie.x + txDie.w + 60,
        y2: txDie.y + txDie.h * 0.45,
        color: COLORS.emerald
      });
      siliconTraces.push({
        x1: txDie.x + txDie.w + 60,
        y1: txDie.y + txDie.h * 0.45,
        x2: txDie.x + txDie.w + 140,
        y2: txDie.y + txDie.h * 0.15,
        color: COLORS.cyan
      });
    }

    // Travelling signal packets queue
    travellingSignals = [];
    for (let i = 0; i < 7; i++) {
      travellingSignals.push({
        progress: (i / 7),
        speed: 0.0065,
        type: (i % 3 === 0) ? 'AX.25 UI_FRAME' : (i % 3 === 1) ? 'EPDM_QUAD_MAG' : 'GMSK_9600'
      });
    }
  }

  /* =============================================================
     RENDER LAYER 1: DEEP SILICON DIE & RF TRANSMITTER STAGE
     ============================================================= */
  function drawSiliconSubstrate(time) {
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.055)';
    ctx.lineWidth = 1;

    siliconDies.forEach((die) => {
      ctx.strokeRect(die.x + 2, die.y + 2, die.w - 4, die.h - 4);

      if (die.isTxModem) {
        ctx.fillStyle = 'rgba(0, 255, 157, 0.04)';
        ctx.fillRect(die.x + 4, die.y + 4, die.w - 8, die.h - 8);
      } else if (die.isCore) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.035)';
        ctx.fillRect(die.x + 4, die.y + 4, die.w - 8, die.h - 8);
      }

      // Standard cell internal metal rows
      ctx.strokeStyle = die.isTxModem ? 'rgba(0, 255, 157, 0.12)' : 'rgba(148, 163, 184, 0.04)';
      for (let ty = die.y + 16; ty < die.y + die.h - 10; ty += 12) {
        ctx.beginPath();
        ctx.moveTo(die.x + 8, ty);
        ctx.lineTo(die.x + die.w - 8, ty);
        ctx.stroke();
      }

      ctx.font = '8.5px monospace';
      ctx.fillStyle = die.isTxModem ? COLORS.emerald : die.isCore ? COLORS.cyan : 'rgba(148, 163, 184, 0.4)';
      ctx.fillText(die.label, die.x + 8, die.y + 14);
    });

    // Chip Clock Tree Synthesis (CTS) Global Synchronizing Pulse
    const ctsRadius = (time * 0.09) % (Math.max(width, height) * 0.75);
    ctx.strokeStyle = `rgba(0, 240, 255, ${Math.max(0, 0.22 - ctsRadius / 1500)})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(width * 0.15, height * 0.35, ctsRadius, 0, Math.PI * 2);
    ctx.stroke();

    // High-Frequency RF Carrier Generation at Transmitter Die
    const txDie = siliconDies.find(d => d.isTxModem);
    if (txDie) {
      const txPadX = txDie.x + txDie.w * 0.85;
      const txPadY = txDie.y + txDie.h * 0.45;

      // Active pulsing RF power amplifier stage
      const rfGlow = 0.5 + Math.sin(time * 0.01) * 0.4;
      ctx.fillStyle = `rgba(0, 255, 157, ${rfGlow * 0.35})`;
      ctx.beginPath();
      ctx.arc(txPadX, txPadY, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = COLORS.emerald;
      ctx.beginPath();
      ctx.arc(txPadX, txPadY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '9px monospace';
      ctx.fillStyle = COLORS.emerald;
      ctx.fillText('PA_STAGE_437MHz_ACTIVE', txPadX - 60, txPadY - 18);

      // Microstrip RF feedline with traveling sine wave
      siliconTraces.forEach((trace) => {
        ctx.strokeStyle = trace.color + '0.4)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        const dist = Math.hypot(trace.x2 - trace.x1, trace.y2 - trace.y1);
        const steps = Math.floor(dist / 4);
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const bx = trace.x1 + (trace.x2 - trace.x1) * t;
          const by = trace.y1 + (trace.y2 - trace.y1) * t;
          const wave = Math.sin(s * 0.2 - time * 0.012) * 5;
          if (s === 0) ctx.moveTo(bx, by + wave);
          else ctx.lineTo(bx, by + wave);
        }
        ctx.stroke();
      });
    }
  }

  /* =============================================================
     RENDER LAYER 2: 3D ROTATING EARTH GLOBE & KATHMANDU BEACON
     ============================================================= */
  // 3D coordinate transformation on rotating sphere
  function projectSpherePoint(latRad, lonRad, rotAngle) {
    const lon = lonRad + rotAngle;
    const cosLat = Math.cos(latRad);
    const sinLat = Math.sin(latRad);

    // 3D coordinates (with axial tilt)
    const x3 = earth.radius * cosLat * Math.sin(lon);
    const y3 = -earth.radius * sinLat;
    const z3 = earth.radius * cosLat * Math.cos(lon);

    // Apply earth.tilt around X-axis
    const cosTilt = Math.cos(earth.tilt);
    const sinTilt = Math.sin(earth.tilt);
    const yProj = y3 * cosTilt - z3 * sinTilt;
    const zProj = y3 * sinTilt + z3 * cosTilt;

    return {
      x: earth.x + x3,
      y: earth.y + yProj,
      z: zProj,
      visible: zProj > 0 // true if facing the camera
    };
  }

  let ktmPos = { x: 0, y: 0, visible: true };

  function drawRotatingEarth(time) {
    earth.rotation += earth.rotSpeed;

    // Atmospheric Ozone Rim Glow
    const atmosGrad = ctx.createRadialGradient(earth.x, earth.y, earth.radius * 0.85, earth.x, earth.y, earth.radius * 1.25);
    atmosGrad.addColorStop(0, 'rgba(14, 165, 233, 0.28)');
    atmosGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.12)');
    atmosGrad.addColorStop(1, 'rgba(4, 7, 17, 0)');

    ctx.fillStyle = atmosGrad;
    ctx.beginPath();
    ctx.arc(earth.x, earth.y, earth.radius * 1.25, 0, Math.PI * 2);
    ctx.fill();

    // Deep Ocean Sphere
    const oceanGrad = ctx.createRadialGradient(earth.x - earth.radius * 0.3, earth.y - earth.radius * 0.3, earth.radius * 0.1, earth.x, earth.y, earth.radius);
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
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
    ctx.lineWidth = 1;

    // Latitude parallels
    for (let lat = -60; lat <= 60; lat += 30) {
      const latRad = lat * (Math.PI / 180);
      ctx.beginPath();
      let started = false;
      for (let lon = -180; lon <= 180; lon += 8) {
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

    // Longitude meridians
    for (let lon = -180; lon < 180; lon += 30) {
      const lonRad = lon * (Math.PI / 180);
      ctx.beginPath();
      let started = false;
      for (let lat = -90; lat <= 90; lat += 6) {
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
    ctx.fillStyle = 'rgba(16, 185, 129, 0.28)';
    ctx.strokeStyle = 'rgba(0, 255, 157, 0.45)';
    ctx.lineWidth = 1.2;

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
      // Pulsing reception ring
      const ktmPulse = (time * 0.005) % 1;
      ctx.strokeStyle = `rgba(255, 183, 3, ${1 - ktmPulse})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(ktmPos.x, ktmPos.y, 8 + ktmPulse * 16, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = COLORS.amber;
      ctx.shadowColor = COLORS.amber;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(ktmPos.x, ktmPos.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = '9px monospace';
      ctx.fillStyle = '#fff';
      ctx.fillText('APN_KATHMANDU (27.7°N)', ktmPos.x + 8, ktmPos.y - 6);
    }

    ctx.restore(); // Restore Earth clip

    // Earth Limb Atmosphere Ring
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(earth.x, earth.y, earth.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  /* =============================================================
     RENDER LAYER 3: CONTINUOUSLY ORBITING SATELLITE (3D LEO)
     ============================================================= */
  function updateSatelliteOrbit(time) {
    satellite.orbitAngle += satellite.orbitSpeed;

    // 3D Elliptical Inclined Orbit Equation
    const cosA = Math.cos(satellite.orbitAngle);
    const sinA = Math.sin(satellite.orbitAngle);

    // Coordinate along orbit plane
    const orbitX3 = satellite.orbitRadiusX * cosA;
    const orbitY3 = satellite.orbitRadiusY * sinA;

    // Rotate with inclination
    const cosInc = Math.cos(satellite.orbitInclination);
    const sinInc = Math.sin(satellite.orbitInclination);

    satellite.x = earth.x + orbitX3;
    satellite.y = earth.y + (orbitY3 * cosInc);
    satellite.z = orbitY3 * sinInc; // depth: >0 in front of Earth, <0 behind Earth

    // Occlusion test: when behind Earth and inside radius
    const distFromCenter = Math.hypot(satellite.x - earth.x, satellite.y - earth.y);
    satellite.isOccluded = (satellite.z < 0 && distFromCenter < earth.radius * 0.95);
  }

  function drawSatelliteTrajectory() {
    // Render full orbital elliptical track
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
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
    if (satellite.isOccluded) return; // Orbiting behind Earth

    ctx.save();
    ctx.translate(satellite.x, satellite.y);

    // Subtle tumble/attitude motion
    ctx.rotate(Math.sin(time * 0.001) * 0.18 + 0.1);

    // Scale slightly with 3D depth
    const depthScale = 0.85 + (satellite.z / satellite.orbitRadiusY) * 0.25;
    ctx.scale(depthScale, depthScale);

    // Solar Wings
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.fillRect(-32, -8, 20, 16);
    ctx.fillRect(12, -8, 20, 16);
    ctx.strokeRect(-32, -8, 20, 16);
    ctx.strokeRect(12, -8, 20, 16);

    // 1U Chassis Body
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = COLORS.cyan;
    ctx.lineWidth = 1.8;
    ctx.fillRect(-12, -12, 24, 24);
    ctx.strokeRect(-12, -12, 24, 24);

    // Optical Camera Aperture / Quad-Mag Sensor Port
    ctx.fillStyle = COLORS.amber;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    // Monopole / Dipole Transceiver Whip Antennas
    ctx.strokeStyle = COLORS.emerald;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(0, 30);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(0, -26);
    ctx.stroke();

    ctx.restore();

    // Satellite HUD Tag
    ctx.font = '9.5px monospace';
    ctx.fillStyle = COLORS.cyan;
    ctx.fillText('SLIPPERS2SAT (1U LEO // 520km)', satellite.x - 75, satellite.y - 24);
  }

  /* =============================================================
     RENDER LAYER 4: CONTINUOUS TRAVELLING COMMUNICATION SIGNALS
     ============================================================= */
  function drawTravellingSignals(time) {
    if (satellite.isOccluded) return;

    // Destination: Kathmandu Ground Station if visible, otherwise Earth surface center
    const targetX = ktmPos.visible ? ktmPos.x : earth.x;
    const targetY = ktmPos.visible ? ktmPos.y : earth.y;

    const sourceX = satellite.x;
    const sourceY = satellite.y;

    const dist = Math.hypot(targetX - sourceX, targetY - sourceY);
    if (dist < 5) return;

    // 1. Concentrated RF Carrier Downlink Beam (437.375 MHz)
    const beamPulse = (time * 0.09) % 80;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1.4;
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
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      // Wave directed forward towards Earth
      const angleToEarth = Math.atan2(targetY - sourceY, targetX - sourceX);
      ctx.arc(sourceX, sourceY, waveRadius, angleToEarth - 0.9, angleToEarth + 0.9);
      ctx.stroke();
    }

    // 3. Modulated Signal Wavefront Traversal (Sinusoidal RF Ripple along the beam)
    ctx.strokeStyle = 'rgba(0, 255, 157, 0.55)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    const steps = Math.floor(dist / 4);
    const normalX = -(targetY - sourceY) / dist;
    const normalY = (targetX - sourceX) / dist;

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const bx = sourceX + (targetX - sourceX) * t;
      const by = sourceY + (targetY - sourceY) * t;
      // GMSK continuous-phase sine ripple
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

      // Glowing Data Packet Node
      ctx.fillStyle = COLORS.cyan;
      ctx.shadowColor = COLORS.cyan;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Packet Label
      if (pkt.progress > 0.15 && pkt.progress < 0.85) {
        ctx.font = '8px monospace';
        ctx.fillStyle = COLORS.emerald;
        ctx.fillText(pkt.type, px + 8, py - 4);
      }
    });

    // 5. Direct Silicon Chip to Space Link (Trace tying the on-board chip to satellite transmission)
    const txDie = siliconDies.find(d => d.isTxModem);
    if (txDie) {
      const chipTxX = txDie.x + txDie.w + 140;
      const chipTxY = txDie.y + txDie.h * 0.15;

      const uplinkPulse = (time * 0.05) % 60;
      ctx.strokeStyle = 'rgba(0, 255, 157, 0.22)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.lineDashOffset = -uplinkPulse;
      ctx.beginPath();
      ctx.moveTo(chipTxX, chipTxY);
      ctx.quadraticCurveTo(width * 0.35, height * 0.2, satellite.x, satellite.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  /* =============================================================
     MAIN ENGINE LOOP & CONTROLS
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

      // 2. Semiconductor Silicon Substrate & RF Transceiver Die
      drawSiliconSubstrate(time);

      // 3. Orbital Trajectory line
      drawSatelliteTrajectory();

      // 4. Update satellite 3D orbit
      updateSatelliteOrbit(time);

      // 5. Draw satellite if behind Earth
      if (satellite.z <= 0) {
        drawSatelliteBody(time);
      }

      // 6. 3D Rotating Earth (with continuous rotation & Kathmandu beacon)
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

  window.setCircuitMode = function (mode) {
    // Unified engine combines all components into a synchronized real-time aerospace simulation
    const labelEl = document.getElementById('circuit-mode-name');
    if (labelEl) {
      labelEl.textContent = 'ORBIT & SILICON LIVE';
    }
  };

  window.toggleCircuitPause = function () {
    isPaused = !isPaused;
    return isPaused;
  };
})();
