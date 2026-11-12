import {useSelector, useDispatch} from 'react-redux'
import {changeName, changePrice, addArt} from '../store'

const ArtForm = () => {
  const dispatch = useDispatch()

  // Both inputs are controlled, but its the store that controls them here
  // There is no useState anywhere in this component
  const name = useSelector((state) => state.form.name)
  const price = useSelector((state) => state.form.price)

  const handleNameChange = (event) => {
    dispatch(changeName(event.target.value))
  }

  const handlePriceChange = (event) => {
    const value = parseInt(event.target.value) || 0
    dispatch(changePrice(value))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // if the user did not enter a name/artist immediately exit and don't submit the data to redux
    if (!name.trim()) {
      return
    }
    // this is the moment where our component reads from one slice to write to another slice!
    dispatch(addArt({name, price}))
  }

  return (
    <section className="border-b-4 border-ink p-5">
      <h2 className="mb-3 text-xs font-black uppercase tracking-widest">
        Add a piece
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <label htmlFor="name" className="block text-xs font-black uppercase">
            Artist and Title
          </label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={handleNameChange}
            value={name}
            placeholder="Mondrian, Composition I"
            className="mt-1 w-full border-4 border-ink bg-white px-3 py-2"
          />
        </div>

        <div className="w-32">
          <label htmlFor="price" className="block text-xs font-black uppercase">
            Price
          </label>
          <input
            type="number"
            min="0"
            id="price"
            name="price"
            onChange={handlePriceChange}
            value={price || ''}
            className="mt-1 w-full border-4 border-ink bg-white px-3 py-2"
          />
        </div>

        <button className="border-4 border-ink bg-flat-yellow px-4 py-2 text-xs font-black uppercase tracking-widest">
          Add
        </button>
      </form>
    </section>
  )
}

export default ArtForm
