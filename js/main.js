/**
 * Prem Bahadur Rana - Academic Portfolio
 * Lightweight, Human-Crafted Script: Photo Stream & Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* -------------------------------------------------------------
     1. CONTINUOUS FIXED-SIZE PHOTO STREAM (ONE BY ONE)
     ------------------------------------------------------------- */
  const viewport = document.getElementById('stream-viewport');
  const track = document.getElementById('stream-track');
  const prevBtn = document.getElementById('stream-prev-btn');
  const nextBtn = document.getElementById('stream-next-btn');

  let currentOffset = 0;
  let isHovered = false;
  let autoSlideTimer = null;
  const cardWidth = 310;
  const cardGap = 19.2; // 1.2rem
  const step = cardWidth + cardGap;

  function getMaxOffset() {
    if (!viewport || !track) return 0;
    const cards = track.querySelectorAll('.stream-card');
    const visibleW = viewport.clientWidth;
    const totalW = cards.length * step - cardGap;
    return Math.max(0, totalW - visibleW);
  }

  function updateTrack() {
    if (track) {
      track.style.transform = `translateX(-${currentOffset}px)`;
    }
  }

  function slideNext() {
    const maxOffset = getMaxOffset();
    currentOffset += step;
    if (currentOffset > maxOffset + 15) {
      currentOffset = 0; // Loop back smoothly
    }
    updateTrack();
  }

  function slidePrev() {
    const maxOffset = getMaxOffset();
    currentOffset -= step;
    if (currentOffset < 0) {
      currentOffset = maxOffset;
    }
    updateTrack();
  }

  function initStreamSlider() {
    currentOffset = 0;
    updateTrack();

    if (autoSlideTimer) clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => {
      if (!isHovered) slideNext();
    }, 3200);
  }

  window.initStreamSlider = initStreamSlider;

  if (track && viewport) {
    if (nextBtn) nextBtn.addEventListener('click', slideNext);
    if (prevBtn) prevBtn.addEventListener('click', slidePrev);

    viewport.addEventListener('mouseenter', () => { isHovered = true; });
    viewport.addEventListener('mouseleave', () => { isHovered = false; });

    // Touch swipe support for mobile
    let startX = 0;
    viewport.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
      isHovered = true;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].screenX;
      isHovered = false;
      if (startX - endX > 40) slideNext();
      if (endX - startX > 40) slidePrev();
    }, { passive: true });

    initStreamSlider();

    window.addEventListener('resize', () => {
      const maxOffset = getMaxOffset();
      if (currentOffset > maxOffset) {
        currentOffset = maxOffset;
        updateTrack();
      }
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
    if (modalTitle) modalTitle.textContent = title || 'Visual Documentation';
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
});
