<template>
  <div class="profil-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Profil Fraksi PKS</h1>
        <p>Mengenal lebih dekat visi, misi, dan nilai-nilai perjuangan Fraksi Partai Keadilan Sejahtera di DPRD Kota Bandung.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container section-content">
      <div class="profil-grid">
        <!-- Main Content -->
        <div class="profil-main">
          <!-- Vision -->
          <div class="content-card glass-card hover-lift" data-reveal="fade-up">
            <div class="card-label">Visi Perjuangan</div>
            <h2>Mewujudkan Kota Bandung Bermartabat</h2>
            <div class="vision-box">
              <i class="fas fa-quote-left quote-icon"></i>
              <p>Mewujudkan Kota Bandung yang bermartabat, sejahtera, dan berkeadilan melalui tata kelola pemerintahan yang bersih, transparan, dan amanah.</p>
            </div>
          </div>

          <!-- Mission -->
          <div class="content-card glass-card hover-lift" data-reveal="fade-up" data-reveal-delay="150">
            <div class="card-label">Misi Kami</div>
            <ul class="mission-list">
              <li v-for="(m, i) in missions" :key="i">
                <div class="mission-icon"><i class="fas fa-check"></i></div>
                <span>{{ m }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="profil-side">
          <!-- Stats -->
          <div class="stats-overview">
            <div 
              class="stat-card glass-card hover-lift" 
              v-for="(s, index) in stats" 
              :key="s.label" 
              data-reveal="fade-left" 
              :data-reveal-delay="index * 150"
            >
              <div class="stat-icon"><i :class="s.icon"></i></div>
              <div class="stat-info">
                <span class="stat-num">{{ s.num }}</span>
                <span class="stat-label">{{ s.label }}</span>
              </div>
            </div>
          </div>

          <!-- Values -->
          <div class="values-card glass-card" data-reveal="fade-left" data-reveal-delay="400">
            <h3>Nilai Perjuangan</h3>
            <div class="values-grid">
              <div class="value-item" v-for="v in values" :key="v.title">
                <div class="v-icon"><i :class="v.icon"></i></div>
                <span>{{ v.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useScrollReveal } from '../composables/useScrollReveal'
useScrollReveal()

const missions = [
  'Mendorong kebijakan pro-rakyat yang berpihak pada kepentingan masyarakat luas',
  'Mengawal anggaran daerah agar tepat sasaran, efisien, dan bebas praktik korupsi',
  'Memperjuangkan peningkatan kualitas pendidikan, kesehatan, dan kesejahteraan warga',
  'Menyerap dan mengadvokasi aspirasi masyarakat secara aktif dan berkesinambungan',
  'Mendorong pembangunan infrastruktur publik yang merata dan berkelanjutan',
]

const stats = [
  { num: '11', label: 'Legisator Fraksi', icon: 'fas fa-users-viewfinder' },
  { num: '2024', label: 'Periode Jabatan', icon: 'fas fa-calendar-check' },
  { num: '5', label: 'Komisi Aktif', icon: 'fas fa-building-user' },
]

const values = [
  { icon: 'fas fa-hands-praying', title: 'Amanah' },
  { icon: 'fas fa-scale-balanced', title: 'Keadilan' },
  { icon: 'fas fa-handshake-angle', title: 'Khidmat' },
  { icon: 'fas fa-eye', title: 'Transparansi' },
]
</script>

<style scoped>
.section-content { padding: 40px 0 80px; }

.profil-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 40px;
}

.content-card {
  padding: 40px;
  margin-bottom: 30px;
}

.card-label {
  display: inline-block;
  padding: 5px 15px;
  background: var(--pks-orange-light);
  color: var(--pks-orange);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.content-card h2 {
  font-size: 1.85rem;
  color: var(--pks-navy);
  margin-bottom: 25px;
  line-height: 1.3;
}

/* Vision */
.vision-box {
  position: relative;
  padding: 20px 0 0 40px;
}

.quote-icon {
  position: absolute;
  left: 0;
  top: 15px;
  font-size: 2rem;
  color: var(--pks-orange);
  opacity: 0.3;
}

.vision-box p {
  font-size: 1.15rem;
  line-height: 1.8;
  color: var(--pks-text-dark);
  font-weight: 500;
  font-style: italic;
}

/* Mission */
.mission-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mission-list li {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.mission-icon {
  width: 28px;
  height: 28px;
  background: var(--pks-orange-light);
  color: var(--pks-orange);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  margin-top: 2px;
}

.mission-list li span {
  font-size: 1rem;
  color: var(--pks-text-muted);
  line-height: 1.6;
}

/* Sidebar Stats */
.stats-overview {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 25px 30px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: var(--pks-white);
  border: 1px solid var(--pks-navy-light);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--pks-orange);
  transition: var(--transition-base);
}

.stat-card:hover .stat-icon {
  background: var(--pks-orange);
  color: white;
  border-color: transparent;
  transform: scale(1.1);
}

.stat-num {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: var(--pks-navy);
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--pks-text-muted);
  font-weight: 600;
}

/* Values */
.values-card {
  padding: 30px;
}

.values-card h3 {
  font-size: 1.25rem;
  color: var(--pks-navy);
  margin-bottom: 25px;
  text-align: center;
}

.values-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.value-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 10px;
  background: rgba(240, 122, 30, 0.05);
  border-radius: 12px;
  transition: var(--transition-base);
}

.value-item:hover {
  background: var(--pks-white);
  box-shadow: var(--shadow-sm);
  transform: translateY(-5px);
}

.v-icon {
  font-size: 1.5rem;
  color: var(--pks-orange);
}

.value-item span {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--pks-navy);
}

.banner-blob {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 250px;
  height: 250px;
  background: var(--pks-navy);
  filter: blur(100px);
  opacity: 0.15;
}

@media (max-width: 992px) {
  .profil-grid { grid-template-columns: 1fr; }
  .profil-side { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .stats-overview { margin-bottom: 0; }
}

@media (max-width: 640px) {
  .profil-side { grid-template-columns: 1fr; }
  .content-card { padding: 30px 20px; }
  .content-card h2 { font-size: 1.5rem; }
  .vision-box p { font-size: 1rem; }
}
</style>

