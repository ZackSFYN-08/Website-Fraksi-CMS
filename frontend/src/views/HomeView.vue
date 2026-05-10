<script setup>
import Hero from '../components/Hero.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import api, { STRAPI_URL } from '../services/api'
import { useScrollReveal } from '../composables/useScrollReveal'

useScrollReveal()

const articles = ref([])
const loading = ref(true)

const quickLinks = ref([
  { icon: 'fas fa-users-gear', title: 'ANGGOTA', titleBold: 'FRAKSI', desc: 'Kenali wakil rakyat PKS di DPRD Kota Bandung', link: '/anggota' },
  { icon: 'fas fa-envelope-open-text', title: 'ASPIRASI', titleBold: 'WARGA', desc: 'Sampaikan aspirasi dan keluhan Anda langsung', link: '/aspirasi/form' },
  { icon: 'fas fa-newspaper', title: 'BERITA', titleBold: 'FRAKSI', desc: 'Update kegiatan dan perjuangan di parlemen', link: '/berita' },
])

const featuredArticle = ref(null)
const sideNews = ref([])

const aspirationArticles = ref([])
const activeAspirationIndex = ref(0)
let sliderInterval = null

const startSlider = () => {
  if (aspirationArticles.value.length > 1) {
    sliderInterval = setInterval(() => {
      activeAspirationIndex.value = (activeAspirationIndex.value + 1) % aspirationArticles.value.length
    }, 5000)
  }
}

onMounted(async () => {
  loading.value = true
  
  // Fetch regular articles
  try {
    const data = await api.getArticles({ sort: 'date:desc', 'pagination[limit]': 4, populate: '*' })
    articles.value = data || []
    if (articles.value.length > 0) {
      featuredArticle.value = articles.value[0]
      sideNews.value = articles.value.slice(1, 4)
    }
  } catch (e) {
    console.error('Failed to fetch regular articles:', e)
  }

  // Fetch aspiration articles separately
  try {
    const aspData = await api.getAspirationArticles({ sort: 'date:desc', 'pagination[limit]': 5, populate: '*' })
    aspirationArticles.value = aspData || []
    startSlider()
  } catch (e) {
    console.error('Failed to fetch aspiration articles. Did you set Public permissions in Strapi?', e)
  }

  loading.value = false
})

onUnmounted(() => {
  if (sliderInterval) clearInterval(sliderInterval)
})

