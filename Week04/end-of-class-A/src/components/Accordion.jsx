import {useState} from 'react'
import {GoChevronDown, GoChevronLeft} from 'react-icons/go'

const Accordion = (props) => {
  const {items} = props

  // Which item is open? -1 means "none of them".
  const [expandedIndex, setExpandedIndex] = useState(-1)

  const handleClick = (nextIndex) => {
    // when the new value depends on the current one, use this form
    setExpandedIndex((currentExpandedIndex) => {
      // clicking the open item closes it
      if (currentExpandedIndex === nextIndex) {
        return -1
      }
      return nextIndex
    })
  }

  const renderedItems = items.map((item, index) => {
    const isExpanded = index === expandedIndex

    // a ternary:  condition ? whenTrue : whenFalse
    const icon = (
      <span className="text-2xl">
        {isExpanded ? <GoChevronDown /> : <GoChevronLeft />}
      </span>
    )

    return (
      <div key={item.id}>
        <div
          onClick={() => handleClick(index)}
          className="flex justify-between items-center p-3 bg-gray-100 border-b cursor-pointer"
        >
          {item.label}
          {icon}
        </div>
        {/* conditional rendering: the content div only exists when open */}
        {isExpanded && <div className="border-b p-5">{item.content}</div>}
      </div>
    )
  })

  return <div>{renderedItems}</div>
}

export default Accordion
