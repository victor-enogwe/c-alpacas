import get from 'lodash.get'
import React, { forwardRef } from 'react'
import { AlpacaComponentProps, State } from '../@types/typings'
import { captureImage } from '../common/image'
import randomOptions from '../common/random'

const Actions = forwardRef(({ state, setState }: Pick<AlpacaComponentProps, 'state' | 'setState'>, ref) => (
  <div className="d-grid d-flex flex-grow-1 flex-fill gap-2">
    <button
      className="btn btn-outline-light btn-raised rounded-0 flex-fill"
      type="button"
      onClick={() => {
        const randomState = randomOptions()
        const features = Object.keys(randomState) as Array<keyof State>
        return features.forEach(type => setState({ type, data: randomState[type] }))
      }}
    >
      Random
    </button>
    <button
      className="btn btn-outline-light btn-raised rounded-0 flex-fill"
      type="button"
      onClick={async () => await captureImage(get(ref, 'current'), state.desktopPath)}
    >
      Download
    </button>
  </div>
))

Actions.displayName = 'Actions'

export default Actions
