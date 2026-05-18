<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { member, restoreSession, isLoggedIn, token } from '../stores/authStore'
import api, { STRAPI_URL } from '../services/api'

const route = useRoute()
const router = useRouter()
const isEditMode = ref(false)
const documentId = ref(null)

const title = ref('')
const excerpt = ref('')
const content = ref('')
const imageFile = ref(null)
const imagePreview = ref(null)
const date = ref(new Date().toISOString().split('T')[0])

const loading = ref(false)
const initLoading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  const ok = await restoreSession()
  if (!ok && !isLoggedIn.value) {
    router.push('/anggota/login')
    return
  }

  if (route.params.documentId) {
    isEditMode.value = true
    documentId.value = route.params.documentId
    await loadArticle()
  }
  initLoading.value = false
})

const loadArticle = async () => {
  try {
    const article = await api.getAspirationArticle(documentId.value)
    if (!article) {
      errorMsg.value = 'Berita tidak ditemukan'
      return
    }
    
    // Check ownership
    const articleMemberId = article.member?.documentId || article.member?.id || article.attributes?.member?.data?.id
    const myMemberId = member.value?.documentId || member.value?.id
    if (articleMemberId !== myMemberId) {
      errorMsg.value = 'Anda tidak memiliki akses ke berita ini'
      return
    }

    title.value = article.title || article.attributes?.title || ''
    excerpt.value = article.excerpt || article.attributes?.excerpt || ''
    content.value = article.content || article.attributes?.content || ''
    date.value = article.date || article.attributes?.date || new Date().toISOString().split('T')[0]
    
    const img = article.image || article.attributes?.image
    if (img) {
      const url = img.url || img.data?.attributes?.url
      if (url) {
        imagePreview.value = url.startsWith('http') ? url : `${STRAPI_URL}${url}`
      }
    }
  } catch (e) {
    errorMsg.value = 'Gagal memuat berita'
  }
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 2MB')
      return
    }
    imageFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const triggerFileInput = () => {
  document.getElementById('article-image').click()
}

