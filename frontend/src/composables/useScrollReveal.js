import { onMounted, onUnmounted } from 'vue'

/**
 * Composable that adds scroll-reveal animations using IntersectionObserver.
 * Elements with [data-reveal] attribute will animate in when scrolled into view.
 * 
 * Supports:
 *   data-reveal="fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom" | "flip"
 *   data-reveal-delay="100" (ms)
 *   data-reveal-duration="600" (ms)
 */
export function useScrollReveal() {
  let observer = null
  let mutationObserver = null

  const observeElements = (container = document) => {
    const elements = container.querySelectorAll('[data-reveal]')
    elements.forEach((el) => {
      if (!el.classList.contains('reveal-hidden') && !el.classList.contains('revealed')) {
        el.classList.add('reveal-hidden')
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
            const delay = el.dataset.revealDelay || 0
            const duration = el.dataset.revealDuration || 600

            el.style.transitionDuration = `${duration}ms`

            setTimeout(() => {
              el.classList.add('revealed')
            }, Number(delay))

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
