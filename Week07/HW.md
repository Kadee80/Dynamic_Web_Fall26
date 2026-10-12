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

## 2. Start the midterm — the three things to write down

Read [Midterm.md](Midterm.md) properly, then write these, in this order,
**before you open your editor**:

- [ ] **What is your app for?** One to three sentences. The elevator pitch.
      "A reading list for books I keep meaning to finish."

- [ ] **Your user story.** *As a [kind of person], I want to [do something], so
      that [reason].* This is the one that matters — the field you add should
      fall out of this sentence, not the other way round.

- [ ] **Your developer checklist.** Every step you think it will take to add
      that field. Be specific, and be wrong — the point is to compare it later
      with what it actually took. Nobody gets this list right the first time,
      and the gap is a graded part of the project.

Then get as far as **making the field work end to end**: in the create form,
saved to the server, showing in the list, and in the edit form too. That last
one is the step most people forget, which is exactly why you are keeping a
checklist.

Push what you have by Tuesday, even if it is rough. I would rather see a
half-built thing on Tuesday than a surprise in Week 09.

## 3. If you are behind

The todo list has three finished versions in the repo —
`Week06/end-of-class/todo-list-V1`, `-V2`, and `Week07/end-of-class/todo-list-V3`.
Start from whichever one you understand, and read forward from there in the
class notes. Starting the midterm from V2 is completely fine; Context is not
required.

## Extra, not required

- **On the game:** a best score kept across games in the same session.
- **On the todo list:** filtering or sorting *by your new field* — which is
  usually the real point of the user story, and needs no server work at all.

---

## Submitting

```bash
git add .
git commit -m "week 7 homework"
git push
```

Check on github.com that `node_modules` is not there.
