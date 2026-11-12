import {useSelector, useDispatch} from 'react-redux'
import {removeArt, selectVisibleArt} from '../store'

const ArtList = () => {
  const dispatch = useDispatch()

  // Worked out at render time, from 2 pieces of state we already have
  // Nothing new is stored in redux, so nothing can go stale
  const visible = useSelector(selectVisibleArt)

  if (visible.length === 0) {
    return (
      <section className="border-b-4 border-ink p-5">
        <p className="text-sm">Nothing to show.</p>
      </section>
    )
  }

  return (
    <ul className="border-b-4 border-ink ">
      {visible.map((art) => {
        return (
          <li
            key={art.id}
            className="flex items-center justify-between gap-3 border-b-4 border-ink px-5 py-3 last:border-b-0"
          >
            <p className="text-sm font-black uppercase">
              {art.name} <span className="font-normal">${art.price}</span>
            </p>
            <button
              onClick={() => dispatch(removeArt(art.id))}
              className="border-4 border-ink bg-flat-red px-3 py-1 text-xs font-black uppercase text-paper"
            >
              Delete
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default ArtList
