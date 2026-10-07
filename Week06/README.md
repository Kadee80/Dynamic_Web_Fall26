# Week 06 — The Todo List: CRUD, persistence, and Context

One project, built up in three passes. Each class picks up exactly where the
last one ended.

| | |
|---|---|
| **[Class A — CRUD in state](ClassA.md)** | Create, read, update and delete a list of todos. No new hooks — `useState`, props, and three array methods doing specific jobs. The real lesson is **which state lives where**: the list in `App`, the half-typed text in `TodoCreate`, the edit toggle in `TodoItem`. |
| **[Class B — persistence](ClassB.md)** | `json-server` turns a JSON file into a real REST API, and each of Tuesday's four operations becomes a request: GET, POST, PUT, DELETE. The discipline is **ask the server first, change the screen second**. |
| **[Class C — Context](ClassC.md)** | A refactor: the same app, with the state and the four operations in one Provider, and no props threaded through components that do not use them. Plus `useCallback`, and an honest list of what Context is *not*. |

If you missed a class or your project is in a strange state, copy
`starter/todo-list` and work through [ClassA.md](ClassA.md) — it is a complete
walkthrough, and the two classes after it continue the same project.

**Homework:** [HW.md](HW.md)

## Files in this folder

- **`starter/todo-list`** — where class A ends, ready for class B.
- **`end-of-class/todo-list`** — where class B ends: working persistence, with
  `db.json` and `api.http`.
- **`end-of-class/todo-list-context`** — where class C ends: the same app,
  refactored onto Context.

```bash
cp -R starter/todo-list ~/your-hw-repo/week06-todo-list
cd week06-todo-list
npm install
npm run dev
```

`node_modules` is never committed, so **`npm install` is required every time**
you copy or clone a project.

## Two terminal tabs, from class B on

Class B and C both run two processes at once, both in the project folder:

```bash
npm run dev        # tab 1 — Vite, your app, port 5173
npm run server     # tab 2 — json-server, your API, port 3001
```

If the app loads and says it cannot reach the server, that is tab 2. It will
happen to all of us at least once.

## A note on json-server versions

We install **`json-server@0.17.4`** on purpose. Version 1 is still in beta and
its flags are different, so a tutorial written for one will not work with the
other. When the first number in a version changes, assume something breaks —
and pin the version in `package.json` so your project keeps working.

## A note on file extensions

From class C there is JSX inside `src/context/todos.jsx`. **Vite will not
compile JSX out of a `.js` file** — if you see "Failed to parse source", check
the extension before you check anything else.

## If you get stuck

Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).
