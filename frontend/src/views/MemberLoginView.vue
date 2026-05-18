<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { login, isLoggedIn, restoreSession } from '../stores/authStore'

const router = useRouter()
const identifier = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

onMounted(async () => {
  const ok = await restoreSession()
  if (ok || isLoggedIn.value) {
    router.push('/anggota/portal')
  }
})

const handleLogin = async () => {
  const emailVal = identifier.value.trim().toLowerCase()
  const passVal = password.value.trim()

  if (!emailVal || !passVal) {
    error.value = 'Harap isi semua kolom.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await login(emailVal, passVal)
    router.push('/anggota/portal')
  } catch (e) {
    console.error('Login Error:', e?.response?.data || e.message)
    const msg = e?.response?.data?.error?.message || e.message || ''
    
    if (msg.toLowerCase().includes('invalid')) {
      error.value = `Email atau password salah. (Pesan server: ${msg})`
    } else if (msg.toLowerCase().includes('blocked')) {
      error.value = `Akun Anda telah diblokir. Hubungi Super Admin. (Pesan server: ${msg})`
    } else if (msg.toLowerCase().includes('confirmed')) {
      error.value = `Akun Anda belum dikonfirmasi. Hubungi Super Admin. (Pesan server: ${msg})`
    } else {
      error.value = `Error: ${msg || 'Periksa koneksi Anda.'}`
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-bg">
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>
    </div>

    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-wrap">
            <i class="fas fa-shield-heart logo-icon"></i>
          </div>
          <h1>Portal Anggota</h1>
          <p>Masuk untuk mengelola berita aspirasi & pelatihan Anda</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="field-group">
            <label for="login-email">Email atau Username</label>
            <div class="input-wrap">
              <i class="fas fa-at input-icon"></i>
              <input
                id="login-email"
                v-model="identifier"
                type="text"
                placeholder="anggota@fraksipks.id"
                autocomplete="username"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="field-group">
            <label for="login-password">Password</label>
            <div class="input-wrap">
              <i class="fas fa-lock input-icon"></i>
              <input
                id="login-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                :disabled="loading"
              />
              <button type="button" class="toggle-pass" @click="showPassword = !showPassword" tabindex="-1">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <div v-if="error" class="error-msg">
            <i class="fas fa-circle-exclamation"></i>
            {{ error }}
          </div>

          <button type="submit" class="btn-login" :disabled="loading">
            <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-sign-in-alt"></i>
            {{ loading ? 'Sedang Masuk...' : 'Masuk ke Portal' }}
          </button>
        </form>

        <div class="login-footer">
          <router-link to="/" class="back-home">
            <i class="fas fa-arrow-left"></i> Kembali ke Beranda
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--pks-navy-gradient);
  position: relative;
  overflow: hidden;
  padding: 20px;
}
.login-bg { position: absolute; inset: 0; pointer-events: none; }
.bg-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15; }
.blob-1 { width: 500px; height: 500px; background: var(--pks-orange); top: -200px; right: -150px; }
.blob-2 { width: 350px; height: 350px; background: #fff; bottom: -150px; left: -100px; }

.login-container { position: relative; z-index: 2; width: 100%; max-width: 480px; }

.login-card {
  padding: 50px 45px;
  background: rgba(255,255,255,0.98);
  border-radius: 24px;
  box-shadow: 0 30px 80px rgba(0,0,0,0.3);
}
.login-header { text-align: center; margin-bottom: 40px; }
.logo-wrap {
  width: 70px; height: 70px;
  background: var(--pks-orange-gradient);
  border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 8px 25px rgba(240,122,30,0.35);
}
.logo-icon { font-size: 2rem; color: white; }
.login-header h1 { font-size: 1.75rem; color: var(--pks-navy); margin-bottom: 10px; font-weight: 800; }
.login-header p { color: var(--pks-text-muted); font-size: 0.9rem; line-height: 1.5; }

.login-form { display: flex; flex-direction: column; gap: 22px; }
.field-group label { display: block; font-size: 0.85rem; font-weight: 700; color: var(--pks-navy); margin-bottom: 8px; }
.input-wrap { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 16px; color: var(--pks-text-muted); font-size: 0.9rem; }
.input-wrap input {
  width: 100%; padding: 14px 45px 14px 44px;
  border: 2px solid var(--pks-gray); border-radius: 12px;
  font-size: 0.95rem; color: var(--pks-navy); background: white;
  transition: border-color 0.3s, box-shadow 0.3s; outline: none; font-family: inherit;
}
.input-wrap input:focus { border-color: var(--pks-orange); box-shadow: 0 0 0 4px rgba(240,122,30,0.1); }
.input-wrap input:disabled { background: #f5f5f5; cursor: not-allowed; }
.toggle-pass {
  position: absolute; right: 14px; background: none; border: none;
  color: var(--pks-text-muted); cursor: pointer; padding: 5px; font-size: 0.9rem; transition: color 0.3s;
}
.toggle-pass:hover { color: var(--pks-orange); }

.error-msg {
  display: flex; align-items: center; gap: 10px;
  background: #fff5f5; border: 1px solid #ffe0e0; color: #e53e3e;
  padding: 12px 16px; border-radius: 10px; font-size: 0.88rem; font-weight: 600;
}
.btn-login {
  width: 100%; padding: 16px;
  background: var(--pks-orange-gradient); color: white; border: none; border-radius: 12px;
  font-size: 1rem; font-weight: 800; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: all 0.3s; box-shadow: 0 6px 20px rgba(240,122,30,0.35); font-family: inherit;
}
.btn-login:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(240,122,30,0.45); }
.btn-login:disabled { opacity: 0.75; cursor: not-allowed; }
.login-footer { text-align: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid var(--pks-gray); }
.back-home { color: var(--pks-text-muted); font-size: 0.85rem; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; transition: color 0.3s; }
.back-home:hover { color: var(--pks-orange); }

@media (max-width: 520px) {
  .login-card { padding: 35px 25px; }
  .login-header h1 { font-size: 1.5rem; }
}
</style>
