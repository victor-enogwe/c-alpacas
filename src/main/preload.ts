/* eslint-disable @typescript-eslint/no-var-requires */
/* exposes very few node API's so use carefully */
import { contextBridge, IpcRenderer, ipcRenderer, IpcRendererEvent } from 'electron'
import { AllowedChannels } from '../@types/typings'

const allowedChannels: AllowedChannels[] = ['setBackgroundColor']

function channelAllowed (channel: AllowedChannels): void {
  const allowed = allowedChannels.includes(channel)

  if (!allowed) throw new Error('invalid channel')
}

function send (channel: AllowedChannels, ...args: unknown[]): void {
  channelAllowed(channel)

  return ipcRenderer.send(channel, ...args)
}

function sendSync (channel: AllowedChannels, ...args: unknown[]): unknown {
  channelAllowed(channel)

  return ipcRenderer.sendSync(channel, ...args)
}

function on (this: IpcRenderer, channel: AllowedChannels, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): IpcRenderer {
  channelAllowed(channel)

  return ipcRenderer.on(channel, listener)
}

function once (this: IpcRenderer, channel: AllowedChannels, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): IpcRenderer {
  channelAllowed(channel)

  return ipcRenderer.once(channel, listener)
}

const NODE_VERSION = process.versions.node
const CHROME_VERSION = process.versions.chrome
const ELECTRON_VERSION = process.versions.electron
const electronAPI = { ipcRenderer: { send, sendSync, on, once }, versions: { NODE_VERSION, CHROME_VERSION, ELECTRON_VERSION } }

contextBridge.exposeInMainWorld('electron', electronAPI)
