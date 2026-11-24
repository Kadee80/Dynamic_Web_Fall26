import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux'
import './index.css'
import App from './App'
import {store} from './store'
// import {Provider} from './context/todos'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {/* everything inside can now reach the todos, at any depth */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
