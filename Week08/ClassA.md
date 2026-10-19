# Week 08 — useReducer

*Replacing a cluster of useState calls with one reducer · ~110 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

A new project today, and a small one: a counter.

That is not because counters are interesting. It is because the thing we are learning is a *shape* for managing state, and the shape is hard to see inside an app that is also talking to a server.

We will build the counter with `useState` — which you already know — until it is slightly annoying. Then we will rebuild it with **`useReducer`**, which is the hook you reach for when several pieces of state belong together and keep changing together.

`useReducer` is also the idea behind **Redux**, which you will meet in job listings and in other people's codebases. Learn it here, in thirty lines, and Redux is a library rather than a mystery.

**None of this is required for the midterm.** Today is about the next thing.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [A new project](#step-1)
2. [The counter, the way you already know](#step-2)
3. [Add a number of your choosing](#step-3)
4. [What is actually wrong with this](#step-4)
5. [Swap it in, and break everything](#step-5)
6. [Telling the reducer why](#step-6)
7. [In-class exercise — the other two](#step-7)
8. [Refactor 1 — constants for the types](#step-8)
9. [Refactor 2 — switch](#step-9)
10. [The rules](#step-10)
11. [Immer, briefly and honestly](#step-11)
12. [What this looks like on something real](#step-12)
13. [So which hook do I use?](#step-13)

---

<a id="step-1"></a>

## Step 1 — A new project

Nothing from last class today. A fresh Vite app, Tailwind, and one component.

Delete what Vite scaffolds in `src` — `App.css`, the logo assets, and everything inside `App.jsx` — then make the four files below. The only unusual line is `initialCount={10}`: our starting number arrives from outside the component, which will matter in a few steps.

```bash
cd ~/your-hw-repo
npm create vite@latest week08-counter -- --template react
cd week08-counter
npm install
npm install -D tailwindcss @tailwindcss/vite
npm run dev
```

**`package.json`**  — new file

```
{
  "name": "counter-reducer",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.0",
    "@vitejs/plugin-react": "^4.3.4",
    "tailwindcss": "^4.1.0",
    "vite": "^6.0.7"
  }
}
```

**`vite.config.js`**  — new file

```js
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**`index.html`**  — new file

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Counter</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**`src/index.css`**  — new file

```css
@import 'tailwindcss';
```

**`src/main.jsx`**  — new file

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

**`src/App.jsx`**  — new file

```jsx
import CounterPage from './components/CounterPage'

const App = () => {
  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Counter</h1>
      {/* the starting number arrives as a prop -- which matters later, when
          our state has to be initialised from outside the component */}
      <CounterPage initialCount={10} />
    </div>
  )
}

export default App
```

**`src/components/CounterPage.jsx`**  — new file

```jsx
const CounterPage = (props) => {
  const {initialCount} = props

  return (
    <div>
      <p className="text-5xl font-bold tabular-nums mb-4">{initialCount}</p>
    </div>
  )
}

export default CounterPage
```

---

<a id="step-2"></a>

## Step 2 — The counter, the way you already know

`useState`, one value, two handlers. This should feel like revision — if it does not, say so now rather than in week twelve.

Three things worth saying out loud as you type them:

- `useState(initialCount)` — the initial value can be a prop. React uses it **once**, on the first render, and ignores it afterwards.
- `setCount(count + 1)` — the new value is worked out from the current one. Remember that sentence.
- `tabular-nums` — a Tailwind class that gives you fixed-width digits, so the number does not jiggle as it changes. Nothing to do with React; everything to do with not being annoying.

**`src/components/CounterPage.jsx`**

What changed:

```diff
@@ -1,8 +1,34 @@
+import {useState} from 'react'
+
 const CounterPage = (props) => {
   const {initialCount} = props
+  const [count, setCount] = useState(initialCount)
+
+  const increment = () => {
+    setCount(count + 1)
+  }
+
+  const decrement = () => {
+    setCount(count - 1)
+  }
 
   return (
     <div>
-      <p className="text-5xl font-bold tabular-nums mb-4">{initialCount}</p>
+      <p className="text-5xl font-bold tabular-nums mb-4">{count}</p>
+
+      <div className="flex gap-2">
+        <button
+          onClick={increment}
+          className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
+        >
+          +1
+        </button>
+        <button
+          onClick={decrement}
+          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
+        >
+          -1
+        </button>
+      </div>
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'

const CounterPage = (props) => {
  const {initialCount} = props
  const [count, setCount] = useState(initialCount)

  const increment = () => {
    setCount(count + 1)
  }

  const decrement = () => {
    setCount(count - 1)
  }

  return (
    <div>
      <p className="text-5xl font-bold tabular-nums mb-4">{count}</p>

      <div className="flex gap-2">
        <button
          onClick={increment}
          className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
        >
          +1
        </button>
        <button
          onClick={decrement}
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          -1
        </button>
      </div>
    </div>
  )
}

export default CounterPage
```

</details>

---

<a id="step-3"></a>

## Step 3 — Add a number of your choosing

A second piece of state, and a form.

Two lines in here are worth more than the rest of the file:

```jsx
const value = parseInt(event.target.value) || 0
```

Everything that comes out of an input is a **string** — even from `type="number"`. `parseInt` makes it a number, and an empty field gives `''`, which `parseInt` reads as `NaN`. `|| 0` catches that. Without it, one backspace turns your count into `NaN` and it never comes back.

```jsx
value={valueToAdd || ''}
```

A controlled input needs a `value`. But if that value is the number `0`, the field shows a `0` that the user has to delete before typing. `|| ''` shows an empty field instead.

And `event.preventDefault()` in `handleSubmit`, because the browser's instinct is to reload the page.

**`src/components/CounterPage.jsx`**

What changed:

```diff
@@ -4,4 +4,5 @@
   const {initialCount} = props
   const [count, setCount] = useState(initialCount)
+  const [valueToAdd, setValueToAdd] = useState(0)
 
   const increment = () => {
@@ -11,4 +12,18 @@
   const decrement = () => {
     setCount(count - 1)
+  }
+
+  const handleChange = (event) => {
+    // every value out of an input is a STRING. parseInt turns it into a
+    // number, and an empty input gives '' -- which parseInt reads as NaN.
+    // `|| 0` catches that, so valueToAdd is always a usable number.
+    const value = parseInt(event.target.value) || 0
+    setValueToAdd(value)
+  }
+
+  const handleSubmit = (event) => {
+    event.preventDefault()
+    setCount(count + valueToAdd)
+    setValueToAdd(0)
   }
 
@@ -31,4 +46,24 @@
         </button>
       </div>
+
+      <form onSubmit={handleSubmit} className="mt-8 flex items-end gap-2">
+        <div>
+          <label className="block text-sm text-gray-600" htmlFor="add">
+            Add a number
+          </label>
+          {/* valueToAdd || '' -- otherwise the field shows a 0 the user has
+              to delete before they can type anything */}
+          <input
+            id="add"
+            type="number"
+            value={valueToAdd || ''}
+            onChange={handleChange}
+            className="mt-1 w-24 rounded border border-gray-300 px-3 py-2"
+          />
+        </div>
+        <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
+          Add it
+        </button>
+      </form>
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'

const CounterPage = (props) => {
  const {initialCount} = props
  const [count, setCount] = useState(initialCount)
  const [valueToAdd, setValueToAdd] = useState(0)

  const increment = () => {
    setCount(count + 1)
  }

  const decrement = () => {
    setCount(count - 1)
  }

  const handleChange = (event) => {
    // every value out of an input is a STRING. parseInt turns it into a
    // number, and an empty input gives '' -- which parseInt reads as NaN.
    // `|| 0` catches that, so valueToAdd is always a usable number.
    const value = parseInt(event.target.value) || 0
    setValueToAdd(value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setCount(count + valueToAdd)
    setValueToAdd(0)
  }

  return (
    <div>
      <p className="text-5xl font-bold tabular-nums mb-4">{count}</p>

      <div className="flex gap-2">
        <button
          onClick={increment}
          className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
        >
          +1
        </button>
        <button
          onClick={decrement}
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          -1
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex items-end gap-2">
        <div>
          <label className="block text-sm text-gray-600" htmlFor="add">
            Add a number
          </label>
          {/* valueToAdd || '' -- otherwise the field shows a 0 the user has
              to delete before they can type anything */}
          <input
            id="add"
            type="number"
            value={valueToAdd || ''}
            onChange={handleChange}
            className="mt-1 w-24 rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
          Add it
        </button>
      </form>
    </div>
  )
}

export default CounterPage
```

</details>

---

<a id="step-4"></a>

## Step 4 — What is actually wrong with this

Nothing to type. Look at the file we just wrote and count:

- **two pieces of state** that are not independent. `valueToAdd` exists only to change `count`.
- **four handlers**, between them calling three setters.
- **one handler that calls two setters** — `handleSubmit` does `setCount` and then `setValueToAdd`, and it has to do both for the app to be correct.
- **every update reads the current state**: `count + 1`, `count + valueToAdd`.

At this size, all of that is fine. Now imagine the thing you are actually going to build: eight pieces of state that move in groups, twelve handlers, and a bug that is "somewhere in the setters".

`useReducer` answers exactly this. It gives you **one state object** and **one place** where every change to it is written down.

---

<a id="step-5"></a>

## Step 5 — Swap it in, and break everything

Three changes, all mechanical:

1. `useState` becomes **`useReducer(reducer, initialState)`**, which hands back `[state, dispatch]`.
2. Our initial state is **one object**: `{count: initialCount, valueToAdd: 0}`.
3. Every `count` in the JSX becomes `state.count`, and every `valueToAdd` becomes `state.valueToAdd`.

The reducer is a **plain function**, written outside the component. It takes the current state, and it returns the next state. Ours always increments, which is wrong on purpose.

Every handler now calls `dispatch()` with no argument at all. **Save it and click everything.** Both buttons increment. Submitting increments. *Typing in the input increments.*

That is the one thing to take from this step: **calling `dispatch` runs the reducer.** Nothing else. And with no argument, `action` simply arrives as `undefined` — which is allowed, and about to become useful.

**`src/components/CounterPage.jsx`**

What changed:

```diff
@@ -1,34 +1,46 @@
-import {useState} from 'react'
+import {useReducer} from 'react'
+
+// A reducer is a plain function. It takes the current state and an action,
+// and RETURNS THE NEXT STATE. It is not allowed to change the state it was
+// given -- we always build and return a new object.
+const reducer = (state, action) => {
+  return {
+    ...state,
+    count: state.count + 1,
+  }
+}
 
 const CounterPage = (props) => {
   const {initialCount} = props
-  const [count, setCount] = useState(initialCount)
-  const [valueToAdd, setValueToAdd] = useState(0)
+
+  // one call instead of two. `state` is an object holding both values,
+  // `dispatch` is the one function that asks for a change.
+  const [state, dispatch] = useReducer(reducer, {
+    count: initialCount,
+    valueToAdd: 0,
+  })
 
   const increment = () => {
-    setCount(count + 1)
+    // calling dispatch runs our reducer. We are not passing an argument yet,
+    // so `action` arrives as undefined. That is fine for the moment.
+    dispatch()
   }
 
   const decrement = () => {
-    setCount(count - 1)
+    dispatch()
   }
 
   const handleChange = (event) => {
-    // every value out of an input is a STRING. parseInt turns it into a
-    // number, and an empty input gives '' -- which parseInt reads as NaN.
-    // `|| 0` catches that, so valueToAdd is always a usable number.
-    const value = parseInt(event.target.value) || 0
-    setValueToAdd(value)
+    dispatch()
   }
 
   const handleSubmit = (event) => {
     event.preventDefault()
-    setCount(count + valueToAdd)
-    setValueToAdd(0)
+    dispatch()
   }
 
   return (
     <div>
-      <p className="text-5xl font-bold tabular-nums mb-4">{count}</p>
+      <p className="text-5xl font-bold tabular-nums mb-4">{state.count}</p>
 
       <div className="flex gap-2">
@@ -52,10 +64,8 @@
             Add a number
           </label>
-          {/* valueToAdd || '' -- otherwise the field shows a 0 the user has
-              to delete before they can type anything */}
           <input
             id="add"
             type="number"
-            value={valueToAdd || ''}
+            value={state.valueToAdd || ''}
             onChange={handleChange}
             className="mt-1 w-24 rounded border border-gray-300 px-3 py-2"
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useReducer} from 'react'

// A reducer is a plain function. It takes the current state and an action,
// and RETURNS THE NEXT STATE. It is not allowed to change the state it was
// given -- we always build and return a new object.
const reducer = (state, action) => {
  return {
    ...state,
    count: state.count + 1,
  }
}

const CounterPage = (props) => {
  const {initialCount} = props

  // one call instead of two. `state` is an object holding both values,
  // `dispatch` is the one function that asks for a change.
  const [state, dispatch] = useReducer(reducer, {
    count: initialCount,
    valueToAdd: 0,
  })

  const increment = () => {
    // calling dispatch runs our reducer. We are not passing an argument yet,
    // so `action` arrives as undefined. That is fine for the moment.
    dispatch()
  }

  const decrement = () => {
    dispatch()
  }

  const handleChange = (event) => {
    dispatch()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch()
  }

  return (
    <div>
      <p className="text-5xl font-bold tabular-nums mb-4">{state.count}</p>

      <div className="flex gap-2">
        <button
          onClick={increment}
          className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
        >
          +1
        </button>
        <button
          onClick={decrement}
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          -1
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex items-end gap-2">
        <div>
          <label className="block text-sm text-gray-600" htmlFor="add">
            Add a number
          </label>
          <input
            id="add"
            type="number"
            value={state.valueToAdd || ''}
            onChange={handleChange}
            className="mt-1 w-24 rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
          Add it
        </button>
      </form>
    </div>
  )
}

export default CounterPage
```

</details>

---

<a id="step-6"></a>

## Step 6 — Telling the reducer why

The reducer needs to know *why* it is running. The convention — and it is only a convention, but it is universal:

- always dispatch an **object**
- that object always has a **`type`**, saying what happened
- any data the update needs rides along as **`payload`**

```jsx
dispatch({type: 'increment-count'})
dispatch({type: 'set-value-to-add', payload: value})
```

Inside the reducer, a chain of `if` statements on `action.type`. We will fix two handlers now — `increment` and `handleChange` — and leave the other two for you.

One line matters more than it looks:

```jsx
return state
```

at the bottom. If no condition matched, hand back the state untouched. Delete that line and the reducer returns `undefined`, which becomes your entire state, and the app dies with `Cannot read properties of undefined`.

**`src/components/CounterPage.jsx`**

What changed:

```diff
@@ -1,12 +1,24 @@
 import {useReducer} from 'react'
 
-// A reducer is a plain function. It takes the current state and an action,
-// and RETURNS THE NEXT STATE. It is not allowed to change the state it was
-// given -- we always build and return a new object.
 const reducer = (state, action) => {
-  return {
-    ...state,
-    count: state.count + 1,
+  // action.type says WHY the reducer is running.
+  if (action.type === 'increment-count') {
+    return {
+      ...state,
+      count: state.count + 1,
+    }
   }
+
+  // action.payload carries any DATA the update needs.
+  if (action.type === 'set-value-to-add') {
+    return {
+      ...state,
+      valueToAdd: action.payload,
+    }
+  }
+
+  // if none of the conditions matched, hand back the state unchanged.
+  // Returning nothing here would set our whole state to undefined.
+  return state
 }
 
@@ -14,6 +26,4 @@
   const {initialCount} = props
 
-  // one call instead of two. `state` is an object holding both values,
-  // `dispatch` is the one function that asks for a change.
   const [state, dispatch] = useReducer(reducer, {
     count: initialCount,
@@ -22,7 +32,7 @@
 
   const increment = () => {
-    // calling dispatch runs our reducer. We are not passing an argument yet,
-    // so `action` arrives as undefined. That is fine for the moment.
-    dispatch()
+    dispatch({
+      type: 'increment-count',
+    })
   }
 
@@ -32,5 +42,9 @@
 
   const handleChange = (event) => {
-    dispatch()
+    const value = parseInt(event.target.value) || 0
+    dispatch({
+      type: 'set-value-to-add',
+      payload: value,
+    })
   }
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useReducer} from 'react'

const reducer = (state, action) => {
  // action.type says WHY the reducer is running.
  if (action.type === 'increment-count') {
    return {
      ...state,
      count: state.count + 1,
    }
  }

  // action.payload carries any DATA the update needs.
  if (action.type === 'set-value-to-add') {
    return {
      ...state,
      valueToAdd: action.payload,
    }
  }

  // if none of the conditions matched, hand back the state unchanged.
  // Returning nothing here would set our whole state to undefined.
  return state
}

const CounterPage = (props) => {
  const {initialCount} = props

  const [state, dispatch] = useReducer(reducer, {
    count: initialCount,
    valueToAdd: 0,
  })

  const increment = () => {
    dispatch({
      type: 'increment-count',
    })
  }

  const decrement = () => {
    dispatch()
  }

  const handleChange = (event) => {
    const value = parseInt(event.target.value) || 0
    dispatch({
      type: 'set-value-to-add',
      payload: value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch()
  }

  return (
    <div>
      <p className="text-5xl font-bold tabular-nums mb-4">{state.count}</p>

      <div className="flex gap-2">
        <button
          onClick={increment}
          className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
        >
          +1
        </button>
        <button
          onClick={decrement}
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          -1
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex items-end gap-2">
        <div>
          <label className="block text-sm text-gray-600" htmlFor="add">
            Add a number
          </label>
          <input
            id="add"
            type="number"
            value={state.valueToAdd || ''}
            onChange={handleChange}
            className="mt-1 w-24 rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
          Add it
        </button>
      </form>
    </div>
  )
}

export default CounterPage
```

</details>

---

<a id="step-7"></a>

## Step 7 — In-class exercise — the other two

**Four minutes.** Add the cases for `decrement` and `handleSubmit`, and point those two handlers at them. Pick your own type names; `decrement-count` and `add-value-to-count` are what I used.

Then come back for the interesting one. `add-value-to-count` changes **two pieces of state at once**, and works the new count out from both current values:

```jsx
return {
  ...state,
  count: state.count + state.valueToAdd,
  valueToAdd: 0,
}
```

Compare that to the `useState` version, which was two separate setter calls that both had to happen. Here it is one action, one object, one update. Nothing to get in the wrong order and nothing to forget.

**A fair question:** why spread `...state` in that last case, when we overwrite both properties anyway? Because today there are two. When there are six, the one you did not think about is the one that silently disappears. Spread first, always.

**`src/components/CounterPage.jsx`**

What changed:

```diff
@@ -2,5 +2,4 @@
 
 const reducer = (state, action) => {
-  // action.type says WHY the reducer is running.
   if (action.type === 'increment-count') {
     return {
@@ -10,5 +9,11 @@
   }
 
-  // action.payload carries any DATA the update needs.
+  if (action.type === 'decrement-count') {
+    return {
+      ...state,
+      count: state.count - 1,
+    }
+  }
+
   if (action.type === 'set-value-to-add') {
     return {
@@ -18,6 +23,15 @@
   }
 
-  // if none of the conditions matched, hand back the state unchanged.
-  // Returning nothing here would set our whole state to undefined.
+  // the interesting one: TWO pieces of state change together, and the new
+  // count is worked out from the current count and the current valueToAdd.
+  // One action, one update, no ordering to get wrong.
+  if (action.type === 'add-value-to-count') {
+    return {
+      ...state,
+      count: state.count + state.valueToAdd,
+      valueToAdd: 0,
+    }
+  }
+
   return state
 }
@@ -38,5 +52,7 @@
 
   const decrement = () => {
-    dispatch()
+    dispatch({
+      type: 'decrement-count',
+    })
   }
 
@@ -51,5 +67,7 @@
   const handleSubmit = (event) => {
     event.preventDefault()
-    dispatch()
+    dispatch({
+      type: 'add-value-to-count',
+    })
   }
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useReducer} from 'react'

const reducer = (state, action) => {
  if (action.type === 'increment-count') {
    return {
      ...state,
      count: state.count + 1,
    }
  }

  if (action.type === 'decrement-count') {
    return {
      ...state,
      count: state.count - 1,
    }
  }

  if (action.type === 'set-value-to-add') {
    return {
      ...state,
      valueToAdd: action.payload,
    }
  }

  // the interesting one: TWO pieces of state change together, and the new
  // count is worked out from the current count and the current valueToAdd.
  // One action, one update, no ordering to get wrong.
  if (action.type === 'add-value-to-count') {
    return {
      ...state,
      count: state.count + state.valueToAdd,
      valueToAdd: 0,
    }
  }

  return state
}

const CounterPage = (props) => {
  const {initialCount} = props

  const [state, dispatch] = useReducer(reducer, {
    count: initialCount,
    valueToAdd: 0,
  })

  const increment = () => {
    dispatch({
      type: 'increment-count',
    })
  }

  const decrement = () => {
    dispatch({
      type: 'decrement-count',
    })
  }

  const handleChange = (event) => {
    const value = parseInt(event.target.value) || 0
    dispatch({
      type: 'set-value-to-add',
      payload: value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch({
      type: 'add-value-to-count',
    })
  }

  return (
    <div>
      <p className="text-5xl font-bold tabular-nums mb-4">{state.count}</p>

      <div className="flex gap-2">
        <button
          onClick={increment}
          className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
        >
          +1
        </button>
        <button
          onClick={decrement}
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          -1
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex items-end gap-2">
        <div>
          <label className="block text-sm text-gray-600" htmlFor="add">
            Add a number
          </label>
          <input
            id="add"
            type="number"
            value={state.valueToAdd || ''}
            onChange={handleChange}
            className="mt-1 w-24 rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
          Add it
        </button>
      </form>
    </div>
  )
}

export default CounterPage
```

</details>

---

<a id="step-8"></a>

## Step 8 — Refactor 1 — constants for the types

Our action types are strings scattered across the file, and strings are unforgiving. Misspell one in a `dispatch` and nothing happens: no case matches, the reducer returns `state`, the app carries on working except for that one button. No error, nothing in the console, ten minutes gone.

Pull them out into constants:

```jsx
const INCREMENT_COUNT = 'increment-count'
```

Now a typo is a **variable name that does not exist**, and JavaScript tells you so, with a line number.

`ALL_CAPS` is the convention. It carries no meaning to the language — it is a message to the next developer that this is an action type. You will see exactly this in any Redux codebase you ever open.

**`src/components/CounterPage.jsx`**

What changed:

```diff
@@ -1,6 +1,14 @@
 import {useReducer} from 'react'
 
+// Action types as constants. A misspelled STRING fails silently; a misspelled
+// VARIABLE NAME throws an error that points at the line. ALL_CAPS is the
+// convention -- it tells another developer "this is an action type".
+const INCREMENT_COUNT = 'increment-count'
+const DECREMENT_COUNT = 'decrement-count'
+const SET_VALUE_TO_ADD = 'set-value-to-add'
+const ADD_VALUE_TO_COUNT = 'add-value-to-count'
+
 const reducer = (state, action) => {
-  if (action.type === 'increment-count') {
+  if (action.type === INCREMENT_COUNT) {
     return {
       ...state,
@@ -9,5 +17,5 @@
   }
 
-  if (action.type === 'decrement-count') {
+  if (action.type === DECREMENT_COUNT) {
     return {
       ...state,
@@ -16,5 +24,5 @@
   }
 
-  if (action.type === 'set-value-to-add') {
+  if (action.type === SET_VALUE_TO_ADD) {
     return {
       ...state,
@@ -23,8 +31,5 @@
   }
 
-  // the interesting one: TWO pieces of state change together, and the new
-  // count is worked out from the current count and the current valueToAdd.
-  // One action, one update, no ordering to get wrong.
-  if (action.type === 'add-value-to-count') {
+  if (action.type === ADD_VALUE_TO_COUNT) {
     return {
       ...state,
@@ -47,5 +52,5 @@
   const increment = () => {
     dispatch({
-      type: 'increment-count',
+      type: INCREMENT_COUNT,
     })
   }
@@ -53,5 +58,5 @@
   const decrement = () => {
     dispatch({
-      type: 'decrement-count',
+      type: DECREMENT_COUNT,
     })
   }
@@ -60,5 +65,5 @@
     const value = parseInt(event.target.value) || 0
     dispatch({
-      type: 'set-value-to-add',
+      type: SET_VALUE_TO_ADD,
       payload: value,
     })
@@ -68,5 +73,5 @@
     event.preventDefault()
     dispatch({
-      type: 'add-value-to-count',
+      type: ADD_VALUE_TO_COUNT,
     })
   }
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useReducer} from 'react'

// Action types as constants. A misspelled STRING fails silently; a misspelled
// VARIABLE NAME throws an error that points at the line. ALL_CAPS is the
// convention -- it tells another developer "this is an action type".
const INCREMENT_COUNT = 'increment-count'
const DECREMENT_COUNT = 'decrement-count'
const SET_VALUE_TO_ADD = 'set-value-to-add'
const ADD_VALUE_TO_COUNT = 'add-value-to-count'

const reducer = (state, action) => {
  if (action.type === INCREMENT_COUNT) {
    return {
      ...state,
      count: state.count + 1,
    }
  }

  if (action.type === DECREMENT_COUNT) {
    return {
      ...state,
      count: state.count - 1,
    }
  }

  if (action.type === SET_VALUE_TO_ADD) {
    return {
      ...state,
      valueToAdd: action.payload,
    }
  }

  if (action.type === ADD_VALUE_TO_COUNT) {
    return {
      ...state,
      count: state.count + state.valueToAdd,
      valueToAdd: 0,
    }
  }

  return state
}

const CounterPage = (props) => {
  const {initialCount} = props

  const [state, dispatch] = useReducer(reducer, {
    count: initialCount,
    valueToAdd: 0,
  })

  const increment = () => {
    dispatch({
      type: INCREMENT_COUNT,
    })
  }

  const decrement = () => {
    dispatch({
      type: DECREMENT_COUNT,
    })
  }

  const handleChange = (event) => {
    const value = parseInt(event.target.value) || 0
    dispatch({
      type: SET_VALUE_TO_ADD,
      payload: value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch({
      type: ADD_VALUE_TO_COUNT,
    })
  }

  return (
    <div>
      <p className="text-5xl font-bold tabular-nums mb-4">{state.count}</p>

      <div className="flex gap-2">
        <button
          onClick={increment}
          className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
        >
          +1
        </button>
        <button
          onClick={decrement}
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          -1
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex items-end gap-2">
        <div>
          <label className="block text-sm text-gray-600" htmlFor="add">
            Add a number
          </label>
          <input
            id="add"
            type="number"
            value={state.valueToAdd || ''}
            onChange={handleChange}
            className="mt-1 w-24 rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
          Add it
        </button>
      </form>
    </div>
  )
}

export default CounterPage
```

</details>

---

<a id="step-9"></a>

## Step 9 — Refactor 2 — switch

Four `if` statements that all ask about the same property is what `switch` is for. Same logic, less noise, and it is the form you will see everywhere:

```jsx
switch (action.type) {
  case INCREMENT_COUNT:
    return {...}

  default:
    return state
}
```

**`default: return state`** is the `return state` from before, in its proper place. Every reducer ends this way.

No `break` statements, because every case **returns** — which leaves the function immediately. If you ever write a case that does not return, the code will fall through into the next one and you will have an afternoon.

This is the finished shape. Click everything one more time: the app does exactly what it did twenty minutes ago.

**`src/components/CounterPage.jsx`**

What changed:

```diff
@@ -1,7 +1,4 @@
 import {useReducer} from 'react'
 
-// Action types as constants. A misspelled STRING fails silently; a misspelled
-// VARIABLE NAME throws an error that points at the line. ALL_CAPS is the
-// convention -- it tells another developer "this is an action type".
 const INCREMENT_COUNT = 'increment-count'
 const DECREMENT_COUNT = 'decrement-count'
@@ -10,34 +7,34 @@
 
 const reducer = (state, action) => {
-  if (action.type === INCREMENT_COUNT) {
-    return {
-      ...state,
-      count: state.count + 1,
-    }
+  switch (action.type) {
+    case INCREMENT_COUNT:
+      return {
+        ...state,
+        count: state.count + 1,
+      }
+
+    case DECREMENT_COUNT:
+      return {
+        ...state,
+        count: state.count - 1,
+      }
+
+    case SET_VALUE_TO_ADD:
+      return {
+        ...state,
+        valueToAdd: action.payload,
+      }
+
+    case ADD_VALUE_TO_COUNT:
+      return {
+        ...state,
+        count: state.count + state.valueToAdd,
+        valueToAdd: 0,
+      }
+
+    // every switch needs a default, and ours returns the state untouched
+    default:
+      return state
   }
-
-  if (action.type === DECREMENT_COUNT) {
-    return {
-      ...state,
-      count: state.count - 1,
-    }
-  }
-
-  if (action.type === SET_VALUE_TO_ADD) {
-    return {
-      ...state,
-      valueToAdd: action.payload,
-    }
-  }
-
-  if (action.type === ADD_VALUE_TO_COUNT) {
-    return {
-      ...state,
-      count: state.count + state.valueToAdd,
-      valueToAdd: 0,
-    }
-  }
-
-  return state
 }
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useReducer} from 'react'

const INCREMENT_COUNT = 'increment-count'
const DECREMENT_COUNT = 'decrement-count'
const SET_VALUE_TO_ADD = 'set-value-to-add'
const ADD_VALUE_TO_COUNT = 'add-value-to-count'

const reducer = (state, action) => {
  switch (action.type) {
    case INCREMENT_COUNT:
      return {
        ...state,
        count: state.count + 1,
      }

    case DECREMENT_COUNT:
      return {
        ...state,
        count: state.count - 1,
      }

    case SET_VALUE_TO_ADD:
      return {
        ...state,
        valueToAdd: action.payload,
      }

    case ADD_VALUE_TO_COUNT:
      return {
        ...state,
        count: state.count + state.valueToAdd,
        valueToAdd: 0,
      }

    // every switch needs a default, and ours returns the state untouched
    default:
      return state
  }
}

const CounterPage = (props) => {
  const {initialCount} = props

  const [state, dispatch] = useReducer(reducer, {
    count: initialCount,
    valueToAdd: 0,
  })

  const increment = () => {
    dispatch({
      type: INCREMENT_COUNT,
    })
  }

  const decrement = () => {
    dispatch({
      type: DECREMENT_COUNT,
    })
  }

  const handleChange = (event) => {
    const value = parseInt(event.target.value) || 0
    dispatch({
      type: SET_VALUE_TO_ADD,
      payload: value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch({
      type: ADD_VALUE_TO_COUNT,
    })
  }

  return (
    <div>
      <p className="text-5xl font-bold tabular-nums mb-4">{state.count}</p>

      <div className="flex gap-2">
        <button
          onClick={increment}
          className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
        >
          +1
        </button>
        <button
          onClick={decrement}
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
        >
          -1
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex items-end gap-2">
        <div>
          <label className="block text-sm text-gray-600" htmlFor="add">
            Add a number
          </label>
          <input
            id="add"
            type="number"
            value={state.valueToAdd || ''}
            onChange={handleChange}
            className="mt-1 w-24 rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
          Add it
        </button>
      </form>
    </div>
  )
}

export default CounterPage
```

</details>

---

<a id="step-10"></a>

## Step 10 — The rules

Nothing to type. Four rules, and every one of them is a bug somebody has shipped.

**1. Never change the state you were given.**

```jsx
// BAD -- mutating state
const reducer = (state, action) => {
  state.count = state.count + 1
  return state
}

// GOOD -- a new object
const reducer = (state, action) => {
  return {...state, count: state.count + 1}
}
```

The bad version sometimes appears to work, which is what makes it dangerous. React decides whether to re-render by asking "is this a different object than last time?" Mutate the old one and the answer is no, and your screen does not update.

**2. Always return the next state.** No return, no state — `undefined`, and the whole component falls over.

**3. Spread first, then change.** `{...state, count: ...}`. The property you forgot is the property you lose.

**4. A reducer does nothing but compute.** No `async`, no `await`, no `fetch` or axios, no promises, no `Math.random()`, no reading variables from outside. Same state and same action in, same state out, every time.

Rule 4 raises the obvious question: **where does the fetching go, then?** In the handler, as it always has. You `await` the request, and *then* dispatch with the result as the payload.

---

<a id="step-11"></a>

## Step 11 — Immer, briefly and honestly

Writing `{...state}` over and over is tedious, and there is a library that lets you skip it. It is called **Immer**, and you should know three things about it: it is real, it is common in Redux codebases, and **you probably will not use it this semester**. You still need to be able to update state properly without it.

Immer wraps your reducer in a `produce` function. Inside, you are allowed to mutate state directly — it tracks what you touched and builds the new object for you.

```jsx
import {produce} from 'immer'

const [state, dispatch] = useReducer(produce(reducer), {
  count: initialCount,
  valueToAdd: 0,
})
```

```jsx
const reducer = (state, action) => {
  switch (action.type) {
    case INCREMENT_COUNT:
      state.count = state.count + 1
      return

    case ADD_VALUE_TO_COUNT:
      state.count = state.count + state.valueToAdd
      state.valueToAdd = 0
      return

    default:
      return
  }
}
```

Note what changed: you mutate, and you **return nothing** — but you still need a `return` in every case, or JavaScript runs on into the cases below it.

**Do not install this today.** It is here so that the first time you meet a reducer that mutates state, you know it is a library and not a mistake.

```bash
# only if you want to try it at home
npm install immer
```

---

<a id="step-12"></a>

## Step 12 — What this looks like on something real

**Read this one, do not type it.** Open `Week07/end-of-class/todo-list-V3/src/context/todos.jsx` from the class repo. The top of the Provider is three `useState` calls:

```jsx
const [todos, setTodos] = useState([])
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState(null)
```

Those three are not independent. A fetch starting sets loading true and clears the error. A fetch succeeding sets the todos, clears loading, clears the error. A fetch failing sets the error and clears loading. **Three values, one event, every time** — which is precisely the signal from step 4.

As a reducer:

```jsx
const FETCH_START = 'fetch-start'
const FETCH_SUCCESS = 'fetch-success'
const FETCH_ERROR = 'fetch-error'

const reducer = (state, action) => {
  switch (action.type) {
    case FETCH_START:
      return {...state, isLoading: true, error: null}

    case FETCH_SUCCESS:
      return {
        ...state,
        todos: action.payload,
        isLoading: false,
        error: null,
      }

    case FETCH_ERROR:
      return {...state, isLoading: false, error: action.payload}

    default:
      return state
  }
}
```

And the fetch — note that the `await` is in the handler, never in the reducer:

```jsx
const fetchTodos = useCallback(async () => {
  dispatch({type: FETCH_START})
  try {
    const todos = await fetchTodosRequest()
    dispatch({type: FETCH_SUCCESS, payload: todos})
  } catch (err) {
    dispatch({
      type: FETCH_ERROR,
      payload: 'Could not reach the server. Is `npm run server` running?',
    })
  }
}, [])
```

Three states that always moved together, now described in one place, in the words of what happened. That is what the pattern buys you.

**This is not a midterm requirement.** Your V3 is correct as it stands.

---

<a id="step-13"></a>

## Step 13 — So which hook do I use?

The only part of today worth memorising.

**Reach for `useState` when** the value is on its own: a text input, an open/closed flag, a selected tab. Most state is this. `useState` is not a beginner's version of `useReducer`.

**Reach for `useReducer` when** one of these is true:

- several pieces of state **always change together**
- the next state is **worked out from the current state**
- the same combination of updates happens from **several different places**
- you want **one file you can read** to know every way this state can change

**What they have in common:** both store a value across renders, both trigger a re-render when it changes, both are local to the component that calls them, and both can be shared through Context — which is exactly how Redux works.

**And one honest warning:** a reducer for a single boolean is thirty lines of ceremony around `setIsOpen(!isOpen)`. The pattern earns its keep at a certain size and not before.

---

**Where we landed:** the same counter we built in the first twenty minutes, with one state object, one reducer, and four named actions.

**The shape, every time:**

1. **a reducer** — `(state, action) => newState`. A plain function, outside the component.
2. **`useReducer(reducer, initialState)`** — gives you back `[state, dispatch]`.
3. **`dispatch({type, payload})`** — the only way state changes. `type` says why, `payload` carries the data.
4. **a `switch` on `action.type`** with a `default` that returns `state` untouched.

**The four rules a reducer must obey:**

- **Never change `state` itself.** Build a new object: `{...state, count: state.count + 1}`.
- **Always return state.** Returning nothing sets your entire state to `undefined`.
- **Always spread first.** `{...state}` then your changes, so a property you are not thinking about does not vanish.
- **No `async`, no `await`, no requests, no promises, nothing from outside.** Current state in, next state out, same answer every time.

**Homework:** see [HW.md](HW.md).

Thursday: forms properly — every input type, validation, and the errors your users actually see.
