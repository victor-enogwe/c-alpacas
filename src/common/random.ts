import defaultsDeep from 'lodash.defaultsdeep'
import { Entry, Except } from 'type-fest'
import { AlpacaFeatures, State } from '../@types/typings'
import { PICKER_COLORS } from './constants'
import { ALPACA_ALL_FEATURES, ALPACA_OPTIONS, DEFAULT_STATE } from './options'

export function random (start: number, stop: number): number {
  return Math.floor(Math.random() * (stop - start + 1) + start)
}

export default function randomOptions (): State {
  return defaultsDeep(
    { backgroundColor: PICKER_COLORS[random(0, PICKER_COLORS.length)], Backgrounds: { active: true } },
    ALPACA_ALL_FEATURES.reduce<Except<AlpacaFeatures, 'Backgrounds'>>((features, [feature, subFeatures]) => {
      const multiple = features[feature].multiple
      const selectionCount = multiple ? random(1, subFeatures.length) : 1
      const selectionLength = subFeatures.length - 1
      const poppedSubFeatures = [...subFeatures]
      const selectedSubFeatures = Array(selectionCount).fill('').map(() => poppedSubFeatures.splice(random(0, selectionLength), 1)[0])

      return defaultsDeep({
        [feature]: defaultsDeep({
          options: subFeatures.reduce<Entry<Except<AlpacaFeatures, 'Backgrounds'>>['1']['options']>(
            (accumulator, subFeature) => defaultsDeep({
              [subFeature]: {
                active: selectedSubFeatures.includes(subFeature)
              }
            }, accumulator), { ...ALPACA_OPTIONS[feature].options })
        }, features[feature])
      }, features)
    }, { ...ALPACA_OPTIONS }),
    DEFAULT_STATE
  )
}
