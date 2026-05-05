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
    <div>
      <Filters />
      <Result />
    </div>
  )
}

export default App
