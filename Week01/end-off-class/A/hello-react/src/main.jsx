import React from 'react'
import ReactDOM from 'react-dom/client'
// import a component so we can render it in JSX
import App from './App.jsx'

// plan js find the empty div in index.html
const el = document.getElementById('root')

// hand it to react to inject our JSX into it
const root = ReactDOM.createRoot(el)

// render our react project in the root (div)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
