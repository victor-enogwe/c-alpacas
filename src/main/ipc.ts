import { BrowserWindow, ipcMain } from 'electron'

export function registerInterProcessCommunication (browserWindow: BrowserWindow): void {
  ipcMain.on('setBackgroundColor', (_, color: string) => browserWindow.setBackgroundColor(color))
}
