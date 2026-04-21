<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import api, { STRAPI_URL } from '../services/api'
import { useScrollReveal } from '../composables/useScrollReveal'
import anime from 'animejs'

useScrollReveal()

const route = useRoute()
const member = ref(null)
const allMembers = ref([])
const loading = ref(true)
const totalSuaraDisplay = ref('0')
const totalSuaraVal = computed(() => Number(f('total_suara', 0)) || 0)

const hasVotes = computed(() => {
  const breakdown = member.value?.suara_kecamatan || member.value?.attributes?.suara_kecamatan
  return Array.isArray(breakdown) && breakdown.length > 0
})

// Function to fetch data
// Watch for member data to trigger animations once DOM is ready
watch(member, (newVal) => {
  if (newVal) {
    console.log('Member data loaded, triggering animations for:', newVal.nama || newVal.attributes?.nama)
    nextTick(() => {
      setTimeout(animateVotes, 200)
    })
  }
}, { deep: true })

const fetchData = async (documentId) => {
  console.log('fetchData called with ID:', documentId)
  loading.value = true
  try {
    const data = await api.getMember(documentId)
    console.log('API Response received:', data)
    member.value = data || null
    // Get other members
    const members = await api.getMembers({ sort: 'createdAt:asc' })
    allMembers.value = (members || []).filter(m => (m.documentId || m.id) !== (data?.documentId || data?.id))
  } catch (e) {
    console.error('Failed to fetch member:', e)
  } finally {
    loading.value = false
  }
}

const animateVotes = () => {
  const total = totalSuaraVal.value
  if (total > 0) {
    anime({
      targets: { val: 0 },
      val: total,
      duration: 1500,
      easing: 'easeOutExpo',
      update: (anim) => {
        totalSuaraDisplay.value = Math.round(anim.animations[0].currentValue).toLocaleString('id-ID')
      }
    })
  } else {
    totalSuaraDisplay.value = '0'
  }

  nextTick(() => {
    const items = document.querySelectorAll('.vote-bar-item')
    if (items.length > 0) {
      anime({
        targets: items,
        opacity: [0, 1],
        translateX: [-30, 0],
        delay: anime.stagger(100),
        duration: 800,
        easing: 'easeOutQuad'
      })

      // Animate progress bars
      const progressBars = document.querySelectorAll('.progress-fill')
      anime({
        targets: progressBars,
        width: (el) => el.dataset.width + '%',
        duration: 1200,
        delay: anime.stagger(100, { start: 200 }),
        easing: 'easeOutExpo'
      })
    }
  })
}

onMounted(() => {
  fetchData(route.params.documentId)
})

// Watch for route changes to refresh data
import { watch } from 'vue'
watch(() => route.params.documentId, (newId) => {
  if (newId) fetchData(newId)
})

const f = (field, fallback = '') => {
  if (!member.value) return fallback
  // Handle both flat and nested structures
  const val = member.value[field] !== undefined ? member.value[field] : member.value.attributes?.[field]
  return val !== undefined && val !== null ? val : fallback
}

