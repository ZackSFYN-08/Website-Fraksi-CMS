import { onMounted, onUnmounted } from 'vue'

let globalObserver = null
let globalMutationObserver = null
let activeComponents = 0

const observeElements = () => {
  if (!globalObserver) return
  const elements = document.querySelectorAll('[data-reveal]:not(.is-visible)')
  elements.forEach((el) => {
    globalObserver.observe(el)
  })
}

export function useScrollReveal() {
  onMounted(() => {
    activeComponents++
    
    // Inisialisasi observer hanya pada komponen pertama yang me-mount
    if (activeComponents === 1) {
      globalObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              globalObserver.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      )

      let timeoutId = null
      globalMutationObserver = new MutationObserver((mutations) => {
        const hasAddedNodes = mutations.some(mutation => mutation.addedNodes.length > 0)
        if (hasAddedNodes) {
          if (timeoutId) clearTimeout(timeoutId)
          timeoutId = setTimeout(() => {
            observeElements()
          }, 200) // Debounce lebih panjang (200ms) agar tidak membebani CPU
        }
      })

      globalMutationObserver.observe(document.body, { childList: true, subtree: true })
    }

    // Panggil sekali saat mount dengan jeda kecil
    setTimeout(() => {
      observeElements()
    }, 100)
  })

  onUnmounted(() => {
    activeComponents--
    
    // Bersihkan observer hanya jika tidak ada lagi komponen yang menggunakannya
    if (activeComponents === 0) {
      if (globalObserver) {
        globalObserver.disconnect()
        globalObserver = null
      }
      if (globalMutationObserver) {
        globalMutationObserver.disconnect()
        globalMutationObserver = null
      }
    }
  })
}
