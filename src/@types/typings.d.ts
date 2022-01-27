import { Menu, MenuItemConstructorOptions } from 'electron'
import React from 'react'
import { Options as SourcemapSupportOptions, Position, UrlAndMap } from 'source-map-support'
import THREE from 'three'
import { Entry, Except, Merge, PartialDeep, UnionToIntersection } from 'type-fest'

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let __static: string

  interface Window {
    electron: {
      ipcRenderer: {
        send: Electron.IpcRenderer['send']
        sendSync: Electron.IpcRenderer['sendSync']
        on: Electron.IpcRenderer['on']
        once: Electron.IpcRenderer['once']
      }
    }
    sourceMapSupport: {
      wrapCallSite: (frame: unknown) => unknown
      getErrorSource: (error: Error) => string | null
      mapSourcePosition: (position: Position) => Position
      retrieveSourceMap: (source: string) => UrlAndMap | null
      resetRetrieveHandlers: () => void
      install: (options?: SourcemapSupportOptions) => void
    }
  }
}

export type ThreeJs = typeof THREE

export type Color = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'

export type Accessories = 'Earings' | 'Flower' | 'Glasses' | 'HeadPhone'

export type Hair = 'Default' | 'Curls' | 'Short' | 'Bang' | 'Elegant' | 'Fancy' | 'Quiff'

export type Ears = 'Default' | 'Tilt Backward' | 'Tilt Forward'

export type Eyes = 'Default' | 'Angry' | 'Naughty' | 'Panda' | 'Smart' | 'Star'

export type Legs = 'Default' | 'Bubble Tea' | 'Cookie' | 'Game Console' | 'Tilt Backward' | 'Tilt Forward'

export type Mouths = 'Default' | 'Astonished' | 'Eating' | 'Laugh' | 'Tongue'

export type Necks = 'Default' | 'Bend Backward' | 'Bend Forward' | 'Thick'

export type RenderStyle = '2d' | '3d'

export type Noses = 'Default'

export type AllowedChannels = 'setBackgroundColor'

export type OmitState = 'backgroundColor' | 'desktopPath' | 'Backgrounds' | 'devMode' | 'renderer'

export type AlpacaFeaturesOptions = UnionToIntersection<Entry<AlpacaFeatures>['1']['options']>

export type AlpacaFeaturesOptionsReducer = React.Dispatch<StateAction<AlpacaFeaturesOptions>>

export interface AlpacaDimension {
  width: number
  height: number
  zIndex?: number
}

export interface Feature<T> {
  name: keyof T
  color: Color
  active: boolean
  multiple: boolean
  options: {
    [key in keyof Entry<T>[1]]: Merge<
    Except<Feature<{ [k in key]: Entry<Entry<T>['1']>['1'] }>, 'options' | 'multiple'>,
    Required<Pick<AlpacaDimension, 'zIndex'>>
    >
  }
}

export interface AlpacaFeatures {
  Hair: Feature<{ Hair: { [key in Hair]: Feature<Record<string, undefined>> } }>
  Ears: Feature<{ Ears: { [key in Ears]: Feature<{ [k in key]: Feature<Record<string, undefined>> }> } }>
  Eyes: Feature<{ Eyes: { [key in Eyes]: Feature<{ [k in key]: Feature<Record<string, undefined>>}> } }>
  Mouths: Feature<{ Mouths: { [key in Mouths]: Feature<{ [k in key]: Feature<Record<string, undefined>> }> } }>
  Necks: Feature<{ Necks: { [key in Necks]: Feature<{ [k in key]: Feature<Record<string, undefined>> }> } }>
  Legs: Feature<{ Legs: { [key in Legs]: Feature<{ [k in key]: Feature<Record<string, undefined>> }> } }>
  Accessories: Feature<{ Accessories: { [key in Accessories]: Feature<{ [k in key]: Feature<Record<string, undefined>> }> } }>
  Noses: Feature<{ Noses: { [key in Noses]: Feature<{ [k in key]: Feature<Record<string, undefined>> }> } }>
  Backgrounds: Feature<{ Backgrounds: undefined }>
}

export interface AppOptions {
  backgroundColor: string
  desktopPath: string
  devMode: boolean
  renderer: RenderStyle
}

export interface State extends AppOptions, AlpacaFeatures {}

export interface StateAction<T> {
  type: keyof T
  data: PartialDeep<T[keyof T]>
}

export interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string
  submenu?: DarwinMenuItemConstructorOptions[] | Menu
}

export interface AlpacaComponentProps {
  state: State
  setState: React.Dispatch<StateAction<PartialDeep<State>>>
  setBackgroundColor?: (color: string) => void
  setRenderer?: (style: RenderStyle) => void
  reducers: {
    [key in Entry<AlpacaFeatures>['0']]: {
      reducer: [AlpacaFeatures[key], React.Dispatch<StateAction<AlpacaFeatures>>]
      options: {
        [k in keyof AlpacaFeatures[key]['options']]: {
          reducer: [AlpacaFeatures[key]['options'], React.Dispatch<StateAction<AlpacaFeatures[key]['options']>>]
        }
      }
    }
  }
}
