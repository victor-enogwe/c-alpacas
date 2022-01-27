import omit from 'lodash.omit'
import React, { useRef, useState } from 'react'
import { AlpacaComponentProps, AlpacaDimension } from '../@types/typings'
import { ALPACA_OMIT_STATE } from '../common/constants'
import getImage, { imageLeftPosition, imageTopPosition } from '../common/image'
import Actions from './Actions'

export default function TwoDimensionalCanvas (
  { state, setState }: React.PropsWithChildren<AlpacaComponentProps>
): React.ReactElement {
  const ref = useRef<HTMLDivElement | null>(null)
  const dimensions: AlpacaDimension = { width: 720, height: 720 }
  const [magnification] = useState(0.5)
  const { width, height } = { width: dimensions.width * magnification, height: dimensions.height * magnification }

  return (<>
    <div
      ref={ref}
      style={{ backgroundColor: state.backgroundColor }}
      className='canvas d-flex flex-grow-1 flex-fill h-100 position-relative justify-content-center align-items-center overflow-hidden'
    >
      {Object.values(omit(state, ALPACA_OMIT_STATE)).map(
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
              src={getImage(state.devMode, feature, subFeature)}
              alt={`${String(feature)} ${String(subFeature)}`}
            />
          ))
        })}
    </div>
    <Actions state={state} setState={setState} ref={ref} />
  </>)
}
