// One easing curve and a few presets, used everywhere so motion feels consistent
export const ease = [0.22, 1, 0.36, 1];
export const inView = { once: true, amount: 0.3 };
export const rise = (delay = 0, y = 40) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: inView,
  transition: { duration: 0.9, ease, delay },
});