const fotoUrl = computed(() => {
  const m = member.value
  if (!m) return null
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

const bioParagraphs = computed(() => {
  const bio = f('bio')
  if (!bio) return []
  return bio.split('\n').filter(p => p.trim())
})
</script>

<template>
  <div class="member-detail-view">
    <!-- States -->
    <div v-if="loading" class="loading-state container">
      <div class="loader">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Menyelaraskan profil legislator...</span>
      </div>
    </div>

    <div v-else-if="!member" class="empty-state container" data-reveal="fade-up">
      <div class="glass-card empty-box">
        <i class="fas fa-user-slash"></i>
        <p>Profil anggota tidak ditemukan atau sudah tidak aktif.</p>
        <router-link to="/anggota" class="btn btn-primary">
          <i class="fas fa-arrow-left"></i> Kembali ke Anggota
        </router-link>
      </div>
    </div>

    <template v-else>
      <!-- Breadcrumb -->
      <nav class="container breadcrumb-nav" data-reveal="fade-down">
        <router-link to="/">Beranda</router-link>
        <i class="fas fa-chevron-right"></i>
        <router-link to="/anggota">Anggota Fraksi</router-link>
        <i class="fas fa-chevron-right"></i>
        <span class="active">Detail Profil</span>
      </nav>

      <!-- Profile Hero Header -->
      <section class="container profile-header-section" data-reveal="fade-up">
        <div class="profile-hero-card">
          <div class="hero-bg-accent"></div>
          <div class="hero-content">
            <div class="photo-wrapper">
              <div class="photo-glow"></div>
              <div class="photo-frame">
                <img v-if="fotoUrl" :src="fotoUrl" :alt="f('nama')" />
                <div v-else class="photo-placeholder"><i class="fas fa-user"></i></div>
              </div>
            </div>
            <div class="header-info">
              <span class="badge-accent">{{ f('jabatan') }}</span>
              <h1>{{ f('nama') }}</h1>
              <div class="quick-stats">
                <div class="q-stat" v-if="f('dapil')">
                  <i class="fas fa-map-location-dot"></i>
                  <span>{{ f('dapil') }}</span>
                </div>
                <div class="q-stat" v-if="f('komisi')">
                  <i class="fas fa-building-user"></i>
                  <span>{{ f('komisi') }}</span>
                </div>
                <div class="q-stat">
                  <i class="fas fa-shield-heart"></i>
                  <span>Fraksi PKS</span>
                </div>
              </div>
            </div>
          </div>
          <div class="hero-decoration"></div>
        </div>
      </section>

      <!-- Profile Details -->
      <section class="container profile-body-section">
        <div class="content-layout">
          <!-- Main Info -->
          <main class="profile-main" data-reveal="fade-up" data-reveal-delay="100">
            <!-- Details Grid -->
            <div class="glass-card details-card">
              <div class="section-title">
                <i class="fas fa-id-card-clip"></i>
                <h2>Informasi Legislator</h2>
              </div>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="label">Nama Lengkap</span>
                  <p class="value">{{ f('nama') }}</p>
                </div>
                <div class="detail-item">
                  <span class="label">Jabatan Struktural</span>
                  <p class="value">{{ f('jabatan') }}</p>
                </div>
                <div class="detail-item" v-if="f('dapil')">
                  <span class="label">Wilayah Dapil</span>
                  <p class="value">{{ f('dapil') }}</p>
                </div>
                <div class="detail-item" v-if="f('komisi')">
                  <span class="label">Penugasan Komisi</span>
                  <p class="value">{{ f('komisi') }}</p>
                </div>
                <div class="detail-item">
                  <span class="label">Fraksi</span>
                  <p class="value">Partai Keadilan Sejahtera</p>
                </div>
                <div class="detail-item">
                  <span class="label">Periode Bakti</span>
                  <p class="value">2024 – 2029</p>
                </div>
              </div>
            </div>

            <!-- Bio Section -->
            <div class="glass-card bio-card" v-if="bioParagraphs.length > 0">
              <div class="section-title">
                <i class="fas fa-user-pen"></i>
                <h2>Biografi Singkat</h2>
              </div>
              <div class="bio-text">
                <p v-for="(p, i) in bioParagraphs" :key="i">{{ p }}</p>
              </div>
            </div>

            <!-- Vote Distribution Section -->
            <div class="glass-card votes-card" v-if="hasVotes || f('total_suara')">
              <div class="section-title">
                <i class="fas fa-chart-simple"></i>
                <h2>Perolehan Suara Legislator</h2>
              </div>

              <div class="votes-summary-row">
                <div class="total-suara-highlight">
                  <span class="ts-label">Total Suara Sah</span>
                  <div class="ts-value">{{ totalSuaraDisplay }}</div>
                  <div class="ts-sub">Hasil Pleno KPU 2024</div>
                </div>
                <div class="total-suara-icon">
                  <i class="fas fa-envelope-open-text"></i>
                </div>
              </div>

              <div class="kecamatan-breakdown" v-if="hasVotes">
                <h3 class="breakdown-title">Distribusi per Wilayah</h3>
                <div class="votes-list">
                  <div 
                    v-for="item in (member.suara_kecamatan || member.attributes?.suara_kecamatan)" 
                    :key="item.id" 
                    class="vote-bar-item"
                  >
                    <div class="v-header">
                      <span class="v-kec">{{ item.kecamatan }}</span>
                      <span class="v-val">{{ (item.suara || 0).toLocaleString('id-ID') }}</span>
                    </div>
                    <div class="v-progress-bg">
                      <div 
                        class="progress-fill" 
                        :data-width="totalSuaraVal > 0 ? ((item.suara || 0) / totalSuaraVal * 100) : 0"
                        style="width: 0%"
                      ></div>
                    </div>
                    <div class="v-perc text-xs" v-if="totalSuaraVal > 0">
                      {{ ((item.suara || 0) / totalSuaraVal * 100).toFixed(1) }}% dari total
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <!-- Sidebar -->
          <aside class="profile-sidebar" data-reveal="fade-left" data-reveal-delay="200">
            <div class="glass-card sidebar-list">
              <h3>Anggota Lainnya</h3>
              <div class="others-list">
                <router-link
                  v-for="m in allMembers.slice(0, 5)"
                  :key="m.id"
                  :to="`/anggota/${m.documentId || m.id}`"
                  class="other-member-link hover-lift"
                >
                  <div class="m-avatar">
                    <img v-if="getMemberFoto(m)" :src="getMemberFoto(m)" :alt="m.nama || m.attributes?.nama" />
                    <div v-else class="m-placeholder"><i class="fas fa-user"></i></div>
                  </div>
                  <div class="m-meta">
                    <h4>{{ m.nama || m.attributes?.nama }}</h4>
                    <span class="m-role">{{ m.jabatan || m.attributes?.jabatan }}</span>
                  </div>
                  <div class="m-arrow">
                    <i class="fas fa-chevron-right"></i>
                  </div>
                </router-link>
              </div>
              <div class="sidebar-footer">
                <router-link to="/anggota" class="btn btn-navy-outline btn-full">
                  <i class="fas fa-users"></i> Lihat Semua Anggota
                </router-link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.member-detail-view { 
  padding-top: calc(var(--nav-height) + 30px);
  padding-bottom: 80px; 
}

/* Breadcrumb */
.breadcrumb-nav {
  padding: 20px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  color: var(--pks-text-muted);
}

.breadcrumb-nav a {
  color: var(--pks-navy-light);
  font-weight: 600;
  transition: var(--transition-base);
}

.breadcrumb-nav a:hover { color: var(--pks-orange); }

.breadcrumb-nav i {
  font-size: 0.7rem;
  opacity: 0.4;
}

.breadcrumb-nav .active {
  color: var(--pks-navy);
  font-weight: 700;
}

/* Profile Hero Banner */
.profile-header-section { margin-bottom: 40px; }

.profile-hero-card {
  background: var(--pks-navy-gradient);
  border-radius: var(--radius-lg);
  padding: 60px;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.hero-bg-accent {
  position: absolute;
  top: 0; right: 0; width: 50%; height: 100%;
  background: radial-gradient(circle at 70% 30%, rgba(240, 122, 30, 0.15), transparent 70%);
  pointer-events: none;
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 50px;
  position: relative;
  z-index: 2;
}

.photo-wrapper {
  position: relative;
  width: 220px;
  height: 220px;
  flex-shrink: 0;
}

.photo-glow {
  position: absolute;
  inset: -10px;
  background: var(--pks-orange);
  filter: blur(25px);
  opacity: 0.3;
  border-radius: 50%;
}

.photo-frame {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 5px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
  box-shadow: 0 15px 45px rgba(0,0,0,0.4);
}

.photo-frame img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: var(--transition-smooth);
}

.photo-wrapper:hover .photo-frame img { transform: scale(1.08); }

.photo-placeholder {
  width: 100%; height: 100%;
  background: var(--pks-navy-light);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.2); font-size: 5rem;
}

.header-info {
  flex: 1;
}

.badge-accent {
  background: var(--pks-orange-gradient);
  color: white;
  padding: 6px 18px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(240, 122, 30, 0.3);
}

.header-info h1 {
  font-size: 2.75rem;
  color: white;
  margin-bottom: 25px;
  font-weight: 800;
  line-height: 1.2;
}

.quick-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.q-stat {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
  padding: 10px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255,255,255,0.85);
  font-size: 0.9rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.q-stat i { color: var(--pks-orange); font-size: 1rem; }

/* Body Content */
.content-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 40px;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.details-card, .bio-card {
  padding: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--pks-orange-light);
}

