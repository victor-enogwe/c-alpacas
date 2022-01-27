import React, { useEffect, useState } from 'react'
import { ThreeJs } from '../../@types/typings'
import animate from '../../common/animate'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const THREEJS: ThreeJs = require('three/build/three.js')

export default function Earings (): React.ReactElement {
  const { DoubleSide, Mesh, MeshBasicMaterial, PerspectiveCamera, RingGeometry, Scene, WebGLRenderer } = THREEJS
  const [ref, setRef] = useState<HTMLDivElement | null>(null)
  const width = ref?.offsetWidth ?? 0
  const height = ref?.offsetHeight ?? 0
  const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
  const scene = new Scene()
  const renderer = new WebGLRenderer()
  const geometry = new RingGeometry(1, 1.5, 32)
  const material = new MeshBasicMaterial({ color: 0x00ff00, side: DoubleSide })
  const ring = new Mesh(geometry, material)

  renderer.setSize(width, height)
  scene.add(ring)
  camera.position.setZ(5)
  ref?.appendChild(renderer.domElement)

  useEffect(() => animate({ renderer, scene, camera }), [ref])

  return <div className="earings" ref={setRef}/>
}
