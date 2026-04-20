<script setup>
import { useScrollReveal } from '../composables/useScrollReveal'
useScrollReveal()
</script>

<template>
  <footer class="pks-footer-dark">
    <!-- Decorative Blobs -->
    <div class="footer-decoration">
      <div class="blob-1"></div>
      <div class="blob-2"></div>
    </div>

    <div class="container footer-content relative-z2">
      <!-- Left: Logos -->
      <div class="footer-logos" data-reveal="fade-right">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Lambang_Kota_Bandung.svg/300px-Lambang_Kota_Bandung.svg.png" alt="DPRD Kota Bandung" class="dpr-logo" />
        
        <div class="pks-logo-box">
          <img src="https://pks.id/img/logo-pks.png" alt="PKS" class="pks-logo" />
        </div>
      </div>

      <!-- Right: Info -->
      <div class="footer-info" data-reveal="fade-left" data-reveal-delay="100">
        <div class="info-group titles">
          <h3 class="gradient-title">Fraksi Partai Keadilan Sejahtera</h3>
          <p class="highlight-subtitle">DPRD Kota Bandung - Berkhidmat Untuk Rakyat</p>
        </div>

        <div class="info-group">
          <p class="label-white">Alamat:</p>
          <p class="text-gray">Gedung DPRD Kota Bandung</p>
          <p class="text-gray">Jl. Sukabumi No.30, Kacapiring, Kec. Batununggal</p>
          <p class="text-gray">Kota Bandung, Jawa Barat 40271</p>
        </div>

        <div class="info-group">
          <p class="label-white">Hubungi Kami:</p>
          <p class="text-gray" style="margin-bottom: -2px;">Telp: (022) 7208171</p>
          <p class="highlight-link">fraksi@bandung.pks.id</p>
        </div>

        <div class="footer-social">
          <a href="#" class="social-btn"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="social-btn"><i class="fab fa-twitter"></i></a>
          <a href="#" class="social-btn"><i class="fab fa-instagram"></i></a>
          <a href="#" class="social-btn"><i class="fab fa-youtube"></i></a>
          <a href="#" class="social-btn"><i class="fas fa-rss"></i></a>
        </div>
      </div>
    </div>
    
    <div class="sub-footer">
      <div class="container sub-footer-wrap">
        <p class="copyright">&copy; 2026 Fraksi PKS. Hak Cipta Dilindungi.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.pks-footer-dark {
  background: linear-gradient(145deg, #0d1219 0%, #17202d 100%);
  position: relative;
  overflow: hidden;
  padding-top: 80px;
  border-top: 2px solid rgba(255, 255, 255, 0.03);
  font-family: 'Poppins', sans-serif;
  margin-top: 60px;
}

/* Decorative Blobs for depth */
.footer-decoration .blob-1 {
  position: absolute;
  top: -150px;
  right: -50px;
  width: 400px;
  height: 400px;
  background: var(--pks-orange);
  filter: blur(180px);
  opacity: 0.12;
}

.footer-decoration .blob-2 {
  position: absolute;
  bottom: -200px;
  left: -100px;
  width: 500px;
  height: 500px;
  background: #2563eb;
  filter: blur(200px);
  opacity: 0.08;
}

.relative-z2 {
  position: relative;
  z-index: 2;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  padding-bottom: 60px;
}

/* Logos */
.footer-logos {
  display: flex;
  align-items: flex-start;
  gap: 30px;
}

.dpr-logo {
  height: 110px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.4));
  transition: transform 0.5s ease;
  margin-top: -10px; /* Pull up a bit */
}

.dpr-logo:hover {
  transform: scale(1.05);
}

.pks-logo-box {
  background: #FFFFFF;
  width: 160px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
  border-radius: 0 0 32px 32px;
  box-shadow: 0 15px 45px rgba(0,0,0,0.4);
  margin-top: -110px; /* Pulled much higher to the 'corner' */
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pks-logo-box:hover {
  transform: translateY(5px);
  box-shadow: 0 20px 55px rgba(240,122,30,0.3);
}

.pks-logo {
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* Right-aligned Info Refined */
.footer-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: 22px;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-group p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
}

.gradient-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.highlight-subtitle {
  color: var(--pks-orange);
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-top: -5px;
}

.label-white {
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 2px;
  opacity: 0.9;
}

.text-gray {
  color: #CBD5E1;
  font-weight: 300;
}

.highlight-link {
  color: var(--pks-orange);
  font-weight: 600;
  font-size: 1.1rem;
  display: inline-block;
  transition: all 0.3s ease;
  cursor: pointer;
}

.highlight-link:hover {
  color: white;
}

/* Social Buttons */
.footer-social {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.social-btn {
  width: 44px;
  height: 44px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--pks-orange);
  font-size: 1.15rem;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.social-btn:hover {
  background: var(--pks-orange);
  color: white;
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(240,122,30,0.35);
  border-color: transparent;
}

/* Sub footer */
.sub-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 24px 0;
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
}

.sub-footer-wrap {
  text-align: center;
  color: #64748b;
  font-size: 0.85rem;
}

/* Responsiveness */
@media (max-width: 1100px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 80px;
  }
  
  .footer-info {
    align-items: center;
    text-align: center;
  }
  
  .pks-logo-box {
    margin-top: -60px;
  }
}
</style>
