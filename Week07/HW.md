# Homework — Week 7 (due before next Tuesday's class)

Short week for homework, because the midterm starts now.

## 1. Finish the game

If the win state did not get done in class, do it: when every card is matched,
say so on screen, and make New Game clear it again.

Three questions you should be able to answer about your own code:

- which piece of state does the win check watch, and why that one?
- what stops it declaring a win on an empty board?
- why could the match comparison not live in `handleChoice`?

That third one is the whole of Thursday. If the answer is not clear to you,
come and find me before the midterm rather than after.

## 2. Start the midterm — the deciding part

Read [Midterm.md](Midterm.md) properly, then make the two decisions that
everything else depends on:

- [ ] **What is your app for?** One sentence, written down. "A reading list for
      books I keep meaning to finish." "A watering schedule for my plants."
- [ ] **What is your extra input?** Name the field, its type, and what it is
      for — a date, a select with specific options, a number with a unit.

Then get as far as **making that one input work end to end**: in the form,
saved to the server, showing in the list, editable. That is the piece that
takes longest and the piece people leave until last.

Push what you have by Tuesday, even if it is rough. I would rather see a
half-built thing on Tuesday than a surprise in Week 09.

## 3. If you are behind

The todo list has three finished versions in the repo —
`Week06/end-of-class/todo-list-V1`, `-V2`, and `Week07/end-of-class/todo-list-V3`.
Start from whichever one you understand, and read forward from there in the
class notes. Starting the midterm from V2 is completely fine; Context is not
required.

## Extra, not required

- **A filter** on the game: a best score kept across games in the same session.
- **On the todo list:** sorting, search, or a filter — all three are `filter`
  and `sort` on data you already hold, with no server involved.

---

## Submitting

```bash
git add .
git commit -m "week 7 homework"
git push
```

Check on github.com that `node_modules` is not there.
