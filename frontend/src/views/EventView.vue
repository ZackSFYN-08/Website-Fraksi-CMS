<template>
  <div class="event-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Agenda & Event</h1>
        <p>Ikuti rangkaian kegiatan, rapat terbuka, dan agenda kemasyarakatan yang diselenggarakan oleh Fraksi PKS DPRD Kota Bandung.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container page-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Menyusun jadwal kegiatan...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="events.length === 0" class="empty-state glass-card" data-reveal="fade-up">
        <i class="far fa-calendar-times"></i>
        <p>Belum ada agenda kegiatan yang dijadwalkan dalam waktu dekat.</p>
        <a href="http://localhost:1337/admin" target="_blank" class="btn btn-sm btn-primary">Kelola di Admin Panel</a>
      </div>

      <!-- Events List -->
      <div v-else class="events-list">
        <router-link 
          :to="`/berita/${e.documentId}`" 
          class="event-item glass-card hover-lift" 
          v-for="(e, index) in events" 
          :key="e.id" 
          data-reveal="fade-up" 
          :data-reveal-delay="index * 100"
        >
          <div class="event-date-wrap">
            <div class="date-box">
              <span class="day">{{ getDay(e.date || e.createdAt) }}</span>
              <span class="month">{{ getMonth(e.date || e.createdAt) }}</span>
            </div>
            <div class="date-glow"></div>
          </div>
          
          <div class="event-details">
            <div class="event-meta">
              <span class="meta-item"><i class="far fa-clock"></i> {{ getFullTime(e.date || e.createdAt) }}</span>
              <span class="meta-item"><i class="fas fa-tag"></i> Resmi Fraksi</span>
            </div>
            <h3>{{ e.title }}</h3>
            <p class="event-excerpt">{{ e.excerpt || 'Hadiri dan saksikan agenda penting perjuangan Fraksi PKS bersama masyarakat Kota Bandung.' }}</p>
            <div class="event-footer">
              <span class="more-link">Detail Lengkap <i class="fas fa-arrow-right"></i></span>
            </div>
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

const events = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await api.getArticlesByCategory('Event')
    events.value = data || []
  } catch (e) {
    console.error('Failed to fetch events:', e)
  } finally {
    loading.value = false
  }
})

const getDay = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).getDate()
}

const getMonth = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { month: 'short' }).toUpperCase()
}

const getFullTime = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
}
</script>

<style scoped>
.page-content { padding: 40px 0 80px; }

/* Events Layout */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
  max-width: 900px;
  margin: 0 auto;
}

.event-item {
  display: flex;
  gap: 35px;
  padding: 30px;
  align-items: flex-start;
}

.event-date-wrap {
  position: relative;
  flex-shrink: 0;
}

.date-box {
  width: 90px;
  height: 90px;
  background: var(--pks-orange-gradient);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  z-index: 2;
  box-shadow: 0 10px 25px rgba(240, 122, 30, 0.3);
}

.date-box .day {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1;
  font-family: 'Montserrat', sans-serif;
}

.date-box .month {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  margin-top: 2px;
}

.date-glow {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 20px;
  background: var(--pks-orange);
  filter: blur(15px);
  opacity: 0.4;
  z-index: 1;
}

.event-details {
  flex: 1;
}

.event-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.meta-item {
  font-size: 0.8rem;
  color: var(--pks-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.meta-item i { color: var(--pks-orange); }

.event-details h3 {
  font-size: 1.45rem;
  color: var(--pks-navy);
  margin-bottom: 12px;
  line-height: 1.3;
  transition: var(--transition-base);
}

.event-item:hover h3 { color: var(--pks-orange); }

.event-excerpt {
  font-size: 0.95rem;
  color: var(--pks-text-muted);
  line-height: 1.6;
  margin-bottom: 20px;
}

.event-footer {
  display: flex;
  justify-content: flex-start;
}

.more-link {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--pks-orange);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition-base);
}

.event-item:hover .more-link { gap: 12px; }

.banner-blob {
  position: absolute;
  top: -50px;
  left: -50px;
  width: 250px;
  height: 250px;
  background: #27ae60;
  filter: blur(80px);
  opacity: 0.1;
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

@media (max-width: 768px) {
  .event-item { flex-direction: column; padding: 25px; gap: 20px; }
  .event-date-wrap { align-self: center; }
  .event-meta { justify-content: center; }
  .event-details { text-align: center; }
  .event-footer { justify-content: center; }
}
</style>

