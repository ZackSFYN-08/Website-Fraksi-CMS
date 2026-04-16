<template>
  <div class="kontak-view">
    <!-- Page Header -->
    <section class="container page-banner" data-reveal="fade-up">
      <div class="banner-card">
        <h1>Sampaikan Aspirasi</h1>
        <p>Suarakan pendapat, keluhan, dan harapan Anda untuk pembangunan Kota Bandung yang lebih baik melalui kanal resmi Fraksi PKS.</p>
        <div class="banner-blob"></div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="container kontak-content">
      <div class="kontak-grid">
        <!-- Form Side -->
        <div class="form-container" data-reveal="fade-right">
          <div class="form-card glass-card">
            <div class="card-header">
              <div class="header-icon"><i class="fas fa-paper-plane"></i></div>
              <div class="header-text">
                <h2>Kirim Aspirasi Online</h2>
                <p>Silakan isi informasi di bawah ini dengan lengkap.</p>
              </div>
            </div>

            <form @submit.prevent="handleSubmit" class="aspirasi-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Nama Lengkap</label>
                  <div class="input-wrap">
                    <i class="far fa-user"></i>
                    <input v-model="form.name" placeholder="Nama lengkap Anda" required />
                  </div>
                </div>
                <div class="form-group">
                  <label>Alamat Email</label>
                  <div class="input-wrap">
                    <i class="far fa-envelope"></i>
                    <input type="email" v-model="form.email" placeholder="contoh@email.com" required />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Subjek Aspirasi</label>
                <div class="input-wrap">
                  <i class="far fa-bookmark"></i>
                  <input v-model="form.subject" placeholder="Topik atau kategori aspirasi" required />
                </div>
              </div>

              <div class="form-group">
                <label>Pesan Lengkap</label>
                <div class="input-wrap textarea-wrap">
                  <i class="far fa-comment-alt"></i>
                  <textarea v-model="form.message" rows="6" placeholder="Tuliskan detail aspirasi Anda di sini..." required></textarea>
                </div>
              </div>

              <div v-if="errorMessage" class="error-msg" data-reveal="fade-in">
                <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
              </div>

              <button type="submit" class="btn btn-primary btn-submit" :disabled="submitted || submitting">
                <template v-if="submitting">
                  <i class="fas fa-circle-notch fa-spin"></i> Mengirim...
                </template>
                <template v-else-if="submitted">
                  <i class="fas fa-check-circle"></i> Berhasil Terkirim
                </template>
                <template v-else>
                  <span>Kirim Aspirasi Anda</span>
                  <i class="fas fa-arrow-right"></i>
                </template>
              </button>
            </form>
          </div>
        </div>

        <!-- Info Side -->
        <div class="info-side">
          <div 
            class="info-card glass-card hover-lift" 
            v-for="(c, index) in contacts" 
            :key="c.title" 
            data-reveal="fade-left" 
            :data-reveal-delay="index * 150"
          >
            <div class="info-icon-box">
              <i :class="c.icon"></i>
            </div>
            <div class="info-text">
              <h4>{{ c.title }}</h4>
              <p v-html="c.text"></p>
            </div>
          </div>

          <!-- Social Connect -->
          <div class="social-connect glass-card" data-reveal="fade-left" data-reveal-delay="400">
            <h4>Ikuti Media Sosial Kami</h4>
            <div class="social-links">
              <a href="#" class="social-link fb"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="social-link tw"><i class="fab fa-x-twitter"></i></a>
              <a href="#" class="social-link ig"><i class="fab fa-instagram"></i></a>
              <a href="#" class="social-link yt"><i class="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import api from '../services/api'

useScrollReveal()

const submitted = ref(false)
const submitting = ref(false)
const errorMessage = ref('')
const form = ref({ name: '', email: '', subject: '', message: '' })

const handleSubmit = async () => { 
  submitting.value = true;
  errorMessage.value = '';
  try {
    await api.postAspiration(form.value);
    submitted.value = true; 
    setTimeout(() => { 
      submitted.value = false; 
      form.value = { name:'', email:'', subject:'', message:'' } 
    }, 5000);
  } catch (error) {
    console.error('Submission failed:', error);
    errorMessage.value = 'Mohon maaf, terjadi gangguan saat mengirim data. Silakan coba beberapa saat lagi.';
  } finally {
    submitting.value = false;
  }
}

