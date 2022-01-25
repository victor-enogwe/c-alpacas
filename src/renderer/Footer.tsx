import React from 'react'

export default function Footer (): React.ReactElement {
  return (
    <footer className='text-center mb-3'>
      Running on Node.js <span id="node-version">{process.versions.node}</span>, Chromium
      <span id="chrome-version">{process.versions.chrome}</span>, and Electron
      <span id="electron-version">{process.versions.electron}</span>.
    </footer>
  )
}
