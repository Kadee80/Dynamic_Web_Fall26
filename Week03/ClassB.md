# Week 04 — The Accordion, and where state lives

*Building an Accordion, and deciding where state belongs · ~90 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

Today: a second component for the library — an Accordion — and the first one that has to remember something between clicks.

We pick up exactly where class A ended. If you missed it or your project is in a strange state, copy `starter/comp-lib` again and work through [ClassA.md](ClassA.md) first.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [Pick up where we left off](#step-1)
2. [What are we building?](#step-2)
3. [The state design process](#step-3)
4. [useState and the click handler](#step-4)
5. [Conditional rendering: && ](#step-5)
6. [Conditional rendering: the ternary](#step-6)

---

<a id="step-1"></a>

## Step 1 — Pick up where we left off

Your project from last class, still running. Nothing to copy unless yours is in a mess — in which case grab `starter/comp-lib` and run through `ClassA.md` first.

Quick recap before we add anything: what does `Button` actually do for us, and what were the three libraries for?

```bash
cd ~/your-hw-repo/comp-lib
npm run dev
```

---

<a id="step-2"></a>

## Step 2 — What are we building?

An Accordion: a list of sections, one open at a time, clicking a header expands it and collapses the others.

It takes an `items` array — each with an `id`, a `label` and some `content`. Same shape as our recipe data: **the component knows nothing about chickens.** Pass it FAQ entries, a changelog, course modules — it doesn't care.

Start with dummy data and render it flat, everything visible. No state yet.

**`src/components/Accordion.jsx`**  — new file

```jsx
const Accordion = (props) => {
  const {items} = props

  // Everything visible, no interactivity. Get the markup right first.
  const renderedItems = items.map((item) => {
    return (
      <div key={item.id}>
        <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
          {item.label}
        </div>
        <div className="border-b p-5">{item.content}</div>
      </div>
    )
  })

  return <div>{renderedItems}</div>
}

export default Accordion
```

**`src/pages/AccordionPage.jsx`**  — new file

```jsx
import Accordion from '../components/Accordion'

const ITEMS = [
  {
    id: '123',
    label: 'How many chickens should I own?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sed maximus nunc, a scelerisque erat. Curabitur dapibus mauris ut eros vestibulum lacinia at in nisi. Praesent gravida lacus pharetra, aliquet diam et, aliquam leo.',
  },
  {
    id: '456',
    label: 'Do I need a rooster?',
    content:
      'Quisque vestibulum faucibus volutpat. Sed vitae elementum libero. Quisque accumsan erat eget nisl maximus, vel pulvinar nisl vestibulum. In hac habitasse platea dictumst.',
  },
  {
    id: 'l1kj2i0g',
    label: 'When do chickens molt?',
    content:
      'Duis eget turpis vel ligula imperdiet suscipit eu ut felis. Ut eget neque at ligula aliquam ultricies eu vitae dolor. Proin eu dignissim velit. Morbi convallis volutpat nisl at vulputate.',
  },
]

const AccordionPage = () => {
  return (
    <div>
      <h1 className="text-3xl mb-4">Accordion Page</h1>
      <Accordion items={ITEMS} />
    </div>
  )
}

export default AccordionPage
```

**`src/App.jsx`**

What changed:

```diff
@@ -1,8 +1,13 @@
 import ButtonPage from './pages/ButtonPage'
+import AccordionPage from './pages/AccordionPage'
 
+// Right now App is doing the job of a page. Next week we add routes
+// so each of these gets its own url.
 const App = () => {
   return (
     <div className="container mx-auto mt-4">
       <ButtonPage />
+      <hr className="my-8" />
+      <AccordionPage />
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import ButtonPage from './pages/ButtonPage'
import AccordionPage from './pages/AccordionPage'

// Right now App is doing the job of a page. Next week we add routes
// so each of these gets its own url.
const App = () => {
  return (
    <div className="container mx-auto mt-4">
      <ButtonPage />
      <hr className="my-8" />
      <AccordionPage />
    </div>
  )
}

export default App
```

</details>

---

<a id="step-3"></a>

## Step 3 — The state design process

**Stop before writing `useState`.** Five questions, every time — this is the part that transfers to every component you'll ever build.

**1. Describe the user flow.** *A user clicks a section header; that section expands and the others collapse.*

**2. Split it: what's an action, what's a change on screen?** Actions become event handlers. Things that change on screen become state.

**3. What's the smallest thing you can store?** Not "which items are open" — one at a time, so a single **index** is enough.

**4. Name it.** `expandedIndex`, and `handleClick` for the handler. Convention, not law, but stick to it.

**5. Where does it live?** Does anything else reasonably need it? No — so it lives inside `Accordion`. And the handler goes wherever the state it changes lives.

No code this step. Work it out on the board first.

---

<a id="step-4"></a>

## Step 4 — useState and the click handler

Now the code writes itself. `expandedIndex` starts at `-1` — an index no item has, so everything starts closed.

`handleClick` takes the index that was clicked. If it's already the open one, go back to `-1` (clicking an open section closes it); otherwise open it.

Note the **updater function** form: `setExpandedIndex(current => …)`. When your new value depends on the current one, this is the form that's always correct.

**`src/components/Accordion.jsx`**

What changed:

```diff
@@ -1,10 +1,28 @@
+import {useState} from 'react'
+
 const Accordion = (props) => {
   const {items} = props
 
-  // Everything visible, no interactivity. Get the markup right first.
-  const renderedItems = items.map((item) => {
+  // Which item is open? -1 means "none of them".
+  const [expandedIndex, setExpandedIndex] = useState(-1)
+
+  const handleClick = (nextIndex) => {
+    // when the new value depends on the current one, use this form
+    setExpandedIndex((currentExpandedIndex) => {
+      // clicking the open item closes it
+      if (currentExpandedIndex === nextIndex) {
+        return -1
+      }
+      return nextIndex
+    })
+  }
+
+  const renderedItems = items.map((item, index) => {
     return (
       <div key={item.id}>
-        <div className="flex justify-between items-center p-3 bg-gray-100 border-b">
+        <div
+          onClick={() => handleClick(index)}
+          className="flex justify-between items-center p-3 bg-gray-100 border-b cursor-pointer"
+        >
           {item.label}
         </div>
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'

const Accordion = (props) => {
  const {items} = props

  // Which item is open? -1 means "none of them".
  const [expandedIndex, setExpandedIndex] = useState(-1)

  const handleClick = (nextIndex) => {
    // when the new value depends on the current one, use this form
    setExpandedIndex((currentExpandedIndex) => {
      // clicking the open item closes it
      if (currentExpandedIndex === nextIndex) {
        return -1
      }
      return nextIndex
    })
  }

  const renderedItems = items.map((item, index) => {
    return (
      <div key={item.id}>
        <div
          onClick={() => handleClick(index)}
          className="flex justify-between items-center p-3 bg-gray-100 border-b cursor-pointer"
        >
          {item.label}
        </div>
        <div className="border-b p-5">{item.content}</div>
      </div>
    )
  })

  return <div>{renderedItems}</div>
}

export default Accordion
```

</details>

---

<a id="step-5"></a>

## Step 5 — Conditional rendering: && 

Now use the state. For each item, `isExpanded` is just `index === expandedIndex`.

We don't hide the closed content with CSS — we **don't render it at all**. `isExpanded && <div>…</div>` evaluates to `false` when closed, and React renders nothing for `false`, `null` or `undefined`.

Same technique as the recipe card's `[+]` and `[-]` buttons. You'll use it constantly.

**`src/components/Accordion.jsx`**

What changed:

```diff
@@ -19,4 +19,6 @@
 
   const renderedItems = items.map((item, index) => {
+    const isExpanded = index === expandedIndex
+
     return (
       <div key={item.id}>
@@ -27,5 +29,6 @@
           {item.label}
         </div>
-        <div className="border-b p-5">{item.content}</div>
+        {/* conditional rendering: the content div only exists when open */}
+        {isExpanded && <div className="border-b p-5">{item.content}</div>}
       </div>
     )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'

const Accordion = (props) => {
  const {items} = props

  // Which item is open? -1 means "none of them".
  const [expandedIndex, setExpandedIndex] = useState(-1)

  const handleClick = (nextIndex) => {
    // when the new value depends on the current one, use this form
    setExpandedIndex((currentExpandedIndex) => {
      // clicking the open item closes it
      if (currentExpandedIndex === nextIndex) {
        return -1
      }
      return nextIndex
    })
  }

  const renderedItems = items.map((item, index) => {
    const isExpanded = index === expandedIndex

    return (
      <div key={item.id}>
        <div
          onClick={() => handleClick(index)}
          className="flex justify-between items-center p-3 bg-gray-100 border-b cursor-pointer"
        >
          {item.label}
        </div>
        {/* conditional rendering: the content div only exists when open */}
        {isExpanded && <div className="border-b p-5">{item.content}</div>}
      </div>
    )
  })

  return <div>{renderedItems}</div>
}

export default Accordion
```

</details>

---

<a id="step-6"></a>

## Step 6 — Conditional rendering: the ternary

The header needs an icon that points down when open and left when closed. `&&` can't do that — it renders something or nothing, and here we always want *one of two things*.

That's a **ternary**: `condition ? whenTrue : whenFalse`.

Two ways to choose, and they're not interchangeable:

- `&&` — show this, or show nothing
- `? :` — show this, or show that

**`src/components/Accordion.jsx`**

What changed:

```diff
@@ -1,3 +1,4 @@
 import {useState} from 'react'
+import {GoChevronDown, GoChevronLeft} from 'react-icons/go'
 
 const Accordion = (props) => {
@@ -21,4 +22,11 @@
     const isExpanded = index === expandedIndex
 
+    // a ternary:  condition ? whenTrue : whenFalse
+    const icon = (
+      <span className="text-2xl">
+        {isExpanded ? <GoChevronDown /> : <GoChevronLeft />}
+      </span>
+    )
+
     return (
       <div key={item.id}>
@@ -28,4 +36,5 @@
         >
           {item.label}
+          {icon}
         </div>
         {/* conditional rendering: the content div only exists when open */}
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import {GoChevronDown, GoChevronLeft} from 'react-icons/go'

const Accordion = (props) => {
  const {items} = props

  // Which item is open? -1 means "none of them".
  const [expandedIndex, setExpandedIndex] = useState(-1)

  const handleClick = (nextIndex) => {
    // when the new value depends on the current one, use this form
    setExpandedIndex((currentExpandedIndex) => {
      // clicking the open item closes it
      if (currentExpandedIndex === nextIndex) {
        return -1
      }
      return nextIndex
    })
  }

  const renderedItems = items.map((item, index) => {
    const isExpanded = index === expandedIndex

    // a ternary:  condition ? whenTrue : whenFalse
    const icon = (
      <span className="text-2xl">
        {isExpanded ? <GoChevronDown /> : <GoChevronLeft />}
      </span>
    )

    return (
      <div key={item.id}>
        <div
          onClick={() => handleClick(index)}
          className="flex justify-between items-center p-3 bg-gray-100 border-b cursor-pointer"
        >
          {item.label}
          {icon}
        </div>
        {/* conditional rendering: the content div only exists when open */}
        {isExpanded && <div className="border-b p-5">{item.content}</div>}
      </div>
    )
  })

  return <div>{renderedItems}</div>
}

export default Accordion
```

</details>

---

**Where we landed:** a component that takes data, tracks its own state, and renders conditionally — and a repeatable process for deciding what state you need and where it goes.

**Homework:** build your own reusable component and a page that demos it. Bootstrap's component list is a good source of ideas. Apply the same five questions before you write any code.

Next week: routes, so each of these pages gets its own url.
