import {useSelector, useDispatch} from 'react-redux'
import {PRINTS} from '../data/prints'
import {itemAdded} from '../features/cartSlice'
import {filterChanged, selectColourFilter} from '../features/uiSlice'

const SWATCH = {
  red: 'bg-flat-red',
  blue: 'bg-flat-blue',
  yellow: 'bg-flat-yellow',
}

const FILTERS = ['all', 'red', 'blue', 'yellow']

const Catalog = () => {
  const dispatch = useDispatch()
  const colourFilter = useSelector(selectColourFilter)

  const visible =
    colourFilter === 'all'
      ? PRINTS
      : PRINTS.filter((print) => print.colour === colourFilter)

  return (
    <section>
      <div className="flex border-b-4 border-ink">
        {FILTERS.map((filter) => {
          const isActive = filter === colourFilter

          return (
            <button
              key={filter}
              onClick={() => dispatch(filterChanged(filter))}
              className={`flex-1 border-r-4 border-ink px-2 py-2 text-xs font-black uppercase ${
                isActive ? 'bg-ink text-paper' : 'bg-paper'
              }`}
            >
              {filter}
            </button>
          )
        })}
      </div>

      <ul className="grid grid-cols-2">
        {visible.map((print) => {
          return (
            <li key={print.id} className="border-b-4 border-r-4 border-ink">
              <div className={`h-28 ${SWATCH[print.colour]}`} />

              <div className="flex items-center justify-between gap-2 px-3 py-3">
                <div>
                  <p className="text-sm font-black uppercase">{print.title}</p>
                  <p className="text-xs">${print.price}</p>
                </div>

                <button
                  onClick={() => dispatch(itemAdded(print))}
                  className="border-4 border-ink bg-flat-yellow px-3 py-1 text-xs font-black uppercase"
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
