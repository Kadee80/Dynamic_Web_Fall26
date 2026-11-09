# Week 11: Derived state, and slices that talk

*Search, totals, selectors, and extraReducers · ~110 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

Tuesday we designed the store and built it. The form adds pieces and the list shows them.

Today, the three things still missing: **the search**, **the total**, and **the form clearing itself** after you add a piece.

The search and the total are the same idea, which is the one from step 1 on Tuesday: **if you can work it out from what you already have, do not store it.** Neither of them goes in the store.

The form clearing itself is a new mechanism, and it is the neatest thing in Redux.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [Where Tuesday stopped](#step-1)
2. [The search box](#step-2)
3. [Filtering, without storing anything](#step-3)
4. [The total, of what you can see](#step-4)
5. [The same filter, written twice](#step-5)
6. [createSelector, and when you would want it](#step-6)
7. [The form clears itself](#step-7)
8. [Spotting a duplicate](#step-8)
9. [What is still missing, and the exercise](#step-9)

---

<a id="step-1"></a>

## Step 1: Where Tuesday stopped

Both terminal tabs are not needed today, there is no server. Just `npm run dev`, and the devtools open.

Add two or three pieces so there is something to work with. Three things are still missing:

1. the **search box** does nothing
2. the **total** is the literal text `$0`, typed into the markup on Tuesday
3. the **form does not clear** after you add a piece

The first two are the same problem and we will do them together. The third is the interesting one and it is step 7.

```bash
cd ~/your-hw-repo/week11-art
npm run dev
```

---

<a id="step-2"></a>

## Step 2: The search box

Nothing new here at all. It is the same three lines as every controlled input you have written since Week 08:

```jsx
const searchTerm = useSelector((state) => state.art.searchTerm)
const handleChange = (event) => {
  dispatch(changeSearchTerm(event.target.value))
}
```

Type in it and watch the devtools. The actions fire, the state changes, **and the list does not move**, because nothing is reading `searchTerm` yet.

That gap is the next step.

**`src/components/ArtSearch.jsx`**

What changed:

```diff
@@ -1,6 +1,27 @@
+import {useSelector, useDispatch} from 'react-redux'
+import {changeSearchTerm} from '../store'
+
 const ArtSearch = () => {
+  const dispatch = useDispatch()
+  const searchTerm = useSelector((state) => state.art.searchTerm)
+
+  const handleChange = (event) => {
+    dispatch(changeSearchTerm(event.target.value))
+  }
+
   return (
-    <section className="border-b-4 border-ink p-5">
-      <h2 className="text-xs font-black uppercase tracking-widest">Search</h2>
+    <section className="flex items-center gap-3 border-b-4 border-ink p-5">
+      <label className="text-xs font-black uppercase tracking-widest" htmlFor="search">
+        Search
+      </label>
+
+      <input
+        id="search"
+        type="text"
+        value={searchTerm}
+        onChange={handleChange}
+        placeholder="Filter by name"
+        className="flex-1 border-4 border-ink bg-white px-3 py-2"
+      />
     </section>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useSelector, useDispatch} from 'react-redux'
import {changeSearchTerm} from '../store'

const ArtSearch = () => {
  const dispatch = useDispatch()
  const searchTerm = useSelector((state) => state.art.searchTerm)

  const handleChange = (event) => {
    dispatch(changeSearchTerm(event.target.value))
  }

  return (
    <section className="flex items-center gap-3 border-b-4 border-ink p-5">
      <label className="text-xs font-black uppercase tracking-widest" htmlFor="search">
        Search
      </label>

      <input
        id="search"
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Filter by name"
        className="flex-1 border-4 border-ink bg-white px-3 py-2"
      />
    </section>
  )
}

export default ArtSearch
```

</details>

---

<a id="step-3"></a>

## Step 3: Filtering, without storing anything

Here is the wrong way, and it is tempting:

```js
// NO
addArt(state, action) {
  state.data.push({...action.payload, visible: true})
}
changeSearchTerm(state, action) {
  state.searchTerm = action.payload
  state.data.forEach((art) => {
    art.visible = art.name.includes(action.payload)
  })
}
```

It works. And now every piece of art carries a `visible` flag that is only correct if **every** reducer that ever touches `data` remembers to update it. Add a piece while a search is active and it is already wrong.

**The filtered list is not state. It is a question.** Ask it while rendering:

```jsx
const visible = useSelector((state) =>
  state.art.data.filter((art) =>
    art.name.toLowerCase().includes(state.art.searchTerm.toLowerCase())
  )
)
```

`toLowerCase()` on both sides so the search is not fussy about capitals.

Save and type in the search box. **The list narrows.** Nothing was added to the store, so there is nothing new that can go stale, and there is no reducer anybody has to remember to update.

**`src/components/ArtList.jsx`**

What changed:

```diff
@@ -4,10 +4,17 @@
 const ArtList = () => {
   const dispatch = useDispatch()
-  const data = useSelector((state) => state.art.data)
 
-  if (data.length === 0) {
+  // Worked out at render time, from two pieces of state we already have.
+  // Nothing new is stored, so nothing new can go stale.
+  const visible = useSelector((state) =>
+    state.art.data.filter((art) =>
+      art.name.toLowerCase().includes(state.art.searchTerm.toLowerCase())
+    )
+  )
+
+  if (visible.length === 0) {
     return (
       <section className="border-b-4 border-ink p-5">
-        <p className="text-sm">Nothing in the collection yet.</p>
+        <p className="text-sm">Nothing to show.</p>
       </section>
     )
@@ -16,5 +23,5 @@
   return (
     <ul className="border-b-4 border-ink">
-      {data.map((art) => {
+      {visible.map((art) => {
         return (
           <li
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useSelector, useDispatch} from 'react-redux'
import {removeArt} from '../store'

const ArtList = () => {
  const dispatch = useDispatch()

  // Worked out at render time, from two pieces of state we already have.
  // Nothing new is stored, so nothing new can go stale.
  const visible = useSelector((state) =>
    state.art.data.filter((art) =>
      art.name.toLowerCase().includes(state.art.searchTerm.toLowerCase())
    )
  )

  if (visible.length === 0) {
    return (
      <section className="border-b-4 border-ink p-5">
        <p className="text-sm">Nothing to show.</p>
      </section>
    )
  }

  return (
    <ul className="border-b-4 border-ink">
      {visible.map((art) => {
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

<a id="step-4"></a>

## Step 4: The total, of what you can see

Same move again. The total is the visible pieces added up:

```jsx
const total = useSelector((state) =>
  state.art.data
    .filter(...)
    .reduce((running, art) => running + art.price, 0)
)
```

`filter` then `reduce`, chained: the filter hands its array to the reduce.

**Note which total this is.** Not the whole collection: whatever is currently showing. So searching for one artist answers "how much is that part of my collection worth", which is a genuinely useful thing for the app to do, and it came free from filtering first.

Add some pieces, then search. **Two numbers move together** and neither of them is stored anywhere.

**`src/components/ArtValue.jsx`**

What changed:

```diff
@@ -1,3 +1,15 @@
+import {useSelector} from 'react-redux'
+
 const ArtValue = () => {
+  // The total of what is VISIBLE, not of everything. Search for one artist
+  // and this number answers "how much is that part of the collection worth".
+  const total = useSelector((state) =>
+    state.art.data
+      .filter((art) =>
+        art.name.toLowerCase().includes(state.art.searchTerm.toLowerCase())
+      )
+      .reduce((running, art) => running + art.price, 0)
+  )
+
   return (
     <section className="flex items-center justify-between bg-ink px-5 py-3 text-paper">
@@ -5,5 +17,5 @@
         Total value
       </span>
-      <span className="text-lg font-black">$0</span>
+      <span className="text-lg font-black">${total}</span>
     </section>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useSelector} from 'react-redux'

const ArtValue = () => {
  // The total of what is VISIBLE, not of everything. Search for one artist
  // and this number answers "how much is that part of the collection worth".
  const total = useSelector((state) =>
    state.art.data
      .filter((art) =>
        art.name.toLowerCase().includes(state.art.searchTerm.toLowerCase())
      )
      .reduce((running, art) => running + art.price, 0)
  )

  return (
    <section className="flex items-center justify-between bg-ink px-5 py-3 text-paper">
      <span className="text-xs font-black uppercase tracking-widest">
        Total value
      </span>
      <span className="text-lg font-black">${total}</span>
    </section>
  )
}

export default ArtValue
```

</details>

---

<a id="step-5"></a>

## Step 5: The same filter, written twice

`ArtList` and `ArtValue` both contain this:

```js
state.art.data.filter((art) =>
  art.name.toLowerCase().includes(state.art.searchTerm.toLowerCase())
)
```

Change how search works, say to match the price too, and you edit both. Miss one and the total disagrees with the list, which is the exact bug we avoided by not storing it.

**A selector is a function that answers a question about the store.** Move both questions into the slice that owns the data:

```js
export const selectVisibleArt = (state) => ...
export const selectTotalValue = (state) =>
  selectVisibleArt(state).reduce(...)
```

Note `selectTotalValue` **calls `selectVisibleArt`**. One definition of what visible means, and the total is built on top of it.

Re-export both from `store/index.js` so components still import from one door, then use them:

```jsx
const visible = useSelector(selectVisibleArt)
const total = useSelector(selectTotalValue)
```

**Neither component mentions `state.art` any more.** They ask for what they want by name. Change the shape of the store tomorrow and `artSlice.js` is the only file you touch.

This is the same move as the print shop's step 10, and as `api.js` in the todo list. It will keep coming up.

**`src/store/slices/artSlice.js`**

What changed:

```diff
@@ -15,8 +15,4 @@
 
     addArt(state, action) {
-      // A SLICE CANNOT SEE ANOTHER SLICE'S STATE. The name and the price
-      // live in formSlice, and there is no way to reach them from here.
-      // So the component reads them and sends them in the payload.
-      // Assume action.payload is {name: 'Mondrian, Composition II', price: 500}
       state.data.push({
         id: nanoid(),
@@ -27,5 +23,4 @@
 
     removeArt(state, action) {
-      // assume action.payload is the id of the piece to remove
       state.data = state.data.filter((item) => item.id !== action.payload)
     },
@@ -35,4 +30,16 @@
 export const {changeSearchTerm, addArt, removeArt} = artSlice.actions
 
+/* Selectors live next to the slice that owns the data. Both of these
+   answer a question about the art, so this is where they belong, and
+   it is now the only file that knows the shape of state.art. */
+
+export const selectVisibleArt = (state) =>
+  state.art.data.filter((art) =>
+    art.name.toLowerCase().includes(state.art.searchTerm.toLowerCase())
+  )
+
+export const selectTotalValue = (state) =>
+  selectVisibleArt(state).reduce((running, art) => running + art.price, 0)
+
 export const artReducer = artSlice.reducer
 
```

<details>
<summary>Full file after this step</summary>

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
      state.data.push({
        id: nanoid(),
        name: action.payload.name,
        price: action.payload.price,
      })
    },

    removeArt(state, action) {
      state.data = state.data.filter((item) => item.id !== action.payload)
    },
  },
})

export const {changeSearchTerm, addArt, removeArt} = artSlice.actions

/* Selectors live next to the slice that owns the data. Both of these
   answer a question about the art, so this is where they belong, and
   it is now the only file that knows the shape of state.art. */

export const selectVisibleArt = (state) =>
  state.art.data.filter((art) =>
    art.name.toLowerCase().includes(state.art.searchTerm.toLowerCase())
  )

export const selectTotalValue = (state) =>
  selectVisibleArt(state).reduce((running, art) => running + art.price, 0)

export const artReducer = artSlice.reducer
```

</details>

**`src/store/index.js`**

What changed:

```diff
@@ -1,5 +1,12 @@
 import {configureStore} from '@reduxjs/toolkit'
 
-import {artReducer, addArt, removeArt, changeSearchTerm} from './slices/artSlice'
+import {
+  artReducer,
+  addArt,
+  removeArt,
+  changeSearchTerm,
+  selectVisibleArt,
+  selectTotalValue,
+} from './slices/artSlice'
 import {formReducer, changeName, changePrice} from './slices/formSlice'
 
@@ -11,7 +18,13 @@
 })
 
-// One door in and out. Components import everything they need from
-// '../store' and never reach into a slice file directly, so if a slice
-// moves or gets renamed, this is the only file that changes.
-export {store, changeName, changePrice, addArt, removeArt, changeSearchTerm}
+export {
+  store,
+  changeName,
+  changePrice,
+  addArt,
+  removeArt,
+  changeSearchTerm,
+  selectVisibleArt,
+  selectTotalValue,
+}
 
```

<details>
<summary>Full file after this step</summary>

```js
import {configureStore} from '@reduxjs/toolkit'

import {
  artReducer,
  addArt,
  removeArt,
  changeSearchTerm,
  selectVisibleArt,
  selectTotalValue,
} from './slices/artSlice'
import {formReducer, changeName, changePrice} from './slices/formSlice'

const store = configureStore({
  reducer: {
    art: artReducer,
    form: formReducer,
  },
})

export {
  store,
  changeName,
  changePrice,
  addArt,
  removeArt,
  changeSearchTerm,
  selectVisibleArt,
  selectTotalValue,
}
```

</details>

**`src/components/ArtList.jsx`**

What changed:

```diff
@@ -1,15 +1,11 @@
 import {useSelector, useDispatch} from 'react-redux'
-import {removeArt} from '../store'
+import {removeArt, selectVisibleArt} from '../store'
 
 const ArtList = () => {
   const dispatch = useDispatch()
 
-  // Worked out at render time, from two pieces of state we already have.
-  // Nothing new is stored, so nothing new can go stale.
-  const visible = useSelector((state) =>
-    state.art.data.filter((art) =>
-      art.name.toLowerCase().includes(state.art.searchTerm.toLowerCase())
-    )
-  )
+  // The component asks for what it wants by name and no longer knows
+  // where in the store the answer comes from.
+  const visible = useSelector(selectVisibleArt)
 
   if (visible.length === 0) {
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useSelector, useDispatch} from 'react-redux'
import {removeArt, selectVisibleArt} from '../store'

const ArtList = () => {
  const dispatch = useDispatch()

  // The component asks for what it wants by name and no longer knows
  // where in the store the answer comes from.
  const visible = useSelector(selectVisibleArt)

  if (visible.length === 0) {
    return (
      <section className="border-b-4 border-ink p-5">
        <p className="text-sm">Nothing to show.</p>
      </section>
    )
  }

  return (
    <ul className="border-b-4 border-ink">
      {visible.map((art) => {
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

**`src/components/ArtValue.jsx`**

What changed:

```diff
@@ -1,14 +1,7 @@
 import {useSelector} from 'react-redux'
+import {selectTotalValue} from '../store'
 
 const ArtValue = () => {
-  // The total of what is VISIBLE, not of everything. Search for one artist
-  // and this number answers "how much is that part of the collection worth".
-  const total = useSelector((state) =>
-    state.art.data
-      .filter((art) =>
-        art.name.toLowerCase().includes(state.art.searchTerm.toLowerCase())
-      )
-      .reduce((running, art) => running + art.price, 0)
-  )
+  const total = useSelector(selectTotalValue)
 
   return (
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useSelector} from 'react-redux'
import {selectTotalValue} from '../store'

const ArtValue = () => {
  const total = useSelector(selectTotalValue)

  return (
    <section className="flex items-center justify-between bg-ink px-5 py-3 text-paper">
      <span className="text-xs font-black uppercase tracking-widest">
        Total value
      </span>
      <span className="text-lg font-black">${total}</span>
    </section>
  )
}

export default ArtValue
```

</details>

---

<a id="step-6"></a>

## Step 6: createSelector, and when you would want it

A detail, honestly labelled as one.

`selectVisibleArt` runs on **every render of every component that uses it**. Type one letter into the form, which has nothing to do with the collection, and the whole list gets filtered again.

At six pieces of art, that does not matter even slightly. At six thousand, it does.

```js
export const selectVisibleArt = createSelector(
  [(state) => state.art.data, (state) => state.art.searchTerm],
  (data, searchTerm) => data.filter(...)
)
```

**`createSelector` takes a list of small input selectors and a function that combines their results.** It remembers the last answer and only runs the combining function again when one of the inputs has actually changed. Typing in the form no longer re-filters the collection.

There is a second, quieter reason. `filter` returns a **new array every time**, and `useSelector` decides whether to re-render by comparing what it got against what it got last time. A new array is never equal to the old one, so a component selecting a filtered list can re-render more than it needs to. Memoising hands back the same array when nothing changed.

**You do not need this today.** Know it exists, reach for it when a selector is doing real work on a lot of data, and do not sprinkle it everywhere. A cache is a thing that can be wrong.

**`src/store/slices/artSlice.js`**

What changed:

```diff
@@ -1,3 +1,3 @@
-import {createSlice, nanoid} from '@reduxjs/toolkit'
+import {createSlice, createSelector, nanoid} from '@reduxjs/toolkit'
 
 const artSlice = createSlice({
@@ -30,15 +30,22 @@
 export const {changeSearchTerm, addArt, removeArt} = artSlice.actions
 
-/* Selectors live next to the slice that owns the data. Both of these
-   answer a question about the art, so this is where they belong, and
-   it is now the only file that knows the shape of state.art. */
+/* createSelector takes a list of small "input" selectors and a function
+   that combines their results. It remembers the last answer, and only
+   runs the combining function again when one of the inputs has actually
+   changed. Typing in the FORM no longer re-filters the collection. */
 
-export const selectVisibleArt = (state) =>
-  state.art.data.filter((art) =>
-    art.name.toLowerCase().includes(state.art.searchTerm.toLowerCase())
-  )
+export const selectVisibleArt = createSelector(
+  [(state) => state.art.data, (state) => state.art.searchTerm],
+  (data, searchTerm) =>
+    data.filter((art) =>
+      art.name.toLowerCase().includes(searchTerm.toLowerCase())
+    )
+)
 
-export const selectTotalValue = (state) =>
-  selectVisibleArt(state).reduce((running, art) => running + art.price, 0)
+// selectors compose: this one takes the one above as its input
+export const selectTotalValue = createSelector(
+  [selectVisibleArt],
+  (visible) => visible.reduce((running, art) => running + art.price, 0)
+)
 
 export const artReducer = artSlice.reducer
```

<details>
<summary>Full file after this step</summary>

```js
import {createSlice, createSelector, nanoid} from '@reduxjs/toolkit'

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
      state.data.push({
        id: nanoid(),
        name: action.payload.name,
        price: action.payload.price,
      })
    },

    removeArt(state, action) {
      state.data = state.data.filter((item) => item.id !== action.payload)
    },
  },
})

export const {changeSearchTerm, addArt, removeArt} = artSlice.actions

/* createSelector takes a list of small "input" selectors and a function
   that combines their results. It remembers the last answer, and only
   runs the combining function again when one of the inputs has actually
   changed. Typing in the FORM no longer re-filters the collection. */

export const selectVisibleArt = createSelector(
  [(state) => state.art.data, (state) => state.art.searchTerm],
  (data, searchTerm) =>
    data.filter((art) =>
      art.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
)

// selectors compose: this one takes the one above as its input
export const selectTotalValue = createSelector(
  [selectVisibleArt],
  (visible) => visible.reduce((running, art) => running + art.price, 0)
)

export const artReducer = artSlice.reducer
```

</details>

---

<a id="step-7"></a>

## Step 7: The form clears itself

The last missing thing, and the best mechanism in Redux.

Add a piece and the form still holds what you typed. You could dispatch two more actions from the component:

```js
dispatch(addArt({name, price}))
dispatch(changeName(''))        // works, but
dispatch(changePrice(0))        // the component now has to remember
```

That works. It also means every place that ever adds a piece has to remember to tidy up after itself.

**The form should clear itself when a piece is added.** It is the form's business, so put it in the form's slice:

```js
import {addArt} from './artSlice'

extraReducers(builder) {
  builder.addCase(addArt, (state) => {
    state.name = ''
    state.price = 0
  })
},
```

**`extraReducers` is how a slice responds to an action it does not own.** `addArt` belongs to `artSlice`. We are not calling it, intercepting it, or changing what it does. We are saying: when that happens, here is what the form does about it.

Save. Add a piece. **The form empties and no component told it to.**

### Why this is the important one

An action is **an announcement that something happened**, not an instruction to one particular slice. Every slice in the store sees every action and decides for itself whether it cares. One dispatch, two slices, each updating its own branch.

Keep `addArt` in `artSlice`: whoever creates the action owns it, and everybody else listens.

**`src/store/slices/formSlice.js`**

What changed:

```diff
@@ -1,8 +1,8 @@
 import {createSlice} from '@reduxjs/toolkit'
+import {addArt} from './artSlice'
 
 const formSlice = createSlice({
   name: 'form',
 
-  // the two inputs on the form, and nothing else
   initialState: {
     name: '',
@@ -11,6 +11,4 @@
 
   reducers: {
-    // The assumption every reducer makes: whatever we want to change the
-    // value TO is arriving in action.payload.
     changeName(state, action) {
       state.name = action.payload
@@ -21,4 +19,17 @@
     },
   },
+
+  /* extraReducers is how a slice responds to an action it does not own.
+     addArt belongs to artSlice. We are not calling it, intercepting it,
+     or changing what it does: we are saying "when that happens, here is
+     what the form should do about it". Both reducers run, on their own
+     branch of the state, from the one dispatch. */
+  extraReducers(builder) {
+    builder.addCase(addArt, (state) => {
+      // no action parameter: there is nothing in the payload we need
+      state.name = ''
+      state.price = 0
+    })
+  },
 })
 
```

<details>
<summary>Full file after this step</summary>

```js
import {createSlice} from '@reduxjs/toolkit'
import {addArt} from './artSlice'

const formSlice = createSlice({
  name: 'form',

  initialState: {
    name: '',
    price: 0,
  },

  reducers: {
    changeName(state, action) {
      state.name = action.payload
    },

    changePrice(state, action) {
      state.price = action.payload
    },
  },

  /* extraReducers is how a slice responds to an action it does not own.
     addArt belongs to artSlice. We are not calling it, intercepting it,
     or changing what it does: we are saying "when that happens, here is
     what the form should do about it". Both reducers run, on their own
     branch of the state, from the one dispatch. */
  extraReducers(builder) {
    builder.addCase(addArt, (state) => {
      // no action parameter: there is nothing in the payload we need
      state.name = ''
      state.price = 0
    })
  },
})

export const {changeName, changePrice} = formSlice.actions

export const formReducer = formSlice.reducer
```

</details>

---

<a id="step-8"></a>

## Step 8: Spotting a duplicate

The nice-to-have from the original brief, and it is derived state one more time.

While you are typing a name into the form, anything in the collection that looks like it should stand out, so you do not buy the same Mondrian twice.

The wrong instinct is a `highlighted` flag on each piece, or a third slice. **It is neither.** It is a comparison between two things already in the store, worked out while rendering:

```jsx
const name = useSelector((state) => state.form.name)

// inside the map
const isPossibleDuplicate =
  name.trim() !== '' &&
  art.name.toLowerCase().includes(name.trim().toLowerCase())
```

The `name.trim() !== ''` guard matters: without it, an empty form matches **everything**, because every string contains the empty string. Try it without the guard once.

Then a class name chosen by a ternary, which is the pattern from the Intro course and from the print shop:

```jsx
className={`... ${isPossibleDuplicate ? 'bg-flat-yellow' : ''}`}
```

**`ArtList` now reads from both slices**, and it is still the component's business, not the store's. The store holds facts. What those facts mean on screen is a rendering decision.

**`src/components/ArtList.jsx`**

What changed:

```diff
@@ -5,7 +5,9 @@
   const dispatch = useDispatch()
 
-  // The component asks for what it wants by name and no longer knows
-  // where in the store the answer comes from.
   const visible = useSelector(selectVisibleArt)
+
+  // what is currently typed into the form, so we can point out a piece
+  // that looks like the one being added
+  const name = useSelector((state) => state.form.name)
 
   if (visible.length === 0) {
@@ -20,8 +22,16 @@
     <ul className="border-b-4 border-ink">
       {visible.map((art) => {
+        // Worked out while rendering. NOT stored on the art object, and
+        // not a third slice. It is a fact about right now.
+        const isPossibleDuplicate =
+          name.trim() !== '' &&
+          art.name.toLowerCase().includes(name.trim().toLowerCase())
+
         return (
           <li
             key={art.id}
-            className="flex items-center justify-between gap-3 border-b-4 border-ink px-5 py-3 last:border-b-0"
+            className={`flex items-center justify-between gap-3 border-b-4 border-ink px-5 py-3 last:border-b-0 ${
+              isPossibleDuplicate ? 'bg-flat-yellow' : ''
+            }`}
           >
             <p className="text-sm font-black uppercase">
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useSelector, useDispatch} from 'react-redux'
import {removeArt, selectVisibleArt} from '../store'

const ArtList = () => {
  const dispatch = useDispatch()

  const visible = useSelector(selectVisibleArt)

  // what is currently typed into the form, so we can point out a piece
  // that looks like the one being added
  const name = useSelector((state) => state.form.name)

  if (visible.length === 0) {
    return (
      <section className="border-b-4 border-ink p-5">
        <p className="text-sm">Nothing to show.</p>
      </section>
    )
  }

  return (
    <ul className="border-b-4 border-ink">
      {visible.map((art) => {
        // Worked out while rendering. NOT stored on the art object, and
        // not a third slice. It is a fact about right now.
        const isPossibleDuplicate =
          name.trim() !== '' &&
          art.name.toLowerCase().includes(name.trim().toLowerCase())

        return (
          <li
            key={art.id}
            className={`flex items-center justify-between gap-3 border-b-4 border-ink px-5 py-3 last:border-b-0 ${
              isPossibleDuplicate ? 'bg-flat-yellow' : ''
            }`}
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

## Step 9: What is still missing, and the exercise

Nothing to type.

The app works, and **every single action in it finishes instantly**. Dispatch, the reducer runs, the state is new, the screen updates. All of it is synchronous.

Real apps wait. Your midterm waited on `json-server` for every one of its four operations, and waiting brings three problems with it:

- it takes **time**, so something has to say it is loading
- it can **fail**, so something has to say so
- the result **arrives later**, so the reducer cannot be where the waiting happens

Redux's answer is built on exactly what you learned in step 7. A request that starts, succeeds, or fails is **three actions**, and you respond to each one with `builder.addCase`. The mechanism is already familiar. Only the names are new.

That is next.

### In-class exercise

**Ten minutes.** A **count** of the visible pieces, next to the total: "4 pieces, $1,250".

Do it as a selector, in the slice, composed from `selectVisibleArt`. It is three lines, and if you find yourself adding anything to `initialState`, stop and think again.

If you finish: sort the list by price, highest first. Ask yourself whether the sort order is state or not, and be ready to argue either way.

---

**Where we landed:** a working app, two slices, and not one piece of duplicated state.

**Derived state, four times over:**

- the **filtered list** is `data` plus `searchTerm`
- the **total** is the filtered list added up
- the **highlight** is a comparison against what is in the form
- none of the three is in the store, so none of them can be wrong

**Selectors:**

- a selector is a function that answers a question about the store
- it lives **next to the slice that owns the data**, so the shape of the state is known in one file
- **`createSelector`** remembers its last answer and only recalculates when its inputs change
- selectors **compose**: `selectTotalValue` takes `selectVisibleArt` as its input

**`extraReducers`:**

- lets a slice respond to an action it does not own
- `builder.addCase(someAction, (state, action) => {})`
- one dispatch, several slices, each updating its own branch

**Next:** every action we have written finishes instantly. Real apps wait for a server, which can be slow and can fail. Redux has an answer, it is built on `extraReducers`, and it is where we go next.

**Homework:** see [HW.md](HW.md).
