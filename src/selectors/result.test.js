import { getResult, getIterationCount } from '../selectors/result'
import { setFilters, addFilter } from '../actions/filterActions'
import {configureTestStore} from '../store/configureStore'

function check(store, count) {
  getResult(store.getState())
  expect(getIterationCount()).toEqual(count)
}

it("should not recompute when adding incomplete filter", () => {
  const store = configureTestStore()
  const file = { type: 'text', text: 'foobar', enabled: true }
  store.dispatch(setFilters([file]))
  check(store, 1)
  store.dispatch(addFilter({type: 'grep', pattern: 'foo', enabled: true}))
  check(store, 2)
  store.dispatch(addFilter({type: 'grep', pattern: 'bar', enabled: false}))
  check(store, 2)
})
