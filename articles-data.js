/**
 * ============================================================================
 * PREM BAHADUR RANA - TECHNICAL ARTICLES & LABORATORY LOGS DATABASE
 * ============================================================================
 * 
 * THIS IS YOUR DEDICATED FILE FOR WRITING AND EDITING ARTICLES!
 * 
 * HOW TO ADD A NEW ARTICLE:
 * 1. Copy the STARTER TEMPLATE at the top of this file.
 * 2. Paste it directly below into the ARTICLES_DATABASE array.
 * 3. Fill in your title, category, date, excerpt, and content.
 * 4. Save this file!
 * 5. Run `./upload.sh "Added new article"` in your terminal to publish to GitHub.
 * ============================================================================
 */

/* ==========================================================================
   COPY-PASTE STARTER TEMPLATE:
   ==========================================================================
   {
     id: 'my-new-article-slug',
     title: 'Your Article Title Goes Here',
     category: 'Embedded Systems', // or: Silicon VLSI, Satellite RF, Geomagnetics, Computer Vision, Cleanroom & Infrastructure, Laboratory Logs
     date: 'Aug 2026',
     readTime: '5 min read',
     excerpt: 'A short 1-2 sentence summary of what this article covers.',
     content: `
       <h2>1. Introduction</h2>
       <p>Write your background context and problem description here.</p>

       <h2>2. Hardware & Firmware Architecture</h2>
       <p>Describe your circuit, pinout, or algorithms.</p>

       <pre><code>// Insert your C, Verilog, or Python code here</code></pre>

       <h2>3. Test Results & Discussion</h2>
       <p>Summarize test bench measurements or telemetry data.</p>
     `
   },
   ========================================================================== */

