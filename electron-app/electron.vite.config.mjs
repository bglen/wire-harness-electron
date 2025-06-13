import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin()
    ]
  },
  preload: {
    plugins: [
      externalizeDepsPlugin()
    ]
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
    ]
  }
});
