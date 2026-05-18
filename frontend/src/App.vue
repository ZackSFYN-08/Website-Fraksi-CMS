<script setup>
import { computed, onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { restoreSession } from './stores/authStore'

const route = useRoute()
const isPortalPage = computed(() => route.path.startsWith('/anggota/portal') || route.path === '/anggota/login')

onMounted(() => { restoreSession() })
</script>

<template>
  <div class="app-layout">
    <div class="fixed-bg"></div>
    <Navbar v-if="!isPortalPage" />
    
    <main class="main-content">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <Footer v-if="!isPortalPage" />
  </div>
</template>

<style>
@import './assets/style.css';

.fixed-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-color: var(--pks-bg);
  background-image: 
    linear-gradient(rgba(248, 250, 252, 0.50), rgba(248, 250, 252, 0.50)),
    url('@/assets/bg-pattern.jpg');
  background-repeat: repeat;
  background-position: top center;
  background-size: 80px;
}

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>