.section-title i { color: var(--pks-orange); font-size: 1.25rem; }
.section-title h2 { font-size: 1.35rem; color: var(--pks-navy); }

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.detail-item .label {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--pks-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.detail-item .value {
  font-size: 1.05rem;
  color: var(--pks-text-dark);
  font-weight: 600;
}

.bio-text {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--pks-text-muted);
}

.bio-text p { margin-bottom: 20px; text-align: justify; }
.bio-text p:last-child { margin-bottom: 0; }

/* Vote Section Scaling */
.votes-card {
  padding: 40px;
}

.votes-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--pks-navy-gradient);
  padding: 35px;
  border-radius: var(--radius-md);
  margin-bottom: 40px;
  color: white;
  position: relative;
  overflow: hidden;
}

.total-suara-highlight { position: relative; z-index: 2; }
.ts-label { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.7; display: block; margin-bottom: 8px; }
.ts-value { font-size: 3rem; font-weight: 900; line-height: 1; margin-bottom: 8px; }
.ts-sub { font-size: 0.8rem; font-weight: 600; opacity: 0.6; }

.total-suara-icon { font-size: 4rem; opacity: 0.1; position: absolute; right: 20px; bottom: -10px; transform: rotate(-15deg); }

.breakdown-title {
  font-size: 0.95rem;
  color: var(--pks-navy);
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.breakdown-title::after { content: ''; flex: 1; height: 1px; background: var(--pks-gray); }

.votes-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.vote-bar-item { opacity: 0; }

.v-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 700;
}

