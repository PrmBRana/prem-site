/**
 * Main Application Controller 2.0
 * Manages navigation, interactive terminal with sound feedback, photo lightbox, and micro-interactions.
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

    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 130;
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

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      if (window.playUiSound) window.playUiSound('click');
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
    if (window.playUiSound) window.playUiSound('click');
    if (!modalBackdrop || !modalImg) return;
    modalImg.src = src;
    if (modalTitle) modalTitle.textContent = title || 'Project Asset';
    if (modalDesc) modalDesc.textContent = description || '';
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeLightbox() {
    if (!modalBackdrop) return;
    if (window.playUiSound) window.playUiSound('click');
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
     3. INTERACTIVE CLI TERMINAL 2.0
     ------------------------------------------------------------- */
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');

  const COMMANDS = {
    help: `Available commands:
  <span class="prompt-path">whoami</span>      - Overview of Prem Bahadur Rana
  <span class="prompt-path">missions</span>    - Slippers2Sat (Hunan Launch), EPDM, Dharan
  <span class="prompt-path">quadmag</span>     - Quad PNI RM3100 + MT25QL 1Gb Flash driver
  <span class="prompt-path">digipeater</span>  - IAC paper on On-Chip Disaster Digipeater
  <span class="prompt-path">chip</span>        - Tiny Tapeout RISC-V RV32I ASIC specifications
  <span class="prompt-path">stm32</span>       - Dual-core Cortex-M7/M4 IPCC architecture
  <span class="prompt-path">rf</span>          - GMSK, GFSK, CW beacon, AX.25, G3RUH scrambler
  <span class="prompt-path">github</span>      - GitHub profile (@PrmBRana, 51+ repositories)
  <span class="prompt-path">papers</span>      - ResearchGate & IAC published papers
  <span class="prompt-path">contact</span>     - Direct email and social links
  <span class="prompt-path">clear</span>       - Clear the terminal console`,

    whoami: `Prem Bahadur Rana:
  - Role: EPDM Mission Lead | Satellite Research Fellow | RISC-V Hardware Developer
  - Affiliation: Antarikchya Pratisthan Nepal (APN), Space System Lab (SSL)
  - Education: Bachelor in Electronics & Communication (Khwopa Engineering College)
  - Repositories: 51+ open-source hardware and software projects on GitHub`,

    missions: `Space & Satellite Initiatives:
  1. <span class="prompt-user">Slippers2Sat (S2S)</span>: 1U CubeSat launched from Hunan, China. Mentoring Chepang, Tamang & Dalit middle school students.
  2. <span class="prompt-user">Earthquake Precursor Mission (EPDM)</span>: Non-Boom Quad-Mag (4x PNI RM3100) + UBSS algorithm detecting seismo-magnetic waves.
  3. <span class="prompt-user">Thin-Shell Calibration</span>: 9-parameter magnetometer calibration verified with IGRF model.
  4. <span class="prompt-user">Dharan Bootcamp</span>: 4-day hands-on STEM CubeSat training and parachute drop testing.`,

    quadmag: `Non-Boom Quad-Mag Hardware Subsystem:
  - Sensors: 4x PNI RM3100 high-resolution geomagnetic sensors
  - Flash Memory: Micron MT25QL01GBBB (1Gb / 128MB Quad-SPI NOR Flash)
  - Controller: STM32F103 / STM32H7 via high-speed SPI bus
  - Algorithm: UBSS (Undetermined Blind Source Separation) to isolate true ambient Earth field without mechanical boom`,

    digipeater: `On-Chip Digipeater for Disaster Communication (IAC):
  - Authors: Prem Bahadur Rana, et al.
  - Platform: Slippers2Sat 1U CubeSat
  - Operation: Space-borne amateur radio packet repeater operating in remote Himalayan disaster scenarios without cellular infrastructure`,

    chip: `Tiny Tapeout RISC-V Silicon ASIC:
  - Architecture: RV32I / RV32E custom 5-stage pipelined core in Verilog HDL
  - Shuttle: SkyWater SKY130 open-source silicon shuttle
  - Toolchain: OpenLane / OpenROAD / Yosys RTL-to-GDSII, Magic DRC/LVS, Cocotb testbenches`,

    stm32: `STM32 Dual-Core IPCC & Ring Buffer:
  - Cores: Cortex-M7 (480MHz, DSP/ADCS) + Cortex-M4 (240MHz, Comms/LittleFS)
  - Interconnect: IPCC Mailbox channels, Hardware Semaphores (HSEM), Shared SRAM (D2/D3 domain)
  - Memory Coherency: SCB_CleanDCache_by_Addr & SCB_InvalidateDCache_by_Addr`,

    rf: `Aerospace RF Telecommunications:
  - Downlink Modulation: GMSK (BT=0.5), GFSK (h=0.5), CW Morse Beacon (A1A)
  - Packet Radio: AX.25 UI Frame (HDLC 0x7E flag, bit stuffing, CRC16-CCITT)
  - Telemetry Scrambler: G3RUH polynomial 1 + x^12 + x^17 for spectral whitening`,

    github: `GitHub Repositories (@PrmBRana - 51 repositories):
  - Quad_PNI_RM3100_STM32F103C8_MT25QL01GBBB_Flash: Flight SPI driver
  - RISC-V 5-Stage Core: Synthesizable Verilog pipeline
  - Rotten_And_Fresh_Fruits_Detection_And_Separation: Edge YOLO system
  - BMP180, ESP8266-NodeMCU_WiFi, Magnetometer drivers`,

    papers: `Peer-Reviewed & Conference Publications:
  1. Design and Demonstration of a Novel On-Chip Digipeater for Disaster Communication (IAC)
  2. Seismo-Electromagnetic Wave Detection using Non-Boom Quad-Mag on 1U CubeSat Slippers2Sat (IAC)
  3. Comparative Study of Object Detection Models for Fresh and Rotten Apples and Tomatoes (2025)
  4. Recognition and Separation of Fresh and Rotten Fruits using YOLO Algorithm (2023)`,

    contact: `Connect with Prem:
  - Email: <a href="mailto:prembdrana999@gmail.com" target="_blank">prembdrana999@gmail.com</a>
  - GitHub: <a href="https://github.com/PrmBRana" target="_blank">github.com/PrmBRana</a>
  - LinkedIn: <a href="https://linkedin.com/in/prem-bahadur-r-a9726a176" target="_blank">in/prem-bahadur-r-a9726a176</a>
  - ResearchGate: <a href="https://www.researchgate.net/profile/Prem-Bahadur-Rana" target="_blank">profile/Prem-Bahadur-Rana</a>`,

    clear: 'CLEAR_ACTION'
  };

  if (terminalInput && terminalBody) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawCmd = terminalInput.value.trim();
        const cmd = rawCmd.toLowerCase();
        terminalInput.value = '';

        if (!rawCmd) return;

        if (window.playUiSound) window.playUiSound('click');

        if (cmd === 'clear') {
          terminalBody.innerHTML = `
            <div class="terminal-line" style="color: var(--text-muted);">
              Terminal cleared. Type <span class="prompt-path">'help'</span> for a list of available telemetry commands.
            </div>
          `;
          return;
        }

        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="prompt-user">prem@cubesat-obc</span>:<span class="prompt-path">~#</span> ${rawCmd}`;
        terminalBody.appendChild(line);

        const respLine = document.createElement('div');
        respLine.className = 'terminal-line';
        if (COMMANDS[cmd]) {
          respLine.innerHTML = `<pre style="white-space: pre-wrap; color: #cbd5e1; font-family: var(--font-mono);">${COMMANDS[cmd]}</pre>`;
        } else {
          respLine.innerHTML = `<span style="color: var(--accent-crimson);">Command not recognized: '${rawCmd}'. Type 'help' for valid commands.</span>`;
        }
        terminalBody.appendChild(respLine);

        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    });
  }

  /* -------------------------------------------------------------
     4. PROJECT PHOTO CAROUSELS ("PROGRAM SLIDING")
     ------------------------------------------------------------- */
  document.querySelectorAll('.project-carousel').forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    if (!track || slides.length === 0) return;

    let currentIndex = 0;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Slide ${idx + 1}`);
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          goToSlide(idx);
        });
        dotsContainer.appendChild(dot);
      });
    }

    function updateSlides() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
          d.classList.toggle('active', i === currentIndex);
        });
      }
    }

    function goToSlide(idx) {
      if (window.playUiSound) window.playUiSound('click');
      currentIndex = (idx + slides.length) % slides.length;
      updateSlides();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }
  });
});


