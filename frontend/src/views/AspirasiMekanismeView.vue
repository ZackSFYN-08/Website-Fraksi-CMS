<template>
  <div class="aspirasi-mekanisme-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Mekanisme Aspirasi</h1>
        <p>Alur tata cara penyampaian, pengolahan, hingga tindak lanjut aspirasi masyarakat oleh Fraksi PKS DPRD Kota Bandung.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container page-content">
      <div class="section-intro" data-reveal="fade-up" data-reveal-delay="100">
        <span class="badge-primary">6 Langkah Perjuangan</span>
        <h2>Bagaimana Kami Memperjuangkan Suara Anda?</h2>
      </div>

      <div class="steps-grid">
        <div 
          class="step-card glass-card hover-lift" 
          v-for="(s, i) in steps" 
          :key="i" 
          data-reveal="fade-up" 
          :data-reveal-delay="150 + (i * 100)"
        >
          <div class="step-header">
            <div class="step-num">{{ i + 1 }}</div>
            <div class="step-line"></div>
          </div>
          <div class="step-body">
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="cta-section glass-card" data-reveal="zoom" data-reveal-delay="200">
        <div class="cta-content">
          <h2>Siap Menyuarakan Aspirasi?</h2>
          <p>Pendapat dan masukan Anda sangat berharga bagi pembangunan Kota Bandung yang lebih baik.</p>
          <div class="cta-actions">
            <router-link to="/aspirasi/form" class="btn btn-primary">
              <i class="fas fa-edit"></i> Isi Form Aspirasi
            </router-link>
            <router-link to="/kontak" class="btn btn-navy-outline">
              <i class="fas fa-phone-alt"></i> Hubungi Kami
            </router-link>
          </div>
        </div>
        <div class="cta-blob"></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useScrollReveal } from '../composables/useScrollReveal'
useScrollReveal()

const steps = [
  { title: 'Sampaikan Aspirasi', desc: 'Warga dapat menyampaikan aspirasi melalui form online, surat, email, atau datang langsung ke kantor Fraksi PKS di DPRD Kota Bandung.' },
  { title: 'Verifikasi & Kategorisasi', desc: 'Tim sekretariat fraksi akan meninjau kelengkapan data dan mengelompokkan aspirasi berdasarkan bidang/komisi terkait.' },
  { title: 'Disposisi Anggota', desc: 'Aspirasi diteruskan kepada anggota fraksi yang bertugas di komisi yang bersesuaian guna pendalaman materi.' },
  { title: 'Pembahasan Fraksi', desc: 'Aspirasi dikaji secara mendalam dalam rapat internal fraksi untuk menentukan strategi advokasi dan langkah nyata.' },
  { title: 'Advokasi di DPRD', desc: 'Anggota fraksi menyalurkan aspirasi dalam rapat-rapat komisi, pandangan umum fraksi, hingga rapat paripurna.' },
  { title: 'Laporan Balik', desc: 'Setiap perkembangan tindak lanjut akan diinformasikan kembali kepada pemohon aspirasi sebagai bentuk transparansi.' },
]
</script>

<style scoped>
.page-content { padding: 40px 0 80px; }

.section-intro {
  text-align: center;
  margin-bottom: 60px;
}

.section-intro h2 {
  font-size: 2rem;
  color: var(--pks-navy);
  margin-top: 15px;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 60px;
}

.step-card {
  padding: 35px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-bottom: 4px solid transparent;
  transition: var(--transition-smooth);
}

.step-card:hover { border-color: var(--pks-orange); }

.step-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.step-num {
  width: 45px;
  height: 45px;
  background: var(--pks-orange-gradient);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  box-shadow: var(--shadow-sm);
}

.step-line {
  flex: 1;
  height: 2px;
  background: var(--pks-navy-light);
  opacity: 0.3;
}

.step-body h3 {
  font-size: 1.15rem;
  color: var(--pks-navy);
  margin-bottom: 12px;
}

.step-body p {
  font-size: 0.9rem;
  color: var(--pks-text-muted);
  line-height: 1.6;
}

/* CTA Box */
.cta-section {
  padding: 60px;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: var(--pks-white-glass);
}

.cta-content {
  position: relative;
  z-index: 2;
}

.cta-content h2 {
  font-size: 2.25rem;
  color: var(--pks-navy);
  margin-bottom: 15px;
}

.cta-content p {
  color: var(--pks-text-muted);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 30px;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.cta-blob {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: var(--pks-orange);
  filter: blur(100px);
  opacity: 0.1;
  z-index: 1;
}

.banner-blob {
  position: absolute;
  top: -50px;
  left: -50px;
  width: 250px;
  height: 250px;
  background: #2ecc71;
  filter: blur(80px);
  opacity: 0.15;
}

@media (max-width: 992px) {
  .steps-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .steps-grid { grid-template-columns: 1fr; }
  .cta-section { padding: 40px 20px; }
  .cta-content h2 { font-size: 1.75rem; }
  .cta-actions { flex-direction: column; }
  .cta-actions .btn { width: 100%; }
}
</style>

