# Week 04 — A component library: Button and Accordion

Two classes this week, and they build on each other. This is where we stop
making one-off components and start making ones designed to be used again by
someone who didn't write them.

| | |
|---|---|
| **[Class A — the Button](ClassA.md)** | Colour variants, outline and pill styles, icons, and forwarding every prop a real `<button>` supports. Three small libraries: `classnames`, `tailwind-merge`, `react-icons`. |
| **[Class B — the Accordion](ClassB.md)** | A reusable component that also has to *remember* something. The state design process, `useState`, and conditional rendering with `&&` and ternaries. |

Class B picks up exactly where class A ends. If you missed class A, or your
project is in a strange state, copy `starter/` again and work through
[ClassA.md](ClassA.md) first — it's a complete walkthrough.

## Files in this folder

- **`starter/comp-lib`** — where class A begins. Tailwind is already wired up;
  everything else we build together.
- **`end-of-class/comp-lib`** — where class B ends. Use it to check your work.

```bash
cp -R starter/comp-lib ~/your-hw-repo/
cd ~/your-hw-repo/comp-lib
npm install
npm run dev
```

`node_modules` is never committed, so **`npm install` is required every time**
you copy or clone a project.

## A note on Tailwind

We're on **Tailwind v4**, which changed how it's set up. There is no
`tailwind.config.js` and no `postcss.config.js` — it's a Vite plugin, and theme
values live in CSS in an `@theme` block. Most tutorials you'll find online
describe v3. The utility classes themselves are unchanged; only the setup moved.

## If you get stuck

Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).
