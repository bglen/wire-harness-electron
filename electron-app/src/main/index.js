import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import * as fs from 'fs'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let settingsWindow

// disable all GPU usage and ANGLE/EGL probing
app.disableHardwareAcceleration()

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 800,     // ← smallest allowed width
    minHeight: 600,    // ← smallest allowed height
    show: false,
    backgroundColor: '#1e1e1e',   // ← dark grey right from the start
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function createSettingsWindow() {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus()
    return
  }

  settingsWindow = new BrowserWindow({
    width: 700,
    height: 500,
    minWidth: 700,     // ← smallest allowed width
    minHeight: 500,    // ← smallest allowed height
    show: false,
    backgroundColor: '#1e1e1e',   // ← dark grey right from the start
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
   const devUrl = process.env.ELECTRON_RENDERER_URL
  if (is.dev && devUrl) {
    settingsWindow.loadURL(`${devUrl}/settings.html`)
  } else {
    settingsWindow.loadFile(join(__dirname, '../renderer/settings.html'))
  }

  settingsWindow.once('ready-to-show', () => {
    settingsWindow.show()
  })

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })
}

// Listen for renderer’s “open-settings” request
ipcMain.handle('open-settings', () => {
  createSettingsWindow()
})

// Show a dialog to select a project file and return its contents
ipcMain.handle('open-project', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Open Project',
    filters: [{ name: 'Project Files', extensions: ['proj_sch'] }],
    properties: ['openFile']
  })
  if (canceled || filePaths.length === 0) {
    return { canceled: true }
  }
  const filePath = filePaths[0]
  try {
    const data = fs.readFileSync(filePath, 'utf-8')
    return { canceled: false, filePath, data }
  } catch (err) {
    return { canceled: false, filePath, error: err.message }
  }
})
