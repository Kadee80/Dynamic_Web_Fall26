import ButtonPage from './pages/ButtonPage'
import AccordionPage from './pages/AccordionPage'

// Right now App is doing the job of a page. Next week we add routes
// so each of these gets its own url.
const App = () => {
  return (
    <div className="container mx-auto mt-4">
      <ButtonPage />
      <hr className="my-8" />
      <AccordionPage />
    </div>
  )
}

export default App
