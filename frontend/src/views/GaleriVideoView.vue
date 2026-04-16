<template>
  <div class="galeri-video-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Galeri Video</h1>
        <p>Dokumentasi video kegiatan, pernyataan sikap, dan agenda perjuangan Fraksi PKS DPRD Kota Bandung.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container page-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Menyiapkan galeri video...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="videos.length === 0" class="empty-state glass-card" data-reveal="fade-up">
        <i class="fas fa-video-slash"></i>
        <p>Koleksi video belum tersedia.</p>
        <a href="http://localhost:1337/admin" target="_blank" class="btn btn-sm btn-primary">Kelola di Admin Panel</a>
      </div>

      <!-- Video Grid -->
      <div v-else class="video-grid">
        <a 
          class="video-card glass-card hover-lift" 
          v-for="(v, index) in videos" 
          :key="v.id" 
          :href="v.link_video" 
          target="_blank" 
          data-reveal="fade-up" 
          :data-reveal-delay="index * 100"
        >
          <div class="video-thumb-wrap">
            <div class="video-thumb" :style="getThumbnailStyle(v)"></div>
            <div class="video-overlay">
              <div class="play-btn-circle">
                <i class="fas fa-play"></i>
              </div>
            </div>
          </div>
          <div class="video-info">
            <h3>{{ v.title }}</h3>
            <div class="video-meta">
              <span><i class="far fa-calendar-alt"></i> {{ formatDate(v.date || v.createdAt) }}</span>
              <span class="platform-tag"><i class="fab fa-youtube"></i> YouTube</span>
            </div>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import api, { STRAPI_URL } from '../services/api'

useScrollReveal()

const videos = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await api.getGalleries({ 'filters[type][$eq]': 'video', sort: 'createdAt:desc' })
    videos.value = data || []
  } catch (e) {
    console.error('Failed to fetch videos:', e)
  } finally {
    loading.value = false
  }
})

const getThumbnailStyle = (item) => {
  const img = item?.media || item?.attributes?.media
  if (img?.data?.attributes?.url) {
    const url = img.data.attributes.url
    return { backgroundImage: `url(${url.startsWith('http') ? url : STRAPI_URL + url})` }
  }
  if (img?.url) {
    const url = img.url
    return { backgroundImage: `url(${url.startsWith('http') ? url : STRAPI_URL + url})` }
  }
  return {}
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return isNaN(d) ? dateStr : d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.page-content { padding: 40px 0 80px; }

.video-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.video-card {
  padding: 0;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.video-thumb-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.video-thumb {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: var(--transition-smooth);
}

.video-card:hover .video-thumb {
  transform: scale(1.1);
}

.video-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 34, 68, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-base);
}

.video-card:hover .video-overlay {
  background: rgba(0, 34, 68, 0.6);
}

.play-btn-circle {
  width: 60px;
  height: 60px;
  background: var(--pks-orange);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 0 0 0 rgba(240, 122, 30, 0.4);
  transition: var(--transition-smooth);
}

.video-card:hover .play-btn-circle {
  transform: scale(1.1);
  box-shadow: 0 0 0 15px rgba(240, 122, 30, 0);
  background: var(--pks-white);
  color: var(--pks-orange);
}

.play-btn-circle i {
  margin-left: 4px;
}

.video-info {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.video-info h3 {
  font-size: 1rem;
  color: var(--pks-navy);
  margin-bottom: 12px;
  line-height: 1.4;
  height: 2.8em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: var(--transition-base);
}

.video-card:hover h3 {
  color: var(--pks-orange);
}

.video-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.video-meta span {
  font-size: 0.75rem;
  color: var(--pks-text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.platform-tag {
  color: #ff0000 !important;
  font-weight: 700;
}

.banner-blob {
  position: absolute;
  top: -50px;
  left: -50px;
  width: 250px;
  height: 250px;
  background: #e74c3c;
  filter: blur(80px);
  opacity: 0.15;
}

/* States */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 100px 0;
  color: var(--pks-text-muted);
}

.loading-state i {
  font-size: 2rem;
  color: var(--pks-orange);
}

.empty-state {
  text-align: center;
  padding: 80px;
}

.empty-state i {
  font-size: 3rem;
  color: var(--pks-gray);
  margin-bottom: 20px;
  display: block;
}

@media (max-width: 992px) {
  .video-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
}

@media (max-width: 640px) {
  .video-grid { grid-template-columns: 1fr; }
  .video-thumb-wrap { height: 180px; }
}
</style>

