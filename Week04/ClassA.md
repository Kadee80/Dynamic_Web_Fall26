# Week 04 — Routes, and a Dropdown that listens

*React Router, then a Dropdown with useRef and useEffect · ~95 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

Our component library is one long page with everything stacked on it. Today each component gets its own url with **React Router**, and then we build a third component — a **Dropdown** — that has to notice clicks *outside* itself, which is our first reason to reach for `useRef` and `useEffect`.

Copy `starter/comp-lib` out of the class repo (it's exactly where the Accordion class ended), then `npm install` and `npm run dev`.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [Pick up where we left off](#step-1)
2. [Components vs pages](#step-2)
3. [Install React Router, wrap the app](#step-3)
4. [Routes and Route](#step-4)
5. [A Panel component](#step-5)
6. [A Navbar with Link](#step-6)
7. [The Dropdown: what are we building?](#step-7)
8. [Open and close](#step-8)
9. [Selecting an option: the parent owns the value](#step-9)
10. [Why the parent owns it](#step-10)
11. [The bug: it won't close. useRef](#step-11)
12. [useEffect: listen, and clean up](#step-12)

---

<a id="step-1"></a>

## Step 1 — Pick up where we left off

Copy `starter/comp-lib` — it's where the Accordion class ended — install and run it.

Before we add anything: the Accordion remembers which item is open. **Where does that state live, and why there?** Keep the answer in your head. We're going to ask the same question twice today and get two different answers.

```bash
cp -R starter/comp-lib ~/your-hw-repo/week05-comp-lib
cd ~/your-hw-repo/week05-comp-lib
npm install
npm run dev
```

---

<a id="step-2"></a>

## Step 2 — Components vs pages

Look at what's in `src/` now:

- **`components/`** — `Button`, `Accordion`. Reusable. They know nothing about chickens or buy-now buttons; whoever uses them passes that in.
- **`pages/`** — `ButtonPage`, `AccordionPage`. One screen each. They *use* components and they own the data.

And `App` is stacking every page on one screen, which stops working the moment there are five of them. `App`'s real job is to decide **which page to show** — and the way the web says which page you want is the url. That's **routing**.

One thing to know before we start: a React app is one HTML file. When the browser loads a new page the normal way, it throws away every bit of JavaScript — including all your state. Open an Accordion item and hit refresh: closed again. A router's job is to change the url and the page *without* that reload.

---

<a id="step-3"></a>

## Step 3 — Install React Router, wrap the app

React doesn't do routing on its own. React Router is the standard library for it.

`BrowserRouter` goes around the **whole** app, in `main.jsx`. Anything that uses routing has to be inside it — which is everything, so we put it at the very top.

```bash
npm install react-router-dom
```

**`src/main.jsx`**

What changed:

```diff
@@ -1,4 +1,6 @@
 import React from 'react'
 import ReactDOM from 'react-dom/client'
+import {BrowserRouter} from 'react-router-dom'
+
 import './index.css'
 import App from './App'
@@ -7,5 +9,8 @@
 root.render(
   <React.StrictMode>
-    <App />
+    {/* BrowserRouter has to wrap anything that uses Link or Routes */}
+    <BrowserRouter>
+      <App />
+    </BrowserRouter>
   </React.StrictMode>
 )
```

<details>
<summary>Full file after this step</summary>

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'

import './index.css'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {/* BrowserRouter has to wrap anything that uses Link or Routes */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

</details>

---

<a id="step-4"></a>

## Step 4 — Routes and Route

Inside `App`, `<Routes>` looks at the url and renders the **first** `<Route>` whose `path` matches. `element` is the JSX to show.

- `/` — the home page, our buttons
- `/accordion` — the accordion

There are no links yet. Test it by typing `localhost:5173/accordion` into the address bar yourself. Try a path that doesn't exist, too — you get an empty page, not an error.

**`src/App.jsx`**

What changed:

```diff
@@ -1,13 +1,13 @@
+import {Routes, Route} from 'react-router-dom'
 import ButtonPage from './pages/ButtonPage'
 import AccordionPage from './pages/AccordionPage'
 
-// Right now App is doing the job of a page. Next week we add routes
-// so each of these gets its own url.
 const App = () => {
   return (
     <div className="container mx-auto mt-4">
-      <ButtonPage />
-      <hr className="my-8" />
-      <AccordionPage />
+      <Routes>
+        <Route path="/" element={<ButtonPage />} />
+        <Route path="/accordion" element={<AccordionPage />} />
+      </Routes>
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {Routes, Route} from 'react-router-dom'
import ButtonPage from './pages/ButtonPage'
import AccordionPage from './pages/AccordionPage'

const App = () => {
  return (
    <div className="container mx-auto mt-4">
      <Routes>
        <Route path="/" element={<ButtonPage />} />
        <Route path="/accordion" element={<AccordionPage />} />
      </Routes>
    </div>
  )
}

export default App
```

</details>

---

<a id="step-5"></a>

## Step 5 — A Panel component

We need a white box with a border and a shadow twice today — for the nav, and for the Dropdown. Twice is a component.

`Panel` is the same pattern as `Button`: pull out the props we care about, collect **everything else** in `...rest`, and spread it onto the `<div>`. So `onClick`, `id`, anything a `<div>` accepts, just works. We'll lean on that in step 8.

**`src/components/Panel.jsx`**  — new file

```jsx
import cx from 'classnames'

const Panel = (props) => {
  const {className, children, ...rest} = props
  const finalClassNames = cx(
    className,
    'border rounded p-3 shadow bg-white w-full'
  )
  return (
    <div {...rest} className={finalClassNames}>
      {children}
    </div>
  )
}

export default Panel
```

---

<a id="step-6"></a>

## Step 6 — A Navbar with Link

Links in a React Router app are `<Link to="…">`, **not** `<a href="…">`.

An `<a>` asks the browser for a new page — full reload, all state gone. `<Link>` updates the address bar and tells the router to re-render, with no reload. Inspect one in dev tools: it's still an `<a>` in the HTML. It just intercepts the click.

The layout is a six-column grid: nav in the first column, the page in the other five. `sticky top-0` on the nav keeps it on screen when a long page scrolls.

**`src/components/Navbar.jsx`**  — new file

```jsx
import {Link} from 'react-router-dom'
import Panel from './Panel'

const Navbar = () => {
  return (
    <Panel className="sticky top-0 flex flex-col items-start gap-1">
      <Link to="/" className="text-blue-500">
        Buttons
      </Link>
      <Link to="/accordion" className="text-blue-500">
        Accordion
      </Link>
    </Panel>
  )
}

export default Navbar
```

**`src/App.jsx`**

What changed:

```diff
@@ -1,13 +1,22 @@
+// Import libraries first…
 import {Routes, Route} from 'react-router-dom'
+// …then our own components…
+import Navbar from './components/Navbar'
 import ButtonPage from './pages/ButtonPage'
 import AccordionPage from './pages/AccordionPage'
+// …then css and data.
 
 const App = () => {
   return (
-    <div className="container mx-auto mt-4">
-      <Routes>
-        <Route path="/" element={<ButtonPage />} />
-        <Route path="/accordion" element={<AccordionPage />} />
-      </Routes>
+    <div className="container mx-auto grid grid-cols-6 gap-4 mt-4">
+      <div>
+        <Navbar />
+      </div>
+      <div className="col-span-5">
+        <Routes>
+          <Route path="/" element={<ButtonPage />} />
+          <Route path="/accordion" element={<AccordionPage />} />
+        </Routes>
+      </div>
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
// Import libraries first…
import {Routes, Route} from 'react-router-dom'
// …then our own components…
import Navbar from './components/Navbar'
import ButtonPage from './pages/ButtonPage'
import AccordionPage from './pages/AccordionPage'
// …then css and data.

const App = () => {
  return (
    <div className="container mx-auto grid grid-cols-6 gap-4 mt-4">
      <div>
        <Navbar />
      </div>
      <div className="col-span-5">
        <Routes>
          <Route path="/" element={<ButtonPage />} />
          <Route path="/accordion" element={<AccordionPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
```

</details>

---

<a id="step-7"></a>

## Step 7 — The Dropdown: what are we building?

A Dropdown: a box that says *Select…*, click it and a list of options opens, pick one and the box shows your choice.

Before any code, last week's five questions. The answers split in two, and that split is today's big idea:

| state | who needs it? | lives in |
|---|---|---|
| is the list open? | only the Dropdown | `Dropdown` |
| which option is selected? | the **page** — it's going to use the answer | `DropdownPage` |

The Dropdown takes an `options` array, each with a `label` (what you see) and a `value` (what the code uses). It knows nothing about colours.

Start static: everything visible, nothing clickable. Give it a page, a route and a nav link.

**`src/components/Dropdown.jsx`**  — new file

```jsx
import {GoChevronDown} from 'react-icons/go'
import Panel from './Panel'

const Dropdown = (props) => {
  const {options} = props

  const renderedOptions = options.map((opt, index) => (
    <div
      key={index}
      className="hover:bg-sky-100 rounded cursor-pointer p-1"
    >
      {opt.label}
    </div>
  ))

  // Everything visible, nothing clickable yet. Get the markup right first.
  return (
    <div className="w-48 relative">
      <Panel className="flex justify-between items-center cursor-pointer">
        Select... <GoChevronDown />
      </Panel>
      <Panel className="absolute top-full">{renderedOptions}</Panel>
    </div>
  )
}

export default Dropdown
```

**`src/pages/DropdownPage.jsx`**  — new file

```jsx
import Dropdown from '../components/Dropdown'

const OPTIONS = [
  {label: 'Red', value: 'red'},
  {label: 'Green', value: 'green'},
  {label: 'Blue', value: 'blue'},
]

const DropdownPage = () => {
  return (
    <div>
      <Dropdown options={OPTIONS} />
    </div>
  )
}

export default DropdownPage
```

**`src/App.jsx`**

What changed:

```diff
@@ -5,4 +5,5 @@
 import ButtonPage from './pages/ButtonPage'
 import AccordionPage from './pages/AccordionPage'
+import DropdownPage from './pages/DropdownPage'
 // …then css and data.
 
@@ -17,4 +18,5 @@
           <Route path="/" element={<ButtonPage />} />
           <Route path="/accordion" element={<AccordionPage />} />
+          <Route path="/dropdown" element={<DropdownPage />} />
         </Routes>
       </div>
```

<details>
<summary>Full file after this step</summary>

```jsx
// Import libraries first…
import {Routes, Route} from 'react-router-dom'
// …then our own components…
import Navbar from './components/Navbar'
import ButtonPage from './pages/ButtonPage'
import AccordionPage from './pages/AccordionPage'
import DropdownPage from './pages/DropdownPage'
// …then css and data.

const App = () => {
  return (
    <div className="container mx-auto grid grid-cols-6 gap-4 mt-4">
      <div>
        <Navbar />
      </div>
      <div className="col-span-5">
        <Routes>
          <Route path="/" element={<ButtonPage />} />
          <Route path="/accordion" element={<AccordionPage />} />
          <Route path="/dropdown" element={<DropdownPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
```

</details>

**`src/components/Navbar.jsx`**

What changed:

```diff
@@ -11,4 +11,7 @@
         Accordion
       </Link>
+      <Link to="/dropdown" className="text-blue-500">
+        Dropdown
+      </Link>
     </Panel>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {Link} from 'react-router-dom'
import Panel from './Panel'

const Navbar = () => {
  return (
    <Panel className="sticky top-0 flex flex-col items-start gap-1">
      <Link to="/" className="text-blue-500">
        Buttons
      </Link>
      <Link to="/accordion" className="text-blue-500">
        Accordion
      </Link>
      <Link to="/dropdown" className="text-blue-500">
        Dropdown
      </Link>
    </Panel>
  )
}

export default Navbar
```

</details>

---

<a id="step-8"></a>

## Step 8 — Open and close

`isOpen` is ours, so it's `useState` inside the Dropdown.

Clicking the box toggles it. `{isOpen && …}` is the same show-this-or-nothing pattern as the Accordion content.

Notice we put `onClick` on a **`Panel`**, not a `<div>`. It works because `Panel` passes everything it didn't use through `...rest`.

**`src/components/Dropdown.jsx`**

What changed:

```diff
@@ -1,2 +1,3 @@
+import {useState} from 'react'
 import {GoChevronDown} from 'react-icons/go'
 import Panel from './Panel'
@@ -4,4 +5,9 @@
 const Dropdown = (props) => {
   const {options} = props
+  const [isOpen, setIsOpen] = useState(false)
+
+  const handleClick = () => {
+    setIsOpen(!isOpen)
+  }
 
   const renderedOptions = options.map((opt, index) => (
@@ -14,11 +20,13 @@
   ))
 
-  // Everything visible, nothing clickable yet. Get the markup right first.
   return (
     <div className="w-48 relative">
-      <Panel className="flex justify-between items-center cursor-pointer">
+      <Panel
+        onClick={handleClick}
+        className="flex justify-between items-center cursor-pointer"
+      >
         Select... <GoChevronDown />
       </Panel>
-      <Panel className="absolute top-full">{renderedOptions}</Panel>
+      {isOpen && <Panel className="absolute top-full">{renderedOptions}</Panel>}
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import {GoChevronDown} from 'react-icons/go'
import Panel from './Panel'

const Dropdown = (props) => {
  const {options} = props
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const renderedOptions = options.map((opt, index) => (
    <div
      key={index}
      className="hover:bg-sky-100 rounded cursor-pointer p-1"
    >
      {opt.label}
    </div>
  ))

  return (
    <div className="w-48 relative">
      <Panel
        onClick={handleClick}
        className="flex justify-between items-center cursor-pointer"
      >
        Select... <GoChevronDown />
      </Panel>
      {isOpen && <Panel className="absolute top-full">{renderedOptions}</Panel>}
    </div>
  )
}

export default Dropdown
```

</details>

---

<a id="step-9"></a>

## Step 9 — Selecting an option: the parent owns the value

The selected value lives in the **page**. So the Dropdown doesn't `useState` it — it **receives** it:

- `value` — the current selection, passed down
- `onChange` — a function the Dropdown calls with the option the user picked

The page holds the state and hands down both halves. This is exactly how a real `<input>` works in React (`value` + `onChange`), and it's called a **controlled component**.

`value?.label` — the `?.` is **optional chaining**. `value` starts as `null`, and `null.label` crashes. `null?.label` quietly gives `undefined`.

**`src/components/Dropdown.jsx`**

What changed:

```diff
@@ -4,5 +4,5 @@
 
 const Dropdown = (props) => {
-  const {options} = props
+  const {options, onChange, value} = props
   const [isOpen, setIsOpen] = useState(false)
 
@@ -11,6 +11,13 @@
   }
 
+  const handleOptionClick = (option) => {
+    setIsOpen(false)
+    // onChange belongs to the parent -- the parent owns the selected value.
+    onChange(option)
+  }
+
   const renderedOptions = options.map((opt, index) => (
     <div
+      onClick={() => handleOptionClick(opt)}
       key={index}
       className="hover:bg-sky-100 rounded cursor-pointer p-1"
@@ -26,5 +33,5 @@
         className="flex justify-between items-center cursor-pointer"
       >
-        Select... <GoChevronDown />
+        {value ? value.label : 'Select...'} <GoChevronDown />
       </Panel>
       {isOpen && <Panel className="absolute top-full">{renderedOptions}</Panel>}
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import {GoChevronDown} from 'react-icons/go'
import Panel from './Panel'

const Dropdown = (props) => {
  const {options, onChange, value} = props
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option) => {
    setIsOpen(false)
    // onChange belongs to the parent -- the parent owns the selected value.
    onChange(option)
  }

  const renderedOptions = options.map((opt, index) => (
    <div
      onClick={() => handleOptionClick(opt)}
      key={index}
      className="hover:bg-sky-100 rounded cursor-pointer p-1"
    >
      {opt.label}
    </div>
  ))

  return (
    <div className="w-48 relative">
      <Panel
        onClick={handleClick}
        className="flex justify-between items-center cursor-pointer"
      >
        {value ? value.label : 'Select...'} <GoChevronDown />
      </Panel>
      {isOpen && <Panel className="absolute top-full">{renderedOptions}</Panel>}
    </div>
  )
}

export default Dropdown
```

</details>

**`src/pages/DropdownPage.jsx`**

What changed:

```diff
@@ -1,2 +1,3 @@
+import {useState} from 'react'
 import Dropdown from '../components/Dropdown'
 
@@ -8,7 +9,16 @@
 
 const DropdownPage = () => {
+  // The selected value lives in the PARENT, not in Dropdown -- that way this
+  // page (and anything else on it) can react to the selection.
+  const [value, setValue] = useState(null)
+
+  const handleChange = (option) => {
+    setValue(option)
+  }
+
   return (
     <div>
-      <Dropdown options={OPTIONS} />
+      <h1>Dropdown page with user selected value of: {value?.label}</h1>
+      <Dropdown options={OPTIONS} onChange={handleChange} value={value} />
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import Dropdown from '../components/Dropdown'

const OPTIONS = [
  {label: 'Red', value: 'red'},
  {label: 'Green', value: 'green'},
  {label: 'Blue', value: 'blue'},
]

const DropdownPage = () => {
  // The selected value lives in the PARENT, not in Dropdown -- that way this
  // page (and anything else on it) can react to the selection.
  const [value, setValue] = useState(null)

  const handleChange = (option) => {
    setValue(option)
  }

  return (
    <div>
      <h1>Dropdown page with user selected value of: {value?.label}</h1>
      <Dropdown options={OPTIONS} onChange={handleChange} value={value} />
    </div>
  )
}

export default DropdownPage
```

</details>

---

<a id="step-10"></a>

## Step 10 — Why the parent owns it

Here's the payoff for putting `value` in the page: the page can **use** it. Colour the heading, and filter a list of students by team.

Two things to notice:

- `??` is **nullish coalescing**: use the left side, unless it's `null`/`undefined`, then use the right. Nothing selected → *every team*.
- `COLOR_MAP`. Tailwind builds its CSS by scanning your files for **complete** class names. `bg-${value}-500` is assembled at runtime, so Tailwind never sees `bg-red-500` and never generates it. Write every class out in full.

**`src/pages/DropdownPage.jsx`**

What changed:

```diff
@@ -8,8 +8,31 @@
 ]
 
+// Tailwind scans your source for complete class strings, so
+// `bg-${value}-500` will NOT work. Map them out explicitly instead.
+const COLOR_MAP = {
+  red: 'bg-red-500',
+  green: 'bg-green-400',
+  blue: 'bg-blue-500',
+}
+
+const DATA_TO_FILTER = [
+  {id: 1, name: 'katie', team: 'red'},
+  {id: 2, name: 'tony', team: 'green'},
+  {id: 3, name: 'amy', team: 'blue'},
+  {id: 4, name: 'andy', team: 'red'},
+  {id: 5, name: 'pete', team: 'green'},
+]
+
 const DropdownPage = () => {
   // The selected value lives in the PARENT, not in Dropdown -- that way this
   // page (and anything else on it) can react to the selection.
   const [value, setValue] = useState(null)
+
+  let filteredData = DATA_TO_FILTER
+
+  // ?. is optional chaining: if value is null, stop, do not explode.
+  if (value?.value) {
+    filteredData = DATA_TO_FILTER.filter((s) => s.team === value.value)
+  }
 
   const handleChange = (option) => {
@@ -19,6 +42,12 @@
   return (
     <div>
-      <h1>Dropdown page with user selected value of: {value?.label}</h1>
+      <h1 className={COLOR_MAP[value?.value] || undefined}>
+        Dropdown page with user selected value of: {value?.label}
+      </h1>
       <Dropdown options={OPTIONS} onChange={handleChange} value={value} />
+      <h2 className="mt-4">Students from {value?.label ?? 'every team'}:</h2>
+      {filteredData.map((student) => (
+        <p key={student.id}>{student.name}</p>
+      ))}
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import Dropdown from '../components/Dropdown'

const OPTIONS = [
  {label: 'Red', value: 'red'},
  {label: 'Green', value: 'green'},
  {label: 'Blue', value: 'blue'},
]

// Tailwind scans your source for complete class strings, so
// `bg-${value}-500` will NOT work. Map them out explicitly instead.
const COLOR_MAP = {
  red: 'bg-red-500',
  green: 'bg-green-400',
  blue: 'bg-blue-500',
}

const DATA_TO_FILTER = [
  {id: 1, name: 'katie', team: 'red'},
  {id: 2, name: 'tony', team: 'green'},
  {id: 3, name: 'amy', team: 'blue'},
  {id: 4, name: 'andy', team: 'red'},
  {id: 5, name: 'pete', team: 'green'},
]

const DropdownPage = () => {
  // The selected value lives in the PARENT, not in Dropdown -- that way this
  // page (and anything else on it) can react to the selection.
  const [value, setValue] = useState(null)

  let filteredData = DATA_TO_FILTER

  // ?. is optional chaining: if value is null, stop, do not explode.
  if (value?.value) {
    filteredData = DATA_TO_FILTER.filter((s) => s.team === value.value)
  }

  const handleChange = (option) => {
    setValue(option)
  }

  return (
    <div>
      <h1 className={COLOR_MAP[value?.value] || undefined}>
        Dropdown page with user selected value of: {value?.label}
      </h1>
      <Dropdown options={OPTIONS} onChange={handleChange} value={value} />
      <h2 className="mt-4">Students from {value?.label ?? 'every team'}:</h2>
      {filteredData.map((student) => (
        <p key={student.id}>{student.name}</p>
      ))}
    </div>
  )
}

export default DropdownPage
```

</details>

---

<a id="step-11"></a>

## Step 11 — The bug: it won't close. useRef

Open the dropdown, then click anywhere else on the page. It stays open. Every real dropdown closes when you click away.

The click is happening *outside* our component, so no `onClick` of ours will ever hear it. We'll need to listen on the whole `document` — and then ask: **was that click inside our dropdown or not?** To answer that we need a handle on the real DOM element.

That's `useRef`. `useRef()` gives us an object; `ref={divEl}` on the `<div>` makes React put the actual element in `divEl.current`.

**`src/components/Dropdown.jsx`**

What changed:

```diff
@@ -1,3 +1,3 @@
-import {useState} from 'react'
+import {useState, useRef} from 'react'
 import {GoChevronDown} from 'react-icons/go'
 import Panel from './Panel'
@@ -6,4 +6,8 @@
   const {options, onChange, value} = props
   const [isOpen, setIsOpen] = useState(false)
+
+  // useRef gives us a handle on a real DOM element.
+  // We attach it to the outer div below with  ref={divEl}
+  const divEl = useRef()
 
   const handleClick = () => {
@@ -28,5 +32,5 @@
 
   return (
-    <div className="w-48 relative">
+    <div ref={divEl} className="w-48 relative">
       <Panel
         onClick={handleClick}
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState, useRef} from 'react'
import {GoChevronDown} from 'react-icons/go'
import Panel from './Panel'

const Dropdown = (props) => {
  const {options, onChange, value} = props
  const [isOpen, setIsOpen] = useState(false)

  // useRef gives us a handle on a real DOM element.
  // We attach it to the outer div below with  ref={divEl}
  const divEl = useRef()

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option) => {
    setIsOpen(false)
    // onChange belongs to the parent -- the parent owns the selected value.
    onChange(option)
  }

  const renderedOptions = options.map((opt, index) => (
    <div
      onClick={() => handleOptionClick(opt)}
      key={index}
      className="hover:bg-sky-100 rounded cursor-pointer p-1"
    >
      {opt.label}
    </div>
  ))

  return (
    <div ref={divEl} className="w-48 relative">
      <Panel
        onClick={handleClick}
        className="flex justify-between items-center cursor-pointer"
      >
        {value ? value.label : 'Select...'} <GoChevronDown />
      </Panel>
      {isOpen && <Panel className="absolute top-full">{renderedOptions}</Panel>}
    </div>
  )
}

export default Dropdown
```

</details>

---

<a id="step-12"></a>

## Step 12 — useEffect: listen, and clean up

We want to add one `document` click listener **when the Dropdown appears**, and remove it **when it goes away**. That's what `useEffect` is for — code that has to reach outside React.

- The function runs after the component renders.
- The `[]` means *only once*, on mount.
- The function it **returns** is the **cleanup**: React runs it when the component unmounts. Skip it and every visit to this page adds another listener that never goes away.

Inside the handler: if the click target isn't inside `divEl.current`, close.

The `true` on `addEventListener` means *capture phase*: our listener runs on the way **down** the page, before React handles the click and re-renders. We check the DOM before React changes it.

**`src/components/Dropdown.jsx`**

What changed:

```diff
@@ -1,3 +1,3 @@
-import {useState, useRef} from 'react'
+import {useState, useEffect, useRef} from 'react'
 import {GoChevronDown} from 'react-icons/go'
 import Panel from './Panel'
@@ -10,4 +10,31 @@
   // We attach it to the outer div below with  ref={divEl}
   const divEl = useRef()
+
+  /*
+    useEffect takes two arguments: a function, and an array of things to watch.
+      useEffect(fn, [])      -> run once, when the component mounts
+      useEffect(fn, [thing]) -> run on mount and whenever `thing` changes
+      useEffect(fn)          -> run after every single render
+
+    Here we add a plain old document click listener so we can close the
+    dropdown when the user clicks somewhere else on the page.
+
+    If the function returns another function, React calls that on unmount --
+    the cleanup. Without it we would pile up listeners forever.
+  */
+  useEffect(() => {
+    const handler = (event) => {
+      if (!divEl.current) return
+      if (!divEl.current.contains(event.target)) {
+        setIsOpen(false)
+      }
+    }
+
+    document.addEventListener('click', handler, true)
+
+    return () => {
+      document.removeEventListener('click', handler, true)
+    }
+  }, [])
 
   const handleClick = () => {
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState, useEffect, useRef} from 'react'
import {GoChevronDown} from 'react-icons/go'
import Panel from './Panel'

const Dropdown = (props) => {
  const {options, onChange, value} = props
  const [isOpen, setIsOpen] = useState(false)

  // useRef gives us a handle on a real DOM element.
  // We attach it to the outer div below with  ref={divEl}
  const divEl = useRef()

  /*
    useEffect takes two arguments: a function, and an array of things to watch.
      useEffect(fn, [])      -> run once, when the component mounts
      useEffect(fn, [thing]) -> run on mount and whenever `thing` changes
      useEffect(fn)          -> run after every single render

    Here we add a plain old document click listener so we can close the
    dropdown when the user clicks somewhere else on the page.

    If the function returns another function, React calls that on unmount --
    the cleanup. Without it we would pile up listeners forever.
  */
  useEffect(() => {
    const handler = (event) => {
      if (!divEl.current) return
      if (!divEl.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handler, true)

    return () => {
      document.removeEventListener('click', handler, true)
    }
  }, [])

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option) => {
    setIsOpen(false)
    // onChange belongs to the parent -- the parent owns the selected value.
    onChange(option)
  }

  const renderedOptions = options.map((opt, index) => (
    <div
      onClick={() => handleOptionClick(opt)}
      key={index}
      className="hover:bg-sky-100 rounded cursor-pointer p-1"
    >
      {opt.label}
    </div>
  ))

  return (
    <div ref={divEl} className="w-48 relative">
      <Panel
        onClick={handleClick}
        className="flex justify-between items-center cursor-pointer"
      >
        {value ? value.label : 'Select...'} <GoChevronDown />
      </Panel>
      {isOpen && <Panel className="absolute top-full">{renderedOptions}</Panel>}
    </div>
  )
}

export default Dropdown
```

</details>

---

**Where we landed:** a library with a nav and one url per component, and a Dropdown whose open/closed state lives inside it while the *selected value* lives in the page that uses it.

**The three forms of `useEffect`, one more time:**

| | runs |
|---|---|
| `useEffect(fn, [])` | once, when the component mounts |
| `useEffect(fn, [thing])` | on mount, and whenever `thing` changes |
| `useEffect(fn)` | after every render |

A function returned from the effect is the **cleanup** — React runs it when the component goes away.

**Homework:** see [HW.md](HW.md).

Next class: a Modal, which needs everything from today plus one new trick.
