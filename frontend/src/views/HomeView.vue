<script setup>
import Hero from '../components/Hero.vue'
import { ref, onMounted, onUnmounted, computed } from 'vue'
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

// Aspiration slider state
const aspirationArticles = ref([])
const activeIndex = ref(0)
const sideNews = ref([])
let sliderTimer = null

const currentAspiration = computed(() => aspirationArticles.value[activeIndex.value] || null)

const startSlider = () => {
  if (aspirationArticles.value.length > 1) {
    sliderTimer = setInterval(() => {
      activeIndex.value = (activeIndex.value + 1) % aspirationArticles.value.length
    }, 5000)
  }
}

const goToSlide = (index) => {
  activeIndex.value = index
  clearInterval(sliderTimer)
  startSlider()
}

const prevSlide = () => {
  const len = aspirationArticles.value.length
  activeIndex.value = (activeIndex.value - 1 + len) % len
  clearInterval(sliderTimer)
  startSlider()
}

const nextSlide = () => {
  activeIndex.value = (activeIndex.value + 1) % aspirationArticles.value.length
  clearInterval(sliderTimer)
  startSlider()
}

onMounted(async () => {
  loading.value = true

  // Fetch aspiration articles (for featured slider)
  try {
    const aspData = await api.getAspirationArticles({ sort: 'date:desc', 'pagination[limit]': 5, populate: '*' })
    aspirationArticles.value = aspData || []
    startSlider()
  } catch (e) {
    console.error('Failed to fetch aspiration articles:', e)
  }

  // Fetch regular articles (for sidebar)
  try {
    const data = await api.getArticles({ sort: 'date:desc', 'pagination[limit]': 5, populate: '*' })
    articles.value = data || []
    sideNews.value = articles.value.slice(0, 5)
  } catch (e) {
    console.error('Failed to fetch regular articles:', e)
  }

  loading.value = false
})

onUnmounted(() => {
  clearInterval(sliderTimer)
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

    <!-- Berita & Kegiatan Fraksi Section -->
    <section class="container news-section">
      <div class="section-header" data-reveal="fade-up">
        <span class="section-tag">Update Terbaru</span>
        <h2>Berita & Kegiatan Fraksi</h2>
      </div>

      <div v-if="loading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Menyelaraskan data berita...</span>
      </div>

      <div v-else class="news-layout">
        <!-- Featured: Slider Berita Aspirasi -->
        <div class="news-featured glass-card" data-reveal="fade-up" v-if="aspirationArticles.length > 0">
          <div class="featured-slider">
            <transition name="featured-slide" mode="out-in">
              <router-link
                :key="activeIndex"
                :to="`/aspirasi/berita/${currentAspiration.documentId}`"
                class="featured-slide-link"
              >
                <div class="featured-img-wrap">
                  <img v-if="getImageUrl(currentAspiration)" :src="getImageUrl(currentAspiration)" :alt="getField(currentAspiration, 'title')" class="featured-img" />
                  <div v-else class="img-placeholder"><i class="fas fa-image"></i></div>
                  <div class="img-overlay"></div>
                  <span class="featured-badge"><i class="fas fa-bullhorn"></i> Sorotan Aspirasi</span>
                  <template v-if="aspirationArticles.length > 1">
                    <button class="slider-arrow slider-prev" @click.prevent="prevSlide"><i class="fas fa-chevron-left"></i></button>
                    <button class="slider-arrow slider-next" @click.prevent="nextSlide"><i class="fas fa-chevron-right"></i></button>
                  </template>
                </div>
                <div class="featured-content">
                  <span class="news-time"><i class="far fa-clock"></i> {{ timeAgo(getField(currentAspiration, 'date') || getField(currentAspiration, 'createdAt')) }}</span>
                  <h3>{{ getField(currentAspiration, 'title') }}</h3>
                  <p>{{ getField(currentAspiration, 'excerpt') }}</p>
                  <span class="read-more">Baca Selengkapnya <i class="fas fa-arrow-right"></i></span>
                </div>
              </router-link>
            </transition>
          </div>
          <!-- Indikator titik -->
          <div class="featured-indicators" v-if="aspirationArticles.length > 1">
            <button
              v-for="(_, i) in aspirationArticles"
              :key="i"
              :class="['feat-dot', { active: i === activeIndex }]"
              @click="goToSlide(i)"
            ></button>
          </div>
        </div>

        <!-- Fallback jika belum ada berita aspirasi -->
        <div v-else class="news-featured-empty glass-card" data-reveal="fade-up">
          <i class="fas fa-bullhorn"></i>
          <p>Belum ada Berita Aspirasi. Tambahkan di Admin Panel.</p>
        </div>

        <!-- Sidebar: Berita Fraksi Biasa -->
        <div class="news-sidebar">
          <router-link
            :to="`/berita/${item.documentId}`"
            class="sidebar-item glass-card hover-lift"
            v-for="(item, index) in sideNews"
            :key="item.id"
            data-reveal="fade-left"
            :data-reveal-delay="index * 100"
          >
            <div class="sidebar-img-wrap">
              <img v-if="getImageUrl(item)" :src="getImageUrl(item)" :alt="getField(item, 'title')" loading="lazy" />
              <div v-else class="img-placeholder-sm"><i class="fas fa-image"></i></div>
            </div>
            <div class="sidebar-text">
              <span class="news-time">{{ timeAgo(getField(item, 'date') || getField(item, 'createdAt')) }}</span>
              <h4>{{ getField(item, 'title') }}</h4>
            </div>
          </router-link>

          <div v-if="sideNews.length === 0 && !loading" class="sidebar-empty">
            <p>Belum ada berita fraksi.</p>
          </div>

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
  position: relative;
}

/* Slider wrapper */
.featured-slider {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.featured-slide-link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
}

/* Transition animasi slide */
.featured-slide-enter-active,
.featured-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.featured-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.featured-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Indikator titik di bawah card */
.featured-indicators {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 14px 0 10px;
  background: white;
}

.feat-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(0, 34, 68, 0.2);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feat-dot.active {
  background: var(--pks-orange);
  width: 28px;
  border-radius: 8px;
}

/* Tombol panah kiri/kanan */
.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.9);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--pks-navy);
  font-size: 0.9rem;
  box-shadow: 0 3px 12px rgba(0,0,0,0.2);
  transition: all 0.25s ease;
  z-index: 5;
}

