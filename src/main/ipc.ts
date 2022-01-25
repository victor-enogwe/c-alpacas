import { app, BrowserWindow, ipcMain } from 'electron'
import defaultsDeep from 'lodash.defaultsdeep'
import { State } from '../@types/typings'
import { DEFAULT_STATE } from '../common/options'

export function registerInterProcessCommunication (_event$: Electron.Event, browserWindow: BrowserWindow): void {
  const state: State = defaultsDeep({ desktopPath: app.getPath('desktop') }, DEFAULT_STATE)

  ipcMain.on('setBackgroundColor', (_, color: string) => browserWindow.setBackgroundColor(color))
  ipcMain.on('initialState', () => browserWindow.webContents.send('initialState', state))
  ipcMain.on('preloadDone', () => browserWindow.webContents.send('preloadDone', state))
}
