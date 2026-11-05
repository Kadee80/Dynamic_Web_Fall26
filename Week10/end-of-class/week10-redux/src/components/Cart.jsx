import {useSelector, useDispatch} from 'react-redux'
import {
  quantityIncreased,
  quantityDecreased,
  itemRemoved,
  cartCleared,
} from '../features/cartSlice'

const Cart = () => {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)

  const total = items.reduce(
    (running, item) => running + item.quantity * item.price,
    0
  )

  return (
    <aside>
      <h2 className="border-b-4 border-ink bg-flat-red px-4 py-3 text-sm font-black uppercase tracking-widest text-paper">
        Cart
      </h2>

      {items.length === 0 ? (
        <p className="px-4 py-6 text-sm">Nothing in the cart.</p>
      ) : (
        <ul>
          {items.map((item) => {
            return (
              <li key={item.id} className="border-b-4 border-ink px-4 py-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-black uppercase">{item.title}</p>
                  <button
                    onClick={() => dispatch(itemRemoved(item.id))}
                    className="text-xs font-black uppercase underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => dispatch(quantityDecreased(item.id))}
                    className="h-7 w-7 border-4 border-ink text-sm font-black leading-none"
                  >
                    -
                  </button>

                  <span className="w-6 text-center text-sm font-black">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => dispatch(quantityIncreased(item.id))}
                    className="h-7 w-7 border-4 border-ink bg-flat-yellow text-sm font-black leading-none"
                  >
                    +
                  </button>

                  <span className="ml-auto text-sm font-black">
                    ${item.quantity * item.price}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <div className="flex items-center justify-between border-b-4 border-ink bg-ink px-4 py-3 text-paper">
        <span className="text-xs font-black uppercase tracking-widest">
          Total
        </span>
        <span className="text-lg font-black">${total}</span>
      </div>

      {items.length > 0 && (
        <button
          onClick={() => dispatch(cartCleared())}
          className="w-full px-4 py-3 text-xs font-black uppercase tracking-widest underline"
        >
          Empty the cart
        </button>
      )}
    </aside>
  )
}

export default Cart
