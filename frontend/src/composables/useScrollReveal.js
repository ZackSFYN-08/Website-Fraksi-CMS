import { onMounted, onUnmounted } from 'vue'

/**
 * Composable that adds scroll-reveal animations using IntersectionObserver.
 * Elements with [data-reveal] attribute will animate in when scrolled into view using CSS transitions.
 */
export function useScrollReveal() {
  let observer = null
  let mutationObserver = null

  const observeElements = (container = document) => {
    const elements = container.querySelectorAll('[data-reveal]')
    elements.forEach((el) => {
      if (!el.classList.contains('is-visible')) {
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

            // Add is-visible class to trigger CSS transition
            el.classList.add('is-visible')
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
