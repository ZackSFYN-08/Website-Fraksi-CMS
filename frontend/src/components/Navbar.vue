<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isMobileMenuOpen = ref(false)
const activeDropdown = ref(null)

const toggleDropdown = (name) => {
  activeDropdown.value = activeDropdown.value === name ? null : name
}

const closeAll = () => {
  activeDropdown.value = null
  isMobileMenuOpen.value = false
}

const handleClickOutside = (e) => {
  if (!e.target.closest('.has-dropdown')) activeDropdown.value = null
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <header class="site-header">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="container top-bar-content">
        <router-link to="/" class="top-home"><i class="fas fa-home"></i> Fraksi PKS DPRD Kota Bandung</router-link>
        <div class="top-social">
          <a href="#"><i class="fab fa-youtube"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-facebook"></i></a>
          <a href="#"><i class="fab fa-x-twitter"></i></a>
        </div>
      </div>
    </div>

    <!-- Main Navigation -->
    <nav class="main-nav">
      <div class="container nav-content">
        <div class="mobile-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
        </div>

        <ul :class="['nav-menu', { open: isMobileMenuOpen }]">
          <li><router-link to="/berita" @click="closeAll">Berita</router-link></li>

          <li class="has-dropdown" @click.stop="toggleDropdown('profil')">
            <a href="#" @click.prevent>Profil <i class="fas fa-chevron-down"></i></a>
            <ul :class="['dropdown', { show: activeDropdown === 'profil' }]" @click.stop>
              <li><router-link to="/profil" @click="closeAll">Profil dan Visi-Misi Fraksi PKS DPRD Kota Bandung</router-link></li>
              <li><router-link to="/anggota" @click="closeAll">Profil Anggota</router-link></li>
            </ul>
          </li>

          <li class="has-dropdown" @click.stop="toggleDropdown('galeri')">
            <a href="#" @click.prevent>Galeri <i class="fas fa-chevron-down"></i></a>
            <ul :class="['dropdown', { show: activeDropdown === 'galeri' }]" @click.stop>
              <li><router-link to="/galeri/foto" @click="closeAll">Foto</router-link></li>
              <li><router-link to="/galeri/video" @click="closeAll">Video</router-link></li>
            </ul>
          </li>

          <li><router-link to="/wawancara-opini" @click="closeAll">Wawancara dan Opini</router-link></li>
          <li><router-link to="/kutipan-media" @click="closeAll">Kutipan Media</router-link></li>

          <li class="has-dropdown" @click.stop="toggleDropdown('aspirasi')">
            <a href="#" @click.prevent>Aspirasi <i class="fas fa-chevron-down"></i></a>
            <ul :class="['dropdown', { show: activeDropdown === 'aspirasi' }]" @click.stop>
              <li><router-link to="/aspirasi/mekanisme" @click="closeAll">Mekanisme Aspirasi</router-link></li>
              <li><router-link to="/aspirasi/form" @click="closeAll">Form Aspirasi</router-link></li>
              <li><router-link to="/aspirasi/tindak-lanjut" @click="closeAll">Tindak Lanjut</router-link></li>
              <li><router-link to="/aspirasi/berita" @click="closeAll">Berita Aspirasi</router-link></li>
            </ul>
          </li>

          <li><router-link to="/event" @click="closeAll">Event</router-link></li>
          <li><router-link to="/pandangan-fraksi" @click="closeAll">Pandangan Fraksi</router-link></li>
          <li><router-link to="/internshipks" @click="closeAll">InternshiPKS</router-link></li>
          <li><router-link to="/peraturan-daerah" @click="closeAll">Peraturan Daerah</router-link></li>
          <li><router-link to="/pansus" @click="closeAll">Pansus</router-link></li>
        </ul>
      </div>
    </nav>

    <!-- Brand Bar -->
    <div class="brand-bar">
      <div class="container brand-content">
        <div class="brand-logos">
          <img src="/logo-dprd.jpg" alt="DPRD Kota Bandung" class="logo-dprd" />
          <img src="https://pks.id/img/logo-pks.png" alt="PKS" class="logo-pks" />
        </div>
        <div class="brand-text">
          <span class="brand-title">Website Resmi</span>
          <span class="brand-name">Fraksi Partai Keadilan Sejahtera DPRD Kota Bandung</span>
          <span class="brand-tagline">Berkhidmat untuk Rakyat, Membangun Kota Bandung Bermartabat</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Top Bar */
.top-bar {
  background: white;
  border-bottom: 1px solid #eee;
  padding: 8px 0;
}
.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.top-home {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--pks-navy);
  display: flex;
  align-items: center;
  gap: 8px;
}
.top-home i { color: var(--pks-orange); }
.top-social {
  display: flex; gap: 14px;
}
.top-social a {
  color: var(--pks-text-muted); font-size: 0.9rem;
}
.top-social a:hover { color: var(--pks-orange); }

