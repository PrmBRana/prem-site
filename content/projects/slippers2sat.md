---
title: "Slippers2Sat (S2S)"
date: 2025-10-19
draft: false
tags: ["CubeSat", "Education", "Nepal"]
image: "/images/s2s_logo.png"
---

**Nepal's First Middle School Nano-Satellite Project — Slippers2Sat (S2S)**  

Slippers2Sat (S2S) is a **1U CubeSat project** initiated by *Antarikchya Pratisthan Nepal (APN)* with support from *Amateur Radio Digital Communications (ARDC)*.  

The *Space System Laboratory (SSL)* has been established at **Navodaya School**, where students live, learn, and engage in hands-on satellite development.  

The mission is scheduled for **launch in Q2 2025**, marking a pioneering step for Nepal in educational space technology.

---

### Project Overview

Slippers2Sat is being **designed and developed by six APN engineers**, who also **train students** about satellite systems, mission design, and space science.  

A dedicated **Space System Laboratory (SSL)** allows students to **live, learn, and engage** in hands-on satellite development including payload design, communication testing, and mission simulation.  

The mission launch is planned for **Q2 2025**, marking a **milestone in Nepali educational space technology**.

---


### Project Photo Slideshow

<div id="slideshow" style="max-width:400px; margin:20px auto; position:relative; height:250px; overflow:hidden; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.2); background:#000;">
  <img class="slide" src="/images/p1.webp" style="width:100%; height:250px; object-fit:contain;">
  <img class="slide" src="/images/p2.webp" style="width:100%; height:250px; object-fit:contain;">
  <img class="slide" src="/images/p3.webp" style="width:100%; height:250px; object-fit:contain;">
  <img class="slide" src="/images/s1.jpeg" style="width:100%; height:250px; object-fit:contain;">
  <img class="slide" src="/images/s2.jpeg" style="width:100%; height:250px; object-fit:contain;">
  <img class="slide" src="/images/s3.jpeg" style="width:100%; height:250px; object-fit:contain;">
  <img class="slide" src="/images/s4.jpeg" style="width:100%; height:250px; object-fit:contain;">
  <img class="slide" src="/images/s5.jpeg" style="width:100%; height:250px; object-fit:contain;">
  <img class="slide" src="/images/s6.jpeg" style="width:100%; height:250px; object-fit:contain;">
  <img class="slide" src="/images/s7.jpeg" style="width:100%; height:250px; object-fit:contain;">
  <img class="slide" src="/images/s8.jpeg" style="width:100%; height:250px; object-fit:contain;">
  <img class="slide" src="/images/s9.jpeg" style="width:100%; height:250px; object-fit:contain;">
</div>

<style>
.slide { display: none; position:absolute; top:0; left:0; width:100%; height:100%; transition: opacity 1s ease-in-out; }
.slide.active { display: block; opacity:1; }
</style>

<script>
(function() {
  const slides = document.querySelectorAll("#slideshow .slide");
  let index = 0;
  slides[index].classList.add("active");

  setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 3000); // every 3 seconds
})();
</script>

---

### Missions
- **DPM (Software-based Digipeater Mission)**
- **CAM Mission (Camera Mission)**
- **Active Attitude Determination and Control Mission (ADCS)**
- **Earthquake Precursor Detection Mission (EPDM)**

---

### Primary Objectives
- Train and educate middle school students to design and develop Nepal’s **third 1U CubeSat in-house**.
- Demonstrate **software-based digipeating systems** in amateur frequencies worldwide.
- Continue the **imaging mission** of NepaliSat-1 and Munal.
- Observe and calculate **Normalized Difference Water Index (NDWI)** using VIS and NIR cameras.
- Detect **ELF and ULF waves** using boomless Quad-Mag to study earthquake precursors.

---

### Secondary Objectives
- Build a **water index database** of Earth's surface.
- Demonstrate **ADCS** for stabilizing 1U CubeSats in future missions.
- Develop a **pre-earthquake warning system** using Quad-Mag data.
- Promote **space technology awareness** among Nepali communities.

---

### Project Images

| Image | Description |
|:------|:-------------|
| ![Image 1](/images/s14.png) | Students assembling the CubeSat prototype at SSL. |
| ![Image 2](/images/s12.jpg) | APN engineers mentoring students during subsystem integration. |
| ![Image 3](/images/s6.jpeg) | Short range signal testing by students. |
| ![Image 4](/images/s2.jpeg) | Students celebrating the completion of the flight model assembly. |
