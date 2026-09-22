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

const DropdownPage = () => {
  // whenever we have a form element, the parent of the form is what keeps track of the user selected values
  const [value, setValue] = useState(null)

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
    </>
  )
}

export default DropdownPage
