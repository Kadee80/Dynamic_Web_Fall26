import {useSelector} from 'react-redux'

const Header = () => {
  // useSelector take a function and hands it the WHOLE ENTIRE store state
  // and it gives you back whatever the selector function returns
  // This component re-renders ONLY when the value it picked out actually changes
  const items = useSelector((state) => state.cart.items)

  const count = items.reduce((running, item) => running + item.quantity, 0)
  const total = items.reduce(
    (running, item) => running + item.quantity * item.price,
    0
  )

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
