/**
 * Main Application Logic
 * Clean, Human-Made, Robust Photo Slider and Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* -------------------------------------------------------------
     1. CONTINUOUS FIXED-SIZE PHOTO SLIDER (ONE BY ONE)
     ------------------------------------------------------------- */
  const sliderWrapper = document.getElementById('photo-slider-wrapper');
  const sliderTrack = document.getElementById('photo-slider-track');
  const prevBtn = document.getElementById('slider-prev-btn');
  const nextBtn = document.getElementById('slider-next-btn');

  if (sliderTrack && sliderWrapper) {
    const cards = sliderTrack.querySelectorAll('.fixed-slide-card');
    const cardWidth = 320; // fixed card width
    const cardGap = 20;    // gap between cards
    const step = cardWidth + cardGap;
    let currentOffset = 0;
    let isHovered = false;
    let autoSlideInterval = null;

    function getMaxOffset() {
      const visibleWidth = sliderWrapper.clientWidth;
      const totalWidth = cards.length * step - cardGap;
      return Math.max(0, totalWidth - visibleWidth);
    }

    function updateTrackPosition() {
      sliderTrack.style.transform = `translateX(-${currentOffset}px)`;
    }

    function slideNext() {
      const maxOffset = getMaxOffset();
      currentOffset += step;
      if (currentOffset > maxOffset + 10) {
        currentOffset = 0; // Loop back smoothly to beginning
      }
      updateTrackPosition();
    }

    function slidePrev() {
      const maxOffset = getMaxOffset();
      currentOffset -= step;
      if (currentOffset < 0) {
        currentOffset = maxOffset;
      }
      updateTrackPosition();
    }

    if (nextBtn) nextBtn.addEventListener('click', slideNext);
    if (prevBtn) prevBtn.addEventListener('click', slidePrev);

    // Continuous auto-sliding (one by one every 3 seconds)
    function startAutoSlide() {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        if (!isHovered) {
          slideNext();
        }
      }, 3200);
    }

    sliderWrapper.addEventListener('mouseenter', () => { isHovered = true; });
    sliderWrapper.addEventListener('mouseleave', () => { isHovered = false; });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    sliderWrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isHovered = true;
    }, { passive: true });

    sliderWrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      isHovered = false;
      if (touchStartX - touchEndX > 50) slideNext();
      if (touchEndX - touchStartX > 50) slidePrev();
    }, { passive: true });

    startAutoSlide();
    window.addEventListener('resize', () => {
      if (currentOffset > getMaxOffset()) {
        currentOffset = getMaxOffset();
        updateTrackPosition();
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
});
