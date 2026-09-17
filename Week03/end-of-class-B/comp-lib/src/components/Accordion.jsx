import {useState} from 'react'
import {GoChevronDown, GoChevronUp} from 'react-icons/go'

const Accordion = (props) => {
  // destructuring our props
  const {items} = props

  // destructure the array returned from calling the hook useState()
  // 1- name that piece of state
  // 2- name the function to update that piece of state
  const [expandedIndex, setExpandedIndex] = useState(-1)

  // our action to update state from the user is a click
  // so we need an onClick event listener/prop/attribute
  // and a handler function to pass to it
  const handleClick = (nextIndex) => {
    // this is where we call setExpandedIndex to update our state
    setExpandedIndex((currentExpandedIndex) => {
      //clicking the open item, should close it
      // compare the 2, if they match close the item clicked by
      // setting the expandedIndex value of state to -1 again
      if (currentExpandedIndex === nextIndex) {
        return -1
      }
      return nextIndex
    })
  }

  const renderedItems = items.map((item, index) => {
    const isExpanded = expandedIndex === index
    // Ternary =  condition ? whenTrue : whenFalse
    const icon = isExpanded ? <GoChevronDown /> : <GoChevronUp />

    return (
      <div key={item.id}>
        <div
          onClick={() => handleClick(index)}
          className="flex justify-between items-center p-3 bg-gray-100 border-b"
        >
          {item.label}
          {icon}
        </div>
        {isExpanded && <div className="border-b p-5">{item.content}</div>}
      </div>
    )
  })

  return <div>{renderedItems}</div>
}

export default Accordion
