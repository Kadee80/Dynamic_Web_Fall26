# Week 07 — Context, and finishing the memory game

| | |
|---|---|
| **[Class A — Context](ClassA.md)** | A refactor of the todo list: the state and the four operations move into one Provider, and no component is handed props it does not use. Plus `useCallback`, and an honest list of what Context is *not*. |
| **[Class B — the memory game, finished](ClassB.md)** | We pick the game back up at the exact line that broke it: comparing two choices. `useEffect` with a dependency array, matched cards, turns, and a win state. |

**The midterm brief is out: [Midterm.md](Midterm.md).** Read it this week, not
the night before.

## Class A — bring your todo list

The project from Week 06, with json-server working. Two terminal tabs:

```bash
npm run dev        # tab 1 — Vite, port 5173
npm run server     # tab 2 — json-server, port 3001
```

If yours is in a strange state, start from `Week06/end-of-class/todo-list-V2`.

## Class B — a starter that picks up mid-game

```bash
cp -R Week07/starter/memory-game-logic ~/your-hw-repo/week07-memory-game
cd week07-memory-game
npm install
npm run dev
```

It already has the shuffled board, the card flip, and both choices being
tracked. What it cannot do is tell whether two cards match — which is where we
start.

The earlier steps, from an empty project through to flipping two cards, are
still in [Week 05's notes](../Week05/ClassB.md), steps 1 to 5.

## Files in this folder

- **`starter/memory-game-logic`** — where class B begins.
- **`end-of-class/memory-game`** — the finished game.
- **`end-of-class/todo-list-V3`** — the todo list on Context, where class A ends.

`node_modules` is never committed, so **`npm install` is required every time**
you copy or clone a project.

## A note on file extensions

Class A puts JSX inside `src/context/todos.jsx`. **Vite will not compile JSX
out of a `.js` file** — if you see "Failed to parse source", check the
extension before you check anything else.

## If you get stuck

Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).