const getImageUrl = (article) => {
  const img = article?.image || article?.attributes?.image
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

const getField = (article, field) => {
  return article?.[field] || article?.attributes?.[field] || ''
}

const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} hari lalu`
  const weeks = Math.floor(days / 7)
  return `${weeks} minggu lalu`
}
</script>

<template>
  <div class="home-view">
    <Hero />

    <!-- Aspiration Carousel Section -->
    <section class="container aspiration-carousel-section" v-if="aspirationArticles.length > 0">
      <div class="carousel-container glass-card" data-reveal="fade-up">
        <div class="carousel-track">
          <transition-group name="slide-fade" tag="div" class="carousel-items">
            <router-link 
              v-for="(item, index) in aspirationArticles" 
              :key="item.id"
              v-show="index === activeAspirationIndex"
              :to="`/aspirasi/berita/${item.documentId}`" 
              class="carousel-item"
            >
              <img v-if="getImageUrl(item)" :src="getImageUrl(item)" :alt="getField(item, 'title')" class="carousel-img" />
              <div class="carousel-overlay">
                <span class="badge-aspiration">Sorotan Aspirasi</span>
                <h3>{{ getField(item, 'title') }}</h3>
              </div>
            </router-link>
          </transition-group>
        </div>
        
        <!-- Controls -->
        <div class="carousel-indicators" v-if="aspirationArticles.length > 1">
          <button 
            v-for="(_, index) in aspirationArticles" 
            :key="index"
            :class="['indicator-dot', { active: index === activeAspirationIndex }]"
            @click="() => { activeAspirationIndex = index; if(sliderInterval) { clearInterval(sliderInterval); startSlider(); } }"
          ></button>
        </div>
      </div>
    </section>

    <!-- Berita Section -->
    <section class="container news-section">
      <div class="section-header" data-reveal="fade-up">
        <span class="section-tag">Update Terbaru</span>
        <h2>Berita & Kegiatan Fraksi</h2>
      </div>

      <div v-if="loading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Menyelaraskan data berita...</span>
      </div>

      <div v-else-if="articles.length === 0" class="empty-state glass-card" data-reveal="fade-up">
        <i class="fas fa-newspaper"></i>
        <p>Belum ada berita yang diterbitkan.</p>
        <a href="http://localhost:1337/admin" target="_blank" class="btn btn-sm btn-primary">Buka Admin Panel</a>
      </div>

      <div v-else class="news-layout">
        <router-link :to="`/berita/${featuredArticle.documentId}`" class="news-featured glass-card hover-lift" v-if="featuredArticle" data-reveal="fade-up">
          <div class="featured-img-wrap">
            <img v-if="getImageUrl(featuredArticle)" :src="getImageUrl(featuredArticle)" :alt="getField(featuredArticle, 'title')" class="featured-img" />
            <div v-else class="img-placeholder"><i class="fas fa-image"></i></div>
            <div class="img-overlay"></div>
          </div>
          <div class="featured-content">
            <span class="news-time"><i class="far fa-clock"></i> {{ timeAgo(getField(featuredArticle, 'date') || getField(featuredArticle, 'createdAt')) }}</span>
            <h3>{{ getField(featuredArticle, 'title') }}</h3>
            <p>{{ getField(featuredArticle, 'excerpt') }}</p>
            <span class="read-more">Baca Selengkapnya <i class="fas fa-arrow-right"></i></span>
          </div>
        </router-link>

        <div class="news-sidebar">
          <router-link :to="`/berita/${item.documentId}`" class="sidebar-item glass-card hover-lift" v-for="(item, index) in sideNews" :key="item.id" data-reveal="fade-left" :data-reveal-delay="index * 100">
            <div class="sidebar-img-wrap">
              <img v-if="getImageUrl(item)" :src="getImageUrl(item)" :alt="getField(item, 'title')" />
              <div v-else class="img-placeholder-sm"><i class="fas fa-image"></i></div>
            </div>
            <div class="sidebar-text">
              <span class="news-time">{{ timeAgo(getField(item, 'date') || getField(item, 'createdAt')) }}</span>
              <h4>{{ getField(item, 'title') }}</h4>
            </div>
          </router-link>
          <router-link to="/berita" class="btn btn-nav btn-dark see-more-btn" data-reveal="fade-up" data-reveal-delay="400">
            Lihat Semua Berita <i class="fas fa-chevron-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Quick Links -->
    <section class="container quicklinks-section">
      <div class="quicklinks-grid">
        <router-link :to="item.link" class="quicklink-card glass-card hover-lift" v-for="(item, index) in quickLinks" :key="item.title" data-reveal="zoom" :data-reveal-delay="index * 150">
          <div class="ql-icon"><i :class="item.icon"></i></div>
          <div class="ql-text">
            <h3>{{ item.title }}<strong> {{ item.titleBold }}</strong></h3>
            <p>{{ item.desc }}</p>
          </div>
          <div class="ql-arrow"><i class="fas fa-arrow-right"></i></div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.news-section { padding: 80px 0 40px; }

/* Carousel Section */
.aspiration-carousel-section {
  padding: 60px 0 0;
}

.carousel-container {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  padding: 0;
  height: 450px;
  background: var(--pks-navy);
}

.carousel-track {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-items {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-item {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 6s ease;
}

.carousel-item:hover .carousel-img {
  transform: scale(1.05);
}

.carousel-overlay {
  position: absolute;
  bottom: 0; left: 0; width: 100%;
  padding: 80px 40px 40px;
  background: linear-gradient(to top, rgba(0,34,68,0.9), transparent);
  color: white;
}

.badge-aspiration {
  background: var(--pks-orange-gradient);
  color: white;
  padding: 6px 18px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 15px;
  display: inline-block;
  box-shadow: 0 4px 15px rgba(240, 122, 30, 0.4);
}

.carousel-overlay h3 {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.3;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  max-width: 800px;
}

.carousel-indicators {
  position: absolute;
  bottom: 30px;
  right: 40px;
  display: flex;
  gap: 10px;
  z-index: 10;
}

.indicator-dot {
  width: 12px; height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  background: var(--pks-orange);
  width: 35px;
  border-radius: 10px;
}

/* Vue Transitions for Carousel */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 1s ease, transform 1s cubic-bezier(0.25, 1, 0.5, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: scale(1.02);
}

.slide-fade-leave-to {
  opacity: 0;
}

.news-layout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 40px;
}

/* Featured Card */
.news-featured {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.featured-img-wrap {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.featured-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-smooth);
}

.news-featured:hover .featured-img {
  transform: scale(1.05);
}

.img-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.6));
}

.featured-content {
  padding: 30px;
}

.news-time {
  font-size: 0.8rem;
  color: var(--pks-orange);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}

.featured-content h3 {
  font-size: 1.75rem;
  margin-bottom: 15px;
  color: var(--pks-navy);
  line-height: 1.3;
}

.featured-content p {
  font-size: 0.95rem;
  color: var(--pks-text-muted);
  line-height: 1.7;
  margin-bottom: 25px;
}

.read-more {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--pks-navy);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: var(--transition-base);
}

.news-featured:hover .read-more {
  color: var(--pks-orange);
  gap: 15px;
}

/* Sidebar News */
.news-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-item {
  display: flex;
  gap: 20px;
  padding: 15px;
  align-items: center;
}

.sidebar-img-wrap {
  width: 120px;
  height: 90px;
  min-width: 120px;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.sidebar-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-text h4 {
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--pks-navy);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.see-more-btn {
  margin-top: 10px;
  align-self: flex-start;
}

/* Quick Links */
.quicklinks-section { padding: 40px 0 80px; }
.quicklinks-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.quicklink-card {
  padding: 35px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  transition: var(--transition-smooth);
}

.ql-icon {
  width: 60px;
  height: 60px;
  background: var(--pks-orange-light);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: var(--pks-orange);
  transition: var(--transition-smooth);
}

.quicklink-card:hover .ql-icon {
  background: var(--pks-orange);
  color: white;
  transform: rotate(-10deg) scale(1.1);
}

.ql-text h3 {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--pks-text-dark);
}

.ql-text h3 strong {
  color: var(--pks-orange);
  font-weight: 800;
}

.ql-text p {
  font-size: 0.88rem;
  color: var(--pks-text-muted);
  line-height: 1.5;
  margin-top: 5px;
}

.ql-arrow {
  position: absolute;
  bottom: 35px;
  right: 35px;
  opacity: 0;
  transform: translateX(-10px);
  transition: var(--transition-smooth);
  color: var(--pks-orange);
}

.quicklink-card:hover .ql-arrow {
  opacity: 1;
  transform: translateX(0);
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
  padding: 60px;
}

.empty-state i {
  font-size: 3rem;
  color: var(--pks-gray);
  margin-bottom: 20px;
  display: block;
}

@media (max-width: 992px) {
  .news-layout { grid-template-columns: 1fr; }
  .quicklinks-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 640px) {
  .carousel-container { height: 280px; }
  .carousel-overlay { padding: 40px 20px 20px; }
  .carousel-overlay h3 { font-size: 1.3rem; }
  .carousel-indicators { right: 20px; bottom: 20px; }
  .news-section { padding: 40px 0; }
  .quicklink-card { padding: 25px; }
  .quicklinks-grid { grid-template-columns: 1fr; }
  .featured-img-wrap { height: 250px; }
  .featured-content h3 { font-size: 1.4rem; }
  .sidebar-img-wrap { width: 90px; height: 70px; min-width: 90px; }
  .sidebar-item { gap: 15px; padding: 12px; }
  .see-more-btn { width: 100%; justify-content: center; }
}
</style>

