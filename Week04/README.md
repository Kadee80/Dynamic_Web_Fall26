# Week 05 — Routes, the Dropdown, and the Modal

Two classes this week, and they build on each other. The component library
outgrows one long page, so every component gets its own url — and then we build
two components that have to reach **outside** themselves: a Dropdown that hears
clicks anywhere on the page, and a Modal that renders somewhere else entirely.

| | |
|---|---|
| **[Class A — Routes and the Dropdown](ClassA.md)** | Components vs pages, React Router (`BrowserRouter`, `Routes`, `Link`), a reusable `Panel`, then a Dropdown whose selected value lives in the page. `useRef` and `useEffect` to close it on an outside click. |
| **[Class B — the Modal](ClassB.md)** | Why `absolute` breaks and `fixed` isn't enough, `createPortal`, `children` and JSX-as-props for a reusable Modal, and `useEffect` again to lock the page's scroll. |

Class B picks up exactly where class A ends. If you missed class A, or your
project is in a strange state, copy `starter/` again and work through
[ClassA.md](ClassA.md) first — it's a complete walkthrough.

**Homework:** [HW.md](HW.md)

## Files in this folder

- **`starter/comp-lib`** — where class A begins. It's exactly where last week's
  Accordion class ended.
- **`end-of-class/comp-lib`** — where class B ends. Use it to check your work.

```bash
cp -R starter/comp-lib ~/your-hw-repo/week05-comp-lib
cd ~/your-hw-repo/week05-comp-lib
npm install
npm run dev
```

`node_modules` is never committed, so **`npm install` is required every time**
you copy or clone a project. This week also adds a library in class:
`npm install react-router-dom`.

## A note on React Router versions

We're on **React Router v7**. Most tutorials you'll find online are v5 or v6.
If you see `<Switch>`, `component={Thing}`, or `useHistory`, that's v5 and it
won't work here. The v7 names are `<Routes>`, `element={<Thing />}` and
`useNavigate`.

## If you get stuck

Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).
