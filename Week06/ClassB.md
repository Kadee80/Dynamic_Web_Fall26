# Week 06 — The Todo List, part 2: it stops disappearing

*Persisting the todo list with json-server and axios · ~110 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

Your todo list works, and everything in it vanishes when you refresh. Today it stops doing that.

We put a **real API** behind it — `json-server`, which turns a plain JSON file into a proper REST server in one line — and every one of Tuesday's four operations becomes a request: **GET** to load, **POST** to create, **PUT** to edit, **DELETE** to delete.

You already know `axios` and `async`/`await` from the image search. What is new is the discipline: **ask the server first, change the screen second.**

Pick up your project from Tuesday. Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [The problem, in one keystroke](#step-1)
2. [json-server in a second terminal tab](#step-2)
3. [Poke the API before writing any React](#step-3)
4. [api.js, and loading the list on mount](#step-4)
5. [Create: POST, and the server owns the id](#step-5)
6. [Delete: ask first, filter second](#step-6)
7. [Edit: PUT, and the trap in it](#step-7)
8. [When the server is not there](#step-8)
9. [In-class exercise: make 'done' survive a refresh](#step-9)
10. [What you have actually built](#step-10)

---

<a id="step-1"></a>

## Step 1 — The problem, in one keystroke

Open Tuesday's project. Add three todos. Refresh the page.

Gone.

State lives in memory, and memory does not survive a refresh. Every app you have built this semester has had this problem; today is the first time it matters enough to fix.

What we need is somewhere outside the browser to keep the list — a **server**.

```bash
cd ~/your-hw-repo/todo-list
npm run dev
```

---

<a id="step-2"></a>

## Step 2 — json-server in a second terminal tab

**json-server** turns a plain JSON file into a REST API. It is not what you would ship, but the requests you write against it are exactly the requests you would write against a real one.

Three things:

1. install it, and `axios` while we are here
2. make **`db.json`** in the project root — this file *is* the database
3. add a **`server`** script to `package.json`

Then: **two terminal tabs**, both in this project. One runs `npm run dev` as usual, the other runs `npm run server`. Leave both running all class.

Open `localhost:3001/todos` in the browser and you will see your two starter todos as JSON.

```bash
# in a SECOND terminal tab, same folder
npm install axios
npm install -D json-server@0.17.4
npm run server
```

**`db.json`**  — new file

```
{
  "todos": [
    {"id": 1, "title": "Wake the hell up"},
    {"id": 2, "title": "Read the week 06 notes"}
  ]
}
```

**`package.json`**  — new file

```
{
  "name": "todo-list",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "server": "json-server -p 3001 --watch db.json"
  },
  "dependencies": {
    "axios": "^1.7.9",
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.0",
    "@vitejs/plugin-react": "^4.3.4",
    "json-server": "^0.17.4",
    "tailwindcss": "^4.1.0",
    "vite": "^6.0.7"
  }
}
```

---

<a id="step-3"></a>

## Step 3 — Poke the API before writing any React

Install the **REST Client** extension in VS Code, make a file called `api.http`, and send the requests by hand.

A little `Send Request` link appears above each one. Click through them and watch `db.json` change on disk.

Four things to notice:

- **GET** gives you the array
- **POST** gives you back the todo you sent **plus an id**. The server makes ids now — you do not
- **PUT** replaces the whole record at that id
- **DELETE** gives you back an empty object

This file stays in your project as documentation. Future you will thank present you.

**`api.http`**  — new file

```
### get every todo
GET http://localhost:3001/todos HTTP/1.1
Content-Type: application/json

### create one -- the server gives it an id
POST http://localhost:3001/todos HTTP/1.1
Content-Type: application/json

{
  "title": "a todo made from VS Code"
}

### replace one (PUT replaces the WHOLE record)
PUT http://localhost:3001/todos/1 HTTP/1.1
Content-Type: application/json

{
  "title": "an edited todo"
}

### change one field, leave the rest alone
PATCH http://localhost:3001/todos/1 HTTP/1.1
Content-Type: application/json

{
  "done": true
}

### delete one
DELETE http://localhost:3001/todos/1 HTTP/1.1
```

---

<a id="step-4"></a>

## Step 4 — api.js, and loading the list on mount

Same shape as the image search: one file that knows how to talk to the server, and no React in it.

Then in `App`, the question is *when* to fetch. The answer is **once, when the component first appears**, which is `useEffect(fn, [])`.

Not every render — fetch, set state, re-render, fetch, forever. Put `todos` in that dependency array and you will watch it happen in the network tab.

One wrinkle: the effect function itself cannot be `async`, so we define an async function inside it and call it. You will write that little dance often.

**`src/api.js`**  — new file

```js
import axios from 'axios'

// everything in this file knows one thing: how to talk to our server.
// No React in here at all.
const BASE = 'http://localhost:3001'

export const fetchTodos = async () => {
  const response = await axios.get(`${BASE}/todos`)
  return response.data
}
```

**`src/App.jsx`**

What changed:

```diff
@@ -1,8 +1,19 @@
-import {useState} from 'react'
+import {useState, useEffect} from 'react'
 import TodoCreate from './components/TodoCreate'
 import TodoList from './components/TodoList'
+import {fetchTodos} from './api'
 
 const App = () => {
   const [todos, setTodos] = useState([])
+
+  // [] = run once, when the component first appears. NOT every render --
+  // that would fetch, set state, re-render, fetch again, forever.
+  useEffect(() => {
+    const loadTodos = async () => {
+      const todos = await fetchTodos()
+      setTodos(todos)
+    }
+    loadTodos()
+  }, [])
 
   const createTodo = (title) => {
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState, useEffect} from 'react'
import TodoCreate from './components/TodoCreate'
import TodoList from './components/TodoList'
import {fetchTodos} from './api'

const App = () => {
  const [todos, setTodos] = useState([])

  // [] = run once, when the component first appears. NOT every render --
  // that would fetch, set state, re-render, fetch again, forever.
  useEffect(() => {
    const loadTodos = async () => {
      const todos = await fetchTodos()
      setTodos(todos)
    }
    loadTodos()
  }, [])

  const createTodo = (title) => {
    const updatedTodos = [
      ...todos,
      {id: crypto.randomUUID(), title},
    ]
    setTodos(updatedTodos)
  }

  const deleteTodoById = (id) => {
    const updatedTodos = todos.filter((todo) => {
      return todo.id !== id
    })
    setTodos(updatedTodos)
  }

  const editTodoById = (id, newTitle) => {
    // map returns a new array the SAME length. Every todo comes back; the one
    // we are editing comes back as a new object with a new title.
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {...todo, title: newTitle}
      }
      return todo
    })
    setTodos(updatedTodos)
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      <TodoCreate onCreate={createTodo} />
      {todos.length === 0 ? (
        <p className="text-gray-500">Nothing yet. Add something above.</p>
      ) : (
        <TodoList todos={todos} onDelete={deleteTodoById} onEdit={editTodoById} />
      )}

      <p className="mt-6 text-sm text-gray-500">
        {todos.length} {todos.length === 1 ? 'thing' : 'things'} to do
      </p>
    </div>
  )
}

export default App
```

</details>

---

<a id="step-5"></a>

## Step 5 — Create: POST, and the server owns the id

`createTodo` sends the title and gets back the whole todo, **with an id the server made**.

So `crypto.randomUUID()` goes. On Tuesday we invented ids because nobody else would; now there is a server, and ids are its job. Two things cannot both own the same number.

Notice the shape:

```
const newTodo = await createTodoRequest(title)
setTodos([...todos, newTodo])
```

**Ask the server, then update state — with what the server sent back.** Not with what you hoped it would say.

**`src/api.js`**

What changed:

```diff
@@ -10,2 +10,8 @@
 }
 
+export const createTodo = async (title) => {
+  // we send the title. The server sends back the whole todo, WITH an id.
+  const response = await axios.post(`${BASE}/todos`, {title})
+  return response.data
+}
+
```

<details>
<summary>Full file after this step</summary>

```js
import axios from 'axios'

// everything in this file knows one thing: how to talk to our server.
// No React in here at all.
const BASE = 'http://localhost:3001'

export const fetchTodos = async () => {
  const response = await axios.get(`${BASE}/todos`)
  return response.data
}

export const createTodo = async (title) => {
  // we send the title. The server sends back the whole todo, WITH an id.
  const response = await axios.post(`${BASE}/todos`, {title})
  return response.data
}
```

</details>

**`src/App.jsx`**

What changed:

```diff
@@ -2,5 +2,5 @@
 import TodoCreate from './components/TodoCreate'
 import TodoList from './components/TodoList'
-import {fetchTodos} from './api'
+import {fetchTodos, createTodo as createTodoRequest} from './api'
 
 const App = () => {
@@ -17,9 +17,8 @@
   }, [])
 
-  const createTodo = (title) => {
-    const updatedTodos = [
-      ...todos,
-      {id: crypto.randomUUID(), title},
-    ]
+  const createTodo = async (title) => {
+    // the server makes the id now, so we no longer invent one
+    const newTodo = await createTodoRequest(title)
+    const updatedTodos = [...todos, newTodo]
     setTodos(updatedTodos)
   }
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState, useEffect} from 'react'
import TodoCreate from './components/TodoCreate'
import TodoList from './components/TodoList'
import {fetchTodos, createTodo as createTodoRequest} from './api'

const App = () => {
  const [todos, setTodos] = useState([])

  // [] = run once, when the component first appears. NOT every render --
  // that would fetch, set state, re-render, fetch again, forever.
  useEffect(() => {
    const loadTodos = async () => {
      const todos = await fetchTodos()
      setTodos(todos)
    }
    loadTodos()
  }, [])

  const createTodo = async (title) => {
    // the server makes the id now, so we no longer invent one
    const newTodo = await createTodoRequest(title)
    const updatedTodos = [...todos, newTodo]
    setTodos(updatedTodos)
  }

  const deleteTodoById = (id) => {
    const updatedTodos = todos.filter((todo) => {
      return todo.id !== id
    })
    setTodos(updatedTodos)
  }

  const editTodoById = (id, newTitle) => {
    // map returns a new array the SAME length. Every todo comes back; the one
    // we are editing comes back as a new object with a new title.
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {...todo, title: newTitle}
      }
      return todo
    })
    setTodos(updatedTodos)
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      <TodoCreate onCreate={createTodo} />
      {todos.length === 0 ? (
        <p className="text-gray-500">Nothing yet. Add something above.</p>
      ) : (
        <TodoList todos={todos} onDelete={deleteTodoById} onEdit={editTodoById} />
      )}

      <p className="mt-6 text-sm text-gray-500">
        {todos.length} {todos.length === 1 ? 'thing' : 'things'} to do
      </p>
    </div>
  )
}

export default App
```

</details>

---

<a id="step-6"></a>

## Step 6 — Delete: ask first, filter second

```
await deleteTodoRequest(id)
setTodos(todos.filter(...))
```

The `await` comes first on purpose. If the server refuses — it is down, the id is wrong, the network dropped — the `await` throws and **we never reach the line that changes state**. The todo stays on screen, which is the truth.

Do it the other way round and you get a UI that feels faster and sometimes lies: the row disappears, the request fails, and the todo is back the next time you refresh.

There is a real technique called an *optimistic update* that does change the screen first — and then puts it back if the request fails. That second half is the part people forget.

**`src/api.js`**

What changed:

```diff
@@ -16,2 +16,6 @@
 }
 
+export const deleteTodo = async (id) => {
+  await axios.delete(`${BASE}/todos/${id}`)
+}
+
```

<details>
<summary>Full file after this step</summary>

```js
import axios from 'axios'

// everything in this file knows one thing: how to talk to our server.
// No React in here at all.
const BASE = 'http://localhost:3001'

export const fetchTodos = async () => {
  const response = await axios.get(`${BASE}/todos`)
  return response.data
}

export const createTodo = async (title) => {
  // we send the title. The server sends back the whole todo, WITH an id.
  const response = await axios.post(`${BASE}/todos`, {title})
  return response.data
}

export const deleteTodo = async (id) => {
  await axios.delete(`${BASE}/todos/${id}`)
}
```

</details>

**`src/App.jsx`**

What changed:

```diff
@@ -2,5 +2,9 @@
 import TodoCreate from './components/TodoCreate'
 import TodoList from './components/TodoList'
-import {fetchTodos, createTodo as createTodoRequest} from './api'
+import {
+  fetchTodos,
+  createTodo as createTodoRequest,
+  deleteTodo as deleteTodoRequest,
+} from './api'
 
 const App = () => {
@@ -24,5 +28,9 @@
   }
 
-  const deleteTodoById = (id) => {
+  const deleteTodoById = async (id) => {
+    // ask the server first. If it refuses, we never touch our state, and the
+    // screen keeps telling the truth.
+    await deleteTodoRequest(id)
+
     const updatedTodos = todos.filter((todo) => {
       return todo.id !== id
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState, useEffect} from 'react'
import TodoCreate from './components/TodoCreate'
import TodoList from './components/TodoList'
import {
  fetchTodos,
  createTodo as createTodoRequest,
  deleteTodo as deleteTodoRequest,
} from './api'

const App = () => {
  const [todos, setTodos] = useState([])

  // [] = run once, when the component first appears. NOT every render --
  // that would fetch, set state, re-render, fetch again, forever.
  useEffect(() => {
    const loadTodos = async () => {
      const todos = await fetchTodos()
      setTodos(todos)
    }
    loadTodos()
  }, [])

  const createTodo = async (title) => {
    // the server makes the id now, so we no longer invent one
    const newTodo = await createTodoRequest(title)
    const updatedTodos = [...todos, newTodo]
    setTodos(updatedTodos)
  }

  const deleteTodoById = async (id) => {
    // ask the server first. If it refuses, we never touch our state, and the
    // screen keeps telling the truth.
    await deleteTodoRequest(id)

    const updatedTodos = todos.filter((todo) => {
      return todo.id !== id
    })
    setTodos(updatedTodos)
  }

  const editTodoById = (id, newTitle) => {
    // map returns a new array the SAME length. Every todo comes back; the one
    // we are editing comes back as a new object with a new title.
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {...todo, title: newTitle}
      }
      return todo
    })
    setTodos(updatedTodos)
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      <TodoCreate onCreate={createTodo} />
      {todos.length === 0 ? (
        <p className="text-gray-500">Nothing yet. Add something above.</p>
      ) : (
        <TodoList todos={todos} onDelete={deleteTodoById} onEdit={editTodoById} />
      )}

      <p className="mt-6 text-sm text-gray-500">
        {todos.length} {todos.length === 1 ? 'thing' : 'things'} to do
      </p>
    </div>
  )
}

export default App
```

</details>

---

<a id="step-7"></a>

## Step 7 — Edit: PUT, and the trap in it

**PUT replaces the entire record.** Send it `{title: 'new'}` and the record at that id becomes exactly that — anything else that was on it is gone.

So we find the whole todo first and send all of it with the new title spread over the top:

```
const todo = todos.find((todo) => todo.id === id)
await updateTodoRequest({...todo, title: newTitle})
```

And we put the **server's** version into state, not ours. If the server changed anything — a timestamp, a normalised field — our screen matches the database.

`find` is the fourth array method of the week: same shape as `filter`, but it returns the first match itself rather than an array.

**`src/api.js`**

What changed:

```diff
@@ -20,2 +20,9 @@
 }
 
+export const updateTodo = async (todo) => {
+  // PUT REPLACES the record. Send the whole todo, not just the bit that
+  // changed, or everything else on it is gone.
+  const response = await axios.put(`${BASE}/todos/${todo.id}`, todo)
+  return response.data
+}
+
```

<details>
<summary>Full file after this step</summary>

```js
import axios from 'axios'

// everything in this file knows one thing: how to talk to our server.
// No React in here at all.
const BASE = 'http://localhost:3001'

export const fetchTodos = async () => {
  const response = await axios.get(`${BASE}/todos`)
  return response.data
}

export const createTodo = async (title) => {
  // we send the title. The server sends back the whole todo, WITH an id.
  const response = await axios.post(`${BASE}/todos`, {title})
  return response.data
}

export const deleteTodo = async (id) => {
  await axios.delete(`${BASE}/todos/${id}`)
}

export const updateTodo = async (todo) => {
  // PUT REPLACES the record. Send the whole todo, not just the bit that
  // changed, or everything else on it is gone.
  const response = await axios.put(`${BASE}/todos/${todo.id}`, todo)
  return response.data
}
```

</details>

**`src/App.jsx`**

What changed:

```diff
@@ -6,4 +6,5 @@
   createTodo as createTodoRequest,
   deleteTodo as deleteTodoRequest,
+  updateTodo as updateTodoRequest,
 } from './api'
 
@@ -39,10 +40,14 @@
   }
 
-  const editTodoById = (id, newTitle) => {
+  const editTodoById = async (id, newTitle) => {
+    // find the whole todo and send all of it, because PUT replaces
+    const todo = todos.find((todo) => todo.id === id)
+    const updated = await updateTodoRequest({...todo, title: newTitle})
+
     // map returns a new array the SAME length. Every todo comes back; the one
-    // we are editing comes back as a new object with a new title.
+    // we edited comes back as the object the SERVER sent us.
     const updatedTodos = todos.map((todo) => {
       if (todo.id === id) {
-        return {...todo, title: newTitle}
+        return updated
       }
       return todo
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState, useEffect} from 'react'
import TodoCreate from './components/TodoCreate'
import TodoList from './components/TodoList'
import {
  fetchTodos,
  createTodo as createTodoRequest,
  deleteTodo as deleteTodoRequest,
  updateTodo as updateTodoRequest,
} from './api'

const App = () => {
  const [todos, setTodos] = useState([])

  // [] = run once, when the component first appears. NOT every render --
  // that would fetch, set state, re-render, fetch again, forever.
  useEffect(() => {
    const loadTodos = async () => {
      const todos = await fetchTodos()
      setTodos(todos)
    }
    loadTodos()
  }, [])

  const createTodo = async (title) => {
    // the server makes the id now, so we no longer invent one
    const newTodo = await createTodoRequest(title)
    const updatedTodos = [...todos, newTodo]
    setTodos(updatedTodos)
  }

  const deleteTodoById = async (id) => {
    // ask the server first. If it refuses, we never touch our state, and the
    // screen keeps telling the truth.
    await deleteTodoRequest(id)

    const updatedTodos = todos.filter((todo) => {
      return todo.id !== id
    })
    setTodos(updatedTodos)
  }

  const editTodoById = async (id, newTitle) => {
    // find the whole todo and send all of it, because PUT replaces
    const todo = todos.find((todo) => todo.id === id)
    const updated = await updateTodoRequest({...todo, title: newTitle})

    // map returns a new array the SAME length. Every todo comes back; the one
    // we edited comes back as the object the SERVER sent us.
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return updated
      }
      return todo
    })
    setTodos(updatedTodos)
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      <TodoCreate onCreate={createTodo} />
      {todos.length === 0 ? (
        <p className="text-gray-500">Nothing yet. Add something above.</p>
      ) : (
        <TodoList todos={todos} onDelete={deleteTodoById} onEdit={editTodoById} />
      )}

      <p className="mt-6 text-sm text-gray-500">
        {todos.length} {todos.length === 1 ? 'thing' : 'things'} to do
      </p>
    </div>
  )
}

export default App
```

</details>

---

<a id="step-8"></a>

## Step 8 — When the server is not there

Right now, if you forget the second terminal tab, the app shows an empty list and says *Nothing yet* — which is a lie. There are todos; we could not reach them.

Same three states as the image search: **loading**, **error**, **empty**. And `isLoading` starts as `true` here, because we start fetching immediately — there is no moment where nothing is happening.

The error message names the actual cause, because the actual cause will be *'you forgot to run `npm run server`'* about forty times this semester.

**`src/App.jsx`**

What changed:

```diff
@@ -11,4 +11,6 @@
 const App = () => {
   const [todos, setTodos] = useState([])
+  const [isLoading, setIsLoading] = useState(true)
+  const [error, setError] = useState(null)
 
   // [] = run once, when the component first appears. NOT every render --
@@ -16,6 +18,14 @@
   useEffect(() => {
     const loadTodos = async () => {
-      const todos = await fetchTodos()
-      setTodos(todos)
+      try {
+        const todos = await fetchTodos()
+        setTodos(todos)
+      } catch (err) {
+        // the usual cause: you forgot to start the server in the second tab
+        console.error(err)
+        setError('Could not reach the server. Is `npm run server` running?')
+      } finally {
+        setIsLoading(false)
+      }
     }
     loadTodos()
@@ -60,5 +70,11 @@
       <h1 className="text-3xl font-bold mb-6">Todo List</h1>
       <TodoCreate onCreate={createTodo} />
-      {todos.length === 0 ? (
+      {isLoading && <p className="text-gray-500">Loading your todos...</p>}
+
+      {error && (
+        <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>
+      )}
+
+      {!isLoading && !error && todos.length === 0 ? (
         <p className="text-gray-500">Nothing yet. Add something above.</p>
       ) : (
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState, useEffect} from 'react'
import TodoCreate from './components/TodoCreate'
import TodoList from './components/TodoList'
import {
  fetchTodos,
  createTodo as createTodoRequest,
  deleteTodo as deleteTodoRequest,
  updateTodo as updateTodoRequest,
} from './api'

const App = () => {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // [] = run once, when the component first appears. NOT every render --
  // that would fetch, set state, re-render, fetch again, forever.
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todos = await fetchTodos()
        setTodos(todos)
      } catch (err) {
        // the usual cause: you forgot to start the server in the second tab
        console.error(err)
        setError('Could not reach the server. Is `npm run server` running?')
      } finally {
        setIsLoading(false)
      }
    }
    loadTodos()
  }, [])

  const createTodo = async (title) => {
    // the server makes the id now, so we no longer invent one
    const newTodo = await createTodoRequest(title)
    const updatedTodos = [...todos, newTodo]
    setTodos(updatedTodos)
  }

  const deleteTodoById = async (id) => {
    // ask the server first. If it refuses, we never touch our state, and the
    // screen keeps telling the truth.
    await deleteTodoRequest(id)

    const updatedTodos = todos.filter((todo) => {
      return todo.id !== id
    })
    setTodos(updatedTodos)
  }

  const editTodoById = async (id, newTitle) => {
    // find the whole todo and send all of it, because PUT replaces
    const todo = todos.find((todo) => todo.id === id)
    const updated = await updateTodoRequest({...todo, title: newTitle})

    // map returns a new array the SAME length. Every todo comes back; the one
    // we edited comes back as the object the SERVER sent us.
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return updated
      }
      return todo
    })
    setTodos(updatedTodos)
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      <TodoCreate onCreate={createTodo} />
      {isLoading && <p className="text-gray-500">Loading your todos...</p>}

      {error && (
        <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>
      )}

      {!isLoading && !error && todos.length === 0 ? (
        <p className="text-gray-500">Nothing yet. Add something above.</p>
      ) : (
        <TodoList todos={todos} onDelete={deleteTodoById} onEdit={editTodoById} />
      )}

      <p className="mt-6 text-sm text-gray-500">
        {todos.length} {todos.length === 1 ? 'thing' : 'things'} to do
      </p>
    </div>
  )
}

export default App
```

</details>

---

<a id="step-9"></a>

## Step 9 — In-class exercise: make 'done' survive a refresh

Twenty minutes. On Tuesday you added a **done** checkbox that crosses a todo out. It still forgets.

Make it persist. Three decisions to make before you type:

1. **Which request?** You are changing one field and leaving the rest alone. PUT replaces, PATCH merges — pick, and be able to say why
2. **Where does the request go** — in `api.js`, obviously, but who calls it: `App` or `TodoItem`?
3. **Before or after** you change state?

Then check `db.json` on disk, and refresh the page. If the crossed-out ones are still crossed out, you are done.

---

<a id="step-10"></a>

## Step 10 — What you have actually built

Step back and look at the shape of it.

- a **server** holding the truth
- an **api.js** that knows how to talk to it and nothing else
- a **component tree** that renders state and reports events upward
- four operations, each one *request first, state second*

Swap `localhost:3001` for a company's API and change almost nothing. This is the actual job.

Things worth adding on your own: a filter for done/not done (no new requests — it is just `filter` on what you already have), sorting, and a search box. All three are Tuesday's array methods on data that now happens to come from a server.

---

**Where we landed:** a todo list that is still there tomorrow. Four operations, four requests, one `db.json` file holding the truth.

**The things to keep:**

- **GET on mount** is `useEffect(fn, [])`. Any other dependency array here means fetching on a loop
- **the server owns the id.** You stopped inventing them the moment there was a server
- **request first, state second.** If the request fails, your screen never tells a lie
- **PUT replaces, PATCH merges.** Send the whole object with PUT or you will quietly lose fields

This is the real shape of a front end. Swap `localhost:3001` for a company's API and almost nothing else changes.

**Homework:** see [HW.md](HW.md).

Next week: your midterm.
