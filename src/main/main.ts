import { app, BrowserWindow, shell } from 'electron'
import installer, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import partialRight from 'lodash.partialright'
import { resolve } from 'path'
import { registerInterProcessCommunication } from './ipc'
import { MenuBuilder } from './menu'

export class Main {
  devMode = Boolean(process.env.ELECTRON_IS_DEV) ?? !app.isPackaged

  constructor () {
    log.transports.file.level = 'info'

    this.devModeSettings()
    this.prodModeSettings()
  }

  async initialize (): Promise<BrowserWindow> {
    return await this.createBrowserWindow().then(this.loadView.bind(this)).then(this.setBrowserWindowOptions.bind(this))
  }

  devModeSettings (): void {
    if (!this.devMode) return

    module.hot?.accept()
  }

  prodModeSettings (): void {
    if (this.devMode) return undefined

    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify().catch(console.error)
  }

  async createBrowserWindow (): Promise<BrowserWindow> {
    const browserWindow = new BrowserWindow({
      width: 768,
      height: 576,
      title: 'C-Alpacas',
      titleBarStyle: 'hidden',
      resizable: false,
      frame: false,
      icon: resolve(__static, 'icon.png'),
      webPreferences: {
        webgl: true,
        sandbox: true,
        nodeIntegration: false,
        contextIsolation: true,
        preload: resolve(app.getAppPath(), 'preload.js')
      }
    })

    return await Promise.resolve(browserWindow)
  }

  async loadView (browserWindow: BrowserWindow): Promise<BrowserWindow> {
    await browserWindow.loadURL(this.resolveHtmlPath())
    return browserWindow
  }

  setBrowserWindowOptions (browserWindow: BrowserWindow): BrowserWindow {
    if (this.devMode) browserWindow.webContents.openDevTools({ mode: 'undocked', activate: true })
    const menu = new MenuBuilder(browserWindow, this.devMode)

    menu.buildMenu()
    browserWindow.removeMenu()
    browserWindow.webContents.once('dom-ready', partialRight(registerInterProcessCommunication, browserWindow))
    browserWindow.webContents.once('dom-ready', () => { this.installDevExtensions().catch(console.error) })
    browserWindow.webContents.debugger.attach('1.1')

    return browserWindow
  }

  resolveHtmlPath (htmlFileName = 'index.html'): string {
    if (this.devMode) {
      const port = String(process.env.ELECTRON_WEBPACK_WDS_PORT)
      const url = new URL(`http://localhost:${port}`)
      url.pathname = htmlFileName

      return url.href
    } else {
      const htmlPath = resolve(app.getAppPath(), htmlFileName)

      return `file://${htmlPath}`
    }
  }

  async installDevExtensions (): Promise<string> {
    const forceDownload = Boolean(process.env.UPGRADE_EXTENSIONS)
    const extensions = [REACT_DEVELOPER_TOOLS]

    return await installer(extensions, forceDownload)
  }

  openExternalLinks (event: Electron.NewWindowEvent, url: string): void {
    event.preventDefault()
    shell.openExternal(url).catch(console.error)
  }
}
