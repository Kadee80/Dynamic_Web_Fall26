# Homework — Week 5 (due before next Tuesday's class)

Last week you built your own reusable component and a page that demos it. This
week it joins the library.

## 1. Add your component to the library

Work in your `week05-comp-lib` project from class.

1. Copy your component into `src/components/` and its demo page into `src/pages/`.
2. Add a `<Route>` for your page in `App.jsx` — look for the `HW:` comment.
3. Add a `<Link>` to it in `Navbar.jsx` — look for the other `HW:` comment.
4. If your component has a box with a border and a shadow anywhere in it, use
   `Panel` instead of repeating the classes.

Click through every page in the nav. All five should work without a page reload.

## 2. Close things with the Escape key

Every real dropdown and modal closes when you press **Escape**. Add that to
**both** the Dropdown and the Modal.

You already know every piece of this:

- it's a listener on `document` — so it goes in a `useEffect`
- it needs a cleanup, or the listeners pile up
- the event is `'keydown'`, and the key is in `event.key`

In the Modal, pressing Escape should call `onClose`. Think about why that's
different from the Dropdown, which calls `setIsOpen(false)` — the answer is the
same as "where does the state live?"

## 3. Before you write any code for #2

Answer these in a comment at the top of each file you change:

- Which `useEffect` form did you use, `[]`, `[something]`, or none — and why?
- What does your cleanup function remove?

## Extra, not required

- **A 404 page.** Add a `<Route path="*" …>` as the last route, with a
  `NotFoundPage` that links back home. Try `localhost:5173/nope`.
- **Highlight the current page in the nav.** Swap `Link` for `NavLink` and read
  the React Router docs for how it tells you which link is active.

---

## Submitting

```bash
git add .
git commit -m "week 5 homework"
git push
```

Then open your repo on github.com and check the files are there. **Don't commit
`node_modules`** — if you see it on GitHub, your `.gitignore` is missing.
