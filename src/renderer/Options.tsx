import get from 'lodash.get'
import omit from 'lodash.omit'
import sortBy from 'lodash.sortby'
import React from 'react'
import { Except } from 'type-fest'
import { AlpacaComponentProps, AlpacaFeaturesOptions, AlpacaFeaturesOptionsReducer, State } from '../@types/typings'
import { ColorPicker } from './ColorPicker'

export default function Options ({ state, reducers, setBackgroundColor = () => undefined }: AlpacaComponentProps): React.ReactElement {
  const activeFeature: keyof Except<State, 'backgroundColor' | 'desktopPath'> = get(
    Object.values(state).filter(({ active }) => active),
    '0.name'
  )
  const activeFeatureOptions = get(state[activeFeature], 'options', {}) as AlpacaFeaturesOptions
  const activeSubFeatures = Object.values(activeFeatureOptions).filter(({ active }) => active).map(({ name }) => name)
  const showColorPicker = activeFeature === 'Backgrounds'
  const activeFeatureReducer = get(reducers[activeFeature].reducer, 1, () => undefined)

  return (
    <div className='d-flex flex-column justify-content-between flex-grow-1 flex-fill' style={{ minHeight: 392 }}>
      <h2 className='fw-bolder fs-4 mb-5'>Customize Your Alpaca</h2>

      <div
        className="btn-toolbar d-flex flex-column flex-grow-1 flex-fill row row-cols-12 g-5 justify-content-between"
        role="toolbar"
        aria-label="Customize Your Alpaca"
      >
        <div className='d-flex flex-column flex-grow-1 flex-fill'>
          <h3 className='fw-bolder fs-6'>Features</h3>
          <div className="btn-group btn-group-sm flex-wrap flex-row row row-cols-3 g-2" role="group" aria-label="Accessories">
            <button
              type="button"
              className={
                `btn rounded-0 ${state.Backgrounds.active
                  ? `btn-${String(state.Backgrounds.color)} btn-raised`
                  : 'btn-outline-light'}`
              }
              onClick={() => {
                activeFeatureReducer({ type: activeFeature, data: { active: false } })
                reducers.Backgrounds.reducer[1]({ type: 'Backgrounds', data: { active: true } })
              }}
            >
              Backgrounds
            </button>
            {sortBy(Object.values(omit(state, ['backgroundColor', 'desktopPath', 'Backgrounds'])), ({ name }) => name)
              .map(({ name, color, active }, index) => (
                <button
                  type="button"
                  className={`btn rounded-0 ${active ? `btn-${String(color)} btn-raised` : 'btn-outline-light'}`}
                  key={`feature-${index}`}
                  onClick={() => {
                    activeFeatureReducer({ type: activeFeature, data: { active: false } })
                    reducers[name].reducer[1]({ type: name, data: { active: true } })
                  }}
                >
                  {name}
                </button>
              ))}
          </div>
        </div>

        <div className='d-flex flex-column flex-grow-1 flex-fill'>
          <h3 className='fw-bolder small'>Pick {activeFeature}</h3>
          <div
            className="btn-group btn-group-sm flex-wrap flex-row row row-cols-3 g-2"
            role="group" aria-label={`${activeFeature} Styles`}
          >
            {showColorPicker && <ColorPicker color={state?.backgroundColor ?? ''} setBackgroundColor={setBackgroundColor} />}
            {sortBy(Object.values(activeFeatureOptions), ({ name }) => name).map(({ name, color, active }, index) => (
              <button
                type="button"
                className={`btn rounded-0 ${active ? `btn-${String(color)} btn-raised` : 'btn-outline-light'}`}
                key={`${activeFeature}-${String(name)}-${index}`}
                onClick={() => {
                  const multiple = state[activeFeature].multiple
                  const reducer: AlpacaFeaturesOptionsReducer = get(reducers[activeFeature].options, `${String(name)}.reducer.1`)
                  const features = activeSubFeatures.filter(feature => feature !== name)
                  const resetOptions = features.reduce((acc, type) => ({ ...acc, [type as string]: { active: false } }), {})

                  if (!multiple) activeFeatureReducer({ type: activeFeature, data: { options: resetOptions } })

                  reducer({ type: name, data: { active: multiple ? !active : true } })
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
