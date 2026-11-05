import {useDispatch} from 'react-redux'
import {PRINTS} from '../data/prints'
import {itemAdded} from '../features/cartSlice'

const SWATCH = {
  red: 'bg-flat-red',
  blue: 'bg-flat-blue',
  yellow: 'bg-flat-yellow',
}

const Catalog = () => {
  // all ths is doing is giving us direct access to store's dispatch function
  // this is the SAME dispatch idea we met with useReducer, except this is one dispatch for the entire app
  const dispatch = useDispatch()
  return (
    <section>
      <ul className="grid grid-cols-2">
        {PRINTS.map((print) => {
          return (
            <li key={print.id} className="border-b-4 border-r-4 border-ink">
              <div className={`h-28 ${SWATCH[print.color]}`} />

              <div className="flex items-center justify-between gap-2 px-3 py-3">
                <div>
                  <p className="text-sm font-black uppercase">{print.title}</p>
                  <p className="text-xs">${print.price}</p>
                </div>

                {/* itemAdded(print)  does NOT change anything! it builds an action object, and dispatch is what sends it*/}
                <button
                  className="border-4 border-ink bg-flat-yellow px-3 py-1 text-xs font-black uppercase"
                  onClick={() => dispatch(itemAdded(print))}
                >
                  Add
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default Catalog
