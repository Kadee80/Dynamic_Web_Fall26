# Week 01 — Day 1

**Goal for today:** every student leaves with a React app running on their own
machine, and their first commit pushed to GitHub.

Not "every student has the tools installed." Running code. The tools are in
service of that, not the other way around.

---

## Run of show (~110 min)

| Time | What | Why |
|---|---|---|
| 0:00–0:10 | Ship something | A win before any admin |
| 0:10–0:25 | Syllabus, intros, the destination | Context |
| 0:25–0:45 | JS warm-up | Diagnostic in disguise |
| 0:45–1:15 | Setup clinic | The unavoidable part, made social |
| 1:15–1:40 | First Vite project | The actual goal |
| 1:40–1:50 | Git, minimally | How you'll hand things in |

---

## 0:00–0:10 — Ship something

Put a StackBlitz link on the board before anyone sits down. No install, works on
any laptop, works on a phone.

> https://stackblitz.com/fork/github/vitejs/vite/tree/main/packages/create-vite/template-react
> (or your own saved fork — make one in August and keep the link stable)

Everyone opens it, changes one string, changes one number, watches the browser
update.

Then say the thing:

> "That's React. You changed the data, the screen changed, and you never touched
> the HTML. Everything else this semester is details."

**Why open this way:** it puts a win on the board before anybody has a chance to
feel behind, and it works even for the student whose laptop is broken. It also
reframes the next hour — we're not "setting up tools," we're setting up the
tools for the thing you just did.

---

## 0:10–0:25 — Syllabus, intros, and the destination

Syllabus fast. The parts that actually matter to them:

- attendance (3 unexcused = grade drops 5%)
- how homework is submitted — your GitHub repo, pushed
- office hours link
- documentation is 5% of your grade at IDM, and a clean repo with real README
  files is the easiest 5% you will ever earn

**Then show them where this goes.** Open a finished project from a previous
semester and click through it — the art collection app or the image search app.

> "This is week 13. You will build this. You will not believe me today."

Names: go around, or name tents. With two sections you want the names early.

---

## 0:25–0:45 — JS warm-up

**Not** a general JavaScript review. Exactly the six things their week-2 code
will demand, and nothing else.

Give them `js-warmup.md` (in this folder) and 15 minutes, in pairs. Walk the
room.

1. arrow functions
2. destructuring
3. template literals
4. `.map()`
5. spread `...`
6. ternary and `&&`

**This is a diagnostic wearing an exercise costume.** The wall students hit in
this course is almost never React — it's `.map()` and destructuring. Finding the
four people who are underwater on day 1, instead of week 4, is the single most
useful twenty minutes in the semester. Note who struggles. Email them a link to
a JS refresher that night, individually, before they've had a chance to decide
they're bad at this.

---

## 0:45–1:15 — Setup clinic

Everyone runs:

```bash
node -v && npm -v && git --version
```

Then:

- **Green students become floaters.** Hands up if all three printed. Pair each
  one with a neighbor who's stuck. This is the best use of these thirty minutes
  and it starts the peer-help habit you want in week 10.
- **Sit the Windows students together** and check on them as a group. Tell them
  to use **Git Bash**, not PowerShell or CMD, so their terminal matches yours.
  This class is taught on a Mac and you should say so out loud.
- **GitHub auth is the real boss fight.** Password-over-HTTPS has not worked
  since 2021. Everyone will need a **personal access token** the first time they
  push. See `../TROUBLESHOOTING.md` → "GitHub won't let me push."
- **Say the fallback out loud, early:** *"If you're still stuck at 1:15, you'll
  work in StackBlitz today and we'll fix it in office hours. Nobody is going to
  sit here stuck for an hour."* This costs nothing and it stops one bad install
  from becoming one dropped student.

---

## 1:15–1:40 — First real project

Everybody, together, one command at a time. Slowly.

