import {useState, useRef, useEffect} from 'react'
import {GoChevronDown} from 'react-icons/go'
import Panel from '../components/Panel'
const Dropdown = (props) => {
  // options is an array of objects each with a label and a value
  const {options, onChange, value} = props

  // keep track of if the dropdown itself is open or closed
  const [isOpen, setIsOpen] = useState(false)

  const divEl = useRef()

  /*
    useEffect takes 2 arguments: a function to fire, an array of things to watch
    useEffect(() => {}, []) = run once when the component mounts
    useEffect(() => {}, [thing1, thing2]) = run on mount or whenever thing1 or thing 2 updates/changes
    useEffect(() => {}) = run after every single render (this is the same as accidentally calling a function inside your component)
    
    here we are adding a plain old vanilla js event listener so that e can close the dropdown
    when the user clicks outside of our dropdown component.

    If the first argument (the function) returns another function, that returned function
    get fired when the component unmounts/destroyed/off screen. This is usually a cleanup function
    
    */
  useEffect(() => {
    // add event listener
    const handlerFunction = (event) => {
      // if there is no ref at all, exit
      if (!divEl.current) return
      // if i click on NOT the reference div aka outside my component
      // close the dropdown with out setter
      if (!divEl.current.contains(event.target)) setIsOpen(false)
    }

    document.addEventListener('click', handlerFunction)

    // if useEffect returns a function, thats a cleanup function
    return () => {
      // remove that event listener/cleanup
      document.removeEventListener('click', handlerFunction)
    }
  }, [])

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
        {value ? value.label : 'Select...'}
        <GoChevronDown />
      </Panel>
      {isOpen && <Panel className="absolute top-full">{renderedOptions}</Panel>}
    </div>
  )
}
export default Dropdown
