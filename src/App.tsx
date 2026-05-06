import React, { useEffect } from 'react'
import './App.css'
import Result from './containers/Result'
import Filters from './containers/Filters'
import { initFilters } from './actions/filterActions'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store/configureStore'

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const fileName = useSelector((state: RootState) => state.fileSelection.name)

  useEffect(() => {
    dispatch(initFilters())
  }, [dispatch])

  useEffect(() => {
    document.title = fileName ? `UnLog :: ${fileName}` : 'UnLog'
  }, [fileName])

  return (
    <div className="app-root">
      <Filters />
      <Result />
      <div style={{ position: 'fixed', bottom: 4, right: 8, fontSize: '0.7em', opacity: 0.4 }}>
        v{__APP_VERSION__}
      </div>
    </div>
  )
}

export default App
