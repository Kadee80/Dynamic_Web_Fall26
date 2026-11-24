# Week 13: The Todo List, part 4: Redux

*Replacing the Context API with a Redux Toolkit slice · ~110 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

The todo list, for the fourth and last time.

You have built this app with `useState`, with `useReducer`, and with the Context API. Today it moves to Redux Toolkit, and when we are finished it will do exactly what it does now. Nothing visible changes. That is the point: you can watch the same application through four different ways of holding state, which is a much better way to understand the difference than four different apps would be.

**Start from `starter/todo-list-redux`.** It is the finished Context version from Week 07, so everybody begins from code that works.

**You need two terminals today**, as in Week 07: one for `npm run server`, one for `npm run dev`.

By the end there will be one thing still wrong with this app, and it is not something context would have fixed either. Finding it is the last step. Fixing it is next class.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [Install, and a slice with no reducers in it](#step-1)
2. [Swap the Provider, and break the app on purpose](#step-2)
3. [The first two reducers, and the list comes back](#step-3)
4. [TodoList, which barely notices](#step-4)
5. [Adding a todo, and a component with two jobs](#step-5)
6. [Delete and edit, and the same shape twice more](#step-6)
7. [Delete the context](#step-7)
8. [One action per click, and a Vite setting that was lying to you](#step-8)
9. [In-class exercise: a todo you can finish](#step-9)

---

<a id="step-1"></a>

## Step 1: Install, and a slice with no reducers in it

Copy `starter/todo-list-redux` into your homework repo and `npm install` it. Then the two packages we used for the print shop.

Before writing a single reducer, write the state. Open `src/context/todos.jsx` and look at the top of the Provider: three `useState` calls, and those three things are the state of this application. They go straight into `initialState`.

Notice that only one of the three is the todos. `isLoading` and `error` describe **the request**, not the data. That distinction is going to matter a lot next class.

`reducers` is empty for now, and the file still exports a reducer, because `createSlice` builds one out of nothing quite happily.

```bash
npm install @reduxjs/toolkit react-redux
```

**`package.json`**

What changed:

```diff
@@ -1,4 +1,4 @@
 {
-  "name": "todo-list",
+  "name": "todo-list-redux",
   "private": true,
   "version": "0.0.0",
@@ -11,7 +11,9 @@
   },
   "dependencies": {
+    "@reduxjs/toolkit": "^2.5.0",
     "axios": "^1.7.9",
     "react": "^19.1.1",
-    "react-dom": "^19.1.1"
+    "react-dom": "^19.1.1",
+    "react-redux": "^9.2.0"
   },
   "devDependencies": {
```

<details>
<summary>Full file after this step</summary>

```
{
  "name": "todo-list-redux",
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
    "@reduxjs/toolkit": "^2.5.0",
    "axios": "^1.7.9",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-redux": "^9.2.0"
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

</details>

**`src/features/todosSlice.js`**  (new file)

```js
import {createSlice} from '@reduxjs/toolkit'

const todosSlice = createSlice({
  name: 'todos',

  // Lifted straight out of the context Provider. Those three useState calls
  // were the state of this app, and this is the same three things in one
  // place. Note that only ONE of them is the todos: isLoading and error
  // describe the request, not the data.
  initialState: {
    items: [],
    isLoading: true,
    error: null,
  },

  reducers: {},
})

export default todosSlice.reducer
```

**`src/store.js`**  (new file)

```js
import {configureStore} from '@reduxjs/toolkit'
import todosReducer from './features/todosSlice'

// One slice this time. The print shop had three, and the shape of the file
// does not change.
export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
})
```

---

<a id="step-2"></a>

## Step 2: Swap the Provider, and break the app on purpose

One import changes and one component changes. The context `Provider` we wrote by hand comes out, and the one from `react-redux` goes in.

Look at the two side by side before you delete anything. Same shape, same position in the tree, same job: make a value reachable from anywhere below without passing it through. The difference is that we wrote one of them and imported the other.

**The app is now broken**, and it will stay broken until step 3. `useTodosContext` is still being called in four components and there is no longer a context above them to read, so it hands back `undefined` and destructuring it throws. That is expected. Do not go looking for a typo.

**`src/main.jsx`**

What changed:

```diff
@@ -1,13 +1,15 @@
 import React from 'react'
 import ReactDOM from 'react-dom/client'
+import {Provider} from 'react-redux'
 import './index.css'
 import App from './App'
-import {Provider} from './context/todos'
+import {store} from './store'
 
 const root = ReactDOM.createRoot(document.getElementById('root'))
 root.render(
   <React.StrictMode>
-    {/* everything inside can now reach the todos, at any depth */}
-    <Provider>
+    {/* Same shape as the context Provider it replaces, and it is doing the
+        same job. The difference is that we did not have to write it. */}
+    <Provider store={store}>
       <App />
     </Provider>
```

<details>
<summary>Full file after this step</summary>

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux'
import './index.css'
import App from './App'
import {store} from './store'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    {/* Same shape as the context Provider it replaces, and it is doing the
        same job. The difference is that we did not have to write it. */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
```

</details>

---

<a id="step-3"></a>

## Step 3: The first two reducers, and the list comes back

`App` is the first component to move across, and it needs two reducers to exist first.

`todosLoaded` is the answer to 'the server replied'. It takes the array and puts it in `items`, and it clears the loading flag, because the load is over. `loadingFailed` is the other ending.

Then four selectors. The same rule as the print shop: if the shape of the state ever changes, this file is the only one that has to know.

In `App`, `useTodosContext` becomes four `useSelector` calls and one `useDispatch`. The effect keeps doing what it did, except that instead of calling `setTodos` it dispatches.

**Save, and the list comes back.** Open the Redux devtools and look at what just happened: one `todos/todosLoaded` action with the whole array as its payload.

**`src/features/todosSlice.js`**

What changed:

```diff
@@ -4,8 +4,4 @@
   name: 'todos',
 
-  // Lifted straight out of the context Provider. Those three useState calls
-  // were the state of this app, and this is the same three things in one
-  // place. Note that only ONE of them is the todos: isLoading and error
-  // describe the request, not the data.
   initialState: {
     items: [],
@@ -14,6 +10,25 @@
   },
 
-  reducers: {},
+  reducers: {
+    // the server answered. Replace the list with what it sent.
+    todosLoaded(state, action) {
+      state.items = action.payload
+      state.isLoading = false
+      state.error = null
+    },
+
+    loadingFailed(state, action) {
+      state.error = action.payload
+      state.isLoading = false
+    },
+  },
 })
+
+export const {todosLoaded, loadingFailed} = todosSlice.actions
+
+export const selectTodos = (state) => state.todos.items
+export const selectIsLoading = (state) => state.todos.isLoading
+export const selectError = (state) => state.todos.error
+export const selectTodoCount = (state) => state.todos.items.length
 
 export default todosSlice.reducer
```

<details>
<summary>Full file after this step</summary>

```js
import {createSlice} from '@reduxjs/toolkit'

const todosSlice = createSlice({
  name: 'todos',

  initialState: {
    items: [],
    isLoading: true,
    error: null,
  },

  reducers: {
    // the server answered. Replace the list with what it sent.
    todosLoaded(state, action) {
      state.items = action.payload
      state.isLoading = false
      state.error = null
    },

    loadingFailed(state, action) {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const {todosLoaded, loadingFailed} = todosSlice.actions

export const selectTodos = (state) => state.todos.items
export const selectIsLoading = (state) => state.todos.isLoading
export const selectError = (state) => state.todos.error
export const selectTodoCount = (state) => state.todos.items.length

export default todosSlice.reducer
```

</details>

**`src/App.jsx`**

What changed:

```diff
@@ -1,14 +1,39 @@
 import {useEffect} from 'react'
+import {useSelector, useDispatch} from 'react-redux'
 import TodoCreate from './components/TodoCreate'
 import TodoList from './components/TodoList'
-import useTodosContext from './hooks/use-todos-context'
+import {fetchTodos} from './api'
+import {
+  todosLoaded,
+  loadingFailed,
+  selectTodos,
+  selectIsLoading,
+  selectError,
+  selectTodoCount,
+} from './features/todosSlice'
 
 const App = () => {
-  // no useState, no handlers, no api imports. App renders and that is all.
-  const {todos, isLoading, error, fetchTodos} = useTodosContext()
+  const dispatch = useDispatch()
+  const todos = useSelector(selectTodos)
+  const isLoading = useSelector(selectIsLoading)
+  const error = useSelector(selectError)
+  const count = useSelector(selectTodoCount)
 
+  // Look at what this effect has to do. It talks to the server, it decides
+  // which action to dispatch, and it handles the failure. None of that is
+  // rendering, and none of it belongs in a component.
   useEffect(() => {
-    fetchTodos()
-  }, [fetchTodos])
+    const load = async () => {
+      try {
+        const todos = await fetchTodos()
+        dispatch(todosLoaded(todos))
+      } catch (err) {
+        console.error(err)
+        dispatch(loadingFailed('Could not reach the server. Is `npm run server` running?'))
+      }
+    }
+
+    load()
+  }, [dispatch])
 
   return (
@@ -28,5 +53,5 @@
 
       <p className="mt-6 text-sm text-gray-500">
-        {todos.length} {todos.length === 1 ? 'thing' : 'things'} to do
+        {count} {count === 1 ? 'thing' : 'things'} to do
       </p>
     </div>
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import TodoCreate from './components/TodoCreate'
import TodoList from './components/TodoList'
import {fetchTodos} from './api'
import {
  todosLoaded,
  loadingFailed,
  selectTodos,
  selectIsLoading,
  selectError,
  selectTodoCount,
} from './features/todosSlice'

const App = () => {
  const dispatch = useDispatch()
  const todos = useSelector(selectTodos)
  const isLoading = useSelector(selectIsLoading)
  const error = useSelector(selectError)
  const count = useSelector(selectTodoCount)

  // Look at what this effect has to do. It talks to the server, it decides
  // which action to dispatch, and it handles the failure. None of that is
  // rendering, and none of it belongs in a component.
  useEffect(() => {
    const load = async () => {
      try {
        const todos = await fetchTodos()
        dispatch(todosLoaded(todos))
      } catch (err) {
        console.error(err)
        dispatch(loadingFailed('Could not reach the server. Is `npm run server` running?'))
      }
    }

    load()
  }, [dispatch])

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
        {count} {count === 1 ? 'thing' : 'things'} to do
      </p>
    </div>
  )
}

export default App
```

</details>

---

<a id="step-4"></a>

## Step 4: TodoList, which barely notices

Two lines. The import changes and the hook changes.

This component lost its props in Week 07 and it is not getting them back. It asks for the list and renders the list, and it has now survived two refactors without its job changing once.

**`src/components/TodoList.jsx`**

What changed:

```diff
@@ -1,10 +1,10 @@
+import {useSelector} from 'react-redux'
 import TodoItem from './TodoItem'
-import useTodosContext from '../hooks/use-todos-context'
+import {selectTodos} from '../features/todosSlice'
 
 const TodoList = () => {
-  // no props at all. TodoList was passing onDelete and onEdit straight
-  // through without ever using them -- that is what prop drilling looks like,
-  // and it is gone now.
-  const {todos} = useTodosContext()
+  // Still no props. useSelector replaces useTodosContext and the component
+  // is otherwise untouched.
+  const todos = useSelector(selectTodos)
 
   const renderedTodos = todos.map((todo) => {
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useSelector} from 'react-redux'
import TodoItem from './TodoItem'
import {selectTodos} from '../features/todosSlice'

const TodoList = () => {
  // Still no props. useSelector replaces useTodosContext and the component
  // is otherwise untouched.
  const todos = useSelector(selectTodos)

  const renderedTodos = todos.map((todo) => {
    return <TodoItem key={todo.id} todo={todo} />
  })

  return <div>{renderedTodos}</div>
}

export default TodoList
```

</details>

---

<a id="step-5"></a>

## Step 5: Adding a todo, and a component with two jobs

`todoAdded` first. One line in the reducer, and the comment above it is the important part: **the payload is the todo the server sent back**, with its id already on it. We are not inventing ids on this side. The server owns them.

Now `TodoCreate`. The text in the input stays `useState`, because nobody else needs to know what you are halfway through typing. Only the submit changes.

And look carefully at what submit does now:

1. talk to the server and wait
2. dispatch the result

Two jobs in one handler, in a component whose actual job is to draw a form. **Remember this shape.** It works, it is perfectly real code, and we are going to come back to it.

**`src/features/todosSlice.js`**

What changed:

```diff
@@ -22,8 +22,14 @@
       state.isLoading = false
     },
+
+    // the payload is the todo the SERVER sent back, with its id already on
+    // it. We are not inventing ids on this side.
+    todoAdded(state, action) {
+      state.items.push(action.payload)
+    },
   },
 })
 
-export const {todosLoaded, loadingFailed} = todosSlice.actions
+export const {todosLoaded, loadingFailed, todoAdded} = todosSlice.actions
 
 export const selectTodos = (state) => state.todos.items
```

<details>
<summary>Full file after this step</summary>

```js
import {createSlice} from '@reduxjs/toolkit'

const todosSlice = createSlice({
  name: 'todos',

  initialState: {
    items: [],
    isLoading: true,
    error: null,
  },

  reducers: {
    // the server answered. Replace the list with what it sent.
    todosLoaded(state, action) {
      state.items = action.payload
      state.isLoading = false
      state.error = null
    },

    loadingFailed(state, action) {
      state.error = action.payload
      state.isLoading = false
    },

    // the payload is the todo the SERVER sent back, with its id already on
    // it. We are not inventing ids on this side.
    todoAdded(state, action) {
      state.items.push(action.payload)
    },
  },
})

export const {todosLoaded, loadingFailed, todoAdded} = todosSlice.actions

export const selectTodos = (state) => state.todos.items
export const selectIsLoading = (state) => state.todos.isLoading
export const selectError = (state) => state.todos.error
export const selectTodoCount = (state) => state.todos.items.length

export default todosSlice.reducer
```

</details>

**`src/components/TodoCreate.jsx`**

What changed:

```diff
@@ -1,9 +1,11 @@
 import {useState} from 'react'
-import useTodosContext from '../hooks/use-todos-context'
+import {useDispatch} from 'react-redux'
+import {createTodo} from '../api'
+import {todoAdded} from '../features/todosSlice'
 
 const TodoCreate = () => {
-  const {createTodo} = useTodosContext()
-  // the input's text lives here -- this component owns it, because nobody
-  // else needs to know what you are halfway through typing
+  const dispatch = useDispatch()
+  // The input's text is still local state, and that is still right. Nobody
+  // else needs to know what you are halfway through typing.
   const [title, setTitle] = useState('')
 
@@ -12,8 +14,12 @@
   }
 
-  const handleSubmit = (event) => {
+  // Two steps, in order: talk to the server, THEN tell the store. The
+  // component is now doing both jobs.
+  const handleSubmit = async (event) => {
     event.preventDefault()
-    createTodo(title)
-    // clear the box. This is only possible BECAUSE the input is controlled.
+
+    const newTodo = await createTodo(title)
+    dispatch(todoAdded(newTodo))
+
     setTitle('')
   }
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {createTodo} from '../api'
import {todoAdded} from '../features/todosSlice'

const TodoCreate = () => {
  const dispatch = useDispatch()
  // The input's text is still local state, and that is still right. Nobody
  // else needs to know what you are halfway through typing.
  const [title, setTitle] = useState('')

  const handleChange = (event) => {
    setTitle(event.target.value)
  }

  // Two steps, in order: talk to the server, THEN tell the store. The
  // component is now doing both jobs.
  const handleSubmit = async (event) => {
    event.preventDefault()

    const newTodo = await createTodo(title)
    dispatch(todoAdded(newTodo))

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

<a id="step-6"></a>

## Step 6: Delete and edit, and the same shape twice more

Two more reducers. `todoRemoved` takes an id and filters. `todoUpdated` takes the whole updated todo, finds the one with that id, and changes its title in place, which Immer allows.

Then `TodoItem`, which is the same pattern again: await the server, dispatch the result. Twice, in one file.

`showEdit` stays `useState`. Nobody outside this row cares whether it is being edited, and putting it in the store would mean every row re-renders when any row opens.

**`src/features/todosSlice.js`**

What changed:

```diff
@@ -4,4 +4,8 @@
   name: 'todos',
 
+  // Three things, and only one of them is the todos. isLoading and error
+  // describe the REQUEST, not the data. Keep an eye on them today: by the
+  // end of the hour we will be setting them by hand from three different
+  // components, and that is the problem next class solves.
   initialState: {
     items: [],
@@ -28,8 +32,29 @@
       state.items.push(action.payload)
     },
+
+    todoRemoved(state, action) {
+      const id = action.payload
+      state.items = state.items.filter((todo) => todo.id !== id)
+    },
+
+    todoUpdated(state, action) {
+      const updated = action.payload
+      const todo = state.items.find((item) => item.id === updated.id)
+
+      if (todo) {
+        // Immer again. Change the one we found and leave the rest alone.
+        todo.title = updated.title
+      }
+    },
   },
 })
 
-export const {todosLoaded, loadingFailed, todoAdded} = todosSlice.actions
+export const {
+  todosLoaded,
+  loadingFailed,
+  todoAdded,
+  todoRemoved,
+  todoUpdated,
+} = todosSlice.actions
 
 export const selectTodos = (state) => state.todos.items
```

<details>
<summary>Full file after this step</summary>

```js
import {createSlice} from '@reduxjs/toolkit'

const todosSlice = createSlice({
  name: 'todos',

  // Three things, and only one of them is the todos. isLoading and error
  // describe the REQUEST, not the data. Keep an eye on them today: by the
  // end of the hour we will be setting them by hand from three different
  // components, and that is the problem next class solves.
  initialState: {
    items: [],
    isLoading: true,
    error: null,
  },

  reducers: {
    // the server answered. Replace the list with what it sent.
    todosLoaded(state, action) {
      state.items = action.payload
      state.isLoading = false
      state.error = null
    },

    loadingFailed(state, action) {
      state.error = action.payload
      state.isLoading = false
    },

    // the payload is the todo the SERVER sent back, with its id already on
    // it. We are not inventing ids on this side.
    todoAdded(state, action) {
      state.items.push(action.payload)
    },

    todoRemoved(state, action) {
      const id = action.payload
      state.items = state.items.filter((todo) => todo.id !== id)
    },

    todoUpdated(state, action) {
      const updated = action.payload
      const todo = state.items.find((item) => item.id === updated.id)

      if (todo) {
        // Immer again. Change the one we found and leave the rest alone.
        todo.title = updated.title
      }
    },
  },
})

export const {
  todosLoaded,
  loadingFailed,
  todoAdded,
  todoRemoved,
  todoUpdated,
} = todosSlice.actions

export const selectTodos = (state) => state.todos.items
export const selectIsLoading = (state) => state.todos.isLoading
export const selectError = (state) => state.todos.error
export const selectTodoCount = (state) => state.todos.items.length

export default todosSlice.reducer
```

</details>

**`src/components/TodoItem.jsx`**

What changed:

```diff
@@ -1,15 +1,18 @@
 import {useState} from 'react'
+import {useDispatch} from 'react-redux'
 import TodoEdit from './TodoEdit'
-import useTodosContext from '../hooks/use-todos-context'
+import {deleteTodo, updateTodo} from '../api'
+import {todoRemoved, todoUpdated} from '../features/todosSlice'
 
 const TodoItem = (props) => {
   const {todo} = props
-  // STILL local state, and still correct. Context is for things other
-  // components need. Nobody else cares whether this row is being edited.
+  const dispatch = useDispatch()
+  // Local state, and still correct. Redux is for things other components
+  // need. Nobody else cares whether this row is being edited.
   const [showEdit, setShowEdit] = useState(false)
-  const {deleteTodoById, editTodoById} = useTodosContext()
 
-  const handleDelete = () => {
-    deleteTodoById(todo.id)
+  const handleDelete = async () => {
+    await deleteTodo(todo.id)
+    dispatch(todoRemoved(todo.id))
   }
 
@@ -18,6 +21,7 @@
   }
 
-  const handleSubmit = (id, newTitle) => {
-    editTodoById(id, newTitle)
+  const handleSubmit = async (id, newTitle) => {
+    const updated = await updateTodo({...todo, title: newTitle})
+    dispatch(todoUpdated(updated))
     setShowEdit(false)
   }
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import {useDispatch} from 'react-redux'
import TodoEdit from './TodoEdit'
import {deleteTodo, updateTodo} from '../api'
import {todoRemoved, todoUpdated} from '../features/todosSlice'

const TodoItem = (props) => {
  const {todo} = props
  const dispatch = useDispatch()
  // Local state, and still correct. Redux is for things other components
  // need. Nobody else cares whether this row is being edited.
  const [showEdit, setShowEdit] = useState(false)

  const handleDelete = async () => {
    await deleteTodo(todo.id)
    dispatch(todoRemoved(todo.id))
  }

  const handleEditClick = () => {
    setShowEdit(!showEdit)
  }

  const handleSubmit = async (id, newTitle) => {
    const updated = await updateTodo({...todo, title: newTitle})
    dispatch(todoUpdated(updated))
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

---

<a id="step-7"></a>

## Step 7: Delete the context

Nothing imports from `src/context/` or `src/hooks/` any more. Delete both folders.

Stop and look at what went: a file that created a channel, a component that held seven values and four functions, and a custom hook whose only job was to save an import. All of it replaced by a slice file and three lines of store.

This is the honest comparison, and it cuts both ways. Context needed no dependency and no new vocabulary. Redux needed a package, a store, a Provider, selectors and action creators, and in exchange the plumbing is written for you and you get the devtools. On an app this size it is close to a draw. The bigger the app, the less close it gets.

**Deleted:** `src/context/todos.jsx`

**Deleted:** `src/hooks/use-todos-context.jsx`

---

<a id="step-8"></a>

## Step 8: One action per click, and a Vite setting that was lying to you

Before we check the devtools, one thing has to be fixed or the check is worthless.

`db.json` lives inside the project. Every time json-server writes to it, Vite sees a file change and reloads the page, and a reload refetches the whole list. So the screen looks right after every action **whether or not your reducer works**. A broken `todoAdded` would be completely invisible.

Tell Vite to ignore it, restart `npm run dev`, and now the only thing updating the screen is your own code.

Now open the devtools and use the app for a minute. Add one todo: **one action**. Edit one: **one action**. Delete one: **one action**. Then drag the slider back to the start and forward again, and watch the list rebuild itself from nothing but the actions.

```bash
# stop npm run dev, then start it again
```

**`vite.config.js`**

What changed:

```diff
@@ -5,4 +5,14 @@
 export default defineConfig({
   plugins: [react(), tailwindcss()],
+
+  server: {
+    // db.json sits inside the project, so every write json-server makes
+    // looks like a source change and Vite reloads the page. That reload
+    // refetches the list, which can hide a broken reducer: the screen
+    // looks right because the page restarted, not because your code works.
+    watch: {
+      ignored: ['**/db.json'],
+    },
+  },
 })
 
```

<details>
<summary>Full file after this step</summary>

```js
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    // db.json sits inside the project, so every write json-server makes
    // looks like a source change and Vite reloads the page. That reload
    // refetches the list, which can hide a broken reducer: the screen
    // looks right because the page restarted, not because your code works.
    watch: {
      ignored: ['**/db.json'],
    },
  },
})
```

</details>

---

<a id="step-9"></a>

## Step 9: In-class exercise: a todo you can finish

**Fifteen minutes.** A todo list where nothing can be ticked off is not much of a todo list.

Add a `done` flag:

- a checkbox on each row, showing the todo's current state
- clicking it flips that todo, on the server and in the store
- finished todos look finished, however you like
- the count at the bottom says how many are **left**, not how many exist

Two things to work out for yourself. **The server call is not one you have made before:** `PUT` replaces the whole record, and there is a method that changes one field and leaves the rest alone. It is in `api.http`, and it is not in `api.js` yet.

**And the count is not state.** If you find yourself adding anything to `initialState` for it, stop and write a selector instead.

If you finish: make the checkbox work when the server is down. You will find you cannot do it well with what we have today, and why is the interesting part.

---

**Where we landed:** the same todo list, with a store instead of a context, and no `context/` folder at all.

**What to take from today:**

- **The state shape came out of the Provider unchanged.** Three `useState` calls became three keys. If you can see the state of an app, you can write the slice.
- **`useSelector` replaces the custom hook, `useDispatch` replaces the functions.** Components ask for what they need and announce what happened. They never reach for a setter.
- **`TodoEdit` never changed.** It took props at the start of the semester and it takes props now. Components that do not know where data comes from survive every refactor you will ever do.
- **Local state stayed local.** `showEdit` and the text in the input are still `useState`, and that is still right.
- **One action per click.** If the devtools show two, something is dispatching that you did not mean to.

**The thing that is still wrong:** look at where the `await` calls live now. `App` talks to the server, `TodoCreate` talks to the server, `TodoItem` talks to the server twice. Three components doing the same kind of job, each one responsible for remembering to dispatch afterwards, and only one of them bothers with a `try` and a `catch`.

Context had this problem too. Redux as we have used it today does not fix it. **Dec 1 does.**

**Homework:** see [HW.md](HW.md).
