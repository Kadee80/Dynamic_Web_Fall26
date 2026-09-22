import {useState} from 'react'
import {GoChevronDown} from 'react-icons/go'
import Panel from '../components/Panel'
const Dropdown = (props) => {
  // options is an array of objects each with a label and a value
  const {options, onChange} = props

  // keep track of if the dropdown itself is open or closed
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  // why does this exist here? to wrap the function we passed
  // in as a prop called onChange
  const handleOptionClick = (option) => {
    setIsOpen(false)
    onChange(option)
  }

  // whenever we map, we need a key at the top level element returned
  const renderedOptions = options.map((opt, index) => {
    return (
      <div
        key={index}
        className="hover:bg-sky-100 rounded-md cursor-pointer p-1"
        onClick={() => handleOptionClick(opt)}
      >
        {opt.label}
      </div>
    )
  })

  return (
    <div className="w-48">
      <Panel
        className="flex justify-between items-center cursor-pointer"
        onClick={handleClick}
      >
        Select ... <GoChevronDown />
      </Panel>
      {isOpen && <Panel>{renderedOptions}</Panel>}
    </div>
  )
}

export default Dropdown
