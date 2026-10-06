# Week 06 — The Todo List: CRUD, and making it stick

One project across two classes. Tuesday it works; Thursday it stops forgetting.

| | |
|---|---|
| **[Class A — CRUD in state](ClassA.md)** | Create, read, update and delete a list of todos. No new hooks — `useState`, props, and three array methods doing specific jobs. The real lesson is **which state lives where**: the list in `App`, the half-typed text in `TodoCreate`, the edit toggle in `TodoItem`. |
| **[Class B — persistence](ClassB.md)** | `json-server` turns a JSON file into a real REST API, and each of Tuesday's four operations becomes a request: GET, POST, PUT, DELETE. The discipline is **ask the server first, change the screen second**. |

Class B picks up exactly where class A ends, in the same project. If you missed
Tuesday or your project is in a strange state, copy `starter/todo-list` and work
through [ClassA.md](ClassA.md) first — it is a complete walkthrough.

**Homework:** [HW.md](HW.md)

## Files in this folder

- **`starter/todo-list`** — where class B begins. This is exactly where class A
  ends.
- **`end-of-class/todo-list`** — where class B ends, including `db.json` and
  `api.http`.

```bash
cp -R starter/todo-list ~/your-hw-repo/week06-todo-list
cd week06-todo-list
npm install
npm run dev
```

`node_modules` is never committed, so **`npm install` is required every time**
you copy or clone a project.

## Two terminal tabs, from Thursday on

Class B runs two processes at once, both in the project folder:

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

## If you get stuck

Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).
