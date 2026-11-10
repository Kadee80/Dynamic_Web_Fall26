import Header from './components/Header'
import Catalog from './components/Catalog'
import Cart from './components/Cart'

const App = () => {
  // Look at what App passes down: nothing. Not one prop. By the end of class
  // all three of these are reading and writing the same state anyway.
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />

      <main className="mx-auto grid max-w-5xl border-x-4 border-b-4 border-ink md:grid-cols-[2fr_1fr]">
        <Catalog />
        <Cart />
      </main>
    </div>
  )
}

export default App
