<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app-layout">
    <div class="fixed-bg"></div>
    <Navbar />
    
    <main class="main-content">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <Footer />
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
