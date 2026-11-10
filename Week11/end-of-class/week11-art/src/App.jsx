import ArtForm from './components/ArtForm'
import ArtSearch from './components/ArtSearch'
import ArtList from './components/ArtList'
import ArtValue from './components/ArtValue'

const App = () => {
  // Four components, no props between them, exactly like the print shop.
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b-4 border-ink">
        <div className="mx-auto max-w-3xl border-x-4 border-ink px-5 py-4">
          <h1 className="text-2xl font-black uppercase tracking-tight">
            My Art Collection
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl border-x-4 border-b-4 border-ink">
        <ArtForm />
        <ArtSearch />
        <ArtList />
        <ArtValue />
      </main>
    </div>
  )
}

export default App
