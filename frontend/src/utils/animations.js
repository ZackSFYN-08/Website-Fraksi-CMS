import anime from 'animejs'

/**
 * Premium Page Transitions
 */
export const pageTransition = {
  // Before Enter: Set initial state
  beforeEnter(el) {
    if (!el) return
    anime.set(el, {
      opacity: 0,
      translateY: 30,
      scale: 0.98
    })
  },
  
  // Enter: Animate in
  enter(el, done) {
    if (!el) return done()
    anime({
      targets: el,
      opacity: [0, 1],
      translateY: [30, 0],
      scale: [0.98, 1],
      duration: 800,
      easing: 'easeOutElastic(1, .8)',
      complete: done // Anime.js ensures this is called
    })
    
    // Safety fallback
    setTimeout(() => {
      if (el.style.opacity === '0') done()
    }, 1000)
  },
  
  // Leave: Animate out
  leave(el, done) {
    if (!el) return done()
    anime({
      targets: el,
      opacity: [1, 0],
      translateY: [0, -20],
      scale: [1, 0.98],
      duration: 400,
      easing: 'easeInSine',
      complete: done
    })
    
    // Safety fallback
    setTimeout(done, 500)
  }
}

/**
 * Enhanced Reveal Animations
 * Replaces basic CSS transitions from useScrollReveal
 */
export const revealAnimation = (el, type = 'fade-up', delay = 0) => {
  const animations = {
    'fade-up': { translateY: [40, 0], opacity: [0, 1] },
    'fade-down': { translateY: [-40, 0], opacity: [0, 1] },
    'fade-left': { translateX: [40, 0], opacity: [0, 1] },
    'fade-right': { translateX: [-40, 0], opacity: [0, 1] },
    'zoom': { scale: [0.9, 1], opacity: [0, 1] },
    'flip': { rotateX: [90, 0], opacity: [0, 1] }
  }

  const animation = animations[type] || animations['fade-up']

  anime({
    targets: el,
    ...animation,
    delay: Number(delay),
    duration: 1000,
    easing: 'easeOutElastic(1, .6)'
  })
}

/**
 * Staggered Entrance for Lists/Grids
 */
export const staggerReveal = (targets, delay = 0) => {
  anime({
    targets,
    translateY: [30, 0],
    opacity: [0, 1],
    delay: anime.stagger(100, { start: delay }),
    duration: 800,
    easing: 'easeOutQuad'
  })
}

/**
 * Micro-interactions
 */
export const pulse = (el) => {
  anime({
    targets: el,
    scale: [1, 1.05, 1],
    duration: 400,
    easing: 'easeInOutQuad'
  })
}

export const hoverLift = (el, active = true) => {
  anime({
    targets: el,
    translateY: active ? -8 : 0,
    scale: active ? 1.02 : 1,
    boxShadow: active ? '0 20px 25px -5px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
    duration: 400,
    easing: 'easeOutQuad'
  })
}
