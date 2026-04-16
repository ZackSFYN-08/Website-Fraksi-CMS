<template>
  <div class="kutipan-media-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Kutipan Media</h1>
        <p>Kumpulan pemberitaan dan sorotan media massa terhadap kiprah serta kontribusi Fraksi PKS Kota Bandung.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container page-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Memuat liputan media...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="media.length === 0" class="empty-state glass-card" data-reveal="fade-up">
        <i class="fas fa-quote-left"></i>
        <p>Belum ada rilis kutipan media saat ini.</p>
        <a href="http://localhost:1337/admin" target="_blank" class="btn btn-sm btn-primary">Kelola di Admin Panel</a>
      </div>

      <!-- Media Grid -->
      <div v-else class="media-grid">
        <router-link 
          :to="`/berita/${m.documentId}`" 
          class="media-card glass-card hover-lift" 
          v-for="(m, index) in media" 
          :key="m.id" 
          data-reveal="fade-up" 
          :data-reveal-delay="index * 120"
        >
          <div class="media-header">
            <span class="source-tag"><i class="fas fa-newspaper"></i> {{ getField(m, 'source') || 'Berita Media' }}</span>
            <span class="media-date"><i class="far fa-clock"></i> {{ formatDate(getField(m, 'date') || getField(m, 'createdAt')) }}</span>
          </div>
          
          <div class="media-body">
            <h3>{{ getField(m, 'title') }}</h3>
            <p>{{ getField(m, 'excerpt') }}</p>
          </div>

          <div class="media-footer">
            <span class="read-link">Lihat Liputan <i class="fas fa-external-link-alt"></i></span>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import api from '../services/api'

useScrollReveal()

const media = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await api.getArticlesByCategory('Kutipan Media')
    media.value = data || []
  } catch (e) {
    console.error('Failed to fetch kutipan-media:', e)
  } finally {
    loading.value = false
  }
})

const getField = (a, field) => a?.[field] || a?.attributes?.[field] || ''
const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.page-content { padding: 40px 0 80px; }

/* Media Grid Modernized */
.media-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.media-card {
  padding: 35px;
  display: flex;
  flex-direction: column;
  border-bottom: 4px solid transparent;
  transition: var(--transition-smooth);
}

.media-card:hover { border-color: var(--pks-orange); }

.media-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.source-tag {
  background: var(--pks-navy-light);
  color: var(--pks-navy);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
}

.source-tag i { color: var(--pks-orange); }

.media-date {
  font-size: 0.78rem;
  color: var(--pks-text-muted);
  font-weight: 600;
}

.media-body h3 {
  font-size: 1.25rem;
  color: var(--pks-navy);
  margin-bottom: 12px;
  line-height: 1.4;
  transition: var(--transition-base);
}

.media-card:hover h3 { color: var(--pks-orange); }

.media-body p {
  font-size: 0.92rem;
  color: var(--pks-text-muted);
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.media-footer {
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid var(--pks-white-smoke);
}

.read-link {
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

.loading-state i { font-size: 2rem; color: var(--pks-orange); }

.empty-state { text-align: center; padding: 80px; }
.empty-state i { font-size: 3rem; color: var(--pks-gray); margin-bottom: 20px; display: block; }

@media (max-width: 900px) {
  .media-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .media-card { padding: 25px; }
  .media-header { flex-direction: column; align-items: flex-start; gap: 10px; }
}
</style>

