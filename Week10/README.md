# Week 10: Redux Toolkit

*createSlice, configureStore, useSelector and useDispatch · ~110 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

A new project today, and the last big piece of state management in this course.

**Redux** has a reputation for being complicated. It is not, and you already know most of it: a **reducer** takes the current state and an **action**, and returns the next state. An action has a **type** and usually a **payload**. You **dispatch** an action to make something happen. You wrote all of that by hand in Week 08.

What Redux adds is one **store** for the whole application, so any component can read any piece of state and dispatch any action, without props and without a Provider you wrote yourself.

**Redux Toolkit** is the official package that removes the boilerplate the old tutorials are full of. If you find a Redux tutorial with `switch` statements and hand-written action type constants in it, it is from before 2020. Use this.

We are building a print shop: a catalog, a cart, and a header that shows the running total. Three components, side by side, sharing one state.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [A shop with no state](#step-1)
2. [A slice](#step-2)
3. [The store](#step-3)
4. [The Provider](#step-4)
5. [Reading: useSelector](#step-5)
6. [Writing: useDispatch](#step-6)
7. [Wait, you mutated the state](#step-7)
8. [More reducers, and the cart](#step-8)
9. [A second slice](#step-9)
10. [Selectors, and where state shape lives](#step-10)
11. [The devtools](#step-11)
12. [When not to use Redux](#step-12)

---

<a id="step-1"></a>

## Step 1: A shop with no state

A fresh project, and a page in three pieces: a **header** with a count and a total, a **catalog** of prints, and a **cart**.

Build the four files below, then look at `App.jsx` and notice what it passes to its three children: **nothing.** Not one prop.

That is the situation today is about. The Add buttons are in `Catalog`. The numbers are in `Header`. The list is in `Cart`. They are siblings, so there is no parent in between to hold the state, and nothing can reach anything else.

The styling is already written and you will not touch it again: three colours, black rules, no rounded corners.

```bash
cd ~/your-hw-repo
npm create vite@latest week10-redux -- --template react
cd week10-redux
npm install
npm install -D tailwindcss @tailwindcss/vite
npm run dev
```

**`package.json`**  (new file)

```
{
  "name": "bauhaus-prints",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.5.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-redux": "^9.2.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.0",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.1.0",
    "vite": "^6.0.7"
  }
}
```

**`vite.config.js`**  (new file)

```js
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**`index.html`**  (new file)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bauhaus Prints</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**`src/index.css`**  (new file)

```css
@import 'tailwindcss';

/* Five colours, no gradients, no rounded corners, no shadows. @theme is how
   Tailwind v4 takes custom values: each one becomes a utility, so
   --color-flat-red gives us bg-flat-red, text-flat-red, border-flat-red. */
@theme {
  --color-flat-red: #e52b23;
  --color-flat-blue: #0b4ea2;
  --color-flat-yellow: #f9d616;
  --color-ink: #111111;
  --color-paper: #f4f1ea;
}
```

**`src/main.jsx`**  (new file)

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**`src/App.jsx`**  (new file)

```jsx
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
```

**`src/data/prints.js`**  (new file)

```js
// NOT state. This list never changes while the app is running, so it does not
// belong in the store. A plain module export is the right home for it.
export const PRINTS = [
  {id: 'p1', title: 'Composition I', colour: 'red', price: 40},
  {id: 'p2', title: 'Counter Grid', colour: 'blue', price: 55},
  {id: 'p3', title: 'Yellow Field', colour: 'yellow', price: 35},
  {id: 'p4', title: 'Red Square', colour: 'red', price: 30},
  {id: 'p5', title: 'Blue Rhythm', colour: 'blue', price: 45},
  {id: 'p6', title: 'Three Primaries', colour: 'yellow', price: 50},
]
```

**`src/components/Header.jsx`**  (new file)

```jsx
const Header = () => {
  // Hard-coded for now. These two numbers are the whole problem: they live in
  // the header, and the thing that changes them is in a different component
  // on the other side of the page.
  const count = 0
  const total = 0

  return (
    <header className="border-b-4 border-ink">
      <div className="mx-auto flex max-w-5xl items-stretch border-x-4 border-ink">
        <h1 className="flex-1 px-5 py-4 text-2xl font-black uppercase tracking-tight">
          Bauhaus Prints
        </h1>

        <div className="flex w-20 items-center justify-center border-l-4 border-ink bg-flat-yellow text-2xl font-black">
          {count}
        </div>

        <div className="flex w-28 items-center justify-center border-l-4 border-ink bg-flat-blue text-lg font-black text-paper">
          ${total}
        </div>
      </div>
    </header>
  )
}

export default Header
```

**`src/components/Catalog.jsx`**  (new file)

```jsx
import {PRINTS} from '../data/prints'

const SWATCH = {
  red: 'bg-flat-red',
  blue: 'bg-flat-blue',
  yellow: 'bg-flat-yellow',
}

const Catalog = () => {
  return (
    <section>
      <ul className="grid grid-cols-2">
        {PRINTS.map((print) => {
          return (
            <li key={print.id} className="border-b-4 border-r-4 border-ink">
              <div className={`h-28 ${SWATCH[print.colour]}`} />

              <div className="flex items-center justify-between gap-2 px-3 py-3">
                <div>
                  <p className="text-sm font-black uppercase">{print.title}</p>
                  <p className="text-xs">${print.price}</p>
                </div>

                {/* wired up to nothing yet */}
                <button className="border-4 border-ink bg-flat-yellow px-3 py-1 text-xs font-black uppercase">
                  Add
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default Catalog
```

**`src/components/Cart.jsx`**  (new file)

```jsx
const Cart = () => {
  return (
    <aside>
      <h2 className="border-b-4 border-ink bg-flat-red px-4 py-3 text-sm font-black uppercase tracking-widest text-paper">
        Cart
      </h2>

      <p className="px-4 py-6 text-sm">Nothing in the cart.</p>
    </aside>
  )
}

export default Cart
```

---

<a id="step-2"></a>

## Step 2: A slice

Two packages. **`@reduxjs/toolkit`** is Redux plus the tools that remove the boilerplate, and **`react-redux`** is the bridge between the store and React components.

A **slice** is one piece of your application's state, together with every way it is allowed to change. It takes three things:

- **`name`** is a label. It prefixes the action types this slice produces, so our reducer below becomes the string `'cart/itemAdded'`.
- **`initialState`** is the shape before anything happens.
- **`reducers`** is an object of functions, and every one of them has the signature you already know: `(state, action)`.

Read `itemAdded` carefully. If the print is already in the cart, bump its quantity. Otherwise push a new entry with a quantity of 1.

Then look at the bottom two lines. **`cartSlice.actions`** is a set of action creators that Redux Toolkit wrote for us, one for each reducer, named to match. **`cartSlice.reducer`** is the combined reducer, which the store wants in a moment.

```bash
npm install @reduxjs/toolkit react-redux
```

**`src/features/cartSlice.js`**  (new file)

```js
import {createSlice} from '@reduxjs/toolkit'

const cartSlice = createSlice({
  // `name` is a label. It prefixes every action type this slice produces,
  // so the one below becomes the string 'cart/itemAdded'.
  name: 'cart',

  // the shape this slice owns, before anything happens
  initialState: {
    items: [],
  },

  // Each function in here is a reducer: current state in, next state out.
  // Exactly the shape you wrote by hand in Week 08.
  reducers: {
    itemAdded(state, action) {
      const print = action.payload
      const existing = state.items.find((item) => item.id === print.id)

      if (existing) {
        existing.quantity = existing.quantity + 1
        return
      }

      state.items.push({...print, quantity: 1})
    },
  },
})

// createSlice writes the action creators for us, one per reducer, with
// matching names. We just have to export them.
export const {itemAdded} = cartSlice.actions

// and the reducer itself, which is what the store wants
export default cartSlice.reducer
```

---

<a id="step-3"></a>

## Step 3: The store

One store for the whole application. **`configureStore`** takes a `reducer` object, and each key becomes a top-level slice of the state:

```js
reducer: {
  cart: cartReducer,
}
```

means our cart lives at **`state.cart`**, so the items are at `state.cart.items`. That path matters, because every component that reads the cart will start from it.

`configureStore` also sets up the Redux DevTools connection and a couple of safety checks for free. The old way took about thirty lines and most people copied them from a blog post without reading them.

**`src/store.js`**  (new file)

```js
import {configureStore} from '@reduxjs/toolkit'
import cartReducer from './features/cartSlice'

// One store for the whole application. `reducer` is a map: each key becomes
// a top-level slice of state, so our cart lives at state.cart.
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
})
```

---

<a id="step-4"></a>

## Step 4: The Provider

One line of plumbing, at the very top of the app:

```jsx
<Provider store={store}>
  <App />
</Provider>
```

This is the same idea as the Provider you wrote yourself in Week 07, except you did not have to write it. Everything inside can now reach the store at any depth.

Save and reload. **Nothing has changed on screen**, and nothing should have. The store exists and no component is talking to it yet.

**`src/main.jsx`**

What changed:

```diff
@@ -1,11 +1,17 @@
 import React from 'react'
 import ReactDOM from 'react-dom/client'
+import {Provider} from 'react-redux'
 import './index.css'
 import App from './App'
+import {store} from './store'
 
 const root = ReactDOM.createRoot(document.getElementById('root'))
 root.render(
   <React.StrictMode>
-    <App />
+    {/* One Provider, right at the top. Every component inside can now reach
+        the store, at any depth, without a single prop. */}
+    <Provider store={store}>
+      <App />
+    </Provider>
   </React.StrictMode>
 )
```

<details>
<summary>Full file after this step</summary>

```jsx
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
```

</details>

---

<a id="step-5"></a>

## Step 5: Reading: useSelector

```jsx
const items = useSelector((state) => state.cart.items)
```

**`useSelector` takes a function**, hands it the entire store state, and gives back whatever that function returns. Here we want the items, so we reach down the tree we drew: `state.cart.items`.

Two things it does that are not obvious:

- **It subscribes.** When that value changes, this component re-renders. You do not wire anything up.
- **It only re-renders for the value you picked.** Selecting `state.cart.items` means a change somewhere else in the store does not touch this component.

Then the two numbers, worked out from the items with **`reduce`**. If `reduce` is new: it walks an array, carrying a running value from one item to the next, and hands you the final one. The `0` at the end is where the running value starts.

Still nothing on screen, because the cart is empty and nothing can add to it. One more step.

**`src/components/Header.jsx`**

What changed:

```diff
@@ -1,8 +1,15 @@
+import {useSelector} from 'react-redux'
+
 const Header = () => {
-  // Hard-coded for now. These two numbers are the whole problem: they live in
-  // the header, and the thing that changes them is in a different component
-  // on the other side of the page.
-  const count = 0
-  const total = 0
+  // useSelector takes a function, hands it the WHOLE store state, and gives
+  // back whatever that function returns. This component re-renders only when
+  // the value it picked out actually changes.
+  const items = useSelector((state) => state.cart.items)
+
+  const count = items.reduce((running, item) => running + item.quantity, 0)
+  const total = items.reduce(
+    (running, item) => running + item.quantity * item.price,
+    0
+  )
 
   return (
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useSelector} from 'react-redux'

const Header = () => {
  // useSelector takes a function, hands it the WHOLE store state, and gives
  // back whatever that function returns. This component re-renders only when
  // the value it picked out actually changes.
  const items = useSelector((state) => state.cart.items)

  const count = items.reduce((running, item) => running + item.quantity, 0)
  const total = items.reduce(
    (running, item) => running + item.quantity * item.price,
    0
  )

  return (
    <header className="border-b-4 border-ink">
      <div className="mx-auto flex max-w-5xl items-stretch border-x-4 border-ink">
        <h1 className="flex-1 px-5 py-4 text-2xl font-black uppercase tracking-tight">
          Bauhaus Prints
        </h1>

        <div className="flex w-20 items-center justify-center border-l-4 border-ink bg-flat-yellow text-2xl font-black">
          {count}
        </div>

        <div className="flex w-28 items-center justify-center border-l-4 border-ink bg-flat-blue text-lg font-black text-paper">
          ${total}
        </div>
      </div>
    </header>
  )
}

export default Header
```

</details>

---

<a id="step-6"></a>

## Step 6: Writing: useDispatch

```jsx
const dispatch = useDispatch()

<button onClick={() => dispatch(itemAdded(print))}>Add</button>
```

**`useDispatch()` gives you the store's dispatch function.** It is the same `dispatch` you met with `useReducer`, except there is one of them and the whole application shares it.

The important half of that line is the inner part. **`itemAdded(print)` does not change anything.** It is an action creator: it builds and returns an object that looks like this:

```js
{type: 'cart/itemAdded', payload: {id: 'p1', ...}}
```

Dispatch is what sends it to the store. Building the action and sending it are two separate things, and keeping them separate is why you can log an action, store it, or send it twice.

**Save and click Add.** The number in the header goes up, and the total with it. `Catalog` and `Header` have never heard of each other.

**`src/components/Catalog.jsx`**

What changed:

```diff
@@ -1,3 +1,5 @@
+import {useDispatch} from 'react-redux'
 import {PRINTS} from '../data/prints'
+import {itemAdded} from '../features/cartSlice'
 
 const SWATCH = {
@@ -8,4 +10,8 @@
 
 const Catalog = () => {
+  // useDispatch gives us the store's dispatch function. Same dispatch you
+  // met with useReducer, except there is one of them for the whole app.
+  const dispatch = useDispatch()
+
   return (
     <section>
@@ -22,6 +28,10 @@
                 </div>
 
-                {/* wired up to nothing yet */}
-                <button className="border-4 border-ink bg-flat-yellow px-3 py-1 text-xs font-black uppercase">
+                {/* itemAdded(print) does NOT change anything. It builds an
+                    action object, and dispatch is what sends it. */}
+                <button
+                  onClick={() => dispatch(itemAdded(print))}
+                  className="border-4 border-ink bg-flat-yellow px-3 py-1 text-xs font-black uppercase"
+                >
                   Add
                 </button>
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useDispatch} from 'react-redux'
import {PRINTS} from '../data/prints'
import {itemAdded} from '../features/cartSlice'

const SWATCH = {
  red: 'bg-flat-red',
  blue: 'bg-flat-blue',
  yellow: 'bg-flat-yellow',
}

const Catalog = () => {
  // useDispatch gives us the store's dispatch function. Same dispatch you
  // met with useReducer, except there is one of them for the whole app.
  const dispatch = useDispatch()

  return (
    <section>
      <ul className="grid grid-cols-2">
        {PRINTS.map((print) => {
          return (
            <li key={print.id} className="border-b-4 border-r-4 border-ink">
              <div className={`h-28 ${SWATCH[print.colour]}`} />

              <div className="flex items-center justify-between gap-2 px-3 py-3">
                <div>
                  <p className="text-sm font-black uppercase">{print.title}</p>
                  <p className="text-xs">${print.price}</p>
                </div>

                {/* itemAdded(print) does NOT change anything. It builds an
                    action object, and dispatch is what sends it. */}
                <button
                  onClick={() => dispatch(itemAdded(print))}
                  className="border-4 border-ink bg-flat-yellow px-3 py-1 text-xs font-black uppercase"
                >
                  Add
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default Catalog
```

</details>

---

<a id="step-7"></a>

## Step 7: Wait, you mutated the state

Go back and look at what is inside `itemAdded`:

```js
existing.quantity = existing.quantity + 1
state.items.push({...print, quantity: 1})
```

**That is mutation.** Assigning to a property, and `push`, which changes an array in place. In Week 08 we spent a whole step on why a reducer must never do that.

It works here because **Redux Toolkit has Immer built in**. Inside `createSlice`, the `state` you are handed is a draft: Immer watches what you touch and builds the correct new object for you afterwards. The rule has not changed. Somebody else is now obeying it on your behalf.

**Two things to be careful about:**

- **This only works inside `createSlice`.** The same code in a `useReducer` reducer, with no Immer, breaks silently: the data changes and the screen does not.
- **Either change the draft or return a new value, never both.** `state.items.push(x)` is fine. `return {...state}` is fine. Doing one and then returning the other is the bug.

Notice `quantityDecreased` below does both styles in different branches, which is allowed because each one returns before the other runs.

---

<a id="step-8"></a>

## Step 8: More reducers, and the cart

Four more reducers, and the cart that uses them. The pattern never changes: a function in `reducers`, and Redux Toolkit makes the matching action creator.

**Look at what each action carries**, because this is the part people get wrong:

- `itemAdded` takes the **whole print object**, because the cart needs the title and price to display a row.
- `quantityIncreased` takes **just an id**. Nothing else is needed to do the job.
- `cartCleared` takes **nothing at all**, so its reducer has no `action` parameter.

**An action carries exactly what its reducer needs, and no more.** Passing the whole object everywhere works and makes every action log unreadable.

`quantityDecreased` has a decision in it: at a quantity of one, decreasing removes the row. That is a product decision living in a reducer, which is exactly where it should be. The button does not know about it.

**`src/features/cartSlice.js`**

What changed:

```diff
@@ -2,15 +2,10 @@
 
 const cartSlice = createSlice({
-  // `name` is a label. It prefixes every action type this slice produces,
-  // so the one below becomes the string 'cart/itemAdded'.
   name: 'cart',
 
-  // the shape this slice owns, before anything happens
   initialState: {
     items: [],
   },
 
-  // Each function in here is a reducer: current state in, next state out.
-  // Exactly the shape you wrote by hand in Week 08.
   reducers: {
     itemAdded(state, action) {
@@ -25,12 +20,50 @@
       state.items.push({...print, quantity: 1})
     },
+
+    quantityIncreased(state, action) {
+      // the payload is just the id this time. An action carries whatever the
+      // reducer needs, and no more.
+      const item = state.items.find((item) => item.id === action.payload)
+
+      if (item) {
+        item.quantity = item.quantity + 1
+      }
+    },
+
+    quantityDecreased(state, action) {
+      const item = state.items.find((item) => item.id === action.payload)
+
+      if (!item) {
+        return
+      }
+
+      // going below one removes the row, which is what people expect
+      if (item.quantity === 1) {
+        state.items = state.items.filter((entry) => entry.id !== action.payload)
+        return
+      }
+
+      item.quantity = item.quantity - 1
+    },
+
+    itemRemoved(state, action) {
+      state.items = state.items.filter((item) => item.id !== action.payload)
+    },
+
+    cartCleared(state) {
+      // no action needed: this one carries no information at all
+      state.items = []
+    },
   },
 })
 
-// createSlice writes the action creators for us, one per reducer, with
-// matching names. We just have to export them.
-export const {itemAdded} = cartSlice.actions
+export const {
+  itemAdded,
+  quantityIncreased,
+  quantityDecreased,
+  itemRemoved,
+  cartCleared,
+} = cartSlice.actions
 
-// and the reducer itself, which is what the store wants
 export default cartSlice.reducer
 
```

<details>
<summary>Full file after this step</summary>

```js
import {createSlice} from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',

  initialState: {
    items: [],
  },

  reducers: {
    itemAdded(state, action) {
      const print = action.payload
      const existing = state.items.find((item) => item.id === print.id)

      if (existing) {
        existing.quantity = existing.quantity + 1
        return
      }

      state.items.push({...print, quantity: 1})
    },

    quantityIncreased(state, action) {
      // the payload is just the id this time. An action carries whatever the
      // reducer needs, and no more.
      const item = state.items.find((item) => item.id === action.payload)

      if (item) {
        item.quantity = item.quantity + 1
      }
    },

    quantityDecreased(state, action) {
      const item = state.items.find((item) => item.id === action.payload)

      if (!item) {
        return
      }

      // going below one removes the row, which is what people expect
      if (item.quantity === 1) {
        state.items = state.items.filter((entry) => entry.id !== action.payload)
        return
      }

      item.quantity = item.quantity - 1
    },

    itemRemoved(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },

    cartCleared(state) {
      // no action needed: this one carries no information at all
      state.items = []
    },
  },
})

export const {
  itemAdded,
  quantityIncreased,
  quantityDecreased,
  itemRemoved,
  cartCleared,
} = cartSlice.actions

export default cartSlice.reducer
```

</details>

**`src/components/Cart.jsx`**

What changed:

```diff
@@ -1,3 +1,19 @@
+import {useSelector, useDispatch} from 'react-redux'
+import {
+  quantityIncreased,
+  quantityDecreased,
+  itemRemoved,
+  cartCleared,
+} from '../features/cartSlice'
+
 const Cart = () => {
+  const dispatch = useDispatch()
+  const items = useSelector((state) => state.cart.items)
+
+  const total = items.reduce(
+    (running, item) => running + item.quantity * item.price,
+    0
+  )
+
   return (
     <aside>
@@ -6,5 +22,65 @@
       </h2>
 
-      <p className="px-4 py-6 text-sm">Nothing in the cart.</p>
+      {items.length === 0 ? (
+        <p className="px-4 py-6 text-sm">Nothing in the cart.</p>
+      ) : (
+        <ul>
+          {items.map((item) => {
+            return (
+              <li key={item.id} className="border-b-4 border-ink px-4 py-3">
+                <div className="flex items-baseline justify-between gap-2">
+                  <p className="text-sm font-black uppercase">{item.title}</p>
+                  <button
+                    onClick={() => dispatch(itemRemoved(item.id))}
+                    className="text-xs font-black uppercase underline"
+                  >
+                    Remove
+                  </button>
+                </div>
+
+                <div className="mt-2 flex items-center gap-2">
+                  <button
+                    onClick={() => dispatch(quantityDecreased(item.id))}
+                    className="h-7 w-7 border-4 border-ink text-sm font-black leading-none"
+                  >
+                    -
+                  </button>
+
+                  <span className="w-6 text-center text-sm font-black">
+                    {item.quantity}
+                  </span>
+
+                  <button
+                    onClick={() => dispatch(quantityIncreased(item.id))}
+                    className="h-7 w-7 border-4 border-ink bg-flat-yellow text-sm font-black leading-none"
+                  >
+                    +
+                  </button>
+
+                  <span className="ml-auto text-sm font-black">
+                    ${item.quantity * item.price}
+                  </span>
+                </div>
+              </li>
+            )
+          })}
+        </ul>
+      )}
+
+      <div className="flex items-center justify-between border-b-4 border-ink bg-ink px-4 py-3 text-paper">
+        <span className="text-xs font-black uppercase tracking-widest">
+          Total
+        </span>
+        <span className="text-lg font-black">${total}</span>
+      </div>
+
+      {items.length > 0 && (
+        <button
+          onClick={() => dispatch(cartCleared())}
+          className="w-full px-4 py-3 text-xs font-black uppercase tracking-widest underline"
+        >
+          Empty the cart
+        </button>
+      )}
     </aside>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useSelector, useDispatch} from 'react-redux'
import {
  quantityIncreased,
  quantityDecreased,
  itemRemoved,
  cartCleared,
} from '../features/cartSlice'

const Cart = () => {
  const dispatch = useDispatch()
  const items = useSelector((state) => state.cart.items)

  const total = items.reduce(
    (running, item) => running + item.quantity * item.price,
    0
  )

  return (
    <aside>
      <h2 className="border-b-4 border-ink bg-flat-red px-4 py-3 text-sm font-black uppercase tracking-widest text-paper">
        Cart
      </h2>

      {items.length === 0 ? (
        <p className="px-4 py-6 text-sm">Nothing in the cart.</p>
      ) : (
        <ul>
          {items.map((item) => {
            return (
              <li key={item.id} className="border-b-4 border-ink px-4 py-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-black uppercase">{item.title}</p>
                  <button
                    onClick={() => dispatch(itemRemoved(item.id))}
                    className="text-xs font-black uppercase underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => dispatch(quantityDecreased(item.id))}
                    className="h-7 w-7 border-4 border-ink text-sm font-black leading-none"
                  >
                    -
                  </button>

                  <span className="w-6 text-center text-sm font-black">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => dispatch(quantityIncreased(item.id))}
                    className="h-7 w-7 border-4 border-ink bg-flat-yellow text-sm font-black leading-none"
                  >
                    +
                  </button>

                  <span className="ml-auto text-sm font-black">
                    ${item.quantity * item.price}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <div className="flex items-center justify-between border-b-4 border-ink bg-ink px-4 py-3 text-paper">
        <span className="text-xs font-black uppercase tracking-widest">
          Total
        </span>
        <span className="text-lg font-black">${total}</span>
      </div>

      {items.length > 0 && (
        <button
          onClick={() => dispatch(cartCleared())}
          className="w-full px-4 py-3 text-xs font-black uppercase tracking-widest underline"
        >
          Empty the cart
        </button>
      )}
    </aside>
  )
}

export default Cart
```

</details>

---

<a id="step-9"></a>

## Step 9: A second slice

Real applications have more than one kind of state. The filter buttons are not cart state: they are **interface state**, so they get their own slice.

`uiSlice` is small on purpose. One value, one reducer. Then the store gains a second key:

```js
reducer: {
  cart: cartReducer,
  ui: uiReducer,
}
```

The state tree is now `{cart: {items: []}, ui: {colourFilter: 'all'}}`. **Each slice owns its own branch and cannot touch the other.** That is the point of slices, and it is what keeps a store readable when there are twelve of them.

In `Catalog`, note what is **not** in the store:

```js
const visible = colourFilter === 'all' ? PRINTS : PRINTS.filter(...)
```

The filtered list is worked out at render time. It could be stored, and then you would have two things that can disagree. **If it can be calculated from something you already have, calculate it.**

**`src/features/uiSlice.js`**  (new file)

```js
import {createSlice} from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',

  initialState: {
    colourFilter: 'all',
  },

  reducers: {
    filterChanged(state, action) {
      state.colourFilter = action.payload
    },
  },
})

export const {filterChanged} = uiSlice.actions

export default uiSlice.reducer
```

**`src/store.js`**

What changed:

```diff
@@ -1,10 +1,12 @@
 import {configureStore} from '@reduxjs/toolkit'
 import cartReducer from './features/cartSlice'
+import uiReducer from './features/uiSlice'
 
-// One store for the whole application. `reducer` is a map: each key becomes
-// a top-level slice of state, so our cart lives at state.cart.
+// Two keys, two slices, one store. state.cart is owned entirely by the cart
+// slice and state.ui entirely by the ui slice: neither can reach the other.
 export const store = configureStore({
   reducer: {
     cart: cartReducer,
+    ui: uiReducer,
   },
 })
```

<details>
<summary>Full file after this step</summary>

```js
import {configureStore} from '@reduxjs/toolkit'
import cartReducer from './features/cartSlice'
import uiReducer from './features/uiSlice'

// Two keys, two slices, one store. state.cart is owned entirely by the cart
// slice and state.ui entirely by the ui slice: neither can reach the other.
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    ui: uiReducer,
  },
})
```

</details>

**`src/components/Catalog.jsx`**

What changed:

```diff
@@ -1,5 +1,6 @@
-import {useDispatch} from 'react-redux'
+import {useSelector, useDispatch} from 'react-redux'
 import {PRINTS} from '../data/prints'
 import {itemAdded} from '../features/cartSlice'
+import {filterChanged} from '../features/uiSlice'
 
 const SWATCH = {
@@ -9,13 +10,39 @@
 }
 
+const FILTERS = ['all', 'red', 'blue', 'yellow']
+
 const Catalog = () => {
-  // useDispatch gives us the store's dispatch function. Same dispatch you
-  // met with useReducer, except there is one of them for the whole app.
   const dispatch = useDispatch()
+  const colourFilter = useSelector((state) => state.ui.colourFilter)
+
+  // worked out at render time from the filter. Not stored anywhere, because
+  // it can always be recalculated from something that is.
+  const visible =
+    colourFilter === 'all'
+      ? PRINTS
+      : PRINTS.filter((print) => print.colour === colourFilter)
 
   return (
     <section>
+      <div className="flex border-b-4 border-ink">
+        {FILTERS.map((filter) => {
+          const isActive = filter === colourFilter
+
+          return (
+            <button
+              key={filter}
+              onClick={() => dispatch(filterChanged(filter))}
+              className={`flex-1 border-r-4 border-ink px-2 py-2 text-xs font-black uppercase ${
+                isActive ? 'bg-ink text-paper' : 'bg-paper'
+              }`}
+            >
+              {filter}
+            </button>
+          )
+        })}
+      </div>
+
       <ul className="grid grid-cols-2">
-        {PRINTS.map((print) => {
+        {visible.map((print) => {
           return (
             <li key={print.id} className="border-b-4 border-r-4 border-ink">
@@ -28,6 +55,4 @@
                 </div>
 
-                {/* itemAdded(print) does NOT change anything. It builds an
-                    action object, and dispatch is what sends it. */}
                 <button
                   onClick={() => dispatch(itemAdded(print))}
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useSelector, useDispatch} from 'react-redux'
import {PRINTS} from '../data/prints'
import {itemAdded} from '../features/cartSlice'
import {filterChanged} from '../features/uiSlice'

const SWATCH = {
  red: 'bg-flat-red',
  blue: 'bg-flat-blue',
  yellow: 'bg-flat-yellow',
}

const FILTERS = ['all', 'red', 'blue', 'yellow']

const Catalog = () => {
  const dispatch = useDispatch()
  const colourFilter = useSelector((state) => state.ui.colourFilter)

  // worked out at render time from the filter. Not stored anywhere, because
  // it can always be recalculated from something that is.
  const visible =
    colourFilter === 'all'
      ? PRINTS
      : PRINTS.filter((print) => print.colour === colourFilter)

  return (
    <section>
      <div className="flex border-b-4 border-ink">
        {FILTERS.map((filter) => {
          const isActive = filter === colourFilter

          return (
            <button
              key={filter}
              onClick={() => dispatch(filterChanged(filter))}
              className={`flex-1 border-r-4 border-ink px-2 py-2 text-xs font-black uppercase ${
                isActive ? 'bg-ink text-paper' : 'bg-paper'
              }`}
            >
              {filter}
            </button>
          )
        })}
      </div>

      <ul className="grid grid-cols-2">
        {visible.map((print) => {
          return (
            <li key={print.id} className="border-b-4 border-r-4 border-ink">
              <div className={`h-28 ${SWATCH[print.colour]}`} />

              <div className="flex items-center justify-between gap-2 px-3 py-3">
                <div>
                  <p className="text-sm font-black uppercase">{print.title}</p>
                  <p className="text-xs">${print.price}</p>
                </div>

                <button
                  onClick={() => dispatch(itemAdded(print))}
                  className="border-4 border-ink bg-flat-yellow px-3 py-1 text-xs font-black uppercase"
                >
                  Add
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default Catalog
```

</details>

---

<a id="step-10"></a>

## Step 10: Selectors, and where state shape lives

Right now `Header` and `Cart` both know that items live at `state.cart.items`, and `Header` does its own arithmetic. Change the shape of the cart state and you are editing every component that reads it.

So move those questions next to the slice that can answer them:

```js
export const selectCartItems = (state) => state.cart.items

export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (running, item) => running + item.quantity * item.price,
    0
  )
```

A **selector** is a small function that knows how to get a value out of the store. Components then ask for what they want by name:

```jsx
const total = useSelector(selectCartTotal)
```

`Header` no longer contains any arithmetic, and no component mentions `state.cart` at all. **The shape of the state is known in one file**, and if it changes, that file is the only one you edit.

This is the same instinct as `api.js` in the todo list: the thing that knows the shape of the data lives in one place.

**`src/features/cartSlice.js`**

What changed:

```diff
@@ -22,6 +22,4 @@
 
     quantityIncreased(state, action) {
-      // the payload is just the id this time. An action carries whatever the
-      // reducer needs, and no more.
       const item = state.items.find((item) => item.id === action.payload)
 
@@ -38,5 +36,4 @@
       }
 
-      // going below one removes the row, which is what people expect
       if (item.quantity === 1) {
         state.items = state.items.filter((entry) => entry.id !== action.payload)
@@ -52,5 +49,4 @@
 
     cartCleared(state) {
-      // no action needed: this one carries no information at all
       state.items = []
     },
@@ -66,4 +62,19 @@
 } = cartSlice.actions
 
+/* Selectors: small functions that know how to dig a value out of the store.
+   They live next to the slice that owns the data, so if the shape of
+   state.cart ever changes, this file is the only one that has to. */
+
+export const selectCartItems = (state) => state.cart.items
+
+export const selectCartCount = (state) =>
+  state.cart.items.reduce((running, item) => running + item.quantity, 0)
+
+export const selectCartTotal = (state) =>
+  state.cart.items.reduce(
+    (running, item) => running + item.quantity * item.price,
+    0
+  )
+
 export default cartSlice.reducer
 
```

<details>
<summary>Full file after this step</summary>

```js
import {createSlice} from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',

  initialState: {
    items: [],
  },

  reducers: {
    itemAdded(state, action) {
      const print = action.payload
      const existing = state.items.find((item) => item.id === print.id)

      if (existing) {
        existing.quantity = existing.quantity + 1
        return
      }

      state.items.push({...print, quantity: 1})
    },

    quantityIncreased(state, action) {
      const item = state.items.find((item) => item.id === action.payload)

      if (item) {
        item.quantity = item.quantity + 1
      }
    },

    quantityDecreased(state, action) {
      const item = state.items.find((item) => item.id === action.payload)

      if (!item) {
        return
      }

      if (item.quantity === 1) {
        state.items = state.items.filter((entry) => entry.id !== action.payload)
        return
      }

      item.quantity = item.quantity - 1
    },

    itemRemoved(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },

    cartCleared(state) {
      state.items = []
    },
  },
})

export const {
  itemAdded,
  quantityIncreased,
  quantityDecreased,
  itemRemoved,
  cartCleared,
} = cartSlice.actions

/* Selectors: small functions that know how to dig a value out of the store.
   They live next to the slice that owns the data, so if the shape of
   state.cart ever changes, this file is the only one that has to. */

export const selectCartItems = (state) => state.cart.items

export const selectCartCount = (state) =>
  state.cart.items.reduce((running, item) => running + item.quantity, 0)

export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (running, item) => running + item.quantity * item.price,
    0
  )

export default cartSlice.reducer
```

</details>

**`src/features/uiSlice.js`**

What changed:

```diff
@@ -17,4 +17,6 @@
 export const {filterChanged} = uiSlice.actions
 
+export const selectColourFilter = (state) => state.ui.colourFilter
+
 export default uiSlice.reducer
 
```

<details>
<summary>Full file after this step</summary>

```js
import {createSlice} from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',

  initialState: {
    colourFilter: 'all',
  },

  reducers: {
    filterChanged(state, action) {
      state.colourFilter = action.payload
    },
  },
})

export const {filterChanged} = uiSlice.actions

export const selectColourFilter = (state) => state.ui.colourFilter

export default uiSlice.reducer
```

</details>

**`src/components/Header.jsx`**

What changed:

```diff
@@ -1,15 +1,10 @@
 import {useSelector} from 'react-redux'
+import {selectCartCount, selectCartTotal} from '../features/cartSlice'
 
 const Header = () => {
-  // useSelector takes a function, hands it the WHOLE store state, and gives
-  // back whatever that function returns. This component re-renders only when
-  // the value it picked out actually changes.
-  const items = useSelector((state) => state.cart.items)
-
-  const count = items.reduce((running, item) => running + item.quantity, 0)
-  const total = items.reduce(
-    (running, item) => running + item.quantity * item.price,
-    0
-  )
+  // No arrow function here any more, and no arithmetic. This component asks
+  // for two numbers and is told them.
+  const count = useSelector(selectCartCount)
+  const total = useSelector(selectCartTotal)
 
   return (
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useSelector} from 'react-redux'
import {selectCartCount, selectCartTotal} from '../features/cartSlice'

const Header = () => {
  // No arrow function here any more, and no arithmetic. This component asks
  // for two numbers and is told them.
  const count = useSelector(selectCartCount)
  const total = useSelector(selectCartTotal)

  return (
    <header className="border-b-4 border-ink">
      <div className="mx-auto flex max-w-5xl items-stretch border-x-4 border-ink">
        <h1 className="flex-1 px-5 py-4 text-2xl font-black uppercase tracking-tight">
          Bauhaus Prints
        </h1>

        <div className="flex w-20 items-center justify-center border-l-4 border-ink bg-flat-yellow text-2xl font-black">
          {count}
        </div>

        <div className="flex w-28 items-center justify-center border-l-4 border-ink bg-flat-blue text-lg font-black text-paper">
          ${total}
        </div>
      </div>
    </header>
  )
}

export default Header
```

</details>

**`src/components/Cart.jsx`**

What changed:

```diff
@@ -1,4 +1,6 @@
 import {useSelector, useDispatch} from 'react-redux'
 import {
+  selectCartItems,
+  selectCartTotal,
   quantityIncreased,
   quantityDecreased,
@@ -9,10 +11,6 @@
 const Cart = () => {
   const dispatch = useDispatch()
-  const items = useSelector((state) => state.cart.items)
-
-  const total = items.reduce(
-    (running, item) => running + item.quantity * item.price,
-    0
-  )
+  const items = useSelector(selectCartItems)
+  const total = useSelector(selectCartTotal)
 
   return (
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useSelector, useDispatch} from 'react-redux'
import {
  selectCartItems,
  selectCartTotal,
  quantityIncreased,
  quantityDecreased,
  itemRemoved,
  cartCleared,
} from '../features/cartSlice'

const Cart = () => {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)

  return (
    <aside>
      <h2 className="border-b-4 border-ink bg-flat-red px-4 py-3 text-sm font-black uppercase tracking-widest text-paper">
        Cart
      </h2>

      {items.length === 0 ? (
        <p className="px-4 py-6 text-sm">Nothing in the cart.</p>
      ) : (
        <ul>
          {items.map((item) => {
            return (
              <li key={item.id} className="border-b-4 border-ink px-4 py-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-black uppercase">{item.title}</p>
                  <button
                    onClick={() => dispatch(itemRemoved(item.id))}
                    className="text-xs font-black uppercase underline"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => dispatch(quantityDecreased(item.id))}
                    className="h-7 w-7 border-4 border-ink text-sm font-black leading-none"
                  >
                    -
                  </button>

                  <span className="w-6 text-center text-sm font-black">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => dispatch(quantityIncreased(item.id))}
                    className="h-7 w-7 border-4 border-ink bg-flat-yellow text-sm font-black leading-none"
                  >
                    +
                  </button>

                  <span className="ml-auto text-sm font-black">
                    ${item.quantity * item.price}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <div className="flex items-center justify-between border-b-4 border-ink bg-ink px-4 py-3 text-paper">
        <span className="text-xs font-black uppercase tracking-widest">
          Total
        </span>
        <span className="text-lg font-black">${total}</span>
      </div>

      {items.length > 0 && (
        <button
          onClick={() => dispatch(cartCleared())}
          className="w-full px-4 py-3 text-xs font-black uppercase tracking-widest underline"
        >
          Empty the cart
        </button>
      )}
    </aside>
  )
}

export default Cart
```

</details>

**`src/components/Catalog.jsx`**

What changed:

```diff
@@ -2,5 +2,5 @@
 import {PRINTS} from '../data/prints'
 import {itemAdded} from '../features/cartSlice'
-import {filterChanged} from '../features/uiSlice'
+import {filterChanged, selectColourFilter} from '../features/uiSlice'
 
 const SWATCH = {
@@ -14,8 +14,6 @@
 const Catalog = () => {
   const dispatch = useDispatch()
-  const colourFilter = useSelector((state) => state.ui.colourFilter)
+  const colourFilter = useSelector(selectColourFilter)
 
-  // worked out at render time from the filter. Not stored anywhere, because
-  // it can always be recalculated from something that is.
   const visible =
     colourFilter === 'all'
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useSelector, useDispatch} from 'react-redux'
import {PRINTS} from '../data/prints'
import {itemAdded} from '../features/cartSlice'
import {filterChanged, selectColourFilter} from '../features/uiSlice'

const SWATCH = {
  red: 'bg-flat-red',
  blue: 'bg-flat-blue',
  yellow: 'bg-flat-yellow',
}

const FILTERS = ['all', 'red', 'blue', 'yellow']

const Catalog = () => {
  const dispatch = useDispatch()
  const colourFilter = useSelector(selectColourFilter)

  const visible =
    colourFilter === 'all'
      ? PRINTS
      : PRINTS.filter((print) => print.colour === colourFilter)

  return (
    <section>
      <div className="flex border-b-4 border-ink">
        {FILTERS.map((filter) => {
          const isActive = filter === colourFilter

          return (
            <button
              key={filter}
              onClick={() => dispatch(filterChanged(filter))}
              className={`flex-1 border-r-4 border-ink px-2 py-2 text-xs font-black uppercase ${
                isActive ? 'bg-ink text-paper' : 'bg-paper'
              }`}
            >
              {filter}
            </button>
          )
        })}
      </div>

      <ul className="grid grid-cols-2">
        {visible.map((print) => {
          return (
            <li key={print.id} className="border-b-4 border-r-4 border-ink">
              <div className={`h-28 ${SWATCH[print.colour]}`} />

              <div className="flex items-center justify-between gap-2 px-3 py-3">
                <div>
                  <p className="text-sm font-black uppercase">{print.title}</p>
                  <p className="text-xs">${print.price}</p>
                </div>

                <button
                  onClick={() => dispatch(itemAdded(print))}
                  className="border-4 border-ink bg-flat-yellow px-3 py-1 text-xs font-black uppercase"
                >
                  Add
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default Catalog
```

</details>

---

<a id="step-11"></a>

## Step 11: The devtools

Install the **Redux DevTools** extension for your browser if you have not already, then reload the app and open the Redux tab.

`configureStore` connected it for you. Click around the app and watch:

- **every action, in order**, with its type and payload
- **the state tree** after each one
- **a diff** showing exactly what that action changed

Then use the slider at the bottom and **drag it backwards**. The application walks back through every state it has been in. That is not a replay of your clicks: it is the store being rebuilt from the list of actions.

This is what you get for keeping every change as a plain object with a name. A bug report becomes a list of actions somebody can send you, and you can replay it.

**It is also the best debugging tool in this course.** When something does not update, the question is no longer 'what went wrong' but 'did the action fire, and did the state change'. The answer is on screen.

---

<a id="step-12"></a>

## Step 12: When not to use Redux

The part people skip, and then regret.

**Use `useState` when** one component owns the value. A form field, an open menu, a hovered card. Most state is this, and a store around a boolean is thirty lines of ceremony.

**Use props when** a parent owns it and one or two children need it. Props are not a failure mode.

**Use Context when** a branch of the tree needs a value that rarely changes. A theme, a signed-in user, a language.

**Use Redux when** a lot of the app needs a lot of the same state, that state changes in many different ways, and you want a record of every change. A cart. A document editor. Anything with undo.

**For your final project:** most of you will not need this, and that is not a failure. If you do use it, use it for the one thing that is genuinely shared, and leave everything else where it is.

### In-class exercise

**Ten minutes.** A `favourites` slice: an array of print ids, a `favouriteToggled` reducer, a star on each catalog card, and a count in the header. Everything you need is something you did today.

If you finish, add a filter that shows only favourites. Think about which slice that belongs in before you write it.

---

**Where we landed:** three sibling components, no props between them, all reading and writing one store.

**The five pieces, and that is all of them:**

1. **`createSlice`** gives you a name, some initial state, and reducers. It writes the action creators for you.
2. **`configureStore`** combines your slices into one store.
3. **`<Provider store={store}>`** wraps the app, once.
4. **`useSelector(fn)`** reads. The function gets the whole state and returns the part you want.
5. **`useDispatch()`** writes. `dispatch(itemAdded(print))`.

**Three things worth remembering:**

- **You can write code that looks like mutation** inside `createSlice`, because Immer is built in. It only works in there.
- **An action creator does not change anything.** `itemAdded(print)` builds an object. `dispatch` is what sends it.
- **Selectors live next to their slice**, so the shape of the state is known in one file and nowhere else.

**And when not to use it:** a value one component owns is `useState`. A value a few components share is props, or Context. Redux earns its keep when a lot of the app needs a lot of the same state, and you want to see every change that happens.

**Homework:** see [HW.md](HW.md).

Next: TypeScript, and then final projects.
