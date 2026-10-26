# Week 09 — Midterm presentations, and the rest of forms

| | |
|---|---|
| **[Tuesday — Midterm Presentations](Midterm_Presentations/README.md)** | Everybody presents. Five minutes each, order shuffled at the start of class. |
| **[Thursday — Forms, continued](Forms_Continued/README.md)** | The back half of the Week 08 forms class: error messages people can read, and a submit button that cannot save twice. |

**Your code is due Friday at midnight.** Presenting is what marks the midterm
on time; the code is graded from whatever is pushed to your repo at the end of
the week. The full brief is [Week07/Midterm.md](../Week07/Midterm.md).

## Tuesday — be ready before you sit down

Two terminal tabs already running, your app in a sensible state, and your
slides open if you are using them.

```bash
npm run dev        # tab 1 — Vite
npm run server     # tab 2 — json-server
```

Whatever time is left after presentations goes to Thursday's material, so bring
the forms project too.

## Thursday — start from where we stopped

```bash
cp -R Week08/end-of-class/week08-forms ~/your-hw-repo/week09-forms
cd week09-forms
npm install
npm run dev
```

That project is the Week 08 class exactly as we left it — mid-sentence, with
`validate()` written and no way for anyone to see what it found. Thursday is
connecting it up.

`node_modules` is never committed, so **`npm install` is required every time**
you copy or clone a project.

## The short version

The form already knows what is wrong with it. Today it learns to say so — at
the right moment, in words, to everybody — and the submit button stops
pretending a save is instant.

All of it applies directly to the midterm you are finishing this week.

## Homework

[HW.md](HW.md) — which is the midterm.

## If you get stuck

Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).
