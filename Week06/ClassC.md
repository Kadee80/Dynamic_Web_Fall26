# Week 06 — The Todo List, part 3: Context

*Refactoring the todo list to the Context API · ~110 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

Today we do not add a feature. We move the state, and the app keeps working — which is the point.

Look at `TodoList` as it stands: it takes `onDelete` and `onEdit`, does nothing with either, and passes them to `TodoItem`. That is **prop drilling** — a component handling props it does not care about because something below it does. Two levels is annoying. Five is how projects start to rot.

The **Context API** is React's answer: put a value somewhere high in the tree, and let any component below reach up and take it, without the components in between knowing anything about it.

Bring your project from last class — the one talking to json-server. Remember both terminal tabs.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [The problem, in your own code](#step-1)
2. [Five minutes with a number](#step-2)
3. [A Provider that actually holds something](#step-3)
4. [A custom hook, because imports add up](#step-4)
5. [Wrap the app](#step-5)
6. [App gets a lot shorter](#step-6)
7. [The infinite loop, and useCallback](#step-7)
8. [TodoList loses its props entirely](#step-8)
9. [TodoItem and TodoCreate take what they need](#step-9)
10. [What context is not](#step-10)
11. [In-class exercise: a second context](#step-11)

---

<a id="step-1"></a>

## Step 1 — The problem, in your own code

Both terminal tabs running, project from last class open.

Open `TodoList.jsx` and read it out loud:

```
const {todos, onDelete, onEdit} = props
```

It uses `todos`. It does **not** use `onDelete` or `onEdit` — it accepts them and hands them straight to `TodoItem`. Those two props exist in this file for no reason except that somebody below needs them.

That is **prop drilling**. Here it is one level and it is merely annoying. Add two more layers of components — which is a normal week in a real app — and you are editing five files to pass one function.

Today's job: get the data to the component that wants it, without the components in between.

```bash
cd ~/your-hw-repo/week06-todo-list
npm run dev
# and in the second tab
npm run server
```

---

<a id="step-2"></a>

## Step 2 — Five minutes with a number

Before refactoring anything real, the whole idea in miniature. Three steps, and they never change:

1. **create** the context — `createContext()` makes a channel
2. **provide** a value — wrap part of the tree in `<Context.Provider value={...}>`
3. **consume** it — `useContext(Context)` anywhere inside

Make `src/context/todos.jsx`, share the number `5`, and read it in `TodoList` — which is two components down from where we provided it, with nothing passed in between.

**Note the file extension:** `.jsx`, not `.js`. There is JSX in there, and Vite will not compile JSX out of a `.js` file.

**`src/context/todos.jsx`**  — new file

```jsx
import {createContext} from 'react'

// createContext makes a channel. Nothing is in it yet.
const TodosContext = createContext()

export default TodosContext
```

**`src/main.jsx`**

What changed:

```diff
@@ -3,9 +3,14 @@
 import './index.css'
 import App from './App'
+import TodosContext from './context/todos'
 
 const root = ReactDOM.createRoot(document.getElementById('root'))
 root.render(
   <React.StrictMode>
-    <App />
+    {/* whatever goes in `value` is readable by ANY component inside, at any
+        depth, without being passed down through a single prop */}
+    <TodosContext.Provider value={5}>
+      <App />
+    </TodosContext.Provider>
   </React.StrictMode>
 )
```

<details>
<summary>Full file after this step</summary>

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import TodosContext from './context/todos'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {/* whatever goes in `value` is readable by ANY component inside, at any
        depth, without being passed down through a single prop */}
    <TodosContext.Provider value={5}>
      <App />
    </TodosContext.Provider>
  </React.StrictMode>
)
```

</details>

**`src/components/TodoList.jsx`**

What changed:

```diff
@@ -1,6 +1,11 @@
+import {useContext} from 'react'
+import TodosContext from '../context/todos'
 import TodoItem from './TodoItem'
 
 const TodoList = (props) => {
   const {todos, onDelete, onEdit} = props
+  // useContext reaches up the tree and grabs whatever the nearest Provider
+  // is sharing. No props involved.
+  const num = useContext(TodosContext)
 
   const renderedTodos = todos.map((todo) => {
@@ -10,5 +15,10 @@
   })
 
-  return <div>{renderedTodos}</div>
+  return (
+    <div>
+      <p>the number from context: {num}</p>
+      {renderedTodos}
+    </div>
+  )
 }
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useContext} from 'react'
import TodosContext from '../context/todos'
import TodoItem from './TodoItem'

const TodoList = (props) => {
  const {todos, onDelete, onEdit} = props
  // useContext reaches up the tree and grabs whatever the nearest Provider
  // is sharing. No props involved.
  const num = useContext(TodosContext)

  const renderedTodos = todos.map((todo) => {
    return (
      <TodoItem key={todo.id} todo={todo} onDelete={onDelete} onEdit={onEdit} />
    )
  })

  return (
    <div>
      <p>the number from context: {num}</p>
      {renderedTodos}
    </div>
  )
}

export default TodoList
```

</details>

---

<a id="step-3"></a>

## Step 3 — A Provider that actually holds something

A static `5` is no use. We want a value that changes, which means state, which means a **component**.

So `context/todos.jsx` grows a `Provider` — an ordinary component that holds everything `App` used to hold: the `todos` state, the loading and error flags, and the four functions. It shares all of it as one object, `valuesToShare`.

`props.children` is what makes it a wrapper: whatever you put inside `<Provider>...</Provider>` renders there. You have used `children` before — the Modal took it.

Read the file top to bottom. **Almost none of this is new code.** It is last class's `App`, moved.

**`src/context/todos.jsx`**

What changed:

```diff
@@ -1,7 +1,79 @@
-import {createContext} from 'react'
+import {createContext, useState, useCallback} from 'react'
+import {
+  fetchTodos as fetchTodosRequest,
+  createTodo as createTodoRequest,
+  deleteTodo as deleteTodoRequest,
+  updateTodo as updateTodoRequest,
+} from '../api'
 
-// createContext makes a channel. Nothing is in it yet.
 const TodosContext = createContext()
 
+// The Provider is an ordinary component. Everything that used to live in App
+// lives here now -- the state, and the four functions that change it.
+const Provider = (props) => {
+  const {children} = props
+
+  const [todos, setTodos] = useState([])
+  const [isLoading, setIsLoading] = useState(true)
+  const [error, setError] = useState(null)
+
+  // useCallback: give me back the SAME function object between renders.
+  // fetchTodos goes in a useEffect dependency array in App, and a function
+  // rebuilt on every render is a new value every render -- which would make
+  // that effect run forever. [] means "never rebuild it".
+  const fetchTodos = useCallback(async () => {
+    try {
+      const todos = await fetchTodosRequest()
+      setTodos(todos)
+    } catch (err) {
+      console.error(err)
+      setError('Could not reach the server. Is `npm run server` running?')
+    } finally {
+      setIsLoading(false)
+    }
+  }, [])
+
+  const createTodo = async (title) => {
+    const newTodo = await createTodoRequest(title)
+    setTodos([...todos, newTodo])
+  }
+
+  const deleteTodoById = async (id) => {
+    await deleteTodoRequest(id)
+    setTodos(todos.filter((todo) => todo.id !== id))
+  }
+
+  const editTodoById = async (id, newTitle) => {
+    const todo = todos.find((todo) => todo.id === id)
+    const updated = await updateTodoRequest({...todo, title: newTitle})
+    setTodos(
+      todos.map((todo) => {
+        if (todo.id === id) {
+          return updated
+        }
+        return todo
+      })
+    )
+  }
+
+  // ONE object holding everything we are sharing. Every consumer gets this.
+  const valuesToShare = {
+    todos,
+    isLoading,
+    error,
+    fetchTodos,
+    createTodo,
+    deleteTodoById,
+    editTodoById,
+  }
+
+  return (
+    <TodosContext.Provider value={valuesToShare}>
+      {children}
+    </TodosContext.Provider>
+  )
+}
+
+export {Provider}
 export default TodosContext
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import {createContext, useState, useCallback} from 'react'
import {
  fetchTodos as fetchTodosRequest,
  createTodo as createTodoRequest,
  deleteTodo as deleteTodoRequest,
  updateTodo as updateTodoRequest,
} from '../api'

const TodosContext = createContext()

// The Provider is an ordinary component. Everything that used to live in App
// lives here now -- the state, and the four functions that change it.
const Provider = (props) => {
  const {children} = props

  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // useCallback: give me back the SAME function object between renders.
  // fetchTodos goes in a useEffect dependency array in App, and a function
  // rebuilt on every render is a new value every render -- which would make
  // that effect run forever. [] means "never rebuild it".
  const fetchTodos = useCallback(async () => {
    try {
      const todos = await fetchTodosRequest()
      setTodos(todos)
    } catch (err) {
      console.error(err)
      setError('Could not reach the server. Is `npm run server` running?')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createTodo = async (title) => {
    const newTodo = await createTodoRequest(title)
    setTodos([...todos, newTodo])
  }

  const deleteTodoById = async (id) => {
    await deleteTodoRequest(id)
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const editTodoById = async (id, newTitle) => {
    const todo = todos.find((todo) => todo.id === id)
    const updated = await updateTodoRequest({...todo, title: newTitle})
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return updated
        }
        return todo
      })
    )
  }

  // ONE object holding everything we are sharing. Every consumer gets this.
  const valuesToShare = {
    todos,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    deleteTodoById,
    editTodoById,
  }

  return (
    <TodosContext.Provider value={valuesToShare}>
      {children}
    </TodosContext.Provider>
  )
}

export {Provider}
export default TodosContext
```

</details>

---

<a id="step-4"></a>

## Step 4 — A custom hook, because imports add up

Every component that wants the todos would need two imports — `useContext` from react, and the context itself — plus the call. Three lines of ceremony, repeated in five files.

So we write our own hook. **A custom hook is just a function whose name starts with `use` and which calls other hooks.** That is the entire rule. No magic.

`useTodosContext()` wraps the two lines, so a component needs one import. And if the context ever moves or gets renamed, there is exactly one file to change.

**`src/hooks/use-todos-context.jsx`**  — new file

```jsx
import {useContext} from 'react'
import TodosContext from '../context/todos'

// A custom hook: a function starting with `use` that calls other hooks.
// This one exists so components import ONE thing instead of two, and so
// there is a single place to change if the context ever moves.
const useTodosContext = () => {
  return useContext(TodosContext)
}

export default useTodosContext
```

---

<a id="step-5"></a>

## Step 5 — Wrap the app

Swap the toy `<TodosContext.Provider value={5}>` for the real `<Provider>` in `main.jsx`.

**Where you wrap decides who can reach it.** Everything inside has access; everything outside does not. We wrap the whole app because the todos are genuinely app-wide — but if only one page needed them, wrapping that page would be the better choice.

**`src/main.jsx`**

What changed:

```diff
@@ -3,14 +3,13 @@
 import './index.css'
 import App from './App'
-import TodosContext from './context/todos'
+import {Provider} from './context/todos'
 
 const root = ReactDOM.createRoot(document.getElementById('root'))
 root.render(
   <React.StrictMode>
-    {/* whatever goes in `value` is readable by ANY component inside, at any
-        depth, without being passed down through a single prop */}
-    <TodosContext.Provider value={5}>
+    {/* everything inside can now reach the todos, at any depth */}
+    <Provider>
       <App />
-    </TodosContext.Provider>
+    </Provider>
   </React.StrictMode>
 )
```

<details>
<summary>Full file after this step</summary>

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import {Provider} from './context/todos'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {/* everything inside can now reach the todos, at any depth */}
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
)
```

</details>

---

<a id="step-6"></a>

## Step 6 — App gets a lot shorter

Delete the state. Delete the four handlers. Delete the api imports. `App` now asks the hook for what it needs to render and does nothing else:

```
const {todos, isLoading, error, fetchTodos} = useTodosContext()
```

And look at what `TodoCreate` and `TodoList` are passed now. `<TodoCreate />`. `<TodoList />`. No props at all.

Count the lines you just deleted from this file.

**`src/App.jsx`**

What changed:

```diff
@@ -1,83 +1,28 @@
-import {useState, useEffect} from 'react'
+import {useEffect} from 'react'
 import TodoCreate from './components/TodoCreate'
 import TodoList from './components/TodoList'
-import {
-  fetchTodos,
-  createTodo as createTodoRequest,
-  deleteTodo as deleteTodoRequest,
-  updateTodo as updateTodoRequest,
-} from './api'
+import useTodosContext from './hooks/use-todos-context'
 
 const App = () => {
-  const [todos, setTodos] = useState([])
-  const [isLoading, setIsLoading] = useState(true)
-  const [error, setError] = useState(null)
+  // no useState, no handlers, no api imports. App renders and that is all.
+  const {todos, isLoading, error, fetchTodos} = useTodosContext()
 
-  // [] = run once, when the component first appears. NOT every render --
-  // that would fetch, set state, re-render, fetch again, forever.
   useEffect(() => {
-    const loadTodos = async () => {
-      try {
-        const todos = await fetchTodos()
-        setTodos(todos)
-      } catch (err) {
-        // the usual cause: you forgot to start the server in the second tab
-        console.error(err)
-        setError('Could not reach the server. Is `npm run server` running?')
-      } finally {
-        setIsLoading(false)
-      }
-    }
-    loadTodos()
-  }, [])
-
-  const createTodo = async (title) => {
-    // the server makes the id now, so we no longer invent one
-    const newTodo = await createTodoRequest(title)
-    const updatedTodos = [...todos, newTodo]
-    setTodos(updatedTodos)
-  }
-
-  const deleteTodoById = async (id) => {
-    // ask the server first. If it refuses, we never touch our state, and the
-    // screen keeps telling the truth.
-    await deleteTodoRequest(id)
-
-    const updatedTodos = todos.filter((todo) => {
-      return todo.id !== id
-    })
-    setTodos(updatedTodos)
-  }
-
-  const editTodoById = async (id, newTitle) => {
-    // find the whole todo and send all of it, because PUT replaces
-    const todo = todos.find((todo) => todo.id === id)
-    const updated = await updateTodoRequest({...todo, title: newTitle})
-
-    // map returns a new array the SAME length. Every todo comes back; the one
-    // we edited comes back as the object the SERVER sent us.
-    const updatedTodos = todos.map((todo) => {
-      if (todo.id === id) {
-        return updated
-      }
-      return todo
-    })
-    setTodos(updatedTodos)
-  }
+    fetchTodos()
+  }, [fetchTodos])
 
   return (
     <div className="max-w-xl mx-auto p-8">
       <h1 className="text-3xl font-bold mb-6">Todo List</h1>
-      <TodoCreate onCreate={createTodo} />
+      <TodoCreate />
+
       {isLoading && <p className="text-gray-500">Loading your todos...</p>}
 
-      {error && (
-        <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>
-      )}
+      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
 
       {!isLoading && !error && todos.length === 0 ? (
         <p className="text-gray-500">Nothing yet. Add something above.</p>
       ) : (
-        <TodoList todos={todos} onDelete={deleteTodoById} onEdit={editTodoById} />
+        <TodoList />
       )}
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useEffect} from 'react'
import TodoCreate from './components/TodoCreate'
import TodoList from './components/TodoList'
import useTodosContext from './hooks/use-todos-context'

const App = () => {
  // no useState, no handlers, no api imports. App renders and that is all.
  const {todos, isLoading, error, fetchTodos} = useTodosContext()

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      <TodoCreate />

      {isLoading && <p className="text-gray-500">Loading your todos...</p>}

      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

      {!isLoading && !error && todos.length === 0 ? (
        <p className="text-gray-500">Nothing yet. Add something above.</p>
      ) : (
        <TodoList />
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

## Step 7 — The infinite loop, and useCallback

Look at the effect:

```
useEffect(() => { fetchTodos() }, [fetchTodos])
```

`fetchTodos` comes from context now, so it is a **dependency** — the effect should re-run if that function changes.

Here is the problem. Take `useCallback` off it in the Provider and watch the network tab.

Every render rebuilds `fetchTodos`. **A function is an object**, and a rebuilt function is a *new* object — a new value in the dependency array. So: the effect runs, state changes, the Provider re-renders, `fetchTodos` is rebuilt, the effect sees a new value and runs again. Forever, as fast as your laptop can manage.

**`useCallback(fn, [])`** says: give me back the same function object every time. Stable value, effect runs once.

This is the one piece of React that exists purely because of how JavaScript compares things. `{} === {}` is false. Two identical functions are two different objects.

---

<a id="step-8"></a>

## Step 8 — TodoList loses its props entirely

The component we started the class complaining about.

```
const {todos} = useTodosContext()
```

No props. The two it never used are gone, and the one it did use comes from context. `TodoItem` gets only `todo` — the thing that actually differs per row.

**That is the shape to recognise:** what varies per instance stays a prop; what the whole app shares comes from context.

**`src/components/TodoList.jsx`**

What changed:

```diff
@@ -1,24 +1,16 @@
-import {useContext} from 'react'
-import TodosContext from '../context/todos'
 import TodoItem from './TodoItem'
+import useTodosContext from '../hooks/use-todos-context'
 
-const TodoList = (props) => {
-  const {todos, onDelete, onEdit} = props
-  // useContext reaches up the tree and grabs whatever the nearest Provider
-  // is sharing. No props involved.
-  const num = useContext(TodosContext)
+const TodoList = () => {
+  // no props at all. TodoList was passing onDelete and onEdit straight
+  // through without ever using them -- that is what prop drilling looks like,
+  // and it is gone now.
+  const {todos} = useTodosContext()
 
   const renderedTodos = todos.map((todo) => {
-    return (
-      <TodoItem key={todo.id} todo={todo} onDelete={onDelete} onEdit={onEdit} />
-    )
+    return <TodoItem key={todo.id} todo={todo} />
   })
 
-  return (
-    <div>
-      <p>the number from context: {num}</p>
-      {renderedTodos}
-    </div>
-  )
+  return <div>{renderedTodos}</div>
 }
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import TodoItem from './TodoItem'
import useTodosContext from '../hooks/use-todos-context'

const TodoList = () => {
  // no props at all. TodoList was passing onDelete and onEdit straight
  // through without ever using them -- that is what prop drilling looks like,
  // and it is gone now.
  const {todos} = useTodosContext()

  const renderedTodos = todos.map((todo) => {
    return <TodoItem key={todo.id} todo={todo} />
  })

  return <div>{renderedTodos}</div>
}

export default TodoList
```

</details>

---

<a id="step-9"></a>

## Step 9 — TodoItem and TodoCreate take what they need

`TodoItem` reads `deleteTodoById` and `editTodoById` straight from context. `TodoCreate` reads `createTodo` and no longer takes an `onCreate` prop.

**And `showEdit` does not move.** It is local state, it is about one row, nobody else needs it — so it stays exactly where it was. Context is for things other components need, not for everything.

Putting `showEdit` in context would be an actual bug, not just a style problem: every row would share one value, and opening one edit form would open all of them.

**`src/components/TodoItem.jsx`**

What changed:

```diff
@@ -1,13 +1,15 @@
 import {useState} from 'react'
 import TodoEdit from './TodoEdit'
+import useTodosContext from '../hooks/use-todos-context'
 
 const TodoItem = (props) => {
-  const {todo, onDelete, onEdit} = props
-  // THIS one belongs here. Whether this row is showing its edit form is
-  // nobody else's business -- App does not care, the other rows do not care.
+  const {todo} = props
+  // STILL local state, and still correct. Context is for things other
+  // components need. Nobody else cares whether this row is being edited.
   const [showEdit, setShowEdit] = useState(false)
+  const {deleteTodoById, editTodoById} = useTodosContext()
 
   const handleDelete = () => {
-    onDelete(todo.id)
+    deleteTodoById(todo.id)
   }
 
@@ -17,6 +19,5 @@
 
   const handleSubmit = (id, newTitle) => {
-    onEdit(id, newTitle)
-    // close the form once the edit has gone up
+    editTodoById(id, newTitle)
     setShowEdit(false)
   }
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import TodoEdit from './TodoEdit'
import useTodosContext from '../hooks/use-todos-context'

const TodoItem = (props) => {
  const {todo} = props
  // STILL local state, and still correct. Context is for things other
  // components need. Nobody else cares whether this row is being edited.
  const [showEdit, setShowEdit] = useState(false)
  const {deleteTodoById, editTodoById} = useTodosContext()

  const handleDelete = () => {
    deleteTodoById(todo.id)
  }

  const handleEditClick = () => {
    setShowEdit(!showEdit)
  }

  const handleSubmit = (id, newTitle) => {
    editTodoById(id, newTitle)
    setShowEdit(false)
  }

  if (showEdit) {
    return <TodoEdit todo={todo} onSubmit={handleSubmit} />
  }

  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-3">
      <span>{todo.title}</span>
      <div className="flex gap-3 text-sm">
        <button onClick={handleEditClick} className="text-blue-700">
          edit
        </button>
        <button onClick={handleDelete} className="text-red-600">
          delete
        </button>
      </div>
    </div>
  )
}

export default TodoItem
```

</details>

**`src/components/TodoCreate.jsx`**

What changed:

```diff
@@ -1,6 +1,7 @@
 import {useState} from 'react'
+import useTodosContext from '../hooks/use-todos-context'
 
-const TodoCreate = (props) => {
-  const {onCreate} = props
+const TodoCreate = () => {
+  const {createTodo} = useTodosContext()
   // the input's text lives here -- this component owns it, because nobody
   // else needs to know what you are halfway through typing
@@ -13,5 +14,5 @@
   const handleSubmit = (event) => {
     event.preventDefault()
-    onCreate(title)
+    createTodo(title)
     // clear the box. This is only possible BECAUSE the input is controlled.
     setTitle('')
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import useTodosContext from '../hooks/use-todos-context'

const TodoCreate = () => {
  const {createTodo} = useTodosContext()
  // the input's text lives here -- this component owns it, because nobody
  // else needs to know what you are halfway through typing
  const [title, setTitle] = useState('')

  const handleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    createTodo(title)
    // clear the box. This is only possible BECAUSE the input is controlled.
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={title}
        onChange={handleChange}
        placeholder="What needs doing?"
        className="flex-1 border border-gray-300 rounded px-3 py-2"
      />
      <button className="bg-blue-900 text-white px-5 py-2 rounded">Add</button>
    </form>
  )
}

export default TodoCreate
```

</details>

---

<a id="step-10"></a>

## Step 10 — What context is not

Three honest limits, because the next thing that happens to people who learn context is that they put everything in it.

**It is not a replacement for props.** `todo` is still a prop, and should be. Anything that differs per instance is a prop.

**It is not a replacement for local state.** `showEdit` and the half-typed text in `TodoCreate` both stayed put.

**It is not Redux.** Context is a *communication channel* — it moves a value from up there to down here. It has no opinion about how that value changes, no devtools, no history. Redux Toolkit, later this semester, is the thing with opinions.

And one real cost: **everything consuming a context re-renders when its value changes.** One Provider holding the whole app means a change to anything re-renders everything that reads it. For a todo list that is nothing. For a big app it is why people split into several smaller contexts.

---

<a id="step-11"></a>

## Step 11 — In-class exercise: a second context

Twenty minutes. Your homework filter — All / Active / Done — currently lives in `App` and gets passed down.

Give it its own context: `context/filter.jsx`, a Provider holding the selected filter, and a `use-filter-context` hook. The filter buttons read and set it; `TodoList` reads it to decide what to render.

Two questions worth having an answer to:

1. **Why a second context** rather than adding `filter` to the todos one? Think about what each is *about*, and about which components re-render
2. Where does the `<FilterProvider>` go relative to `<Provider>` — does the order matter here, and when would it?

If you did not do the filter homework, do it now with context from the start. Same work, fewer props.

---

**Where we landed:** the same app, with the state and the four operations living in one Provider, and every component taking exactly what it needs.

**The shape of it:**

- **`createContext()`** makes the channel
- **a Provider component** holds the state and shares an object of values
- **`useContext`** reads it — wrapped in our own `useTodosContext` hook, so components import one thing
- **`useCallback`** keeps a function stable when it is used as an effect dependency

**And what context is not:**

- not a replacement for props. `TodoItem` still takes `todo` as a prop, because that is the thing that differs per row
- not a replacement for local state. `showEdit` stayed exactly where it was
- not Redux. It moves values around; it has no opinion about how they change

**Homework:** see [HW.md](HW.md).

Next: the midterm.
