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

const electronAPI = { ipcRenderer: { send, sendSync, on, once } }

contextBridge.exposeInMainWorld('electron', electronAPI)
