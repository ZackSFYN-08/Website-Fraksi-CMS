<template>
  <div class="aspirasi-berita-view">
    <!-- Page Header -->
    <section v-if="!selectedMember" class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Berita Aspirasi</h1>
        <p>Liputan lengkap seputar perjuangan dan advokasi aspirasi warga oleh Fraksi PKS di parlemen.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container page-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Menyelaraskan data...</span>
      </div>

      <template v-else>
        <!-- Mode 1: Daftar Anggota (Belum ada yang dipilih) -->
        <div v-if="!selectedMember" class="member-selection-grid" data-reveal="fade-up">
          <div class="selection-intro">
            <h3>Pilih Anggota Fraksi</h3>
            <p>Klik pada profil anggota untuk melihat rekam jejak aspirasi dan pelatihan yang dikawal.</p>
          </div>
          
          <div class="members-list">
            <div 
              v-for="m in members" 
              :key="m.id" 
              class="member-selection-card glass-card hover-lift"
              @click="selectMember(m)"
            >
              <div class="m-select-avatar">
                <img v-if="getMemberFoto(m)" :src="getMemberFoto(m)" :alt="getField(m, 'nama')" loading="lazy" />
                <div v-else class="m-placeholder"><i class="fas fa-user"></i></div>
              </div>
              <div class="m-select-info">
                <h4>{{ getField(m, 'nama') }}</h4>
                <span>{{ getField(m, 'jabatan') }}</span>
              </div>
              <div class="m-select-arrow">
                <i class="fas fa-chevron-right"></i>
              </div>
            </div>
          </div>

          <div v-if="members.length === 0" class="empty-state">
            <p>Data anggota belum tersedia.</p>
          </div>
        </div>

        <!-- Mode 2: Daftar Berita (Setelah anggota dipilih) -->
        <div v-else class="member-articles-view" data-reveal="fade-up">
          <div class="view-header">
            <div class="active-member-banner glass-card">
              <div class="banner-avatar">
                <img v-if="getMemberFoto(selectedMember)" :src="getMemberFoto(selectedMember)" loading="lazy" />
              </div>
              <div class="banner-text">
                <h2>Berita Aspirasi: {{ getField(selectedMember, 'nama') }}</h2>
                <p>Kumpulan advokasi dan program pelatihan yang dikawal oleh {{ getField(selectedMember, 'nama') }}.</p>
              </div>
            </div>
          </div>

          <!-- Article List for Selected Member -->
          <div v-if="memberArticles.length > 0" class="news-list">
            <router-link 
              :to="`/aspirasi/berita/${a.documentId}`" 
              class="news-item glass-card hover-lift" 
              v-for="(a, index) in memberArticles" 
              :key="a.id" 
              data-reveal="fade-up" 
              :data-reveal-delay="index * 100"
            >
              <div class="news-thumb">
                <img v-if="getImageUrl(a)" :src="getImageUrl(a)" :alt="getField(a, 'title')" loading="lazy" />
                <div v-else class="img-placeholder"><i class="fas fa-image"></i></div>
              </div>
              <div class="news-body">
                <div class="news-meta">
                  <span class="cat-tag">Aspirasi & Pelatihan</span>
                  <span class="news-date"><i class="far fa-calendar-alt"></i> {{ formatDate(getField(a, 'date') || getField(a, 'createdAt')) }}</span>
                </div>
                <h3>{{ getField(a, 'title') }}</h3>
                <p>{{ getField(a, 'excerpt') }}</p>
                <div class="news-footer">
                  <span class="read-more">Baca Detail Aspirasi <i class="fas fa-chevron-right"></i></span>
                </div>
              </div>
            </router-link>
          </div>

          <div v-else class="empty-state glass-card">
            <i class="fas fa-folder-open"></i>
            <p>Belum ada berita aspirasi spesifik untuk anggota ini.</p>
            <button @click="selectedMember = null" class="btn btn-sm btn-navy-outline">Pilih Anggota Lain</button>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScrollReveal } from '../composables/useScrollReveal'
import api, { STRAPI_URL } from '../services/api'

useScrollReveal()

const route = useRoute()
const router = useRouter()
const members = ref([])
const articles = ref([])
const selectedMember = ref(null)
const memberArticles = ref([])
const loading = ref(true)

const selectMember = (member) => {
  router.push({ query: { member: member.documentId || member.id } })
}

