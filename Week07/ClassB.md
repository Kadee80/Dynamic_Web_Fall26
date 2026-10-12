# Week 07 — The Memory Game, again: where state updates actually land

*Finishing the memory game: useEffect, matching, and a win state · ~110 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

We are finishing the memory game, and starting from the point where it got away from us last time.

Copy `starter/memory-game-logic` from the class repo. It already has everything we built up front: a shuffled board, cards that flip when you click them, and two choices being tracked. What it cannot do is decide whether those two choices **match** — and the reason that is hard is the actual lesson.

If you want the earlier steps — the project setup, the 3D flip, the shuffle — they are still in [Week 05's notes](../Week05/ClassB.md), steps 1 to 5.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [Start where it fell apart](#step-1)
2. [Read what you have](#step-2)
3. [Compare them in the handler — and watch it fail](#step-3)
4. [The fix: useEffect with a dependency array](#step-4)
5. [Matched cards stay up](#step-5)
6. [Counting turns](#step-6)
7. [Stop the cheating](#step-7)
8. [In-class exercise: the win state](#step-8)
9. [The win state, together](#step-9)
10. [Wrap, and the midterm](#step-10)

---

<a id="step-1"></a>

## Step 1 — Start where it fell apart

`git pull`, copy `starter/memory-game-logic` into your repo, `npm install`, run it.

Click New Game and flip two cards. Everything you see working is what we built last time: the deck is doubled and shuffled, each card has an id, clicking one tells the Grid which card it was, and the Grid is tracking **`choiceOne`** and **`choiceTwo`**.

What it cannot do: notice that two cards match. That is the whole of today.

```bash
cd ~/your-hw-repo
cp -R ~/path-to-class-repo/Week07/starter/memory-game-logic ./week07-memory-game
cd week07-memory-game
npm install
npm run dev
```

**`index.html`**  — new file

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Memory Game</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**`src/App.jsx`**  — new file

```jsx
import Grid from './components/Grid'

const App = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>
      <Grid />
    </div>
  )
}

export default App
```

**`src/components/Card.module.css`**  — new file

```css
/* ==========================================================================
   The card flip. This is a CSS Module: the `.module.css` in the filename is
   what makes it one. Vite rewrites every class in here to a unique name at
   build time, so a `.card` in this file can never collide with a `.card`
   anywhere else in the project. You import it as an object and read the
   class names off it -- see Card.jsx.

   This is the one place in the project we are not using Tailwind. A 3D flip
   needs three properties working together across three nested elements;
   written as utility classes it is unreadable, and written as CSS it is
   eight lines you can follow with your finger.
   ========================================================================== */

.card {
  background-color: transparent;
  aspect-ratio: 1;
  /* how much depth the 3D space has. Without it the rotation looks flat --
     the card just squashes instead of turning */
  perspective: 1000px;
}

.inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  /* the two faces keep their own place in 3D space instead of being
     flattened onto the parent */
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

/* the whole trick: turn the card half way round. The class is applied by
   Card.jsx now, from a prop -- the CSS does not decide anything. */
.flipped {
  transform: rotateY(180deg);
}

.front,
.back {
  position: absolute;
  inset: 0;
  /* hide whichever face is pointing away from us. Take this out and both
     images show through each other at once. */
  backface-visibility: hidden;
  background-color: #aaa;
}

/* the back starts pre-rotated, so it is facing us once the card turns */
.back {
  transform: rotateY(180deg);
}
```

**`src/components/Card.jsx`**  — new file

```jsx
import cx from 'classnames'
import styles from './Card.module.css'
import CardPattern from '../assets/moroccan-flower-dark.png'

const Card = (props) => {
  const {card, handleChoice, flipped} = props

  const handleClick = () => {
    // the Card does not decide whether it is flipped. It reports the click
    // and lets the Grid decide -- the same trade as every component since
    // the Accordion.
    handleChoice(card)
  }

  return (
    <div className={styles.card}>
      <div
        onClick={handleClick}
        className={cx(styles.inner, {[styles.flipped]: flipped})}
      >
        <div className={styles.front}>
          <img src={CardPattern} alt="" />
        </div>
        <div className={styles.back}>
          <img src={card.src} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Card
```

**`src/components/Grid.jsx`**  — new file

```jsx
import {useState} from 'react'
import Card from './Card'
import Bilbo from '../assets/bilbo-baggins.png'
import Cameron from '../assets/cameron-poe.png'
import Nikki from '../assets/nikki-cage.png'
import Pollux from '../assets/pollux-troy.png'

const cardImages = [{src: Bilbo}, {src: Cameron}, {src: Nikki}, {src: Pollux}]

const Grid = () => {
  // the deck lives in state, because the board has to change when somebody
  // clicks New Game
  const [cards, setCards] = useState([])
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)

  const shuffleCards = () => {
    const shuffled = [...cardImages, ...cardImages]
      // sort calls this for pairs of items. A negative number leaves them
      // alone, a positive number swaps them -- so a random one shuffles.
      .sort(() => Math.random() - 0.5)
      // every card needs its own id: there are two of each image now, so
      // `src` no longer tells the two copies apart
      .map((card) => ({...card, id: crypto.randomUUID()}))

    setCards(shuffled)
  }

  const handleChoice = (card) => {
    // no choice yet? this is choice one. Otherwise it is choice two.
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  return (
    <>
      <button
        onClick={shuffleCards}
        className="bg-blue-900 text-white uppercase px-8 py-4 rounded-lg mb-6"
      >
        New Game
      </button>

      <div className="grid grid-cols-4 gap-4 max-w-3xl">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo}
          />
        ))}
      </div>
    </>
  )
}

export default Grid
```

---

<a id="step-2"></a>

## Step 2 — Read what you have

Five minutes on `Grid.jsx`, out loud, before we add anything.

Three pieces of state: `cards`, `choiceOne`, `choiceTwo`.

One handler:

```
choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
```

*Do we already have a first choice? Then this is the second. Otherwise it is the first.*

And one prop doing the display: a card is face up if it is either choice.

**Now predict.** We have two choices in state. Where would you write the code that compares them?

---

<a id="step-3"></a>

## Step 3 — Compare them in the handler — and watch it fail

We do what the room said: compare them right there, where they are.

Open the console, make it big, and flip two cards.

**Nothing.** Flip two more. Now it logs — the *previous* pair.

Do it again. Every single comparison is one turn behind.

Sit with that for a minute before anyone explains it. What is `choiceTwo` at the moment that `if` runs?

**`src/components/Grid.jsx`**

What changed:

```diff
@@ -28,6 +28,12 @@
 
   const handleChoice = (card) => {
-    // no choice yet? this is choice one. Otherwise it is choice two.
     choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
+
+    // THIS DOES NOT WORK. Read the console before you believe me.
+    // setChoiceTwo above does not change choiceTwo on this line -- state
+    // updates are queued, and this function keeps the values it started with.
+    if (choiceOne && choiceTwo) {
+      console.log('comparing', choiceOne.src, choiceTwo.src)
+    }
   }
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
import Card from './Card'
import Bilbo from '../assets/bilbo-baggins.png'
import Cameron from '../assets/cameron-poe.png'
import Nikki from '../assets/nikki-cage.png'
import Pollux from '../assets/pollux-troy.png'

const cardImages = [{src: Bilbo}, {src: Cameron}, {src: Nikki}, {src: Pollux}]

const Grid = () => {
  // the deck lives in state, because the board has to change when somebody
  // clicks New Game
  const [cards, setCards] = useState([])
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)

  const shuffleCards = () => {
    const shuffled = [...cardImages, ...cardImages]
      // sort calls this for pairs of items. A negative number leaves them
      // alone, a positive number swaps them -- so a random one shuffles.
      .sort(() => Math.random() - 0.5)
      // every card needs its own id: there are two of each image now, so
      // `src` no longer tells the two copies apart
      .map((card) => ({...card, id: crypto.randomUUID()}))

    setCards(shuffled)
  }

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)

    // THIS DOES NOT WORK. Read the console before you believe me.
    // setChoiceTwo above does not change choiceTwo on this line -- state
    // updates are queued, and this function keeps the values it started with.
    if (choiceOne && choiceTwo) {
      console.log('comparing', choiceOne.src, choiceTwo.src)
    }
  }

  return (
    <>
      <button
        onClick={shuffleCards}
        className="bg-blue-900 text-white uppercase px-8 py-4 rounded-lg mb-6"
      >
        New Game
      </button>

      <div className="grid grid-cols-4 gap-4 max-w-3xl">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo}
          />
        ))}
      </div>
    </>
  )
}

export default Grid
```

</details>

---

<a id="step-4"></a>

## Step 4 — The fix: useEffect with a dependency array

The comparison is not wrong, it is in the wrong **moment**. It needs to run *after* the render where the choices actually changed.

```
useEffect(() => { ... }, [choiceOne, choiceTwo])
```

Read it as a sentence: **after any render in which choiceOne or choiceTwo changed, run this.** By then the values are really in state, and the comparison is correct.

You have seen `useEffect` with `[]` — run once on mount — and you have seen one with a cleanup. This is the third form, and the one you will reach for most often for the rest of your life.

Same comparison. Same two lines. Different moment.

**`src/components/Grid.jsx`**

What changed:

```diff
@@ -1,3 +1,3 @@
-import {useState} from 'react'
+import {useState, useEffect} from 'react'
 import Card from './Card'
 import Bilbo from '../assets/bilbo-baggins.png'
@@ -28,13 +28,26 @@
 
   const handleChoice = (card) => {
+    // no choice yet? this is choice one. Otherwise it is choice two.
     choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
+  }
 
-    // THIS DOES NOT WORK. Read the console before you believe me.
-    // setChoiceTwo above does not change choiceTwo on this line -- state
-    // updates are queued, and this function keeps the values it started with.
+  const resetTurn = () => {
+    setChoiceOne(null)
+    setChoiceTwo(null)
+  }
+
+  // [choiceOne, choiceTwo] = run this AFTER a render in which either of them
+  // changed. By then the new values really are in state, so we can compare.
+  useEffect(() => {
     if (choiceOne && choiceTwo) {
-      console.log('comparing', choiceOne.src, choiceTwo.src)
+      if (choiceOne.src === choiceTwo.src) {
+        console.log('match!')
+        resetTurn()
+      } else {
+        console.log('no match')
+        resetTurn()
+      }
     }
-  }
+  }, [choiceOne, choiceTwo])
 
   return (
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState, useEffect} from 'react'
import Card from './Card'
import Bilbo from '../assets/bilbo-baggins.png'
import Cameron from '../assets/cameron-poe.png'
import Nikki from '../assets/nikki-cage.png'
import Pollux from '../assets/pollux-troy.png'

const cardImages = [{src: Bilbo}, {src: Cameron}, {src: Nikki}, {src: Pollux}]

const Grid = () => {
  // the deck lives in state, because the board has to change when somebody
  // clicks New Game
  const [cards, setCards] = useState([])
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)

  const shuffleCards = () => {
    const shuffled = [...cardImages, ...cardImages]
      // sort calls this for pairs of items. A negative number leaves them
      // alone, a positive number swaps them -- so a random one shuffles.
      .sort(() => Math.random() - 0.5)
      // every card needs its own id: there are two of each image now, so
      // `src` no longer tells the two copies apart
      .map((card) => ({...card, id: crypto.randomUUID()}))

    setCards(shuffled)
  }

  const handleChoice = (card) => {
    // no choice yet? this is choice one. Otherwise it is choice two.
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
  }

  // [choiceOne, choiceTwo] = run this AFTER a render in which either of them
  // changed. By then the new values really are in state, so we can compare.
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      if (choiceOne.src === choiceTwo.src) {
        console.log('match!')
        resetTurn()
      } else {
        console.log('no match')
        resetTurn()
      }
    }
  }, [choiceOne, choiceTwo])

  return (
    <>
      <button
        onClick={shuffleCards}
        className="bg-blue-900 text-white uppercase px-8 py-4 rounded-lg mb-6"
      >
        New Game
      </button>

      <div className="grid grid-cols-4 gap-4 max-w-3xl">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo}
          />
        ))}
      </div>
    </>
  )
}

export default Grid
```

</details>

---

<a id="step-5"></a>

## Step 5 — Matched cards stay up

When the images match, every card with that `src` gets `matched: true`, and `flipped` becomes *is it a current choice **or** is it matched*.

Two things worth naming:

- **the updater form.** `setCards((prevCards) => ...)` — React hands you the current value, you return the new one. Use it whenever the next value is built from the previous one, for the same reason the last two steps existed
- **never edit state directly.** `prevCards.map()` builds a new array; `{...card, matched: true}` builds a new object. Change the old ones and React sees nothing change

And a `setTimeout` on the mismatch, because the flip animation takes 0.6 seconds and the comparison takes none.

**`src/components/Grid.jsx`**

What changed:

```diff
@@ -42,9 +42,19 @@
     if (choiceOne && choiceTwo) {
       if (choiceOne.src === choiceTwo.src) {
-        console.log('match!')
+        // the updater form: React hands us the current cards and we return
+        // the new ones. Never edit `cards` directly -- build a new array.
+        setCards((prevCards) => {
+          return prevCards.map((card) => {
+            if (card.src === choiceOne.src) {
+              return {...card, matched: true}
+            }
+            return card
+          })
+        })
         resetTurn()
       } else {
-        console.log('no match')
-        resetTurn()
+        // without the wait, the pair is compared and reset before the 0.6s
+        // flip has finished -- nobody ever sees the second card
+        setTimeout(() => resetTurn(), 1200)
       }
     }
@@ -66,5 +76,5 @@
             card={card}
             handleChoice={handleChoice}
-            flipped={card === choiceOne || card === choiceTwo}
+            flipped={card === choiceOne || card === choiceTwo || card.matched}
           />
         ))}
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState, useEffect} from 'react'
import Card from './Card'
import Bilbo from '../assets/bilbo-baggins.png'
import Cameron from '../assets/cameron-poe.png'
import Nikki from '../assets/nikki-cage.png'
import Pollux from '../assets/pollux-troy.png'

const cardImages = [{src: Bilbo}, {src: Cameron}, {src: Nikki}, {src: Pollux}]

const Grid = () => {
  // the deck lives in state, because the board has to change when somebody
  // clicks New Game
  const [cards, setCards] = useState([])
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)

  const shuffleCards = () => {
    const shuffled = [...cardImages, ...cardImages]
      // sort calls this for pairs of items. A negative number leaves them
      // alone, a positive number swaps them -- so a random one shuffles.
      .sort(() => Math.random() - 0.5)
      // every card needs its own id: there are two of each image now, so
      // `src` no longer tells the two copies apart
      .map((card) => ({...card, id: crypto.randomUUID()}))

    setCards(shuffled)
  }

  const handleChoice = (card) => {
    // no choice yet? this is choice one. Otherwise it is choice two.
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
  }

  // [choiceOne, choiceTwo] = run this AFTER a render in which either of them
  // changed. By then the new values really are in state, so we can compare.
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      if (choiceOne.src === choiceTwo.src) {
        // the updater form: React hands us the current cards and we return
        // the new ones. Never edit `cards` directly -- build a new array.
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return {...card, matched: true}
            }
            return card
          })
        })
        resetTurn()
      } else {
        // without the wait, the pair is compared and reset before the 0.6s
        // flip has finished -- nobody ever sees the second card
        setTimeout(() => resetTurn(), 1200)
      }
    }
  }, [choiceOne, choiceTwo])

  return (
    <>
      <button
        onClick={shuffleCards}
        className="bg-blue-900 text-white uppercase px-8 py-4 rounded-lg mb-6"
      >
        New Game
      </button>

      <div className="grid grid-cols-4 gap-4 max-w-3xl">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
          />
        ))}
      </div>
    </>
  )
}

export default Grid
```

</details>

---

<a id="step-6"></a>

## Step 6 — Counting turns

One more piece of state, and the updater form a second time: `setTurns((prevTurns) => prevTurns + 1)` inside `resetTurn`, so every completed pair counts once, match or not. New Game sets it back to zero.

**`src/components/Grid.jsx`**

What changed:

```diff
@@ -14,4 +14,5 @@
   const [choiceOne, setChoiceOne] = useState(null)
   const [choiceTwo, setChoiceTwo] = useState(null)
+  const [turns, setTurns] = useState(0)
 
   const shuffleCards = () => {
@@ -25,4 +26,5 @@
 
     setCards(shuffled)
+    setTurns(0)
   }
 
@@ -35,4 +37,6 @@
     setChoiceOne(null)
     setChoiceTwo(null)
+    // the updater form again: the next value is built from the previous one
+    setTurns((prevTurns) => prevTurns + 1)
   }
 
@@ -70,4 +74,6 @@
       </button>
 
+      <p className="mb-6 text-lg">Turns used: {turns}</p>
+
       <div className="grid grid-cols-4 gap-4 max-w-3xl">
         {cards.map((card) => (
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState, useEffect} from 'react'
import Card from './Card'
import Bilbo from '../assets/bilbo-baggins.png'
import Cameron from '../assets/cameron-poe.png'
import Nikki from '../assets/nikki-cage.png'
import Pollux from '../assets/pollux-troy.png'

const cardImages = [{src: Bilbo}, {src: Cameron}, {src: Nikki}, {src: Pollux}]

const Grid = () => {
  // the deck lives in state, because the board has to change when somebody
  // clicks New Game
  const [cards, setCards] = useState([])
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [turns, setTurns] = useState(0)

  const shuffleCards = () => {
    const shuffled = [...cardImages, ...cardImages]
      // sort calls this for pairs of items. A negative number leaves them
      // alone, a positive number swaps them -- so a random one shuffles.
      .sort(() => Math.random() - 0.5)
      // every card needs its own id: there are two of each image now, so
      // `src` no longer tells the two copies apart
      .map((card) => ({...card, id: crypto.randomUUID()}))

    setCards(shuffled)
    setTurns(0)
  }

  const handleChoice = (card) => {
    // no choice yet? this is choice one. Otherwise it is choice two.
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    // the updater form again: the next value is built from the previous one
    setTurns((prevTurns) => prevTurns + 1)
  }

  // [choiceOne, choiceTwo] = run this AFTER a render in which either of them
  // changed. By then the new values really are in state, so we can compare.
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      if (choiceOne.src === choiceTwo.src) {
        // the updater form: React hands us the current cards and we return
        // the new ones. Never edit `cards` directly -- build a new array.
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return {...card, matched: true}
            }
            return card
          })
        })
        resetTurn()
      } else {
        // without the wait, the pair is compared and reset before the 0.6s
        // flip has finished -- nobody ever sees the second card
        setTimeout(() => resetTurn(), 1200)
      }
    }
  }, [choiceOne, choiceTwo])

  return (
    <>
      <button
        onClick={shuffleCards}
        className="bg-blue-900 text-white uppercase px-8 py-4 rounded-lg mb-6"
      >
        New Game
      </button>

      <p className="mb-6 text-lg">Turns used: {turns}</p>

      <div className="grid grid-cols-4 gap-4 max-w-3xl">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
          />
        ))}
      </div>
    </>
  )
}

export default Grid
```

</details>

---

<a id="step-7"></a>

## Step 7 — Stop the cheating

Three bugs, all the same bug: the board accepts clicks it should not.

- click one card twice and it becomes both choices, and matches itself
- click a third card during the wait and the game gets confused
- click a matched card and it joins in again

One `disabled` piece of state, set when two cards are up and cleared in `resetTurn`, plus two conditions in `handleChoice`. A **guard clause** — `if (bad) return` at the top — keeps the real logic underneath from growing another layer of nesting.

**`src/components/Grid.jsx`**

What changed:

```diff
@@ -15,4 +15,5 @@
   const [choiceTwo, setChoiceTwo] = useState(null)
   const [turns, setTurns] = useState(0)
+  const [disabled, setDisabled] = useState(false)
 
   const shuffleCards = () => {
@@ -30,5 +31,9 @@
 
   const handleChoice = (card) => {
-    // no choice yet? this is choice one. Otherwise it is choice two.
+    // a guard clause: get the impossible clicks out of the way first, so the
+    // real logic underneath only ever runs on a legal move
+    if (disabled || card === choiceOne || card.matched) {
+      return
+    }
     choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
   }
@@ -37,4 +42,5 @@
     setChoiceOne(null)
     setChoiceTwo(null)
+    setDisabled(false)
     // the updater form again: the next value is built from the previous one
     setTurns((prevTurns) => prevTurns + 1)
@@ -45,4 +51,6 @@
   useEffect(() => {
     if (choiceOne && choiceTwo) {
+      setDisabled(true)
+
       if (choiceOne.src === choiceTwo.src) {
         // the updater form: React hands us the current cards and we return
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState, useEffect} from 'react'
import Card from './Card'
import Bilbo from '../assets/bilbo-baggins.png'
import Cameron from '../assets/cameron-poe.png'
import Nikki from '../assets/nikki-cage.png'
import Pollux from '../assets/pollux-troy.png'

const cardImages = [{src: Bilbo}, {src: Cameron}, {src: Nikki}, {src: Pollux}]

const Grid = () => {
  // the deck lives in state, because the board has to change when somebody
  // clicks New Game
  const [cards, setCards] = useState([])
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [turns, setTurns] = useState(0)
  const [disabled, setDisabled] = useState(false)

  const shuffleCards = () => {
    const shuffled = [...cardImages, ...cardImages]
      // sort calls this for pairs of items. A negative number leaves them
      // alone, a positive number swaps them -- so a random one shuffles.
      .sort(() => Math.random() - 0.5)
      // every card needs its own id: there are two of each image now, so
      // `src` no longer tells the two copies apart
      .map((card) => ({...card, id: crypto.randomUUID()}))

    setCards(shuffled)
    setTurns(0)
  }

  const handleChoice = (card) => {
    // a guard clause: get the impossible clicks out of the way first, so the
    // real logic underneath only ever runs on a legal move
    if (disabled || card === choiceOne || card.matched) {
      return
    }
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setDisabled(false)
    // the updater form again: the next value is built from the previous one
    setTurns((prevTurns) => prevTurns + 1)
  }

  // [choiceOne, choiceTwo] = run this AFTER a render in which either of them
  // changed. By then the new values really are in state, so we can compare.
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)

      if (choiceOne.src === choiceTwo.src) {
        // the updater form: React hands us the current cards and we return
        // the new ones. Never edit `cards` directly -- build a new array.
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return {...card, matched: true}
            }
            return card
          })
        })
        resetTurn()
      } else {
        // without the wait, the pair is compared and reset before the 0.6s
        // flip has finished -- nobody ever sees the second card
        setTimeout(() => resetTurn(), 1200)
      }
    }
  }, [choiceOne, choiceTwo])

  return (
    <>
      <button
        onClick={shuffleCards}
        className="bg-blue-900 text-white uppercase px-8 py-4 rounded-lg mb-6"
      >
        New Game
      </button>

      <p className="mb-6 text-lg">Turns used: {turns}</p>

      <div className="grid grid-cols-4 gap-4 max-w-3xl">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
          />
        ))}
      </div>
    </>
  )
}

export default Grid
```

</details>

---

<a id="step-8"></a>

## Step 8 — In-class exercise: the win state

Fifteen minutes, on your own. When every card is matched, say so on screen.

Three questions before you type:

1. **What changes** when the last pair is matched?
2. So **which piece of state** does the check watch?
3. What stops it declaring a win on an **empty board**?

`.every()` takes a function and returns true only if it is true for every item. And when they win — what should New Game do about it?

---

<a id="step-9"></a>

## Step 9 — The win state, together

A **second effect**, watching a **different** piece of state. `cards` changes when a pair is matched, so `[cards]` is when this needs to check.

```
cards.every((card) => card.matched)
```

`cards.length > 0` keeps it from declaring a win on the empty board — an empty array passes `.every()`, which is technically correct and completely useless.

Two effects, two dependency arrays, each watching the thing it cares about. That is the shape of every React app you will write.

**`src/components/Grid.jsx`**

What changed:

```diff
@@ -16,4 +16,5 @@
   const [turns, setTurns] = useState(0)
   const [disabled, setDisabled] = useState(false)
+  const [won, setWon] = useState(false)
 
   const shuffleCards = () => {
@@ -28,4 +29,5 @@
     setCards(shuffled)
     setTurns(0)
+    setWon(false)
   }
 
@@ -46,4 +48,13 @@
     setTurns((prevTurns) => prevTurns + 1)
   }
+
+  // a second effect, watching a different piece of state. `cards` changes
+  // when a pair is matched, so that is when this needs to check.
+  // cards.length > 0 keeps it from declaring a win on the empty board.
+  useEffect(() => {
+    if (cards.length > 0 && cards.every((card) => card.matched)) {
+      setWon(true)
+    }
+  }, [cards])
 
   // [choiceOne, choiceTwo] = run this AFTER a render in which either of them
@@ -84,4 +95,10 @@
       <p className="mb-6 text-lg">Turns used: {turns}</p>
 
+      {won && (
+        <p className="mb-6 text-2xl font-bold text-green-700">
+          You cleared the board in {turns} turns.
+        </p>
+      )}
+
       <div className="grid grid-cols-4 gap-4 max-w-3xl">
         {cards.map((card) => (
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState, useEffect} from 'react'
import Card from './Card'
import Bilbo from '../assets/bilbo-baggins.png'
import Cameron from '../assets/cameron-poe.png'
import Nikki from '../assets/nikki-cage.png'
import Pollux from '../assets/pollux-troy.png'

const cardImages = [{src: Bilbo}, {src: Cameron}, {src: Nikki}, {src: Pollux}]

const Grid = () => {
  // the deck lives in state, because the board has to change when somebody
  // clicks New Game
  const [cards, setCards] = useState([])
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [turns, setTurns] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const [won, setWon] = useState(false)

  const shuffleCards = () => {
    const shuffled = [...cardImages, ...cardImages]
      // sort calls this for pairs of items. A negative number leaves them
      // alone, a positive number swaps them -- so a random one shuffles.
      .sort(() => Math.random() - 0.5)
      // every card needs its own id: there are two of each image now, so
      // `src` no longer tells the two copies apart
      .map((card) => ({...card, id: crypto.randomUUID()}))

    setCards(shuffled)
    setTurns(0)
    setWon(false)
  }

  const handleChoice = (card) => {
    // a guard clause: get the impossible clicks out of the way first, so the
    // real logic underneath only ever runs on a legal move
    if (disabled || card === choiceOne || card.matched) {
      return
    }
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setDisabled(false)
    // the updater form again: the next value is built from the previous one
    setTurns((prevTurns) => prevTurns + 1)
  }

  // a second effect, watching a different piece of state. `cards` changes
  // when a pair is matched, so that is when this needs to check.
  // cards.length > 0 keeps it from declaring a win on the empty board.
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      setWon(true)
    }
  }, [cards])

  // [choiceOne, choiceTwo] = run this AFTER a render in which either of them
  // changed. By then the new values really are in state, so we can compare.
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)

      if (choiceOne.src === choiceTwo.src) {
        // the updater form: React hands us the current cards and we return
        // the new ones. Never edit `cards` directly -- build a new array.
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return {...card, matched: true}
            }
            return card
          })
        })
        resetTurn()
      } else {
        // without the wait, the pair is compared and reset before the 0.6s
        // flip has finished -- nobody ever sees the second card
        setTimeout(() => resetTurn(), 1200)
      }
    }
  }, [choiceOne, choiceTwo])

  return (
    <>
      <button
        onClick={shuffleCards}
        className="bg-blue-900 text-white uppercase px-8 py-4 rounded-lg mb-6"
      >
        New Game
      </button>

      <p className="mb-6 text-lg">Turns used: {turns}</p>

      {won && (
        <p className="mb-6 text-2xl font-bold text-green-700">
          You cleared the board in {turns} turns.
        </p>
      )}

      <div className="grid grid-cols-4 gap-4 max-w-3xl">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
          />
        ))}
      </div>
    </>
  )
}

export default Grid
```

</details>

---

<a id="step-10"></a>

## Step 10 — Wrap, and the midterm

One sentence to leave with:

> `setSomething(value)` does not change `something` on the next line. If you need to react to the new value, that is what `useEffect` is for.

You will hit this in the midterm. When something is one step behind and you cannot see why, come back to today.

**The midterm brief is out** — see `Midterm.md`. It is the todo list, with at least one more input and an actual purpose. This game is not the midterm, but the state thinking is identical.

---

**Where we landed:** a finished game — shuffle, flip, match, count turns, no clicking through the animation, and a win state.

**The one thing to carry out of this room:**

> Calling `setSomething(value)` does not change `something` on the next line. It queues an update. The new value exists in the **next** run of the component.

That is why the comparison could not live in the click handler, and it is why `useEffect` with a dependency array exists: *after a render where this changed, do something about it.*

You will hit this again in your midterm. When a value is one step behind and you cannot see why — this is why.

**Also worth keeping:** the updater form, `setCards((prev) => ...)`, whenever the next value is built from the previous one.

**Homework:** see [HW.md](HW.md).
