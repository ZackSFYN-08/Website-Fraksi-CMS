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
      <div v-if="loading" class="loading-state text-center" style="padding: 100px 0;">
        <i class="fas fa-circle-notch fa-spin" style="font-size: 3rem; color: var(--pks-orange);"></i>
        <p style="margin-top: 20px;">Memuat informasi...</p>
      </div>

      <div v-else-if="internships.length === 0" class="glass-card coming-soon-box" data-reveal="fade-up">
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

      <div v-else class="internship-list">
        <div 
          class="internship-card glass-card hover-lift" 
          v-for="(item, index) in internships" 
          :key="item.id" 
          data-reveal="fade-up" 
          :style="{ transitionDelay: (index * 100) + 'ms' }"
        >
          <div class="poster-wrap" v-if="getImageUrl(item)">
            <img :src="getImageUrl(item)" :alt="getField(item, 'title')" class="poster-img" decoding="async" />
          </div>
          <div class="card-content">
            <span :class="['status-badge', 'status-' + getField(item, 'program_status').toLowerCase().replace(' ', '-')]">
              {{ getField(item, 'program_status') }}
            </span>
            <h2 class="program-title">{{ getField(item, 'title') }}</h2>
            <div class="program-desc" v-html="getField(item, 'description')"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import api, { STRAPI_URL } from '../services/api'

useScrollReveal()

const internships = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await api.getInternships()
    internships.value = data || []
  } catch (e) {
    console.error('Failed to fetch internships:', e)
  } finally {
    loading.value = false
  }
})

const getField = (d, field) => d?.[field] || d?.attributes?.[field] || ''
const getImageUrl = (d) => {
  const media = getField(d, 'poster')
  if (!media) return null
  const url = media?.data?.attributes?.url || media?.url
  if (!url) return null
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
}
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

@media (max-width: 640px) {
  .coming-soon-box { padding: 50px 25px; }
  .coming-soon-box h2 { font-size: 1.5rem; }
  .internship-card { grid-template-columns: 1fr; }
  .poster-wrap { height: 200px; }
}

.internship-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 900px;
  margin: 0 auto;
}

.internship-card {
  display: grid;
  grid-template-columns: 300px 1fr;
  overflow: hidden;
  border-radius: var(--radius-lg);
}

.poster-wrap {
  width: 100%;
  height: 100%;
  background: var(--pks-navy-light);
  min-height: 250px;
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.status-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

.status-coming-soon { background: var(--pks-navy-light); color: var(--pks-text-muted); }
.status-open { background: rgba(34, 197, 94, 0.1); color: #16a34a; }
.status-closed { background: rgba(239, 68, 68, 0.1); color: #dc2626; }

.program-title {
  font-size: 1.8rem;
  color: var(--pks-navy);
  margin-bottom: 15px;
  line-height: 1.3;
}

.program-desc {
  color: var(--pks-text-muted);
  line-height: 1.7;
}

.banner-blob {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, var(--pks-orange) 0%, transparent 70%);
  opacity: 0.1;
}
</style>