const handleSelectionChange = () => {
  const memberId = route.query.member
  if (!memberId) {
    selectedMember.value = null
    memberArticles.value = []
    return
  }

  const found = members.value.find(m => (m.documentId || m.id).toString() === memberId.toString())
  if (found) {
    selectedMember.value = found
    // Filter articles
    const mId = found.documentId || found.id
    memberArticles.value = articles.value.filter(a => {
      const aMember = a.member || a.attributes?.member
      const aMemberId = aMember?.data?.documentId || aMember?.data?.id || aMember?.documentId || aMember?.id
      return aMemberId === mId
    })
  } else {
    selectedMember.value = null
  }
}

watch(() => route.query.member, () => {
  handleSelectionChange()
})

onMounted(async () => {
  try {
    const [membersData, articlesData] = await Promise.all([
      api.getMembers({ sort: 'createdAt:asc' }),
      api.getAspirationArticles({ populate: '*' })
    ])
    members.value = membersData || []
    articles.value = articlesData || []
    
    // Check initial query
    handleSelectionChange()
  } catch (e) {
    console.error('Failed to fetch data:', e)
  } finally {
    loading.value = false
  }
})

const getMemberFoto = (m) => {
  const foto = m?.foto || m?.attributes?.foto
  if (foto?.data?.attributes?.url) {
    const url = foto.data.attributes.url
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
  }
  if (foto?.url) {
    const url = foto.url
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
  }
  return null
}

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
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.page-content { padding: 40px 0 80px; }

/* Member Selection UI */
.selection-intro {
  text-align: center;
  margin-bottom: 40px;
}

.selection-intro h3 {
  font-size: 1.8rem;
  color: var(--pks-navy);
  margin-bottom: 10px;
}

.selection-intro p {
  color: var(--pks-text-muted);
}

.members-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.member-selection-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.m-select-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--pks-orange-light);
  flex-shrink: 0;
}

.m-select-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.m-select-info {
  flex: 1;
}

.m-select-info h4 {
  font-size: 1.1rem;
  color: var(--pks-navy);
  margin-bottom: 5px;
  font-weight: 800;
}

.m-select-info span {
  font-size: 0.8rem;
  color: var(--pks-text-muted);
  font-weight: 600;
}

.m-select-arrow {
  color: var(--pks-orange);
  opacity: 0.5;
}

.member-selection-card:hover .m-select-arrow {
  opacity: 1;
  transform: translateX(5px);
}

/* Member Articles View */
.member-articles-view {
  margin-top: 100px;
}

.view-header {
  margin-bottom: 40px;
}

.active-member-banner {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 30px;
  background: var(--pks-navy-gradient);
  border: none;
}

.banner-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255,255,255,0.2);
}

.banner-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.banner-text h2 {
  color: white;
  margin-bottom: 8px;
  font-size: 1.8rem;
}

.banner-text p {
  color: rgba(255,255,255,0.7);
  margin: 0;
}

/* News List Modernized */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.news-item {
  display: flex;
  gap: 30px;
  padding: 0;
  overflow: hidden;
  height: 250px;
}

.news-thumb {
  width: 300px;
  min-width: 300px;
  position: relative;
  overflow: hidden;
  background: var(--pks-navy);
}

.news-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: var(--transition-smooth);
  display: block;
}

.news-item:hover .news-thumb img {
  transform: scale(1.1);
}

.news-body {
  padding: 30px 30px 30px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
}

.cat-tag {
  background: var(--pks-orange-light);
  color: var(--pks-orange);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.news-date {
  font-size: 0.8rem;
  color: var(--pks-text-muted);
}

.news-body h3 {
  font-size: 1.35rem;
  color: var(--pks-navy);
  margin-bottom: 10px;
  line-height: 1.4;
  transition: var(--transition-base);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-item:hover h3 {
  color: var(--pks-orange);
}

.news-body p {
  font-size: 0.95rem;
  color: var(--pks-text-muted);
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-footer {
  margin-top: auto;
}

.read-more {
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

@media (max-width: 768px) {
  .active-member-banner { flex-direction: column; text-align: center; gap: 15px; }
  .news-item { flex-direction: column; height: auto; }
  .news-thumb { width: 100%; height: 200px; min-width: 100%; }
  .news-body { padding: 20px; }
}

@media (max-width: 480px) {
  .members-list { grid-template-columns: 1fr; }
}
</style>


