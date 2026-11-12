import {useSelector} from 'react-redux'
import {selectTotalValue} from '../store'

const ArtValue = () => {
  const total = useSelector(selectTotalValue)
  return (
    <section className="flex items-center justify-between bg-ink px-5 py-3 text-paper">
      <span className="text-xs font-black uppercase tracking-widest">
        Total value
      </span>
      <span className="text-lg font-black">${total}</span>
    </section>
  )
}

export default ArtValue