```bash
npm create vite@latest hello-react -- --template react
cd hello-react
npm install
npm run dev
```

Open http://localhost:5173

> **Why not `create-react-app`?** The React team retired it in February 2025. If
> you run `npx create-react-app` today you get a deprecation warning and a pile
> of dependency errors. Vite is what the React docs point at now, it installs in
> seconds instead of minutes, and the dev server reloads instantly. If you find
> a tutorial from 2023 that says `create-react-app`, everything in it still
> applies — only the setup step changed. See `../VITE_MIGRATION_NOTES.md`.

### What's in the box

```
hello-react/
├── index.html          ← the real HTML page. React renders into #root.
├── package.json        ← our dependency list + the npm scripts
├── vite.config.js      ← build tool config
└── src/
    ├── main.jsx        ← the first file that runs
    ├── App.jsx         ← our first component
    └── …               ← template junk we're about to delete
```

Two things to point out, because they'll save you questions all semester:

- **`index.html` is at the top level, and it is a real file you can edit.** In
  create-react-app it was buried in `public/` and everyone forgot it existed.
- **`.jsx`, not `.js`.** Vite wants the extension to match what's inside. A file
  with JSX in it should end in `.jsx`.

### Clear it out and rebuild it

Delete `src/App.css`, `src/index.css`, and `src/assets/`. Then write `main.jsx`
and `App.jsx` from scratch together — see `end-of-class/hello-react/` for where
you should land.

Talk through:

- importing `React` and `ReactDOM` before we use them
- `ReactDOM` is for browsers; the alternative for phones is React Native
- grabbing `#root` and handing it to React
- a component is **a function that returns JSX**
- the name **must** be capitalized — that's how React tells your components from
  plain html tags
- `export default` / `import` — how files find each other

Then have them change the text and watch it hot-reload without losing state.
That moment is the whole pitch for the tool.

**Stop the server with `Ctrl + C`.** Tell them this now or you'll get emails.

---

## 1:40–1:50 — Git, minimally

Not the whole lecture. One loop, once, everyone at the same time.

1. On GitHub: **New repository** → name it `dynamic-web-f26` → **Public** →
   check "Add a README" → Create
2. Copy the HTTPS url from the green **Code** button
3. In your terminal, somewhere sensible like your Desktop:

```bash
git clone <paste-your-url-here>
cd dynamic-web-f26
```

4. Drag your `hello-react` folder into it
5. Then:

```bash
git status          # see what git has noticed
git add .
git commit -m "week 1: hello react"
git push
```

6. Refresh the GitHub page in your browser. Your code is there.

> **First push will ask for a password.** Your GitHub password will not work.
> You need a personal access token — `../TROUBLESHOOTING.md` walks through it.
> Budget ten minutes for this; it bites almost everybody once.

**Do not clone the class repo today.** They'll need it next class, when there's
actually a starter folder in it worth having. Teaching both repos on day 1 is
how students end up committing homework into the class repo.

---

## Homework

See `HW.md`. The short version: **build an HTML recipe card for a recipe you
actually like.**

Tell them why, explicitly:

> "Next class we turn your recipe into a React app. Then we break it into
> components. Then we style it, and add a rating widget. You're going to be
> looking at this recipe for three weeks — pick one you like."

---

## Notes to self

- **Publish everything the night before, by 8pm.** Both sections get the same
  material; there's no reason for a student who preps ahead to find an empty
  folder.
- **Run section A first and keep a `KNOWN_ISSUES.md`.** Whatever breaks in the
  first section, fix before the second one walks in. That's a free dress
  rehearsal you didn't have in previous years.
- **Do NOT introduce a single library in weeks 1–3.** No Tailwind, no Router, no
  typechecking. Plain CSS, CSS Modules, `useState`. The one exception is
  `react-icons` in week 3, and only because they want a heart. Every previous
  semester hit a wall in week 3 by stacking six libraries on students who
  couldn't yet say where state should live.
