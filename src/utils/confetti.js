// src/utils/confetti.js
import confetti from 'canvas-confetti';

export const runConfetti = (themeColors = ['#FF69B4', '#FF1493', '#FF4500']) => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 10000,
    colors: themeColors
  };

  const fire = (particleRatio, opts) => {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  };

  fire(0.25, { spread: 26, startVelocity: 55, angle: 60 });
  fire(0.25, { spread: 26, startVelocity: 55, angle: 120 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 45, decay: 0.9 });
};