import React, { useRef } from 'react'
import { AlpacaComponentProps } from '../@types/typings'
import Earings from './accessories/earings'
import Actions from './Actions'

export default function ThreeDimensionalCanvas (
  { state, setState }: React.PropsWithChildren<AlpacaComponentProps>
): React.ReactElement {
  const ref = useRef<HTMLCanvasElement | null>(null)

  return (<>
    <canvas
      ref={ref}
      style={{ backgroundColor: state.backgroundColor }}
      className='canvas d-flex flex-grow-1 flex-fill h-100 position-relative justify-content-center align-items-center overflow-hidden'
    >
      <Earings />

    </canvas>
    <Actions state={state} setState={setState} ref={ref} />
  </>)
}
