<template>
  <div class="pansus-detail-view">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <i class="fas fa-circle-notch fa-spin"></i>
      <span>Memuat detail Pansus...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="!pansus" class="error-state">
      <i class="fas fa-exclamation-triangle"></i>
      <h2>Data Pansus Tidak Ditemukan</h2>
      <p>Mungkin data telah dihapus atau link tidak valid.</p>
      <router-link to="/pansus" class="btn btn-primary">Kembali ke Daftar Pansus</router-link>
    </div>

    <!-- Content State -->
    <div v-else class="detail-container">
      <!-- Header -->
      <header class="detail-header" data-reveal="fade-down">
        <router-link to="/pansus" class="back-link">
          <i class="fas fa-arrow-left"></i> Kembali ke Daftar Pansus
        </router-link>
        
        <div class="header-content">
          <div class="meta-row">
            <span class="status-badge">{{ getField('doc_status') || 'Aktif' }}</span>
            <span class="date-info"><i class="far fa-calendar-alt"></i> {{ formatDate(getField('publish_date')) }}</span>
          </div>
          
          <h1 class="pansus-title">{{ getField('title') }}</h1>
        </div>
      </header>

      <!-- Main Content -->
      <main class="detail-main" data-reveal="fade-up">
        <section class="description-section">
          <h2>Tentang Pansus</h2>
          <div class="desc-content">
            <p>{{ getField('description') }}</p>
          </div>
        </section>

        <!-- Members Section -->
        <section class="members-section" v-if="parsedMembers.length > 0">
          <div class="section-heading">
            <i class="fas fa-users"></i>
            <h2>Susunan Anggota Pansus</h2>
          </div>
          
          <div class="members-grid">
            <div 
              class="member-card-simulated" 
              v-for="(member, index) in parsedMembers" 
              :key="index"
            >
              <div class="member-info-content">
                <div class="role-wrapper">
                  <span class="role-badge" :class="{'badge-orange': member.isLeader}">{{ member.role }}</span>
                </div>
                <div class="name-row">
                  <h3 class="name-display">{{ member.name }}</h3>
                </div>
                <div class="org-footer">
                  <span class="org-name">PANSUS DPRD</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useScrollReveal } from '../composables/useScrollReveal'
import api from '../services/api'

useScrollReveal()
const route = useRoute()

const pansus = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const documentId = route.params.documentId
    const data = await api.getPansus(documentId)
    pansus.value = data
  } catch (error) {
    console.error('Error fetching pansus details:', error)
  } finally {
    loading.value = false
  }
})

const getField = (field) => {
  return pansus.value?.[field] || pansus.value?.attributes?.[field] || ''
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getInitials = (n) => {
  if (!n) return '?'
  const parts = n.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0][0].toUpperCase()
}

const parsedMembers = computed(() => {
  const result = []
  
  if (getField('ketua')) {
    result.push({ name: getField('ketua'), initials: getInitials(getField('ketua')), role: 'Ketua Pansus', isLeader: true })
  }
  
  if (getField('wakil_ketua')) {
    result.push({ name: getField('wakil_ketua'), initials: getInitials(getField('wakil_ketua')), role: 'Wakil Ketua Pansus', isLeader: true })
  }
  
  const rawAnggota = getField('anggota')
  if (rawAnggota) {
    const list = rawAnggota.split('\n').map(n => n.trim()).filter(n => n.length > 0)
    list.forEach(name => {
      result.push({ name, initials: getInitials(name), role: 'Anggota', isLeader: false })
    })
  }
  
  return result
})
</script>

<style scoped>
.pansus-detail-view {
  padding: 60px 0 100px;
  background-color: var(--pks-bg);
  min-height: 80vh;
}

.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header Styles */
.detail-header {
  margin-bottom: 40px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--pks-gray);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 30px;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--pks-orange);
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.status-badge {
  background: var(--pks-success);
  color: white;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

.date-info {
  color: var(--pks-text-muted);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pansus-title {
  font-size: 2.5rem;
  color: var(--pks-navy);
  line-height: 1.3;
  margin: 0;
  font-weight: 800;
}

/* Main Content Styles */
.detail-main {
  background: white;
  border-radius: var(--radius-lg);
  padding: 50px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--pks-gray);
}

.description-section {
  margin-bottom: 50px;
}

.description-section h2 {
  font-size: 1.5rem;
  color: var(--pks-navy);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--pks-white-smoke);
}

.desc-content p {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--pks-text-muted);
}

/* Members Section */
.section-heading {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.section-heading i {
  font-size: 1.8rem;
  color: var(--pks-orange);
}

.section-heading h2 {
  font-size: 1.5rem;
  color: var(--pks-navy);
  margin: 0;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.member-card-simulated {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--pks-gray);
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.member-card-simulated:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--pks-orange);
}

.member-card-simulated:hover .name-display {
  color: var(--pks-orange);
}

.role-wrapper {
  margin-bottom: 15px;
}

.role-badge {
  display: inline-block;
  background: var(--pks-white-smoke);
  color: var(--pks-navy);
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.badge-orange {
  background: var(--pks-orange);
  border-color: var(--pks-orange);
}

.member-info-content {
  padding: 25px;
  background: white;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.name-display {
  font-size: 1.2rem;
  color: var(--pks-navy);
  font-weight: 800;
  line-height: 1.3;
  margin: 0;
}

.name-row {
  margin-bottom: 12px;
}

.org-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.org-name {
  font-size: 0.72rem;
  color: var(--pks-text-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
}

.loading-state i {
  font-size: 3rem;
  color: var(--pks-orange);
  margin-bottom: 20px;
}

.error-state i {
  font-size: 4rem;
  color: var(--pks-danger);
  margin-bottom: 20px;
}

.error-state h2 {
  color: var(--pks-navy);
  margin-bottom: 10px;
}

.error-state p {
  color: var(--pks-text-muted);
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .detail-main {
    padding: 30px 20px;
  }
  .pansus-title {
    font-size: 2rem;
  }
}
</style>
