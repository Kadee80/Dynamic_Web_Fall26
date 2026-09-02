# Troubleshooting

Check here **before** you email me. Most of the problems in this class are one of
about a dozen things, and they're all below.

---

## The four questions, in order

Before you do anything else:

1. **Read the error out loud.** Actually read it. The answer is in there
   surprisingly often.
2. **Are you in the right folder?** Run `ls` (Mac/Git Bash) or `dir` (CMD). Do
   you see `package.json`? If not, you're in the wrong directory and *every*
   command will fail in confusing ways.
3. **Did you run `npm install`?** Any time you copy or clone a project folder,
   you must run `npm install` before `npm run dev`. `node_modules` is never
   committed to git.
4. **Then** ask a neighbor, then ask me.

---

## Setup problems

### `command not found: node` / `npm` / `git`

The installer finished but your terminal hasn't noticed. **Quit the terminal
completely** (`Cmd+Q`, not just closing the window) and reopen it.

If it still fails, the installer didn't put it on your PATH. Reinstall from
https://nodejs.org/en/download using the `.pkg` (Mac) or `.msi` (Windows)
installer rather than a zip.

### Mac: `xcrun: error: invalid active developer path`

Xcode command line tools aren't installed. Run:

```bash
xcode-select --install
```

Click through the dialog, wait for it to finish, reopen your terminal.

### Windows: which terminal should I use?

**Git Bash.** It ships with Git for Windows. It makes `ls`, `pwd` and `cd` behave
the same way they do on my screen, which means you can follow along in class
without translating every command.

PowerShell and Command Prompt will both mostly work, but `ls` and file paths
behave differently and you'll spend the semester confused about it for no reason.

### Windows: `running scripts is disabled on this system`

You're in PowerShell. Either switch to Git Bash (recommended), or run PowerShell
**as Administrator** and enter:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

---

## npm problems

### `EACCES: permission denied`

Do **not** fix this with `sudo`. `sudo npm install` will make things worse by
leaving root-owned files in your project that you can't delete later.

It usually means you're installing into a folder you don't own. Make sure your
project lives somewhere inside your home directory — Desktop or Documents is
fine — not at the root of your drive.

If you've already run `sudo npm install` and things are broken:

```bash
sudo rm -rf node_modules package-lock.json
npm install
```

### `Cannot find module` / the page is blank after cloning or copying a project

You skipped `npm install`. `node_modules` is deliberately not in git — it's
thousands of files. Every time you get a new project folder:

```bash
cd the-project-folder
npm install
npm run dev
```

### `npm install` is taking forever

On NYU wifi it can be slow, but if it's been more than a few minutes, `Ctrl + C`
and try again. If it repeatedly hangs:

```bash
npm cache clean --force
npm install
```

### A wall of red text after install

Read whether it says **error** or **warn**. `npm warn deprecated …` is noise from
sub-dependencies — everybody gets it, it does not mean anything is broken. If
`npm run dev` works, you're fine. Ignore it.

---

## Dev server problems

### `Port 5173 is already in use`

You have another copy of the dev server running, probably in a terminal tab you
forgot about. Either find that tab and press `Ctrl + C`, or just let Vite pick
the next port — it'll tell you which one it used. Read the terminal output.

To kill it by force:

```bash
# Mac / Git Bash
npx kill-port 5173
```

### `Ctrl + C` isn't stopping the server

Make sure the terminal window is focused, and that it's `Ctrl` — **not** `Cmd` —
even on a Mac. If it's truly stuck, closing the terminal tab works.

### I changed a file and nothing happened in the browser

- Did you **save** the file? (`Cmd/Ctrl + S`)
- Is the dev server still running? Check the terminal for a crash message.
- Are you editing the file you think you are? Check the tab title in VS Code.
- Hard refresh: `Cmd + Shift + R` / `Ctrl + Shift + R`

### The browser is blank and the terminal looks fine

Open the browser console — `Cmd + Option + J` (Mac) or `F12` (Windows). **The
error is in there.** A blank page almost always means a JavaScript error on
load, and the console will tell you which file and which line.

---

## React errors you will definitely hit

### `Objects are not valid as a React child`

You tried to render an object directly. `{recipe}` won't work — `{recipe.title}`
will. If you meant to render a list, you need `.map()`.

### `Each child in a list should have a unique "key" prop`

Every item produced by `.map()` needs a `key`:

```jsx
{items.map((item, index) => (
  <li key={index}>{item}</li>
))}
```

### `X is not defined` where X is one of your components

You forgot the `import` at the top of the file. Or you imported it with `{ }`
when it was a default export, or without `{ }` when it was a named export.

- `export default Foo` → `import Foo from './Foo'`
- `export const Foo` → `import {Foo} from './Foo'`

### `Failed to resolve import "./Foo"`

Check the spelling and the capitalization. **Mac is forgiving about case and
deployment servers are not** — `./recipeCard` and `./RecipeCard` are different
files as far as the rest of the world is concerned. Match it exactly.

### `Rendered more hooks than during the previous render`

You put a `useState` or `useEffect` inside an `if`, a loop, or after an early
`return`. Hooks go at the very top of the component, always, unconditionally.

### `require is not defined`

You're following an older create-react-app tutorial. In a Vite project, use
`import`:

```js
// ❌ old
imgSrc: require('../assets/pancake.png')

// ✅ new
import PANCAKE from '../assets/pancake.png'
imgSrc: PANCAKE
```

---

## Git and GitHub problems

### GitHub won't let me push / `Support for password authentication was removed`

Your GitHub **password** does not work for pushing. Hasn't since 2021. You need
a **personal access token**, which is just a password with an expiry date.

1. github.com → click your avatar → **Settings**
2. scroll all the way down → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**
4. Note: `class laptop`. Expiration: pick something past December.
5. Check the **`repo`** box (the top-level one — it ticks the children).
6. **Generate token**, then **copy it immediately.** You cannot see it again.
7. Paste it into a note somewhere you'll find it.

Next time git asks for a password, paste the **token** instead. To stop being
asked every time:

```bash
git config --global credential.helper store    # Windows / Linux
git config --global credential.helper osxkeychain   # Mac
```

### `fatal: not a git repository`

You're not inside a cloned repo folder. `cd` into it first.

### `Please tell me who you are`

First time using git on this machine:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@nyu.edu"
```

### I edited files in the class repo and now `git pull` fails

Don't work inside the class repo. **Copy** the week's `starter/` folder out to
your own homework repo and work on the copy.

To fix it, throw away your local changes to the class repo:

```bash
cd the-class-repo
git checkout .
git pull
```

If that doesn't work, delete your copy of the class repo and clone it again. You
haven't lost anything — your work is in *your* repo.

### I accidentally committed `node_modules`

Every project in this repo has a `.gitignore` with `node_modules` in it. If you
made a project without one and already committed:

```bash
echo "node_modules" >> .gitignore
git rm -r --cached node_modules
git commit -m "stop tracking node_modules"
git push
```

---

## Still stuck?

Bring me:

1. the **exact** error text (copy-paste or screenshot the whole thing, not a
   description of it)
2. what you ran, and what folder you ran it in
3. what you'd already tried

That's not bureaucracy — it's genuinely the difference between a two-minute fix
and a twenty-minute one, and it's also exactly what a senior dev will ask you
for at your first job.
