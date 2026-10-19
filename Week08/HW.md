# Homework — Week 8

There is one piece of homework this week and it is the midterm. Nothing new is
assigned.

**You present Tuesday of Week 09. Code is due Friday of Week 09, midnight.**
Full brief: [Week07/Midterm.md](../Week07/Midterm.md).

## 1. The field has to work in all four places

This is the requirement, and it is where the marks are. Go through it as a
checklist, on your own project, with the app running:

- [ ] **The create form** — the input exists, has a `label` with `htmlFor`, and
      its `name` matches the key in your state object.
- [ ] **The request** — the field is in the body you send from `api.js`. Check
      `db.json` afterwards. If it is not in the file, it was never sent.
- [ ] **The list** — the value is visible somewhere. A field that is stored and
      never shown is not a feature.
- [ ] **The edit form** — the input is there, the existing value loads into it,
      and the field is included in the update. Remember that **`PUT` replaces
      the whole record and `PATCH` merges** — a `PUT` that is missing your new
      field will quietly delete it.

Then do the one test that catches everything: add an item, edit it, **reload the
page**, and check the value survived. If it did not, the problem is step 2 or 4.

## 2. Make it an app with a purpose

Not a todo list with an extra box. Styling is part of the grade, and so is the
app making sense as a thing a person would use.

- [ ] It is clear within five seconds **what this app is for**. A title that is
      not "Todo List", and language that matches the purpose — "Add a recipe",
      not "Add a todo".
- [ ] Your new field is **styled like it belongs**, not like it was bolted on.
- [ ] The empty state says something useful. "Nothing yet. Add your first
      recipe above." beats a blank page.
- [ ] Loading and error states still work. Stop `json-server` and look at the
      app: it should explain itself, not hang.
- [ ] It is usable on a narrow window.

## 3. Use Thursday's class on your own form

Everything from Class B applies directly. At minimum:

- [ ] **Validation that stops a bad submit** — an empty title should not create
      an item.
- [ ] **A message next to the field**, in words, saying what to do. Not just a
      red border.
- [ ] **The form does not clear until the save worked.** Check it: stop
      `json-server`, submit, and confirm your typing is still there.

If you have time, add `disabled={isSubmitting}` to the submit button. A
double-click saving two copies is the bug most likely to appear during a live
demo.

## 4. The two checklists

From the brief, and easy to leave until the night before — which is the one
thing that will cost you marks you could have had:

- [ ] The **developer checklist** you wrote before you started, unchanged. Do
      not tidy it up.
- [ ] A **revised checklist** of what the work actually took. The gap between
      the two is graded, and nobody's lists match. That is the point.

Both in your `README.md`.

## 5. Your five minutes

Practise it **once, out loud, with a timer**. Five minutes is shorter than it
sounds.

- [ ] The elevator pitch — what the app is for, in two sentences.
- [ ] Your user story, and how the field you added came out of it.
- [ ] A live demo. Run it from your own machine with `json-server` already
      going, and have the app in the state you want before you stand up.
- [ ] One piece of code you can explain. If you cannot explain it, do not show
      it.
- [ ] The two checklists, and what surprised you.

A slide deck is strongly recommended. Laptops closed while other people
present — participation is 25% of your grade.

## Optional, if the midterm is done

From Tuesday: take the three `useState` calls at the top of your Provider —
`todos`, `isLoading`, `error` — and move them into a reducer with
`FETCH_START` / `FETCH_SUCCESS` / `FETCH_ERROR`. Step 12 of
[ClassA.md](ClassA.md) has the whole thing written out.

**This is not part of the midterm.** Do it on a branch, after the required work
is pushed, and only if it is interesting to you.

---

## Submitting

```bash
git add .
git commit -m "midterm"
git push
```

Check on github.com that `node_modules` is not there, and that your `README.md`
is showing both checklists.
