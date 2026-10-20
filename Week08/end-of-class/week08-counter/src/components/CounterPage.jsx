import {useReducer} from 'react'
import {produce} from 'immer'

const INCREMENT_COUNT = 'increment-count'
const DECREMENT_COUNT = 'decrement-count'
const SET_VALUE_TO_ADD = 'set-value-to-add'
const ADD_VALUE_TO_COUNT = 'add-value-to-count'

// useReducer is a plain function. it takes the current state and action
// and RETURNS THE NEXT STATE it is not allowed to change the state it was given
// we always build and return a new object
const reducer = (state, action) => {
  // action.type says WHY the reducer is running
  /*
  if (action.type === INCREMENT_COUNT) {
    return {
      ...state,
      count: state.count + 1,
    }
  }

  if (action.type === DECREMENT_COUNT) {
    return {
      ...state,
      count: state.count - 1,
    }
  }

  // action.payload carries any DATA the update needs
  if (action.type === SET_VALUE_TO_ADD) {
    return {
      ...state,
      valueToAdd: action.payload,
    }
  }

  if (action.type === ADD_VALUE_TO_COUNT) {
    return {
      ...state,
      count: state.count + state.valueToAdd,
      valueToAdd: 0,
    }
  }
  */
  // REFACTOR: swap conditionals for a switch statement
  /*
  switch (action.type) {
    case INCREMENT_COUNT:
      return {
        ...state,
        count: state.count + 1,
      }
    case DECREMENT_COUNT:
      return {
        ...state,
        count: state.count - 1,
      }
    case SET_VALUE_TO_ADD:
      return {
        ...state,
        valueToAdd: action.payload,
      }
    case ADD_VALUE_TO_COUNT:
      return {
        ...state,
        count: state.count + state.valueToAdd,
        valueToAdd: 0,
      }
    // if none of the above cases matched, at the very least we return state so we don't wipe it out
    default:
      return state
  }
  */
  // REFACTOR: use immer produce
  // (don't forget to wrap your reducer function in your useReducer hook)
  // with immer we can directly mutate state, we don't have to worry about fields we didn't touch
  // aka we don't have to return the entire state object anymore, we just mutate state directly and immer
  // does the worrying for us
  switch (action.type) {
    case INCREMENT_COUNT:
      state.count = state.count + 1
      return

    case DECREMENT_COUNT:
      state.count = state.count - 1
      return

    case SET_VALUE_TO_ADD:
      state.valueToAdd = action.payload
      return
    case ADD_VALUE_TO_COUNT:
      state.count = state.count + state.valueToAdd
      state.valueToAdd = 0
      return
    // if none of the above cases matched, at the very least we return state so we don't wipe it out
    default:
      return state
  }
}

const CounterPage = (props) => {
  const {initialCount} = props
  // const [count, setCount] = useState(initialCount)
  // const [valueToAdd, setValueToAdd] = useState(0)
  const [state, dispatch] = useReducer(produce(reducer), {
    count: initialCount,
    valueToAdd: 0,
  })

  const increment = () => {
    dispatch({type: INCREMENT_COUNT})
  }

  const decrement = () => {
    dispatch({type: DECREMENT_COUNT})
  }

  const handleChange = (event) => {
    const value = parseInt(event.target.value) || 0
    dispatch({
      type: SET_VALUE_TO_ADD,
      payload: value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch({type: ADD_VALUE_TO_COUNT})
  }

  return (
    <div>
      <p className="text-5xl font-bold tabular-nums mb-4">{state.count}</p>

      <div className="flex gap-2">
        <button
          onClick={increment}
          className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
        >
          +1
        </button>
        <button
          onClick={decrement}
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          -1
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 flex items-end gap-2">
        <div>
          <label className="block text-sm text-gray-600" htmlFor="add">
            Add a number
          </label>
          <input
            id="add"
            type="number"
            value={state.valueToAdd || ''}
            onChange={handleChange}
            className="mt-1 w-24 rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
          Add It
        </button>
      </form>
    </div>
  )
}

export default CounterPage
