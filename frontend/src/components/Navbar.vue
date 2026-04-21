<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import anime from 'animejs'

const isMobileMenuOpen = ref(false)
const activeDropdown = ref(null)
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleDropdown = (name) => {
  activeDropdown.value = activeDropdown.value === name ? null : name
}

const closeAll = () => {
  activeDropdown.value = null
  isMobileMenuOpen.value = false
}

const handleClickOutside = (e) => {
  if (!e.target.closest('.has-dropdown')) {
    activeDropdown.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll)

  // Entrance Animation
  const tl = anime.timeline({
    easing: 'easeOutExpo',
    duration: 1000
  })

  tl.add({
    targets: '.brand-link',
    translateX: [-30, 0],
    opacity: [0, 1],
    delay: 500
  })
  .add({
    targets: '.nav-item',
    translateY: [-20, 0],
    opacity: [0, 1],
    delay: anime.stagger(100)
  }, '-=700')
  .add({
    targets: '.nav-cta',
    scale: [0.8, 1],
    opacity: [0, 1]
  }, '-=500')
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header :class="['site-header', { 'is-scrolled': isScrolled }]">
    <div class="container header-container">
      <!-- Brand Section -->
      <router-link to="/" class="brand-link" @click="closeAll">
        <div class="logo-wrapper">
          <img src="/logo-dprd.jpg" alt="DPRD" class="logo-dprd" />
          <div class="logo-divider"></div>
          <img src="https://pks.id/img/logo-pks.png" alt="PKS" class="logo-pks" />
        </div>
        <div class="brand-info">
          <span class="brand-top">FRAKSI <strong>PKS</strong></span>
          <span class="brand-bottom">DPRD KOTA BANDUNG</span>
        </div>
      </router-link>

      <!-- Navigation Section -->
      <nav :class="['nav-menu', { 'mobile-active': isMobileMenuOpen }]">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/berita" class="menu-link" @click="closeAll">Berita</router-link>
          </li>
          
          <li class="nav-item has-dropdown" 
            @mouseenter="!isMobileMenuOpen && (activeDropdown = 'profil')" 
            @mouseleave="!isMobileMenuOpen && (activeDropdown = null)"
          >
            <button :class="['menu-btn', { 'is-active': activeDropdown === 'profil' }]" @click.stop="toggleDropdown('profil')">
              Profil <i class="fas fa-chevron-down"></i>
            </button>
            <div :class="['glass-dropdown', { 'visible': activeDropdown === 'profil' }]">
              <router-link to="/profil-partai" class="drop-link" @click="closeAll">Profil Partai</router-link>
              <router-link to="/hasil-pemilu-2024" class="drop-link" @click="closeAll">Hasil Pemilu 2024</router-link>
              <router-link to="/profil" class="drop-link" @click="closeAll">Visi & Misi</router-link>
              <router-link to="/anggota" class="drop-link" @click="closeAll">Anggota Fraksi</router-link>
            </div>
          </li>

          <li class="nav-item has-dropdown"
            @mouseenter="!isMobileMenuOpen && (activeDropdown = 'aspirasi')" 
            @mouseleave="!isMobileMenuOpen && (activeDropdown = null)"
          >
            <button :class="['menu-btn', { 'is-active': activeDropdown === 'aspirasi' }]" @click.stop="toggleDropdown('aspirasi')">
              Aspirasi <i class="fas fa-chevron-down"></i>
            </button>
            <div :class="['glass-dropdown', { 'visible': activeDropdown === 'aspirasi' }]">
              <router-link to="/aspirasi/mekanisme" class="drop-link" @click="closeAll">Mekanisme</router-link>
              <router-link to="/aspirasi/form" class="drop-link" @click="closeAll">Sampaikan Aspirasi</router-link>
              <router-link to="/aspirasi/tindak-lanjut" class="drop-link" @click="closeAll">Tindak Lanjut</router-link>
              <router-link to="/aspirasi/berita" class="drop-link" @click="closeAll">Berita Aspirasi</router-link>
            </div>
          </li>

          <li class="nav-item has-dropdown"
            @mouseenter="!isMobileMenuOpen && (activeDropdown = 'kegiatan')" 
            @mouseleave="!isMobileMenuOpen && (activeDropdown = null)"
          >
            <button :class="['menu-btn', { 'is-active': activeDropdown === 'kegiatan' }]" @click.stop="toggleDropdown('kegiatan')">
              Kegiatan <i class="fas fa-chevron-down"></i>
            </button>
            <div :class="['glass-dropdown', { 'visible': activeDropdown === 'kegiatan' }]">
              <router-link to="/event" class="drop-link" @click="closeAll">Agenda & Event</router-link>
              <router-link to="/galeri/foto" class="drop-link" @click="closeAll">Galeri Foto</router-link>
              <router-link to="/galeri/video" class="drop-link" @click="closeAll">Galeri Video</router-link>
            </div>
          </li>

          <li class="nav-item has-dropdown"
            @mouseenter="!isMobileMenuOpen && (activeDropdown = 'publikasi')" 
            @mouseleave="!isMobileMenuOpen && (activeDropdown = null)"
          >
            <button :class="['menu-btn', { 'is-active': activeDropdown === 'publikasi' }]" @click.stop="toggleDropdown('publikasi')">
              Publikasi <i class="fas fa-chevron-down"></i>
            </button>
            <div :class="['glass-dropdown', { 'visible': activeDropdown === 'publikasi' }]">
              <router-link to="/pandangan-fraksi" class="drop-link" @click="closeAll">Pandangan Fraksi</router-link>
              <router-link to="/peraturan-daerah" class="drop-link" @click="closeAll">Perda</router-link>
              <router-link to="/pansus" class="drop-link" @click="closeAll">Pansus</router-link>
              <div class="drop-divider"></div>
              <router-link to="/wawancara-opini" class="drop-link" @click="closeAll">Opini</router-link>
              <router-link to="/kutipan-media" class="drop-link" @click="closeAll">Kutipan Media</router-link>
            </div>
          </li>
        </ul>
        
        <div class="nav-cta">
          <router-link to="/internshipks" class="btn btn-navy cta-nav" @click="closeAll">
            <i class="fas fa-graduation-cap"></i> InternshipKS
          </router-link>
        </div>
      </nav>

      <!-- Mobile Trigger -->
      <button :class="['mobile-trigger', { 'is-active': isMobileMenuOpen }]" @click="isMobileMenuOpen = !isMobileMenuOpen">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Mobile Overlay -->
      <div :class="['mobile-overlay', { 'is-active': isMobileMenuOpen }]" @click="closeAll"></div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0; left: 0; width: 100%;
  height: 90px;
  z-index: 1000;
  display: flex;
  align-items: center;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  background: transparent;
}

