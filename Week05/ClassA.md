# Week 05 — API Requests: the image search

*Fetching real data from the Unsplash API with axios and async/await · ~90 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

Everything we have built so far has made up its own data. Today the app asks a **real API** for real photographs, and renders whatever comes back.

Three new ideas: **axios** for making the request, **async/await** for waiting on it, and an **environment variable** so your API key never ends up on GitHub. Everything else is the pattern from the Dropdown — state lives in the parent, the child reports up.

This is a fresh project, not the component library. You will need to scaffold one of these alone for the midterm, so type the commands.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [A brand new project](#step-1)
2. [What is an API, and what does Unsplash want from us?](#step-2)
3. [api.js — the request, and why it looks empty](#step-3)
4. [async / await](#step-4)
5. [Your key does not go in your code](#step-5)
6. [The SearchBar: an input bound to state](#step-6)
7. [The form, and handing the term upward](#step-7)
8. [App holds the results](#step-8)
9. [In-class exercise: render them](#step-9)
10. [ImageList and ImageItem](#step-10)
11. [Loading, empty, error](#step-11)

---

<a id="step-1"></a>

## Step 1 — A brand new project

Not the component library today. A fresh Vite app, with Tailwind and one new package: **axios**, the library that makes HTTP requests.

You could do this with the browser's built-in `fetch`. Axios is what most teams use because it parses the JSON for you, handles errors more predictably, and has a tidier way of setting headers and query parameters — all three of which we need today.

```bash
npm create vite@latest image-search -- --template react
cd image-search
npm install
npm install axios
npm install -D tailwindcss @tailwindcss/vite
npm run dev
```

**`index.html`**  — new file

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Image Search</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**`vite.config.js`**  — new file

```js
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Same setup as the component library: Tailwind v4 is a Vite plugin, and
// there is no tailwind.config.js.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
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
const App = () => {
  return <div className="p-4">App</div>
}

export default App
```

---

<a id="step-2"></a>

## Step 2 — What is an API, and what does Unsplash want from us?

An **API** is a url you can ask for data instead of a web page. You send a request, you get back JSON.

Go to [unsplash.com/developers](https://unsplash.com/developers), make a free account, create an application, and copy the **Access Key**. Then open [the docs](https://unsplash.com/documentation) and look at three things:

- **public authentication** — they want a header that reads `Authorization: Client-ID YOUR_KEY`
- **search photos** — the endpoint is `https://api.unsplash.com/search/photos` and it takes a `query`
- **rate limiting** — 50 requests an hour on a free key. That is not many. Do not put a request inside a re-render.

Paste the endpoint into your browser with `?query=cats` on the end. It refuses you — no key. That refusal is the API working correctly.

---

<a id="step-3"></a>

## Step 3 — api.js — the request, and why it looks empty

One job per file. `src/api.js` knows how to talk to Unsplash and nothing else — no React in it at all.

`axios.get(url, config)` takes the endpoint and an object with the `headers` and `params` we just read about in the docs. `params` becomes the `?query=butterflies` on the end of the url; axios builds that for us.

Hardcode the search term for now so there is one moving part.

Then look at the console.

**`src/api.js`**  — new file

```js
import axios from 'axios'

const searchImages = () => {
  const response = axios.get('https://api.unsplash.com/search/photos', {
    headers: {
      Authorization: 'Client-ID YOUR_KEY_HERE_DO_NOT_COMMIT_THIS',
    },
    params: {query: 'butterflies'},
  })

  console.log(response)
  return response.data.results
}

export default searchImages
```

---

<a id="step-4"></a>

## Step 4 — async / await

JavaScript does not wait. It fired the request off and ran straight on to the next line, where `response` was still a **Promise** — an IOU for a value that has not arrived.

Two keywords fix it:

- **`async`** in front of the function: this function does something slow
- **`await`** in front of the call: stop here until it comes back

Now log it again and you get a real response object. It is enormous — status, headers, config, and somewhere in there, `data.results`, the array of photos. That array is all we want, so that is what we return.

**`src/api.js`**

What changed:

```diff
@@ -1,6 +1,8 @@
 import axios from 'axios'
 
-const searchImages = () => {
-  const response = axios.get('https://api.unsplash.com/search/photos', {
+// `async` marks a function that does something slow.
+// `await` says: stop here until the response comes back, THEN keep going.
+const searchImages = async () => {
+  const response = await axios.get('https://api.unsplash.com/search/photos', {
     headers: {
       Authorization: 'Client-ID YOUR_KEY_HERE_DO_NOT_COMMIT_THIS',
@@ -10,4 +12,5 @@
 
   console.log(response)
+  // the whole response is huge. All we want is the array of photos.
   return response.data.results
 }
```

<details>
<summary>Full file after this step</summary>

```js
import axios from 'axios'

// `async` marks a function that does something slow.
// `await` says: stop here until the response comes back, THEN keep going.
const searchImages = async () => {
  const response = await axios.get('https://api.unsplash.com/search/photos', {
    headers: {
      Authorization: 'Client-ID YOUR_KEY_HERE_DO_NOT_COMMIT_THIS',
    },
    params: {query: 'butterflies'},
  })

  console.log(response)
  // the whole response is huge. All we want is the array of photos.
  return response.data.results
}

export default searchImages
```

</details>

---

<a id="step-5"></a>

## Step 5 — Your key does not go in your code

That key is in a file you are about to push to GitHub, on a repo I can read and so can everyone else. Keys get scraped off public repos by bots within hours.

Make a file called **`.env.local`** in the project root, put the key in it, and add `.env.local` to `.gitignore`. Vite reads that file at startup and hands it to you as `import.meta.env.VITE_UNSPLASH_KEY`.

Two rules with this: the name **must** start with `VITE_`, and you **must restart the dev server** after editing the file. Vite only reads it on boot.

While we are in here: `searchImages` should take the search term as an argument instead of hardcoding it.

**`src/api.js`**

What changed:

```diff
@@ -1,16 +1,17 @@
 import axios from 'axios'
 
-// `async` marks a function that does something slow.
-// `await` says: stop here until the response comes back, THEN keep going.
-const searchImages = async () => {
+// import.meta.env is Vite's way of reading .env files. CRA used
+// process.env.REACT_APP_* -- if you find that in a tutorial, it is the old
+// build tool, not us. The VITE_ prefix is required.
+const KEY = import.meta.env.VITE_UNSPLASH_KEY
+
+const searchImages = async (term) => {
   const response = await axios.get('https://api.unsplash.com/search/photos', {
     headers: {
-      Authorization: 'Client-ID YOUR_KEY_HERE_DO_NOT_COMMIT_THIS',
+      Authorization: `Client-ID ${KEY}`,
     },
-    params: {query: 'butterflies'},
+    params: {query: term},
   })
 
-  console.log(response)
-  // the whole response is huge. All we want is the array of photos.
   return response.data.results
 }
```

<details>
<summary>Full file after this step</summary>

```js
import axios from 'axios'

// import.meta.env is Vite's way of reading .env files. CRA used
// process.env.REACT_APP_* -- if you find that in a tutorial, it is the old
// build tool, not us. The VITE_ prefix is required.
const KEY = import.meta.env.VITE_UNSPLASH_KEY

const searchImages = async (term) => {
  const response = await axios.get('https://api.unsplash.com/search/photos', {
    headers: {
      Authorization: `Client-ID ${KEY}`,
    },
    params: {query: term},
  })

  return response.data.results
}

export default searchImages
```

</details>

**`.env.local`**  — new file

```
# Vite only exposes variables that start with VITE_
VITE_UNSPLASH_KEY=paste_your_access_key_here
```

**`.gitignore`**  — new file

```
node_modules
dist

# never commit your keys
.env
.env.local
```

---

<a id="step-6"></a>

## Step 6 — The SearchBar: an input bound to state

Same pattern as the Dropdown on Tuesday, on a real form element this time.

1. a piece of state to hold the text
2. an `onChange` handler that reads `event.target.value`
3. the state passed back in as the input's `value`

That third line is the one people skip. Without it the input is **uncontrolled** — the DOM holds the text, React does not know about it, and you cannot clear it, prefill it or validate it.

Log `term` and type. A render per keystroke, and the value on screen is always what React is holding.

**`src/components/SearchBar.jsx`**  — new file

```jsx
import {useState} from 'react'

const SearchBar = () => {
  // the input's value lives HERE, in state, not in the DOM
  const [term, setTerm] = useState('')

  const handleChange = (event) => {
    // event.target is the input element; .value is what is typed in it
    setTerm(event.target.value)
  }

  console.log(term)

  return (
    <div className="p-4">
      <input
        value={term}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2 w-80"
      />
    </div>
  )
}

export default SearchBar
```

---

<a id="step-7"></a>

## Step 7 — The form, and handing the term upward

Wrap the input in a `<form>` so Enter submits it — free keyboard behaviour, and it is what a screen reader expects.

**`event.preventDefault()`** is not optional. A form's built-in behaviour is to reload the page with the values in the url, which throws away every piece of state React is holding. You will write this line for the rest of your life.

Then the same question as every component we have built: the SearchBar knows the term — who *needs* it? `App` does, because `App` is the one that will hold the results. So the SearchBar takes an `onSubmit` prop and calls it. The child reports; the parent decides.

**`src/components/SearchBar.jsx`**

What changed:

```diff
@@ -1,22 +1,30 @@
 import {useState} from 'react'
 
-const SearchBar = () => {
-  // the input's value lives HERE, in state, not in the DOM
+const SearchBar = (props) => {
+  const {onSubmit} = props
   const [term, setTerm] = useState('')
 
   const handleChange = (event) => {
-    // event.target is the input element; .value is what is typed in it
     setTerm(event.target.value)
   }
 
-  console.log(term)
+  const handleFormSubmit = (event) => {
+    // stop the browser's built-in form behaviour: it would reload the page
+    // and throw away everything React is holding
+    event.preventDefault()
+    // hand the term UP to whoever is using this component
+    onSubmit(term)
+  }
 
   return (
     <div className="p-4">
-      <input
-        value={term}
-        onChange={handleChange}
-        className="border border-gray-300 rounded px-3 py-2 w-80"
-      />
+      <form onSubmit={handleFormSubmit}>
+        <input
+          value={term}
+          onChange={handleChange}
+          placeholder="Search for photos..."
+          className="border border-gray-300 rounded px-3 py-2 w-80"
+        />
+      </form>
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'

const SearchBar = (props) => {
  const {onSubmit} = props
  const [term, setTerm] = useState('')

  const handleChange = (event) => {
    setTerm(event.target.value)
  }

  const handleFormSubmit = (event) => {
    // stop the browser's built-in form behaviour: it would reload the page
    // and throw away everything React is holding
    event.preventDefault()
    // hand the term UP to whoever is using this component
    onSubmit(term)
  }

  return (
    <div className="p-4">
      <form onSubmit={handleFormSubmit}>
        <input
          value={term}
          onChange={handleChange}
          placeholder="Search for photos..."
          className="border border-gray-300 rounded px-3 py-2 w-80"
        />
      </form>
    </div>
  )
}

export default SearchBar
```

</details>

**`src/App.jsx`**

What changed:

```diff
@@ -1,4 +1,14 @@
+import SearchBar from './components/SearchBar'
+
 const App = () => {
-  return <div className="p-4">App</div>
+  const handleSubmit = (term) => {
+    console.log('do a search with:', term)
+  }
+
+  return (
+    <div className="p-4">
+      <SearchBar onSubmit={handleSubmit} />
+    </div>
+  )
 }
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import SearchBar from './components/SearchBar'

const App = () => {
  const handleSubmit = (term) => {
    console.log('do a search with:', term)
  }

  return (
    <div className="p-4">
      <SearchBar onSubmit={handleSubmit} />
    </div>
  )
}

export default App
```

</details>

---

<a id="step-8"></a>

## Step 8 — App holds the results

`handleSubmit` gets the term, so now it can do the search. Two things to notice:

- it is **`async`**, because it `await`s `searchImages`. Any function that awaits has to be async, all the way up
- the results go into **state**, which is what makes the page re-render with them

Search something and watch the console: an array of ten photo objects. Nothing on screen yet, because nothing renders them.

**`src/App.jsx`**

What changed:

```diff
@@ -1,8 +1,18 @@
+import {useState} from 'react'
 import SearchBar from './components/SearchBar'
+import searchImages from './api'
 
 const App = () => {
-  const handleSubmit = (term) => {
-    console.log('do a search with:', term)
+  // the results live here, in state, so that changing them re-renders the page
+  const [images, setImages] = useState([])
+
+  // handleSubmit is async because searchImages is async: we have to wait for
+  // the photos before we can put them in state
+  const handleSubmit = async (term) => {
+    const results = await searchImages(term)
+    setImages(results)
   }
+
+  console.log(images)
 
   return (
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import SearchBar from './components/SearchBar'
import searchImages from './api'

const App = () => {
  // the results live here, in state, so that changing them re-renders the page
  const [images, setImages] = useState([])

  // handleSubmit is async because searchImages is async: we have to wait for
  // the photos before we can put them in state
  const handleSubmit = async (term) => {
    const results = await searchImages(term)
    setImages(results)
  }

  console.log(images)

  return (
    <div className="p-4">
      <SearchBar onSubmit={handleSubmit} />
    </div>
  )
}

export default App
```

</details>

---

<a id="step-9"></a>

## Step 9 — In-class exercise: render them

You have an array of photos in state. Put them on screen.

Two components, in `src/components/`:

- **`ImageList`** takes an `images` prop and `.map()`s over it
- **`ImageItem`** takes one `image` and renders an `<img>`

The url you want is `image.urls.small`, and the alt text is `image.alt_description`. Every item in a mapped list needs a **`key`** — use `image.id`, never the array index.

Ten minutes. Then we compare.

---

<a id="step-10"></a>

## Step 10 — ImageList and ImageItem

One component per job again. `ImageList` knows how to map; `ImageItem` knows how one photo looks. Neither knows about Unsplash, which means both would work just as happily with photos from anywhere else.

`columns-2 md:columns-3` is CSS multi-column: photos flow into columns of different heights and it looks like a gallery instead of a grid of letterboxes. The `md:` prefix means *at medium screens and up* — Tailwind's built-in media query.

**`src/components/ImageItem.jsx`**  — new file

```jsx
const ImageItem = (props) => {
  const {image} = props

  return (
    <img
      src={image.urls.small}
      alt={image.alt_description}
      className="w-full mb-4 rounded"
    />
  )
}

export default ImageItem
```

**`src/components/ImageList.jsx`**  — new file

```jsx
import ImageItem from './ImageItem'

const ImageList = (props) => {
  const {images} = props

  // one ImageItem per photo. `key` has to be unique and stable -- the API
  // gives every photo an id, so use that, never the array index.
  const renderedImages = images.map((image) => {
    return <ImageItem key={image.id} image={image} />
  })

  return <div className="columns-2 md:columns-3 gap-4 p-4">{renderedImages}</div>
}

export default ImageList
```

**`src/App.jsx`**

What changed:

```diff
@@ -1,12 +1,10 @@
 import {useState} from 'react'
 import SearchBar from './components/SearchBar'
+import ImageList from './components/ImageList'
 import searchImages from './api'
 
 const App = () => {
-  // the results live here, in state, so that changing them re-renders the page
   const [images, setImages] = useState([])
 
-  // handleSubmit is async because searchImages is async: we have to wait for
-  // the photos before we can put them in state
   const handleSubmit = async (term) => {
     const results = await searchImages(term)
@@ -14,9 +12,8 @@
   }
 
-  console.log(images)
-
   return (
     <div className="p-4">
       <SearchBar onSubmit={handleSubmit} />
+      <ImageList images={images} />
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import SearchBar from './components/SearchBar'
import ImageList from './components/ImageList'
import searchImages from './api'

const App = () => {
  const [images, setImages] = useState([])

  const handleSubmit = async (term) => {
    const results = await searchImages(term)
    setImages(results)
  }

  return (
    <div className="p-4">
      <SearchBar onSubmit={handleSubmit} />
      <ImageList images={images} />
    </div>
  )
}

export default App
```

</details>

---

<a id="step-11"></a>

## Step 11 — Loading, empty, error

Right now, between hitting Enter and the photos arriving, the app looks broken. And if the request fails — bad key, no wifi, 51st request of the hour — it looks *identical* to a search that found nothing.

Every screen that fetches has the same four states, and you have only built one of them:

1. nothing searched yet
2. loading
3. it worked
4. it failed

`try` / `catch` / `finally`: the request goes in `try`, the failure is handled in `catch`, and `finally` runs either way — which is exactly where the spinner gets turned off, so it can never get stuck on.

This is the difference between a class exercise and something you would put in a portfolio.

**`src/App.jsx`**

What changed:

```diff
@@ -6,8 +6,24 @@
 const App = () => {
   const [images, setImages] = useState([])
+  const [isLoading, setIsLoading] = useState(false)
+  const [error, setError] = useState(null)
+  const [searched, setSearched] = useState(false)
 
   const handleSubmit = async (term) => {
-    const results = await searchImages(term)
-    setImages(results)
+    setIsLoading(true)
+    setError(null)
+    setSearched(true)
+
+    try {
+      const results = await searchImages(term)
+      setImages(results)
+    } catch (err) {
+      // a dead network, a bad key, or 50 requests in one hour all land here
+      console.error(err)
+      setError('That search did not work. Check the console.')
+    } finally {
+      // runs whether the request worked or not, so the spinner always stops
+      setIsLoading(false)
+    }
   }
 
@@ -15,4 +31,11 @@
     <div className="p-4">
       <SearchBar onSubmit={handleSubmit} />
+
+      {isLoading && <p className="p-4 text-gray-500">Searching...</p>}
+      {error && <p className="p-4 text-red-600">{error}</p>}
+      {!isLoading && !error && searched && images.length === 0 && (
+        <p className="p-4 text-gray-500">No photos for that one. Try another word.</p>
+      )}
+
       <ImageList images={images} />
     </div>
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import SearchBar from './components/SearchBar'
import ImageList from './components/ImageList'
import searchImages from './api'

const App = () => {
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleSubmit = async (term) => {
    setIsLoading(true)
    setError(null)
    setSearched(true)

    try {
      const results = await searchImages(term)
      setImages(results)
    } catch (err) {
      // a dead network, a bad key, or 50 requests in one hour all land here
      console.error(err)
      setError('That search did not work. Check the console.')
    } finally {
      // runs whether the request worked or not, so the spinner always stops
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4">
      <SearchBar onSubmit={handleSubmit} />

      {isLoading && <p className="p-4 text-gray-500">Searching...</p>}
      {error && <p className="p-4 text-red-600">{error}</p>}
      {!isLoading && !error && searched && images.length === 0 && (
        <p className="p-4 text-gray-500">No photos for that one. Try another word.</p>
      )}

      <ImageList images={images} />
    </div>
  )
}

export default App
```

</details>

---

**Where we landed:** a real app. Somebody types a word, the app asks Unsplash for photographs, waits, and renders them — with something sensible on screen while it waits and when it fails.

**The three things to keep:**

- `async`/`await` — the function pauses at the `await` until the data arrives, so you never end up with a Promise where you expected an array
- **your key belongs in `.env.local`**, which is gitignored. Read it with `import.meta.env.VITE_...`
- loading, empty and error are **states**, not afterthoughts. Any screen that fetches has all three

**Homework:** see [HW.md](HW.md).

Next class: a memory game, and `useEffect` doing the work.
