import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin()
    ]
  },
  preload: {
    plugins: []
  },
  renderer: {
    plugins: [
      // copy Shoelace SVGs into /shoelace/assets/icons
      viteStaticCopy({
        targets: [
          {
            src: '../../node_modules/@shoelace-style/shoelace/dist/assets/icons/*.svg',
            dest: 'shoelace/assets/icons'
          }
        ]
      })
      // …any other renderer plugins here
    ],
    build: {
      rollupOptions: {
        input: {
          // Entry for main window
          main: resolve(__dirname, 'src/renderer/index.html'),
          // Entry for settings window
          settings: resolve(__dirname, 'src/renderer/settings.html')
        }
      }
    }
  }
});
