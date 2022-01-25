/* eslint-disable @typescript-eslint/no-var-requires */
/* exposes very few node API's so use carefully */
import { contextBridge, IpcRenderer, ipcRenderer, IpcRendererEvent } from 'electron'
import sourceMapSupport from 'source-map-support'
import { AllowedChannels } from '../@types/typings'

const allowedChannels: AllowedChannels[] = []

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

process.once('loaded', () => {
  const electronAPI = { ipcRenderer: { send, sendSync, on, once } }

  contextBridge.exposeInMainWorld('sourceMapSupport', sourceMapSupport)
  contextBridge.exposeInMainWorld('electron', electronAPI)

  ipcRenderer.sendSync('initialState')

  ipcRenderer.on('initialState', (_, initialState) => {
    console.error('jghhjhjjhhjh')
    const state = { backgroundColor: '#fe9200', ...initialState }

    contextBridge.exposeInMainWorld('state', state)

    ipcRenderer.sendSync('preloadDone')
  })
})
