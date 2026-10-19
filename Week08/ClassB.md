# Week 08 — Forms, properly

*Controlled inputs, validation, and errors that help · ~110 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

Everything you build from here on has a form in it, and your midterm needs at least one new field in one. So today: forms, properly.

We are building a **reading list** — a new little project, not your midterm. One form with every kind of input in it: text, number, select, checkbox, range, date, textarea. Then validation, then error messages that are actually helpful, then the thing that stops a double-click from saving twice.

**Do not build this in your midterm project.** Build it here, where breaking it costs you nothing, then take the pattern over.

By the end you will have a form that behaves like software people have used before, and a checklist for adding a field to the todo list.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [A form that does nothing](#step-1)
2. [Stopping the browser](#step-2)
3. [One object, one handler](#step-3)
4. [Number, select, date, textarea](#step-4)
5. [The checkbox, which is different](#step-5)
6. [Handing the data up, and clearing the form](#step-6)
7. [What the browser gives you free](#step-7)
8. [Our own rules, in one function](#step-8)
9. [Errors at the right moment](#step-9)
10. [Errors that reach everybody](#step-10)
11. [Submitting once, and failing gracefully](#step-11)
12. [Adding a field to your midterm](#step-12)
13. [Controlled, uncontrolled, and libraries](#step-13)

---

<a id="step-1"></a>

## Step 1 — A form that does nothing

A new project, and a form made of plain HTML. No state, no handlers.

Two things in the markup are not decoration:

- **`htmlFor` on every label, matching the input's `id`.** Click the word "Title" and the field focuses. Without it, a screen reader announces an unlabelled text box and the user has no idea what it wants.
- **`name` on every input.** It looks pointless in React. In two steps it is doing most of the work.

Fill both fields in and press Add book. **The page reloads and your typing vanishes** — that is the browser doing what forms did before JavaScript existed.

```bash
cd ~/your-hw-repo
npm create vite@latest week08-forms -- --template react
cd week08-forms
npm install
npm install -D tailwindcss @tailwindcss/vite
npm run dev
```

**`package.json`**  — new file

```
{
  "name": "forms-deep-dive",
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
    <title>Reading List</title>
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
import BookForm from './components/BookForm'

const App = () => {
  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Reading List</h1>
      <BookForm />
    </div>
  )
}

export default App
```

**`src/components/BookForm.jsx`**  — new file

```jsx
// No state, no handlers. Plain HTML, in JSX.
const BookForm = () => {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="author">
          Author
        </label>
        <input
          id="author"
          name="author"
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
        Add book
      </button>
    </form>
  )
}

export default BookForm
```

---

<a id="step-2"></a>

## Step 2 — Stopping the browser

`onSubmit` on the **form**, not `onClick` on the button — so pressing Enter in a text field works too, which is how half your users submit forms.

```jsx
event.preventDefault()
```

That one line stops the reload. It is the single most forgotten line in React.

Now submit again. No reload, and a message in the console. But look at what we can log: **nothing.** The user's text is in the DOM, and React has no idea what it says. That is the problem the next step solves.

**`src/components/BookForm.jsx`**

What changed:

```diff
@@ -1,6 +1,12 @@
-// No state, no handlers. Plain HTML, in JSX.
 const BookForm = () => {
+  const handleSubmit = (event) => {
+    // Without this, the browser submits the form the 1998 way: it sends a
+    // request and reloads the page. Everything React knows is thrown away.
+    event.preventDefault()
+    console.log('submitted -- but with what?')
+  }
+
   return (
-    <form className="space-y-4">
+    <form onSubmit={handleSubmit} className="space-y-4">
       <div>
         <label className="block text-sm font-medium" htmlFor="title">
```

<details>
<summary>Full file after this step</summary>

```jsx
const BookForm = () => {
  const handleSubmit = (event) => {
    // Without this, the browser submits the form the 1998 way: it sends a
    // request and reloads the page. Everything React knows is thrown away.
    event.preventDefault()
    console.log('submitted -- but with what?')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="author">
          Author
        </label>
        <input
          id="author"
          name="author"
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
        Add book
      </button>
    </form>
  )
}

export default BookForm
```

</details>

---

<a id="step-3"></a>

## Step 3 — One object, one handler

The part of today you will reuse most.

**One state object for the whole form**, not one `useState` per field. Eight fields that are always filled in together, submitted together, and cleared together — which is exactly the signal we talked about on Tuesday.

And **one handler for all of them**:

```jsx
const handleChange = (event) => {
  const {name, value} = event.target
  setValues({
    ...values,
    [name]: value,
  })
}
```

Two things are happening:

- **`event.target.name`** is the input's `name` attribute. That is what it was for.
- **`[name]:`** is a *computed property name*. The square brackets mean "use the value of this variable as the key". Without them you would set a property literally called `name`.

Then `value={values.title}` makes each input **controlled**: state is the single source of truth, and the input only ever shows what state says.

Submit now and the console has your data.

**`src/components/BookForm.jsx`**

What changed:

```diff
@@ -1,8 +1,27 @@
+import {useState} from 'react'
+
 const BookForm = () => {
+  // ONE object for the whole form, not one useState per field. Eight fields
+  // that always move together -- the same signal we talked about on Tuesday.
+  const [values, setValues] = useState({
+    title: '',
+    author: '',
+  })
+
+  // One handler for every text field. `event.target.name` is the input's
+  // name attribute, and `[name]:` is a computed property -- it uses the
+  // VALUE of name as the key, so one function updates whichever field
+  // changed.
+  const handleChange = (event) => {
+    const {name, value} = event.target
+    setValues({
+      ...values,
+      [name]: value,
+    })
+  }
+
   const handleSubmit = (event) => {
-    // Without this, the browser submits the form the 1998 way: it sends a
-    // request and reloads the page. Everything React knows is thrown away.
     event.preventDefault()
-    console.log('submitted -- but with what?')
+    console.log(values)
   }
 
@@ -16,4 +35,6 @@
           id="title"
           name="title"
+          value={values.title}
+          onChange={handleChange}
           className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
         />
@@ -27,4 +48,6 @@
           id="author"
           name="author"
+          value={values.author}
+          onChange={handleChange}
           className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
         />
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'

const BookForm = () => {
  // ONE object for the whole form, not one useState per field. Eight fields
  // that always move together -- the same signal we talked about on Tuesday.
  const [values, setValues] = useState({
    title: '',
    author: '',
  })

  // One handler for every text field. `event.target.name` is the input's
  // name attribute, and `[name]:` is a computed property -- it uses the
  // VALUE of name as the key, so one function updates whichever field
  // changed.
  const handleChange = (event) => {
    const {name, value} = event.target
    setValues({
      ...values,
      [name]: value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="author">
          Author
        </label>
        <input
          id="author"
          name="author"
          value={values.author}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
        Add book
      </button>
    </form>
  )
}

export default BookForm
```

</details>

---

<a id="step-4"></a>

## Step 4 — Number, select, date, textarea

Four more field types, and all four use the same handler. Each one has a trap:

**`type="number"`** gives you a **string**. It changes the phone keyboard and adds spinners; it does not change the type. `'12' + 1` is `'121'`.

**`<select>`** is controlled on the *select*, with `value` and `onChange`. Do not put `selected` on an option — React will warn you and ignore it.

**`type="date"`** gives you a string shaped `YYYY-MM-DD`, and that is the only shape it will accept back. Store it exactly as it arrives and format it for display only.

**`<textarea>`** in JSX is controlled with `value`, not with text between the tags. HTML does it the other way round; React does not.

**`src/components/BookForm.jsx`**

What changed:

```diff
@@ -2,15 +2,13 @@
 
 const BookForm = () => {
-  // ONE object for the whole form, not one useState per field. Eight fields
-  // that always move together -- the same signal we talked about on Tuesday.
   const [values, setValues] = useState({
     title: '',
     author: '',
+    pages: '',
+    format: 'paperback',
+    dateStarted: '',
+    notes: '',
   })
 
-  // One handler for every text field. `event.target.name` is the input's
-  // name attribute, and `[name]:` is a computed property -- it uses the
-  // VALUE of name as the key, so one function updates whichever field
-  // changed.
   const handleChange = (event) => {
     const {name, value} = event.target
@@ -54,4 +52,72 @@
       </div>
 
+      {/* type=number still hands you a STRING. It changes the keyboard on a
+          phone and adds the little spinners -- it does not change the type. */}
+      <div>
+        <label className="block text-sm font-medium" htmlFor="pages">
+          Pages
+        </label>
+        <input
+          id="pages"
+          name="pages"
+          type="number"
+          min="1"
+          value={values.pages}
+          onChange={handleChange}
+          className="mt-1 w-32 rounded border border-gray-300 px-3 py-2"
+        />
+      </div>
+
+      {/* a select is controlled exactly like a text input: value + onChange
+          on the SELECT, never `selected` on an option */}
+      <div>
+        <label className="block text-sm font-medium" htmlFor="format">
+          Format
+        </label>
+        <select
+          id="format"
+          name="format"
+          value={values.format}
+          onChange={handleChange}
+          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
+        >
+          <option value="paperback">Paperback</option>
+          <option value="hardback">Hardback</option>
+          <option value="ebook">Ebook</option>
+          <option value="audio">Audiobook</option>
+        </select>
+      </div>
+
+      {/* type=date gives you a string shaped YYYY-MM-DD. Nothing else will
+          load into it, so store it exactly as it comes. */}
+      <div>
+        <label className="block text-sm font-medium" htmlFor="dateStarted">
+          Started
+        </label>
+        <input
+          id="dateStarted"
+          name="dateStarted"
+          type="date"
+          value={values.dateStarted}
+          onChange={handleChange}
+          className="mt-1 rounded border border-gray-300 px-3 py-2"
+        />
+      </div>
+
+      {/* a textarea in JSX is controlled with value, NOT with children */}
+      <div>
+        <label className="block text-sm font-medium" htmlFor="notes">
+          Notes
+        </label>
+        <textarea
+          id="notes"
+          name="notes"
+          rows="3"
+          value={values.notes}
+          onChange={handleChange}
+          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
+        />
+      </div>
+
       <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
         Add book
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'

const BookForm = () => {
  const [values, setValues] = useState({
    title: '',
    author: '',
    pages: '',
    format: 'paperback',
    dateStarted: '',
    notes: '',
  })

  const handleChange = (event) => {
    const {name, value} = event.target
    setValues({
      ...values,
      [name]: value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="author">
          Author
        </label>
        <input
          id="author"
          name="author"
          value={values.author}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      {/* type=number still hands you a STRING. It changes the keyboard on a
          phone and adds the little spinners -- it does not change the type. */}
      <div>
        <label className="block text-sm font-medium" htmlFor="pages">
          Pages
        </label>
        <input
          id="pages"
          name="pages"
          type="number"
          min="1"
          value={values.pages}
          onChange={handleChange}
          className="mt-1 w-32 rounded border border-gray-300 px-3 py-2"
        />
      </div>

      {/* a select is controlled exactly like a text input: value + onChange
          on the SELECT, never `selected` on an option */}
      <div>
        <label className="block text-sm font-medium" htmlFor="format">
          Format
        </label>
        <select
          id="format"
          name="format"
          value={values.format}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="paperback">Paperback</option>
          <option value="hardback">Hardback</option>
          <option value="ebook">Ebook</option>
          <option value="audio">Audiobook</option>
        </select>
      </div>

      {/* type=date gives you a string shaped YYYY-MM-DD. Nothing else will
          load into it, so store it exactly as it comes. */}
      <div>
        <label className="block text-sm font-medium" htmlFor="dateStarted">
          Started
        </label>
        <input
          id="dateStarted"
          name="dateStarted"
          type="date"
          value={values.dateStarted}
          onChange={handleChange}
          className="mt-1 rounded border border-gray-300 px-3 py-2"
        />
      </div>

      {/* a textarea in JSX is controlled with value, NOT with children */}
      <div>
        <label className="block text-sm font-medium" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          value={values.notes}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
        Add book
      </button>
    </form>
  )
}

export default BookForm
```

</details>

---

<a id="step-5"></a>

## Step 5 — The checkbox, which is different

A checkbox does not have a value in the sense you want. Its `value` attribute is a string that sits there whether or not the box is ticked — and if you never set one, it is the string `'on'`. Forever. Ticked or not.

What you want is **`checked`**:

```jsx
[name]: type === 'checkbox' ? checked : value,
```

One line in the handler, and every checkbox in the form works. The input takes **`checked={values.finished}`** instead of `value=`.

Note the label here **wraps** the input instead of pointing at it with `htmlFor`. Both are correct; wrapping makes the text clickable, which is what people expect from a checkbox.

And a **range** is a text input in a trench coat: `value` and `onChange`, and the value arrives as a string like everything else.

**`src/components/BookForm.jsx`**

What changed:

```diff
@@ -1,19 +1,26 @@
 import {useState} from 'react'
 
+const EMPTY = {
+  title: '',
+  author: '',
+  pages: '',
+  format: 'paperback',
+  finished: false,
+  rating: 3,
+  dateStarted: '',
+  notes: '',
+}
+
 const BookForm = () => {
-  const [values, setValues] = useState({
-    title: '',
-    author: '',
-    pages: '',
-    format: 'paperback',
-    dateStarted: '',
-    notes: '',
-  })
+  const [values, setValues] = useState(EMPTY)
 
   const handleChange = (event) => {
-    const {name, value} = event.target
+    const {name, value, type, checked} = event.target
     setValues({
       ...values,
-      [name]: value,
+      // A checkbox's `value` is not what you want -- it is whatever string
+      // sits in the value attribute, whether or not the box is ticked. The
+      // tick lives in `checked`.
+      [name]: type === 'checkbox' ? checked : value,
     })
   }
@@ -52,6 +59,4 @@
       </div>
 
-      {/* type=number still hands you a STRING. It changes the keyboard on a
-          phone and adds the little spinners -- it does not change the type. */}
       <div>
         <label className="block text-sm font-medium" htmlFor="pages">
@@ -69,6 +74,4 @@
       </div>
 
-      {/* a select is controlled exactly like a text input: value + onChange
-          on the SELECT, never `selected` on an option */}
       <div>
         <label className="block text-sm font-medium" htmlFor="format">
@@ -89,6 +92,37 @@
       </div>
 
-      {/* type=date gives you a string shaped YYYY-MM-DD. Nothing else will
-          load into it, so store it exactly as it comes. */}
+      {/* checked, not value. And the label wraps the input, so the words are
+          clickable too. */}
+      <div>
+        <label className="flex items-center gap-2 text-sm font-medium">
+          <input
+            name="finished"
+            type="checkbox"
+            checked={values.finished}
+            onChange={handleChange}
+            className="h-4 w-4"
+          />
+          Finished it
+        </label>
+      </div>
+
+      {/* a range is a text input in a trench coat: value and onChange, and
+          the value arrives as a string */}
+      <div>
+        <label className="block text-sm font-medium" htmlFor="rating">
+          Rating: {values.rating}/5
+        </label>
+        <input
+          id="rating"
+          name="rating"
+          type="range"
+          min="1"
+          max="5"
+          value={values.rating}
+          onChange={handleChange}
+          className="mt-1 w-full"
+        />
+      </div>
+
       <div>
         <label className="block text-sm font-medium" htmlFor="dateStarted">
@@ -105,5 +139,4 @@
       </div>
 
-      {/* a textarea in JSX is controlled with value, NOT with children */}
       <div>
         <label className="block text-sm font-medium" htmlFor="notes">
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'

const EMPTY = {
  title: '',
  author: '',
  pages: '',
  format: 'paperback',
  finished: false,
  rating: 3,
  dateStarted: '',
  notes: '',
}

const BookForm = () => {
  const [values, setValues] = useState(EMPTY)

  const handleChange = (event) => {
    const {name, value, type, checked} = event.target
    setValues({
      ...values,
      // A checkbox's `value` is not what you want -- it is whatever string
      // sits in the value attribute, whether or not the box is ticked. The
      // tick lives in `checked`.
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="author">
          Author
        </label>
        <input
          id="author"
          name="author"
          value={values.author}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="pages">
          Pages
        </label>
        <input
          id="pages"
          name="pages"
          type="number"
          min="1"
          value={values.pages}
          onChange={handleChange}
          className="mt-1 w-32 rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="format">
          Format
        </label>
        <select
          id="format"
          name="format"
          value={values.format}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="paperback">Paperback</option>
          <option value="hardback">Hardback</option>
          <option value="ebook">Ebook</option>
          <option value="audio">Audiobook</option>
        </select>
      </div>

      {/* checked, not value. And the label wraps the input, so the words are
          clickable too. */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            name="finished"
            type="checkbox"
            checked={values.finished}
            onChange={handleChange}
            className="h-4 w-4"
          />
          Finished it
        </label>
      </div>

      {/* a range is a text input in a trench coat: value and onChange, and
          the value arrives as a string */}
      <div>
        <label className="block text-sm font-medium" htmlFor="rating">
          Rating: {values.rating}/5
        </label>
        <input
          id="rating"
          name="rating"
          type="range"
          min="1"
          max="5"
          value={values.rating}
          onChange={handleChange}
          className="mt-1 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="dateStarted">
          Started
        </label>
        <input
          id="dateStarted"
          name="dateStarted"
          type="date"
          value={values.dateStarted}
          onChange={handleChange}
          className="mt-1 rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          value={values.notes}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
        Add book
      </button>
    </form>
  )
}

export default BookForm
```

</details>

---

<a id="step-6"></a>

## Step 6 — Handing the data up, and clearing the form

A form's job is to collect values and hand them to whoever asked. It should not know whether they end up in a list, in `json-server`, or in an email.

So `BookForm` takes an **`onAdd`** prop and calls it. `App` owns the array. In your midterm, `App` — or your Provider — owns the request.

Two details in `handleSubmit`:

**Cast on the way out, in one place:**

```jsx
pages: Number(values.pages) || 0,
rating: Number(values.rating),
```

Numbers stored as strings are why `"10"` sorts before `"9"` and why totals come out as `'12'` instead of `12`. Fix it at the boundary and the rest of your app can trust its own data.

**Reset by setting state back to `EMPTY`.** Every field reads its value from state, so one `setValues(EMPTY)` clears all eight. That is the payoff for controlled inputs.

**`src/App.jsx`**

What changed:

```diff
@@ -1,9 +1,21 @@
+import {useState} from 'react'
 import BookForm from './components/BookForm'
+import BookList from './components/BookList'
 
 const App = () => {
+  const [books, setBooks] = useState([])
+
+  // The form hands us a finished object. App decides what to do with it --
+  // which here is "put it in the list", and in your midterm is "send it to
+  // the server".
+  const addBook = (book) => {
+    setBooks([...books, {...book, id: Date.now()}])
+  }
+
   return (
     <div className="max-w-xl mx-auto p-8">
       <h1 className="text-3xl font-bold mb-6">Reading List</h1>
-      <BookForm />
+      <BookForm onAdd={addBook} />
+      <BookList books={books} />
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import BookForm from './components/BookForm'
import BookList from './components/BookList'

const App = () => {
  const [books, setBooks] = useState([])

  // The form hands us a finished object. App decides what to do with it --
  // which here is "put it in the list", and in your midterm is "send it to
  // the server".
  const addBook = (book) => {
    setBooks([...books, {...book, id: Date.now()}])
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Reading List</h1>
      <BookForm onAdd={addBook} />
      <BookList books={books} />
    </div>
  )
}

export default App
```

</details>

**`src/components/BookList.jsx`**  — new file

```jsx
const BookList = (props) => {
  const {books} = props

  if (books.length === 0) {
    return <p className="mt-8 text-gray-500">Nothing on the list yet.</p>
  }

  return (
    <ul className="mt-8 divide-y divide-gray-200">
      {books.map((book) => {
        return (
          <li key={book.id} className="py-3">
            <p className="font-medium">
              {book.title}
              {book.finished && <span className="ml-2 text-green-700">done</span>}
            </p>
            <p className="text-sm text-gray-600">
              {book.author} · {book.format} · {book.pages} pages · rated{' '}
              {book.rating}/5
            </p>
            {book.dateStarted && (
              <p className="text-sm text-gray-500">started {book.dateStarted}</p>
            )}
            {book.notes && <p className="mt-1 text-sm">{book.notes}</p>}
          </li>
        )
      })}
    </ul>
  )
}

export default BookList
```

**`src/components/BookForm.jsx`**

What changed:

```diff
@@ -12,5 +12,6 @@
 }
 
-const BookForm = () => {
+const BookForm = (props) => {
+  const {onAdd} = props
   const [values, setValues] = useState(EMPTY)
 
@@ -19,7 +20,4 @@
     setValues({
       ...values,
-      // A checkbox's `value` is not what you want -- it is whatever string
-      // sits in the value attribute, whether or not the box is ticked. The
-      // tick lives in `checked`.
       [name]: type === 'checkbox' ? checked : value,
     })
@@ -28,5 +26,16 @@
   const handleSubmit = (event) => {
     event.preventDefault()
-    console.log(values)
+
+    // Cast on the way OUT, in one place. Numbers stored as strings are the
+    // reason your sort puts "10" before "9".
+    onAdd({
+      ...values,
+      pages: Number(values.pages) || 0,
+      rating: Number(values.rating),
+    })
+
+    // setting state back to EMPTY clears every field, because every field
+    // is reading its value from state
+    setValues(EMPTY)
   }
 
@@ -92,6 +101,4 @@
       </div>
 
-      {/* checked, not value. And the label wraps the input, so the words are
-          clickable too. */}
       <div>
         <label className="flex items-center gap-2 text-sm font-medium">
@@ -107,6 +114,4 @@
       </div>
 
-      {/* a range is a text input in a trench coat: value and onChange, and
-          the value arrives as a string */}
       <div>
         <label className="block text-sm font-medium" htmlFor="rating">
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'

const EMPTY = {
  title: '',
  author: '',
  pages: '',
  format: 'paperback',
  finished: false,
  rating: 3,
  dateStarted: '',
  notes: '',
}

const BookForm = (props) => {
  const {onAdd} = props
  const [values, setValues] = useState(EMPTY)

  const handleChange = (event) => {
    const {name, value, type, checked} = event.target
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // Cast on the way OUT, in one place. Numbers stored as strings are the
    // reason your sort puts "10" before "9".
    onAdd({
      ...values,
      pages: Number(values.pages) || 0,
      rating: Number(values.rating),
    })

    // setting state back to EMPTY clears every field, because every field
    // is reading its value from state
    setValues(EMPTY)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={values.title}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="author">
          Author
        </label>
        <input
          id="author"
          name="author"
          value={values.author}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="pages">
          Pages
        </label>
        <input
          id="pages"
          name="pages"
          type="number"
          min="1"
          value={values.pages}
          onChange={handleChange}
          className="mt-1 w-32 rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="format">
          Format
        </label>
        <select
          id="format"
          name="format"
          value={values.format}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="paperback">Paperback</option>
          <option value="hardback">Hardback</option>
          <option value="ebook">Ebook</option>
          <option value="audio">Audiobook</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            name="finished"
            type="checkbox"
            checked={values.finished}
            onChange={handleChange}
            className="h-4 w-4"
          />
          Finished it
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="rating">
          Rating: {values.rating}/5
        </label>
        <input
          id="rating"
          name="rating"
          type="range"
          min="1"
          max="5"
          value={values.rating}
          onChange={handleChange}
          className="mt-1 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="dateStarted">
          Started
        </label>
        <input
          id="dateStarted"
          name="dateStarted"
          type="date"
          value={values.dateStarted}
          onChange={handleChange}
          className="mt-1 rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          value={values.notes}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
        Add book
      </button>
    </form>
  )
}

export default BookForm
```

</details>

---

<a id="step-7"></a>

## Step 7 — What the browser gives you free

Before writing any validation of our own: HTML has some built in, and it costs one attribute.

- **`required`** — the browser refuses to submit, and shows its own message
- **`maxLength`** — stops typing at the limit
- **`min` / `max`** on numbers and dates
- **`type="email"`** / **`type="url"`** — a real format check, free

Use these. They work before your JavaScript loads, they work if it fails, and they are what assistive technology expects.

**But they are not enough**, for three reasons:

1. The message is the browser's, in the browser's words, in the browser's position. You cannot style it or change it.
2. It can only check one field at a time. "If finished is ticked, a start date is required" is not expressible.
3. **It is not security.** Anyone can delete an attribute in devtools. Validation in the browser is a kindness to users; the server still has to check.

The character counter under Notes is the cheapest good idea in forms — `{values.notes.length}/200`, straight out of state.

**`src/components/BookForm.jsx`**

What changed:

```diff
@@ -26,7 +26,4 @@
   const handleSubmit = (event) => {
     event.preventDefault()
-
-    // Cast on the way OUT, in one place. Numbers stored as strings are the
-    // reason your sort puts "10" before "9".
     onAdd({
       ...values,
@@ -34,7 +31,4 @@
       rating: Number(values.rating),
     })
-
-    // setting state back to EMPTY clears every field, because every field
-    // is reading its value from state
     setValues(EMPTY)
   }
@@ -44,9 +38,13 @@
       <div>
         <label className="block text-sm font-medium" htmlFor="title">
-          Title
+          Title <span className="text-red-600">*</span>
         </label>
+        {/* `required` is free, and the browser will not let the form submit
+            without it. maxLength stops typing at the limit. */}
         <input
           id="title"
           name="title"
+          required
+          maxLength="120"
           value={values.title}
           onChange={handleChange}
@@ -57,9 +55,10 @@
       <div>
         <label className="block text-sm font-medium" htmlFor="author">
-          Author
+          Author <span className="text-red-600">*</span>
         </label>
         <input
           id="author"
           name="author"
+          required
           value={values.author}
           onChange={handleChange}
@@ -72,4 +71,6 @@
           Pages
         </label>
+        {/* min and max are checked by the browser too -- but only for values
+            typed into the field, not for ones pasted or set in code */}
         <input
           id="pages"
@@ -77,4 +78,5 @@
           type="number"
           min="1"
+          max="5000"
           value={values.pages}
           onChange={handleChange}
@@ -152,8 +154,12 @@
           name="notes"
           rows="3"
+          maxLength="200"
           value={values.notes}
           onChange={handleChange}
           className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
         />
+        <p className="mt-1 text-xs text-gray-500">
+          {values.notes.length}/200
+        </p>
       </div>
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'

const EMPTY = {
  title: '',
  author: '',
  pages: '',
  format: 'paperback',
  finished: false,
  rating: 3,
  dateStarted: '',
  notes: '',
}

const BookForm = (props) => {
  const {onAdd} = props
  const [values, setValues] = useState(EMPTY)

  const handleChange = (event) => {
    const {name, value, type, checked} = event.target
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onAdd({
      ...values,
      pages: Number(values.pages) || 0,
      rating: Number(values.rating),
    })
    setValues(EMPTY)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium" htmlFor="title">
          Title <span className="text-red-600">*</span>
        </label>
        {/* `required` is free, and the browser will not let the form submit
            without it. maxLength stops typing at the limit. */}
        <input
          id="title"
          name="title"
          required
          maxLength="120"
          value={values.title}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="author">
          Author <span className="text-red-600">*</span>
        </label>
        <input
          id="author"
          name="author"
          required
          value={values.author}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="pages">
          Pages
        </label>
        {/* min and max are checked by the browser too -- but only for values
            typed into the field, not for ones pasted or set in code */}
        <input
          id="pages"
          name="pages"
          type="number"
          min="1"
          max="5000"
          value={values.pages}
          onChange={handleChange}
          className="mt-1 w-32 rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="format">
          Format
        </label>
        <select
          id="format"
          name="format"
          value={values.format}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="paperback">Paperback</option>
          <option value="hardback">Hardback</option>
          <option value="ebook">Ebook</option>
          <option value="audio">Audiobook</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            name="finished"
            type="checkbox"
            checked={values.finished}
            onChange={handleChange}
            className="h-4 w-4"
          />
          Finished it
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="rating">
          Rating: {values.rating}/5
        </label>
        <input
          id="rating"
          name="rating"
          type="range"
          min="1"
          max="5"
          value={values.rating}
          onChange={handleChange}
          className="mt-1 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="dateStarted">
          Started
        </label>
        <input
          id="dateStarted"
          name="dateStarted"
          type="date"
          value={values.dateStarted}
          onChange={handleChange}
          className="mt-1 rounded border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          maxLength="200"
          value={values.notes}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
        <p className="mt-1 text-xs text-gray-500">
          {values.notes.length}/200
        </p>
      </div>

      <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
        Add book
      </button>
    </form>
  )
}

export default BookForm
```

</details>

---

<a id="step-8"></a>

## Step 8 — Our own rules, in one function

Validation belongs in **one function, outside the component**:

```jsx
const validate = (values) => {
  const errors = {}
  if (!values.title.trim()) {
    errors.title = 'A book needs a title.'
  }
  return errors
}
```

Values in, an object of messages out, keyed by field name. **An empty object means the form is good.** No `useState`, no React, nothing to mock — a function you could test on its own.

Three things to notice:

- **`.trim()`** — a title of three spaces is not a title.
- **the cross-field rule** — `if (values.finished && !values.dateStarted)`. This is the one HTML could not do.
- **`errors` is derived, not stored.** We call `validate` on every render rather than keeping a second copy in state. There is one source of truth — `values` — and everything else is worked out from it.

Write the messages like a person: *"Who wrote it?"*, not *"Error: author field invalid"*.

**`src/components/BookForm.jsx`**

What changed:

```diff
@@ -12,7 +12,40 @@
 }
 
+// Our rules, in one function, outside the component. Values in, an object of
+// messages out. An empty object means the form is good.
+const validate = (values) => {
+  const errors = {}
+
+  if (!values.title.trim()) {
+    errors.title = 'A book needs a title.'
+  }
+
+  if (!values.author.trim()) {
+    errors.author = 'Who wrote it?'
+  }
+
+  if (values.pages !== '' && Number(values.pages) < 1) {
+    errors.pages = 'Pages has to be at least 1.'
+  }
+
+  if (values.finished && !values.dateStarted) {
+    errors.dateStarted = 'If you finished it, when did you start?'
+  }
+
+  return errors
+}
+
 const BookForm = (props) => {
   const {onAdd} = props
   const [values, setValues] = useState(EMPTY)
+  const [touched, setTouched] = useState({})
+
+  const errors = validate(values)
+
+  // A message only shows once the user has LEFT that field. Telling someone
+  // "a book needs a title" while they are typing the T is just rude.
+  const showError = (field) => {
+    return touched[field] ? errors[field] : undefined
+  }
 
   const handleChange = (event) => {
@@ -24,6 +57,27 @@
   }
 
+  const handleBlur = (event) => {
+    setTouched({
+      ...touched,
+      [event.target.name]: true,
+    })
+  }
+
   const handleSubmit = (event) => {
     event.preventDefault()
+
+    // On submit, everything counts as touched -- otherwise a field they
+    // never visited fails silently.
+    setTouched({
+      title: true,
+      author: true,
+      pages: true,
+      dateStarted: true,
+    })
+
+    if (Object.keys(errors).length > 0) {
+      return
+    }
+
     onAdd({
       ...values,
@@ -32,23 +86,36 @@
     })
     setValues(EMPTY)
+    setTouched({})
+  }
+
+  const fieldClass = (field) => {
+    const base = 'mt-1 w-full rounded border px-3 py-2'
+    return showError(field)
+      ? `${base} border-red-500 bg-red-50`
+      : `${base} border-gray-300`
   }
 
   return (
-    <form onSubmit={handleSubmit} className="space-y-4">
+    <form onSubmit={handleSubmit} noValidate className="space-y-4">
       <div>
         <label className="block text-sm font-medium" htmlFor="title">
           Title <span className="text-red-600">*</span>
         </label>
-        {/* `required` is free, and the browser will not let the form submit
-            without it. maxLength stops typing at the limit. */}
         <input
           id="title"
           name="title"
-          required
           maxLength="120"
           value={values.title}
           onChange={handleChange}
-          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
-        />
+          onBlur={handleBlur}
+          aria-invalid={showError('title') ? true : undefined}
+          aria-describedby={showError('title') ? 'title-error' : undefined}
+          className={fieldClass('title')}
+        />
+        {showError('title') && (
+          <p id="title-error" className="mt-1 text-sm text-red-700">
+            {errors.title}
+          </p>
+        )}
       </div>
 
@@ -60,9 +127,16 @@
           id="author"
           name="author"
-          required
           value={values.author}
           onChange={handleChange}
-          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
-        />
+          onBlur={handleBlur}
+          aria-invalid={showError('author') ? true : undefined}
+          aria-describedby={showError('author') ? 'author-error' : undefined}
+          className={fieldClass('author')}
+        />
+        {showError('author') && (
+          <p id="author-error" className="mt-1 text-sm text-red-700">
+            {errors.author}
+          </p>
+        )}
       </div>
 
@@ -71,6 +145,4 @@
           Pages
         </label>
-        {/* min and max are checked by the browser too -- but only for values
-            typed into the field, not for ones pasted or set in code */}
         <input
           id="pages"
@@ -81,6 +153,14 @@
           value={values.pages}
           onChange={handleChange}
-          className="mt-1 w-32 rounded border border-gray-300 px-3 py-2"
-        />
+          onBlur={handleBlur}
+          aria-invalid={showError('pages') ? true : undefined}
+          aria-describedby={showError('pages') ? 'pages-error' : undefined}
+          className={fieldClass('pages')}
+        />
+        {showError('pages') && (
+          <p id="pages-error" className="mt-1 text-sm text-red-700">
+            {errors.pages}
+          </p>
+        )}
       </div>
 
@@ -142,6 +222,16 @@
           value={values.dateStarted}
           onChange={handleChange}
-          className="mt-1 rounded border border-gray-300 px-3 py-2"
-        />
+          onBlur={handleBlur}
+          aria-invalid={showError('dateStarted') ? true : undefined}
+          aria-describedby={
+            showError('dateStarted') ? 'dateStarted-error' : undefined
+          }
+          className={fieldClass('dateStarted')}
+        />
+        {showError('dateStarted') && (
+          <p id="dateStarted-error" className="mt-1 text-sm text-red-700">
+            {errors.dateStarted}
+          </p>
+        )}
       </div>
 
@@ -159,7 +249,5 @@
           className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
         />
-        <p className="mt-1 text-xs text-gray-500">
-          {values.notes.length}/200
-        </p>
+        <p className="mt-1 text-xs text-gray-500">{values.notes.length}/200</p>
       </div>
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'

const EMPTY = {
  title: '',
  author: '',
  pages: '',
  format: 'paperback',
  finished: false,
  rating: 3,
  dateStarted: '',
  notes: '',
}

// Our rules, in one function, outside the component. Values in, an object of
// messages out. An empty object means the form is good.
const validate = (values) => {
  const errors = {}

  if (!values.title.trim()) {
    errors.title = 'A book needs a title.'
  }

  if (!values.author.trim()) {
    errors.author = 'Who wrote it?'
  }

  if (values.pages !== '' && Number(values.pages) < 1) {
    errors.pages = 'Pages has to be at least 1.'
  }

  if (values.finished && !values.dateStarted) {
    errors.dateStarted = 'If you finished it, when did you start?'
  }

  return errors
}

const BookForm = (props) => {
  const {onAdd} = props
  const [values, setValues] = useState(EMPTY)
  const [touched, setTouched] = useState({})

  const errors = validate(values)

  // A message only shows once the user has LEFT that field. Telling someone
  // "a book needs a title" while they are typing the T is just rude.
  const showError = (field) => {
    return touched[field] ? errors[field] : undefined
  }

  const handleChange = (event) => {
    const {name, value, type, checked} = event.target
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleBlur = (event) => {
    setTouched({
      ...touched,
      [event.target.name]: true,
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // On submit, everything counts as touched -- otherwise a field they
    // never visited fails silently.
    setTouched({
      title: true,
      author: true,
      pages: true,
      dateStarted: true,
    })

    if (Object.keys(errors).length > 0) {
      return
    }

    onAdd({
      ...values,
      pages: Number(values.pages) || 0,
      rating: Number(values.rating),
    })
    setValues(EMPTY)
    setTouched({})
  }

  const fieldClass = (field) => {
    const base = 'mt-1 w-full rounded border px-3 py-2'
    return showError(field)
      ? `${base} border-red-500 bg-red-50`
      : `${base} border-gray-300`
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label className="block text-sm font-medium" htmlFor="title">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          id="title"
          name="title"
          maxLength="120"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError('title') ? true : undefined}
          aria-describedby={showError('title') ? 'title-error' : undefined}
          className={fieldClass('title')}
        />
        {showError('title') && (
          <p id="title-error" className="mt-1 text-sm text-red-700">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="author">
          Author <span className="text-red-600">*</span>
        </label>
        <input
          id="author"
          name="author"
          value={values.author}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError('author') ? true : undefined}
          aria-describedby={showError('author') ? 'author-error' : undefined}
          className={fieldClass('author')}
        />
        {showError('author') && (
          <p id="author-error" className="mt-1 text-sm text-red-700">
            {errors.author}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="pages">
          Pages
        </label>
        <input
          id="pages"
          name="pages"
          type="number"
          min="1"
          max="5000"
          value={values.pages}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError('pages') ? true : undefined}
          aria-describedby={showError('pages') ? 'pages-error' : undefined}
          className={fieldClass('pages')}
        />
        {showError('pages') && (
          <p id="pages-error" className="mt-1 text-sm text-red-700">
            {errors.pages}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="format">
          Format
        </label>
        <select
          id="format"
          name="format"
          value={values.format}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="paperback">Paperback</option>
          <option value="hardback">Hardback</option>
          <option value="ebook">Ebook</option>
          <option value="audio">Audiobook</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            name="finished"
            type="checkbox"
            checked={values.finished}
            onChange={handleChange}
            className="h-4 w-4"
          />
          Finished it
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="rating">
          Rating: {values.rating}/5
        </label>
        <input
          id="rating"
          name="rating"
          type="range"
          min="1"
          max="5"
          value={values.rating}
          onChange={handleChange}
          className="mt-1 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="dateStarted">
          Started
        </label>
        <input
          id="dateStarted"
          name="dateStarted"
          type="date"
          value={values.dateStarted}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError('dateStarted') ? true : undefined}
          aria-describedby={
            showError('dateStarted') ? 'dateStarted-error' : undefined
          }
          className={fieldClass('dateStarted')}
        />
        {showError('dateStarted') && (
          <p id="dateStarted-error" className="mt-1 text-sm text-red-700">
            {errors.dateStarted}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          maxLength="200"
          value={values.notes}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
        <p className="mt-1 text-xs text-gray-500">{values.notes.length}/200</p>
      </div>

      <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
        Add book
      </button>
    </form>
  )
}

export default BookForm
```

</details>

---

<a id="step-9"></a>

## Step 9 — Errors at the right moment

Same file as the last step — this is the part of it to talk about.

If you show every error immediately, the form screams at somebody who has typed one letter. **`touched`** fixes it:

```jsx
const [touched, setTouched] = useState({})

const handleBlur = (event) => {
  setTouched({
    ...touched,
    [event.target.name]: true,
  })
}
```

`onBlur` fires when a field **loses focus** — when the user has finished with it. So a message appears once they have moved on, not while they are mid-word.

```jsx
const showError = (field) => {
  return touched[field] ? errors[field] : undefined
}
```

And on submit, **everything becomes touched** — otherwise a field they never visited fails with no explanation, which is the worst case of all.

The red border comes from `fieldClass`, which builds its own class string. **Colour is never the only signal** — there is always a message in words as well. Roughly one man in twelve cannot reliably see that your border went red.

---

<a id="step-10"></a>

## Step 10 — Errors that reach everybody

Still the same file. Two attributes, and they are the difference between a form that works for everyone and one that works for people who can see it.

```jsx
aria-invalid={showError('title') ? true : undefined}
aria-describedby={showError('title') ? 'title-error' : undefined}
```

- **`aria-invalid`** tells assistive technology this field is wrong. That is what the red border means; this is how you say it out loud.
- **`aria-describedby`** points at the **`id` of the element holding the message**, so a screen reader reads the error straight after the field's name. Note the `id` on the error `<p>` — the link only works if those match.

Why `undefined` rather than `false`? Because `aria-describedby=""` is a broken reference, and React leaves an attribute out entirely when its value is `undefined`. The conditional is doing real work.

**Three rules worth keeping:** the message lives next to the field, not in a summary at the top; it says what to do, not that something is invalid; and the field keeps what the user typed. Never clear a field because it was wrong.

---

<a id="step-11"></a>

## Step 11 — Submitting once, and failing gracefully

A real save takes time and can fail. Two states, and the form stops lying to the user.

`App`'s `addBook` is now `async` with a deliberate delay standing in for the network — in your midterm that line is `await axios.post(...)`.

```jsx
const [isSubmitting, setIsSubmitting] = useState(false)
const [submitError, setSubmitError] = useState(null)
```

- **`disabled={isSubmitting}`** on the button. Without it, an impatient double-click sends two requests and saves two copies. This is a bug in production software you have used.
- **the button's text changes** — `Saving...` — so something visibly happened.
- **`try / catch / finally`** — and `finally` is how `isSubmitting` goes back to `false` whether the save worked or blew up. Without it, one failure leaves the button disabled forever.
- **clear the form only on success.** Look at where `setValues(EMPTY)` is: inside the `try`, after the `await`. If the save fails, their typing is still there — and the error message says so, because that is the first thing they will worry about.

**`src/App.jsx`**

What changed:

```diff
@@ -6,8 +6,9 @@
   const [books, setBooks] = useState([])
 
-  // The form hands us a finished object. App decides what to do with it --
-  // which here is "put it in the list", and in your midterm is "send it to
-  // the server".
-  const addBook = (book) => {
+  // `await`-able on purpose. In your midterm this is
+  // `await axios.post(...)` -- the delay here stands in for the network so we
+  // can see what the form does while it waits.
+  const addBook = async (book) => {
+    await new Promise((resolve) => setTimeout(resolve, 800))
     setBooks([...books, {...book, id: Date.now()}])
   }
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import BookForm from './components/BookForm'
import BookList from './components/BookList'

const App = () => {
  const [books, setBooks] = useState([])

  // `await`-able on purpose. In your midterm this is
  // `await axios.post(...)` -- the delay here stands in for the network so we
  // can see what the form does while it waits.
  const addBook = async (book) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    setBooks([...books, {...book, id: Date.now()}])
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Reading List</h1>
      <BookForm onAdd={addBook} />
      <BookList books={books} />
    </div>
  )
}

export default App
```

</details>

**`src/components/BookForm.jsx`**

What changed:

```diff
@@ -12,6 +12,4 @@
 }
 
-// Our rules, in one function, outside the component. Values in, an object of
-// messages out. An empty object means the form is good.
 const validate = (values) => {
   const errors = {}
@@ -40,9 +38,9 @@
   const [values, setValues] = useState(EMPTY)
   const [touched, setTouched] = useState({})
+  const [isSubmitting, setIsSubmitting] = useState(false)
+  const [submitError, setSubmitError] = useState(null)
 
   const errors = validate(values)
 
-  // A message only shows once the user has LEFT that field. Telling someone
-  // "a book needs a title" while they are typing the T is just rude.
   const showError = (field) => {
     return touched[field] ? errors[field] : undefined
@@ -64,9 +62,7 @@
   }
 
-  const handleSubmit = (event) => {
+  const handleSubmit = async (event) => {
     event.preventDefault()
 
-    // On submit, everything counts as touched -- otherwise a field they
-    // never visited fails silently.
     setTouched({
       title: true,
@@ -80,11 +76,22 @@
     }
 
-    onAdd({
-      ...values,
-      pages: Number(values.pages) || 0,
-      rating: Number(values.rating),
-    })
-    setValues(EMPTY)
-    setTouched({})
+    // The request can fail, and the user has to be told. Clearing the form
+    // before we know it worked is how people lose what they typed.
+    setIsSubmitting(true)
+    setSubmitError(null)
+    try {
+      await onAdd({
+        ...values,
+        pages: Number(values.pages) || 0,
+        rating: Number(values.rating),
+      })
+      setValues(EMPTY)
+      setTouched({})
+    } catch (err) {
+      console.error(err)
+      setSubmitError('Could not save that. Your text is still here -- try again.')
+    } finally {
+      setIsSubmitting(false)
+    }
   }
 
@@ -252,6 +259,15 @@
       </div>
 
-      <button className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
-        Add book
+      {submitError && (
+        <p className="rounded bg-red-50 p-3 text-sm text-red-700">
+          {submitError}
+        </p>
+      )}
+
+      <button
+        disabled={isSubmitting}
+        className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
+      >
+        {isSubmitting ? 'Saving...' : 'Add book'}
       </button>
     </form>
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'

const EMPTY = {
  title: '',
  author: '',
  pages: '',
  format: 'paperback',
  finished: false,
  rating: 3,
  dateStarted: '',
  notes: '',
}

const validate = (values) => {
  const errors = {}

  if (!values.title.trim()) {
    errors.title = 'A book needs a title.'
  }

  if (!values.author.trim()) {
    errors.author = 'Who wrote it?'
  }

  if (values.pages !== '' && Number(values.pages) < 1) {
    errors.pages = 'Pages has to be at least 1.'
  }

  if (values.finished && !values.dateStarted) {
    errors.dateStarted = 'If you finished it, when did you start?'
  }

  return errors
}

const BookForm = (props) => {
  const {onAdd} = props
  const [values, setValues] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const errors = validate(values)

  const showError = (field) => {
    return touched[field] ? errors[field] : undefined
  }

  const handleChange = (event) => {
    const {name, value, type, checked} = event.target
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleBlur = (event) => {
    setTouched({
      ...touched,
      [event.target.name]: true,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setTouched({
      title: true,
      author: true,
      pages: true,
      dateStarted: true,
    })

    if (Object.keys(errors).length > 0) {
      return
    }

    // The request can fail, and the user has to be told. Clearing the form
    // before we know it worked is how people lose what they typed.
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await onAdd({
        ...values,
        pages: Number(values.pages) || 0,
        rating: Number(values.rating),
      })
      setValues(EMPTY)
      setTouched({})
    } catch (err) {
      console.error(err)
      setSubmitError('Could not save that. Your text is still here -- try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fieldClass = (field) => {
    const base = 'mt-1 w-full rounded border px-3 py-2'
    return showError(field)
      ? `${base} border-red-500 bg-red-50`
      : `${base} border-gray-300`
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label className="block text-sm font-medium" htmlFor="title">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          id="title"
          name="title"
          maxLength="120"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError('title') ? true : undefined}
          aria-describedby={showError('title') ? 'title-error' : undefined}
          className={fieldClass('title')}
        />
        {showError('title') && (
          <p id="title-error" className="mt-1 text-sm text-red-700">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="author">
          Author <span className="text-red-600">*</span>
        </label>
        <input
          id="author"
          name="author"
          value={values.author}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError('author') ? true : undefined}
          aria-describedby={showError('author') ? 'author-error' : undefined}
          className={fieldClass('author')}
        />
        {showError('author') && (
          <p id="author-error" className="mt-1 text-sm text-red-700">
            {errors.author}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="pages">
          Pages
        </label>
        <input
          id="pages"
          name="pages"
          type="number"
          min="1"
          max="5000"
          value={values.pages}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError('pages') ? true : undefined}
          aria-describedby={showError('pages') ? 'pages-error' : undefined}
          className={fieldClass('pages')}
        />
        {showError('pages') && (
          <p id="pages-error" className="mt-1 text-sm text-red-700">
            {errors.pages}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="format">
          Format
        </label>
        <select
          id="format"
          name="format"
          value={values.format}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="paperback">Paperback</option>
          <option value="hardback">Hardback</option>
          <option value="ebook">Ebook</option>
          <option value="audio">Audiobook</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            name="finished"
            type="checkbox"
            checked={values.finished}
            onChange={handleChange}
            className="h-4 w-4"
          />
          Finished it
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="rating">
          Rating: {values.rating}/5
        </label>
        <input
          id="rating"
          name="rating"
          type="range"
          min="1"
          max="5"
          value={values.rating}
          onChange={handleChange}
          className="mt-1 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="dateStarted">
          Started
        </label>
        <input
          id="dateStarted"
          name="dateStarted"
          type="date"
          value={values.dateStarted}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={showError('dateStarted') ? true : undefined}
          aria-describedby={
            showError('dateStarted') ? 'dateStarted-error' : undefined
          }
          className={fieldClass('dateStarted')}
        />
        {showError('dateStarted') && (
          <p id="dateStarted-error" className="mt-1 text-sm text-red-700">
            {errors.dateStarted}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          maxLength="200"
          value={values.notes}
          onChange={handleChange}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
        />
        <p className="mt-1 text-xs text-gray-500">{values.notes.length}/200</p>
      </div>

      {submitError && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <button
        disabled={isSubmitting}
        className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Add book'}
      </button>
    </form>
  )
}

export default BookForm
```

</details>

---

<a id="step-12"></a>

## Step 12 — Adding a field to your midterm

**Read this one.** It is the midterm requirement, and it is four places. Miss one and the field half-works, which is harder to debug than a field that does not work at all.

**1. The create form.** The input, a `label` with `htmlFor`, the field in your state object, and `name` matching the key.

**2. The request.** In `api.js`, the field has to be in the body you send:

```js
export const createTodo = async (title, priority) => {
  const response = await axios.post(`${BASE}/todos`, {
    title,
    priority,
    done: false,
  })
  return response.data
}
```

Check `db.json` afterwards. If it is not in the file, it was never sent.

**3. The list.** Somewhere the user can see it. A field that is stored and never shown is not a feature.

**4. The edit form.** The one everybody forgets. It needs the input, and the existing value loaded in, and the field included in the update — and remember from Week 06 that **`PUT` replaces the whole record while `PATCH` merges**. A `PUT` missing your new field will quietly delete it.

Then **go back to the checklist you wrote** before you started, and write down what was actually needed. The gap between those two lists is part of what is being marked, and nobody's lists match.

---

<a id="step-13"></a>

## Step 13 — Controlled, uncontrolled, and libraries

Two honest footnotes.

**Uncontrolled inputs.** You can let the DOM keep the value and read it only on submit, with `FormData` or a `ref`. It is less code and it is genuinely fine for a search box. But you cannot validate as they type, cannot disable a button until the form is valid, and cannot show a character counter — because React does not know the value. **Controlled is the default for anything you care about.**

**Form libraries.** `react-hook-form` and `formik` exist, and a lot of real codebases use them. They do what we just did: values, touched, errors, submit state. For a twenty-field form with conditional sections, use one.

They are also unreadable until you have hand-rolled this once — which you now have. You know what `touched` is for, so `formState.touchedFields` is a name rather than a mystery.

**What to take away:** a form is state, a change handler, validation, and a submit that tells the truth about what is happening. Every library is a nicer way to write those four things.

---

**Where we landed:** one form, eight fields, one state object, one change handler, validation in a function you can read, and messages that appear when they are useful.

**The parts worth keeping:**

- **`event.preventDefault()`** — or the browser reloads the page and throws your state away
- **one state object**, not one `useState` per field
- **one `handleChange`**, using `event.target.name` and `[name]:` to update whichever field changed
- **`checked`, not `value`**, for checkboxes
- **cast on the way out** — `Number(values.pages)`, in one place, so a number is never stored as a string
- **`validate(values)`** — values in, an object of messages out; empty object means good
- **`touched`** — a message appears when you leave a field, not while you are typing in it
- **`aria-invalid` and `aria-describedby`** — so the error reaches people who cannot see the red border
- **`disabled={isSubmitting}`** — and do not clear the form until the save worked

**Adding a field to your midterm — the four places:**

1. the **create form** — state, input, label
2. the **request** — your `api.js`, so the server stores it
3. the **list** — somewhere it is actually shown
4. the **edit form** — the one everybody forgets

**Homework:** see [HW.md](HW.md). The midterm is the homework now.

Next week: presentations.
