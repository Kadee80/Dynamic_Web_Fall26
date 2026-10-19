# Week 08 — useReducer, and forms properly

| | |
|---|---|
| **[Class A — useReducer](ClassA.md)** | A counter, built with `useState` until it gets annoying, then rebuilt with `useReducer`: one state object, one reducer, four named actions. The pattern behind Redux, in thirty lines. |
| **[Class B — Forms, properly](ClassB.md)** | One form with every input type in it: text, number, select, checkbox, range, date, textarea. Then validation, error messages that help, and a submit button that cannot save twice. |

**Class B is the one that matters for the midterm.** Class A is the next thing;
Class B is the thing you need this week.

**The midterm presents Tuesday of Week 09.** Full brief:
[Week07/Midterm.md](../Week07/Midterm.md).

## Both classes start fresh

Neither class uses the todo list, and neither needs `json-server`. Two new
little projects, built from nothing:

```bash
cd ~/your-hw-repo

# Tuesday
npm create vite@latest week08-counter -- --template react
cd week08-counter && npm install && npm install -D tailwindcss @tailwindcss/vite

# Thursday
npm create vite@latest week08-forms -- --template react
cd week08-forms && npm install && npm install -D tailwindcss @tailwindcss/vite
```

**Do not build Thursday's form inside your midterm project.** Build it in
`week08-forms`, where breaking it costs you nothing, then take the pattern
across.

## Files in this folder

- **`end-of-class/counter-reducer`** — Tuesday's finished counter.
- **`end-of-class/book-form`** — Thursday's finished form and list.

`node_modules` is never committed, so **`npm install` is required every time**
you copy or clone a project.

## The short version, if you only read one thing

**Tuesday:** reach for `useReducer` when several pieces of state always change
together, or when the next state is worked out from the current one. Otherwise
`useState` — which is not a beginner's version of anything.

**Thursday:** one state object for the whole form, one `handleChange` using
`event.target.name`, `checked` instead of `value` for checkboxes, numbers cast
once on the way out, and errors that wait until the user has left the field.

## Homework

[HW.md](HW.md) — which is the midterm now.

## If you get stuck

Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).
