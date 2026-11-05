import {createRoot} from 'react-dom/client'
import {Provider} from 'react-redux'

import App from './App.jsx'
import {store} from './store.js'
import './index.css'

createRoot(document.getElementById('root')).render(
  // One provider, right at the top. Every component inside of it can reach the store
  // at any depth, without a single prop
  <Provider store={store}>
    <App />
  </Provider>
)
