import CounterPage from './components/CounterPage'

const App = () => {
  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Counter</h1>
      {/* the starting number arrives as a prop -- which matters later, when
          our state has to be initialized from outside the component */}
      <CounterPage initialCount={10} />
    </div>
  )
}

export default App
