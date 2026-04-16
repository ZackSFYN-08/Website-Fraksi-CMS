<template>
  <section class="hero-section">
    <div class="container hero-container">
      <div class="hero-card">
        <!-- Animated Background Blobs -->
        <div class="hero-blob blob-1"></div>
        <div class="hero-blob blob-2"></div>
        <div class="hero-blob blob-3"></div>
        
        <div class="hero-content-wrap">
          <div class="hero-badge" data-reveal="fade-down">
            <img src="https://pks.id/img/logo-pks.png" alt="PKS" class="badge-logo" />
            <span>Website Resmi Fraksi PKS Kota Bandung</span>
          </div>
          
          <h1 class="hero-title" data-reveal="fade-up">
            Berkhidmat untuk <span>Rakyat</span>,<br/>
            Membangun Kota <span>Bandung</span>.
          </h1>
          
          <p class="hero-subtitle" data-reveal="fade-up" data-reveal-delay="100">
            Wadah aspirasi dan informasi perjuangan Fraksi Partai Keadilan Sejahtera 
            di DPRD Kota Bandung untuk kemaslahatan seluruh warga.
          </p>
          
          <div class="hero-actions" data-reveal="fade-up" data-reveal-delay="200">
            <router-link to="/anggota" class="btn btn-primary">
              Profil Anggota <i class="fas fa-users-viewfinder"></i>
            </router-link>
            <router-link to="/aspirasi/form" class="btn btn-outline-white">
              Sampaikan Aspirasi <i class="fas fa-paper-plane"></i>
            </router-link>
          </div>
        </div>

        <div class="hero-visual" data-reveal="fade-left" data-reveal-delay="300">
          <div class="visual-placeholder">
            <img src="https://pks.id/img/logo-pks.png" alt="PKS" class="floating-logo" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  padding: calc(var(--nav-height) + 20px) 0 40px;
  overflow: hidden;
}

.hero-card {
  position: relative;
  background: var(--pks-navy-gradient);
  border-radius: var(--radius-lg);
  min-height: 520px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 40px;
  padding: 60px;
  overflow: hidden;
  box-shadow: var(--shadow-premium);
}

/* Background Blobs */
.hero-blob {
  position: absolute;
  filter: blur(80px);
  opacity: 0.35;
  border-radius: 50%;
  z-index: 0;
  animation: blob-float 15s infinite alternate ease-in-out;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: var(--pks-orange);
  top: -100px;
  right: -50px;
}

.blob-2 {
  width: 300px;
  height: 300px;
  background: #00a8ff;
  bottom: -50px;
  left: 30%;
  animation-delay: -5s;
}

.blob-3 {
  width: 250px;
  height: 250px;
  background: #ff4757;
  top: 20%;
  left: -50px;
  animation-delay: -10s;
}

@keyframes blob-float {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

.hero-content-wrap {
  position: relative;
  z-index: 2;
  color: white;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.badge-logo { width: 22px; height: auto; }

.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.1;
  color: white;
  margin-bottom: 24px;
}

.hero-title span {
  color: var(--pks-orange);
  position: relative;
  display: inline-block;
}

.hero-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.8;
  max-width: 600px;
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-outline-white {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.btn-outline-white:hover {
  background: white;
  color: var(--pks-navy);
  border-color: white;
  transform: translateY(-3px);
}

.hero-visual {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
}

.visual-placeholder {
  width: 280px;
  height: 280px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.floating-logo {
  width: 140px;
  filter: brightness(0) invert(1);
  opacity: 0.5;
  animation: float 6s infinite ease-in-out;
}

@media (max-width: 1024px) {
  .hero-card {
    grid-template-columns: 1fr;
    padding: 60px 40px;
    text-align: center;
  }
  .hero-content-wrap { display: flex; flex-direction: column; align-items: center; }
  .hero-title { font-size: 2.8rem; }
  .hero-visual { display: none; }
  .hero-actions { justify-content: center; }
}

@media (max-width: 576px) {
  .hero-card { padding: 40px 24px; }
  .hero-title { font-size: 2.2rem; }
  .hero-subtitle { font-size: 1rem; }
  .hero-actions { flex-direction: column; width: 100%; gap: 12px; }
  .btn { width: 100%; }
}

@media (max-width: 400px) {
  .hero-title { font-size: 1.8rem; }
}
</style>