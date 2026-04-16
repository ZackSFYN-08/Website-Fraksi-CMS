<template>
  <div class="perda-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Peraturan Daerah (Perda)</h1>
        <p>Dokumentasi resmi dan draf peraturan daerah yang sedang dibahas maupun yang telah disahkan melalui pengawalan Fraksi PKS.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container page-content">
      <div class="glass-card placeholder-box" data-reveal="fade-up">
        <div class="icon-stack">
          <i class="fas fa-file-contract"></i>
          <div class="icon-ring"></div>
        </div>
        <h2>Pusat Dokumentasi Perda</h2>
        <p>Kami sedang melakukan digitalisasi arsip Peraturan Daerah untuk memudahkan akses publik. Daftar lengkap produk hukum daerah akan segera tersedia untuk diunduh.</p>
        <div class="status-indicator">
          <span class="dot pulse"></span> Sedang Diperbarui
        </div>
        
        <div class="cta-section">
          <p>Butuh informasi spesifik mengenai Perda tertentu?</p>
          <router-link to="/kontak" class="btn btn-navy-outline">
            <i class="fas fa-paper-plane"></i> Hubungi Sekretariat
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

.placeholder-box {
  max-width: 750px;
  margin: 0 auto;
  padding: 80px 40px;
  text-align: center;
}

.icon-stack {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-stack i {
  font-size: 4.5rem;
  color: var(--pks-orange);
  z-index: 2;
}

.icon-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px dashed rgba(240, 122, 30, 0.3);
  border-radius: 50%;
  animation: rotate 15s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.placeholder-box h2 {
  font-size: 1.85rem;
  color: var(--pks-navy);
  margin-bottom: 20px;
  font-weight: 800;
}

.placeholder-box p {
  color: var(--pks-text-muted);
  font-size: 1.05rem;
  line-height: 1.7;
  max-width: 550px;
  margin: 0 auto 30px;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--pks-white-smoke);
  padding: 8px 20px;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--pks-navy-light);
  margin-bottom: 40px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #27ae60;
  border-radius: 50%;
}

.pulse {
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% { box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(39, 174, 96, 0); }
  100% { box-shadow: 0 0 0 0 rgba(39, 174, 96, 0); }
}

.cta-section {
  padding-top: 30px;
  border-top: 1px solid var(--pks-white-smoke);
}

.cta-section p {
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.banner-blob {
  position: absolute;
  bottom: -50px;
  left: -50px;
  width: 250px;
  height: 250px;
  background: var(--pks-orange);
  filter: blur(80px);
  opacity: 0.1;
}

@media (max-width: 640px) {
  .placeholder-box { padding: 50px 25px; }
  .placeholder-box h2 { font-size: 1.5rem; }
}
</style>

