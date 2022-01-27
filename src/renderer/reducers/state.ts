import defaultsDeep from 'lodash.defaultsdeep'
import { PartialDeep } from 'type-fest'
import { AlpacaFeatures, AlpacaFeaturesOptions, State, StateAction } from '../../@types/typings'

export default function stateReducer (state: State, { data, type }: StateAction<PartialDeep<State>>): State {
  return defaultsDeep({}, { [type]: data }, state)
}

export function featureReducer (
  state: AlpacaFeatures[keyof AlpacaFeatures],
  { data }: StateAction<AlpacaFeatures>
): AlpacaFeatures[keyof AlpacaFeatures] {
  return defaultsDeep({}, data, state)
}

export function featureOptionsReducer (
  state: AlpacaFeaturesOptions[keyof AlpacaFeaturesOptions],
  { data }: StateAction<PartialDeep<AlpacaFeaturesOptions>>
): AlpacaFeaturesOptions[keyof AlpacaFeaturesOptions] {
  return defaultsDeep({}, data, state)
}
