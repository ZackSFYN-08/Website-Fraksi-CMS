<template>
  <div class="wawancara-opini-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Wawancara & Opini</h1>
        <p>Himpunan pemikiran, ulasan mendalam, dan hasil wawancara eksklusif bersama para legislator Fraksi PKS.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container page-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Mengambil data opini...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="articles.length === 0" class="empty-state glass-card" data-reveal="fade-up">
        <i class="fas fa-microphone-lines"></i>
        <p>Belum ada rilis wawancara atau opini saat ini.</p>
        <a href="http://localhost:1337/admin" target="_blank" class="btn btn-sm btn-primary">Kelola di Admin Panel</a>
      </div>

      <!-- Articles List -->
      <div v-else class="articles-list">
        <router-link 
          :to="`/berita/${a.documentId}`" 
          class="article-card glass-card hover-lift" 
          v-for="(a, index) in articles" 
          :key="a.id" 
          data-reveal="fade-right" 
          :data-reveal-delay="index * 120"
        >
          <div class="article-img">
            <img v-if="getImageUrl(a)" :src="getImageUrl(a)" :alt="getField(a, 'title')" />
            <div v-else class="img-placeholder"><i class="fas fa-image"></i></div>
            <div class="img-overlay"></div>
          </div>
          
          <div class="article-body">
            <header class="body-header">
              <span class="article-tag"><i class="fas fa-quote-right"></i> {{ getCategory(a) || 'Opini' }}</span>
              <span class="article-date"><i class="far fa-calendar-alt"></i> {{ formatDate(getField(a, 'date') || getField(a, 'createdAt')) }}</span>
            </header>
            
            <div class="body-content">
              <h3>{{ getField(a, 'title') }}</h3>
              <p>{{ getField(a, 'excerpt') }}</p>
            </div>

            <footer class="body-footer">
              <div class="author-info">
                <div class="author-avatar"><i class="fas fa-user-tie"></i></div>
                <span>{{ getField(a, 'author') || 'Redaksi PKS' }}</span>
              </div>
              <span class="read-link">Mulai Membaca <i class="fas fa-arrow-right"></i></span>
            </footer>
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
    const data = await api.getArticlesByCategory('Wawancara & Opini')
    articles.value = data || []
  } catch (e) {
    console.error('Failed to fetch wawancara-opini:', e)
  } finally {
    loading.value = false
  }
})

const getField = (a, field) => a?.[field] || a?.attributes?.[field] || ''
const getCategory = (a) => {
  const cat = a?.category || a?.attributes?.category
  if (typeof cat === 'object') return cat?.data?.attributes?.name || ''
  return cat || ''
}
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

/* Articles List Modernized */
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
}

.article-card {
  display: flex;
  gap: 0;
  overflow: hidden;
  padding: 0;
}

.article-img {
  width: 320px;
  min-width: 320px;
  position: relative;
  background: var(--pks-navy);
}

.article-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-smooth);
}

.article-card:hover .article-img img {
  transform: scale(1.1);
}

.img-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to right, rgba(0,0,0,0.2), transparent);
}

.article-body {
  padding: 35px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.body-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.article-tag {
  background: var(--pks-orange-light);
  color: var(--pks-orange);
  padding: 5px 15px;
  border-radius: var(--radius-sm);
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
}

.article-date {
  font-size: 0.8rem;
  color: var(--pks-text-muted);
  font-weight: 600;
}

.body-content h3 {
  font-size: 1.5rem;
  color: var(--pks-navy);
  margin-bottom: 12px;
  line-height: 1.4;
  transition: var(--transition-base);
}

.article-card:hover h3 { color: var(--pks-orange); }

.body-content p {
  font-size: 0.98rem;
  color: var(--pks-text-muted);
  line-height: 1.7;
  margin-bottom: 30px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.body-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--pks-white-smoke);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 32px;
  height: 32px;
  background: var(--pks-gray);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--pks-navy-light);
  font-size: 0.8rem;
}

.author-info span {
  font-size: 0.85rem;
  color: var(--pks-navy);
  font-weight: 700;
}

.read-link {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--pks-orange);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition-base);
}

.article-card:hover .read-link { gap: 12px; }

.banner-blob {
  position: absolute;
  top: -50px;
  left: -50px;
  width: 250px;
  height: 250px;
  background: var(--pks-orange);
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

.loading-state i { font-size: 2rem; color: var(--pks-orange); }

.empty-state { text-align: center; padding: 80px; }
.empty-state i { font-size: 3rem; color: var(--pks-gray); margin-bottom: 20px; display: block; }

.img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.2);
  font-size: 3rem;
}

@media (max-width: 900px) {
  .article-img { width: 260px; min-width: 260px; }
}

@media (max-width: 640px) {
  .article-card { flex-direction: column; }
  .article-img { width: 100%; height: 220px; }
  .article-body { padding: 25px; }
  .body-header { margin-bottom: 15px; }
}
</style>

