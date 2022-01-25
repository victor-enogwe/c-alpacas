import React from 'react'
import ReactDOM from 'react-dom'
import { DEFAULT_STATE } from '../common/options'
import '../scss/index.scss'
import App from './App'

window.sourceMapSupport.install()

window.electron.ipcRenderer.on('preloadDone', () => {
  ReactDOM.render(<App state={{ ...DEFAULT_STATE, ...window.state }}/>, document.getElementById('app'))
})
