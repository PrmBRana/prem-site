/**
 * Interactive Hardware & Silicon Engineering Labs 2.0
 * Includes Web Audio UI sound synthesis, real flight firmware simulations, and interactive tabs.
 */

(function () {
  'use strict';

  /* =============================================================
     0. EMBEDDED WEB AUDIO SOUND SYNTHESIZER (NO EXTERNAL AUDIO FILES)
     ============================================================= */
  let audioCtx = null;
  let isSoundMuted = false;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  window.playUiSound = function (type) {
    if (isSoundMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      if (type === 'click') {
        // High-tech click blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);

      } else if (type === 'packet') {
        // Telemetry dispatch chirp
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.1);

      } else if (type === 'alert') {
        // Warning / power cut buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.15);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);

      } else if (type === 'success') {
        // Success chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.setValueAtTime(987.77, now + 0.08); // B5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  window.toggleSoundMute = function () {
    isSoundMuted = !isSoundMuted;
    const btn = document.getElementById('sound-toggle-btn');
    if (btn) {
      btn.classList.toggle('active', !isSoundMuted);
      btn.title = isSoundMuted ? 'Sound Effects: Muted' : 'Sound Effects: Active';
    }
    if (!isSoundMuted) window.playUiSound('success');
  };

  /* =============================================================
     1. STM32 DUAL-CORE IPCC SIMULATION
     ============================================================= */
  const ipcc = {
    packetTypes: [
      { cmd: 'CMD_TELEMETRY_LOG', payload: '[OBC] BATT=4.18V | CURR=420mA | TEMP=16.8C | LEO=520km' },
      { cmd: 'CMD_ATTITUDE_UPDATE', payload: '[ADCS] Q=[0.707, 0.0, 0.707, 0.0] | B_NORM=43.2uT' },
      { cmd: 'CMD_RF_DOWNLINK_BURST', payload: '[COMMS] AX.25 UI_FRAME | CALLSIGN=S2S_PREM | GMSK_9600' },
      { cmd: 'CMD_EPDM_MAG_BURST', payload: '[QUAD_RM3100] S0=49015.8nT | S1=49016.2nT | S2=49015.4nT' },
      { cmd: 'CMD_DIGIPEATER_RELAY', payload: '[DPM] REPEAT_PKT FROM 9N1AA TO HAM_NET MSG="EMERGENCY_OK"' }
    ],
    packetIndex: 0
  };

  window.dispatchIpccPacket = function () {
    window.playUiSound('packet');

    const c1El = document.getElementById('core1-block');
    const c2El = document.getElementById('core2-block');
    const busEl = document.getElementById('ipcc-bus');
    const sramPayloadEl = document.getElementById('sram-payload');
    const c1StatusEl = document.getElementById('c1-status');
    const c2StatusEl = document.getElementById('c2-status');
    const regC1MREl = document.getElementById('reg-c1mr');
    const regC1SCREl = document.getElementById('reg-c1scr');
    const regC2TOC1El = document.getElementById('reg-c2toc1');

    if (!c1El || !c2El) return;

    const packet = ipcc.packetTypes[ipcc.packetIndex % ipcc.packetTypes.length];
    ipcc.packetIndex++;

    // Step 1: Core 1 (M7) writes & cleans D-Cache
    c1El.classList.add('active-tx');
    c1StatusEl.textContent = 'D-CACHE CLEAN & WRITE SRAM';
    c1StatusEl.style.color = '#00f0ff';
    if (sramPayloadEl) {
      sramPayloadEl.textContent = `${packet.cmd} -> ${packet.payload}`;
      sramPayloadEl.style.borderColor = '#00f0ff';
    }
    if (regC1SCREl) regC1SCREl.textContent = '0x0001 (TXF)';

    // Step 2: Trigger IPCC IRQ via bus
    setTimeout(() => {
      busEl.classList.add('transmitting');
      c1StatusEl.textContent = 'NOTIFYING IPCC CH1 IRQ';
      if (regC1MREl) regC1MREl.textContent = '0x0000 (UNMASKED)';
    }, 400);

    // Step 3: Core 2 (M4) receives IRQ & invalidates D-Cache
    setTimeout(() => {
      c2El.classList.add('active-rx');
      c2StatusEl.textContent = 'IRQ TRIGGERED -> D-CACHE INVALIDATE';
      c2StatusEl.style.color = '#00ff9d';
      if (regC2TOC1El) regC2TOC1El.textContent = '0x0001 (RXO)';
    }, 900);

    // Step 4: Core 2 acknowledges
    setTimeout(() => {
      c2StatusEl.textContent = 'PACKET CONSUMED -> ACK CLEAR';
      if (regC1SCREl) regC1SCREl.textContent = '0x0000 (CLEARED)';
      if (regC2TOC1El) regC2TOC1El.textContent = '0x0000 (ACK_OK)';
    }, 1500);

    // Reset
    setTimeout(() => {
      c1El.classList.remove('active-tx');
      c2El.classList.remove('active-rx');
      busEl.classList.remove('transmitting');
      c1StatusEl.textContent = 'IDLE (MONITORING OBC)';
      c1StatusEl.style.color = '#94a3b8';
      c2StatusEl.textContent = 'READY (LISTENING CH1)';
      c2StatusEl.style.color = '#94a3b8';
    }, 2200);
  };

  /* =============================================================
     2. LOCK-FREE RING BUFFER SIMULATION
     ============================================================= */
  const RING_SIZE = 16;
  const ringBuffer = {
    buffer: new Array(RING_SIZE).fill(null),
    head: 0,
    tail: 0,
    overrunCount: 0,
    byteSeq: 0x41
  };

  function renderRingCanvas() {
    const canvas = document.getElementById('ring-buffer-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 320;
    const h = canvas.height = 280;
    ctx.clearRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;
    const radius = 98;
    const slotRadius = 15;

    // Track
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < RING_SIZE; i++) {
      const angle = (i / RING_SIZE) * Math.PI * 2 - Math.PI / 2;
      const slotX = centerX + Math.cos(angle) * radius;
      const slotY = centerY + Math.sin(angle) * radius;

      const isOccupied = ringBuffer.buffer[i] !== null;
      const isHead = (i === (ringBuffer.head & (RING_SIZE - 1)));
      const isTail = (i === (ringBuffer.tail & (RING_SIZE - 1)));

      ctx.fillStyle = isOccupied ? 'rgba(0, 255, 157, 0.2)' : 'rgba(8, 14, 30, 0.9)';
      ctx.strokeStyle = isOccupied ? '#00ff9d' : 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(slotX, slotY, slotRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = '10px monospace';
      ctx.fillStyle = isOccupied ? '#fff' : '#64748b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const text = isOccupied ? ringBuffer.buffer[i] : i.toString();
      ctx.fillText(text, slotX, slotY);

      if (isHead) {
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        const pX = centerX + Math.cos(angle) * (radius + 25);
        const pY = centerY + Math.sin(angle) * (radius + 25);
        ctx.arc(pX, pY, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (isTail) {
        ctx.fillStyle = '#ffb703';
        ctx.beginPath();
        const pX = centerX + Math.cos(angle) * (radius - 25);
        const pY = centerY + Math.sin(angle) * (radius - 25);
        ctx.arc(pX, pY, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const count = (ringBuffer.head - ringBuffer.tail);
    ctx.font = 'bold 19px monospace';
    ctx.fillStyle = count === RING_SIZE ? '#ff3366' : '#00f0ff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${count}/${RING_SIZE}`, centerX, centerY - 6);

    ctx.font = '9px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('OCCUPANCY', centerX, centerY + 14);

    const headEl = document.getElementById('ring-head-val');
    const tailEl = document.getElementById('ring-tail-val');
    const countEl = document.getElementById('ring-count-val');
    const overrunEl = document.getElementById('ring-overrun-val');
    if (headEl) headEl.textContent = `0x${(ringBuffer.head & 0xFF).toString(16).toUpperCase()}`;
    if (tailEl) tailEl.textContent = `0x${(ringBuffer.tail & 0xFF).toString(16).toUpperCase()}`;
    if (countEl) countEl.textContent = count;
    if (overrunEl) overrunEl.textContent = ringBuffer.overrunCount;
  }

  window.ringPushByte = function () {
    const currentCount = ringBuffer.head - ringBuffer.tail;
    if (currentCount >= RING_SIZE) {
      ringBuffer.overrunCount++;
      window.playUiSound('alert');
      renderRingCanvas();
      return;
    }
    window.playUiSound('click');
    const idx = ringBuffer.head & (RING_SIZE - 1);
    const char = String.fromCharCode(ringBuffer.byteSeq);
    ringBuffer.byteSeq = ringBuffer.byteSeq >= 0x5A ? 0x41 : ringBuffer.byteSeq + 1;
    ringBuffer.buffer[idx] = char;
    ringBuffer.head++;
    renderRingCanvas();
  };

  window.ringPopByte = function () {
    const currentCount = ringBuffer.head - ringBuffer.tail;
    if (currentCount <= 0) return;
    window.playUiSound('click');
    const idx = ringBuffer.tail & (RING_SIZE - 1);
    ringBuffer.buffer[idx] = null;
    ringBuffer.tail++;
    renderRingCanvas();
  };

  window.ringBurstPush = function () {
    window.playUiSound('packet');
    for (let i = 0; i < 4; i++) {
      const currentCount = ringBuffer.head - ringBuffer.tail;
      if (currentCount < RING_SIZE) {
        const idx = ringBuffer.head & (RING_SIZE - 1);
        ringBuffer.buffer[idx] = String.fromCharCode(ringBuffer.byteSeq);
        ringBuffer.byteSeq = ringBuffer.byteSeq >= 0x5A ? 0x41 : ringBuffer.byteSeq + 1;
        ringBuffer.head++;
      } else {
        ringBuffer.overrunCount++;
      }
    }
    renderRingCanvas();
  };

  window.ringReset = function () {
    window.playUiSound('click');
    ringBuffer.buffer.fill(null);
    ringBuffer.head = 0;
    ringBuffer.tail = 0;
    ringBuffer.overrunCount = 0;
    ringBuffer.byteSeq = 0x41;
    renderRingCanvas();
  };

  /* =============================================================
     3. SATELLITE RF OSCILLOSCOPE (GMSK / GFSK / CW / AX.25 / G3RUH)
     ============================================================= */
  let currentModulation = 'gmsk';
  let scopeCanvas, scopeCtx;
  let scopePhase = 0;
  let cwAudioOsc = null;
  let isAudioEnabled = false;

  const CW_MORSE_PATTERN = [
    1,0,1,0,1,0,0,0,
    1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,
    1,0,1,0,1,0,0,0,0,0,0,0,
    1,0,1,1,1,0,1,1,1,0,1,0,0,0,
    1,0,1,1,1,0,1,0,0,0,
    1,0,0,0,
    1,1,1,0,1,1,1,0,0,0,0,0,0,0
  ];

  function renderScopeWaveform() {
    if (!scopeCanvas) {
      scopeCanvas = document.getElementById('rf-oscilloscope-canvas');
      if (!scopeCanvas) return;
      scopeCtx = scopeCanvas.getContext('2d');
    }

    const w = scopeCanvas.width = scopeCanvas.clientWidth;
    const h = scopeCanvas.height = 250;
    scopeCtx.clearRect(0, 0, w, h);

    const centerY = h / 2;
    scopePhase += 0.08;

    scopeCtx.lineWidth = 2.6;
    scopeCtx.shadowBlur = 10;

    if (currentModulation === 'gmsk') {
      scopeCtx.strokeStyle = '#00f0ff';
      scopeCtx.shadowColor = '#00f0ff';
      scopeCtx.beginPath();
      for (let x = 0; x < w; x++) {
        const symbolIdx = Math.floor((x + scopePhase * 25) / 50);
        const bit = ((symbolIdx * 7 + 3) % 5 > 2) ? 1 : -1;
        const freqMod = 0.05 + bit * 0.025 * Math.sin((x + scopePhase * 20) * 0.02);
        const y = centerY + Math.sin(x * freqMod + scopePhase) * 65;
        if (x === 0) scopeCtx.moveTo(x, y);
        else scopeCtx.lineTo(x, y);
      }
      scopeCtx.stroke();

    } else if (currentModulation === 'gfsk') {
      scopeCtx.strokeStyle = '#00ff9d';
      scopeCtx.shadowColor = '#00ff9d';
      scopeCtx.beginPath();
      for (let x = 0; x < w; x++) {
        const bit = Math.sin((x + scopePhase * 30) * 0.03) > 0 ? 1 : -1;
        const freq = 0.06 + bit * 0.03;
        const y = centerY + Math.sin(x * freq + scopePhase * 2) * 65;
        if (x === 0) scopeCtx.moveTo(x, y);
        else scopeCtx.lineTo(x, y);
      }
      scopeCtx.stroke();

    } else if (currentModulation === 'cw') {
      scopeCtx.strokeStyle = '#ffb703';
      scopeCtx.shadowColor = '#ffb703';
      const patternIdx = Math.floor((scopePhase * 4) % CW_MORSE_PATTERN.length);
      const isKeyed = CW_MORSE_PATTERN[patternIdx] === 1;

      scopeCtx.beginPath();
      for (let x = 0; x < w; x++) {
        const localKeyed = (x < w * 0.7) ? isKeyed : (Math.sin((x + scopePhase * 10) * 0.05) > 0);
        const amp = localKeyed ? 65 : 4;
        const y = centerY + Math.sin(x * 0.12 + scopePhase * 3) * amp;
        if (x === 0) scopeCtx.moveTo(x, y);
        else scopeCtx.lineTo(x, y);
      }
      scopeCtx.stroke();

    } else if (currentModulation === 'ax25') {
      scopeCtx.strokeStyle = '#c77dff';
      scopeCtx.shadowColor = '#c77dff';
      scopeCtx.beginPath();
      for (let x = 0; x < w; x++) {
        const bytePhase = Math.floor((x + scopePhase * 30) / 40);
        const isMark = (bytePhase % 2 === 0);
        const toneFreq = isMark ? 0.04 : 0.08;
        const y = centerY + Math.sin(x * toneFreq + scopePhase * 2) * 65;
        if (x === 0) scopeCtx.moveTo(x, y);
        else scopeCtx.lineTo(x, y);
      }
      scopeCtx.stroke();

    } else if (currentModulation === 'g3ruh') {
      scopeCtx.strokeStyle = '#00f0ff';
      scopeCtx.shadowColor = '#00f0ff';
      scopeCtx.beginPath();
      for (let x = 0; x < w; x++) {
        const pseudoRand = Math.sin(x * 0.04 + scopePhase) * Math.cos(x * 0.07 - scopePhase);
        const y = centerY + pseudoRand * 65;
        if (x === 0) scopeCtx.moveTo(x, y);
        else scopeCtx.lineTo(x, y);
      }
      scopeCtx.stroke();
    }

    scopeCtx.shadowBlur = 0;
    requestAnimationFrame(renderScopeWaveform);
  }

  window.setRfModulation = function (mode) {
    window.playUiSound('click');
    currentModulation = mode;
    document.querySelectorAll('.rf-mod-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-mod') === mode);
    });

    const readoutModEl = document.getElementById('scope-readout-mod');
    const readoutFreqEl = document.getElementById('scope-readout-freq');
    const readoutBaudEl = document.getElementById('scope-readout-baud');

    if (mode === 'gmsk') {
      if (readoutModEl) readoutModEl.textContent = 'MOD: GMSK (BT=0.5)';
      if (readoutFreqEl) readoutFreqEl.textContent = 'FREQ: 437.375 MHz';
      if (readoutBaudEl) readoutBaudEl.textContent = 'RATE: 9600 BAUD';
    } else if (mode === 'gfsk') {
      if (readoutModEl) readoutModEl.textContent = 'MOD: GFSK (h=0.5)';
      if (readoutFreqEl) readoutFreqEl.textContent = 'FREQ: 436.500 MHz';
      if (readoutBaudEl) readoutBaudEl.textContent = 'RATE: 4800 BAUD';
    } else if (mode === 'cw') {
      if (readoutModEl) readoutModEl.textContent = 'MOD: CW BEACON (A1A)';
      if (readoutFreqEl) readoutFreqEl.textContent = 'FREQ: 437.050 MHz';
      if (readoutBaudEl) readoutBaudEl.textContent = 'WPM: 20 WPM';
    } else if (mode === 'ax25') {
      if (readoutModEl) readoutModEl.textContent = 'PROTOCOL: AX.25 UI-FRAME';
      if (readoutFreqEl) readoutFreqEl.textContent = 'BELL-202: 1200/2200Hz';
      if (readoutBaudEl) readoutBaudEl.textContent = 'FRAME: HDLC + CRC16';
    } else if (mode === 'g3ruh') {
      if (readoutModEl) readoutModEl.textContent = 'SCRAMBLER: G3RUH (1+X^12+X^17)';
      if (readoutFreqEl) readoutFreqEl.textContent = 'WHITENING: ACTIVE';
      if (readoutBaudEl) readoutBaudEl.textContent = 'RATE: 9600 / 19200';
    }
  };

  window.toggleCwAudio = function () {
    isAudioEnabled = !isAudioEnabled;
    const btn = document.getElementById('cw-audio-btn');
    if (!btn) return;

    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (isAudioEnabled) {
      btn.textContent = 'MUTE CW AUDIO';
      btn.classList.add('btn-emerald');
      playMorseBeepLoop();
    } else {
      btn.textContent = 'TEST CW AUDIO BEEP (WEB AUDIO)';
      btn.classList.remove('btn-emerald');
      if (cwAudioOsc) {
        try { cwAudioOsc.stop(); } catch (e) {}
        cwAudioOsc = null;
      }
    }
  };

  function playMorseBeepLoop() {
    if (!isAudioEnabled || !audioCtx) return;
    try {
      cwAudioOsc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      cwAudioOsc.type = 'sine';
      cwAudioOsc.frequency.setValueAtTime(800, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);

      cwAudioOsc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      cwAudioOsc.start();
      cwAudioOsc.stop(audioCtx.currentTime + 0.12);

      if (isAudioEnabled) {
        setTimeout(playMorseBeepLoop, 400);
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /* =============================================================
     4. TINY TAPEOUT RISC-V SILICON ASIC SIMULATION
     ============================================================= */
  const riscvProgram = [
    { pc: '0x00', asm: 'ADDI x1, x0, 5', stage: 'WB' },
    { pc: '0x04', asm: 'ADDI x2, x0, 10', stage: 'MEM' },
    { pc: '0x08', asm: 'ADD x3, x1, x2', stage: 'EX' },
    { pc: '0x0C', asm: 'SW x3, 0(x0)', stage: 'ID' },
    { pc: '0x10', asm: 'LW x4, 0(x0)', stage: 'IF' }
  ];

  let riscvCycle = 0;
  const registers = { x0: 0, x1: 5, x2: 10, x3: 15, x4: 0, x5: 0, x6: 0, x7: 0 };

  window.stepRiscvPipeline = function () {
    window.playUiSound('click');
    riscvCycle++;
    const stageBoxes = document.querySelectorAll('.pipeline-stage-box');
    stageBoxes.forEach((box, i) => {
      const progIdx = (riscvCycle + i) % riscvProgram.length;
      const inst = riscvProgram[progIdx];
      const instEl = box.querySelector('.stage-inst');
      if (instEl) instEl.textContent = inst.asm;
      box.classList.toggle('active-stage', (riscvCycle % 5) === i);
    });

    const targetReg = `x${(riscvCycle % 7) + 1}`;
    registers[targetReg] = (registers[targetReg] + 3) & 0xFF;
    const regEl = document.getElementById(`reg-${targetReg}`);
    if (regEl) {
      regEl.textContent = `0x${registers[targetReg].toString(16).padStart(2, '0').toUpperCase()}`;
      regEl.parentElement.classList.add('changed');
      setTimeout(() => regEl.parentElement.classList.remove('changed'), 600);
    }

    const pcEl = document.getElementById('riscv-pc-val');
    const aluEl = document.getElementById('riscv-alu-val');
    if (pcEl) pcEl.textContent = `0x${(0x1000 + riscvCycle * 4).toString(16).toUpperCase()}`;
    if (aluEl) aluEl.textContent = `0x${(riscvCycle * 7 + 15).toString(16).toUpperCase()}`;
  };

  /* =============================================================
     5. LITTLEFS FAIL-SAFE FLASH STORAGE SIMULATION
     ============================================================= */
  const flashBlocks = [
    { id: 0, type: 'SUPERBLOCK', rev: 14, status: 'VALID' },
    { id: 1, type: 'SUPERBLOCK_MIRROR', rev: 14, status: 'VALID' },
    { id: 2, type: 'DIR_METADATA_0', rev: 92, status: 'VALID' },
    { id: 3, type: 'DIR_METADATA_1', rev: 93, status: 'ACTIVE_HEAD' },
    { id: 4, type: 'LOG_CHUNK_0', rev: 48, status: 'COMMITTED' },
    { id: 5, type: 'LOG_CHUNK_1', rev: 49, status: 'COMMITTED' },
    { id: 6, type: 'LOOKAHEAD_BUF', rev: 0, status: 'ERASED' },
    { id: 7, type: 'FREE_BLOCK', rev: 0, status: 'READY' }
  ];

  function renderFlashBlocks() {
    const grid = document.getElementById('flash-blocks-grid');
    if (!grid) return;
    grid.innerHTML = '';

    flashBlocks.forEach((blk) => {
      const card = document.createElement('div');
      card.className = `flash-block-card ${blk.status === 'CORRUPTED' ? 'corrupted' : blk.status === 'WRITING' ? 'writing' : 'valid'}`;
      card.innerHTML = `
        <div class="block-idx">
          <span>BLK #${blk.id}</span>
          <span>REV: ${blk.rev}</span>
        </div>
        <div class="block-rev">${blk.type}</div>
        <div class="block-status">${blk.status}</div>
      `;
      grid.appendChild(card);
    });
  }

  window.littlefsWriteChunk = function () {
    window.playUiSound('packet');
    const target = flashBlocks[5];
    target.status = 'WRITING';
    renderFlashBlocks();

    setTimeout(() => {
      target.rev++;
      target.status = 'COMMITTED (CRC32_OK)';
      renderFlashBlocks();
      window.playUiSound('success');
    }, 600);
  };

  window.littlefsSimulatePowerLoss = function () {
    window.playUiSound('alert');
    const target = flashBlocks[5];
    target.status = 'CORRUPTED';
    const statusMsg = document.getElementById('littlefs-status-msg');
    if (statusMsg) {
      statusMsg.textContent = 'POWER LOSS DETECTED! Block 5 write aborted mid-sequence.';
      statusMsg.style.color = '#ff3366';
    }
    renderFlashBlocks();
  };

  window.littlefsMountRecover = function () {
    window.playUiSound('click');
    const target = flashBlocks[5];
    const statusMsg = document.getElementById('littlefs-status-msg');
    if (statusMsg) {
      statusMsg.textContent = 'MOUNTING: Replaying atomic transaction tree... Rollback uncommitted block!';
      statusMsg.style.color = '#00f0ff';
    }

    setTimeout(() => {
      target.status = 'RECOVERED (ROLLED BACK)';
      target.rev--;
      if (statusMsg) {
        statusMsg.textContent = 'LITTLEFS RECOVERY COMPLETE: Zero filesystem corruption detected!';
        statusMsg.style.color = '#00ff9d';
      }
      renderFlashBlocks();
      window.playUiSound('success');
    }, 1000);
  };

  /* =============================================================
     INITIALIZATION & TAB SWITCHING
     ============================================================= */
  document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.lab-tab-btn');
    const panels = document.querySelectorAll('.lab-panel');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        window.playUiSound('click');
        const targetLab = btn.getAttribute('data-lab');
        tabBtns.forEach((b) => b.classList.remove('active'));
        panels.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(`lab-panel-${targetLab}`);
        if (targetPanel) targetPanel.classList.add('active');

        if (targetLab === 'ring') renderRingCanvas();
        if (targetLab === 'littlefs') renderFlashBlocks();
      });
    });

    renderRingCanvas();
    renderFlashBlocks();
    renderScopeWaveform();
  });
})();
