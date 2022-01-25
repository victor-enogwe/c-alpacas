import {
  app, BrowserWindow, Menu, MenuItemConstructorOptions, shell
} from 'electron'
import { DarwinMenuItemConstructorOptions } from '../@types/typings'

export class MenuBuilder {
  private readonly platform: NodeJS.Platform = process.platform
  private readonly macOs = this.platform === 'darwin'

  constructor (private readonly browserWindow: BrowserWindow, private readonly devMode: boolean) {}

  buildMenu (): Menu {
    this.setupDevelopmentEnvironment()

    const template = this.macOs ? this.buildDarwinTemplate() : this.buildDefaultTemplate()
    const menu = Menu.buildFromTemplate(template)

    Menu.setApplicationMenu(menu)

    return menu
  }

  setupDevelopmentEnvironment (): void {
    if (!this.devMode) return

    this.browserWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.browserWindow.webContents.inspectElement(x, y)
          }
        }
      ]).popup({ window: this.browserWindow })
    })
  }

  buildDarwinTemplate (): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Electron',
      submenu: [
        {
          label: 'About ElectronReact',
          selector: 'orderFrontStandardAboutPanel:'
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide ElectronReact',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    }
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        }
      ]
    }
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.browserWindow.webContents.reload()
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.browserWindow.setFullScreen(!this.browserWindow.isFullScreen())
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.browserWindow.webContents.toggleDevTools()
          }
        }
      ]
    }
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.browserWindow.setFullScreen(!this.browserWindow.isFullScreen())
          }
        }
      ]
    }
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' }
      ]
    }
    const subMenuHelp: MenuItemConstructorOptions = {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => await shell.openExternal('https://electronjs.org')
        }
      ]
    }

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp]
  }

  buildDefaultTemplate (): Array<MenuItemConstructorOptions | Electron.MenuItem> {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O'
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.browserWindow.close()
            }
          }
        ]
      }
      // {
      //   label: '&View',
      //   submenu:
      //     process.env.NODE_ENV === 'development' ||
      //     process.env.DEBUG_PROD === 'true'
      //       ? [
      //           {
      //             label: '&Reload',
      //             accelerator: 'Ctrl+R',
      //             click: () => {
      //               this.browserWindow.webContents.reload()
      //           }
      //           },
      //           {
      //             label: 'Toggle &Full Screen',
      //             accelerator: 'F11',
      //             click: () => {
      //               this.browserWindow.setFullScreen(
      //                 !this.browserWindow.isFullScreen()
      //               )
      //           }
      //           },
      //           {
      //             label: 'Toggle &Developer Tools',
      //             accelerator: 'Alt+Ctrl+I',
      //             click: () => {
      //               this.browserWindow.webContents.toggleDevTools()
      //           }
      //           }
      //         ]
      //       : [
      //           {
      //             label: 'Toggle &Full Screen',
      //             accelerator: 'F11',
      //             click: () => {
      //               this.browserWindow.setFullScreen(
      //                 !this.browserWindow.isFullScreen()
      //               )
      //           }
      //           }
      //         ]
      // },
      // {
      //   label: 'Help',
      //   submenu: [
      //     {
      //       label: 'Learn More',
      //       click () {
      //         shell.openExternal('https://electronjs.org')
      //       }
      //     },
      //     {
      //       label: 'Documentation',
      //       click () {
      //         shell.openExternal(
      //           'https://github.com/electron/electron/tree/main/docs#readme'
      //         )
      //       }
      //     },
      //     {
      //       label: 'Community Discussions',
      //       click () {
      //         shell.openExternal('https://www.electronjs.org/community')
      //       }
      //     },
      //     {
      //       label: 'Search Issues',
      //       click () {
      //         shell.openExternal('https://github.com/electron/electron/issues')
      //       }
      //     }
      //   ]
      // }
    ]

    return templateDefault
  }
}