const contacts = [
  { icon: 'fas fa-map-marker-alt', title: 'Kantor Fraksi PKS', text: 'Gedung DPRD Kota Bandung<br/>Jl. Sukabumi No.30, Bandung 40162' },
  { icon: 'fas fa-phone-alt', title: 'Saluran Telepon', text: '(022) 7208171' },
  { icon: 'fas fa-envelope-open-text', title: 'Surat Elektronik', text: 'fraksi@bandung.pks.id' },
  { icon: 'fas fa-clock', title: 'Jam Pelayanan', text: 'Senin - Jumat<br/>08.00 - 16.00 WIB' },
]
</script>

<style scoped>
.kontak-content { padding: 40px 0 80px; }

.kontak-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 40px;
  align-items: start;
}

/* Form Styles */
.form-card {
  padding: 40px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 35px;
}

.header-icon {
  width: 54px;
  height: 54px;
  background: var(--pks-orange-gradient);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.4rem;
  box-shadow: 0 4px 15px rgba(240, 122, 30, 0.3);
}

.header-text h2 {
  font-size: 1.5rem;
  color: var(--pks-navy);
  margin-bottom: 5px;
}

.header-text p {
  font-size: 0.9rem;
  color: var(--pks-text-muted);
}

.aspirasi-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--pks-navy);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrap i {
  position: absolute;
  left: 18px;
  color: var(--pks-navy-light);
  font-size: 1rem;
  transition: var(--transition-base);
}

.input-wrap input, 
.input-wrap textarea {
  width: 100%;
  padding: 14px 16px 14px 48px;
  background: var(--pks-white);
  border: 1px solid var(--pks-navy-light);
  border-radius: 12px;
  font-size: 0.95rem;
  color: var(--pks-navy);
  transition: var(--transition-base);
}

.input-wrap textarea {
  padding-top: 18px;
  resize: none;
}

.textarea-wrap i {
  top: 18px;
}

.input-wrap input:focus, 
.input-wrap textarea:focus {
  outline: none;
  border-color: var(--pks-orange);
  box-shadow: 0 0 0 4px rgba(240, 122, 30, 0.1);
}

.input-wrap input:focus + i, 
.input-wrap textarea:focus + i {
  color: var(--pks-orange);
}

.btn-submit {
  padding: 16px;
  font-size: 1.05rem;
  justify-content: center;
  gap: 12px;
  margin-top: 10px;
}

.btn-submit:disabled {
  background: var(--pks-success);
  border-color: transparent;
  opacity: 1;
}

/* Info Cards */
.info-side {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
}

.info-icon-box {
  width: 50px;
  height: 50px;
  min-width: 50px;
  background: var(--pks-white);
  border: 1px solid var(--pks-navy-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--pks-orange);
  font-size: 1.1rem;
  transition: var(--transition-base);
}

.info-card:hover .info-icon-box {
  background: var(--pks-orange);
  color: white;
  border-color: transparent;
  transform: rotate(10deg);
}

.info-text h4 {
  font-size: 1rem;
  color: var(--pks-navy);
  margin-bottom: 5px;
}

.info-text p {
  font-size: 0.9rem;
  color: var(--pks-text-muted);
  line-height: 1.5;
}

.social-connect {
  padding: 30px;
  text-align: center;
}

.social-connect h4 {
  margin-bottom: 20px;
  font-size: 1rem;
  color: var(--pks-navy);
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-link {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid var(--pks-navy-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--pks-navy);
  font-size: 1.1rem;
  transition: var(--transition-smooth);
}

.social-link:hover {
  background: var(--pks-orange);
  color: white;
  border-color: transparent;
  transform: translateY(-5px) rotate(360deg);
}

.error-msg {
  background: #fff5f5;
  color: #e53e3e;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.banner-blob {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 250px;
  height: 250px;
  background: var(--pks-orange);
  filter: blur(80px);
  opacity: 0.15;
}

@media (max-width: 992px) {
  .kontak-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .form-card { padding: 30px 20px; }
  .form-row { grid-template-columns: 1fr; }
  .header-icon { width: 44px; height: 44px; font-size: 1.2rem; }
  .header-text h2 { font-size: 1.3rem; }
}
</style>

