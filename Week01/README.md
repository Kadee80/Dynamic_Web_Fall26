# Week 01 — Hello React

*From an empty folder to a component rendering on screen · ~25 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

Today we go from an empty folder to a React component rendering on screen. Type every line rather than pasting — the muscle memory matters more than you'd think, and you'll be doing this from scratch again next week.

If something breaks, that's the class working as intended. Read the error, then check [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [Make the project](#step-1)
2. [Look around, then clear it out](#step-2)
3. [Empty main.jsx, then import the two libraries](#step-3)
4. [Grab the root div and hand it to React](#step-4)
5. [Our first component](#step-5)
6. [JSX rule: one parent element](#step-6)
7. [Curly braces: dropping JavaScript into JSX](#step-7)
8. [Move App into its own file](#step-8)
9. [Import it back, and wrap it in StrictMode](#step-9)

---

<a id="step-1"></a>

## Step 1 — Make the project

Vite scaffolds the project for us. The `--` before `--template` is not a typo — it tells npm that the flag belongs to Vite, not to npm.

```bash
npm create vite@latest hello-react -- --template react
cd hello-react
npm install
npm run dev
```

---

<a id="step-2"></a>

## Step 2 — Look around, then clear it out

Vite gives us a demo app. We are going to delete it and rebuild it by hand, because the whole point today is that you know what every line does.

Three files matter:

- **`index.html`** — a real HTML page, at the top level where you can see it. React renders into that one empty `<div id="root">`.
- **`src/main.jsx`** — the first JavaScript that runs.
- **`package.json`** — our dependency list and our npm scripts.

```bash
rm src/App.css src/index.css
rm -rf src/assets
```

---

<a id="step-3"></a>

## Step 3 — Empty main.jsx, then import the two libraries

Delete everything in `main.jsx` and start over.

`react` is the library that knows how components work. `react-dom` is the part that knows how to put them in a **browser**. If we were building a phone app, that second import would be React Native instead — same React, different renderer.

**`src/main.jsx`**  — new file

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
```

---

<a id="step-4"></a>

## Step 4 — Grab the root div and hand it to React

`document.getElementById` is plain old JavaScript — the same line you'd write without React. That is the handoff point. From here down, React owns that div and we stop touching the DOM ourselves.

This is the last time this semester you will see `getElementById`.

**`src/main.jsx`**

What changed:

```diff
@@ -2,2 +2,8 @@
 import ReactDOM from 'react-dom/client'
 
+// Plain JavaScript: find the empty div in index.html.
+const el = document.getElementById('root')
+
+// Hand it to React. From here on, React owns this div.
+const root = ReactDOM.createRoot(el)
+
```

<details>
<summary>Full file after this step</summary>

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

// Plain JavaScript: find the empty div in index.html.
const el = document.getElementById('root')

// Hand it to React. From here on, React owns this div.
const root = ReactDOM.createRoot(el)
```

</details>

---

<a id="step-5"></a>

## Step 5 — Our first component

A component is **a function that returns JSX**. That is the whole definition. It is not a class, it is not magic, it is a function.

The name **must** start with a capital letter. That is how React tells your components apart from real html tags — lowercase `<div>` means the browser element, uppercase `<App>` means your function.

**`src/main.jsx`**

What changed:

```diff
@@ -8,2 +8,11 @@
 const root = ReactDOM.createRoot(el)
 
+// A component is a function that returns JSX.
+// The name MUST be capitalised.
+function App() {
+  return <h1>Hello World!</h1>
+}
+
+// Render it into the div we just handed over.
+root.render(<App />)
+
```

<details>
<summary>Full file after this step</summary>

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

// Plain JavaScript: find the empty div in index.html.
const el = document.getElementById('root')

// Hand it to React. From here on, React owns this div.
const root = ReactDOM.createRoot(el)

// A component is a function that returns JSX.
// The name MUST be capitalised.
function App() {
  return <h1>Hello World!</h1>
}

// Render it into the div we just handed over.
root.render(<App />)
```

</details>

---

<a id="step-6"></a>

## Step 6 — JSX rule: one parent element

Try adding a second line and it breaks. A component returns **one** thing, so two sibling elements need a parent to wrap them.

The wrapper can be a real `<div>`, or — if you don't want an extra div in your markup — an empty `<>...</>` fragment.

**`src/main.jsx`**

What changed:

```diff
@@ -11,5 +11,11 @@
 // The name MUST be capitalised.
 function App() {
-  return <h1>Hello World!</h1>
+  // A component returns ONE element. Siblings need a parent.
+  return (
+    <div>
+      <h1>Hello World!</h1>
+      <p>Change this text, hit save, and watch the browser update by itself.</p>
+    </div>
+  )
 }
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

// Plain JavaScript: find the empty div in index.html.
const el = document.getElementById('root')

// Hand it to React. From here on, React owns this div.
const root = ReactDOM.createRoot(el)

// A component is a function that returns JSX.
// The name MUST be capitalised.
function App() {
  // A component returns ONE element. Siblings need a parent.
  return (
    <div>
      <h1>Hello World!</h1>
      <p>Change this text, hit save, and watch the browser update by itself.</p>
    </div>
  )
}

// Render it into the div we just handed over.
root.render(<App />)
```

</details>

---

<a id="step-7"></a>

## Step 7 — Curly braces: dropping JavaScript into JSX

Curly braces mean *stop reading this as markup, start reading it as JavaScript*. Anything that produces a value can go in there — a variable, `2 + 2`, a function call.

This is the hinge the whole course turns on. Right now the value is hardcoded; in two weeks it comes from data, and after that it comes from state and changes when the user clicks something.

**`src/main.jsx`**

What changed:

```diff
@@ -8,4 +8,6 @@
 const root = ReactDOM.createRoot(el)
 
+const student = 'World'
+
 // A component is a function that returns JSX.
 // The name MUST be capitalised.
@@ -14,5 +16,6 @@
   return (
     <div>
-      <h1>Hello World!</h1>
+      {/* curly braces = 'this bit is JavaScript' */}
+      <h1>Hello {student}!</h1>
       <p>Change this text, hit save, and watch the browser update by itself.</p>
     </div>
```

<details>
<summary>Full file after this step</summary>

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

// Plain JavaScript: find the empty div in index.html.
const el = document.getElementById('root')

// Hand it to React. From here on, React owns this div.
const root = ReactDOM.createRoot(el)

const student = 'World'

// A component is a function that returns JSX.
// The name MUST be capitalised.
function App() {
  // A component returns ONE element. Siblings need a parent.
  return (
    <div>
      {/* curly braces = 'this bit is JavaScript' */}
      <h1>Hello {student}!</h1>
      <p>Change this text, hit save, and watch the browser update by itself.</p>
    </div>
  )
}

// Render it into the div we just handed over.
root.render(<App />)
```

</details>

---

<a id="step-8"></a>

## Step 8 — Move App into its own file

Real projects put one component per file. Make `src/App.jsx` and move the component into it.

`export default` means *this is the main thing this file offers*. A file can have exactly one default export.

**`src/App.jsx`**  — new file

```jsx
const student = 'World'

// A component is a function that returns JSX.
// The name MUST be capitalised.
function App() {
  // A component returns ONE element. Siblings need a parent.
  return (
    <div>
      {/* curly braces = 'this bit is JavaScript' */}
      <h1>Hello {student}!</h1>
      <p>Change this text, hit save, and watch the browser update by itself.</p>
    </div>
  )
}

// Export it so other files can import it.
export default App
```

**`src/main.jsx`**

What changed:

```diff
@@ -8,19 +8,4 @@
 const root = ReactDOM.createRoot(el)
 
-const student = 'World'
-
-// A component is a function that returns JSX.
-// The name MUST be capitalised.
-function App() {
-  // A component returns ONE element. Siblings need a parent.
-  return (
-    <div>
-      {/* curly braces = 'this bit is JavaScript' */}
-      <h1>Hello {student}!</h1>
-      <p>Change this text, hit save, and watch the browser update by itself.</p>
-    </div>
-  )
-}
-
 // Render it into the div we just handed over.
 root.render(<App />)
```

<details>
<summary>Full file after this step</summary>

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

// Plain JavaScript: find the empty div in index.html.
const el = document.getElementById('root')

// Hand it to React. From here on, React owns this div.
const root = ReactDOM.createRoot(el)

// Render it into the div we just handed over.
root.render(<App />)
```

</details>

---

<a id="step-9"></a>

## Step 9 — Import it back, and wrap it in StrictMode

`import App from './App'` — no curly braces, because it was a **default** export. (Named exports need braces. You'll meet those next week and it will trip you up once.)

`<React.StrictMode>` is a development-only helper that warns you about sketchy patterns. It does nothing in the built version. Leave it on.

**`src/main.jsx`**

What changed:

```diff
@@ -1,4 +1,8 @@
 import React from 'react'
 import ReactDOM from 'react-dom/client'
+
+// No curly braces: App was a DEFAULT export.
+// './' means 'a file next to this one', not a package.
+import App from './App'
 
 // Plain JavaScript: find the empty div in index.html.
@@ -9,4 +13,9 @@
 
 // Render it into the div we just handed over.
-root.render(<App />)
+// StrictMode is a dev-only helper that warns about bad patterns.
+root.render(
+  <React.StrictMode>
+    <App />
+  </React.StrictMode>
+)
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

// No curly braces: App was a DEFAULT export.
// './' means 'a file next to this one', not a package.
import App from './App'

// Plain JavaScript: find the empty div in index.html.
const el = document.getElementById('root')

// Hand it to React. From here on, React owns this div.
const root = ReactDOM.createRoot(el)

// Render it into the div we just handed over.
// StrictMode is a dev-only helper that warns about bad patterns.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

</details>

---

**You just built a React app from nothing.** Every line in `main.jsx` is there because you put it there and you know what it does.

Next: [HW.md](HW.md) — build a recipe card in plain HTML. Next class we turn *your* file into a React app.
