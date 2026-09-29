# Week 05 — The Memory Game: useEffect earns its keep

*Building the logic of a memory game with useState and useEffect · ~110 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

A game today: eight cards face down, flip two, and if they match they stay up. It is the best possible excuse for the thing we are actually here for — **`useEffect` with a dependency array**, watching a piece of state and reacting when it changes.

You are **starting from a project that already exists**: copy `starter/memory-game` out of the class repo. The board and the 3D card flip are already built, so class is spent on the part that is actually hard — the rules of the game.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [Start from the starter](#step-1)
2. [How the flip works (five minutes, no typing)](#step-2)
3. [Shuffle and deal](#step-3)
4. [Flip on click, not on hover](#step-4)
5. [choiceOne and choiceTwo](#step-5)
6. [Compare them — and watch it fail](#step-6)
7. [useEffect, with a dependency array that changes](#step-7)
8. [Matched cards stay up](#step-8)
9. [Counting turns](#step-9)
10. [Stop the cheating](#step-10)
11. [In-class exercise: the win state](#step-11)
12. [The win state, together](#step-12)
13. [Where to take it](#step-13)

---

<a id="step-1"></a>

## Step 1 — Start from the starter

Today you are handed a project instead of scaffolding one. `git pull`, copy `starter/memory-game` into your homework repo, `npm install`, and run it.

What you get: a board of four cards that flip when you hover them. What you do not get: a second copy of each card, a shuffle, or any notion of a match. That is the class.

Read the three files before we touch anything. `App.jsx` is a heading and a `Grid`. `Grid.jsx` maps over four images. `Card.jsx` shows one card, and it does not know the rules — it still will not when we are finished.

```bash
cd ~/your-hw-repo
cp -R ~/path-to-class-repo/Week05/starter/memory-game ./week05-memory-game
cd week05-memory-game
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

/* the whole trick: turn the card half way round.
   For now that happens on hover -- in class we move it onto a click. */
.card:hover .inner {
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
import styles from './Card.module.css'
import CardPattern from '../assets/moroccan-flower-dark.png'

// The card knows how one card LOOKS. It does not know the rules of the game,
// and by the end of class it still will not.
const Card = (props) => {
  const {card} = props

  return (
    <div className={styles.card}>
      <div className={styles.inner}>
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
import Card from './Card'
import Bilbo from '../assets/bilbo-baggins.png'
import Cameron from '../assets/cameron-poe.png'
import Nikki from '../assets/nikki-cage.png'
import Pollux from '../assets/pollux-troy.png'

// Four images. A real game needs eight cards -- two of each -- in a random
// order, which is the first thing we do in class.
const cardImages = [{src: Bilbo}, {src: Cameron}, {src: Nikki}, {src: Pollux}]

const Grid = () => {
  return (
    <div className="grid grid-cols-4 gap-4 max-w-3xl">
      {cardImages.map((card) => (
        <Card key={card.src} card={card} />
      ))}
    </div>
  )
}

export default Grid
```

---

<a id="step-2"></a>

## Step 2 — How the flip works (five minutes, no typing)

Worth understanding, not worth typing. Three properties do all of it:

- **`perspective`** on the outer element gives the 3D space some depth. Without it the card squashes instead of turning
- **`transform-style: preserve-3d`** on the thing that rotates, so its two faces keep their own place in that space
- **`backface-visibility: hidden`** on both faces, so whichever one is pointing away from you disappears

The back face starts pre-rotated 180°, which is why it is facing you once the card turns.

And notice what the file is: **`Card.module.css`** — a CSS module. Vite rewrites every class in it to a unique name, so nothing in this file can collide with anything else. You import it as an object: `styles.card`, `styles.inner`.

---

<a id="step-3"></a>

## Step 3 — Shuffle and deal

The deck goes into **state**, because the board has to change when somebody clicks New Game.

Three lines of array work, worth reading slowly:

- `[...cardImages, ...cardImages]` — the spread operator, twice, for eight cards out of four images
- `.sort(() => Math.random() - 0.5)` — `sort` calls the function for pairs of items; negative leaves them, positive swaps them, so randomness shuffles
- `.map((card) => ({...card, id: crypto.randomUUID()}))` — copy each card, add a unique id

Why the id? There are **two of every image** now, so `src` no longer tells the copies apart, and `key` has to be unique. `crypto.randomUUID()` is built into the browser.

**`src/components/Grid.jsx`**

What changed:

```diff
@@ -1,2 +1,3 @@
+import {useState} from 'react'
 import Card from './Card'
 import Bilbo from '../assets/bilbo-baggins.png'
@@ -5,15 +6,38 @@
 import Pollux from '../assets/pollux-troy.png'
 
-// Four images. A real game needs eight cards -- two of each -- in a random
-// order, which is the first thing we do in class.
 const cardImages = [{src: Bilbo}, {src: Cameron}, {src: Nikki}, {src: Pollux}]
 
 const Grid = () => {
+  // the deck lives in state, because the board has to change when somebody
+  // clicks New Game
+  const [cards, setCards] = useState([])
+
+  const shuffleCards = () => {
+    const shuffled = [...cardImages, ...cardImages]
+      // sort calls this for pairs of items. A negative number leaves them
+      // alone, a positive number swaps them -- so a random one shuffles.
+      .sort(() => Math.random() - 0.5)
+      // every card needs its own id: there are two of each image now, so
+      // `src` no longer tells the two copies apart
+      .map((card) => ({...card, id: crypto.randomUUID()}))
+
+    setCards(shuffled)
+  }
+
   return (
-    <div className="grid grid-cols-4 gap-4 max-w-3xl">
-      {cardImages.map((card) => (
-        <Card key={card.src} card={card} />
-      ))}
-    </div>
+    <>
+      <button
+        onClick={shuffleCards}
+        className="bg-blue-900 text-white uppercase px-8 py-4 rounded-lg mb-6"
+      >
+        New Game
+      </button>
+
+      <div className="grid grid-cols-4 gap-4 max-w-3xl">
+        {cards.map((card) => (
+          <Card key={card.id} card={card} />
+        ))}
+      </div>
+    </>
   )
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
          <Card key={card.id} card={card} />
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

## Step 4 — Flip on click, not on hover

Hover was scaffolding. A card flips when somebody **clicks** it — and, the important part, the card does not get to decide.

Ask the question you have been asked every week: *whose business is it whether this card is face up?* Not the card's. The Grid needs to know, because two cards have to be compared with each other.

So the CSS stops using `:hover` and gets a plain `.flipped` class, and `Card` takes two props: `flipped`, which it displays, and `handleChoice`, which it calls. Value down, event up — the same shape as the Dropdown and the SearchBar.

`cx(styles.inner, {[styles.flipped]: flipped})` is classnames: always apply `inner`, apply `flipped` only when the prop is true. The square brackets are there because the key is a variable.

**`src/components/Card.module.css`**

What changed:

```diff
@@ -32,7 +32,7 @@
 }
 
-/* the whole trick: turn the card half way round.
-   For now that happens on hover -- in class we move it onto a click. */
-.card:hover .inner {
+/* the whole trick: turn the card half way round. The class is applied by
+   Card.jsx now, from a prop -- the CSS does not decide anything. */
+.flipped {
   transform: rotateY(180deg);
 }
```

<details>
<summary>Full file after this step</summary>

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

</details>

**`src/components/Card.jsx`**

What changed:

```diff
@@ -1,13 +1,22 @@
+import cx from 'classnames'
 import styles from './Card.module.css'
 import CardPattern from '../assets/moroccan-flower-dark.png'
 
-// The card knows how one card LOOKS. It does not know the rules of the game,
-// and by the end of class it still will not.
 const Card = (props) => {
-  const {card} = props
+  const {card, handleChoice, flipped} = props
+
+  const handleClick = () => {
+    // the Card does not decide whether it is flipped. It reports the click
+    // and lets the Grid decide -- the same trade as every component since
+    // the Accordion.
+    handleChoice(card)
+  }
 
   return (
     <div className={styles.card}>
-      <div className={styles.inner}>
+      <div
+        onClick={handleClick}
+        className={cx(styles.inner, {[styles.flipped]: flipped})}
+      >
         <div className={styles.front}>
           <img src={CardPattern} alt="" />
```

<details>
<summary>Full file after this step</summary>

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

</details>

---

<a id="step-5"></a>

## Step 5 — choiceOne and choiceTwo

Two more pieces of state, and a one-line handler:

```
choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
```

*Do we already have a first choice? Then this is the second. Otherwise it is the first.*

A card is face up if it is either choice, which is what the `flipped` prop now says. Click two cards and they both turn over.

**`src/components/Grid.jsx`**

What changed:

```diff
@@ -12,4 +12,6 @@
   // clicks New Game
   const [cards, setCards] = useState([])
+  const [choiceOne, setChoiceOne] = useState(null)
+  const [choiceTwo, setChoiceTwo] = useState(null)
 
   const shuffleCards = () => {
@@ -25,4 +27,9 @@
   }
 
+  const handleChoice = (card) => {
+    // no choice yet? this is choice one. Otherwise it is choice two.
+    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
+  }
+
   return (
     <>
@@ -36,5 +43,10 @@
       <div className="grid grid-cols-4 gap-4 max-w-3xl">
         {cards.map((card) => (
-          <Card key={card.id} card={card} />
+          <Card
+            key={card.id}
+            card={card}
+            handleChoice={handleChoice}
+            flipped={card === choiceOne || card === choiceTwo}
+          />
         ))}
       </div>
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

</details>

---

<a id="step-6"></a>

## Step 6 — Compare them — and watch it fail

We have two choices. Compare them right here in the handler, where they are.

Click two cards. Read the console.

It logs **nothing** on the turn you would expect it, and then logs the *previous* turn's cards on the next click. The comparison is always one turn behind.

Why: `setChoiceTwo(card)` does not change `choiceTwo` on the next line. It **queues** an update, React re-renders, and the new value exists in the *next* run of this function. The `choiceOne` and `choiceTwo` inside this handler are the values from the render that created it, and they are frozen.

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

<a id="step-7"></a>

## Step 7 — useEffect, with a dependency array that changes

The comparison does not belong in the click. It belongs *after the render in which the choices changed* — which is exactly what `useEffect` with a dependency array is.

```
useEffect(() => { ... }, [choiceOne, choiceTwo])
```

Read it as: **after any render where choiceOne or choiceTwo changed, run this.** By then the new values really are in state, so the comparison is correct.

You have seen `[]` (run once, on mount) and you have seen a cleanup function. This is the third form, and the one you will reach for most.

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

<a id="step-8"></a>

## Step 8 — Matched cards stay up

When the images match, every card with that `src` gets a new property: `matched: true`. Then `flipped` becomes *is it a current choice **or** is it matched*.

Two things here are the real content:

- **the updater form.** `setCards((prevCards) => ...)` — React hands you the current value and you return the new one. Use it any time the next value is built from the previous one, for the same reason the last step existed
- **never edit state directly.** `prevCards.map()` builds a *new* array and `{...card, matched: true}` builds a *new* card. Push into the old array and React will not re-render, because as far as it can tell nothing changed

And a `setTimeout` on the mismatch, because without it the cards flip back before anyone has seen the second one. The animation is 0.6 seconds; the comparison takes microseconds.

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

<a id="step-9"></a>

## Step 9 — Counting turns

One more piece of state and the updater form again: `setTurns((prevTurns) => prevTurns + 1)` in `resetTurn`, so every completed pair counts as one turn, match or not.

New Game sets it back to zero.

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

<a id="step-10"></a>

## Step 10 — Stop the cheating

Three bugs left, and they are all the same bug: the board accepts clicks it should not.

- click the same card twice and it becomes both choices, and matches itself
- click a third card during the 1.2 second wait and the game gets confused
- click a matched card and it joins in again

One `disabled` piece of state, set when two cards are up and cleared in `resetTurn`, plus two more conditions in `handleChoice`. A **guard clause** at the top of a handler — `if (bad) return` — is a very normal shape, and it keeps the real logic underneath from growing an extra layer of nesting.

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

<a id="step-11"></a>

## Step 11 — In-class exercise: the win state

Ten minutes, on your own. When every card is matched, say so on screen.

Three questions to answer before you write anything:

1. **What changes** when the last pair is matched?
2. So **which piece of state** does the check need to watch?
3. What stops it declaring a win on an **empty board**, before anyone has clicked New Game?

The check itself is one line of array work. `.every()` takes a function and returns true only if it is true for every item.

And when they win — what should New Game do about it?

---

<a id="step-12"></a>

## Step 12 — The win state, together

A **second effect**, watching a **different** piece of state. `cards` changes when a pair is matched, so `[cards]` is when this needs to check.

```
cards.every((card) => card.matched)
```

`cards.length > 0` keeps it from declaring a win on the empty board — an empty array passes `.every()`, which is technically correct and completely useless.

Two effects, two different dependency arrays, each watching the thing it actually cares about. That is the shape of every React app you will write.

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

<a id="step-13"></a>

## Step 13 — Where to take it

Working game. Things worth adding, in order of how much you will learn from them:

- **your own images.** Four squares of anything. It is your portfolio, not mine
- **a best score**, kept across games in the same session
- **more cards**, without rewriting anything but the array — if you have to change more than one line, something is too hard-coded
- **a sound, or a bit of motion** on a match

Your homework is the first two. The rest is yours.

---

**Where we landed:** a real game — shuffle, flip, match, count turns, no clicking through the animation, and a win state.

**The three things to keep:**

- **state updates are queued.** `setChoiceTwo(card)` does not change `choiceTwo` on the next line. If you need to react to a new value, that is what `useEffect` is for
- **`useEffect(fn, [a, b])`** runs after a render in which `a` or `b` changed — the form you will use most often for the rest of the course
- **the updater form**, `setCards((prev) => ...)`, whenever the next value is built from the previous one

**Homework:** see [HW.md](HW.md).

Next week: your midterm project, and the checklist for it.
