<template>
  <div class="pandangan-fraksi-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Pandangan Fraksi</h1>
        <p>Sikap, telaah, dan pandangan resmi Fraksi PKS DPRD Kota Bandung terhadap berbagai kebijakan strategis daerah.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container page-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Menghimpun pandangan fraksi...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="views.length === 0" class="empty-state glass-card" data-reveal="fade-up">
        <i class="fas fa-landmark-flag"></i>
        <p>Belum ada rilis pandangan fraksi saat ini.</p>
        <a href="http://localhost:1337/admin" target="_blank" class="btn btn-sm btn-primary">Kelola di Admin Panel</a>
      </div>

      <!-- Views List -->
      <div v-else class="views-list">
        <router-link 
          :to="`/berita/${v.documentId}`" 
          class="view-card glass-card hover-lift" 
          v-for="(v, index) in views" 
          :key="v.id" 
          data-reveal="fade-left" 
          :data-reveal-delay="index * 120"
        >
          <header class="card-header">
            <span class="topic-badge"><i class="fas fa-tag"></i> {{ getCategory(v) || 'Fraksi PKS' }}</span>
            <span class="view-date"><i class="far fa-calendar-alt"></i> {{ formatDate(getField(v, 'date') || getField(v, 'createdAt')) }}</span>
          </header>
          
          <div class="card-body">
            <h3>{{ getField(v, 'title') }}</h3>
            <p>{{ getField(v, 'excerpt') }}</p>
          </div>

          <footer class="card-footer">
            <div class="footer-meta">
              <span class="session-tag" v-if="getField(v, 'session')">
                <i class="fas fa-landmark"></i> Masa Sidang: {{ getField(v, 'session') }}
              </span>
            </div>
            <span class="read-link">Baca Selengkapnya <i class="fas fa-chevron-right"></i></span>
          </footer>
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

const views = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await api.getArticlesByCategory('Pandangan Fraksi')
    views.value = data || []
  } catch (e) {
    console.error('Failed to fetch pandangan-fraksi:', e)
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
const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.page-content { padding: 40px 0 80px; }

/* Views List Modernized */
.views-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
  max-width: 1000px;
  margin: 0 auto;
}

.view-card {
  padding: 35px;
  border-left: 5px solid var(--pks-orange);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.topic-badge {
  background: var(--pks-navy-light);
  color: var(--pks-navy);
  padding: 5px 14px;
  border-radius: var(--radius-sm);
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
}

.topic-badge i { color: var(--pks-orange); }

.view-date {
  font-size: 0.8rem;
  color: var(--pks-text-muted);
  font-weight: 600;
}

.card-body h3 {
  font-size: 1.4rem;
  color: var(--pks-navy);
  margin-bottom: 12px;
  line-height: 1.4;
  transition: var(--transition-base);
}

.view-card:hover h3 { color: var(--pks-orange); }

.card-body p {
  font-size: 0.95rem;
  color: var(--pks-text-muted);
  line-height: 1.7;
  margin-bottom: 25px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--pks-white-smoke);
}

.session-tag {
  font-size: 0.8rem;
  color: var(--pks-navy-light);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
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

.loading-state i { font-size: 2rem; color: var(--pks-orange); }

.empty-state { text-align: center; padding: 80px; }
.empty-state i { font-size: 3rem; color: var(--pks-gray); margin-bottom: 20px; display: block; }

@media (max-width: 640px) {
  .view-card { padding: 25px; }
  .card-header { flex-direction: column; align-items: flex-start; gap: 10px; }
  .card-footer { flex-direction: column; align-items: flex-start; gap: 15px; }
}
</style>

