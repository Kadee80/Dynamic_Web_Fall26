# Week 05 — Talking to an API, and state that watches state

| | |
|---|---|
| **[Class A — API requests](ClassA.md)** | A real image search against the Unsplash API. `axios`, `async`/`await`, an API key kept out of your repo with `.env.local`, an input bound to state, and the loading / empty / error states every fetching screen needs. **Built from scratch** — you scaffold the project in class. |
| **[Class B — the memory game](ClassB.md)** | A card game, and the reason `useEffect` exists: you cannot read a piece of state on the same line that sets it. **Starts from `starter/memory-game`** — the board and the 3D card flip are already built, so the whole class is logic. |

The two classes are independent — class B does not build on class A's project.

## Files in this folder

- **`starter/memory-game/`** — where class B begins: a static board of four
  cards that flip on hover, and no game logic at all. Copy the whole folder.
- **`end-of-class/image-search/`** and **`end-of-class/memory-game/`** — where
  each class ends up, complete and runnable. Use them to check your work, not
  to skip the typing.

```bash
# class B, in your own homework repo
cp -R path/to/class-repo/Week05/starter/memory-game ./week05-memory-game
cd week05-memory-game
npm install
npm run dev
```

`node_modules` is never committed, so **`npm install` is required every time**
you copy or clone a project — even when the folder looks complete.

Class A scaffolds its own project:

```bash
npm create vite@latest image-search -- --template react
cd image-search
npm install
npm install axios
npm install -D tailwindcss @tailwindcss/vite
npm run dev
```

## About API keys

You need a free [Unsplash developer account](https://unsplash.com/developers)
for class A. Make it **before** class if you can — activation is an email round
trip.

Your key goes in `.env.local`, which is gitignored. Never commit a key, and
never paste one into a file you are about to push. The free tier allows **50
requests an hour**, which is fewer than you think once you start testing. The
finished project ships a `.env.example` showing the shape — copy it to
`.env.local` and put your own key in.

## If you get stuck

Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).
