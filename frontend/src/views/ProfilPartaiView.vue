<template>
  <div class="profil-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Profil Partai</h1>
        <p>Mengenal lebih dekat Partai Keadilan Sejahtera (PKS), partai yang berasaskan Islam dan berkhidmat untuk rakyat, bangsa, dan negara.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container section-content">
      <div class="profil-grid">
        <!-- Main Content -->
        <div class="profil-main">
          <!-- Intro -->
          <div class="content-card glass-card hover-lift" data-reveal="fade-up">
            <div class="card-label">Tentang PKS</div>
            <h2>Partai Keadilan Sejahtera</h2>
            <div class="intro-box">
              <p>Partai Keadilan Sejahtera (PKS) adalah partai politik di Indonesia yang lahir dari rahim gerakan dakwah. PKS berkomitmen untuk mewujudkan masyarakat Indonesia yang adil, sejahtera, dan bermartabat melalui jalur politik yang bersih dan berintegritas.</p>
            </div>
          </div>
          <!-- Vision -->
          <div class="content-card glass-card hover-lift" data-reveal="fade-up" data-reveal-delay="100">
            <div class="card-label">Visi</div>
            <div class="vision-box">
              <i class="fas fa-quote-left quote-icon"></i>
              <p>Menjadi Partai Islam rahmatan lil 'alamin yang kokoh dan terdepan dalam melayani rakyat dan Negara Kesatuan Republik Indonesia.</p>
            </div>
          </div>

          <!-- Mission -->
          <div class="content-card glass-card hover-lift" data-reveal="fade-up" data-reveal-delay="200">
            <div class="card-label">Misi</div>
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
          <!-- Logo Section -->
          <div class="logo-display-card glass-card hover-lift" data-reveal="fade-left">
            <img src="https://pks.id/img/logo-pks.png" alt="Logo PKS" class="pks-logo-large" />
            <h3>Berkhidmat Untuk Rakyat</h3>
          </div>

          <!-- Values -->
          <div class="values-card glass-card" data-reveal="fade-left" data-reveal-delay="300">
            <h3>Jati Diri Partai</h3>
            <div class="values-grid">
              <div class="value-item" v-for="v in jatiDiri" :key="v.title">
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
  'Membentuk insan yang beriman, bertaqwa, dan berakhlak mulia',
  'Mewujudkan sistem politik yang demokratis, bersih, dan amanah',
  'Meningkatkan kesejahteraan rakyat melalui ekonomi kerakyatan',
  'Memperkokoh persatuan dan kesatuan bangsa dalam wadah NKRI',
  'Berperan aktif dalam mewujudkan perdamaian dunia'
]

const jatiDiri = [
  { icon: 'fas fa-star', title: 'Partai Islam' },
  { icon: 'fas fa-flag', title: 'Nasionalis' },
  { icon: 'fas fa-users', title: 'Kerakyatan' },
  { icon: 'fas fa-shield-halved', title: 'Adil Sejahtera' }
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

/* Intro */
.intro-box p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--pks-text-dark);
}

/* Election Achievement Stats */
.stats-achievement {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 122, 30, 0.05) 100%);
}

.stats-boxes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin: 15px 0;
}

.stat-box {
  padding: 15px;
  background: white;
  border-radius: var(--radius-md);
  text-align: center;
  border: 1px solid rgba(240, 122, 30, 0.15);
  box-shadow: 0 10px 30px rgba(240, 122, 30, 0.05);
  transition: var(--transition-smooth);
}

.stat-box:hover {
  transform: translateY(-8px);
  border-color: var(--pks-orange);
  box-shadow: 0 15px 40px rgba(240, 122, 30, 0.12);
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--pks-orange);
  line-height: 1;
  margin-bottom: 4px;
}

.stat-desc {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--pks-navy);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-box.coral {
  border-color: rgba(0, 34, 68, 0.1);
  background: linear-gradient(to bottom, #ffffff, #f0f4f8);
}

.stat-box.coral .stat-value {
  color: var(--pks-navy);
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

/* Sidebar Logo */
.logo-display-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px;
  margin-bottom: 30px;
  background: white;
}

.pks-logo-large {
  width: 120px;
  height: auto;
  filter: drop-shadow(0 10px 20px rgba(240, 122, 30, 0.2));
}

.logo-display-card h3 {
  font-size: 1.2rem;
  color: var(--pks-orange);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
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
  text-align: center;
}

.banner-blob {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 250px;
  height: 250px;
  background: var(--pks-orange);
  filter: blur(100px);
  opacity: 0.1;
}

@media (max-width: 992px) {
  .profil-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .content-card { padding: 30px 20px; }
  .content-card h2 { font-size: 1.5rem; }
  .vision-box p { font-size: 1rem; }
}
</style>
