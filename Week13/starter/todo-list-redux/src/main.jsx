import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import {Provider} from './context/todos'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {/* everything inside can now reach the todos, at any depth */}
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
)
