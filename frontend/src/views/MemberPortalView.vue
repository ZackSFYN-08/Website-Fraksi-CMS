<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { member, logout, restoreSession, isLoggedIn, token } from '../stores/authStore'
import api, { STRAPI_URL } from '../services/api'

const router = useRouter()
const articles = ref([])
const loading = ref(true)

onMounted(async () => {
  const ok = await restoreSession()
  if (!ok && !isLoggedIn.value) { router.push('/anggota/login'); return }
  if (member.value) await fetchMyArticles()
  loading.value = false
})

const fetchMyArticles = async () => {
  try {
    const memberId = member.value.documentId || member.value.id
    const data = await api.getAspirationArticles({
      'filters[member][documentId][$eq]': memberId,
      sort: 'createdAt:desc'
    })
    articles.value = data || []
  } catch (e) { console.error(e) }
}

const handleLogout = () => { logout(); router.push('/') }

const confirmDelete = async (article) => {
  if (confirm(`Yakin ingin menghapus berita "${article.title || article.attributes?.title}"?`)) {
    try {
      await api.deleteAspirationArticle(article.documentId, token.value)
      await fetchMyArticles()
    } catch (e) { alert('Gagal menghapus berita.') }
  }
}

const getImageUrl = (item) => {
  const img = item.image || item.attributes?.image
  if (!img) return null
  if (img.url) return img.url.startsWith('http') ? img.url : `${STRAPI_URL}${img.url}`
  if (img.data?.attributes?.url) {
    const u = img.data.attributes.url
    return u.startsWith('http') ? u : `${STRAPI_URL}${u}`
  }
  return null
}

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="portal-page">
    <aside class="portal-sidebar">
      <div class="sidebar-brand">
        <i class="fas fa-shield-heart"></i>
        <span>Portal Anggota</span>
      </div>
      <div class="member-profile" v-if="member">
        <div class="avatar"><i class="fas fa-user-circle"></i></div>
        <div class="info">
          <p class="name">{{ member.nama || member.attributes?.nama }}</p>
          <p class="role">Anggota Fraksi PKS</p>
        </div>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/anggota/portal" class="nav-item active"><i class="fas fa-newspaper"></i> Berita Saya</router-link>
        <router-link to="/anggota/portal/tambah-berita" class="nav-item"><i class="fas fa-plus-circle"></i> Tambah Berita</router-link>
      </nav>
      <div class="sidebar-footer">
        <button @click="handleLogout" class="btn-logout"><i class="fas fa-sign-out-alt"></i> Keluar</button>
      </div>
    </aside>

    <main class="portal-main">
      <header class="main-header">
        <h1>Manajemen Berita</h1>
        <router-link to="/anggota/portal/tambah-berita" class="btn-add-primary"><i class="fas fa-plus"></i> Berita Baru</router-link>
      </header>

      <div v-if="loading" class="state-center"><i class="fas fa-circle-notch fa-spin"></i><span>Memuat portal...</span></div>
      
      <div v-else-if="articles.length === 0" class="state-center empty-state">
        <i class="fas fa-folder-open"></i>
        <h3>Belum ada berita</h3>
        <p>Anda belum mempublikasikan berita aspirasi atau pelatihan apa pun.</p>
        <router-link to="/anggota/portal/tambah-berita" class="btn-add-secondary">Tulis Berita Pertama</router-link>
      </div>

      <div v-else class="articles-grid">
        <div v-for="article in articles" :key="article.id" class="portal-card">
          <div class="card-img">
            <img v-if="getImageUrl(article)" :src="getImageUrl(article)" alt="Thumbnail" />
            <div v-else class="img-placeholder"><i class="fas fa-image"></i></div>
            <div class="card-actions">
              <router-link :to="`/anggota/portal/edit-berita/${article.documentId}`" class="action-btn edit-btn" title="Edit Berita"><i class="fas fa-edit"></i></router-link>
              <button @click="confirmDelete(article)" class="action-btn delete-btn" title="Hapus Berita"><i class="fas fa-trash-alt"></i></button>
            </div>
          </div>
          <div class="card-content">
            <span class="date"><i class="far fa-calendar-alt"></i> {{ formatDate(article.date || article.attributes?.date) }}</span>
            <h3 class="title">{{ article.title || article.attributes?.title }}</h3>
            <p class="excerpt">{{ article.excerpt || article.attributes?.excerpt }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.portal-page { min-height: 100vh; display: grid; grid-template-columns: 280px 1fr; background: #f4f6fa; }
.portal-sidebar { background: var(--pks-navy-gradient); padding: 30px; display: flex; flex-direction: column; gap: 30px; position: sticky; top: 0; height: 100vh; }
.sidebar-brand { display: flex; align-items: center; gap: 12px; color: white; font-weight: 800; font-size: 1.1rem; }
.sidebar-brand i { font-size: 1.5rem; color: var(--pks-orange); }
.member-profile { display: flex; align-items: center; gap: 12px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
.avatar i { font-size: 2.5rem; color: var(--pks-orange); }
.info .name { color: white; font-weight: 700; font-size: 0.9rem; line-height: 1.2; margin-bottom: 2px; }
.info .role { color: rgba(255,255,255,0.5); font-size: 0.75rem; }
.sidebar-nav { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: rgba(255,255,255,0.65); border-radius: 12px; font-weight: 600; font-size: 0.9rem; transition: all 0.3s; text-decoration: none; }
.nav-item:hover, .nav-item.active { background: rgba(240,122,30,0.25); color: var(--pks-orange); }
.sidebar-footer { margin-top: auto; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; }
.btn-logout { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; background: rgba(229,62,62,0.1); color: #fc8181; border: 1px solid rgba(229,62,62,0.2); border-radius: 12px; font-weight: 700; font-family: inherit; cursor: pointer; transition: all 0.3s; }
.btn-logout:hover { background: #e53e3e; color: white; }

.portal-main { padding: 40px; overflow-y: auto; }
.main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.main-header h1 { font-size: 1.8rem; color: var(--pks-navy); }
.btn-add-primary { background: var(--pks-orange-gradient); color: white; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 0.9rem; text-decoration: none; display: flex; align-items: center; gap: 8px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(240,122,30,0.3); }
.btn-add-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(240,122,30,0.4); }

.articles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
.portal-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid var(--pks-gray); transition: all 0.3s; display: flex; flex-direction: column; }
.portal-card:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
.card-img { height: 180px; position: relative; overflow: hidden; background: #eee; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #ccc; }
.card-actions { position: absolute; top: 12px; right: 12px; display: flex; gap: 8px; opacity: 0; transform: translateY(-10px); transition: all 0.3s; }
.portal-card:hover .card-actions { opacity: 1; transform: translateY(0); }
.action-btn { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; cursor: pointer; border: none; color: white; text-decoration: none; box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: transform 0.2s; }
.action-btn:hover { transform: scale(1.1); }
.edit-btn { background: #3182ce; }
.delete-btn { background: #e53e3e; }

.card-content { padding: 20px; flex: 1; display: flex; flex-direction: column; }
.date { font-size: 0.8rem; color: var(--pks-text-muted); font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.title { font-size: 1.1rem; color: var(--pks-navy); margin-bottom: 8px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.excerpt { font-size: 0.9rem; color: var(--pks-text-muted); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; margin: 0; }

.state-center { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 20px; color: var(--pks-text-muted); gap: 15px; text-align: center; }
.state-center i { font-size: 2rem; color: var(--pks-orange); }
.empty-state i { font-size: 3.5rem; color: var(--pks-gray); margin-bottom: 10px; }
.empty-state h3 { color: var(--pks-navy); font-size: 1.25rem; margin-bottom: 5px; }
.btn-add-secondary { margin-top: 15px; display: inline-block; padding: 10px 20px; background: white; border: 2px solid var(--pks-orange); color: var(--pks-orange); font-weight: 700; border-radius: 10px; text-decoration: none; transition: all 0.3s; }
.btn-add-secondary:hover { background: var(--pks-orange); color: white; }

@media (max-width: 900px) {
  .portal-page { grid-template-columns: 1fr; }
  .portal-sidebar { height: auto; position: relative; padding: 20px; gap: 20px; }
  .member-profile { display: none; }
  .sidebar-nav { flex-direction: row; flex-wrap: wrap; }
  .nav-item { flex: 1; justify-content: center; }
  .sidebar-footer { padding-top: 10px; }
  .portal-main { padding: 20px; }
  .main-header { flex-direction: column; gap: 15px; align-items: flex-start; }
  .card-actions { opacity: 1; transform: none; }
}
</style>
