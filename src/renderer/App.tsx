import React, { useCallback, useEffect, useReducer } from 'react'
import { State } from '../@types/typings'
import AppCanvas from './Canvas'
import Footer from './Footer'
import Options from './Options'
import featureReducers from './reducers/feature'
import stateReducer from './reducers/state'

export default function App ({ state: defaultState }: { state: State }): React.ReactElement {
  const [state, setState] = useReducer(stateReducer, defaultState)
  const setBackground = useCallback((data: string) => setState({ type: 'backgroundColor', data }), [])
  const reducers = featureReducers(state, setState)
  const style = { backgroundColor: state.backgroundColor }

  useEffect(() => window.electron.ipcRenderer.send('setBackgroundColor', state.backgroundColor), [state.backgroundColor])

  return <div
    className='container d-flex flex-column flex-grow-1 flex-fill overflow-hidden position-relative h-100 justify-content-center'
    style={style}
  >
    <div className='d-flex flex-row flex-grow-1 flex-fill justify-content-center align-items-center row m-3'>
      <div className='d-flex flex-column col-7 justify-content-between g-2 row pe-5'>
        <AppCanvas state={state} setState={setState} reducers={reducers} />
      </div>
      <div className='d-flex flex-column justify-content-between col-5 flex-grow-1 flex-fill'>
        <Options state={state} setState={setState} reducers={reducers} setBackgroundColor={setBackground}/>
      </div>
    </div>
    <Footer />
  </div>
}
