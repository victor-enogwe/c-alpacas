import { app, BrowserWindow } from 'electron'
import { Main } from './main'

const main = new Main()
const zeroBrowserWindowInstance = BrowserWindow.getAllWindows().length === 0

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.on('activate', () => zeroBrowserWindowInstance ? main.initialize() : undefined)
app.on('window-all-closed', () => process.platform !== 'darwin' ? app.quit() : undefined)
app.enableSandbox()
app.whenReady()
  .then(async () => await main.initialize())
  .catch(error => console.error(error.message))
