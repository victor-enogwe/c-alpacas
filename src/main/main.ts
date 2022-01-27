import { app, BrowserWindow, BrowserWindowConstructorOptions, shell } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import { HandlerDetails } from 'electron/main'
import defaultsDeep from 'lodash.defaultsdeep'
import { resolve } from 'path'
import { State } from '../@types/typings'
import { DEFAULT_BACKGROUND_COLOR } from '../common/constants'
import { logger } from '../common/log'
import { registerInterProcessCommunication } from './ipc'
import { MenuBuilder } from './menu'

export class Main {
  isEnvSet = 'ELECTRON_IS_DEV' in process.env
  devMode = this.isEnvSet ? Number.parseInt(String(process.env.ELECTRON_IS_DEV), 10) === 1 : !app.isPackaged

  constructor () {
    log.transports.file.level = 'info'
  }

  async initialize (): Promise<BrowserWindow> {
    this.devModeSettings()
    await this.prodModeSettings()

    const browserWindow = await this.createBrowserWindow()

    return await this.installDevExtensions()
      .then(async () => await this.loadView(browserWindow))
      .then(() => this.setBrowserWindowOptions(browserWindow))
  }

  devModeSettings (): void {
    if (!this.devMode) return

    module.hot?.accept()
  }

  async prodModeSettings (): Promise<void> {
    if (this.devMode) return undefined

    autoUpdater.logger = log

    // try {
    //   await autoUpdater.checkForUpdatesAndNotify()
    // } catch (error: unknown) {
    //   logger.log((error as Error).message)
    // }
  }

  async createBrowserWindow (): Promise<BrowserWindow> {
    const browserWindow = new BrowserWindow({
      width: 768,
      height: 576,
      title: 'C-Alpacas',
      titleBarStyle: 'hidden',
      backgroundColor: DEFAULT_BACKGROUND_COLOR,
      resizable: false,
      frame: false,
      icon: resolve(__static, 'icon.png'),
      webPreferences: {
        webgl: true,
        sandbox: true,
        nodeIntegration: false,
        contextIsolation: true,
        partition: 'persist:tmp',
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
    const menu = new MenuBuilder(browserWindow, this.devMode)
    const { desktopPath, backgroundColor, devMode } = this.initialState(browserWindow)

    menu.buildMenu()
    browserWindow.removeMenu()
    registerInterProcessCommunication(browserWindow)
    this.attachDevTools(browserWindow)

    browserWindow.show()
    browserWindow.webContents.executeJavaScript(`localStorage.setItem('backgroundColor', '${backgroundColor}')`).catch(logger.log)
    browserWindow.webContents.executeJavaScript(`localStorage.setItem('desktopPath', '${desktopPath}')`).catch(logger.log)
    browserWindow.webContents.executeJavaScript(`localStorage.setItem('devMode', '${String(devMode)}')`).catch(logger.log)
    browserWindow.webContents.on('devtools-opened', () => browserWindow.focus())
    browserWindow.webContents.setWindowOpenHandler(this.openExternalLinks.bind(null))

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
    if (!this.devMode) return ''

    return await import('electron-devtools-installer').then(async ({ REACT_DEVELOPER_TOOLS, default: installer }) => {
      const forceDownload = Boolean(process.env.UPGRADE_EXTENSIONS)
      const extensions = [REACT_DEVELOPER_TOOLS]

      return await installer(extensions, { forceDownload, loadExtensionOptions: { allowFileAccess: true } })
    })
  }

  attachDevTools (browserWindow: BrowserWindow): void {
    if (!this.devMode) return

    browserWindow.webContents.openDevTools({ mode: 'undocked', activate: true })
    browserWindow.webContents.debugger.attach('1.1')
  }

  openExternalLinks (
    { url }: HandlerDetails
  ): { action: 'deny' } | { action: 'allow', overrideBrowserWindowOptions?: BrowserWindowConstructorOptions } {
    shell.openExternal(url).catch(logger.log)

    return { action: 'allow' }
  }

  initialState (browserWindow: BrowserWindow): State {
    const backgroundColor = browserWindow.getBackgroundColor()
    const state: State = defaultsDeep({ desktopPath: app.getPath('desktop'), backgroundColor }, { devMode: this.devMode })

    return state
  }
}
