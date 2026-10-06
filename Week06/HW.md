# Homework — Week 6 (due before next Tuesday's class)

Your todo list is a real app now. Two more features, both built out of what you
already have.

## 1. Finish the done toggle

If you got it working in class, good — make sure it **persists**. If you did
not, this is the main piece of work.

- a `done` property on each todo
- a checkbox on each row that toggles it, and a crossed-out title when it is
  true (`line-through`)
- the change goes to the server, and it is still there after a refresh

Decide — and be ready to say why — whether you used **PUT** or **PATCH**. One of
them replaces the whole record and one of them merges. If you have ever lost a
field, you already know which is which.

## 2. Filter the list

Three buttons above the list: **All**, **Active**, **Done**. Clicking one shows
only those todos.

The interesting part: **this needs no new requests.** You already have every
todo in state. Filtering is `filter` on data you are holding, and that is a
different kind of operation from the four you wrote this week.

Think about where the filter's own state lives. Who needs to know which filter
is selected?

## 3. Answer these in a comment at the top of `App.jsx`

- Why does the GET live in a `useEffect` with `[]` rather than just being called
  in the component body?
- In `deleteTodoById`, what happens if you move `setTodos(...)` **above** the
  `await`? Describe what the user would see when the server is down.
- Your filter in #2 — did it need a request? Why not?

## Extra, not required

- **Sort the list** — newest first, or alphabetically. Same idea as the filter:
  no server involved.
- **A search box** that narrows the list as you type. You have written a
  controlled input three times now.
- **An optimistic delete.** Remove the row immediately, then put it back if the
  request fails. Try it with the server stopped and see whether your version
  actually recovers.
- **A count of what is left**, not of everything — `todos.filter(...).length`,
  calculated at render time. Do not store it.

---

## Looking ahead

**The midterm brief goes out next class.** If you want to build something that
is a list of things with a server behind it — recipes, records, a reading list,
a habit tracker — this week's project is a perfectly good foundation, and you
are allowed to say so in your proposal.

## Submitting

```bash
git add .
git commit -m "week 6 homework"
git push
```

Then open your repo on github.com and check: the files are there, and
`node_modules` is **not**. Your `db.json` should be committed — it is small, it
is the data your app came with, and I want to see it.
