import { PerspectiveCamera } from 'three'

export default function createCamera (ref: HTMLDivElement | null): PerspectiveCamera | null {
  if (!ref) return null

  const width = ref.offsetWidth
  const height = ref.offsetHeight
  const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)

  camera.position.setZ(5)

  return camera
}