const handleSubmit = async () => {
  if (!title.value || !content.value) {
    alert('Judul dan Konten wajib diisi!')
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    let imageId = undefined

    if (imageFile.value) {
      const uploadRes = await api.uploadMedia(imageFile.value, token.value)
      imageId = uploadRes.id
    }

    const payload = {
      title: title.value,
      excerpt: excerpt.value,
      content: content.value,
      date: date.value,
      member: member.value?.documentId || member.value?.id
    }

    if (imageId) payload.image = imageId

    if (isEditMode.value) {
      await api.updateAspirationArticle(documentId.value, payload, token.value)
    } else {
      await api.createAspirationArticle(payload, token.value)
    }

    router.push('/anggota/portal')
  } catch (e) {
    console.error(e)
    errorMsg.value = 'Gagal menyimpan berita. Pastikan koneksi stabil.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="editor-layout">
    <header class="editor-header">
      <div class="header-left">
        <router-link to="/anggota/portal" class="btn-back"><i class="fas fa-arrow-left"></i> Kembali</router-link>
        <h1>{{ isEditMode ? 'Edit Berita' : 'Tulis Berita Baru' }}</h1>
      </div>
      <button @click="handleSubmit" class="btn-publish" :disabled="loading || initLoading">
        <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
        <i v-else class="fas fa-paper-plane"></i>
        {{ loading ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Publikasikan') }}
      </button>
    </header>

    <main class="editor-main">
      <div v-if="initLoading" class="loading-state">
        <i class="fas fa-circle-notch fa-spin"></i>
        <span>Menyiapkan editor...</span>
      </div>

      <div v-else-if="errorMsg" class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Akses Ditolak</h3>
        <p>{{ errorMsg }}</p>
        <router-link to="/anggota/portal" class="btn-primary">Kembali ke Portal</router-link>
      </div>

      <div v-else class="editor-form">
        <!-- Image Upload Section -->
        <div class="image-upload-section">
          <input type="file" id="article-image" accept="image/*" @change="handleFileChange" hidden />
          <div 
            class="image-dropzone" 
            :class="{ 'has-image': imagePreview }"
            @click="triggerFileInput"
          >
            <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="preview-img" />
            <div class="dropzone-content" v-else>
              <i class="fas fa-cloud-upload-alt"></i>
              <span>Klik untuk mengunggah foto berita</span>
              <small>Maks 2MB (JPG, PNG)</small>
            </div>
            <div class="dropzone-overlay" v-if="imagePreview">
              <i class="fas fa-camera"></i> Ganti Foto
            </div>
          </div>
        </div>

        <div class="form-content">
          <div class="form-group">
            <label>Tanggal Berita</label>
            <input type="date" v-model="date" class="form-input" />
          </div>

          <div class="form-group">
            <label>Judul Berita <span class="required">*</span></label>
            <input type="text" v-model="title" class="form-input title-input" placeholder="Masukkan judul berita yang menarik..." />
          </div>

          <div class="form-group">
            <label>Ringkasan Singkat (Opsional)</label>
            <textarea v-model="excerpt" class="form-input excerpt-input" placeholder="Tuliskan ringkasan singkat 1-2 kalimat..."></textarea>
          </div>

          <div class="form-group">
            <label>Isi Berita LENGKAP <span class="required">*</span></label>
            <!-- Sederhana menggunakan textarea biasa karena kita tidak memuat library rich text agar ringan -->
            <textarea v-model="content" class="form-input content-input" placeholder="Tuliskan isi berita secara detail di sini... Anda bisa menggunakan format paragraf standar."></textarea>
            <small class="help-text"><i class="fas fa-info-circle"></i> Gunakan enter (baris baru) untuk memisahkan paragraf.</small>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.editor-layout { min-height: 100vh; background: #f4f6fa; display: flex; flex-direction: column; }
.editor-header { background: white; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--pks-gray); position: sticky; top: 0; z-index: 10; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
.header-left { display: flex; align-items: center; gap: 20px; }
.header-left h1 { font-size: 1.4rem; color: var(--pks-navy); margin: 0; }
.btn-back { display: flex; align-items: center; gap: 8px; color: var(--pks-text-muted); text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: color 0.3s; }
.btn-back:hover { color: var(--pks-orange); }

.btn-publish { background: var(--pks-orange-gradient); color: white; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(240,122,30,0.3); font-family: inherit; }
.btn-publish:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(240,122,30,0.4); }
.btn-publish:disabled { opacity: 0.7; cursor: not-allowed; }

.editor-main { padding: 40px; max-width: 900px; margin: 0 auto; width: 100%; flex: 1; }

.editor-form { background: white; border-radius: 16px; box-shadow: 0 4px 25px rgba(0,0,0,0.03); border: 1px solid var(--pks-gray); overflow: hidden; }

/* Image Upload */
.image-upload-section { padding: 30px 30px 0; }
.image-dropzone { width: 100%; height: 250px; border: 2px dashed #cbd5e0; border-radius: 12px; background: #f8fafc; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; }
.image-dropzone:hover { border-color: var(--pks-orange); background: #fffaf5; }
.image-dropzone.has-image { border-style: solid; border-color: transparent; }
.dropzone-content { display: flex; flex-direction: column; align-items: center; gap: 10px; color: #a0aec0; }
.dropzone-content i { font-size: 3rem; color: #cbd5e0; margin-bottom: 5px; transition: color 0.3s; }
.image-dropzone:hover .dropzone-content i { color: var(--pks-orange); }
.dropzone-content span { font-weight: 600; font-size: 1.1rem; color: var(--pks-navy); }
.preview-img { width: 100%; height: 100%; object-fit: cover; }
.dropzone-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.1rem; opacity: 0; transition: opacity 0.3s; gap: 8px; }
.image-dropzone:hover .dropzone-overlay { opacity: 1; }

/* Form Content */
.form-content { padding: 30px; display: flex; flex-direction: column; gap: 25px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-weight: 700; color: var(--pks-navy); font-size: 0.95rem; }
.required { color: #e53e3e; }

.form-input { width: 100%; padding: 12px 16px; border: 2px solid var(--pks-gray); border-radius: 8px; font-size: 1rem; color: var(--pks-navy); background: white; transition: all 0.3s; font-family: inherit; outline: none; }
.form-input:focus { border-color: var(--pks-orange); box-shadow: 0 0 0 3px rgba(240,122,30,0.1); }
.title-input { font-size: 1.25rem; font-weight: 700; padding: 15px 16px; }
.excerpt-input { height: 80px; resize: none; }
.content-input { height: 350px; resize: vertical; line-height: 1.6; }
.help-text { color: var(--pks-text-muted); font-size: 0.85rem; display: flex; align-items: center; gap: 5px; }

.loading-state, .error-state { padding: 100px 20px; text-align: center; color: var(--pks-text-muted); display: flex; flex-direction: column; align-items: center; gap: 15px; }
.loading-state i { font-size: 2.5rem; color: var(--pks-orange); }
.error-state i { font-size: 3.5rem; color: #e53e3e; margin-bottom: 10px; }
.error-state h3 { color: var(--pks-navy); font-size: 1.5rem; margin: 0; }
.btn-primary { background: var(--pks-navy); color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 10px; }

@media (max-width: 768px) {
  .editor-header { padding: 15px 20px; flex-direction: column; gap: 15px; align-items: stretch; }
  .header-left { justify-content: space-between; }
  .editor-main { padding: 20px; }
  .image-upload-section, .form-content { padding: 20px; }
  .image-dropzone { height: 200px; }
  .content-input { height: 250px; }
}
</style>
