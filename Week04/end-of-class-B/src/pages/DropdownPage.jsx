import {useState} from 'react'
import Dropdown from '../components/Dropdown'

// the data should live in the parent component not the reusable atomic component
const OPTIONS = [
  {label: 'Red', value: 'red'},
  {label: 'Green', value: 'green'},
  {label: 'Blue', value: 'blue'},
]

const COLOR_MAP = {
  red: 'bg-red-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
}
// apply a classname based on selected value
// COLOR_MAP[{value.value}]

const DATA_TO_FILTER = [
  {id: 1, name: 'Katie', team: 'red'},
  {id: 2, name: 'Ali', team: 'green'},
  {id: 3, name: 'Tony', team: 'blue'},
  {id: 4, name: 'River', team: 'red'},
  {id: 5, name: 'Yi', team: 'green'},
]

const DropdownPage = () => {
  // whenever we have a form element, the parent of the form is what keeps track of the user selected values
  const [value, setValue] = useState(null)

  let filteredData = DATA_TO_FILTER

  /* ?. optional chaining: if value is null, stop and don't explode */
  if (value?.value) {
    // Array.filter takes a callback function that receives
    // each object one at a time (s) and
    // A condition that needs to be true, to keep/filter that object
    filteredData = DATA_TO_FILTER.filter((s) => {
      // this statement needs to be true to "keep" this individual S in our Array
      // in this single line function, we don't need {} and return
      return s.team === value.value
    })
  }
  const handleChange = (option) => {
    setValue(option)
  }
  // the parent element of any form element passes down a
  // onChange handler and a value prop linked to state
  return (
    <>
      {/* value?.label = if value exists, render the label, otherwise exit */}

      <h1 className={COLOR_MAP[value?.value] || undefined}>
        Dropdown page with user selected value of {value?.label}
      </h1>
      <Dropdown options={OPTIONS} onChange={handleChange} value={value} />
      <h2 className="mt-4"> Students from {value?.label ?? 'every team'}</h2>

      {filteredData.map((student) => (
        <p key={student.id}>{student.name}</p>
      ))}
    </>
  )
}

export default DropdownPage
