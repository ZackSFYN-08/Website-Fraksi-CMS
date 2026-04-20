<template>
  <div class="perda-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Peraturan Daerah (Perda)</h1>
        <p>Dokumentasi resmi dan draf peraturan daerah yang sedang dibahas maupun yang telah disahkan melalui pengawalan Fraksi PKS.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container page-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Memuat data Perda...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="documents.length === 0" class="empty-state glass-card" data-reveal="fade-up">
        <i class="fas fa-file-contract"></i>
        <p>Belum ada database Perda yang diterbitkan di halaman ini.</p>
        <a href="http://localhost:1337/admin" target="_blank" class="btn btn-sm btn-primary">Kelola di Admin Panel</a>
      </div>

      <!-- Result List -->
      <div v-else class="doc-list">
        <div 
          class="doc-card glass-card hover-lift" 
          v-for="(doc, index) in documents" 
          :key="doc.id" 
          data-reveal="fade-up" 
          :data-reveal-delay="index * 100"
        >
          <div class="doc-info">
            <span class="doc-year">{{ getField(doc, 'year') }}</span>
            <h3>{{ getField(doc, 'title') }}</h3>
            <p>{{ getField(doc, 'description') }}</p>
            <div class="doc-meta">
              <span class="status-badge">{{ getField(doc, 'status') || 'Berlaku' }}</span>
              <span class="doc-date"><i class="far fa-calendar-alt"></i> {{ formatDate(getField(doc, 'publish_date')) }}</span>
            </div>
          </div>
          <div class="doc-actions">
            <a v-if="getFileUrl(doc)" :href="getFileUrl(doc)" target="_blank" class="btn btn-navy-outline btn-sm">
              <i class="fas fa-file-pdf"></i> Download PDF
            </a>
            <span v-else class="no-file">File tidak tersedia</span>
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

const documents = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await api.getLegislativeDocuments('Perda')
    documents.value = data || []
  } catch (e) {
    console.error('Failed to fetch Perda documents:', e)
  } finally {
    loading.value = false
  }
})

const getField = (d, field) => d?.[field] || d?.attributes?.[field] || ''
const getFileUrl = (d) => {
  const file = d?.file || d?.attributes?.file
  const url = file?.data?.attributes?.url || file?.url
  if (!url) return null
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
}
const formatDate = (d) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.page-content { padding: 40px 0 80px; }

.doc-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.doc-card {
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.doc-info {
  flex: 1;
}

.doc-year {
  display: inline-block;
  padding: 4px 12px;
  background: var(--pks-orange-light);
  color: var(--pks-orange);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.doc-info h3 {
  font-size: 1.35rem;
  color: var(--pks-navy);
  margin-bottom: 10px;
  line-height: 1.4;
}

.doc-info p {
  color: var(--pks-text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 15px;
}

.doc-meta {
  display: flex;
  align-items: center;
  gap: 20px;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--pks-success);
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-badge::before {
  content: '';
  width: 8px;
  height: 8px;
  background: var(--pks-success);
  border-radius: 50%;
}

.doc-date {
  font-size: 0.8rem;
  color: var(--pks-text-muted);
}

.doc-actions {
  flex-shrink: 0;
}

.no-file {
  font-size: 0.85rem;
  color: var(--pks-text-muted);
  font-style: italic;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 100px 0;
}

.loading-state i, .empty-state i {
  font-size: 3rem;
  color: var(--pks-orange);
  margin-bottom: 20px;
  display: block;
}

.banner-blob {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 300px;
  height: 300px;
  background: var(--pks-navy);
  filter: blur(100px);
  opacity: 0.12;
}

@media (max-width: 768px) {
  .doc-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .doc-actions {
    width: 100%;
  }
  .doc-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

