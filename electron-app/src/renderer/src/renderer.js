// UI
import '@shoelace-style/shoelace/dist/themes/dark.css';
import { setBasePath, getBasePath } from '@shoelace-style/shoelace/dist/shoelace.js';

// Canvas
import * as fabric from 'fabric';
import { initializeGrid } from '../../wire-harness-core/src/ui/canvas/grid.js';
import { initializeCanvasControls } from '../../wire-harness-core/src/ui/canvas/controls.js';
import { initializeStatusBar } from '../../wire-harness-core/src/ui/canvas/statusBar.js';
import { parseProjectFile } from '../../wire-harness-core/src/core/io/loader.js';
import { setProject } from '../../wire-harness-core/src/core/state/projectState.js';

// tell Shoelace where its assets live (icons, etc.)
setBasePath('/shoelace');
console.log('Shoelace base path:', getBasePath());

window.onload = () => {
    if (location.pathname.endsWith('settings.html')) {
        initSettingsWindow();
    } else {
        initMainWindow();
    }
};

function initMainWindow() {
    const canvasElement = document.getElementById("fabricCanvas");

    // Create a Fabric canvas linked to a <canvas> element with id "fabricCanvas"
    const canvas = new fabric.Canvas('fabricCanvas', {
        backgroundColor: '#ffffff',
        selection: false,
    });

    // Grid Presets
    const gridPresets = [10, 25, 50, 100];

    initializeGrid(canvas, canvasElement, gridPresets);
    initializeCanvasControls(canvas);
    initializeStatusBar(canvas);

    // Sidebar Buttons
    const settingsBtn = document.getElementById('settings-btn')
    const openProjectBtn = document.getElementById('open-project-btn')

    settingsBtn.addEventListener('click', () => {
        window.electronAPI.openSettings()
            .catch(err => console.error('Failed to open settings:', err))
    })

    openProjectBtn.addEventListener('click', async () => {
        try {
            const result = await window.electronAPI.openProject()
            if (!result || result.canceled) return

            if (result.error) {
                console.error('Failed to read file:', result.error)
                return
            }
            const parse = parseProjectFile(result.data)
            if (parse.error) {
                console.error('Failed to parse project:', parse.error, parse.details)
            } else {
                setProject(parse.data)
                console.log('Loaded project:', parse.data.project.name)
            }
        } catch (err) {
            console.error('Open project failed:', err)
        }
    })
}

function initSettingsWindow() {
    // only settings-page logic:
    const saveBtn = document.getElementById('save-settings')
    saveBtn.addEventListener('click', () => { /* … */ })
    // load & render saved prefs, etc.
}
