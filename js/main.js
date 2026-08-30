/**
 * Main Application Controller
 * Manages navigation, interactive terminal, photo lightbox, and interactive triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* -------------------------------------------------------------
     1. STICKY NAVBAR & ACTIVE SECTION SPY
     ------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile drawer toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  /* -------------------------------------------------------------
     2. PHOTO LIGHTBOX MODAL
     ------------------------------------------------------------- */
  const modalBackdrop = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDesc = document.getElementById('lightbox-desc');
  const modalCloseBtn = document.getElementById('lightbox-close');

  window.openLightbox = function (src, title, description) {
    if (!modalBackdrop || !modalImg) return;
    modalImg.src = src;
    if (modalTitle) modalTitle.textContent = title || 'Project Asset';
    if (modalDesc) modalDesc.textContent = description || '';
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeLightbox() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeLightbox);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* -------------------------------------------------------------
     3. INTERACTIVE CLI TERMINAL
     ------------------------------------------------------------- */
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');

  const COMMANDS = {
    help: `Available commands:
  <span class="prompt-path">whoami</span>      - Overview of Prem Bahadur Rana
  <span class="prompt-path">missions</span>    - Satellite projects (Slippers2Sat, EPDM, Dharan)
  <span class="prompt-path">chip</span>        - Tiny Tapeout RISC-V RV32I ASIC specifications
  <span class="prompt-path">stm32</span>       - Dual-core Cortex-M7/M4 IPCC architecture
  <span class="prompt-path">rf</span>          - GMSK, GFSK, CW beacon, AX.25, G3RUH scrambler
  <span class="prompt-path">papers</span>      - ResearchGate published papers
  <span class="prompt-path">contact</span>     - Direct email and social networks
  <span class="prompt-path">clear</span>       - Clear the terminal console`,

    whoami: `Prem Bahadur Rana:
  - Electronics & Communication Engineer | Satellite Research Fellow
  - Affiliation: Antarikchya Pratisthan Nepal (APN), Space System Lab (SSL)
  - Specialization: RISC-V Hardware Design, CubeSat Avionics, RF Modems, Embedded Systems`,

    missions: `Space & Satellite Initiatives:
  1. <span class="prompt-user">Slippers2Sat (S2S)</span>: 1U CubeSat for Chepang/Tamang/Dalit middle school training (Launch Q2 2025).
  2. <span class="prompt-user">Earthquake Precursor Mission (EPDM)</span>: 1U boomless Quad-Mag + UBSS noise removal for ULF/ELF sensing.
  3. <span class="prompt-user">Thin-Shell Calibration</span>: 9-parameter magnetometer calibration verified with IGRF model.
  4. <span class="prompt-user">Dharan Bootcamp</span>: 4-day hands-on STEM CubeSat training.`,

    chip: `Tiny Tapeout RISC-V Silicon ASIC:
  - Architecture: RV32I / RV32E custom core in Verilog HDL
  - Shuttle: SkyWater SKY130 / IHP 130nm open-source silicon shuttle
  - Toolchain: OpenLane RTL-to-GDSII, Yosys synthesis, OpenROAD P&R, Magic DRC/LVS, Cocotb testbenches`,

    stm32: `STM32 Dual-Core IPCC & Ring Buffer:
  - Cores: Cortex-M7 (Real-time DSP) + Cortex-M4 (Telemetry & LittleFS)
  - Interconnect: IPCC Mailbox channels, Hardware Semaphores (HSEM), Shared SRAM (D2/D3 domain)
  - Memory Coherency: SCB_CleanDCache_by_Addr & SCB_InvalidateDCache_by_Addr`,

    rf: `Aerospace RF Telecommunications:
  - Downlink Modulation: GMSK (BT=0.5), GFSK (h=0.5), CW Morse Beacon (A1A)
  - Packet Radio: AX.25 UI Frame (HDLC 0x7E flag, bit stuffing, CRC16-CCITT)
  - Telemetry Scrambler: G3RUH polynomial 1 + x^12 + x^17 for spectral whitening`,

    papers: `Academic Research Publications:
  1. Comparative Study of Object Detection Models for Fresh and Rotten Apples and Tomatoes: Faster R-CNN, DETR, YOLOv8, and YOLOv12S (2025)
  2. Recognition and Separation of Fresh and Rotten Fruits using YOLO Algorithm on Conveyor System (2023)`,

    contact: `Connect with Prem:
  - Email: <a href="mailto:prembdrana999@gmail.com" target="_blank">prembdrana999@gmail.com</a>
  - GitHub: <a href="https://github.com/PrmBRana" target="_blank">github.com/PrmBRana</a>
  - LinkedIn: <a href="https://linkedin.com/in/prem-bahadur-r-a9726a176" target="_blank">prem-bahadur-r-a9726a176</a>
  - ResearchGate: <a href="https://www.researchgate.net/profile/Prem-Bahadur-Rana" target="_blank">Prem-Bahadur-Rana</a>`,

    clear: 'CLEAR_ACTION'
  };

  if (terminalInput && terminalBody) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawCmd = terminalInput.value.trim();
        const cmd = rawCmd.toLowerCase();
        terminalInput.value = '';

        if (!rawCmd) return;

        if (cmd === 'clear') {
          terminalBody.innerHTML = `
            <div class="terminal-line" style="color: var(--text-muted);">
              Terminal cleared. Type <span class="prompt-path">'help'</span> for a list of available telemetry commands.
            </div>
          `;
          return;
        }

        // Echo command
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="prompt-user">prem@cubesat-obc</span>:<span class="prompt-path">~#</span> ${rawCmd}`;
        terminalBody.appendChild(line);

        // Print response
        const respLine = document.createElement('div');
        respLine.className = 'terminal-line';
        if (COMMANDS[cmd]) {
          respLine.innerHTML = `<pre style="white-space: pre-wrap; color: #cbd5e1; font-family: var(--font-mono);">${COMMANDS[cmd]}</pre>`;
        } else {
          respLine.innerHTML = `<span style="color: var(--accent-crimson);">Command not recognized: '${rawCmd}'. Type 'help' for valid commands.</span>`;
        }
        terminalBody.appendChild(respLine);

        // Auto scroll
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    });
  }

  /* -------------------------------------------------------------
     4. PROJECT FILTERING TABS
     ------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.filterable-project');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach((card) => {
        if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
