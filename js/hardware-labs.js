/**
 * Interactive Hardware & Silicon Engineering Labs
 * Deep-dive simulations for:
 * 1. STM32 Dual-Core IPCC & Shared SRAM Mailbox
 * 2. Lock-Free Circular Ring Buffer with Memory Barriers
 * 3. Satellite RF Oscilloscope (GMSK, GFSK, CW Morse, AX.25 HDLC, G3RUH Scrambler)
 * 4. Tiny Tapeout RISC-V 5-Stage Pipeline
 * 5. LittleFS Fail-Safe Flash Memory & Crash Recovery
 */

(function () {
  'use strict';

  /* =============================================================
     1. STM32 DUAL-CORE IPCC SIMULATION
     ============================================================= */
  const ipcc = {
    c1State: 'IDLE',
    c2State: 'LISTENING',
    mailboxChannel1: 0, // 0 = free, 1 = occupied
    sharedSramAddress: '0x38000400',
    currentPacketId: 1042,
    packetTypes: [
      { cmd: 'CMD_TELEMETRY_LOG', payload: '[OBC] BATT=4.12V | CURR=380mA | TEMP=18.4C' },
      { cmd: 'CMD_ATTITUDE_UPDATE', payload: '[ADCS] Q=[0.707, 0.0, 0.707, 0.0] | B_NORM=42.1uT' },
      { cmd: 'CMD_RF_DOWNLINK_BURST', payload: '[COMMS] AX.25 UI_FRAME LEN=64 | GMSK_9600' },
      { cmd: 'CMD_EPDM_MAG_SAMPLE', payload: '[QUAD_MAG] RM3100[0..3] DELTA_B=1.42nT' }
    ],
    packetIndex: 0
  };

  window.dispatchIpccPacket = function () {
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

    // Step 1: Core 1 (Cortex-M7) writes to shared SRAM & cleans D-Cache
    c1El.classList.add('active-tx');
    c1StatusEl.textContent = 'D-CACHE CLEAN & WRITE SRAM';
    c1StatusEl.style.color = '#00f0ff';
    if (sramPayloadEl) {
      sramPayloadEl.textContent = `${packet.cmd} -> ${packet.payload}`;
      sramPayloadEl.style.borderColor = '#00f0ff';
    }
    if (regC1SCREl) regC1SCREl.textContent = '0x0001 (TXF)';

    // Step 2: Trigger IPCC Interrupt via hardware bus
    setTimeout(() => {
      busEl.classList.add('transmitting');
      c1StatusEl.textContent = 'NOTIFYING IPCC CH1 IRQ';
      if (regC1MREl) regC1MREl.textContent = '0x0000 (UNMASKED)';
    }, 400);

    // Step 3: Core 2 (Cortex-M4) receives IPCC RX interrupt & invalidates D-Cache
    setTimeout(() => {
      c2El.classList.add('active-rx');
      c2StatusEl.textContent = 'IRQ TRIGGERED -> D-CACHE INVALIDATE';
      c2StatusEl.style.color = '#00ff9d';
      if (regC2TOC1El) regC2TOC1El.textContent = '0x0001 (RXO)';
    }, 900);

    // Step 4: Core 2 processes and acknowledges
    setTimeout(() => {
      c2StatusEl.textContent = 'PACKET CONSUMED -> ACK CLEAR';
      if (regC1SCREl) regC1SCREl.textContent = '0x0000 (CLEARED)';
      if (regC2TOC1El) regC2TOC1El.textContent = '0x0000 (ACK_OK)';
    }, 1500);

    // Reset back to idle
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
  const RING_SIZE = 16; // Power of 2 for fast masking (index & (SIZE - 1))
  const ringBuffer = {
    buffer: new Array(RING_SIZE).fill(null),
    head: 0, // Producer write pointer
    tail: 0, // Consumer read pointer
    overrunCount: 0,
    byteSeq: 0x41 // ASCII 'A'
  };

  function renderRingCanvas() {
    const canvas = document.getElementById('ring-buffer-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 300;
    const h = canvas.height = 260;
    ctx.clearRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;
    const radius = 95;
    const slotRadius = 14;

    // Draw central circular track
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw slots
    for (let i = 0; i < RING_SIZE; i++) {
      const angle = (i / RING_SIZE) * Math.PI * 2 - Math.PI / 2;
      const slotX = centerX + Math.cos(angle) * radius;
      const slotY = centerY + Math.sin(angle) * radius;

      const isOccupied = ringBuffer.buffer[i] !== null;
      const isHead = (i === (ringBuffer.head & (RING_SIZE - 1)));
      const isTail = (i === (ringBuffer.tail & (RING_SIZE - 1)));

      // Slot circle
      ctx.fillStyle = isOccupied ? 'rgba(0, 255, 157, 0.18)' : 'rgba(11, 18, 36, 0.9)';
      ctx.strokeStyle = isOccupied ? '#00ff9d' : 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(slotX, slotY, slotRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Slot index text
      ctx.font = '10px monospace';
      ctx.fillStyle = isOccupied ? '#fff' : '#64748b';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const text = isOccupied ? ringBuffer.buffer[i] : i.toString();
      ctx.fillText(text, slotX, slotY);

      // Head pointer indicator (Producer / DMA)
      if (isHead) {
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        const pX = centerX + Math.cos(angle) * (radius + 24);
        const pY = centerY + Math.sin(angle) * (radius + 24);
        ctx.arc(pX, pY, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tail pointer indicator (Consumer / Main Task)
      if (isTail) {
        ctx.fillStyle = '#ffb703';
        ctx.beginPath();
        const pX = centerX + Math.cos(angle) * (radius - 24);
        const pY = centerY + Math.sin(angle) * (radius - 24);
        ctx.arc(pX, pY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Center HUD readout
    const count = (ringBuffer.head - ringBuffer.tail);
    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = count === RING_SIZE ? '#ff3366' : '#00f0ff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${count}/${RING_SIZE}`, centerX, centerY - 6);

    ctx.font = '9px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('OCCUPANCY', centerX, centerY + 14);

    // Update stat DOM elements
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
      renderRingCanvas();
      return;
    }
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
    const idx = ringBuffer.tail & (RING_SIZE - 1);
    ringBuffer.buffer[idx] = null;
    ringBuffer.tail++;
    renderRingCanvas();
  };

  window.ringBurstPush = function () {
    for (let i = 0; i < 4; i++) {
      window.ringPushByte();
    }
  };

  window.ringReset = function () {
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
  let currentModulation = 'gmsk'; // 'gmsk', 'gfsk', 'cw', 'ax25', 'g3ruh'
  let scopeCanvas, scopeCtx;
  let scopePhase = 0;
  let audioCtx = null;
  let cwAudioOsc = null;
  let isAudioEnabled = false;

  // CW Morse code definition for "S2S PREM"
  const CW_MORSE_PATTERN = [
    // S (...)
    1,0,1,0,1,0,0,0,
    // 2 (..---)
    1,0,1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,
    // S (...)
    1,0,1,0,1,0,0,0,0,0,0,0,
    // P (.--.)
    1,0,1,1,1,0,1,1,1,0,1,0,0,0,
    // R (.-.)
    1,0,1,1,1,0,1,0,0,0,
    // E (.)
    1,0,0,0,
    // M (--)
    1,1,1,0,1,1,1,0,0,0,0,0,0,0
  ];

  // G3RUH Scrambler polynomial: 1 + x^12 + x^17
  let g3ruhShiftReg = 0x1FFFF; // 17-bit register
  function g3ruhStep(inBit) {
    const bit12 = (g3ruhShiftReg >> 11) & 1;
    const bit17 = (g3ruhShiftReg >> 16) & 1;
    const feedback = inBit ^ bit12 ^ bit17;
    g3ruhShiftReg = ((g3ruhShiftReg << 1) | feedback) & 0x1FFFF;
    return feedback;
  }

  function renderScopeWaveform() {
    if (!scopeCanvas) {
      scopeCanvas = document.getElementById('rf-oscilloscope-canvas');
      if (!scopeCanvas) return;
      scopeCtx = scopeCanvas.getContext('2d');
    }

    const w = scopeCanvas.width = scopeCanvas.clientWidth;
    const h = scopeCanvas.height = 240;
    scopeCtx.clearRect(0, 0, w, h);

    const centerY = h / 2;
    scopePhase += 0.08;

    scopeCtx.lineWidth = 2.5;
    scopeCtx.shadowBlur = 10;

    if (currentModulation === 'gmsk') {
      // Gaussian Minimum Shift Keying: Continuous phase, smooth frequency transitions
      scopeCtx.strokeStyle = '#00f0ff';
      scopeCtx.shadowColor = '#00f0ff';
      scopeCtx.beginPath();
      for (let x = 0; x < w; x++) {
        const symbolIdx = Math.floor((x + scopePhase * 25) / 50);
        // Bitstream pattern
        const bit = ((symbolIdx * 7 + 3) % 5 > 2) ? 1 : -1;
        const freqMod = 0.05 + bit * 0.025 * Math.sin((x + scopePhase * 20) * 0.02);
        const y = centerY + Math.sin(x * freqMod + scopePhase) * 65;
        if (x === 0) scopeCtx.moveTo(x, y);
        else scopeCtx.lineTo(x, y);
      }
      scopeCtx.stroke();

    } else if (currentModulation === 'gfsk') {
      // Gaussian Frequency Shift Keying
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
      // Continuous Wave (Morse Beacon) On/Off Keying
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
      // AX.25 NRZI square-wave framing + 1200/2200 Bell 202 AFSK audio tones
      scopeCtx.strokeStyle = '#c77dff';
      scopeCtx.shadowColor = '#c77dff';
      scopeCtx.beginPath();
      for (let x = 0; x < w; x++) {
        const bytePhase = Math.floor((x + scopePhase * 30) / 40);
        const isMark = (bytePhase % 2 === 0);
        const toneFreq = isMark ? 0.04 : 0.08; // 1200Hz Mark vs 2200Hz Space
        const y = centerY + Math.sin(x * toneFreq + scopePhase * 2) * 65;
        if (x === 0) scopeCtx.moveTo(x, y);
        else scopeCtx.lineTo(x, y);
      }
      scopeCtx.stroke();

    } else if (currentModulation === 'g3ruh') {
      // G3RUH 9600 Scrambler: NRZ Whitened Data Spectrum
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

    if (!audioCtx && window.AudioContext) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (isAudioEnabled) {
      btn.textContent = 'MUTE CW AUDIO';
      btn.classList.add('btn-emerald');
      playMorseBeepLoop();
    } else {
      btn.textContent = 'TEST CW AUDIO BEEP';
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
      cwAudioOsc.frequency.setValueAtTime(800, audioCtx.currentTime); // 800 Hz CW pitch

      // Beep 100ms
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
    { pc: '0x00', asm: 'ADDI x1, x0, 5', stage: 'WB', reg: 1, val: 5 },
    { pc: '0x04', asm: 'ADDI x2, x0, 10', stage: 'MEM', reg: 2, val: 10 },
    { pc: '0x08', asm: 'ADD x3, x1, x2', stage: 'EX', reg: 3, val: 15 },
    { pc: '0x0C', asm: 'SW x3, 0(x0)', stage: 'ID', reg: null, val: null },
    { pc: '0x10', asm: 'LW x4, 0(x0)', stage: 'IF', reg: 4, val: 15 }
  ];

  let riscvCycle = 0;
  const registers = { x0: 0, x1: 5, x2: 10, x3: 15, x4: 0, x5: 0, x6: 0, x7: 0 };

  window.stepRiscvPipeline = function () {
    riscvCycle++;
    const stageBoxes = document.querySelectorAll('.pipeline-stage-box');
    stageBoxes.forEach((box, i) => {
      const progIdx = (riscvCycle + i) % riscvProgram.length;
      const inst = riscvProgram[progIdx];
      const instEl = box.querySelector('.stage-inst');
      if (instEl) instEl.textContent = inst.asm;
      box.classList.toggle('active-stage', (riscvCycle % 5) === i);
    });

    // Update a register value
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
    { id: 0, type: 'SUPERBLOCK', rev: 12, status: 'VALID' },
    { id: 1, type: 'SUPERBLOCK_MIRROR', rev: 12, status: 'VALID' },
    { id: 2, type: 'DIR_METADATA_0', rev: 84, status: 'VALID' },
    { id: 3, type: 'DIR_METADATA_1', rev: 85, status: 'ACTIVE_HEAD' },
    { id: 4, type: 'LOG_CHUNK_0', rev: 41, status: 'COMMITTED' },
    { id: 5, type: 'LOG_CHUNK_1', rev: 42, status: 'COMMITTED' },
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
    const target = flashBlocks[5];
    target.status = 'WRITING';
    renderFlashBlocks();

    setTimeout(() => {
      target.rev++;
      target.status = 'COMMITTED (CRC32_OK)';
      renderFlashBlocks();
    }, 600);
  };

  window.littlefsSimulatePowerLoss = function () {
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
    }, 1000);
  };

  /* =============================================================
     INITIALIZATION & TAB SWITCHING
     ============================================================= */
  document.addEventListener('DOMContentLoaded', () => {
    // Lab tab switcher
    const tabBtns = document.querySelectorAll('.lab-tab-btn');
    const panels = document.querySelectorAll('.lab-panel');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetLab = btn.getAttribute('data-lab');
        tabBtns.forEach((b) => b.classList.remove('active'));
        panels.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(`lab-panel-${targetLab}`);
        if (targetPanel) targetPanel.classList.add('active');

        // Re-render canvases if needed
        if (targetLab === 'ring') renderRingCanvas();
        if (targetLab === 'littlefs') renderFlashBlocks();
      });
    });

    // Initial renders
    renderRingCanvas();
    renderFlashBlocks();
    renderScopeWaveform();
  });
})();
