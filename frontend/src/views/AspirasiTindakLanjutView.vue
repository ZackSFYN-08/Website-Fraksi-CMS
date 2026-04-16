<template>
  <div class="aspirasi-tindak-lanjut-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Tindak Lanjut Aspirasi</h1>
        <p>Transparansi laporan hasil tindak lanjut dari setiap aspirasi yang telah diperjuangkan oleh Fraksi PKS.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container page-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Memuat data tindak lanjut...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="items.length === 0" class="empty-state glass-card" data-reveal="fade-up">
        <i class="fas fa-clipboard-check"></i>
        <p>Belum ada laporan tindak lanjut aspirasi saat ini.</p>
        <a href="http://localhost:1337/admin" target="_blank" class="btn btn-sm btn-primary">Kelola di Admin Panel</a>
      </div>

      <!-- Timeline List -->
      <div v-else class="timeline">
        <div 
          class="timeline-item" 
          v-for="(t, index) in items" 
          :key="t.id" 
          :class="t.status" 
          data-reveal="fade-left" 
          :data-reveal-delay="index * 120"
        >
          <div class="timeline-dot-wrap">
            <div class="timeline-dot shadow-pop"></div>
            <div class="timeline-line"></div>
          </div>
          
          <div class="timeline-card glass-card hover-lift">
            <header class="card-header">
              <span class="status-badge" :class="t.status">
                <i :class="getStatusIcon(t.status)"></i>
                {{ t.statusText || t.status }}
              </span>
              <span class="timeline-date"><i class="far fa-clock"></i> {{ formatDate(t.date || t.createdAt) }}</span>
            </header>
            <div class="card-body">
              <h3>{{ t.title }}</h3>
              <p>{{ t.description || t.desc }}</p>
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
import api from '../services/api'

useScrollReveal()

const items = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await api.getFollowups()
    items.value = data || []
  } catch (e) {
    console.error('Failed to fetch followups:', e)
  } finally {
    loading.value = false
  }
})

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'done': return 'fas fa-check-circle'
    case 'progress': return 'fas fa-sync-alt fa-spin'
    case 'pending': return 'fas fa-hourglass-half'
    default: return 'fas fa-info-circle'
  }
}

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.page-content { padding: 40px 0 80px; }

/* Timeline Modernized */
.timeline {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  padding-left: 60px;
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
}

.timeline-item:last-child { margin-bottom: 0; }

.timeline-dot-wrap {
  position: absolute;
  left: -60px;
  top: 0;
  bottom: -40px;
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 4px solid var(--pks-white);
  background: var(--pks-orange);
  z-index: 2;
  box-shadow: 0 0 0 4px var(--pks-orange-light);
}

.timeline-item.progress .timeline-dot {
  background: #3498db;
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.2);
}

.timeline-item.pending .timeline-dot {
  background: #f1c40f;
  box-shadow: 0 0 0 4px rgba(241, 196, 15, 0.2);
}

.timeline-line {
  flex: 1;
  width: 3px;
  background: linear-gradient(to bottom, var(--pks-navy-light), transparent);
  opacity: 0.3;
  margin: 10px 0;
}

.timeline-item:last-child .timeline-line { display: none; }

.timeline-card {
  padding: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.done { background: #e8f5e9; color: #2e7d32; }
.status-badge.progress { background: #e3f2fd; color: #1565c0; }
.status-badge.pending { background: #fff8e1; color: #f57f17; }

.timeline-date {
  font-size: 0.8rem;
  color: var(--pks-text-muted);
  font-weight: 600;
}

.card-body h3 {
  font-size: 1.25rem;
  color: var(--pks-navy);
  margin-bottom: 12px;
}

.card-body p {
  font-size: 0.95rem;
  color: var(--pks-text-muted);
  line-height: 1.7;
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

@media (max-width: 640px) {
  .timeline { padding-left: 50px; }
  .timeline-dot-wrap { left: -50px; width: 30px; }
  .timeline-card { padding: 20px; }
  .card-header { flex-direction: column; align-items: flex-start; gap: 10px; }
  .timeline-date { margin-left: 0; }
}
</style>

