<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { pageTransition } from './utils/animations'
</script>

<template>
  <div class="app-layout">
    <Navbar />
    
    <main class="main-content">
      <RouterView v-slot="{ Component, route }">
        <Transition 
          :css="false"
          @before-enter="pageTransition.beforeEnter"
          @enter="pageTransition.enter"
          @leave="pageTransition.leave"
          mode="out-in"
        >
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <Footer />
  </div>
</template>

<style>
@import './assets/style.css';

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--pks-bg);
  background-image: 
    linear-gradient(rgba(248, 250, 252, 0.50), rgba(248, 250, 252, 0.50)),
    url('@/assets/bg-pattern.jpg');
  background-repeat: repeat;
  background-position: top center;
  background-size: 80px;
  background-attachment: fixed;
}

.main-content {
  flex: 1;
}
</style>
