import defaultsDeep from 'lodash.defaultsdeep'
import get from 'lodash.get'
import { useEffect, useReducer } from 'react'
import { Entry, Except, PartialDeep } from 'type-fest'
import {
  AlpacaComponentProps,
  AlpacaFeatures,
  AlpacaFeaturesOptions, State,
  StateAction
} from '../../@types/typings'
import { ALPACA_ALL_FEATURES } from '../../common/options'
import { featureOptionsReducer, featureReducer } from './state'

export default function featureReducers (
  state: AlpacaFeatures, setState: React.Dispatch<StateAction<PartialDeep<State>>>
): AlpacaComponentProps['reducers'] {
  const backgroundsReducer = useReducer(featureReducer, get(state, 'Backgrounds'))

  useEffect(() => setState({ type: 'Backgrounds', data: get(backgroundsReducer, 0) }), [backgroundsReducer[0]])

  return defaultsDeep(
    {},
    ALPACA_ALL_FEATURES.reduce<Except<AlpacaComponentProps['reducers'], 'Backgrounds'>>((reducers, [feature, subFeatures]) => {
      const reducer = useReducer(featureReducer, state[feature])
      const featureValue = get(reducer, 0)

      useEffect(() => setState({ type: feature, data: featureValue }), [featureValue])

      const optionsReducers = subFeatures.reduce<Entry<Except<AlpacaComponentProps['reducers'], 'Backgrounds'>>['1']['options']>(
        (accumulators, subFeature) => {
          const subOptions = state[feature].options as AlpacaFeaturesOptions
          const subState = subOptions[subFeature]
          const subReducer = useReducer(featureOptionsReducer, subState)
          const subFeatureValue = get(subReducer, 0)

          useEffect(() => reducer[1]({ type: feature, data: { options: { [subFeature]: subFeatureValue } } }), [subFeatureValue])

          return { ...accumulators, [subFeature]: { reducer: subReducer } }
        }, Object.create({}))

      return { ...reducers, [feature]: { reducer, options: optionsReducers } }
    }, Object.create({})),
    { Backgrounds: { reducer: backgroundsReducer, options: {} } }
  )
}
