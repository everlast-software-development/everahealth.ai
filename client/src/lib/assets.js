// Every processed image in assets/live, by file name without extension
const files = import.meta.glob('../assets/live/*.webp', { eager: true, import: 'default' });
export const img = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split('/').pop().replace('.webp', ''), url])
);
export { default as manifest } from '../assets/live/manifest.json';
export { default as facemesh } from '../assets/live/facemesh.json';