/* Main Navigation */
.main-nav {
  background: white;
  border-bottom: 3px solid var(--pks-orange);
  position: relative;
  z-index: 1000;
}
.nav-content {
  display: flex;
  align-items: center;
}
.nav-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  width: 100%;
}
.nav-menu > li > a,
.nav-menu > li > .router-link-active {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--pks-text-dark);
  white-space: nowrap;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  background: none;
}
.nav-menu > li > a:hover,
.nav-menu > li > a.router-link-exact-active {
  background: var(--pks-orange);
  color: white;
}
.nav-menu > li > a .fa-chevron-down {
  font-size: 0.55rem;
  transition: transform 0.2s;
}

/* Dropdowns */
.has-dropdown { position: relative; }
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 320px;
  background: white;
  border: 1px solid #e5e7eb;
  border-top: 3px solid var(--pks-orange);
  box-shadow: var(--shadow-md);
  display: none;
  z-index: 999;
}
.dropdown.show { display: block; }
.dropdown li a {
  display: block;
  padding: 12px 20px;
  font-size: 0.88rem;
  color: var(--pks-text-dark);
  border-bottom: 1px solid #f3f4f6;
}
.dropdown li a:hover {
  background: rgba(240,122,30,0.06);
  color: var(--pks-orange);
  padding-left: 26px;
}
.dropdown li:last-child a { border-bottom: none; }

/* Brand Bar */
.brand-bar {
  background: white;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  position: relative;
  overflow: hidden;
}
.brand-bar::before {
  content: '';
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.02)" stroke-width="1"/></svg>') repeat;
  background-size: 60px;
  pointer-events: none;
}
.brand-content {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1;
}
.logo-pks { height: 70px; }
.logo-dprd { height: 70px; }
.brand-logos {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-text { display: flex; flex-direction: column; }
.brand-title {
  font-size: 0.85rem;
  color: var(--pks-text-muted);
  font-weight: 400;
}
.brand-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--pks-navy);
  line-height: 1.3;
}
.brand-tagline {
  font-size: 0.85rem;
  color: var(--pks-orange);
  font-weight: 500;
  font-style: italic;
}

/* Mobile */
.mobile-toggle {
  display: none;
  font-size: 1.3rem;
  padding: 14px 20px;
  cursor: pointer;
  color: var(--pks-navy);
}

@media (max-width: 992px) {
  .mobile-toggle { display: block; }
  .top-social { display: none; }
  .nav-menu {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    box-shadow: var(--shadow-lg);
    z-index: 999;
  }
  .nav-menu.open { display: flex; }
  .nav-menu > li > a { width: 100%; }
  .dropdown {
    position: static;
    border: none;
    box-shadow: none;
    border-top: none;
    background: #f9fafb;
    min-width: unset;
  }
  .dropdown li a { padding-left: 40px; }
  .brand-content { flex-wrap: wrap; }
  .brand-name { font-size: 1.1rem; }
}

@media (max-width: 576px) {
  .brand-name { font-size: 0.95rem; }
  .logo-pks { height: 50px; }
  .logo-dprd { height: 50px; }
}
</style>
