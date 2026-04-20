import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/berita', name: 'berita', component: () => import('../views/BeritaView.vue') },
    { path: '/berita/:documentId', name: 'berita-detail', component: () => import('../views/BeritaDetailView.vue') },
    { path: '/profil', name: 'profil', component: () => import('../views/ProfilView.vue') },
    { path: '/profil-partai', name: 'profil-partai', component: () => import('../views/ProfilPartaiView.vue') },
    { path: '/anggota', name: 'anggota', component: () => import('../views/MembersView.vue') },
    { path: '/anggota/:documentId', name: 'anggota-detail', component: () => import('../views/MemberDetailView.vue') },
    { path: '/galeri/foto', name: 'galeri-foto', component: () => import('../views/GaleriFotoView.vue') },
    { path: '/galeri/video', name: 'galeri-video', component: () => import('../views/GaleriVideoView.vue') },
    { path: '/wawancara-opini', name: 'wawancara-opini', component: () => import('../views/WawancaraOpiniView.vue') },
    { path: '/kutipan-media', name: 'kutipan-media', component: () => import('../views/KutipanMediaView.vue') },
    { path: '/aspirasi/mekanisme', name: 'aspirasi-mekanisme', component: () => import('../views/AspirasiMekanismeView.vue') },
    { path: '/aspirasi/form', name: 'aspirasi-form', component: () => import('../views/KontakView.vue') },
    { path: '/aspirasi/tindak-lanjut', name: 'aspirasi-tindak-lanjut', component: () => import('../views/AspirasiTindakLanjutView.vue') },
    { path: '/aspirasi/berita', name: 'aspirasi-berita', component: () => import('../views/AspirasiBeritaView.vue') },
    { path: '/event', name: 'event', component: () => import('../views/EventView.vue') },
    { path: '/pandangan-fraksi', name: 'pandangan-fraksi', component: () => import('../views/PandanganFraksiView.vue') },
    { path: '/kontak', name: 'kontak', component: () => import('../views/KontakView.vue') },
    { path: '/internshipks', name: 'internshipks', component: () => import('../views/InternshipksView.vue') },
    { path: '/peraturan-daerah', name: 'peraturan-daerah', component: () => import('../views/PeraturanDaerahView.vue') },
    { path: '/pansus', name: 'pansus', component: () => import('../views/PansusView.vue') },
    { path: '/hasil-pemilu-2024', name: 'hasil-pemilu-2024', component: () => import('../views/HasilPemilu2024View.vue') },
  ],
})

export default router

