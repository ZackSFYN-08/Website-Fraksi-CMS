<template>
  <div class="pansus-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Panitia Khusus (Pansus)</h1>
        <p>Aktivitas, komposisi keanggotaan, dan laporan kinerja Panitia Khusus (Pansus) yang melibatkan legislator Fraksi PKS.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container page-content">
      <div class="glass-card info-placeholder" data-reveal="fade-up">
        <div class="visual-element">
          <i class="fas fa-users-gear"></i>
          <div class="pulse-layer"></div>
        </div>
        <h2>Informasi Segera Hadir</h2>
        <p>Detail penugasan anggota, risalah rapat, dan hasil kerja Panitia Khusus sedang dalam proses kompilasi data untuk ditayangkan secara transparan kepada publik.</p>
        
        <div class="timeline-hint">
          <div class="hint-item">
            <span class="dot orange"></span>
            <span>Kompilasi Data</span>
          </div>
          <div class="hint-item">
            <span class="dot gray"></span>
            <span>Verifikasi Internal</span>
          </div>
          <div class="hint-item">
            <span class="dot gray"></span>
            <span>Publikasi</span>
          </div>
        </div>

        <div class="support-action">
          <p>Butuh data Pansus untuk keperluan riset atau akademik?</p>
          <router-link to="/kontak" class="btn btn-navy-outline">
            <i class="fas fa-envelope-open-text"></i> Ajukan Permintaan Data
          </router-link>
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

.info-placeholder {
  max-width: 750px;
  margin: 0 auto;
  padding: 80px 40px;
  text-align: center;
}

.visual-element {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-element i {
  font-size: 4rem;
  color: var(--pks-orange);
  z-index: 2;
}

.pulse-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--pks-orange);
  border-radius: 50%;
  filter: blur(25px);
  opacity: 0.15;
  animation: pulse-aura 3s infinite;
}

@keyframes pulse-aura {
  0% { transform: scale(1); opacity: 0.15; }
  50% { transform: scale(1.3); opacity: 0.05; }
  100% { transform: scale(1); opacity: 0.15; }
}

.info-placeholder h2 {
  font-size: 2rem;
  color: var(--pks-navy);
  margin-bottom: 20px;
  font-weight: 800;
}

.info-placeholder p {
  color: var(--pks-text-muted);
  font-size: 1.1rem;
  line-height: 1.7;
  max-width: 550px;
  margin: 0 auto 35px;
}

.timeline-hint {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-bottom: 40px;
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--pks-navy-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.orange { background: var(--pks-orange); box-shadow: 0 0 8px var(--pks-orange); }
.dot.gray { background: #d1d5db; }

.support-action {
  padding-top: 35px;
  border-top: 1px solid var(--pks-white-smoke);
}

.support-action p {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.banner-blob {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 300px;
  height: 300px;
  background: var(--pks-navy);
  filter: blur(100px);
  opacity: 0.12;
}

@media (max-width: 640px) {
  .info-placeholder { padding: 50px 20px; }
  .info-placeholder h2 { font-size: 1.65rem; }
  .timeline-hint { flex-direction: column; align-items: center; gap: 12px; }
}
</style>

