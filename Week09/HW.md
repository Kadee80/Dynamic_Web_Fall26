# Homework — Week 9

**Your midterm code is due Friday at midnight.** That is the homework. Nothing
new is assigned.

Full brief: [Week07/Midterm.md](../Week07/Midterm.md).

## Between presenting and Friday

The days after you present are still build time. If what you showed on Tuesday
was half-finished, that is what Wednesday and Thursday are for.

- [ ] **Fix what came up when you presented.** If something broke in the demo,
      that is the first thing.
- [ ] **The field works in all four places** — the create form, the request in
      `api.js`, the list, and **the edit form**. Add an item, edit it, reload
      the page, and check the value survived. If it did not, the problem is the
      request or the edit form.
- [ ] **`PUT` replaces, `PATCH` merges.** A `PUT` that does not include your
      new field will quietly delete it, and it looks exactly like a server bug.
- [ ] **The rows already in `db.json`** have no value for your field at all.
      Check what your app renders for them — `undefined` on screen is a bug
      somebody will find.
- [ ] **Both checklists in your `README.md`** — the one you wrote before you
      started, unchanged, and the revised one. The gap between them is graded,
      and it takes ten minutes to write.

## Use Thursday's class

Everything from [Forms, continued](Forms_Continued/README.md) applies to your
own form, and the first four steps are the ones worth doing tonight:

- [ ] **A message the user can read**, next to the field, in words. Not just a
      red border.
- [ ] **`onBlur` and `touched`**, so the message appears when they leave the
      field rather than on the first keystroke.
- [ ] **The form does not clear until the save worked.** Test it properly: stop
      `json-server`, submit, and confirm the typing is still there.
- [ ] **`disabled={isSubmitting}`** on the submit button. A double-click saving
      two copies is the single most likely bug to appear in front of someone.

## Before you push

Run through it as a user, not as the person who wrote it:

- add an item, edit it, delete it, **reload**
- submit the form empty, and read what it tells you
- stop `json-server` and use the app — does it explain itself, or hang?
- open the console. **Any red is something to fix or explain.**

## Submitting

```bash
git add .
git commit -m "midterm"
git push
```

Check on github.com that `node_modules` is not there, that `db.json` is, and
that your `README.md` is showing both checklists.

If you make considerable changes after presenting, **email me** so I know the
project may look or behave differently than it did on the day.
