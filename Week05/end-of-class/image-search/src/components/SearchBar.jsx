import {useState} from 'react'

const SearchBar = (props) => {
  const {onSubmit} = props
  const [term, setTerm] = useState('')
  // updates the form value whenever the user types a character or space
  const handleChange = (event) => {
    // why wont this work?
    setTerm(event.target.value)
  }

  // sends the search term up to the parent App
  const handleFormSubmit = (event) => {
    // prevent default behavior which is to refresh the page on form submit
    // we need to interrupt this because we don't want to loose our JS
    // environment and any values REact is storing
    event.preventDefault()
    onSubmit(term) // term is coming from state
  }
  return (
    <div className="p-4">
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={term}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 w-80"
        />
      </form>
    </div>
  )
}

export default SearchBar
