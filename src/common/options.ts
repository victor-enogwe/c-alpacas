import { Entry, Except } from 'type-fest'
import { Accessories, AlpacaFeatures, Eyes, Hair, Legs, Mouths, Necks, State } from '../@types/typings'
import { ALPACA_FEATURES, ALPACA_SUB_FEATURES, COLORS, DEFAULT_BACKGROUND_COLOR } from './constants'
import { imageZIndex } from './image'

export const ALPACA_ALL_FEATURES: Array<[
  keyof Omit<AlpacaFeatures, 'Backgrounds'>, Array<Hair | Eyes | Mouths | Legs | Necks | Accessories>
]> =
  ALPACA_FEATURES.map((feature, index) => [feature, ALPACA_SUB_FEATURES[index]])

export const ALPACA_OPTIONS = ALPACA_ALL_FEATURES.reduce<Except<AlpacaFeatures, 'Backgrounds'>>(
  (features, [feature, subFeatures], index) => ({
    ...features,
    [feature]: {
      name: feature,
      color: COLORS[index],
      active: false,
      multiple: feature === 'Accessories',
      options: subFeatures.reduce<Entry<Except<AlpacaFeatures, 'Backgrounds'>>['1']['options']>((accumulator, subFeature, subIndex) => ({
        ...accumulator,
        [subFeature]: {
          name: subFeature,
          color: COLORS[subIndex],
          active: subFeature === 'Default',
          zIndex: imageZIndex(feature, subFeature)
        }
      }), Object.create({}))
    }
  }), Object.create({}))

export const DEFAULT_STATE: State = {
  devMode: Boolean(localStorage.getItem('devMode')),
  backgroundColor: localStorage.getItem('backgroundColor') ?? DEFAULT_BACKGROUND_COLOR,
  desktopPath: localStorage.getItem('desktopPath') ?? '',
  renderer: '2d',
  Backgrounds: { name: 'Backgrounds', color: 'primary', active: true, multiple: false, options: {} },
  ...ALPACA_OPTIONS
}
