<script setup>
import { useScrollReveal } from '../composables/useScrollReveal'
useScrollReveal()
</script>

<template>
  <footer class="pks-footer">
    <!-- Decorative Blobs for Depth -->
    <div class="footer-decoration">
      <div class="blob-1"></div>
      <div class="blob-2"></div>
    </div>

    <div class="container footer-main">
      <div class="footer-grid">
        <!-- Brand & Mission -->
        <div class="footer-col brand-info" data-reveal="fade-up">
          <div class="brand-header">
            <div class="footer-logo-wrap">
              <img src="https://pks.id/img/logo-pks.png" alt="PKS" class="pks-logo" />
              <div class="logo-glow"></div>
            </div>
            <div class="brand-titles">
              <h3>Fraksi PKS</h3>
              <span class="city-tag">DPRD Kota Bandung</span>
            </div>
          </div>
          <p class="mission-text">
            Berkhidmat untuk rakyat dengan integritas dan totalitas demi mewujudkan Kota Bandung yang unggul, nyaman, dan bermartabat.
          </p>
          <div class="social-wrapper">
            <a href="#" class="social-btn"><i class="fab fa-youtube"></i></a>
            <a href="#" class="social-btn"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-btn"><i class="fab fa-tiktok"></i></a>
            <a href="#" class="social-btn"><i class="fab fa-facebook-f"></i></a>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="footer-col" data-reveal="fade-up" data-reveal-delay="100">
          <h4 class="col-title">Navigasi</h4>
          <ul class="link-list">
            <li><router-link to="/profil">Tentang Fraksi</router-link></li>
            <li><router-link to="/berita">Berita Terbaru</router-link></li>
            <li><router-link to="/anggota">Profil Anggota Fraksi</router-link></li>
            <li><router-link to="/event">Agenda & Event</router-link></li>
            <li><router-link to="/internshipks">InternshiPKS</router-link></li>
          </ul>
        </div>

        <!-- Resources -->
        <div class="footer-col" data-reveal="fade-up" data-reveal-delay="200">
          <h4 class="col-title">Publikasi</h4>
          <ul class="link-list">
            <li><router-link to="/pandangan-fraksi">Pandangan Fraksi</router-link></li>
            <li><router-link to="/peraturan-daerah">Produk Hukum</router-link></li>
            <li><router-link to="/pansus">Laporan Pansus</router-link></li>
            <li><router-link to="/kutipan-media">Liputan Media</router-link></li>
            <li><router-link to="/wawancara-opini">Opini Politik</router-link></li>
          </ul>
        </div>

        <!-- Contact Detail -->
        <div class="footer-col" data-reveal="fade-up" data-reveal-delay="300">
          <h4 class="col-title">Hubungi Kami</h4>
          <div class="contact-card">
            <div class="contact-row">
              <i class="fas fa-map-marker-alt"></i>
              <p>Gedung DPRD Kota Bandung, Jl. Sukabumi No.30, Bandung, Jawa Barat</p>
            </div>
            <div class="contact-row">
              <i class="fas fa-phone-alt"></i>
              <p>(022) 7208171</p>
            </div>
            <div class="contact-row">
              <i class="fas fa-envelope-open"></i>
              <p>fraksi@bandung.pks.id</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sub Footer -->
    <div class="footer-bottom">
      <div class="container bottom-wrap">
        <p class="copyright">&copy; 2026 Fraksi PKS DPRD Kota Bandung. All Rights Reserved.</p>
        <div class="legal-links">
          <a href="#">Privasi</a>
          <span class="sep">•</span>
          <a href="#">Ketentuan Layanan</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.pks-footer {
  background: #001a33;
  color: white;
  padding-top: 50px;
  position: relative;
  overflow: hidden;
  margin-top: 80px;
}

/* Decorations */
.footer-decoration .blob-1 {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: var(--pks-orange);
  filter: blur(120px);
  opacity: 0.1;
}

.footer-decoration .blob-2 {
  position: absolute;
  bottom: -150px;
  left: -150px;
  width: 500px;
  height: 500px;
  background: var(--pks-navy);
  filter: blur(150px);
  opacity: 0.2;
}

.footer-main {
  position: relative;
  z-index: 2;
  padding-bottom: 50px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr 0.8fr 1.2fr;
  gap: 60px;
}

/* Brand info */
.brand-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
}

.footer-logo-wrap {
  position: relative;
  width: 90px;
  height: 110px;
  background: white;
  padding: 15px;
  border-radius: 0 0 20px 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  margin-top: -50px;
}

.pks-logo { 
  width: 100%; 
  height: 100%; 
  object-fit: contain; 
}
.logo-glow {
  position: absolute;
  inset: 0;
  background: var(--pks-orange);
  filter: blur(20px);
  opacity: 0.2;
  z-index: -1;
}

.brand-titles {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-titles h3 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 5px;
  color: white;
}

.city-tag {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--pks-orange);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.mission-text {
  margin: 25px 0;
  font-size: 0.95rem;
  line-height: 1.8;
  opacity: 0.7;
  max-width: 320px;
}

.social-wrapper {
  display: flex;
  gap: 12px;
}

.social-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-btn:hover {
  background: var(--pks-orange);
  border-color: var(--pks-orange);
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(240, 122, 30, 0.3);
}

/* Columns */
.col-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 35px;
  position: relative;
}

.col-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 40px;
  height: 3px;
  background: var(--pks-orange);
  border-radius: 2px;
}

.link-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.link-list a {
  font-size: 0.95rem;
  opacity: 0.6;
  transition: all 0.3s ease;
  display: inline-block;
}

.link-list a:hover {
  opacity: 1;
  color: var(--pks-orange);
  transform: translateX(8px);
}

/* Contact Info */
.contact-card {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contact-row {
  display: flex;
  gap: 15px;
}

.contact-row i {
  color: var(--pks-orange);
  font-size: 1.1rem;
  margin-top: 3px;
}

.contact-row p {
  font-size: 0.9rem;
  opacity: 0.8;
  line-height: 1.5;
}

/* Bottom Bar */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 30px 0;
  background: rgba(0, 0, 0, 0.2);
}

.bottom-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright { font-size: 0.85rem; opacity: 0.4; }

.legal-links {
  display: flex;
  align-items: center;
  gap: 15px;
}

.legal-links a { font-size: 0.85rem; opacity: 0.4; transition: opacity 0.3s; }
.legal-links a:hover { opacity: 1; }
.sep { opacity: 0.2; font-size: 0.8rem; }

@media (max-width: 1200px) {
  .footer-grid { grid-template-columns: 1.2fr 1fr 1fr; gap: 40px; }
  .footer-col:last-child { grid-column: span 3; }
}

@media (max-width: 992px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .footer-col:last-child { grid-column: span 2; }
}

@media (max-width: 640px) {
  .footer-grid { grid-template-columns: 1fr; }
  .footer-col:last-child { grid-column: span 1; }
  .pks-footer { padding-top: 60px; }
  .footer-main { padding-bottom: 40px; }
  .brand-info { text-align: center; align-items: center; }
  .brand-header { justify-content: center; flex-direction: column; margin-bottom: 15px; }
  .mission-text { margin: 20px auto; }
  .social-wrapper { justify-content: center; }
  .bottom-wrap { flex-direction: column; gap: 15px; text-align: center; }
  .col-title { margin-bottom: 25px; }
}
</style>
