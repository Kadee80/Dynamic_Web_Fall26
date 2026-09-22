import {Link} from 'react-router-dom'
import Panel from './Panel'

const NavBar = () => {
  return (
    <Panel>
      <div className="mt-8 px-3">
        <Link to="/" className="text-blue-500">
          Buttons
        </Link>
      </div>
      <div className="mt-8 px-3">
        <Link to="/accordion" className="text-blue-500">
          Accordion
        </Link>
      </div>
      <div className="mt-8 px-3">
        <Link to="/dropdown" className="text-blue-500">
          Dropdown
        </Link>
      </div>
    </Panel>
  )
}

export default NavBar
