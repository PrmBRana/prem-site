/**
 * ============================================================================
 * PREM BAHADUR RANA - MEDIA & VISUAL DOCUMENTATION DATABASE
 * ============================================================================
 * 
 * Accurately mapped to your renamed photo and video files.
 * Organized into scholarly, professor-level engineering categories.
 * 
 * TO EDIT ANY TITLE OR EXPLANATION:
 * Simply update the "title" or "description" strings below!
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. VIDEO DEMONSTRATIONS (MAPPED TO RENAMED FILES)
     ========================================================================== */
  const VIDEO_DATA = [
    {
      id: 'vid-cw-gmsk',
      src: 'video/CW_GMSK.mp4',
      title: 'CW & GMSK Radio Telemetry Testing',
      category: 'Aerospace RF Telecommunications',
      duration: 'RF Test Bench Video',
      description: 'Laboratory characterization and transmission testing of Continuous Wave (CW) Morse code beacon and Gaussian Minimum Shift Keying (GMSK, BT=0.5) modulated telemetry carrier for satellite communication.'
    },
    {
      id: 'vid-gfsk-testing',
      src: 'video/GFSK_testing.mp4',
      title: 'GFSK Radio Modulation & Link Testing',
      category: 'Digital Space Communications',
      duration: 'Modulation Test Video',
      description: 'Testing Gaussian Frequency Shift Keying (GFSK) telemetry transmission, frequency deviation, spectral envelope stability, and packet demodulation across amateur satellite VHF/UHF bands.'
    },
    {
      id: 'vid-college-lab',
      src: 'assets/videos/college3.mp4',
      title: 'Electronics & Communication Research Facility',
      category: 'Academic & Laboratory Environment',
      duration: 'Campus & Lab Tour',
      description: 'Walkthrough of the academic engineering campus and laboratory facilities at Khwopa Engineering College supporting avionics development, hardware instrumentation, and student research.'
    }
  ];

  /* ==========================================================================
     2. COMPREHENSIVE PHOTO ARCHIVE (MAPPED TO RENAMED FILES)
     ========================================================================== */
  const PHOTO_DATA = [
    // ------------------------------------------------------------------------
    // A. CLEANROOM & AEROSPACE INFRASTRUCTURE (FFU & S2S CLEANROOM)
    // ------------------------------------------------------------------------
    {
      id: 'ffu',
      src: 'images/FFU.jpeg',
      category: 'Cleanroom & Infrastructure',
      title: 'Fan Filter Unit (FFU) Installation',
      description: 'Custom centrifugal laminar flow Fan Filter Unit equipped with H14 HEPA filtration (99.995% efficiency at 0.3μm), engineered for the low-cost S2S satellite cleanroom.'
    },
    {
      id: 'clean-room',
      src: 'images/Clean_Room.jpeg',
      category: 'Cleanroom & Infrastructure',
      title: 'S2S Cleanroom Facility Construction',
      description: 'Positive-pressure cleanroom enclosure designed and built at Navodaya Space Systems Laboratory (SSL) for contamination-free nano-satellite assembly.'
    },
    {
      id: 'clean-room-test',
      src: 'images/Clean_room_test.jpeg',
      category: 'Cleanroom & Infrastructure',
      title: 'Cleanroom Laminar Airflow Verification',
      description: 'Testing airflow velocity profiles and positive pressure differentials (&gt;15 Pa) to ensure outward air displacement upon access door opening.'
    },
    {
      id: 'clean-room-testing-webp',
      src: 'images/clean_room_testing.webp',
      category: 'Cleanroom & Infrastructure',
      title: 'Cleanroom Environmental Diagnostics',
      description: 'Evaluating particulate counts, relative humidity, and temperature stability to protect sensitive CubeSat optics, solar arrays, and wire harnesses.'
    },

    // ------------------------------------------------------------------------
    // B. HELMHOLTZ COIL & GEOMAGNETIC CALIBRATION (EPDM)
    // ------------------------------------------------------------------------
    {
      id: 'helmholtz-coil-test',
      src: 'images/Helmholtz_coil_test.jpeg',
      category: 'Helmholtz Coil & Geomagnetics',
      title: 'Helmholtz Coil Magnetic Calibration Chamber',
      description: 'Precision triaxial Helmholtz coil cage generating controlled, uniform magnetic fields to calibrate magnetometers for the Earthquake Precursor Detection Mission.'
    },
    {
      id: 'helmholtz-coil-test-2',
      src: 'images/HelmHotz_coil_test.jpeg',
      category: 'Helmholtz Coil & Geomagnetics',
      title: 'Helmholtz Coil Benchtop Evaluation',
      description: 'Subjecting the Quad-Mag sensor array to dynamic field excitation to measure frequency response across Ultra-Low Frequency (&lt;3Hz) earthquake precursor bands.'
    },
    {
      id: 'coil-test-helm',
      src: 'images/Coil_test_helm.jpeg',
      category: 'Helmholtz Coil & Geomagnetics',
      title: 'Magnetometer Linear Response in Coil',
      description: 'Assessing sensor axis orthogonal linearity, cross-axis coupling, and magnetic dipole cancellation under calibrated coil current steps.'
    },
    {
      id: 'test-coil',
      src: 'images/test_coil.jpeg',
      category: 'Helmholtz Coil & Geomagnetics',
      title: 'Coil Drive Current vs. Field Intensity',
      description: 'Calibrating the Helmholtz coil transfer coefficient (nT per milliampere) against high-accuracy reference fluxgate standards.'
    },

    // ------------------------------------------------------------------------
    // C. EPDM FLIGHT HARDWARE & SENSORS
    // ------------------------------------------------------------------------
    {
      id: 'epdm-board-top',
      src: 'images/EPDM_Board_top.jpeg',
      category: 'EPDM Magnetometer',
      title: 'EPDM Flight Board (Top Layer)',
      description: 'Populated flight printed circuit board featuring four PNI RM3100 geomagnetometer sensors and precision analog filtering on STM32F103.'
    },
    {
      id: 'epdm-board-bottom',
      src: 'images/EPDM_board_bottom.jpeg',
      category: 'EPDM Magnetometer',
      title: 'EPDM Flight Board (Bottom Layer)',
      description: 'Bottom layer routing featuring the Micron MT25QL 1Gb Quad-SPI NOR Flash memory for high-frequency seismo-magnetic waveform logging.'
    },
    {
      id: 'epdm-bbm',
      src: 'images/EPDM_BBM.jpeg',
      category: 'EPDM Magnetometer',
      title: 'EPDM Breadboard Model (BBM)',
      description: 'Functional electronic breadboard model verifying power rails, SPI communications, and sensor acquisition timing before flight fabrication.'
    },
    {
      id: 'quad-mag-bbm',
      src: 'images/Quad_mag_BBM.jpeg',
      category: 'EPDM Magnetometer',
      title: 'Quad-Mag Sensor Array Breadboard Setup',
      description: 'Bench evaluation of the non-boom 4-sensor differential array for Undetermined Blind Source Separation (UBSS) spacecraft noise elimination.'
    },
    {
      id: 'epdm-weight',
      src: 'images/EPDM_weight.jpeg',
      category: 'EPDM Magnetometer',
      title: 'EPDM Flight Payload Mass Verification',
      description: 'Precision analytical balance measurement verifying compliance with the strict structural mass allocation of the 1U CubeSat chassis.'
    },
    {
      id: 'epdm1-arch',
      src: 'images/epdm1.png',
      category: 'EPDM Magnetometer',
      title: 'EPDM Quad-Mag Sensor Architecture',
      description: 'Spatial configuration diagram of 4x PNI RM3100 sensors isolating ambient seismo-magnetic waves from spacecraft noise without mechanical booms.'
    },
    {
      id: 'e2-field',
      src: 'images/e2.jpeg',
      category: 'EPDM Magnetometer',
      title: 'Outdoor Geomagnetic Baseline Survey',
      description: 'Ground geomagnetic test survey measuring undisturbed Earth magnetic field vectors away from urban ferromagnetic interference.'
    },
    {
      id: 'boot-calib',
      src: 'images/boot.jpeg',
      category: 'EPDM Magnetometer',
      title: 'Thin-Shell Ellipsoid Calibration Matrix',
      description: 'Mathematical transformation matrix correcting 9-parameter hard-iron and soft-iron distortions into true orthogonal geomagnetic vectors.'
    },

    // ------------------------------------------------------------------------
    // D. SLIPPERS2SAT (S2S) CUBESAT FLIGHT MISSION & TEAM
    // ------------------------------------------------------------------------
    {
      id: 'assemble-s2s',
      src: 'images/Assemble_S2S.png',
      category: 'Slippers2Sat CubeSat',
      title: 'Slippers2Sat (S2S) 1U Flight Assembly',
      description: 'Complete 3D structural CAD assembly of Nepal\'s first middle-school educational nano-satellite launched from Hunan, China.'
    },
    {
      id: 's2s-logo',
      src: 'images/s2s_logo.png',
      category: 'Slippers2Sat CubeSat',
      title: 'Slippers2Sat (S2S) Mission Insignia',
      description: 'Official mission insignia for Slippers2Sat, developed by Antarikchya Pratisthan Nepal (APN) with ARDC grant funding.'
    },
    {
      id: 's2s-team-1',
      src: 'images/S2S_team.jpeg',
      category: 'Slippers2Sat CubeSat',
      title: 'Slippers2Sat Engineering & Mentorship Team',
      description: 'Research fellows and student team at the Navodaya Space Systems Laboratory celebrating flight milestone completion.'
    },
    {
      id: 's2s-team-2',
      src: 'images/S2S_Team.jpeg',
      category: 'Slippers2Sat CubeSat',
      title: 'S2S Laboratory Research Fellows',
      description: 'Core engineering and payload development team during cleanroom flight integration at Navodaya SSL.'
    },
    {
      id: 's2s-team-3',
      src: 'images/S2S_team.jpg',
      category: 'Slippers2Sat CubeSat',
      title: 'S2S Flight Integration Team Review',
      description: 'Pre-shipment verification session reviewing flight checklists and mass budget calculations before launch integration.'
    },
    {
      id: 's2s-chepang',
      src: 'images/S2S_student_chepang.webp',
      category: 'Slippers2Sat CubeSat',
      title: 'Chepang & Tamang Student Fellowship',
      description: 'Mentoring indigenous middle-school scholarship students from marginalized communities in satellite avionics and cleanroom discipline.'
    },
    {
      id: 'apn-team',
      src: 'images/APN_team.jpeg',
      category: 'Slippers2Sat CubeSat',
      title: 'Antarikchya Pratisthan Nepal (APN) Team',
      description: 'Core research fellows and engineers at APN pioneering space research and nano-satellite technology in Nepal.'
    },
    {
      id: 'ardc',
      src: 'images/ARDC.jpeg',
      category: 'Slippers2Sat CubeSat',
      title: 'Amateur Radio Digital Communications (ARDC)',
      description: 'International partnership with ARDC supporting amateur radio digital communications payloads on the S2S satellite.'
    },
    {
      id: 'navodaya-logo',
      src: 'images/Novadayaschool_logo.jpeg',
      category: 'Slippers2Sat CubeSat',
      title: 'Navodaya School / SSL Emblem',
      description: 'Navodaya School institution insignia, hosting the Space Systems Laboratory cleanroom and student fellowship.'
    },
    {
      id: 's10-harness',
      src: 'images/s10.png',
      category: 'Slippers2Sat CubeSat',
      title: 'Flight Model Harnessing Inspection',
      description: 'Final quality assurance review of wire routing, heat-shrink insulation, and strain-relief anchors on the flight chassis.'
    },
    {
      id: 's11-wiring',
      src: 'images/s11.jpg',
      category: 'Slippers2Sat CubeSat',
      title: 'Chassis Wire Harnessing & Routing',
      description: 'Precision wiring, connector harnessing, and structural bus routing within the 1U structural aluminum CubeSat frame.'
    },
    {
      id: 'p2-telemetry',
      src: 'images/p2.webp',
      category: 'Slippers2Sat CubeSat',
      title: 'Satellite Subsystem Diagnostic Checkout',
      description: 'Live telemetry readout confirming power rail voltages, current draw, and automated beacon transmissions.'
    },

    // ------------------------------------------------------------------------
    // E. SOLDERING, WORKSHOPS & STUDENT PRACTICUM
    // ------------------------------------------------------------------------
    {
      id: 'soldering',
      src: 'images/Soldering.jpeg',
      category: 'Soldering & Student Training',
      title: 'Precision Aerospace Surface-Mount Soldering',
      description: 'High-reliability SMD soldering and inspection under digital microscope magnification for flight-grade electronics.'
    },
    {
      id: 'soldering-practice',
      src: 'images/Soldering_practice.jpeg',
      category: 'Soldering & Student Training',
      title: 'Student Soldering Practicum',
      description: 'Training middle-school student fellows in thermal management, flux cleaning, and IPC-compliant lead-free solder joints.'
    },
    {
      id: 'epdm-student',
      src: 'images/EPDM_student.jpeg',
      category: 'Soldering & Student Training',
      title: 'Student Assembly of EPDM Payloads',
      description: 'Mentoring student fellows through hands-on component placement and continuity checks for the EPDM payload.'
    },
    {
      id: 'epdm-student-1',
      src: 'images/EPDM_Student1.jpeg',
      category: 'Soldering & Student Training',
      title: 'Student Cleanroom Practicum Session',
      description: 'Students working inside the Navodaya SSL cleanroom learning ESD grounding protocols and flight hardware handling.'
    },
    {
      id: 'epdm-student-bbm',
      src: 'images/EPDM_Student_BBM.jpeg',
      category: 'Soldering & Student Training',
      title: 'Student Breadboard Model Testing',
      description: 'Students verifying microcontroller logic levels and sensor communication flags on the breadboard prototype.'
    },
    {
      id: 'epdm-student-solder',
      src: 'images/EPDM_Student_Solder.jpeg',
      category: 'Soldering & Student Training',
      title: 'Hands-On PCB Soldering Guidance',
      description: 'One-on-one mentorship guiding students in soldering passive pass-through components and header pins.'
    },

    // ------------------------------------------------------------------------
    // F. RF TELEMETRY & GROUND STATION TESTING
    // ------------------------------------------------------------------------
    {
      id: 'rf-testing-1',
      src: 'images/RF_testing.jpeg',
      category: 'RF Telemetry & Comms',
      title: 'RF Transceiver Frequency Bench Testing',
      description: 'Characterizing UHF downlink transmitter carrier stability, output harmonic suppression, and power levels with spectrum analyzers.'
    },
    {
      id: 'rf-testing-2',
      src: 'images/RF_Testing.jpeg',
      category: 'RF Telemetry & Comms',
      title: 'Telemetry Modulator Test Bench',
      description: 'Evaluating GMSK and FSK modulation index, symbol timing, and G3RUH polynomial whitening performance.'
    },
    {
      id: 'ground-station-test',
      src: 'images/Ground_Station_test.jpeg',
      category: 'RF Telemetry & Comms',
      title: 'Ground Station Packet Reception Test',
      description: 'Testing UHF satellite ground station reception, AX.25 Layer-2 UI frame decoding, and antenna matching network.'
    },

    // ------------------------------------------------------------------------
    // G. YOLO COMPUTER VISION & AGRICULTURAL ROBOTICS
    // ------------------------------------------------------------------------
    {
      id: 'fruits',
      src: 'images/fruits.png',
      category: 'YOLO Vision & Robotics',
      title: 'YOLO Object Detection Output',
      description: 'Multi-class bounding box classification isolating fresh vs. rotten apples and tomatoes with 99.31% mAP.'
    },
    {
      id: 'college-project-ai',
      src: 'images/Colege_Project_AI.jpg',
      category: 'YOLO Vision & Robotics',
      title: 'Automated Conveyor Sorting Machine',
      description: 'Mechatronic sorting conveyor developed at Khwopa Engineering College powered by Raspberry Pi 4 edge inference.'
    },
    {
      id: 'sorting-project-ai-college',
      src: 'images/sorting_project_AI_college.jpg',
      category: 'YOLO Vision & Robotics',
      title: 'Conveyor Sorter System Overview',
      description: 'Automated conveyor system with dual-camera inspection hood, high-torque diverter flap, and collection bins.'
    },
    {
      id: 'sorting-machine-college',
      src: 'images/solting_machine_college.jpeg',
      category: 'YOLO Vision & Robotics',
      title: 'Mechanical Sorter Frame & Belt Coupling',
      description: 'Stepper motor drive and mechanical roller assembly maintaining constant linear speed during image acquisition.'
    },
    {
      id: 'college-result-ai-1',
      src: 'images/College_result_AI.jpeg',
      category: 'YOLO Vision & Robotics',
      title: 'Precision-Recall & F1-Score Curves',
      description: 'Quantitative benchmark curves demonstrating YOLOv12S performance superiority across 11,675 fruit images.'
    },
    {
      id: 'college-result-ai-2',
      src: 'images/College_Result_AI.jpeg',
      category: 'YOLO Vision & Robotics',
      title: 'Evaluation Metrics vs. YOLOv8 & DETR',
      description: 'Comparative accuracy metrics establishing 99.31% mAP and 98.28% F1-score for edge agricultural quality sorting.'
    },
    {
      id: 'ai-college-result-1',
      src: 'images/AI_college_Result.jpeg',
      category: 'YOLO Vision & Robotics',
      title: 'Confusion Matrix Analysis',
      description: 'Class-by-class confusion matrix verifying robust discrimination between fresh and rotten produce categories.'
    },
    {
      id: 'ai-result-college-2',
      src: 'images/AI_Result_college.jpeg',
      category: 'YOLO Vision & Robotics',
      title: 'Real-Time Edge Inference Metrics',
      description: 'Latency profiling showing sub-30ms inference time on edge hardware, enabling real-time mechanical sorting.'
    },
    {
      id: 'result1-college',
      src: 'images/result1_college.jpeg',
      category: 'YOLO Vision & Robotics',
      title: 'Loss Convergence & Model Training Graphs',
      description: 'Bounding box regression loss and classification loss graphs converging smoothly over model training epochs.'
    },

    // ------------------------------------------------------------------------
    // H. DHARAN SPACE & CANSAT STEM BOOTCAMP
    // ------------------------------------------------------------------------
    {
      id: 'd1',
      src: 'images/dharan_bootcam/d1.jpg',
      category: 'Dharan Bootcamp',
      title: 'Dharan Space Bootcamp Kickoff Session',
      description: 'Conducting an intensive 4-day hands-on CubeSat and CanSat workshop for high school students in eastern Nepal.'
    },
    {
      id: 'd2',
      src: 'images/dharan_bootcam/d2.jpg',
      category: 'Dharan Bootcamp',
      title: 'Aerospace & Orbital Mechanics Lecture',
      description: 'Teaching satellite orbital mechanics, sensor telemetry, and atmospheric instrumentation to participating fellows.'
    },
    {
      id: 'd3',
      src: 'images/dharan_bootcam/d3.jpg',
      category: 'Dharan Bootcamp',
      title: 'CanSat Chassis Structural Assembly',
      description: 'Guiding students in constructing lightweight airframes with shock-absorbing standoffs and sensor mounts.'
    },
    {
      id: 'd4',
      src: 'images/dharan_bootcam/d4.jpg',
      category: 'Dharan Bootcamp',
      title: 'Sensor Interfacing & Soldering Practicum',
      description: 'Soldering and interfacing BMP180 barometric pressure sensors, IMUs, and radio transmitters.'
    },
    {
      id: 'd5',
      src: 'images/dharan_bootcam/d5.jpg',
      category: 'Dharan Bootcamp',
      title: 'Parachute Rigging & Canopy Folding',
      description: 'Calculating parachute canopy surface area and folding suspension lines for controlled descent rate.'
    },
    {
      id: 'd6',
      src: 'images/dharan_bootcam/d6.jpg',
      category: 'Dharan Bootcamp',
      title: 'CanSat Drop Tower Launch Test',
      description: 'Drop testing CanSat payloads from height to verify parachute deployment and descent velocity.'
    },
    {
      id: 'd7',
      src: 'images/dharan_bootcam/d7.jpg',
      category: 'Dharan Bootcamp',
      title: 'Live Ground Station Telemetry Monitoring',
      description: 'Decoding live barometric altitude, acceleration, and temperature telemetry packets received over radio link.'
    },
    {
      id: 'd8',
      src: 'images/dharan_bootcam/d8.jpg',
      category: 'Dharan Bootcamp',
      title: 'Student Team Subsystem Integration',
      description: 'Collaborative troubleshooting of power supplies, microcontroller logic, and radio antenna matching.'
    },
    {
      id: 'd9',
      src: 'images/dharan_bootcam/d9.jpg',
      category: 'Dharan Bootcamp',
      title: 'Field Flight Readiness Assessment',
      description: 'Checking mechanical fastener torque, battery voltage, and radio link budget before final drop tests.'
    },
    {
      id: 'd10',
      src: 'images/dharan_bootcam/d10.jpg',
      category: 'Dharan Bootcamp',
      title: 'Drop Launch Demonstration in Dharan',
      description: 'Releasing student CanSat payloads over the field while monitoring live flight telemetry on ground station laptops.'
    },
    {
      id: 'd11',
      src: 'images/dharan_bootcam/d11.jpg',
      category: 'Dharan Bootcamp',
      title: 'Student Data Analysis & Flight Debrief',
      description: 'Graphing altitude vs. time curves and analyzing terminal velocity data recorded by onboard BMP180 sensors.'
    },
    {
      id: 'd12',
      src: 'images/dharan_bootcam/d12.jpg',
      category: 'Dharan Bootcamp',
      title: 'Bootcamp Completion & Award Ceremony',
      description: 'Celebrating high-school student achievements and awarding certificates of completion in Dharan.'
    },
    {
      id: 'd13',
      src: 'images/dharan_bootcam/d13.jpg',
      category: 'Dharan Bootcamp',
      title: 'CanSat Payload Structural Verification',
      description: 'Inspecting internal battery brackets and payload electronics after descent recovery.'
    },
    {
      id: 'd14',
      src: 'images/dharan_bootcam/d14.jpg',
      category: 'Dharan Bootcamp',
      title: 'Mentoring Student Engineering Teams',
      description: 'Hands-on debugging with students on serial communication and analog sensor calibration.'
    },
    {
      id: 'd15',
      src: 'images/dharan_bootcam/d15.jpg',
      category: 'Dharan Bootcamp',
      title: 'Ground Station Dipole Antenna Tuning',
      description: 'Tuning resonant dipole and Yagi antennas for UHF packet reception during field demonstrations.'
    },
    {
      id: 'd16',
      src: 'images/dharan_bootcam/d16.jpg',
      category: 'Dharan Bootcamp',
      title: 'Group Photo with Participating Fellows',
      description: 'Instructors and participating students commemorating the successful completion of the Dharan CanSat Bootcamp.'
    },
    {
      id: 'img2805',
      src: 'images/dharan_bootcam/IMG_2805.jpg',
      category: 'Dharan Bootcamp',
      title: 'Parachute Steady Terminal Descent',
      description: 'Capturing parachute canopy inflation and steady terminal descent during flight trials over Dharan.'
    },
    {
      id: 'img3108',
      src: 'images/dharan_bootcam/IMG_3108.jpg',
      category: 'Dharan Bootcamp',
      title: 'CanSat Recovery Inspection',
      description: 'Retrieving the payload after touchdown and confirming zero mechanical damage to internal flight boards.'
    },

    // ------------------------------------------------------------------------
    // I. SILICON VLSI, LABS & ACADEMIC FIELD RESEARCH
    // ------------------------------------------------------------------------
    {
      id: 'risc',
      src: 'images/RISC.jpeg',
      category: 'Labs & Field Research',
      title: 'RISC-V 5-Stage Core Synthesis Layout',
      description: 'Synthesizable 32-bit RV32I pipelined processor designed in Verilog HDL for SkyWater 130nm ASIC via Tiny Tapeout.'
    },
    {
      id: 'prem',
      src: 'images/prem.jpg',
      category: 'Labs & Field Research',
      title: 'Prem Bahadur Rana Portrait',
      description: 'EPDM Mission Lead & Satellite Research Fellow at Antarikchya Pratisthan Nepal (APN).'
    },
    {
      id: 'college1',
      src: 'images/college1.jpeg',
      category: 'Labs & Field Research',
      title: 'Khwopa Engineering College Campus',
      description: 'Department of Electronics & Communication Engineering, Khwopa Engineering College, Bhaktapur, Nepal.'
    },
    {
      id: 'college2',
      src: 'images/college2.jpeg',
      category: 'Labs & Field Research',
      title: 'Electronics Laboratory Workbench',
      description: 'Laboratory test benches equipped with digital oscilloscopes, power supplies, and logic analyzers supporting aerospace research.'
    }
  ];

  /* ==========================================================================
     DOM RENDERING & CONTROLLER LOGIC
     ========================================================================== */

  // 1. Render Video Demonstrations
  function renderVideos() {
    const container = document.getElementById('videos-container');
    if (!container) return;

    container.innerHTML = '';
    VIDEO_DATA.forEach((vid) => {
      const card = document.createElement('div');
      card.className = 'academic-project-card video-card';
      card.innerHTML = `
        <div class="video-player-wrap">
          <video controls preload="metadata" playsinline>
            <source src="${vid.src}" type="video/mp4">
            Your browser does not support HTML5 video playback.
          </video>
        </div>
        <div style="padding-top: 1.1rem; display: flex; flex-direction: column; flex-grow: 1;">
          <div class="project-top-row">
            <span class="badge badge-emerald">${vid.category}</span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">${vid.duration}</span>
          </div>
          <h3 class="project-title" style="font-size: 1.2rem; margin-bottom: 0.5rem;">${vid.title}</h3>
          <p class="project-summary" style="font-size: 0.92rem; margin-bottom: 0;">${vid.description}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // 2. Render Continuous Fixed-Size Photo Stream (Slide Cards)
  function renderPhotoStream(filterCat) {
    const track = document.getElementById('stream-track');
    if (!track) return;

    track.innerHTML = '';
    const filtered = (!filterCat || filterCat === 'all')
      ? PHOTO_DATA
      : PHOTO_DATA.filter(p => p.category === filterCat);

    filtered.forEach((photo) => {
      const card = document.createElement('div');
      card.className = 'stream-card';
      card.onclick = () => openLightbox(photo.src, photo.title, photo.description);

      card.innerHTML = `
        <img src="${photo.src}" alt="${photo.title}" loading="lazy">
        <div class="stream-card-overlay">
          <div class="stream-card-tag">${photo.category}</div>
          <p class="stream-card-name">${photo.title}</p>
        </div>
      `;
      track.appendChild(card);
    });

    // Reinitialize slider bounds
    if (window.initStreamSlider) {
      window.initStreamSlider();
    }
  }

  // 3. Category Filter Buttons for Photos
  function initPhotoFilters() {
    const filterBtns = document.querySelectorAll('.photo-filter-btn');
    if (!filterBtns || filterBtns.length === 0) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-filter');
        renderPhotoStream(cat);
      });
    });
  }

  // Expose data globally for easy user inspection
  window.VIDEO_DATA = VIDEO_DATA;
  window.PHOTO_DATA = PHOTO_DATA;
  window.renderPhotoStream = renderPhotoStream;

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    renderVideos();
    renderPhotoStream('all');
    initPhotoFilters();
  });

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    renderVideos();
    renderPhotoStream('all');
    initPhotoFilters();
  }
})();
