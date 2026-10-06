# Week 06 — The Todo List: CRUD in state

*Building a todo list: forms, lists, and the four array patterns · ~110 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

Today: a todo list. Add things, cross them off, change your mind, delete them. It sounds small, and it is the shape of most of the software you use.

There are no new hooks here — just `useState`, props, and three array methods doing specific jobs. By the end you will have written the four operations that every app with a list in it needs: **create, read, update, delete**.

Next class the list stops disappearing when you refresh.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [New project](#step-1)
2. [Three pieces of state, three owners](#step-2)
3. [TodoCreate: the form](#step-3)
4. [Create: spread, never push](#step-4)
5. [Read: TodoList and TodoItem](#step-5)
6. [Delete: filter](#step-6)
7. [Edit, part 1: the toggle and the form](#step-7)
8. [Edit, part 2: map](#step-8)
9. [An empty state and a count](#step-9)
10. [In-class exercise: cross it off](#step-10)

---

<a id="step-1"></a>

## Step 1 — New project

Third Vite scaffold in three weeks. No new packages today — just React and Tailwind.

You should be getting quick at this. Time yourself; by the midterm you want this to be two minutes of muscle memory, not a thing you look up.

```bash
npm create vite@latest todo-list -- --template react
cd todo-list
npm install
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
    <title>Todo List</title>
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
  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
    </div>
  )
}

export default App
```

---

<a id="step-2"></a>

## Step 2 — Three pieces of state, three owners

Before any code. We are building: a box to type a new todo, a list of todos, and on each row an edit and a delete button.

There are **three** separate pieces of state in that, and the whole design is deciding where each one goes:

1. **the list of todos** — `TodoCreate` adds to it, `TodoList` shows it, every `TodoItem` can change it. All of those are below `App`, so it lives in **`App`**
2. **the text you are halfway through typing** — nobody needs that but the input itself, so it lives in **`TodoCreate`**
3. **whether one row is showing its edit form** — the other rows do not care, `App` does not care, so it lives in that **`TodoItem`**

Same question every time: *who needs to know?* Put the state at the lowest place that covers everyone who needs it.

---

<a id="step-3"></a>

## Step 3 — TodoCreate: the form

A controlled input and a form, exactly like the SearchBar from the image search. `value` down, `onChange` up, `event.preventDefault()` so the page does not reload.

One new line at the end of `handleSubmit`: **`setTitle('')`**. Clearing the box after submit is only possible because the input is controlled — React owns the value, so React can change it. An uncontrolled input would need you to reach into the DOM.

`onCreate` is a prop. The form does not know what happens to the title; it just hands it up.

**`src/components/TodoCreate.jsx`**  — new file

```jsx
import {useState} from 'react'

const TodoCreate = (props) => {
  const {onCreate} = props
  // the input's text lives here -- this component owns it, because nobody
  // else needs to know what you are halfway through typing
  const [title, setTitle] = useState('')

  const handleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onCreate(title)
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

---

<a id="step-4"></a>

## Step 4 — Create: spread, never push

`App` holds the list and the function that adds to it.

**This is the line that matters:**

```
const updatedTodos = [...todos, {id: crypto.randomUUID(), title}]
```

Not `todos.push(...)`. Push changes the array that React is already holding — same array, same reference — so when React compares the new state to the old one it sees the same thing and does not re-render. Your todo is in there. You just cannot see it.

The spread makes a **new array**: old items copied in, new item on the end. New array, new reference, re-render.

Each todo gets an id now, because we will need to point at a specific one in about ten minutes.

**`src/App.jsx`**

What changed:

```diff
@@ -1,6 +1,26 @@
+import {useState} from 'react'
+import TodoCreate from './components/TodoCreate'
+
 const App = () => {
+  // the list lives HERE. Every component that reads or changes it is below
+  // this one, so this is the lowest place that can own it.
+  const [todos, setTodos] = useState([])
+
+  const createTodo = (title) => {
+    // NEVER todos.push(...). Push changes the array React is already holding,
+    // so React compares it to itself, sees no change, and does not re-render.
+    const updatedTodos = [
+      ...todos,
+      {id: crypto.randomUUID(), title},
+    ]
+    setTodos(updatedTodos)
+  }
+
+  console.log(todos)
+
   return (
     <div className="max-w-xl mx-auto p-8">
       <h1 className="text-3xl font-bold mb-6">Todo List</h1>
+      <TodoCreate onCreate={createTodo} />
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import TodoCreate from './components/TodoCreate'

const App = () => {
  // the list lives HERE. Every component that reads or changes it is below
  // this one, so this is the lowest place that can own it.
  const [todos, setTodos] = useState([])

  const createTodo = (title) => {
    // NEVER todos.push(...). Push changes the array React is already holding,
    // so React compares it to itself, sees no change, and does not re-render.
    const updatedTodos = [
      ...todos,
      {id: crypto.randomUUID(), title},
    ]
    setTodos(updatedTodos)
  }

  console.log(todos)

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      <TodoCreate onCreate={createTodo} />
    </div>
  )
}

export default App
```

</details>

---

<a id="step-5"></a>

## Step 5 — Read: TodoList and TodoItem

Two components, one job each. `TodoList` knows how to map; `TodoItem` knows what one row looks like.

You have written this exact shape twice already — the image list, the card grid. `key={todo.id}`, because React needs to tell the rows apart when the array changes.

Notice `TodoItem` takes `onDelete` and calls it with its own id. The row knows **which** todo it is. It does not know **how** to delete one. That is `App`'s job, and the row just reports.

**`src/components/TodoItem.jsx`**  — new file

```jsx
const TodoItem = (props) => {
  const {todo, onDelete} = props

  const handleDelete = () => {
    // the item knows WHICH todo it is. It does not know how to delete one.
    onDelete(todo.id)
  }

  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-3">
      <span>{todo.title}</span>
      <button onClick={handleDelete} className="text-sm text-red-600">
        delete
      </button>
    </div>
  )
}

export default TodoItem
```

**`src/components/TodoList.jsx`**  — new file

```jsx
import TodoItem from './TodoItem'

const TodoList = (props) => {
  const {todos, onDelete} = props

  const renderedTodos = todos.map((todo) => {
    return <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
  })

  return <div>{renderedTodos}</div>
}

export default TodoList
```

**`src/App.jsx`**

What changed:

```diff
@@ -1,13 +1,10 @@
 import {useState} from 'react'
 import TodoCreate from './components/TodoCreate'
+import TodoList from './components/TodoList'
 
 const App = () => {
-  // the list lives HERE. Every component that reads or changes it is below
-  // this one, so this is the lowest place that can own it.
   const [todos, setTodos] = useState([])
 
   const createTodo = (title) => {
-    // NEVER todos.push(...). Push changes the array React is already holding,
-    // so React compares it to itself, sees no change, and does not re-render.
     const updatedTodos = [
       ...todos,
@@ -17,10 +14,9 @@
   }
 
-  console.log(todos)
-
   return (
     <div className="max-w-xl mx-auto p-8">
       <h1 className="text-3xl font-bold mb-6">Todo List</h1>
       <TodoCreate onCreate={createTodo} />
+      <TodoList todos={todos} />
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import TodoCreate from './components/TodoCreate'
import TodoList from './components/TodoList'

const App = () => {
  const [todos, setTodos] = useState([])

  const createTodo = (title) => {
    const updatedTodos = [
      ...todos,
      {id: crypto.randomUUID(), title},
    ]
    setTodos(updatedTodos)
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      <TodoCreate onCreate={createTodo} />
      <TodoList todos={todos} />
    </div>
  )
}

export default App
```

</details>

---

<a id="step-6"></a>

## Step 6 — Delete: filter

`filter` runs your test on every item and returns a **new array** of the ones that passed.

```
todos.filter((todo) => todo.id !== id)
```

Read it as: *keep every todo whose id is not the one I am deleting.* The one we want gone fails the test and is left out.

Again: new array. Nothing was removed from the old one.

**`src/App.jsx`**

What changed:

```diff
@@ -14,9 +14,18 @@
   }
 
+  const deleteTodoById = (id) => {
+    // filter returns a NEW array containing everything that passes the test.
+    // Everything except the one we are deleting passes.
+    const updatedTodos = todos.filter((todo) => {
+      return todo.id !== id
+    })
+    setTodos(updatedTodos)
+  }
+
   return (
     <div className="max-w-xl mx-auto p-8">
       <h1 className="text-3xl font-bold mb-6">Todo List</h1>
       <TodoCreate onCreate={createTodo} />
-      <TodoList todos={todos} />
+      <TodoList todos={todos} onDelete={deleteTodoById} />
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import TodoCreate from './components/TodoCreate'
import TodoList from './components/TodoList'

const App = () => {
  const [todos, setTodos] = useState([])

  const createTodo = (title) => {
    const updatedTodos = [
      ...todos,
      {id: crypto.randomUUID(), title},
    ]
    setTodos(updatedTodos)
  }

  const deleteTodoById = (id) => {
    // filter returns a NEW array containing everything that passes the test.
    // Everything except the one we are deleting passes.
    const updatedTodos = todos.filter((todo) => {
      return todo.id !== id
    })
    setTodos(updatedTodos)
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      <TodoCreate onCreate={createTodo} />
      <TodoList todos={todos} onDelete={deleteTodoById} />
    </div>
  )
}

export default App
```

</details>

---

<a id="step-7"></a>

## Step 7 — Edit, part 1: the toggle and the form

Editing needs two things: a way to show an edit form, and a way to send the new title up.

The toggle is **local state in `TodoItem`** — `showEdit`. Each row has its own. That is why clicking edit on row three does not open a form on row one.

`TodoEdit` is another controlled form, with one difference worth noticing: `useState(todo.title)` — it starts at the **current** title, so editing means changing what is there instead of retyping it from scratch.

**`src/components/TodoEdit.jsx`**  — new file

```jsx
import {useState} from 'react'

const TodoEdit = (props) => {
  const {todo, onSubmit} = props
  // start the input at the todo's CURRENT title, so editing means changing
  // what is there rather than retyping it
  const [title, setTitle] = useState(todo.title)

  const handleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(todo.id, title)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 py-3">
      <input
        type="text"
        value={title}
        onChange={handleChange}
        className="flex-1 border border-gray-300 rounded px-3 py-2"
      />
      <button className="bg-blue-900 text-white px-4 py-2 rounded text-sm">
        Save
      </button>
    </form>
  )
}

export default TodoEdit
```

**`src/components/TodoItem.jsx`**

What changed:

```diff
@@ -1,8 +1,27 @@
+import {useState} from 'react'
+import TodoEdit from './TodoEdit'
+
 const TodoItem = (props) => {
-  const {todo, onDelete} = props
+  const {todo, onDelete, onEdit} = props
+  // THIS one belongs here. Whether this row is showing its edit form is
+  // nobody else's business -- App does not care, the other rows do not care.
+  const [showEdit, setShowEdit] = useState(false)
 
   const handleDelete = () => {
-    // the item knows WHICH todo it is. It does not know how to delete one.
     onDelete(todo.id)
+  }
+
+  const handleEditClick = () => {
+    setShowEdit(!showEdit)
+  }
+
+  const handleSubmit = (id, newTitle) => {
+    onEdit(id, newTitle)
+    // close the form once the edit has gone up
+    setShowEdit(false)
+  }
+
+  if (showEdit) {
+    return <TodoEdit todo={todo} onSubmit={handleSubmit} />
   }
 
@@ -10,7 +29,12 @@
     <div className="flex items-center justify-between border-b border-gray-200 py-3">
       <span>{todo.title}</span>
-      <button onClick={handleDelete} className="text-sm text-red-600">
-        delete
-      </button>
+      <div className="flex gap-3 text-sm">
+        <button onClick={handleEditClick} className="text-blue-700">
+          edit
+        </button>
+        <button onClick={handleDelete} className="text-red-600">
+          delete
+        </button>
+      </div>
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import TodoEdit from './TodoEdit'

const TodoItem = (props) => {
  const {todo, onDelete, onEdit} = props
  // THIS one belongs here. Whether this row is showing its edit form is
  // nobody else's business -- App does not care, the other rows do not care.
  const [showEdit, setShowEdit] = useState(false)

  const handleDelete = () => {
    onDelete(todo.id)
  }

  const handleEditClick = () => {
    setShowEdit(!showEdit)
  }

  const handleSubmit = (id, newTitle) => {
    onEdit(id, newTitle)
    // close the form once the edit has gone up
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

**`src/components/TodoList.jsx`**

What changed:

```diff
@@ -2,8 +2,10 @@
 
 const TodoList = (props) => {
-  const {todos, onDelete} = props
+  const {todos, onDelete, onEdit} = props
 
   const renderedTodos = todos.map((todo) => {
-    return <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
+    return (
+      <TodoItem key={todo.id} todo={todo} onDelete={onDelete} onEdit={onEdit} />
+    )
   })
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import TodoItem from './TodoItem'

const TodoList = (props) => {
  const {todos, onDelete, onEdit} = props

  const renderedTodos = todos.map((todo) => {
    return (
      <TodoItem key={todo.id} todo={todo} onDelete={onDelete} onEdit={onEdit} />
    )
  })

  return <div>{renderedTodos}</div>
}

export default TodoList
```

</details>

---

<a id="step-8"></a>

## Step 8 — Edit, part 2: map

The last of the three array methods, and the one that comes back most often.

```
todos.map((todo) => todo.id === id ? {...todo, title: newTitle} : todo)
```

`map` returns a new array of the **same length** — every todo comes back. The one we are editing comes back as `{...todo, title: newTitle}`: a **new object**, spread from the old one, with the title overwritten.

Two new things, not one: a new array *and* a new object. `todo.title = newTitle` would change the object React is already holding, and you would get the push problem again.

You wrote this exact shape in the memory game, marking cards as matched. Same pattern, different property.

**`src/App.jsx`**

What changed:

```diff
@@ -15,8 +15,18 @@
 
   const deleteTodoById = (id) => {
-    // filter returns a NEW array containing everything that passes the test.
-    // Everything except the one we are deleting passes.
     const updatedTodos = todos.filter((todo) => {
       return todo.id !== id
+    })
+    setTodos(updatedTodos)
+  }
+
+  const editTodoById = (id, newTitle) => {
+    // map returns a new array the SAME length. Every todo comes back; the one
+    // we are editing comes back as a new object with a new title.
+    const updatedTodos = todos.map((todo) => {
+      if (todo.id === id) {
+        return {...todo, title: newTitle}
+      }
+      return todo
     })
     setTodos(updatedTodos)
@@ -27,5 +37,5 @@
       <h1 className="text-3xl font-bold mb-6">Todo List</h1>
       <TodoCreate onCreate={createTodo} />
-      <TodoList todos={todos} onDelete={deleteTodoById} />
+      <TodoList todos={todos} onDelete={deleteTodoById} onEdit={editTodoById} />
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import TodoCreate from './components/TodoCreate'
import TodoList from './components/TodoList'

const App = () => {
  const [todos, setTodos] = useState([])

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
      <TodoList todos={todos} onDelete={deleteTodoById} onEdit={editTodoById} />
    </div>
  )
}

export default App
```

</details>

---

<a id="step-9"></a>

## Step 9 — An empty state and a count

Two small things that make it feel finished.

An **empty state**, because a blank page looks broken: *Nothing yet. Add something above.* And a **count** at the bottom.

Both are derived from `todos` — they are not new state. `todos.length` is always right, for free, because it is calculated at render time. If you had kept a separate `count` piece of state you would now have two things to keep in sync, and one of them would eventually be wrong.

**Do not store what you can calculate.**

**`src/App.jsx`**

What changed:

```diff
@@ -37,5 +37,13 @@
       <h1 className="text-3xl font-bold mb-6">Todo List</h1>
       <TodoCreate onCreate={createTodo} />
-      <TodoList todos={todos} onDelete={deleteTodoById} onEdit={editTodoById} />
+      {todos.length === 0 ? (
+        <p className="text-gray-500">Nothing yet. Add something above.</p>
+      ) : (
+        <TodoList todos={todos} onDelete={deleteTodoById} onEdit={editTodoById} />
+      )}
+
+      <p className="mt-6 text-sm text-gray-500">
+        {todos.length} {todos.length === 1 ? 'thing' : 'things'} to do
+      </p>
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import TodoCreate from './components/TodoCreate'
import TodoList from './components/TodoList'

const App = () => {
  const [todos, setTodos] = useState([])

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

<a id="step-10"></a>

## Step 10 — In-class exercise: cross it off

Fifteen minutes. Add a **done** state to each todo: a checkbox on each row that crosses the title out when it is checked.

Think before you type:

- where does `done` live — on the todo object, or as separate state somewhere?
- which of the three array methods changes one item in a list?
- whose job is it to flip it: `TodoItem`, or `App`?

Tailwind for the crossed-out look is `line-through`, and you will want a conditional class — `classnames` is one option, a ternary is fine too.

This is the homework's first question as well, so get as far as you can now while I am in the room.

---

**Where we landed:** a working todo list — add, edit, delete, with a count and an empty state.

**The three array methods, and what each is for:**

- **add** → `[...todos, newTodo]` — spread the old ones into a new array, put the new one on the end
- **remove** → `todos.filter(...)` — a new array of everything that passes the test
- **change one** → `todos.map(...)` — a new array the same length, with one item swapped for a new version of itself

All three build a **new array**. None of them touches the old one. That is not style, it is the reason React re-renders at all.

**And the question to keep asking:** who needs to know? It put the list in `App`, the typing in `TodoCreate`, and the edit toggle in `TodoItem`.

**Homework:** see [HW.md](HW.md).

Next class: the list survives a refresh.
