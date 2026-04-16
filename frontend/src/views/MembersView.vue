<script setup>
import { ref, onMounted } from 'vue'
import MemberCard from '../components/MemberCard.vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import api from '../services/api'

useScrollReveal()

const members = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await api.getMembers({ sort: 'createdAt:asc' })
    members.value = data || []
  } catch (e) {
    console.error('Failed to fetch members:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="members-view">
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Anggota Fraksi PKS</h1>
        <p>Mengenal lebih dekat para wakil rakyat yang berkhidmat untuk warga Kota Bandung periode 2024-2029.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <section class="container members-section">
      <div v-if="loading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Memuat data legislator...</span>
      </div>

      <div v-else-if="members.length === 0" class="empty-state glass-card" data-reveal="fade-up">
        <i class="fas fa-users-slash"></i>
        <p>Data anggota belum tersedia.</p>
        <a href="http://localhost:1337/admin" target="_blank" class="btn btn-sm btn-primary">Kelola di Admin Panel</a>
      </div>

      <div v-else class="members-grid">
        <div v-for="(member, index) in members" :key="member.id || member.nama" data-reveal="fade-up" :data-reveal-delay="index * 100">
          <MemberCard :member="member" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.members-section { padding: 40px 0 80px; }

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.banner-blob {
  position: absolute;
  top: -50px;
  left: -50px;
  width: 200px;
  height: 200px;
  background: var(--pks-orange);
  filter: blur(80px);
  opacity: 0.15;
  z-index: 1;
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

@media (max-width: 640px) {
  .members-grid { gap: 20px; }
}
</style>

