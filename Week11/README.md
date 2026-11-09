# Week 11: Two slices, derived state, and slices that talk

| | |
|---|---|
| **[Class A](ClassA.md)** | We finish the print shop first (Week 10, steps 9 to 12), then start the art collection: design the store, then build two slices. |
| **[Class B](ClassB.md)** | The art collection finished: search, totals, selectors, and the form clearing itself. |

## Tuesday opens where Week 10 stopped

We got as far as the cart slice being wired up. Four steps are still owed, and
they are already written:

- **[Week 10, step 9](../Week10/README.md#step-9)**: a second slice
- **step 10**: selectors, and where the shape of the state lives
- **step 11**: the Redux devtools, and time travel
- **step 12**: when not to use Redux

Bring your print shop project. If it is in a strange state, the finished
version is in `../Week10/end-of-class/`.

## Then: the art collection

A new project across both classes. Add a piece of art with a name and a price,
see the collection, delete from it, search it, and see the total value of
whatever is currently showing.

```bash
cd ~/your-hw-repo
npm create vite@latest week11-art -- --template react
cd week11-art
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install @reduxjs/toolkit react-redux
npm run dev
```

Thursday carries straight on from Tuesday's file, so **keep it**. If yours ends
up in a strange state, `end-of-class/art-collection-part-1/` is exactly where
Tuesday finished.

## The two ideas this week is about

**Design the store before you write any JSX.** Four questions: what state
exists, how does it change, what groups together, and what can be worked out
from the rest. That last question is the one that saves you.

**If you can calculate it, do not store it.** The filtered list, the total, and
the highlight are all worked out while rendering. None of them is in the store,
so none of them can disagree with anything.

## Files in this folder

- **`end-of-class/art-collection-part-1/`**: where Tuesday ends.
- **`end-of-class/art-collection/`**: the finished app.

`node_modules` is never committed, so **`npm install` is required every time**
you copy or clone a project.

## Homework

[HW.md](HW.md)

## If you get stuck

Three questions, in this order, and they cover almost every Redux bug:

1. Is the `Provider` there, wrapping everything?
2. Is the reducer registered in the store under the key your selector reads?
3. Is your payload the shape the reducer assumes?

Then read the error, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).
