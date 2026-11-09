# Homework, Week 11

## 1. Finish the art collection

If the in class exercise did not get done, do it:

- [ ] **A count of the visible pieces**, shown next to the total, so the bar
      reads something like "4 pieces, $1,250".
- [ ] Do it as a **selector, in `artSlice.js`, composed from
      `selectVisibleArt`**. It is three lines.

If you find yourself adding anything to `initialState` for this, stop and read
step 5 again. A count of a list you already have is not state.

## 2. Sort the list, and argue with yourself about it

- [ ] Add a control that sorts the collection by price, highest first.

Then answer this in a comment at the top of the file you changed:

- [ ] **Is the sort order state?** Is the sorted array?

They are not the same question and they do not have the same answer. Write down
which is which and why. Two or three sentences. I will ask about this.

## 3. One thing you have not been shown

Pick one and work it out from the Redux Toolkit docs:

- [ ] **A `clearCollection` action** that empties the collection, with a
      confirm step so a mis-click does not wipe everything. Where does the
      "are you sure" state live, and why is that not a Redux question?
- [ ] **An edit flow**: click a piece, load it into the form, change it, save.
      This one is genuinely harder than it looks, because the form slice now
      has two jobs. Sketch the state before you write anything.

Either is good practice for a final project. Neither is long.

## 4. Check it the way I will

Open the **Redux devtools** and use the app for a minute:

- Add three pieces. Is there exactly **one action per piece**, or did you
  dispatch extras to tidy up after yourself?
- Type one letter into the form. Does anything in the `art` branch change? It
  should not.
- Search for something. Does the `data` array change? **It should not.** If it
  does, you are storing a filtered list somewhere.
- Drag the slider back to the start and forward again. Does the app survive it?

## Looking ahead

Every action you have written finishes instantly. Next we deal with the ones
that do not: a request that takes time, might fail, and whose answer arrives
later. It is built on the `extraReducers` from Thursday, so it is less new than
it sounds.

Final projects are coming. The best preparation is being able to say where a
piece of state belongs without having to guess.

## Submitting

```bash
git add .
git commit -m "week 11 homework"
git push
```

Check on github.com that `node_modules` is not there.
