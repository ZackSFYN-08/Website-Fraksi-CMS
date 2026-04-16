<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api, { STRAPI_URL } from '../services/api'
import { useScrollReveal } from '../composables/useScrollReveal'

useScrollReveal()

const route = useRoute()
const router = useRouter()
const article = ref(null)
const loading = ref(true)
const relatedArticles = ref([])

onMounted(async () => {
  try {
    const data = await api.getArticle(route.params.documentId)
    article.value = data || null
    // Fetch related articles (latest 3 excluding current)
    const all = await api.getArticles({ sort: 'date:desc', 'pagination[limit]': 4, populate: '*' })
    relatedArticles.value = (all || []).filter(a => getField(a, 'documentId') !== route.params.documentId).slice(0, 3)
  } catch (e) {
    console.error('Failed to fetch article:', e)
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
  return new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
const getCategory = (a) => {
  const cat = a?.category || a?.attributes?.category
  if (typeof cat === 'object') return cat?.data?.attributes?.name || ''
  return cat || ''
}

const contentParagraphs = computed(() => {
  const content = getField(article.value, 'content')
  if (!content) return []
  return content.split('\n').filter(p => p.trim())
})
const shareUrl = computed(() => {
  if (typeof window !== 'undefined') return window.location.href
  return ''
})

const twitterShareUrl = computed(() => {
  const title = getField(article.value, 'title')
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl.value)}`
})

const facebookShareUrl = computed(() => {
  return `https://www.facebook.com/sharer.php?u=${encodeURIComponent(shareUrl.value)}`
})

const whatsappShareUrl = computed(() => {
  const title = getField(article.value, 'title')
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + shareUrl.value)}`
})
</script>

<template>
  <div class="berita-detail-view">
    <div v-if="loading" class="loading-state container">
      <div class="loader-wrap">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Memuat konten artikel...</span>
      </div>
    </div>

    <div v-else-if="!article" class="empty-state container" data-reveal="fade-up">
      <div class="empty-card glass-card">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Artikel tidak ditemukan.</p>
        <router-link to="/berita" class="btn btn-primary">← Kembali ke Berita</router-link>
      </div>
    </div>

    <template v-else>
      <!-- Breadcrumb -->
      <section class="container breadcrumb-container" data-reveal="fade-down">
        <div class="breadcrumb-glass glass-card">
          <router-link to="/">Beranda</router-link>
          <i class="fas fa-chevron-right"></i>
          <router-link to="/berita">Berita</router-link>
          <i class="fas fa-chevron-right"></i>
          <span class="current">Detail Berita</span>
        </div>
      </section>

      <!-- Article Content -->
      <main class="container article-layout">
        <article class="article-main-card glass-card" data-reveal="fade-up">
          <header class="article-header">
            <div class="article-meta">
              <span class="cat-tag" v-if="getCategory(article)">{{ getCategory(article) }}</span>
              <span class="meta-item"><i class="far fa-calendar-alt"></i> {{ formatDate(getField(article, 'date') || getField(article, 'createdAt')) }}</span>
              <span class="meta-item" v-if="getField(article, 'author')"><i class="far fa-user"></i> {{ getField(article, 'author') }}</span>
            </div>
            <h1 class="article-title">{{ getField(article, 'title') }}</h1>
          </header>

          <div class="article-hero-wrap" v-if="getImageUrl(article)">
            <img :src="getImageUrl(article)" :alt="getField(article, 'title')" class="hero-image" />
            <div class="hero-overlay"></div>
          </div>

          <div class="article-body">
            <div class="content-text">
              <p v-for="(paragraph, i) in contentParagraphs" :key="i">{{ paragraph }}</p>
            </div>
          </div>

          <footer class="article-footer">
            <div class="share-section">
              <span class="share-label">Bagikan Artikel:</span>
              <div class="share-btns">
                <a :href="twitterShareUrl" target="_blank" class="share-btn twitter" title="Share on X">
                  <i class="fab fa-x-twitter"></i>
                </a>
                <a :href="facebookShareUrl" target="_blank" class="share-btn facebook" title="Share on Facebook">
                  <i class="fab fa-facebook-f"></i>
                </a>
                <a :href="whatsappShareUrl" target="_blank" class="share-btn whatsapp" title="Share on WhatsApp">
                  <i class="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>
          </footer>
        </article>

        <!-- Sidebar -->
        <aside class="article-sidebar">
          <div class="sidebar-section glass-card" data-reveal="fade-left" data-reveal-delay="200">
            <div class="sidebar-header">
              <h3>Berita Terkait</h3>
            </div>
            <div class="related-list">
              <router-link
                v-for="item in relatedArticles"
                :key="item.id"
                :to="`/berita/${item.documentId}`"
                class="related-card hover-lift"
              >
                <div class="related-thumb">
                  <img v-if="getImageUrl(item)" :src="getImageUrl(item)" :alt="getField(item, 'title')" />
                  <div v-else class="img-placeholder-sm"><i class="fas fa-image"></i></div>
                </div>
                <div class="related-info">
                  <h4>{{ getField(item, 'title') }}</h4>
                  <span class="related-date">{{ formatDate(getField(item, 'date') || getField(item, 'createdAt')).split(',')[1] }}</span>
                </div>
              </router-link>
            </div>
          </div>

          <router-link to="/berita" class="btn btn-dark btn-all-news" data-reveal="fade-left" data-reveal-delay="400">
            <i class="fas fa-th-list"></i> Lihat Semua Berita
          </router-link>
        </aside>
      </main>
    </template>
  </div>
</template>

<style scoped>
.berita-detail-view {
  padding-top: calc(var(--nav-height) + 30px);
  padding-bottom: 80px;
}

/* Breadcrumb */
.breadcrumb-container {
  margin-bottom: 30px;
}

.breadcrumb-glass {
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  width: max-content;
}

.breadcrumb-glass a {
  color: var(--pks-orange);
  font-weight: 600;
}

.breadcrumb-glass i {
  font-size: 0.7rem;
  opacity: 0.3;
}

.breadcrumb-glass .current {
  color: var(--pks-text-muted);
}

/* Layout */
.article-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
  align-items: start;
}

.article-main-card {
  padding: 0;
  overflow: hidden;
}

.article-header {
  padding: 40px 40px 30px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.cat-tag {
  background: var(--pks-orange);
  color: white;
  padding: 4px 14px;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.meta-item {
  font-size: 0.85rem;
  color: var(--pks-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.article-title {
  font-size: 2.25rem;
  color: var(--pks-navy);
  line-height: 1.3;
  margin: 0;
}

.article-hero-wrap {
  position: relative;
  width: 100%;
  max-height: 500px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  bottom: 0; left: 0; width: 100%; height: 100px;
  background: linear-gradient(to top, rgba(0,0,0,0.1), transparent);
}

.article-body {
  padding: 40px;
}

.content-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--pks-text-dark);
}

.content-text p {
  margin-bottom: 25px;
}

.article-footer {
  padding: 30px 40px 40px;
  border-top: 1px solid var(--pks-navy-light);
}

.share-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.share-label {
  font-weight: 700;
  color: var(--pks-navy);
  font-size: 0.9rem;
}

.share-btns {
  display: flex;
  gap: 12px;
}

.share-btn {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  transition: var(--transition-smooth);
}

.share-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.share-btn.twitter { background: #000000; }
.share-btn.facebook { background: #1877f2; }
.share-btn.whatsapp { background: #25d366; }

/* Sidebar */
.article-sidebar {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.sidebar-section {
  padding: 30px;
}

.sidebar-header {
  margin-bottom: 25px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--pks-orange);
  width: max-content;
}

.sidebar-header h3 {
  font-size: 1.1rem;
  color: var(--pks-navy);
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.related-card {
  display: flex;
  gap: 15px;
  align-items: center;
  text-decoration: none;
}

.related-thumb {
  width: 100px;
  height: 70px;
  min-width: 100px;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.related-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-info h4 {
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--pks-navy);
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-date {
  font-size: 0.75rem;
  color: var(--pks-text-muted);
}

.btn-all-news {
  width: 100%;
}

/* Status States */
.loading-state {
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: var(--pks-text-muted);
}

.loader-wrap i {
  font-size: 2.5rem;
  color: var(--pks-orange);
}

.empty-state {
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-card {
  padding: 60px;
  text-align: center;
}

.empty-card i {
  font-size: 3rem;
  color: #ff9f43;
  margin-bottom: 20px;
  display: block;
}

@media (max-width: 1100px) {
  .article-layout { grid-template-columns: 1fr; }
  .article-sidebar { order: 2; }
}

@media (max-width: 640px) {
  .article-header { padding: 30px 20px; }
  .article-title { font-size: 1.6rem; }
  .article-body { padding: 25px 20px; }
  .content-text { font-size: 1rem; }
  .article-footer { padding: 25px 20px 30px; }
}
</style>

