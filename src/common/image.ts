import html2canvas from 'html2canvas'
import { AlpacaFeatures, AlpacaFeaturesOptions } from '../@types/typings'

export function getStatic (): string {
  return __static
}

export function imageZIndex (feature: keyof AlpacaFeatures, subFeature: keyof AlpacaFeaturesOptions): number {
  switch (feature) {
    case 'Accessories':
      switch (subFeature) {
        case 'Earings': return 8
        case 'Flower': return 8
        case 'HeadPhone': return 9
        case 'Glasses': return 10
        default: return 3
      }
    case 'Necks': return 2
    case 'Hair': return 7
    case 'Noses': return 8
    case 'Eyes': return 9
    case 'Mouths': return 11
    default: return 1
  }
}

export function imageLeftPosition (feature: keyof AlpacaFeatures, subFeature: keyof AlpacaFeaturesOptions): number | undefined {
  switch (feature) {
    case 'Accessories':
      switch (subFeature) {
        case 'Glasses': return 15
        case 'HeadPhone': return 5
        default: return undefined
      }
    case 'Mouths': return 29
    case 'Hair':
      switch (subFeature) {
        case 'Fancy':
        case 'Quiff': return 65
        case 'Curls': return 15
        case 'Bang': return 6
        default: return 12
      }
    default: return undefined
  }
}

export function imageTopPosition (feature: keyof AlpacaFeatures, subFeature: keyof AlpacaFeaturesOptions): number | undefined {
  switch (feature) {
    case 'Hair':
      switch (subFeature) {
        case 'Curls': return 10
        default: return undefined
      }
    default: return undefined
  }
}

export default function getImage (feature: keyof AlpacaFeatures, subFeature: keyof AlpacaFeaturesOptions): string {
  return `${getStatic()}/${feature}/${subFeature.replace(' ', '-')}`.toLowerCase() + '.png'
}

export async function captureImage (screen: HTMLDivElement | null, path: string): Promise<void> {
  if (!screen) return

  return await html2canvas(screen)
    .then(canvas => canvas.toDataURL('image/png').replace(/^data:image\/png/, 'data:application/octet-stream'))
    .then(base64Data => console.error(path, base64Data, 'base64', console.error))
}