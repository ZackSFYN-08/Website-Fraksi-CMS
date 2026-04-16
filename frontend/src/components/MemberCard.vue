<script setup>
import { computed } from 'vue'
import { STRAPI_URL } from '../services/api'

const props = defineProps({ member: { type: Object, required: true } })

const nama = computed(() => props.member?.nama || props.member?.attributes?.nama || '')
const jabatan = computed(() => props.member?.jabatan || props.member?.attributes?.jabatan || 'Anggota')

const fotoUrl = computed(() => {
  const m = props.member
  const foto = m?.foto || m?.attributes?.foto
  
  if (!foto) {
    const fallback = m?.foto_url || m?.attributes?.foto_url
    return fallback || null
  }

  if (foto.url) {
    return foto.url.startsWith('http') ? foto.url : `${STRAPI_URL}${foto.url}`
  }

  if (foto.data?.attributes?.url) {
    const url = foto.data.attributes.url
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`
  }

  return null
})

const initials = computed(() => {
  const n = nama.value
  if (!n) return '?'
  const parts = n.split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return parts[0][0].toUpperCase()
})
</script>

<template>
  <router-link 
    :to="`/anggota/${props.member.documentId}`" 
    class="member-card glass-card hover-lift" 
    :aria-label="`Lihat profil ${nama}`"
  >
    <div class="member-image-box">
      <img v-if="fotoUrl" :src="fotoUrl" :alt="nama" class="member-img" loading="lazy" />
      <div v-else class="initials-placeholder">
        <span>{{ initials }}</span>
      </div>
      
      <!-- Premium Overlay -->
      <div class="card-overlay">
        <div class="overlay-top">
          <span class="role-badge">{{ jabatan }}</span>
        </div>
        <div class="overlay-bottom">
          <div class="profile-hint">
            <span>Buka Profil</span>
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="member-info-content">
      <h3 class="name-display">{{ nama }}</h3>
      <div class="org-footer">
        <span class="org-name">Legislator Kota Bandung</span>
        <div class="social-mini">
          <i class="fab fa-instagram"></i>
          <i class="fab fa-facebook-f"></i>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.member-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.member-image-box {
  position: relative;
  height: 360px;
  overflow: hidden;
  background: var(--pks-navy-light);
}

.member-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.member-card:hover .member-img {
  transform: scale(1.1) translateY(-5px);
}

.initials-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--pks-navy), var(--pks-navy-light));
  color: white; font-size: 3rem; font-weight: 800; opacity: 0.3;
}

/* Premium Card Overlay */
.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 34, 68, 0.2) 0%, transparent 40%, rgba(0, 34, 68, 0.9) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  opacity: 0.8;
  transition: all 0.4s ease;
}

.member-card:hover .card-overlay {
  opacity: 1;
  background: linear-gradient(to bottom, rgba(0, 34, 68, 0.3) 0%, transparent 30%, rgba(240, 122, 30, 0.85) 100%);
}

.role-badge {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  color: white;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-hint {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.member-card:hover .profile-hint {
  transform: translateY(0);
  opacity: 1;
}

.profile-hint i {
  font-size: 0.7rem;
  background: white;
  color: var(--pks-orange);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Info Content */
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
  margin-bottom: 12px;
  font-weight: 800;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.member-card:hover .name-display {
  color: var(--pks-orange);
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

.social-mini {
  display: flex;
  gap: 12px;
  color: var(--pks-gray);
  font-size: 0.8rem;
  opacity: 0;
  transition: all 0.4s ease;
}

.member-card:hover .social-mini {
  opacity: 1;
}

@media (max-width: 640px) {
  .member-image-box { height: 320px; }
  .profile-hint { opacity: 1; transform: none; }
  .social-mini { opacity: 0.5; }
}
</style>