.v-kec { color: var(--pks-navy); font-size: 0.95rem; }
.v-val { color: var(--pks-orange); }

.v-progress-bg {
  height: 8px;
  background: var(--pks-gray);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: var(--pks-orange-gradient);
  border-radius: 4px;
}

.v-perc { color: var(--pks-text-muted); font-weight: 600; font-size: 0.72rem; text-align: right; }

/* Sidebar */
.sidebar-list {
  padding: 30px;
}

.sidebar-list h3 {
  font-size: 1.15rem;
  color: var(--pks-navy);
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--pks-navy-light);
}

.others-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.other-member-link {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  border-radius: 12px;
  transition: var(--transition-smooth);
}

.other-member-link:hover { background: var(--pks-white); }

.m-avatar {
  width: 50px; height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: var(--shadow-sm);
}

.m-avatar img { width: 100%; height: 100%; object-fit: cover; }

.m-placeholder {
  width: 100%; height: 100%;
  background: var(--pks-gray);
  display: flex; align-items: center; justify-content: center;
  color: #9ca3af; font-size: 1.25rem;
}

.m-meta h4 {
  font-size: 0.85rem;
  color: var(--pks-navy);
  margin-bottom: 2px;
}

.m-role {
  font-size: 0.75rem;
  color: var(--pks-text-muted);
}

.m-arrow {
  margin-left: auto;
  color: var(--pks-gray);
  font-size: 0.8rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.other-member-link:hover .m-arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--pks-orange);
}

.sidebar-footer { padding-top: 10px; }

/* States */
.loading-state, .empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: var(--pks-text-muted);
}

.loader i { font-size: 2.5rem; color: var(--pks-orange); }

.empty-box {
  padding: 60px;
  text-align: center;
  max-width: 500px;
}

.empty-box i { font-size: 4rem; color: var(--pks-navy-light); opacity: 0.3; margin-bottom: 20px; }
.empty-box p { font-size: 1.1rem; color: var(--pks-text-muted); margin-bottom: 30px; }

@media (max-width: 992px) {
  .content-layout { grid-template-columns: 1fr; }
  .profile-hero-card { padding: 40px; }
  .hero-content { flex-direction: column; text-align: center; gap: 30px; }
  .quick-stats { justify-content: center; }
  .details-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .profile-hero-card { padding: 30px 20px; }
  .header-info h1 { font-size: 2rem; }
  .photo-wrapper { width: 160px; height: 160px; }
  .details-card, .bio-card { padding: 30px 20px; }
}
</style>

