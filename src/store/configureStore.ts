import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '../reducers/index'

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function configureTestStore(initialState?: any) {
  return configureStore({
    reducer: rootReducer,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    preloadedState: initialState,
  })
}