window.ARTICLES_DATABASE = [
  // --------------------------------------------------------------------------
  // ARTICLE 1: AUTHORING & PUBLISHING GUIDE
  // --------------------------------------------------------------------------
  {
    id: 'authoring-guide-how-to-write-publish-articles',
    title: 'Authoring Guide: How to Write, Format, and Publish Engineering Articles on this Website',
    category: 'Publishing Tutorial',
    date: 'Aug 2026',
    readTime: '5 min read',
    excerpt: 'A complete step-by-step tutorial for Prem Bahadur Rana on authoring, formatting code snippets, embedding photos & videos, and publishing new articles directly to the website via Git.',
    content: `
      <h2>1. Overview of the Publishing Workflow</h2>
      <p>This website uses a dedicated, clean file named <code>articles-data.js</code> to store all your articles. You do not need any external database or complex backend server.</p>
      <p>Whenever you want to add, edit, or delete an article, you only edit <code>articles-data.js</code>! Follow these four simple steps:</p>
      <ol style="margin-left: 1.5rem; line-height: 1.8;">
        <li><strong>Open <code>articles-data.js</code>:</strong> In your editor, open the dedicated article database file.</li>
        <li><strong>Add or Edit:</strong> Copy the starter template and fill in your technical content.</li>
        <li><strong>Test Locally:</strong> Check your browser at <code>http://localhost:8080/#articles</code> to verify how it looks.</li>
        <li><strong>Upload Live:</strong> In your terminal, run <code>./upload.sh "Added new article"</code> to automatically publish live to <strong>premrana.com.np</strong>!</li>
      </ol>

      <h2>2. Standard Article Attributes</h2>
      <p>Each article in <code>articles-data.js</code> has these fields:</p>
      <ul>
        <li><code>id</code>: A unique lowercase URL-safe slug (e.g. <code>'stm32-ipcc-ipc'</code>).</li>
        <li><code>title</code>: The academic or technical title of the article.</li>
        <li><code>category</code>: The primary domain (e.g. <em>'Embedded Systems'</em>, <em>'Silicon VLSI'</em>, <em>'Satellite RF'</em>, <em>'Geomagnetics'</em>, <em>'Computer Vision'</em>).</li>
        <li><code>date</code>: Month and year of publication (e.g. <code>'Aug 2026'</code>).</li>
        <li><code>readTime</code>: Estimated reading duration (e.g. <code>'5 min read'</code>).</li>
        <li><code>excerpt</code>: A concise 1-2 sentence executive summary displayed on the card.</li>
        <li><code>content</code>: The full body of the article written in clean HTML.</li>
      </ul>

      <h2>3. How to Format Code Snippets</h2>
      <p>To include C, Verilog, Python, or shell code snippets, wrap them inside <code>&lt;pre&gt;&lt;code&gt;...&lt;/code&gt;&lt;/pre&gt;</code> tags:</p>

      <pre><code>// Example: STM32 HAL GPIO Configuration in C
void MX_GPIO_Init(void) {
    GPIO_InitTypeDef GPIO_InitStruct = {0};
    __HAL_RCC_GPIOC_CLK_ENABLE();
    GPIO_InitStruct.Pin = GPIO_PIN_13;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
    HAL_GPIO_Init(GPIOC, &amp;GPIO_InitStruct);
}</code></pre>

      <h2>4. Embedding Photos &amp; Videos Inside Your Article</h2>
      <p>You can embed any photo from your <code>images/</code> folder directly into the article body:</p>
      <pre><code>&lt;img src="images/EPDM_Board_top.jpeg" alt="EPDM Top Layer" style="width: 100%; border-radius: 6px; margin: 1rem 0;"&gt;
&lt;p style="font-size: 0.85rem; color: #9ca3af; text-align: center;"&gt;Figure 1: EPDM Quad-Mag Flight PCB top layer showing 4x PNI RM3100 sensors.&lt;/p&gt;</code></pre>

      <p>To embed an uploaded video from your <code>video/</code> folder, use the HTML5 <code>&lt;video&gt;</code> tag:</p>
      <pre><code>&lt;video controls style="width: 100%; border-radius: 6px; margin: 1rem 0;"&gt;
    &lt;source src="video/CW_GMSK.mp4" type="video/mp4"&gt;
&lt;/video&gt;</code></pre>

      <h2>5. Fast One-Click Upload Script</h2>
      <p>We created a dedicated script named <code>upload.sh</code>. Whenever you edit your articles, simply open your terminal and run:</p>
      <pre><code>./upload.sh "Publish article on [Your Subject]"</code></pre>
      <p>The script will automatically check changes, commit them cleanly, and push live to GitHub!</p>
    `
  },

  // --------------------------------------------------------------------------
  // ARTICLE 2: STM32 DUAL-CORE IPCC
  // --------------------------------------------------------------------------
  {
    id: 'stm32-dual-core-ipcc',
    title: 'Inter-Core Communication on STM32 Dual-Core using IPCC Mailbox & Cache Maintenance',
    category: 'Embedded Systems',
    date: 'Aug 2026',
    readTime: '6 min read',
    excerpt: 'A technical guide on configuring STM32 IPCC hardware channels, zero-copy pointer exchanges across non-cacheable SRAM3, and avoiding L1 cache incoherency using SCB_CleanDCache and SCB_InvalidateDCache.',
    content: `
      <h2>1. Architectural Overview</h2>
      <p>In asymmetric multiprocessing (AMP) microcontrollers such as the STM32H7 or STM32WB series, Core 1 (e.g. Cortex-M7 at 480 MHz) handles heavy real-time processing such as attitude estimation and sensor filtering, while Core 2 (e.g. Cortex-M4 at 240 MHz) manages communication stacks, file storage (LittleFS), and peripheral telemetry.</p>
      <p>Because each core possesses distinct clock domains and private L1 caches, sharing data directly without synchronization causes data corruption. The STM32 Inter-Processor Communication Controller (IPCC) provides hardware-level notification flags and interrupt lines between cores.</p>

      <h2>2. Zero-Copy Pointer Passing via Shared SRAM3</h2>
      <p>Rather than copying megabytes across boundaries, we allocate a shared circular ring buffer in SRAM3 (address <code>0x38000000</code>). Core 1 populates the payload, passes a 32-bit descriptor pointer through the IPCC channel, and raises an interrupt on Core 2.</p>

      <pre><code>/* Cortex-M7 (Core 1): Clean D-Cache to flush writes to physical SRAM3 */
SCB_CleanDCache_by_Addr((uint32_t*)pTelemetryPacket, sizeof(TelemetryPacket_t));

/* Trigger IPCC Channel 1 transmission to Core 2 */
LL_IPCC_MakeTxChannelBusy(IPCC, LL_IPCC_CHANNEL_1);</code></pre>

      <h2>3. Cache Invalidation on the Receiving Core</h2>
      <p>When Core 2 receives the IPCC interrupt, it must invalidate its own D-Cache before reading the memory address. Otherwise, the processor might read stale cache lines instead of the freshly written SRAM values.</p>

      <pre><code>/* Cortex-M4 (Core 2) IPCC Interrupt Handler */
void IPCC_C2_RX_IRQHandler(void) {
    if (LL_IPCC_IsRxChannelBusy(IPCC, LL_IPCC_CHANNEL_1)) {
        TelemetryPacket_t *rxPacket = (TelemetryPacket_t*)shared_mailbox_ptr;
        
        /* Invalidate cache before reading */
        SCB_InvalidateDCache_by_Addr((uint32_t*)rxPacket, sizeof(TelemetryPacket_t));
        
        process_downlink_packet(rxPacket);
        LL_IPCC_ClearFlagChannel(IPCC, LL_IPCC_CHANNEL_1);
    }
}</code></pre>
    `
  },

  // --------------------------------------------------------------------------
  // ARTICLE 3: PNI RM3100 THIN-SHELL CALIBRATION
  // --------------------------------------------------------------------------
  {
    id: 'quad-mag-thin-shell-calibration',
    title: 'Calibrating 4x PNI RM3100 Magnetometers for Non-Boom CubeSats using Thin-Shell Fitting',
    category: 'Geomagnetics',
    date: 'May 2026',
    readTime: '8 min read',
    excerpt: 'Methodology for removing hard-iron and soft-iron magnetic distortions on small satellite chassis without deploying mechanical booms, validated against the International Geomagnetic Reference Field (IGRF).',
    content: `
      <h2>1. The Non-Boom Challenge in 1U CubeSats</h2>
      <p>In standard space missions, sensitive fluxgate magnetometers are deployed on 1 to 2-meter booms to isolate the sensor from onboard magnetic noise generated by battery currents, solar panels, and reaction wheels. On a 1U CubeSat such as Slippers2Sat (S2S), mechanical constraints make long booms impractical.</p>

      <h2>2. Mathematical Ellipsoid Thin-Shell Formulation</h2>
      <p>The relationship between the uncalibrated sensor output <code>B_raw</code> and the true Earth magnetic field <code>B_true</code> is modeled as:</p>
      <pre><code>B_raw = S * R * B_true + V_hard_iron + Noise</code></pre>
      <p>Where <code>S</code> is a 3x3 scale factor matrix, <code>R</code> represents non-orthogonality misalignment, and <code>V_hard_iron</code> represents constant magnetic offsets from onboard ferromagnetic materials.</p>

      <h2>3. Ground Survey Validation</h2>
      <p>During baseline field calibrations in Budhanilkantha and Pulchowk, Nepal, the thin-shell fitting algorithm achieved less than 0.8% deviation from the predicted IGRF field (49,068.8 nT), enabling reliable detection of Ultra-Low Frequency (&lt;3Hz) earthquake precursor anomalies.</p>
    `
  },

  // --------------------------------------------------------------------------
  // ARTICLE 4: RISC-V 5-STAGE PIPELINE
  // --------------------------------------------------------------------------
  {
    id: 'riscv-5stage-pipeline-forwarding',
    title: 'Hazard Handling and Data Forwarding in Synthesizable RV32I 5-Stage Processors',
    category: 'Silicon VLSI',
    date: 'Feb 2026',
    readTime: '7 min read',
    excerpt: 'Implementing EX-to-EX and MEM-to-EX forwarding paths in Verilog HDL to eliminate pipeline stalls on data dependencies, targeting open-source SkyWater 130nm ASIC fabrication via Tiny Tapeout.',
    content: `
      <h2>1. The Classical 5-Stage RISC-V Pipeline</h2>
      <p>The user-level RV32I base integer instruction set divides execution into five synchronous stages: Instruction Fetch (IF), Instruction Decode / Register Read (ID), Execute / ALU (EX), Memory Access (MEM), and Writeback (WB).</p>

      <h2>2. Data Hazards &amp; Forwarding Logic</h2>
      <p>When an instruction requires the result of a preceding instruction before it has written back to the register file, a Read-After-Write (RAW) hazard occurs. Without forwarding, the pipeline must stall for up to two clock cycles.</p>

      <pre><code>// Forwarding Unit Verilog Snippet
always @(*) begin
    // Forward to Operand A from EX/MEM stage
    if (ex_mem_regwrite && (ex_mem_rd != 0) && (ex_mem_rd == id_ex_rs1))
        forward_a = 2'b10;
    // Forward to Operand A from MEM/WB stage
    else if (mem_wb_regwrite && (mem_wb_rd != 0) && (mem_wb_rd == id_ex_rs1))
        forward_a = 2'b01;
    else
        forward_a = 2'b00; // No forwarding
end</code></pre>

      <h2>3. ASIC Synthesis &amp; Cocotb Verification</h2>
      <p>Using cocotb Python testbenches, the processor was validated against thousands of randomized RISC-V compliance test vectors before physical synthesis with OpenLane on SkyWater 130nm standard cells.</p>
    `
  },

  // --------------------------------------------------------------------------
  // ARTICLE 5: AX.25 UI FRAME & G3RUH PACKET RADIO
  // --------------------------------------------------------------------------
  {
    id: 'ax25-gmsk-satellite-telemetry',
    title: 'Generating AX.25 UI Packet Frames & G3RUH 9600 Baud Scrambling in C',
    category: 'Satellite RF',
    date: 'Dec 2025',
    readTime: '5 min read',
    excerpt: 'Step-by-step breakdown of HDLC flag encapsulation (0x7E), zero bit-stuffing, 16-bit CRC-CCITT computation, and LFSR polynomial whitening for amateur CubeSat UHF downlinks.',
    content: `
      <h2>1. AX.25 Layer-2 UI Frame Structure</h2>
      <p>For amateur satellite downlinks, unnumbered information (UI) frames provide connectionless broadcast capability. An AX.25 UI frame consists of:</p>
      <ul>
        <li><strong>Opening Flag:</strong> <code>0x7E</code> (01111110)</li>
        <li><strong>Address Field:</strong> Destination &amp; Source Call signs with SSID</li>
        <li><strong>Control Field:</strong> <code>0x03</code> (UI Frame)</li>
        <li><strong>PID Field:</strong> <code>0xF0</code> (No layer 3 protocol)</li>
        <li><strong>Information Field:</strong> Telemetry payload bytes</li>
        <li><strong>FCS (Frame Check Sequence):</strong> 16-bit CRC-CCITT (polynomial 0x1021)</li>
        <li><strong>Closing Flag:</strong> <code>0x7E</code></li>
      </ul>

      <h2>2. G3RUH Scrambler Implementation</h2>
      <p>To prevent continuous streams of 0s or 1s that cause phase-locked loops (PLL) on ground stations to lose synchronization, data is whitened using a 17-bit Linear Feedback Shift Register (LFSR) with the characteristic polynomial <code>1 + x^12 + x^17</code>.</p>
    `
  },

  // --------------------------------------------------------------------------
  // ARTICLE 6: CLEANROOM FFU ENGINEERING
  // --------------------------------------------------------------------------
  {
    id: 'low-cost-satellite-cleanroom-ffu',
    title: 'Building a Low-Cost ISO-Class Satellite Assembly Cleanroom with Custom FFUs',
    category: 'Aerospace Infrastructure',
    date: 'Sep 2025',
    readTime: '6 min read',
    excerpt: 'Practical engineering considerations for designing an academic space laboratory cleanroom with Fan Filter Units (FFU), positive pressure differentials, and ESD control benches.',
    content: `
      <h2>1. Cleanroom Objectives for Small Satellites</h2>
      <p>Nano-satellites and CubeSats require clean environments during flight model assembly to prevent optical aperture contamination, solar cell dust degradation, and mechanical switch jamming. Commercial ISO 7 cleanrooms often cost hundreds of thousands of dollars, presenting hurdles for developing nations and student-led initiatives.</p>

      <h2>2. Engineering the Navodaya SSL Facility</h2>
      <p>At the Navodaya Space Systems Laboratory (SSL), we designed and built a dedicated cleanroom facility utilizing:</p>
      <ul>
        <li><strong>High-Efficiency Fan Filter Units (FFU):</strong> Powered by centrifugal backward-curved impellers paired with H14 HEPA filters (99.995% efficiency at 0.3 microns).</li>
        <li><strong>Positive Pressure Differential:</strong> Maintained at &gt;15 Pa relative to ambient room pressure to guarantee outward airflow when access doors open.</li>
        <li><strong>Static-Dissipative ESD Workbenches:</strong> Copper ground grids linked to dedicated earth grounding stakes to prevent electrostatic discharge damage to sensitive CMOS sensors and microcontrollers.</li>
      </ul>
    `
  }
];
