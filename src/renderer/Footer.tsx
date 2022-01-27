import React from 'react'
import { State } from '../@types/typings'
import getBrowserData from '../common/browser'
import { getStatic } from '../common/image'

export default function Footer ({ state }: { state: State}): React.ReactElement {
  const githubLink = window.electron.versions.GIT_URL
  const nodeVersion = window?.electron?.versions?.NODE_VERSION ?? window.electron.versions.NODE_VERSION
  const electronVersion = window?.electron?.versions?.ELECTRON_VERSION ?? window.electron.versions.ELECTRON_VERSION
  const { brand, version } = getBrowserData()
  const undefinedVersion = window.electron.versions.CHROME_VERSION === 'undefined'
  const wpBrowserVersion = undefinedVersion ? version : window.electron.versions.CHROME_VERSION
  const browserVersion = window?.electron?.versions?.CHROME_VERSION ?? wpBrowserVersion

  return (
    <footer className='d-flex flex-column justify-content-center align-items-center mb-3'>
      <div className='d-flex flex-row justify-content-center'>
        <span>Running on Node.js</span>
        <span id="node-version"> {nodeVersion}</span>, {brand}
        <span id="browser-version"> {browserVersion}</span>, and Electron
        <span id="electron-version"> {electronVersion} </span>
      </div>
      <div id="github-link">
        <a href={githubLink} title="Github" className='btn btn-sm text-decoration-none lh-2' role="button" target="_blank" rel='noreferrer'>
          <img src={`${getStatic(state.devMode)}github.png`} alt="Github"></img>
          Github
        </a>
      </div>
    </footer>
  )
}
