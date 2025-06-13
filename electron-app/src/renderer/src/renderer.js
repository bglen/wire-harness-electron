import * as fabric from 'fabric';
import { initializeGrid } from '../../wire-harness-core/src/ui/canvas/grid.js';
import '@shoelace-style/shoelace/dist/themes/dark.css';
import { setBasePath, getBasePath } from '@shoelace-style/shoelace/dist/shoelace.js';

// tell Shoelace where its assets live (icons, etc.)
setBasePath('/shoelace');
console.log('Shoelace base path:', getBasePath());

window.onload = () => {
    const canvasElement = document.getElementById("fabricCanvas");
    // Create a Fabric canvas linked to a <canvas> element with id "fabricCanvas"
    const canvas = new fabric.Canvas('fabricCanvas', {
        backgroundColor: '#ffffff',
        selection: false,
    });

    // Grid Presets
    const gridPresets = [10, 25, 50, 100];

    initializeGrid(canvas, canvasElement, gridPresets);
};