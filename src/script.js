import Experience from './Experience/Experience.js';

// Get canvas element
const canvas = document.querySelector('canvas.webgl');

// Loading screen elements
const loadingScreen = document.querySelector('.loading-screen');
const loadingProgress = document.querySelector('.loading-progress');
const loadingText = document.querySelector('.loading-text');

// Initialize experience
const experience = new Experience(canvas);

// Listen for resources ready event
experience.resources.on('ready', () => {
  loadingProgress.style.width = '100%';
  loadingText.textContent = 'Ready!';

  setTimeout(() => {
    loadingScreen.classList.add('loaded');
  }, 500);
});

// Update loading progress (optional - can be enhanced with actual progress tracking)
let progress = 0;
const progressInterval = setInterval(() => {
  if (progress < 90) {
    progress += Math.random() * 10;
    loadingProgress.style.width = `${Math.min(progress, 90)}%`;
  }
}, 200);

// Clear interval when resources are ready
experience.resources.on('ready', () => {
  clearInterval(progressInterval);
});
