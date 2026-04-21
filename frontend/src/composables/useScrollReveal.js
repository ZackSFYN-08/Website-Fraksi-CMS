import { onMounted, onUnmounted } from 'vue'
import { revealAnimation } from '../utils/animations'

/**
 * Composable that adds scroll-reveal animations using IntersectionObserver.
 * Elements with [data-reveal] attribute will animate in when scrolled into view using Anime.js.
 * 
 * Supports:
 *   data-reveal="fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom" | "flip"
 *   data-reveal-delay="100" (ms)
 */
export function useScrollReveal() {
  let observer = null
  let mutationObserver = null

  const observeElements = (container = document) => {
    const elements = container.querySelectorAll('[data-reveal]')
    elements.forEach((el) => {
      // Only set initial state if not already revealed
      if (!el.classList.contains('revealed')) {
        // Initial hidden state (can also be handled in CSS, but doing it here for clarity)
        el.style.opacity = '0'
        observer.observe(el)
      }
    })
  }

  const initObserver = () => {
    // 1. Setup IntersectionObserver
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target
            const type = el.dataset.reveal || 'fade-up'
            const delay = el.dataset.revealDelay || 0

            // Use Anime.js utility
            revealAnimation(el, type, delay)
            
            el.classList.add('revealed')
            observer.unobserve(el)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    // 2. Initial observation
    observeElements()

    // 3. Setup MutationObserver to watch for new dynamic elements
    mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          observeElements()
        }
      })
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  onMounted(() => {
    // Small delay to ensure initial paint
    setTimeout(() => {
      initObserver()
    }, 100)
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
    if (mutationObserver) mutationObserver.disconnect()
  })
}
