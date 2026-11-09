# Week 11: Two slices, and a store you designed first

*Designing a store, then building it: formSlice and artSlice · ~65 min, after we finish the print shop*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

A bigger Redux project today: an app for keeping track of an art collection. Add a piece with a name and a price, see the collection listed, delete pieces, search it, and see the total value of whatever is currently showing.

Two things are different from the print shop.

**One: we design the store first.** No JSX until we know what the state is. This is how it is done when the app is not a toy, and the four questions in step 1 are worth more than any syntax in this course.

**Two: there are two slices that need each other.** The form owns the name and the price. The collection owns the list. Adding a piece needs both, and a slice cannot see another slice's state. Working out what to do about that is most of today.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [Design the store first](#step-1)
2. [The project](#step-2)
3. [formSlice, straight off the board](#step-3)
4. [artSlice, and the wall you hit](#step-4)
5. [The store, and one door](#step-5)
6. [The Provider](#step-6)
7. [ArtForm: controlled by the store](#step-7)
8. [ArtList, and something on screen](#step-8)
9. [Where we stopped, and what is left](#step-9)

---

<a id="step-1"></a>

## Step 1: Design the store first

**Editors closed.** This step happens on the board.

We know what the app has to do:

- add a piece of art with a name and a price
- show the collection, and delete pieces from it
- search the collection by name
- show the total value of whatever is currently showing

### 1. What state exists?

- the **name** being typed into the form: a string
- the **price** being typed into the form: a number
- the **search term**: a string
- the **collection**: an array of `{id, name, price}`

### 2. How does it change?

`changeName`, `changePrice`, `changeSearchTerm`, `addArt`, `removeArt`. **Those are the reducers.** We just wrote the whole store and have not opened an editor.

### 3. What groups together?

Two jobs: adding a piece, and showing the collection. So two slices.

| `formSlice` | `artSlice` |
|---|---|
| `name` | `searchTerm` |
| `price` | `data` |
| `changeName` | `changeSearchTerm` |
| `changePrice` | `addArt`, `removeArt` |

### 4. What is NOT state?

The total value, and the filtered list.

Both can be **worked out** from what we already have. The total is the prices of the visible pieces added up. The visible pieces are the collection filtered by the search term. Nothing else needs to be remembered.

**If you can calculate it, do not store it.** A stored copy of something you could have calculated is a second source of truth, and the two will disagree on a Tuesday afternoon in front of a client.

---

<a id="step-2"></a>

## Step 2: The project

A fresh Vite app with the same four packages as the print shop, and four components that do nothing yet.

`App` renders all four and passes nothing to any of them, which you have seen before.

The styling is written and we will not touch it again.

```bash
cd ~/your-hw-repo
npm create vite@latest week11-art -- --template react
cd week11-art
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install @reduxjs/toolkit react-redux
npm run dev
```

**`package.json`**  (new file)

```
{
  "name": "art-collection",
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
    <title>Art Collection</title>
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

/* Same five colours as the print shop. Flat, no gradients, no rounded
   corners, no shadows. */
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
```

**`src/components/ArtForm.jsx`**  (new file)

```jsx
const ArtForm = () => {
  return (
    <section className="border-b-4 border-ink p-5">
      <h2 className="mb-3 text-xs font-black uppercase tracking-widest">
        Add a piece
      </h2>
      <p className="text-sm">Nothing wired up yet.</p>
    </section>
  )
}

export default ArtForm
```

**`src/components/ArtSearch.jsx`**  (new file)

```jsx
const ArtSearch = () => {
  return (
    <section className="border-b-4 border-ink p-5">
      <h2 className="text-xs font-black uppercase tracking-widest">Search</h2>
    </section>
  )
}

export default ArtSearch
```

**`src/components/ArtList.jsx`**  (new file)

```jsx
const ArtList = () => {
  return (
    <section className="border-b-4 border-ink p-5">
      <p className="text-sm">Nothing in the collection yet.</p>
    </section>
  )
}

export default ArtList
```

**`src/components/ArtValue.jsx`**  (new file)

```jsx
const ArtValue = () => {
  return (
    <section className="flex items-center justify-between bg-ink px-5 py-3 text-paper">
      <span className="text-xs font-black uppercase tracking-widest">
        Total value
      </span>
      <span className="text-lg font-black">$0</span>
    </section>
  )
}

export default ArtValue
```

---

<a id="step-3"></a>

## Step 3: formSlice, straight off the board

Make `src/store/slices/` and start with the easy slice. It is the left-hand column of the table, typed out.

```js
initialState: {
  name: '',
  price: 0,
}
```

Two reducers, and both of them make the same assumption: **whatever we want to change the value to is arriving in `action.payload`.** That assumption is the whole of reducer design. Write the reducer as if the payload is already the right shape, then make the component send that shape.

Note the exports at the bottom. `formSlice.actions` holds the two action creators Redux Toolkit wrote for us, and `formSlice.reducer` is the combined reducer. We are naming that one `formReducer` on the way out, because in a minute there will be two of them and `reducer` would be ambiguous.

**`src/store/slices/formSlice.js`**  (new file)

```js
import {createSlice} from '@reduxjs/toolkit'

const formSlice = createSlice({
  name: 'form',

  // the two inputs on the form, and nothing else
  initialState: {
    name: '',
    price: 0,
  },

  reducers: {
    // The assumption every reducer makes: whatever we want to change the
    // value TO is arriving in action.payload.
    changeName(state, action) {
      state.name = action.payload
    },

    changePrice(state, action) {
      state.price = action.payload
    },
  },
})

export const {changeName, changePrice} = formSlice.actions

export const formReducer = formSlice.reducer
```

---

<a id="step-4"></a>

## Step 4: artSlice, and the wall you hit

The right-hand column. `changeSearchTerm` is the same shape as the two you just wrote. `removeArt` is `filter`, which you have done since Week 06.

**`addArt` is the interesting one.** It needs a name and a price. Those live in `formSlice`. So reach over and get them:

```js
addArt(state, action) {
  state.data.push({name: state.form.name})   // no
}
```

**There is no `state.form` here.** Inside a slice's reducer, `state` is *that slice's* state and nothing else. It is `{searchTerm, data}`. A slice cannot see another slice's state, at all, ever.

That is not a limitation to work around, it is the point: each slice owns its branch and can be read on its own.

**So the component does the reaching.** It reads the name and price out of `form`, and sends them in the payload:

```js
// assume action.payload is
// {name: 'Mondrian, Composition II', price: 500}
```

Write the assumption down as a comment. It is a contract between the reducer and whoever dispatches it, and it is the only documentation it will ever have.

### The id

```js
import {createSlice, nanoid} from '@reduxjs/toolkit'
...
id: nanoid(),
```

**`nanoid()` makes a short unique id**, and it comes with Redux Toolkit. The reducer makes it rather than the form, because the id belongs to the piece of art, not to the thing that happened to create it.

**`src/store/slices/artSlice.js`**  (new file)

```js
import {createSlice, nanoid} from '@reduxjs/toolkit'

const artSlice = createSlice({
  name: 'art',

  initialState: {
    searchTerm: '',
    data: [], // an array of {id, name, price}
  },

  reducers: {
    changeSearchTerm(state, action) {
      state.searchTerm = action.payload
    },

    addArt(state, action) {
      // A SLICE CANNOT SEE ANOTHER SLICE'S STATE. The name and the price
      // live in formSlice, and there is no way to reach them from here.
      // So the component reads them and sends them in the payload.
      // Assume action.payload is {name: 'Mondrian, Composition II', price: 500}
      state.data.push({
        id: nanoid(),
        name: action.payload.name,
        price: action.payload.price,
      })
    },

    removeArt(state, action) {
      // assume action.payload is the id of the piece to remove
      state.data = state.data.filter((item) => item.id !== action.payload)
    },
  },
})

export const {changeSearchTerm, addArt, removeArt} = artSlice.actions

export const artReducer = artSlice.reducer
```

---

<a id="step-5"></a>

## Step 5: The store, and one door

`src/store/index.js`. Two keys, two slices, exactly like the print shop:

```js
reducer: {
  art: artReducer,
  form: formReducer,
}
```

So the state tree is:

```js
{
  art: {searchTerm: '', data: []},
  form: {name: '', price: 0},
}
```

**That tree is the board, and every `useSelector` today starts from it.**

Then the part that is new. Look at the last line: this file re-exports the action creators as well as the store.

```js
export {store, changeName, changePrice, addArt, removeArt, changeSearchTerm}
```

Components will import everything from `'../store'` and never from a slice file. **One door in and out.** If a slice gets renamed or split in two, this is the only file that has to change, instead of every component that used it.

It is the same instinct as `api.js` in the todo list, and as the selectors in the print shop: the thing that knows where something lives is kept in one place.

**`src/store/index.js`**  (new file)

```js
import {configureStore} from '@reduxjs/toolkit'

import {artReducer, addArt, removeArt, changeSearchTerm} from './slices/artSlice'
import {formReducer, changeName, changePrice} from './slices/formSlice'

const store = configureStore({
  reducer: {
    art: artReducer,
    form: formReducer,
  },
})

// One door in and out. Components import everything they need from
// '../store' and never reach into a slice file directly, so if a slice
// moves or gets renamed, this is the only file that changes.
export {store, changeName, changePrice, addArt, removeArt, changeSearchTerm}
```

---

<a id="step-6"></a>

## Step 6: The Provider

One line of plumbing at the top of the app, exactly as before:

```jsx
<Provider store={store}>
  <App />
</Provider>
```

Save and reload. **Nothing visible changes.** The store exists and no component is reading it yet.

Open the Redux devtools though, and the state tree is there, with both branches on it, exactly as drawn.

**`src/main.jsx`**

What changed:

```diff
@@ -1,11 +1,15 @@
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
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
```

</details>

---

<a id="step-7"></a>

## Step 7: ArtForm: controlled by the store

Both inputs are controlled, and **the store is what controls them**. There is no `useState` in this component.

```jsx
const name = useSelector((state) => state.form.name)
const price = useSelector((state) => state.form.price)
```

Every keystroke dispatches, the store updates, the component re-renders, and the input shows the new value. Watch it in the devtools while you type: **one action per character.** That is normal and it is fine.

Two lines you have seen before and will see again:

```js
const value = parseInt(event.target.value) || 0
```

Every input hands back a string, including `type="number"`. `|| 0` catches the empty field, which `parseInt` reads as `NaN`.

```jsx
value={price || ''}
```

So the field shows empty rather than a `0` the user has to delete first.

And `handleSubmit` is the bridge between the two slices:

```js
dispatch(addArt({name, price}))
```

**It reads from `form` and sends to `art`.** The component can see both because it is outside them. Neither slice can see the other.

**`src/components/ArtForm.jsx`**

What changed:

```diff
@@ -1,3 +1,35 @@
+import {useSelector, useDispatch} from 'react-redux'
+import {changeName, changePrice, addArt} from '../store'
+
 const ArtForm = () => {
+  const dispatch = useDispatch()
+
+  // Both inputs are controlled, and the store is what controls them.
+  // There is no useState anywhere in this component.
+  const name = useSelector((state) => state.form.name)
+  const price = useSelector((state) => state.form.price)
+
+  const handleNameChange = (event) => {
+    dispatch(changeName(event.target.value))
+  }
+
+  const handlePriceChange = (event) => {
+    // every input hands back a string, even type="number"
+    const value = parseInt(event.target.value) || 0
+    dispatch(changePrice(value))
+  }
+
+  const handleSubmit = (event) => {
+    event.preventDefault()
+
+    if (!name.trim()) {
+      return
+    }
+
+    // The component is the bridge between the two slices: it reads from
+    // form and sends the values to art in the payload.
+    dispatch(addArt({name, price}))
+  }
+
   return (
     <section className="border-b-4 border-ink p-5">
@@ -5,5 +37,38 @@
         Add a piece
       </h2>
-      <p className="text-sm">Nothing wired up yet.</p>
+
+      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
+        <div className="flex-1">
+          <label className="block text-xs font-black uppercase" htmlFor="name">
+            Artist and title
+          </label>
+          <input
+            id="name"
+            type="text"
+            value={name}
+            onChange={handleNameChange}
+            placeholder="Mondrian, Composition II"
+            className="mt-1 w-full border-4 border-ink bg-white px-3 py-2"
+          />
+        </div>
+
+        <div className="w-32">
+          <label className="block text-xs font-black uppercase" htmlFor="price">
+            Price
+          </label>
+          <input
+            id="price"
+            type="number"
+            min="0"
+            value={price || ''}
+            onChange={handlePriceChange}
+            className="mt-1 w-full border-4 border-ink bg-white px-3 py-2"
+          />
+        </div>
+
+        <button className="border-4 border-ink bg-flat-yellow px-4 py-2 text-xs font-black uppercase tracking-widest">
+          Add
+        </button>
+      </form>
     </section>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useSelector, useDispatch} from 'react-redux'
import {changeName, changePrice, addArt} from '../store'

const ArtForm = () => {
  const dispatch = useDispatch()

  // Both inputs are controlled, and the store is what controls them.
  // There is no useState anywhere in this component.
  const name = useSelector((state) => state.form.name)
  const price = useSelector((state) => state.form.price)

  const handleNameChange = (event) => {
    dispatch(changeName(event.target.value))
  }

  const handlePriceChange = (event) => {
    // every input hands back a string, even type="number"
    const value = parseInt(event.target.value) || 0
    dispatch(changePrice(value))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    // The component is the bridge between the two slices: it reads from
    // form and sends the values to art in the payload.
    dispatch(addArt({name, price}))
  }

  return (
    <section className="border-b-4 border-ink p-5">
      <h2 className="mb-3 text-xs font-black uppercase tracking-widest">
        Add a piece
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs font-black uppercase" htmlFor="name">
            Artist and title
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Mondrian, Composition II"
            className="mt-1 w-full border-4 border-ink bg-white px-3 py-2"
          />
        </div>

        <div className="w-32">
          <label className="block text-xs font-black uppercase" htmlFor="price">
            Price
          </label>
          <input
            id="price"
            type="number"
            min="0"
            value={price || ''}
            onChange={handlePriceChange}
            className="mt-1 w-full border-4 border-ink bg-white px-3 py-2"
          />
        </div>

        <button className="border-4 border-ink bg-flat-yellow px-4 py-2 text-xs font-black uppercase tracking-widest">
          Add
        </button>
      </form>
    </section>
  )
}

export default ArtForm
```

</details>

---

<a id="step-8"></a>

## Step 8: ArtList, and something on screen

```jsx
const data = useSelector((state) => state.art.data)
```

Then `map` over it, which you have done since Week 02, and a delete button that dispatches the id:

```jsx
onClick={() => dispatch(removeArt(art.id))}
```

**Note what the delete button sends: just the id.** The reducer does not need the whole object to filter it out, and an action should carry what its reducer needs and no more.

The arrow function matters. `onClick={dispatch(removeArt(...))}` would run on render, for every row, immediately. `onClick={() => ...}` hands over a function to be called later, which is the no-brackets rule from Intro wearing a different hat.

Save. **Add a piece and it appears. Delete it and it goes.** Two components that have never heard of each other, sharing one list.

**`src/components/ArtList.jsx`**

What changed:

```diff
@@ -1,7 +1,39 @@
+import {useSelector, useDispatch} from 'react-redux'
+import {removeArt} from '../store'
+
 const ArtList = () => {
+  const dispatch = useDispatch()
+  const data = useSelector((state) => state.art.data)
+
+  if (data.length === 0) {
+    return (
+      <section className="border-b-4 border-ink p-5">
+        <p className="text-sm">Nothing in the collection yet.</p>
+      </section>
+    )
+  }
+
   return (
-    <section className="border-b-4 border-ink p-5">
-      <p className="text-sm">Nothing in the collection yet.</p>
-    </section>
+    <ul className="border-b-4 border-ink">
+      {data.map((art) => {
+        return (
+          <li
+            key={art.id}
+            className="flex items-center justify-between gap-3 border-b-4 border-ink px-5 py-3 last:border-b-0"
+          >
+            <p className="text-sm font-black uppercase">
+              {art.name} <span className="font-normal">${art.price}</span>
+            </p>
+
+            <button
+              onClick={() => dispatch(removeArt(art.id))}
+              className="border-4 border-ink bg-flat-red px-3 py-1 text-xs font-black uppercase text-paper"
+            >
+              Delete
+            </button>
+          </li>
+        )
+      })}
+    </ul>
   )
 }
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useSelector, useDispatch} from 'react-redux'
import {removeArt} from '../store'

const ArtList = () => {
  const dispatch = useDispatch()
  const data = useSelector((state) => state.art.data)

  if (data.length === 0) {
    return (
      <section className="border-b-4 border-ink p-5">
        <p className="text-sm">Nothing in the collection yet.</p>
      </section>
    )
  }

  return (
    <ul className="border-b-4 border-ink">
      {data.map((art) => {
        return (
          <li
            key={art.id}
            className="flex items-center justify-between gap-3 border-b-4 border-ink px-5 py-3 last:border-b-0"
          >
            <p className="text-sm font-black uppercase">
              {art.name} <span className="font-normal">${art.price}</span>
            </p>

            <button
              onClick={() => dispatch(removeArt(art.id))}
              className="border-4 border-ink bg-flat-red px-3 py-1 text-xs font-black uppercase text-paper"
            >
              Delete
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default ArtList
```

</details>

---

<a id="step-9"></a>

## Step 9: Where we stopped, and what is left

Nothing to type. Look at what is still not done:

- **the search box** does nothing
- **the total** says `$0` and is typed into the markup
- **the form does not clear** after you add a piece

That last one is worth thinking about tonight. When you add a piece, `artSlice` changes. The form fields are owned by `formSlice`. **Clearing them is a job for a slice that cannot see the action that caused it.**

You could dispatch a second action from the component, and that would work. There is a better answer and it is Thursday's best moment.

### Before Thursday

Have this running, with a few pieces added. If your form does not add, check three things in this order: is the Provider there, is the reducer registered in the store under the key your selector reads, and is your payload the shape the reducer assumes.

---

**Where we landed:** a store with two slices in it, a form that writes to one of them, and a list that reads from the other.

**What to take from today:**

- **Design the store first.** What state exists, how it changes, what groups together, and what can be worked out from the rest.
- **Derived values are not state.** The total and the filtered list can be calculated from what we already have, so they stay out of the store. That is Thursday.
- **A slice cannot see another slice's state.** If a reducer needs a value that lives elsewhere, the component reads it and sends it in the payload.
- **`nanoid()`** from Redux Toolkit makes an id. Ids belong to the thing being created, so the reducer makes it, not the form.
- **One access point.** Components import from `../store`, never from a slice file directly.

**Thursday:** the search, the total, and the moment the form clears itself without anybody telling it to.

**Homework:** see [HW.md](HW.md).
