# Homework, Week 13

**Due before class on Tuesday 1 December.** There is no class on Thursday,
so this has a week.

## 1. Finish the in-class exercise

If `done` did not get finished in class, finish it:

- [ ] A `done` flag on each todo, on the server and in the store.
- [ ] A checkbox on each row that reads its state **from the store**.
- [ ] Finished todos look finished.
- [ ] The count at the bottom says how many are **left**.

Two things to work out:

- [ ] **The method is not `PUT`.** `PUT` replaces the whole record. There is
      one that changes a single field and leaves the rest alone, it is in
      `api.http`, and it is not in `api.js` yet.
- [ ] **The count is not state.** If you are adding anything to
      `initialState` for it, stop and write a selector.

## 2. Say where the state went

In a comment at the top of `todosSlice.js`, answer this in three or four
sentences:

- [ ] **You have now built this app four ways.** `useState`, `useReducer`,
      Context, Redux. Which would you use if you were starting it today, and
      what would have to be true about the app for your answer to change?

There is no right answer. I want the reasoning, and I will ask about it.

## 3. Find the thing that is still wrong

- [ ] Open `App.jsx`, `TodoCreate.jsx` and `TodoItem.jsx` and **count the
      `await` calls**. Write the number in the same comment.
- [ ] **Stop `npm run server`**, then click delete on a todo. Describe exactly
      what happens, and what you think should happen.

That is the whole of next class, so arriving with an opinion about it is
worth more than arriving with it fixed.

## 4. Check it the way I will

Devtools open, and use the app for a minute:

- Add one todo. Is there **exactly one action**? If there are two, something
  is dispatching that you did not mean.
- Type one letter into the input. Does anything in the store change? It
  should not.
- Tick a checkbox. Does the whole list re-render, or just that row?
- Drag the slider back to the start and forward again. Does the app survive?

If the page flashes white after every action, you skipped the `vite.config.js`
change in step 8 and your screen is lying to you about whether your reducers
work.

## Submitting

```bash
git add .
git commit -m "week 13 homework"
git push
```

Check on github.com that `node_modules` is not there.
