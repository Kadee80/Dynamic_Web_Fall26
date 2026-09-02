# Day 1 — Software Setup

Hi! Welcome to Dynamic Web Applications. We are going to write React code on the
very first day, so please get these four things installed at the beginning of class. It
takes about twenty minutes.

If anything here goes sideways, don't panic and don't spend two hours on it —
just come to the first class and we'll fix it together. But please _try_ first,
so I know what to expect.

---

## 1. Node.js

React projects run on Node. Download the **LTS** version (the one on the left,
with the even version number):

https://nodejs.org/en/download

- **Mac:** download the `.pkg` installer and run it.
- **Windows:** download the `.msi` installer and run it. Accept all the defaults.

## 2. Visual Studio Code

https://code.visualstudio.com/download

Once it's installed, add these extensions. Open the extensions panel with
`Shift + Cmd + X` (Mac) or `Shift + Ctrl + X` (Windows), search, click Install:

- **Prettier – Code formatter** (auto-formats your code so we all read the same thing)
- **ES7+ React/Redux/React-Native snippets** (type `rafce` + Tab to scaffold a component)

Then turn on format-on-save: `Cmd/Ctrl + ,` → search "format on save" → check the box.
Also search "default formatter" and set it to Prettier.

## 3. Git

- **Mac:** open Terminal and type `git --version`. If it asks to install the
  developer tools, say yes. That's it.
- **Windows:** download Git for Windows from https://git-scm.com/download/win and
  run the installer. Accept the defaults. This also gives you **Git Bash**, which
  is the terminal you should use for this class — it makes your commands match
  mine.

## 4. A GitHub account

https://github.com/join

Use an email you'll still have after you graduate. Your username will be visible
on everything you submit, so pick something you'd put on a résumé.

---

## Verify it worked

Open your terminal — **Terminal** on Mac, **Git Bash** on Windows (or PowerShell) — and paste this whole line, then hit Enter:

```bash
node -v && npm -v && git --version
```

You should get back three lines that look roughly like this:

```
v22.14.0
10.9.2
git version 2.47.1
```

The exact numbers don't matter, as long as your Node version starts with **v20**
or higher.

If you got `command not found` for any of them, that's completely normal and
usually means the installer finished but your terminal hasn't noticed yet —
**quit the terminal completely and reopen it**, then try again. If it still
fails, send me what you see and we can troubleshoot at the beginning of next class.

---

## What to bring on day 1

- Your laptop and its charger
- The above installed
- A recipe you like. Seriously. You'll see why.

See you soon —
Prof. Adee