.site-header.is-scrolled {
  height: 80px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 10px 30px rgba(0, 34, 68, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

/* Brand Link */
.brand-link {
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none;
  position: relative;
  z-index: 1011;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 8px 12px;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}

.logo-dprd { height: 32px; width: auto; }
.logo-pks { height: 28px; width: auto; }
.logo-divider { width: 1px; height: 20px; background: var(--pks-gray); }

.brand-info { display: flex; flex-direction: column; }
.brand-top {
  font-size: 1.15rem;
  color: var(--pks-navy);
  line-height: 1;
  letter-spacing: -0.5px;
  transition: font-size 0.3s ease;
}
.brand-top strong { color: var(--pks-orange); font-weight: 900; }
.brand-bottom {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--pks-text-muted);
  letter-spacing: 2.5px;
  margin-top: 2px;
  transition: all 0.3s ease;
}

@media (max-width: 480px) {
  .brand-top { font-size: 1rem; }
  .brand-bottom { font-size: 0.6rem; letter-spacing: 1.5px; }
}

/* Nav Menu */
.nav-menu { display: flex; align-items: center; gap: 40px; }
.nav-list { display: flex; align-items: center; gap: 8px; list-style: none; }

.menu-link, .menu-btn {
  padding: 10px 18px;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--pks-navy);
  border-radius: 10px;
  transition: all 0.3s ease;
  background: none; border: none; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
}

.menu-link:hover, .menu-btn:hover, .menu-btn.is-active, .router-link-active {
  color: var(--pks-orange);
  background: rgba(240, 122, 30, 0.08);
}

.menu-btn i { font-size: 0.7rem; opacity: 0.5; transition: transform 0.3s ease; }
.menu-btn.is-active i { transform: rotate(180deg); opacity: 1; }

.has-dropdown { position: relative; }
.has-dropdown::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 15px; /* bridge the gap so mouseleave doesn't trigger */
}
.glass-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  z-index: 1000;
  min-width: 240px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 20px 40px rgba(0, 34, 68, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  opacity: 0; transform: translateY(5px); pointer-events: none;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  display: flex; flex-direction: column; gap: 4px;
}

.glass-dropdown.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }

.drop-link {
  padding: 12px 18px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--pks-text-dark);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.drop-link:hover {
  background: var(--pks-orange);
  color: white;
  padding-left: 24px;
}

.drop-divider { height: 1px; background: rgba(0, 34, 68, 0.05); margin: 6px 0; }

.cta-nav { padding: 10px 24px; font-size: 0.85rem; }

/* Mobile Trigger */
.mobile-trigger {
  display: none;
  width: 40px; height: 40px;
  background: none; border: none; cursor: pointer;
  position: relative; z-index: 1010;
}

.mobile-trigger span {
  display: block; width: 24px; height: 2px;
  background: var(--pks-navy);
  margin: 5px auto;
  transition: all 0.3s ease;
}

.mobile-trigger.is-active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.mobile-trigger.is-active span:nth-child(2) { opacity: 0; }
.mobile-trigger.is-active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 34, 68, 0.4);
  backdrop-filter: blur(4px);
  opacity: 0;
  pointer-events: none;
  transition: all 0.5s ease;
  z-index: 1004;
}

.mobile-overlay.is-active {
  opacity: 1;
  pointer-events: auto;
}

@media (max-width: 1100px) {
  .nav-menu {
    position: fixed; top: 0; right: -100%;
    width: 340px; height: 100vh;
    background: white;
    flex-direction: column;
    padding: 120px 30px;
    box-shadow: -15px 0 40px rgba(0,34,68,0.08);
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 1005;
    overflow-y: auto;
  }
  .nav-menu.mobile-active { right: 0; }
  .nav-list { flex-direction: column; width: 100%; align-items: flex-start; gap: 4px; }
  .nav-item { width: 100%; }
  .menu-link, .menu-btn { 
    width: 100%; 
    padding: 12px 15px; 
    font-size: 1.05rem; 
    justify-content: space-between; 
  }
  .glass-dropdown {
    position: static; opacity: 1; transform: none; 
    pointer-events: auto; box-shadow: none; border: none;
    background: var(--pks-white-smoke);
    max-height: 0;
    overflow: hidden;
    display: flex; margin: 0;
    padding: 0 10px;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .glass-dropdown.visible { 
    max-height: 500px; 
    padding: 10px;
    margin: 5px 0 10px;
  }
  .drop-link { padding: 10px 15px; }
  .mobile-trigger { display: block; }
  .logo-wrapper { padding: 6px 10px; }
  .brand-top { font-size: 1rem; }
  .nav-cta { width: 100%; margin-top: 20px; }
  .cta-nav { width: 100%; padding: 15px; font-size: 1rem; }
}
</style>