.slider-arrow:hover {
  background: var(--pks-orange);
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.slider-prev { left: 15px; }
.slider-next { right: 15px; }

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

/* Badge "Sorotan Aspirasi" di atas gambar featured */
.featured-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: var(--pks-orange);
  color: white;
  padding: 7px 18px;
  border-radius: 30px;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(240, 122, 30, 0.45);
  z-index: 2;
}

/* Fallback jika belum ada berita aspirasi */
.news-featured-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  text-align: center;
  padding: 60px 30px;
  color: var(--pks-text-muted);
}

.news-featured-empty i {
  font-size: 3rem;
  color: var(--pks-gray);
}

/* Sidebar empty */
.sidebar-empty {
  text-align: center;
  padding: 30px;
  color: var(--pks-text-muted);
  font-size: 0.9rem;
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
  justify-content: space-between; /* Berita tersebar mengisi ruang */
  gap: 10px;
  height: 100%;               /* Isi seluruh tinggi sidebar */
}

.sidebar-item {
  display: flex;
  gap: 14px;
  padding: 12px;
  align-items: center;
  flex: 1;                    /* Setiap item tumbuh sama rata */
  min-height: 0;              /* Cegah overflow di flex */
}

.sidebar-img-wrap {
  width: 105px;
  height: 78px;
  min-width: 105px;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.sidebar-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-text {
  flex: 1;
  min-width: 0; /* Cegah teks meluber */
}

.sidebar-text h4 {
  font-size: 0.92rem;
  line-height: 1.4;
  color: var(--pks-navy);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 2px;
}

.see-more-btn {
  margin-top: 4px;
  align-self: flex-start;
  flex-shrink: 0;
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
  .news-featured { height: auto; }
}

@media (max-width: 768px) {
  .news-section { padding: 50px 0 30px; }
  .quicklinks-section { padding: 20px 0 60px; }
  .featured-content { padding: 20px; }
  .featured-content h3 { font-size: 1.35rem; }
  .featured-img-wrap { height: 260px; }
  .news-featured-empty { padding: 40px 20px; }
  .feat-dot { width: 8px; height: 8px; }
  .feat-dot.active { width: 22px; }
  .slider-arrow { width: 34px; height: 34px; font-size: 0.8rem; }
}

@media (max-width: 640px) {
  .news-section { padding: 40px 0; }
  .quicklink-card { padding: 20px; gap: 14px; }
  .quicklinks-grid { grid-template-columns: 1fr; }
  .featured-img-wrap { height: 220px; }
  .featured-content h3 { font-size: 1.2rem; }
  .featured-content p { font-size: 0.88rem; margin-bottom: 15px; }
  .featured-content { padding: 16px; }
  .sidebar-img-wrap { width: 90px; height: 70px; min-width: 90px; }
  .sidebar-item { gap: 12px; padding: 12px; }
  .sidebar-text h4 { font-size: 0.88rem; }
  .see-more-btn { width: 100%; justify-content: center; }
  .ql-icon { width: 48px; height: 48px; font-size: 1.4rem; }
  .ql-text h3 { font-size: 1rem; }
  .featured-indicators { padding: 10px 0 8px; }
}
</style>

