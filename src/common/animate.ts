import { PerspectiveCamera, Scene, WebGLRenderer } from 'three'

export default function animate (
  { renderer, scene, camera, cb }: {
    renderer: WebGLRenderer
    scene: Scene
    camera: PerspectiveCamera | null
    cb?: (...args: unknown[]) => unknown
  }
): void {
  if (!camera) return

  requestAnimationFrame(animate.bind(null, { renderer, scene, camera, cb }))
  if (cb) cb()
  renderer.render(scene, camera)
}
