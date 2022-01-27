import React, { useCallback, useEffect, useReducer } from 'react'
import { RenderStyle } from '../@types/typings'
import randomOptions from '../common/random'
import TwoDimensionalCanvas from './2DCanvas'
import ThreeDimensionalCanvas from './3DCanvas'
import Footer from './Footer'
import Options from './Options'
import featureReducers from './reducers/feature'
import stateReducer from './reducers/state'

export default function App (): React.ReactElement {
  const [state, setState] = useReducer(stateReducer, randomOptions())
  const setBackground = useCallback((data: string) => setState({ type: 'backgroundColor', data }), [])
  const setRenderer = useCallback((data: RenderStyle) => setState({ type: 'renderer', data }), [])
  const reducers = featureReducers(state, setState)
  const style = { backgroundColor: state.backgroundColor }

  useEffect(() => window.electron?.ipcRenderer.send('setBackgroundColor', state.backgroundColor), [state.backgroundColor])

  return <div
    className='container d-flex flex-column flex-grow-1 flex-fill overflow-hidden position-relative h-100 justify-content-center'
    style={style}
  >
    <div className='d-flex flex-row flex-grow-1 flex-fill justify-content-center align-items-center row m-3'>
      <div className='d-flex flex-column col-7 justify-content-between g-2 row pe-5'>
        {state.renderer === '2d'
          ? <TwoDimensionalCanvas state={state} setState={setState} reducers={reducers} />
          : <ThreeDimensionalCanvas state={state} setState={setState} reducers={reducers} />
        }
      </div>
      <div className='d-flex flex-column justify-content-between col-5 flex-grow-1 flex-fill'>
        <Options state={state} setState={setState} reducers={reducers} setBackgroundColor={setBackground} setRenderer={setRenderer}/>
      </div>
    </div>
    <Footer state={state} />
  </div>
}
