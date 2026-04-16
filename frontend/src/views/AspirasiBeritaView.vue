<template>
  <div class="aspirasi-berita-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Berita Aspirasi</h1>
        <p>Liputan lengkap seputar perjuangan dan advokasi aspirasi warga oleh Fraksi PKS di parlemen.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container page-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Menyelaraskan berita aspirasi...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="articles.length === 0" class="empty-state glass-card" data-reveal="fade-up">
        <i class="fas fa-bullhorn"></i>
        <p>Belum ada berita aspirasi yang diterbitkan.</p>
        <a href="http://localhost:1337/admin" target="_blank" class="btn btn-sm btn-primary">Kelola di Admin Panel</a>
      </div>

      <!-- News List -->
      <div v-else class="news-list">
        <router-link 
          :to="`/berita/${a.documentId}`" 
          class="news-item glass-card hover-lift" 
          v-for="(a, index) in articles" 
          :key="a.id" 
          data-reveal="fade-up" 
          :data-reveal-delay="index * 100"
        >
          <div class="news-thumb">
            <img v-if="getImageUrl(a)" :src="getImageUrl(a)" :alt="getField(a, 'title')" />
            <div v-else class="img-placeholder"><i class="fas fa-image"></i></div>
            <div class="thumb-overlay"></div>
          </div>
          <div class="news-body">
            <div class="news-meta">
              <span class="cat-tag">Aspirasi</span>
              <span class="news-date"><i class="far fa-calendar-alt"></i> {{ formatDate(getField(a, 'date') || getField(a, 'createdAt')) }}</span>
            </div>
            <h3>{{ getField(a, 'title') }}</h3>
            <p>{{ getField(a, 'excerpt') }}</p>
            <div class="news-footer">
              <span class="read-more">Baca Selengkapnya <i class="fas fa-chevron-right"></i></span>
            </div>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import api, { STRAPI_URL } from '../services/api'

useScrollReveal()

const articles = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await api.getArticlesByCategory('Berita Aspirasi')
    articles.value = data || []
  } catch (e) {
    console.error('Failed to fetch aspirasi-berita:', e)
  } finally {
    loading.value = false
  }
})

const getField = (a, field) => a?.[field] || a?.attributes?.[field] || ''
const getImageUrl = (a) => {
  const img = a?.image || a?.attributes?.image
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
const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.page-content { padding: 40px 0 80px; }

/* News List Modernized */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.news-item {
  display: flex;
  gap: 30px;
  padding: 0;
  overflow: hidden;
}

.news-thumb {
  width: 300px;
  min-width: 300px;
  position: relative;
  overflow: hidden;
  background: var(--pks-navy);
}

.news-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-smooth);
}

.news-item:hover .news-thumb img {
  transform: scale(1.1);
}

.thumb-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
}

.news-body {
  padding: 30px 30px 30px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
}

.cat-tag {
  background: var(--pks-orange-light);
  color: var(--pks-orange);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.news-date {
  font-size: 0.8rem;
  color: var(--pks-text-muted);
}

.news-body h3 {
  font-size: 1.35rem;
  color: var(--pks-navy);
  margin-bottom: 10px;
  line-height: 1.4;
  transition: var(--transition-base);
}

.news-item:hover h3 {
  color: var(--pks-orange);
}

.news-body p {
  font-size: 0.95rem;
  color: var(--pks-text-muted);
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-footer {
  margin-top: auto;
}

.read-more {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--pks-orange);
  display: flex;
  align-items: center;
  gap: 8px;
}

.banner-blob {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 250px;
  height: 250px;
  background: var(--pks-navy);
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

.img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.3);
  font-size: 2.5rem;
}

@media (max-width: 900px) {
  .news-thumb { width: 240px; min-width: 240px; }
}

@media (max-width: 640px) {
  .news-item { flex-direction: column; }
  .news-thumb { width: 100%; height: 200px; }
  .news-body { padding: 25px; }
}
</style>

