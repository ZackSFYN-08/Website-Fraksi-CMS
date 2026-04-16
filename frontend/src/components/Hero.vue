<template>
  <section class="hero-section">
    <div class="container hero-container">

      <!-- Hero Banner Image -->
      <div class="hero-banner-wrap" data-reveal="fade-up">
        <img
          src="@/assets/hero-banner.png"
          alt="Pimpinan Fraksi PKS Kota Bandung – Gedung DPRD Kota Bandung"
          class="hero-banner-img"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  padding: calc(var(--nav-height) + 16px) 0 40px;
  overflow: hidden;
}

/* Badge di atas banner */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
}

.badge-logo { width: 22px; height: auto; }

/* Banner wrapper */
.hero-banner-wrap {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-premium);
  line-height: 0;
}

.hero-banner-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  border-radius: var(--radius-lg);
  transition: transform 0.6s ease;
}

.hero-banner-wrap:hover .hero-banner-img {
  transform: scale(1.015);
}

/* Gradient overlay untuk teks CTA */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(10, 25, 60, 0.72) 0%,
    rgba(10, 25, 60, 0.35) 50%,
    transparent 75%
  );
  border-radius: var(--radius-lg);
  display: flex;
  align-items: flex-end;
  padding: 48px 52px;
}

.hero-overlay-content {
  max-width: 560px;
  color: white;
}

.hero-title {
  font-size: 2.6rem;
  font-weight: 900;
  line-height: 1.15;
  color: white;
  margin-bottom: 16px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.4);
}

.hero-title span {
  color: var(--pks-orange);
}

.hero-subtitle {
  font-size: 1rem;
  opacity: 0.88;
  line-height: 1.75;
  margin-bottom: 28px;
  text-shadow: 0 1px 6px rgba(0,0,0,0.35);
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.btn-outline-white {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.4);
  color: white;
  backdrop-filter: blur(6px);
}

.btn-outline-white:hover {
  background: white;
  color: var(--pks-navy);
  border-color: white;
  transform: translateY(-3px);
}

@media (max-width: 1024px) {
  .hero-overlay {
    padding: 36px 36px;
  }
  .hero-title { font-size: 2.1rem; }
}

@media (max-width: 768px) {
  .hero-overlay {
    background: linear-gradient(
      to top,
      rgba(10, 25, 60, 0.85) 0%,
      rgba(10, 25, 60, 0.5) 60%,
      transparent 100%
    );
    align-items: flex-end;
    padding: 28px 24px;
  }
  .hero-title { font-size: 1.7rem; }
  .hero-subtitle { font-size: 0.9rem; margin-bottom: 20px; }
  .hero-actions { gap: 10px; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 1.4rem; }
  .hero-actions { flex-direction: column; }
  .btn { width: 100%; }
  .hero-overlay { padding: 20px 18px; }
}
</style>