import omit from 'lodash.omit'
import React, { useRef, useState } from 'react'
import { AlpacaComponentProps, AlpacaDimension, State } from '../@types/typings'
import getImage, { captureImage, imageLeftPosition, imageTopPosition } from '../common/image'
import randomOptions from '../common/random'

export default function AppCanvas (
  { state, setState }: React.PropsWithChildren<AlpacaComponentProps>
): React.ReactElement {
  const ref = useRef<HTMLDivElement | null>(null)
  const dimensions: AlpacaDimension = { width: 720, height: 720 }
  const [magnification] = useState(0.5)
  const { width, height } = { width: dimensions.width * magnification, height: dimensions.height * magnification }

  return (<>
    <div
      ref={ref}
      className='canvas d-flex flex-grow-1 flex-fill h-100 position-relative justify-content-center align-items-center overflow-hidden'
    >
      {Object.values(omit(state, ['backgroundColor', 'desktopPath', 'Backgrounds'])).map(
        ({ name: feature, options }, featureIndex, features) => {
          const activeOptions = Object.values(options).filter(({ active }) => active)
          return activeOptions.map(({ name: subFeature, zIndex }, subFeatureIndex) => (
            <img
              key={subFeatureIndex}
              width={width}
              height={height}
              className="position-absolute"
              style={{
                zIndex,
                left: imageLeftPosition(feature, subFeature),
                top: imageTopPosition(feature, subFeature)
              }}
              src={getImage(feature, subFeature)}
              alt={`${String(feature)} ${String(subFeature)}`}
            />
          ))
        })}
    </div>
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
        onClick={async () => await captureImage(ref.current, state.desktopPath)}
      >
        Download
      </button>
    </div>
  </>)
}
