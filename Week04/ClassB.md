# Week 05 — The Modal: portals and escaping the page

*Building a Modal with createPortal, fixed positioning and useEffect · ~90 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

Today: a **Modal** — a pop-up window over the page, with a dimmed background and its own buttons. It's a component that has to escape the place it's used and cover *everything*, which needs one new tool, `createPortal`, and a lot of what we did on Tuesday.

We pick up exactly where class A ended. If you missed it or your project is in a strange state, copy `starter/comp-lib` again and work through [ClassA.md](ClassA.md) first.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [Pick up where we left off](#step-1)
2. [What are we building?](#step-2)
3. [Break it on purpose](#step-3)
4. [fixed, not absolute](#step-4)
5. [createPortal](#step-5)
6. [Closing it](#step-6)
7. [Holes for the caller to fill: children, title, actionBar](#step-7)
8. [Lock the scroll: useEffect again](#step-8)
9. [A variant, like Button](#step-9)

---

<a id="step-1"></a>

## Step 1 — Pick up where we left off

Your project from Tuesday, still running.

Recap before we add anything: what are the three forms of `useEffect`, and what's the function you return from it for?

```bash
cd ~/your-hw-repo/week05-comp-lib
npm run dev
```

---

<a id="step-2"></a>

## Step 2 — What are we building?

A Modal: a button opens a window over the page, the rest of the page dims, and the window can be closed.

The state question first. *Is the modal open?* Who needs to know?

- the **Button** that opens it
- the **Modal**, which needs a way to close itself

Two siblings need it, so it lives in their **parent**, `ModalPage` — same answer as the Dropdown's value.

A first Modal: a grey overlay covering everything, and a white window on top. `inset-0` is shorthand for `top: 0; right: 0; bottom: 0; left: 0`. New page, route and nav link, same as Tuesday.

**`src/components/Modal.jsx`**  — new file

```jsx
const Modal = () => {
  return (
    <>
      <div className="absolute inset-0 bg-gray-300 opacity-50"></div>
      <div className="absolute inset-40 p-10 bg-white">I'm a modal!</div>
    </>
  )
}

export default Modal
```

**`src/pages/ModalPage.jsx`**  — new file

```jsx
import {useState} from 'react'
import Button from '../components/Button'
import Modal from '../components/Modal'

const ModalPage = () => {
  // isModalOpen lives HERE, in the parent of both the Button that opens it
  // and the Modal itself.
  const [modalOpen, setModalOpen] = useState(false)

  const handleClick = () => setModalOpen(true)

  return (
    <div>
      <Button onClick={handleClick} success rounded>
        Open Modal!
      </Button>

      {modalOpen && <Modal />}
    </div>
  )
}

export default ModalPage
```

**`src/App.jsx`**

What changed:

```diff
@@ -6,4 +6,5 @@
 import AccordionPage from './pages/AccordionPage'
 import DropdownPage from './pages/DropdownPage'
+import ModalPage from './pages/ModalPage'
 // …then css and data.
 
@@ -19,4 +20,6 @@
           <Route path="/accordion" element={<AccordionPage />} />
           <Route path="/dropdown" element={<DropdownPage />} />
+          <Route path="/modal" element={<ModalPage />} />
+          {/* HW: add a route here for your own component */}
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
import ModalPage from './pages/ModalPage'
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
          <Route path="/modal" element={<ModalPage />} />
          {/* HW: add a route here for your own component */}
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
@@ -14,4 +14,8 @@
         Dropdown
       </Link>
+      <Link to="/modal" className="text-blue-500">
+        Modal
+      </Link>
+      {/* HW: add a link to your own component page */}
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
      <Link to="/modal" className="text-blue-500">
        Modal
      </Link>
      {/* HW: add a link to your own component page */}
    </Panel>
  )
}

export default Navbar
```

</details>

---

<a id="step-3"></a>

## Step 3 — Break it on purpose

Two realistic things that will happen to a Modal in a real app:

**1. The page is long.** Add enough text to make `ModalPage` scroll, scroll down, open the modal. The overlay only covers the first screen — `absolute` sizes itself against the page, not the window.

**2. Someone puts it inside a positioned container.** Add `relative` to the page column in `App`. Now the overlay only covers that column, and the nav is still clickable. `absolute` measures from the **nearest positioned ancestor** — and *someone else's CSS* just decided where our modal goes.

**`src/pages/ModalPage.jsx`**

What changed:

```diff
@@ -2,4 +2,7 @@
 import Button from '../components/Button'
 import Modal from '../components/Modal'
+
+const LIPSUM =
+  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt massa eget orci porttitor, quis tempor nibh viverra. In vitae mattis neque. Nunc et dignissim nibh. Curabitur sed sapien sit amet ante gravida consectetur ut sit amet odio. Integer eleifend elementum nulla, sed accumsan diam mattis vel.'
 
 const ModalPage = () => {
@@ -12,4 +15,12 @@
   return (
     <div>
+      {/* enough text to make the page scroll, so we can see why `fixed`
+          matters and why we lock body scroll */}
+      {[...Array(8)].map((_, i) => (
+        <p key={i} className="mb-4">
+          {LIPSUM}
+        </p>
+      ))}
+
       <Button onClick={handleClick} success rounded>
         Open Modal!
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import Button from '../components/Button'
import Modal from '../components/Modal'

const LIPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt massa eget orci porttitor, quis tempor nibh viverra. In vitae mattis neque. Nunc et dignissim nibh. Curabitur sed sapien sit amet ante gravida consectetur ut sit amet odio. Integer eleifend elementum nulla, sed accumsan diam mattis vel.'

const ModalPage = () => {
  // isModalOpen lives HERE, in the parent of both the Button that opens it
  // and the Modal itself.
  const [modalOpen, setModalOpen] = useState(false)

  const handleClick = () => setModalOpen(true)

  return (
    <div>
      {/* enough text to make the page scroll, so we can see why `fixed`
          matters and why we lock body scroll */}
      {[...Array(8)].map((_, i) => (
        <p key={i} className="mb-4">
          {LIPSUM}
        </p>
      ))}

      <Button onClick={handleClick} success rounded>
        Open Modal!
      </Button>

      {modalOpen && <Modal />}
    </div>
  )
}

export default ModalPage
```

</details>

**`src/App.jsx`**

What changed:

```diff
@@ -15,5 +15,5 @@
         <Navbar />
       </div>
-      <div className="col-span-5">
+      <div className="col-span-5 relative">
         <Routes>
           <Route path="/" element={<ButtonPage />} />
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
import ModalPage from './pages/ModalPage'
// …then css and data.

const App = () => {
  return (
    <div className="container mx-auto grid grid-cols-6 gap-4 mt-4">
      <div>
        <Navbar />
      </div>
      <div className="col-span-5 relative">
        <Routes>
          <Route path="/" element={<ButtonPage />} />
          <Route path="/accordion" element={<AccordionPage />} />
          <Route path="/dropdown" element={<DropdownPage />} />
          <Route path="/modal" element={<ModalPage />} />
          {/* HW: add a route here for your own component */}
        </Routes>
      </div>
    </div>
  )
}

export default App
```

</details>

---

<a id="step-4"></a>

## Step 4 — fixed, not absolute

`fixed` positions against the **browser window** itself. It ignores `relative` parents and it ignores scrolling — `inset-0` now means *the whole screen, always*.

Both bugs from the last step, gone. But the modal's HTML still lives deep inside our page's markup. Open dev tools and find it: it's in the page column, inside the grid, inside `#root`. A few CSS properties on an ancestor (`transform`, `filter`, `overflow`) can still trap even a `fixed` element. The robust fix is to not put it there at all.

**`src/components/Modal.jsx`**

What changed:

```diff
@@ -1,7 +1,10 @@
 const Modal = () => {
+  // `fixed` not `absolute`: absolute positions against the nearest positioned
+  // ancestor, which breaks the moment somebody puts the modal inside a
+  // `relative` container or scrolls the page.
   return (
     <>
-      <div className="absolute inset-0 bg-gray-300 opacity-50"></div>
-      <div className="absolute inset-40 p-10 bg-white">I'm a modal!</div>
+      <div className="fixed inset-0 bg-gray-300 opacity-50"></div>
+      <div className="fixed inset-40 p-10 bg-white">I'm a modal!</div>
     </>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
const Modal = () => {
  // `fixed` not `absolute`: absolute positions against the nearest positioned
  // ancestor, which breaks the moment somebody puts the modal inside a
  // `relative` container or scrolls the page.
  return (
    <>
      <div className="fixed inset-0 bg-gray-300 opacity-50"></div>
      <div className="fixed inset-40 p-10 bg-white">I'm a modal!</div>
    </>
  )
}

export default Modal
```

</details>

---

<a id="step-5"></a>

## Step 5 — createPortal

A **portal** renders a component's HTML somewhere else in the document, while it stays in the same place in our component tree.

1. Add an empty `<div id="portal">` to `index.html`, after `#root`.
2. In `Modal`, wrap what we return in `createPortal(whatToRender, whereToPutIt)`.

Inspect it again: the modal's HTML is now in `#portal`, outside everything else. Nothing on the page can trap it.

And nothing about React changed. `ModalPage` still renders `<Modal />` exactly where it did, and still controls it with its own state.

**`index.html`**  — new file

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Component Library</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- Our Modal renders itself into this div instead of where it sits in
         the component tree. See components/Modal.jsx -->
    <div id="portal"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**`src/components/Modal.jsx`**

What changed:

```diff
@@ -1,11 +1,20 @@
+// Named import. The old `import ReactDOM from 'react-dom'` still works but
+// the named one is what the React 19 docs use.
+import {createPortal} from 'react-dom'
+
 const Modal = () => {
   // `fixed` not `absolute`: absolute positions against the nearest positioned
   // ancestor, which breaks the moment somebody puts the modal inside a
   // `relative` container or scrolls the page.
-  return (
+
+  // createPortal(whatToRender, whereToPutIt) -- the modal's html ends up in
+  // #portal at the bottom of index.html, no matter where <Modal /> lives
+  // in our component tree.
+  return createPortal(
     <>
       <div className="fixed inset-0 bg-gray-300 opacity-50"></div>
       <div className="fixed inset-40 p-10 bg-white">I'm a modal!</div>
-    </>
+    </>,
+    document.getElementById('portal')
   )
 }
```

<details>
<summary>Full file after this step</summary>

```jsx
// Named import. The old `import ReactDOM from 'react-dom'` still works but
// the named one is what the React 19 docs use.
import {createPortal} from 'react-dom'

const Modal = () => {
  // `fixed` not `absolute`: absolute positions against the nearest positioned
  // ancestor, which breaks the moment somebody puts the modal inside a
  // `relative` container or scrolls the page.

  // createPortal(whatToRender, whereToPutIt) -- the modal's html ends up in
  // #portal at the bottom of index.html, no matter where <Modal /> lives
  // in our component tree.
  return createPortal(
    <>
      <div className="fixed inset-0 bg-gray-300 opacity-50"></div>
      <div className="fixed inset-40 p-10 bg-white">I'm a modal!</div>
    </>,
    document.getElementById('portal')
  )
}

export default Modal
```

</details>

---

<a id="step-6"></a>

## Step 6 — Closing it

The Modal can't close itself — `modalOpen` doesn't belong to it. So the page passes down a function, `onClose`, and the Modal calls it when you click the grey overlay.

Same shape as the Dropdown's `onChange`: **state goes down as props, events come back up as function calls.**

**`src/components/Modal.jsx`**

What changed:

```diff
@@ -3,5 +3,7 @@
 import {createPortal} from 'react-dom'
 
-const Modal = () => {
+const Modal = (props) => {
+  const {onClose} = props
+
   // `fixed` not `absolute`: absolute positions against the nearest positioned
   // ancestor, which breaks the moment somebody puts the modal inside a
@@ -13,5 +15,5 @@
   return createPortal(
     <>
-      <div className="fixed inset-0 bg-gray-300 opacity-50"></div>
+      <div onClick={onClose} className="fixed inset-0 bg-gray-300 opacity-50"></div>
       <div className="fixed inset-40 p-10 bg-white">I'm a modal!</div>
     </>,
```

<details>
<summary>Full file after this step</summary>

```jsx
// Named import. The old `import ReactDOM from 'react-dom'` still works but
// the named one is what the React 19 docs use.
import {createPortal} from 'react-dom'

const Modal = (props) => {
  const {onClose} = props

  // `fixed` not `absolute`: absolute positions against the nearest positioned
  // ancestor, which breaks the moment somebody puts the modal inside a
  // `relative` container or scrolls the page.

  // createPortal(whatToRender, whereToPutIt) -- the modal's html ends up in
  // #portal at the bottom of index.html, no matter where <Modal /> lives
  // in our component tree.
  return createPortal(
    <>
      <div onClick={onClose} className="fixed inset-0 bg-gray-300 opacity-50"></div>
      <div className="fixed inset-40 p-10 bg-white">I'm a modal!</div>
    </>,
    document.getElementById('portal')
  )
}

export default Modal
```

</details>

**`src/pages/ModalPage.jsx`**

What changed:

```diff
@@ -12,4 +12,5 @@
 
   const handleClick = () => setModalOpen(true)
+  const handleCloseClick = () => setModalOpen(false)
 
   return (
@@ -27,5 +28,5 @@
       </Button>
 
-      {modalOpen && <Modal />}
+      {modalOpen && <Modal onClose={handleCloseClick} />}
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import Button from '../components/Button'
import Modal from '../components/Modal'

const LIPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt massa eget orci porttitor, quis tempor nibh viverra. In vitae mattis neque. Nunc et dignissim nibh. Curabitur sed sapien sit amet ante gravida consectetur ut sit amet odio. Integer eleifend elementum nulla, sed accumsan diam mattis vel.'

const ModalPage = () => {
  // isModalOpen lives HERE, in the parent of both the Button that opens it
  // and the Modal itself.
  const [modalOpen, setModalOpen] = useState(false)

  const handleClick = () => setModalOpen(true)
  const handleCloseClick = () => setModalOpen(false)

  return (
    <div>
      {/* enough text to make the page scroll, so we can see why `fixed`
          matters and why we lock body scroll */}
      {[...Array(8)].map((_, i) => (
        <p key={i} className="mb-4">
          {LIPSUM}
        </p>
      ))}

      <Button onClick={handleClick} success rounded>
        Open Modal!
      </Button>

      {modalOpen && <Modal onClose={handleCloseClick} />}
    </div>
  )
}

export default ModalPage
```

</details>

---

<a id="step-7"></a>

## Step 7 — Holes for the caller to fill: children, title, actionBar

Right now every Modal says *I'm a modal!*. A reusable Modal leaves **holes** for whoever uses it:

- `children` — whatever goes between `<Modal>` and `</Modal>`
- `title` — optional, only rendered if passed (`&&` again)
- `actionBar` — the buttons at the bottom, passed in as JSX

Yes, you can pass JSX as a prop. It's just a value. That's how the same Modal becomes a confirm dialog, a sign-up form, or a photo viewer — and our `Button` component gets reused inside it.

**`src/components/Modal.jsx`**

What changed:

```diff
@@ -4,5 +4,5 @@
 
 const Modal = (props) => {
-  const {onClose} = props
+  const {title, children, onClose, actionBar} = props
 
   // `fixed` not `absolute`: absolute positions against the nearest positioned
@@ -16,5 +16,11 @@
     <>
       <div onClick={onClose} className="fixed inset-0 bg-gray-300 opacity-50"></div>
-      <div className="fixed inset-40 p-10 bg-white">I'm a modal!</div>
+      <div className="fixed inset-40 p-10 bg-white">
+        <div className="flex flex-col justify-between h-full">
+          {title && <h2 className="text-2xl">{title}</h2>}
+          {children}
+          <div className="flex flex-row justify-end">{actionBar}</div>
+        </div>
+      </div>
     </>,
     document.getElementById('portal')
```

<details>
<summary>Full file after this step</summary>

```jsx
// Named import. The old `import ReactDOM from 'react-dom'` still works but
// the named one is what the React 19 docs use.
import {createPortal} from 'react-dom'

const Modal = (props) => {
  const {title, children, onClose, actionBar} = props

  // `fixed` not `absolute`: absolute positions against the nearest positioned
  // ancestor, which breaks the moment somebody puts the modal inside a
  // `relative` container or scrolls the page.

  // createPortal(whatToRender, whereToPutIt) -- the modal's html ends up in
  // #portal at the bottom of index.html, no matter where <Modal /> lives
  // in our component tree.
  return createPortal(
    <>
      <div onClick={onClose} className="fixed inset-0 bg-gray-300 opacity-50"></div>
      <div className="fixed inset-40 p-10 bg-white">
        <div className="flex flex-col justify-between h-full">
          {title && <h2 className="text-2xl">{title}</h2>}
          {children}
          <div className="flex flex-row justify-end">{actionBar}</div>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  )
}

export default Modal
```

</details>

**`src/pages/ModalPage.jsx`**

What changed:

```diff
@@ -14,4 +14,24 @@
   const handleCloseClick = () => setModalOpen(false)
 
+  const modalContent = <p>This is modal content populated by the children prop!</p>
+
+  // Passing the buttons in as a prop means the same Modal can be a confirm
+  // dialog, a wizard step, or anything else.
+  const actionBar = (
+    <>
+      <Button
+        success
+        outline
+        onClick={() => console.log('other button function fired!')}
+        className="mr-8"
+      >
+        Some Prompt...
+      </Button>
+      <Button danger outline onClick={handleCloseClick}>
+        Close Modal
+      </Button>
+    </>
+  )
+
   return (
     <div>
@@ -28,5 +48,9 @@
       </Button>
 
-      {modalOpen && <Modal onClose={handleCloseClick} />}
+      {modalOpen && (
+        <Modal onClose={handleCloseClick} actionBar={actionBar}>
+          {modalContent}
+        </Modal>
+      )}
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import Button from '../components/Button'
import Modal from '../components/Modal'

const LIPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt massa eget orci porttitor, quis tempor nibh viverra. In vitae mattis neque. Nunc et dignissim nibh. Curabitur sed sapien sit amet ante gravida consectetur ut sit amet odio. Integer eleifend elementum nulla, sed accumsan diam mattis vel.'

const ModalPage = () => {
  // isModalOpen lives HERE, in the parent of both the Button that opens it
  // and the Modal itself.
  const [modalOpen, setModalOpen] = useState(false)

  const handleClick = () => setModalOpen(true)
  const handleCloseClick = () => setModalOpen(false)

  const modalContent = <p>This is modal content populated by the children prop!</p>

  // Passing the buttons in as a prop means the same Modal can be a confirm
  // dialog, a wizard step, or anything else.
  const actionBar = (
    <>
      <Button
        success
        outline
        onClick={() => console.log('other button function fired!')}
        className="mr-8"
      >
        Some Prompt...
      </Button>
      <Button danger outline onClick={handleCloseClick}>
        Close Modal
      </Button>
    </>
  )

  return (
    <div>
      {/* enough text to make the page scroll, so we can see why `fixed`
          matters and why we lock body scroll */}
      {[...Array(8)].map((_, i) => (
        <p key={i} className="mb-4">
          {LIPSUM}
        </p>
      ))}

      <Button onClick={handleClick} success rounded>
        Open Modal!
      </Button>

      {modalOpen && (
        <Modal onClose={handleCloseClick} actionBar={actionBar}>
          {modalContent}
        </Modal>
      )}
    </div>
  )
}

export default ModalPage
```

</details>

---

<a id="step-8"></a>

## Step 8 — Lock the scroll: useEffect again

Open the modal and scroll with your mouse wheel. The page behind it scrolls. It shouldn't.

The fix is Tailwind's `overflow-hidden` on `<body>` — but only while the modal is open. That's `useEffect` with a cleanup, exactly like Tuesday:

- on mount (the modal appears): add the class
- on cleanup (the modal goes away): remove it

`<body>` is outside React, which is exactly what effects are for.

**`src/components/Modal.jsx`**

What changed:

```diff
@@ -1,2 +1,3 @@
+import {useEffect} from 'react'
 // Named import. The old `import ReactDOM from 'react-dom'` still works but
 // the named one is what the React 19 docs use.
@@ -5,4 +6,14 @@
 const Modal = (props) => {
   const {title, children, onClose, actionBar} = props
+
+  // Stop the page behind the modal from scrolling while it is open,
+  // and undo that when the modal closes.
+  useEffect(() => {
+    document.body.classList.add('overflow-hidden')
+
+    return () => {
+      document.body.classList.remove('overflow-hidden')
+    }
+  }, [])
 
   // `fixed` not `absolute`: absolute positions against the nearest positioned
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useEffect} from 'react'
// Named import. The old `import ReactDOM from 'react-dom'` still works but
// the named one is what the React 19 docs use.
import {createPortal} from 'react-dom'

const Modal = (props) => {
  const {title, children, onClose, actionBar} = props

  // Stop the page behind the modal from scrolling while it is open,
  // and undo that when the modal closes.
  useEffect(() => {
    document.body.classList.add('overflow-hidden')

    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  // `fixed` not `absolute`: absolute positions against the nearest positioned
  // ancestor, which breaks the moment somebody puts the modal inside a
  // `relative` container or scrolls the page.

  // createPortal(whatToRender, whereToPutIt) -- the modal's html ends up in
  // #portal at the bottom of index.html, no matter where <Modal /> lives
  // in our component tree.
  return createPortal(
    <>
      <div onClick={onClose} className="fixed inset-0 bg-gray-300 opacity-50"></div>
      <div className="fixed inset-40 p-10 bg-white">
        <div className="flex flex-col justify-between h-full">
          {title && <h2 className="text-2xl">{title}</h2>}
          {children}
          <div className="flex flex-row justify-end">{actionBar}</div>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  )
}

export default Modal
```

</details>

---

<a id="step-9"></a>

## Step 9 — A variant, like Button

Last touch, and it's a callback to the Button class: a boolean prop that switches styles, built with `classnames`.

`crazy` gives a teal overlay and a rounded window. It's silly on purpose — the point is that a variant is just a prop plus `cx`, the same way `primary` and `outline` work on `Button`.

**`src/components/Modal.jsx`**

What changed:

```diff
@@ -3,7 +3,8 @@
 // the named one is what the React 19 docs use.
 import {createPortal} from 'react-dom'
+import cx from 'classnames'
 
 const Modal = (props) => {
-  const {title, children, onClose, actionBar} = props
+  const {title, children, onClose, actionBar, crazy} = props
 
   // Stop the page behind the modal from scrolling while it is open,
@@ -20,4 +21,11 @@
   // ancestor, which breaks the moment somebody puts the modal inside a
   // `relative` container or scrolls the page.
+  const overlayClass = crazy
+    ? 'fixed inset-0 bg-teal-300 opacity-50'
+    : 'fixed inset-0 bg-gray-300 opacity-50'
+
+  const windowClass = cx('fixed inset-40 p-10 bg-white', {
+    'rounded-lg': crazy,
+  })
 
   // createPortal(whatToRender, whereToPutIt) -- the modal's html ends up in
@@ -26,6 +34,6 @@
   return createPortal(
     <>
-      <div onClick={onClose} className="fixed inset-0 bg-gray-300 opacity-50"></div>
-      <div className="fixed inset-40 p-10 bg-white">
+      <div onClick={onClose} className={overlayClass}></div>
+      <div className={windowClass}>
         <div className="flex flex-col justify-between h-full">
           {title && <h2 className="text-2xl">{title}</h2>}
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useEffect} from 'react'
// Named import. The old `import ReactDOM from 'react-dom'` still works but
// the named one is what the React 19 docs use.
import {createPortal} from 'react-dom'
import cx from 'classnames'

const Modal = (props) => {
  const {title, children, onClose, actionBar, crazy} = props

  // Stop the page behind the modal from scrolling while it is open,
  // and undo that when the modal closes.
  useEffect(() => {
    document.body.classList.add('overflow-hidden')

    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  // `fixed` not `absolute`: absolute positions against the nearest positioned
  // ancestor, which breaks the moment somebody puts the modal inside a
  // `relative` container or scrolls the page.
  const overlayClass = crazy
    ? 'fixed inset-0 bg-teal-300 opacity-50'
    : 'fixed inset-0 bg-gray-300 opacity-50'

  const windowClass = cx('fixed inset-40 p-10 bg-white', {
    'rounded-lg': crazy,
  })

  // createPortal(whatToRender, whereToPutIt) -- the modal's html ends up in
  // #portal at the bottom of index.html, no matter where <Modal /> lives
  // in our component tree.
  return createPortal(
    <>
      <div onClick={onClose} className={overlayClass}></div>
      <div className={windowClass}>
        <div className="flex flex-col justify-between h-full">
          {title && <h2 className="text-2xl">{title}</h2>}
          {children}
          <div className="flex flex-row justify-end">{actionBar}</div>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  )
}

export default Modal
```

</details>

**`src/pages/ModalPage.jsx`**

What changed:

```diff
@@ -49,5 +49,5 @@
 
       {modalOpen && (
-        <Modal onClose={handleCloseClick} actionBar={actionBar}>
+        <Modal onClose={handleCloseClick} actionBar={actionBar} crazy>
           {modalContent}
         </Modal>
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import Button from '../components/Button'
import Modal from '../components/Modal'

const LIPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tincidunt massa eget orci porttitor, quis tempor nibh viverra. In vitae mattis neque. Nunc et dignissim nibh. Curabitur sed sapien sit amet ante gravida consectetur ut sit amet odio. Integer eleifend elementum nulla, sed accumsan diam mattis vel.'

const ModalPage = () => {
  // isModalOpen lives HERE, in the parent of both the Button that opens it
  // and the Modal itself.
  const [modalOpen, setModalOpen] = useState(false)

  const handleClick = () => setModalOpen(true)
  const handleCloseClick = () => setModalOpen(false)

  const modalContent = <p>This is modal content populated by the children prop!</p>

  // Passing the buttons in as a prop means the same Modal can be a confirm
  // dialog, a wizard step, or anything else.
  const actionBar = (
    <>
      <Button
        success
        outline
        onClick={() => console.log('other button function fired!')}
        className="mr-8"
      >
        Some Prompt...
      </Button>
      <Button danger outline onClick={handleCloseClick}>
        Close Modal
      </Button>
    </>
  )

  return (
    <div>
      {/* enough text to make the page scroll, so we can see why `fixed`
          matters and why we lock body scroll */}
      {[...Array(8)].map((_, i) => (
        <p key={i} className="mb-4">
          {LIPSUM}
        </p>
      ))}

      <Button onClick={handleClick} success rounded>
        Open Modal!
      </Button>

      {modalOpen && (
        <Modal onClose={handleCloseClick} actionBar={actionBar} crazy>
          {modalContent}
        </Modal>
      )}
    </div>
  )
}

export default ModalPage
```

</details>

---

**Where we landed:** four components in a routed library, and a Modal that renders into its own spot in the page, locks scrolling while it's open, and lets whoever uses it decide what goes inside.

**The pattern to remember:** `children` and props like `actionBar` let a component leave *holes* for the caller to fill. The Modal doesn't know whether it's a confirm dialog or a sign-up form, and it doesn't need to.

**Homework:** see [HW.md](HW.md).

Next week: fetching real data from an API.
