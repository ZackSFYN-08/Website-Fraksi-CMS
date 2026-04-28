<template>
  <div class="internship-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>InternshipKS</h1>
        <p>Program magang eksklusif bagi pemuda dan mahasiswa untuk mendalami dunia legislatif bersama Fraksi PKS.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container page-content">
      <div class="glass-card coming-soon-box" data-reveal="fade-up">
        <div class="icon-wrap">
          <i class="fas fa-user-graduate"></i>
          <div class="icon-glow"></div>
        </div>
        <h2>Informasi Segera Hadir</h2>
        <p>Program InternshipKS sedang dalam tahap persiapan. Kami akan segera merilis mekanisme pendaftaran dan kriteria calon peserta magang untuk periode mendatang.</p>
        <div class="coming-soon-badge">Coming Soon</div>
        
        <div class="action-hint">
          <p>Dapatkan update terbaru melalui media sosial kami:</p>
          <div class="social-links">
            <a href="#" class="social-item hover-lift"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-item hover-lift"><i class="fab fa-facebook"></i></a>
            <a href="#" class="social-item hover-lift"><i class="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useScrollReveal } from '../composables/useScrollReveal'
useScrollReveal()
</script>

<style scoped>
.page-content { padding: 40px 0 80px; }

.coming-soon-box {
  max-width: 700px;
  margin: 0 auto;
  padding: 80px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.icon-wrap {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrap i {
  font-size: 4rem;
  color: var(--pks-orange);
  position: relative;
  z-index: 2;
}

.icon-glow {
  position: absolute;
  inset: 10px;
  background: var(--pks-orange);
  filter: blur(30px);
  opacity: 0.2;
}

.coming-soon-box h2 {
  font-size: 2rem;
  color: var(--pks-navy);
  margin-bottom: 20px;
  font-weight: 800;
}

.coming-soon-box p {
  color: var(--pks-text-muted);
  font-size: 1.1rem;
  line-height: 1.7;
  max-width: 500px;
  margin: 0 auto 30px;
}

.coming-soon-badge {
  display: inline-block;
  background: var(--pks-navy-gradient);
  color: white;
  padding: 8px 24px;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 40px;
  box-shadow: var(--shadow-sm);
}

.action-hint {
  padding-top: 30px;
  border-top: 1px solid var(--pks-white-smoke);
}

.action-hint p {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 15px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-item {
  width: 45px;
  height: 45px;
  background: var(--pks-navy-light);
  color: var(--pks-navy);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  transition: var(--transition-smooth);
}

.social-item:hover {
  background: var(--pks-orange);
  color: white;
}

.banner-blob {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 250px;
  height: 250px;
  background: var(--pks-navy);
  filter: blur(80px);
  opacity: 0.1;
}

@media (max-width: 640px) {
  .coming-soon-box { padding: 50px 25px; }
  .coming-soon-box h2 { font-size: 1.5rem; }
}
</style>

