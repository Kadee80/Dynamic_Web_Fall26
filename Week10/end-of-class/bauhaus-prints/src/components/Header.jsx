import {useSelector} from 'react-redux'
import {selectCartCount, selectCartTotal} from '../features/cartSlice'

const Header = () => {
  // No arrow function here any more, and no arithmetic. This component asks
  // for two numbers and is told them.
  const count = useSelector(selectCartCount)
  const total = useSelector(selectCartTotal)

  return (
    <header className="border-b-4 border-ink">
      <div className="mx-auto flex max-w-5xl items-stretch border-x-4 border-ink">
        <h1 className="flex-1 px-5 py-4 text-2xl font-black uppercase tracking-tight">
          Bauhaus Prints
        </h1>

        <div className="flex w-20 items-center justify-center border-l-4 border-ink bg-flat-yellow text-2xl font-black">
          {count}
        </div>

        <div className="flex w-28 items-center justify-center border-l-4 border-ink bg-flat-blue text-lg font-black text-paper">
          ${total}
        </div>
      </div>
    </header>
  )
}

export default Header
