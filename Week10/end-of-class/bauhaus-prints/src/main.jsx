import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux'
import './index.css'
import App from './App'
import {store} from './store'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {/* One Provider, right at the top. Every component inside can now reach
        the store, at any depth, without a single prop. */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
