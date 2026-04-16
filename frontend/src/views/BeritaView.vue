<template>
  <div class="berita-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Berita & Kegiatan</h1>
        <p>Update terbaru mengenai aktivitas, aspirasi, dan perjuangan Fraksi PKS di DPRD Kota Bandung.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container berita-content">
      <!-- Category Filters -->
      <div class="filter-wrapper" data-reveal="fade-up" data-reveal-delay="100">
        <div class="filter-bar">
          <button 
            v-for="cat in categories" 
            :key="cat" 
            :class="['filter-btn', { active: activeFilter === cat }]" 
            @click="activeFilter = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Menyelaraskan berita...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredArticles.length === 0" class="empty-state glass-card" data-reveal="fade-up">
        <i class="fas fa-newspaper"></i>
        <p>Belum ada berita{{ activeFilter !== 'Semua' ? ` dalam kategori "${activeFilter}"` : '' }}.</p>
        <a href="http://localhost:1337/admin" target="_blank" class="btn btn-sm btn-primary">Kelola di Admin Panel</a>
      </div>

      <!-- News List -->
      <div v-else class="news-list">
        <router-link 
          :to="`/berita/${a.documentId}`" 
          class="news-item glass-card hover-lift" 
          v-for="(a, index) in filteredArticles" 
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
              <span class="cat-tag" v-if="getCategory(a)">{{ getCategory(a) }}</span>
              <span class="news-date"><i class="far fa-calendar-alt"></i> {{ formatDate(getField(a, 'date') || getField(a, 'createdAt')) }}</span>
            </div>
            <h3>{{ getField(a, 'title') }}</h3>
            <p>{{ getField(a, 'excerpt') }}</p>
            <div class="news-footer">
              <span class="news-author" v-if="getField(a, 'author')"><i class="far fa-user"></i> By {{ getField(a, 'author') }}</span>
              <span class="read-more">Baca Lengkap <i class="fas fa-chevron-right"></i></span>
            </div>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api, { STRAPI_URL } from '../services/api'
import { useScrollReveal } from '../composables/useScrollReveal'

useScrollReveal()

const categories = ref(['Semua'])
const activeFilter = ref('Semua')
const articles = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [articlesData, categoriesData] = await Promise.all([
      api.getArticles({ sort: 'date:desc', populate: '*' }),
      api.getCategories()
    ])
    
    articles.value = articlesData || []
    if (categoriesData) {
      categories.value = ['Semua', ...categoriesData.map(c => c.name || c.attributes?.name)]
    }
  } catch (e) {
    console.error('Failed to fetch data:', e)
  } finally {
    loading.value = false
  }
})

const getField = (a, field) => a?.[field] || a?.attributes?.[field] || ''
const getCategory = (a) => {
  const cat = a?.category || a?.attributes?.category
  if (typeof cat === 'object') return cat?.name || cat?.data?.attributes?.name || ''
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
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const filteredArticles = computed(() => {
  if (activeFilter.value === 'Semua') return articles.value
  return articles.value.filter(a => getCategory(a) === activeFilter.value)
})
</script>

<style scoped>
.berita-content { padding: 40px 0 80px; }

/* Filter Buttons */
.filter-wrapper {
  margin-bottom: 40px;
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: thin;
}

.filter-bar {
  display: flex;
  gap: 12px;
  min-width: max-content;
}

.filter-btn {
  padding: 10px 24px;
  border-radius: var(--radius-full);
  border: 1px solid var(--pks-navy-light);
  background: white;
  color: var(--pks-text-muted);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition-base);
}

.filter-btn:hover {
  border-color: var(--pks-orange);
  color: var(--pks-orange);
}

.filter-btn.active {
  background: var(--pks-orange-gradient);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(240, 122, 30, 0.3);
}

/* News List */
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
  width: 320px;
  min-width: 320px;
  position: relative;
  overflow: hidden;
}

.news-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-smooth);
}

.news-item:hover .news-thumb img {
  transform: scale(1.08);
}

.thumb-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to right, rgba(0,0,0,0.2), transparent);
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
  margin-bottom: 15px;
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
  font-size: 1.4rem;
  color: var(--pks-navy);
  margin-bottom: 12px;
  line-height: 1.35;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.news-author {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--pks-navy);
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
  background: var(--pks-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--pks-text-muted);
  min-height: 200px;
}

@media (max-width: 992px) {
  .news-thumb { width: 240px; min-width: 240px; }
  .news-body h3 { font-size: 1.2rem; }
}

@media (max-width: 640px) {
  .news-item { flex-direction: column; }
  .news-thumb { width: 100%; height: 220px; min-width: 100%; }
  .news-body { padding: 25px; }
  .news-footer { margin-top: 20px; }
  .filter-wrapper { margin-bottom: 25px; }
  .filter-btn { padding: 8px 20px; font-size: 0.85rem; }
}
</style>

