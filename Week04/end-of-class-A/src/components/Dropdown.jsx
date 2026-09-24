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
  const renderedOptions = options.map((opt, index) => (
    <div
      onClick={() => handleOptionClick(opt)}
      key={index}
      className="hover:bg-sky-100 rounded cursor-pointer p-1"
    >
      {opt.label}
    </div>
  ))

  return (
    <div ref={divEl} className="w-48 relative">
      <Panel
        onClick={handleClick}
        className="flex justify-between items-center cursor-pointer"
      >
        <GoChevronDown />
      </Panel>
      {isOpen && <Panel className="absolute top-full">{renderedOptions}</Panel>}
    </div>
  )
}
export default Dropdown
