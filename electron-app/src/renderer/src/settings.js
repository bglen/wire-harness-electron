// UI
import '@shoelace-style/shoelace/dist/themes/dark.css';
import { setBasePath, getBasePath } from '@shoelace-style/shoelace/dist/shoelace.js';

// tell Shoelace where its assets live (icons, etc.)
setBasePath('/shoelace');
console.log('Shoelace base path:', getBasePath());

window.onload = () => {
};