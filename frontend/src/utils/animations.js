/**
 * Lightweight, requestAnimationFrame-based number counting animation.
 * Replaces heavy Anime.js counting animations.
 */
export const animateValue = (obj, start, end, duration) => {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    
    // EaseOutExpo equivalent
    const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    
    const currentValue = Math.floor(easeOutExpo * (end - start) + start);
    obj.value = currentValue.toLocaleString('id-ID'); // Assuming ref object
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.value = end.toLocaleString('id-ID');
    }
  };
  window.requestAnimationFrame(step);
}

