<template>
  <div class="galeri-foto-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Galeri Foto</h1>
        <p>Dokumentasi visual berbagai kegiatan dan agenda perjuangan Fraksi PKS DPRD Kota Bandung.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container page-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Menyiapkan album foto...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="photos.length === 0" class="empty-state glass-card" data-reveal="fade-up">
        <i class="fas fa-images"></i>
        <p>Album foto belum tersedia.</p>
        <a href="http://localhost:1337/admin" target="_blank" class="btn btn-sm btn-primary">Kelola di Admin Panel</a>
      </div>

      <!-- Gallery Grid -->
      <div v-else class="gallery-grid">
        <div 
          class="gallery-item glass-card hover-lift" 
          v-for="(item, index) in photos" 
          :key="item.id" 
          data-reveal="zoom" 
          :data-reveal-delay="index * 100"
        >
          <div class="gallery-img-wrap">
            <img v-if="getImageUrl(item)" :src="getImageUrl(item)" :alt="item.title" class="gallery-img" />
            <div v-else class="img-placeholder"><i class="fas fa-image"></i></div>
            
            <div class="gallery-overlay">
              <div class="overlay-content">
                <span class="gallery-date"><i class="far fa-calendar-alt"></i> {{ formatDate(item.date || item.createdAt) }}</span>
                <p class="gallery-title">{{ item.title }}</p>
                <div class="zoom-indicator"><i class="fas fa-search-plus"></i></div>
              </div>
            </div>
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

const photos = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await api.getGalleries({ 'filters[type][$eq]': 'foto', sort: 'createdAt:desc' })
    photos.value = data || []
  } catch (e) {
    console.error('Failed to fetch photos:', e)
  } finally {
    loading.value = false
  }
})

const getImageUrl = (item) => {
  const img = item?.media || item?.attributes?.media
  if (img?.data?.attributes?.url) {
    const url = img.data.attributes.url
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
  }
  if (img?.url) {
    const url = img.url
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
  }
  return null
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return isNaN(d) ? dateStr : d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.page-content { padding: 40px 0 80px; }

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.gallery-item {
  padding: 0;
  overflow: hidden;
  height: 100%;
}

.gallery-img-wrap {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-smooth);
}

.gallery-item:hover .gallery-img {
  transform: scale(1.1);
}

.gallery-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to top, rgba(0, 34, 68, 0.9) 0%, rgba(0, 34, 68, 0.3) 50%, transparent 100%);
  opacity: 0.6;
  transition: var(--transition-base);
  display: flex;
  align-items: flex-end;
  padding: 24px;
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.overlay-content {
  transform: translateY(10px);
  transition: var(--transition-smooth);
}

.gallery-item:hover .overlay-content {
  transform: translateY(0);
}

.gallery-date {
  font-size: 0.75rem;
  color: var(--pks-orange);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.gallery-title {
  color: white;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.4;
}

.zoom-indicator {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transform: scale(0.5);
  transition: var(--transition-smooth);
}

.gallery-item:hover .zoom-indicator {
  opacity: 1;
  transform: scale(1);
}

.banner-blob {
  position: absolute;
  bottom: -50px;
  left: -50px;
  width: 250px;
  height: 250px;
  background: #3498db;
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
  .gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
}

@media (max-width: 640px) {
  .gallery-grid { grid-template-columns: 1fr; }
  .gallery-overlay { opacity: 1; padding: 20px; }
  .overlay-content { transform: none; }
}
</style>
