# Homework, Week 10

Tuesday was cancelled, so this is a one class week and the homework is
correspondingly short. Final projects are coming, and the point of this one is
to make sure the Redux pattern is yours before you decide whether to use it.

## 1. Finish the favourites slice

If the in class exercise did not get done, do it. A new slice, from scratch:

- [ ] **`src/features/favouritesSlice.js`** with `name: 'favourites'`, an
      initial state holding an array of print ids, and a
      **`favouriteToggled`** reducer. If the id is in the array, take it out.
      If it is not, put it in.
- [ ] **Register it in the store**, so the state tree gains a third branch.
- [ ] **A star (or a block, this is a De Stijl shop) on each catalog card**
      that dispatches `favouriteToggled(print.id)`.
- [ ] **A count in the header**, read with a selector you write yourself.
- [ ] **The filled or empty state of the star** comes from the store, not from
      local component state.

Three questions you should be able to answer about your own code:

- which slice does a "show only favourites" filter belong in, and why?
- what is the action type string your reducer produces? Check it in the
  devtools rather than guessing.
- why is the list of favourite ids a better thing to store than a `favourite`
  flag on each print?

That last one is the interesting one. Come and argue with me about it if you
disagree.

## 2. Watch it happen

- [ ] Open the **Redux DevTools**, use the app for a minute, then drag the
      slider back to the beginning and forward again.
- [ ] Find one action in the list and read its **diff**. Write down, in a
      comment at the top of your slice file, what the action type was and what
      it changed.

This is a two minute task and it is the thing most likely to save you an hour
in your final project.

## 3. Decide, in writing

In your repo's `README.md`, under a heading for this week, answer in two or
three sentences:

- [ ] **What state will your final project have?** List it.
- [ ] **For each piece, say where it should live**: `useState`, props,
      Context, or Redux. Use the four way comparison from the end of class.

Most of your answers should be `useState`, and if they are, you have
understood the lesson. Bring the list on Tuesday.

## Optional, if you want it

- **A `createAsyncThunk`.** Load the prints from a `db.json` with json-server
  instead of importing them. This is how Redux handles anything asynchronous,
  and it is the one big piece we did not cover.
- **`createSelector`** from Redux Toolkit, for a derived value that would be
  expensive to recalculate on every render. Worth reading about; not worth
  using yet.

Neither is required and neither will be on anything.

## If you got lost

- The finished project is in `end-of-class/`.
- The class notes show every step with the code at that point.
- Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md). The
  two most common this week: **"could not find react-redux context value"**
  (the Provider is missing, or the component is outside it) and
  **"Actions must be plain objects"** (you dispatched the action creator
  itself instead of calling it: `dispatch(itemAdded)` rather than
  `dispatch(itemAdded(print))`).

## Submitting

```bash
git add .
git commit -m "week 10 homework"
git push
```

Check on github.com that `node_modules` is not there.
