# Week 2_2 — Scoped styles, and our first piece of state

*CSS Modules, then making the card respond to clicks · ~75 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

Two things today.

First, **CSS Modules** — a way to write CSS that can't accidentally collide with someone else's. Quick, and it fixes a problem you'll definitely hit on a bigger project.

Then **state**, which is the point of React. Up to now our card has been static: data in, markup out. By the end of today it responds to clicks, and you'll have written the pattern you'll use every single week for the rest of the semester.

We pick up exactly where the last class ended. If your project is in a strange state, copy `starter/` and start from there — it's the finished code from last class.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [Pick up where we left off](#step-1)
2. [The problem with global CSS](#step-2)
3. [Rename the stylesheet, import it as an object](#step-3)
4. [Look at what it generated](#step-4)
5. [Change one variable, change everything](#step-5)
6. [What we're building, and what state is](#step-6)
7. [useState](#step-7)
8. [Hearts instead of a number](#step-8)
9. [It goes to eleven (and to minus four)](#step-9)
10. [Stop the jumping](#step-10)

---

<a id="step-1"></a>

## Step 1 — Pick up where we left off

Your recipe card from last class. If yours is in a mess, copy `starter/recipe-card` — it's exactly the finished code from last time.

Quick recap before we touch anything: where does the recipe content live, and how does it get from there into `IngredientsList`?

```bash
cd ~/your-hw-repo/recipe-card
npm run dev
```

---

<a id="step-2"></a>

## Step 2 — The problem with global CSS

Every class name we've written is **global**. `.card`, `.list_item`, `.list_title` — they live in one big namespace shared by the whole app.

Right now that's fine; we have one component tree and one stylesheet. But imagine we add a `UserProfile` component and its designer also wants a `.card`. One of them silently wins, and which one depends on stylesheet order.

The usual fix is long defensive names — `.recipe-card__list-item--compact`. **CSS Modules** does it for you instead.

---

<a id="step-3"></a>

## Step 3 — Rename the stylesheet, import it as an object

Two moves:

1. Rename `styles.css` to **`RecipeCard.module.css`**. The `.module.css` part is the signal — Vite handles it with no config.
2. Import it as a **variable** instead of for its side effect:

```js
import './styles.css'                        // before
import styles from './RecipeCard.module.css' // after
```

`styles` is a plain JavaScript object mapping your class names to generated unique ones. So `className="card"` becomes `className={styles.card}` — curly braces again, because it's a JavaScript value now.

**The CSS file's contents don't change at all.** Only the name and how we reference it.

**Renamed:** `src/components/RecipeCard/styles.css` → `src/components/RecipeCard/RecipeCard.module.css` *(contents unchanged)*

**`src/components/RecipeCard/Card.jsx`**

What changed:

```diff
@@ -1,10 +1,7 @@
-import './styles.css'
+import styles from './RecipeCard.module.css'
 
-// `children` is a prop we get for free. It is whatever we put between
-// the opening and closing <Card> tags.
-// Hmm. This looks like a reusable UI component... hold that thought.
 export default function Card(props) {
   const {children} = props
-  return <div className="card">{children}</div>
+  return <div className={styles.card}>{children}</div>
 }
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import styles from './RecipeCard.module.css'

export default function Card(props) {
  const {children} = props
  return <div className={styles.card}>{children}</div>
}
```

</details>

**`src/components/RecipeCard/RecipeImg.jsx`**

What changed:

```diff
@@ -1,6 +1,6 @@
-import './styles.css'
+import styles from './RecipeCard.module.css'
 
 export default function RecipeImg(props) {
-  return <img src={props.imgSrc} alt="buttermilk pancakes" className="img" />
+  return <img src={props.imgSrc} alt="buttermilk pancakes" className={styles.img} />
 }
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import styles from './RecipeCard.module.css'

export default function RecipeImg(props) {
  return <img src={props.imgSrc} alt="buttermilk pancakes" className={styles.img} />
}
```

</details>

**`src/components/RecipeCard/RecipeInfo.jsx`**

What changed:

```diff
@@ -1,11 +1,10 @@
-import './styles.css'
+import styles from './RecipeCard.module.css'
 
 export default function RecipeInfo(props) {
-  // destructuring: pull title and description off the props object
   const {title, description} = props
 
   return (
-    <div className="recipe_info">
-      <h2 className="recipe_title">{title}</h2>
+    <div className={styles.recipe_info}>
+      <h2 className={styles.recipe_title}>{title}</h2>
       <p>{description}</p>
     </div>
```

<details>
<summary>Full file after this step</summary>

```jsx
import styles from './RecipeCard.module.css'

export default function RecipeInfo(props) {
  const {title, description} = props

  return (
    <div className={styles.recipe_info}>
      <h2 className={styles.recipe_title}>{title}</h2>
      <p>{description}</p>
    </div>
  )
}
```

</details>

**`src/components/RecipeCard/IngredientsList.jsx`**

What changed:

```diff
@@ -1,3 +1,3 @@
-import './styles.css'
+import styles from './RecipeCard.module.css'
 
 export default function IngredientsList(props) {
@@ -5,12 +5,10 @@
 
   return (
-    <div className="ingredients_list">
-      <h3 className="list_title">Ingredients</h3>
+    <div className={styles.ingredients_list}>
+      <h3 className={styles.list_title}>Ingredients</h3>
       <ul>
-        {/* map turns an array of data into an array of JSX.
-            Every item in a mapped list needs a unique `key`. */}
         {ingredients.map((i, index) => (
-          <li key={index} className="list_item">
-            <span className="measure">{i.measure}</span>
+          <li key={index} className={styles.list_item}>
+            <span className={styles.measure}>{i.measure}</span>
             <span>{i.item}</span>
           </li>
```

<details>
<summary>Full file after this step</summary>

```jsx
import styles from './RecipeCard.module.css'

export default function IngredientsList(props) {
  const {ingredients} = props

  return (
    <div className={styles.ingredients_list}>
      <h3 className={styles.list_title}>Ingredients</h3>
      <ul>
        {ingredients.map((i, index) => (
          <li key={index} className={styles.list_item}>
            <span className={styles.measure}>{i.measure}</span>
            <span>{i.item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

</details>

**`src/components/RecipeCard/InstructionsList.jsx`**

What changed:

```diff
@@ -1,3 +1,3 @@
-import './styles.css'
+import styles from './RecipeCard.module.css'
 
 export default function InstructionsList(props) {
@@ -5,6 +5,6 @@
 
   return (
-    <div className="instructions_list">
-      <h3 className="list_title">Instructions</h3>
+    <div className={styles.instructions_list}>
+      <h3 className={styles.list_title}>Instructions</h3>
       <ol>
         {instructions.map((i, index) => (
```

<details>
<summary>Full file after this step</summary>

```jsx
import styles from './RecipeCard.module.css'

export default function InstructionsList(props) {
  const {instructions} = props

  return (
    <div className={styles.instructions_list}>
      <h3 className={styles.list_title}>Instructions</h3>
      <ol>
        {instructions.map((i, index) => (
          <li key={index}>{i}</li>
        ))}
      </ol>
    </div>
  )
}
```

</details>

**`src/components/RecipeCard/index.jsx`**

What changed:

```diff
@@ -1,5 +1,3 @@
-// A named export needs the exact name and curly braces.
 import {RECIPE} from './recipe-data'
-// These are all default exports, so we can name them whatever we like.
 import Card from './Card'
 import RecipeImg from './RecipeImg'
@@ -7,5 +5,8 @@
 import IngredientsList from './IngredientsList'
 import InstructionsList from './InstructionsList'
-import './styles.css'
+// CSS Modules: rename the file to *.module.css and import it as an object.
+// `styles` is a plain JS object of { originalClassName: uniqueGeneratedName }.
+// Vite supports this out of the box -- no config, same as create-react-app did.
+import styles from './RecipeCard.module.css'
 
 export default function RecipeCard() {
@@ -13,7 +14,7 @@
     <Card>
       <RecipeImg imgSrc={RECIPE.imgSrc} />
-      <div className="card_text">
+      <div className={styles.card_text}>
         <RecipeInfo title={RECIPE.title} description={RECIPE.description} />
-        <div className="card_lists">
+        <div className={styles.card_lists}>
           <IngredientsList ingredients={RECIPE.ingredients} />
           <InstructionsList instructions={RECIPE.instructions} />
```

<details>
<summary>Full file after this step</summary>

```jsx
import {RECIPE} from './recipe-data'
import Card from './Card'
import RecipeImg from './RecipeImg'
import RecipeInfo from './RecipeInfo'
import IngredientsList from './IngredientsList'
import InstructionsList from './InstructionsList'
// CSS Modules: rename the file to *.module.css and import it as an object.
// `styles` is a plain JS object of { originalClassName: uniqueGeneratedName }.
// Vite supports this out of the box -- no config, same as create-react-app did.
import styles from './RecipeCard.module.css'

export default function RecipeCard() {
  return (
    <Card>
      <RecipeImg imgSrc={RECIPE.imgSrc} />
      <div className={styles.card_text}>
        <RecipeInfo title={RECIPE.title} description={RECIPE.description} />
        <div className={styles.card_lists}>
          <IngredientsList ingredients={RECIPE.ingredients} />
          <InstructionsList instructions={RECIPE.instructions} />
        </div>
      </div>
    </Card>
  )
}
```

</details>

---

<a id="step-4"></a>

## Step 4 — Look at what it generated

Open your browser devtools and inspect the card. Your `.card` class has become something like `_card_1x9k2_1`.

That's the whole feature. The name is generated per file, so two components can both write `.card` and never collide. You keep short readable names in your stylesheet; the bundler guarantees they're unique.

Now go back and re-add that hotpink `.card` rule in a *different* module and watch nothing happen.

---

<a id="step-5"></a>

## Step 5 — Change one variable, change everything

While we're in the stylesheet: `global.css` defines `--c-blue` and `--ff-acme` on `:root`, and the module uses them with `var(--c-blue)`.

CSS variables are **not** scoped by CSS Modules — that's deliberate. Scoped class names, shared design tokens. That combination is roughly what every design system does.

Change `--c-blue` in `global.css` and watch every blue thing on the card update at once.

---

<a id="step-6"></a>

## Step 6 — What we're building, and what state is

A rating widget: `[-]`, some hearts, `[+]`. Click plus, a heart appears. Maximum five, minimum zero.

**State is data that changes while the app is running, and that the screen depends on.** When it changes, React re-renders the component that owns it — not the page, just that component.

Before writing anything, answer three questions:

- **What changes on screen?** The number of hearts.
- **So what do we store?** A number. Call it `count`.
- **What does the user do?** Clicks two buttons. Those are **event handlers**, not state.

Things that change → state. Things the user does → handlers.

---

<a id="step-7"></a>

## Step 7 — useState

`useState` is a **hook** — a function React gives us to plug into its machinery. It returns an array of exactly two things, which we destructure:

```js
const [count, setCount] = useState(0)
//     ↑ current value   ↑ how to change it   ↑ starting value
```

Rules worth writing down: hooks go at the **top** of the component, never inside an `if` or a loop. And you never assign to `count` directly — `count = 5` does nothing. Always `setCount`.

Render the number first, before any hearts.

**`src/components/RecipeCard/UserRating.jsx`**  — new file

```jsx
import {useState} from 'react'

import styles from './RecipeCard.module.css'

export default function UserRating() {
  // useState defines a piece of state and gives us back
  //   [ the current value, a function to change it ]
  // The argument is the starting value.
  const [count, setCount] = useState(0)

  const handlePlusClick = () => {
    setCount(count + 1)
  }

  const handleMinusClick = () => {
    setCount(count - 1)
  }

  return (
    <div className={styles.rating}>
      <button onClick={handleMinusClick} className={styles.rating_btn}>
        [-]
      </button>
      <span className={styles.hearts}>{count}</span>
      <button onClick={handlePlusClick} className={styles.rating_btn}>
        [+]
      </button>
    </div>
  )
}
```

**`src/components/RecipeCard/RecipeCard.module.css`**

What changed:

```diff
@@ -81,2 +81,24 @@
 }
 
+/* --- user rating --------------------------------------------------------- */
+.rating {
+  display: flex;
+  align-items: center;
+  margin: 1rem 0 0 1.5rem;
+}
+
+.rating_btn {
+  cursor: pointer;
+  border: none;
+  background: none;
+  font-size: 1rem;
+  font-family: inherit;
+}
+
+.hearts {
+  display: inline-flex;
+  align-items: center;
+  gap: 0.25rem;
+  color: var(--c-blue);
+}
+
```

<details>
<summary>Full file after this step</summary>

```css
.card {
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 1rem;
  max-width: 40%;
  margin: 1rem;
}

.img {
  width: 25%;
  height: auto;
}

.card_text {
  display: flex;
  flex-direction: column;
}

.card_lists {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 1.5rem;
}

.recipe_info {
  margin-left: 1.5rem;
}

.recipe_title,
.list_title {
  font-family: var(--ff-acme);
  font-weight: 400;
}

.recipe_title {
  margin: 1rem;
  font-size: 2.5rem;
  border-bottom: 0.25rem solid var(--c-blue);
}

.list_title {
  margin: 0.5rem 0;
  font-size: 1.625rem;
  color: var(--c-blue);
}

.ingredients_list {
  width: 40%;
}

.ingredients_list ul {
  list-style-type: none;
  padding-left: 0;
}

.list_item {
  display: flex;
  margin-bottom: 0.75rem;
}

.list_item span {
  display: block;
}

.list_item .measure {
  width: 25%;
  margin-right: 2rem;
}

.instructions_list {
  width: 50%;
}

.instructions_list ol {
  padding-left: 1.25rem;
}

/* --- user rating --------------------------------------------------------- */
.rating {
  display: flex;
  align-items: center;
  margin: 1rem 0 0 1.5rem;
}

.rating_btn {
  cursor: pointer;
  border: none;
  background: none;
  font-size: 1rem;
  font-family: inherit;
}

.hearts {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--c-blue);
}
```

</details>

**`src/components/RecipeCard/index.jsx`**

What changed:

```diff
@@ -5,4 +5,5 @@
 import IngredientsList from './IngredientsList'
 import InstructionsList from './InstructionsList'
+import UserRating from './UserRating'
 // CSS Modules: rename the file to *.module.css and import it as an object.
 // `styles` is a plain JS object of { originalClassName: uniqueGeneratedName }.
@@ -20,4 +21,5 @@
           <InstructionsList instructions={RECIPE.instructions} />
         </div>
+        <UserRating />
       </div>
     </Card>
```

<details>
<summary>Full file after this step</summary>

```jsx
import {RECIPE} from './recipe-data'
import Card from './Card'
import RecipeImg from './RecipeImg'
import RecipeInfo from './RecipeInfo'
import IngredientsList from './IngredientsList'
import InstructionsList from './InstructionsList'
import UserRating from './UserRating'
// CSS Modules: rename the file to *.module.css and import it as an object.
// `styles` is a plain JS object of { originalClassName: uniqueGeneratedName }.
// Vite supports this out of the box -- no config, same as create-react-app did.
import styles from './RecipeCard.module.css'

export default function RecipeCard() {
  return (
    <Card>
      <RecipeImg imgSrc={RECIPE.imgSrc} />
      <div className={styles.card_text}>
        <RecipeInfo title={RECIPE.title} description={RECIPE.description} />
        <div className={styles.card_lists}>
          <IngredientsList ingredients={RECIPE.ingredients} />
          <InstructionsList instructions={RECIPE.instructions} />
        </div>
        <UserRating />
      </div>
    </Card>
  )
}
```

</details>

---

<a id="step-8"></a>

## Step 8 — Hearts instead of a number

`react-icons` bundles most of the big icon sets and gives them all the same API. One install, thousands of icons.

To draw `count` hearts we need something to `map` over — but we only have a number. `[...Array(3)]` gives us an array of three empty slots, which is enough:

```js
Array(3)       // [ <3 empty slots> ]  -- map skips these
[...Array(3)]  // [undefined, undefined, undefined]  -- map works
```

Same `map` and same `key` rule as the ingredients list.

```bash
npm install react-icons
```

**`src/components/RecipeCard/UserRating.jsx`**

What changed:

```diff
@@ -1,3 +1,12 @@
 import {useState} from 'react'
+// react-icons bundles a pile of icon sets and makes them all work the same way.
+// Install:  npm install react-icons
+//
+// NOTE: the create-react-app version of this file used
+//   import {ReactComponent as Heart} from '@material-design-icons/svg/filled/favorite.svg'
+// That `ReactComponent as` syntax is a create-react-app feature and does not
+// exist in Vite. react-icons is simpler and is the same library we use in
+// week 4, so it is one thing to learn instead of two.
+import {FaHeart} from 'react-icons/fa'
 
 import styles from './RecipeCard.module.css'
@@ -22,5 +31,15 @@
         [-]
       </button>
-      <span className={styles.hearts}>{count}</span>
+
+      <span className={styles.hearts}>
+        {/* [...Array(count)] makes an array of `count` empty slots
+            so we have something to map over. */}
+        {[...Array(count)].map((heart, i) => (
+          <span key={i}>
+            <FaHeart />
+          </span>
+        ))}
+      </span>
+
       <button onClick={handlePlusClick} className={styles.rating_btn}>
         [+]
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
// react-icons bundles a pile of icon sets and makes them all work the same way.
// Install:  npm install react-icons
//
// NOTE: the create-react-app version of this file used
//   import {ReactComponent as Heart} from '@material-design-icons/svg/filled/favorite.svg'
// That `ReactComponent as` syntax is a create-react-app feature and does not
// exist in Vite. react-icons is simpler and is the same library we use in
// week 4, so it is one thing to learn instead of two.
import {FaHeart} from 'react-icons/fa'

import styles from './RecipeCard.module.css'

export default function UserRating() {
  // useState defines a piece of state and gives us back
  //   [ the current value, a function to change it ]
  // The argument is the starting value.
  const [count, setCount] = useState(0)

  const handlePlusClick = () => {
    setCount(count + 1)
  }

  const handleMinusClick = () => {
    setCount(count - 1)
  }

  return (
    <div className={styles.rating}>
      <button onClick={handleMinusClick} className={styles.rating_btn}>
        [-]
      </button>

      <span className={styles.hearts}>
        {/* [...Array(count)] makes an array of `count` empty slots
            so we have something to map over. */}
        {[...Array(count)].map((heart, i) => (
          <span key={i}>
            <FaHeart />
          </span>
        ))}
      </span>

      <button onClick={handlePlusClick} className={styles.rating_btn}>
        [+]
      </button>
    </div>
  )
}
```

</details>

---

<a id="step-9"></a>

## Step 9 — It goes to eleven (and to minus four)

Click `[+]` eight times. Click `[-]` past zero. Nothing stops you — a rating of −4 hearts is not a thing.

You could guard inside the handlers with an `if`. We're going to do something better: **don't render a button that shouldn't be clickable.**

`condition && <thing />` renders the thing when the condition is true, and nothing when it's false — because React renders nothing for `false`, `null` and `undefined`.

The guard and the UI become the same line of code.

**`src/components/RecipeCard/UserRating.jsx`**

What changed:

```diff
@@ -28,7 +28,12 @@
   return (
     <div className={styles.rating}>
-      <button onClick={handleMinusClick} className={styles.rating_btn}>
-        [-]
-      </button>
+      {/* Conditional rendering with &&:
+          React renders nothing for false, null and undefined, so
+          `count > 0 && <button/>` shows the button only when count > 0. */}
+      {count > 0 && (
+        <button onClick={handleMinusClick} className={styles.rating_btn}>
+          [-]
+        </button>
+      )}
 
       <span className={styles.hearts}>
@@ -42,7 +47,9 @@
       </span>
 
-      <button onClick={handlePlusClick} className={styles.rating_btn}>
-        [+]
-      </button>
+      {count < 5 && (
+        <button onClick={handlePlusClick} className={styles.rating_btn}>
+          [+]
+        </button>
+      )}
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
// react-icons bundles a pile of icon sets and makes them all work the same way.
// Install:  npm install react-icons
//
// NOTE: the create-react-app version of this file used
//   import {ReactComponent as Heart} from '@material-design-icons/svg/filled/favorite.svg'
// That `ReactComponent as` syntax is a create-react-app feature and does not
// exist in Vite. react-icons is simpler and is the same library we use in
// week 4, so it is one thing to learn instead of two.
import {FaHeart} from 'react-icons/fa'

import styles from './RecipeCard.module.css'

export default function UserRating() {
  // useState defines a piece of state and gives us back
  //   [ the current value, a function to change it ]
  // The argument is the starting value.
  const [count, setCount] = useState(0)

  const handlePlusClick = () => {
    setCount(count + 1)
  }

  const handleMinusClick = () => {
    setCount(count - 1)
  }

  return (
    <div className={styles.rating}>
      {/* Conditional rendering with &&:
          React renders nothing for false, null and undefined, so
          `count > 0 && <button/>` shows the button only when count > 0. */}
      {count > 0 && (
        <button onClick={handleMinusClick} className={styles.rating_btn}>
          [-]
        </button>
      )}

      <span className={styles.hearts}>
        {/* [...Array(count)] makes an array of `count` empty slots
            so we have something to map over. */}
        {[...Array(count)].map((heart, i) => (
          <span key={i}>
            <FaHeart />
          </span>
        ))}
      </span>

      {count < 5 && (
        <button onClick={handlePlusClick} className={styles.rating_btn}>
          [+]
        </button>
      )}
    </div>
  )
}
```

</details>

---

<a id="step-10"></a>

## Step 10 — Stop the jumping

It works, but watch the hearts jump sideways when a button appears or disappears. Removing an element from the layout moves everything after it.

This is a CSS problem, not a React one: **reserve the space**. Wrap each button in a fixed-width slot that stays in the layout whether or not it has a button inside, and give the hearts a minimum size so the row doesn't collapse at zero.

Small thing. It's the difference between a demo and something that feels finished.

**`src/components/RecipeCard/RecipeCard.module.css`**

What changed:

```diff
@@ -88,4 +88,12 @@
 }
 
+/* Reserving the width means the hearts do not jump sideways
+   when a button hides itself. */
+.rating_btn_slot {
+  display: inline-block;
+  width: 2.5rem;
+  text-align: center;
+}
+
 .rating_btn {
   cursor: pointer;
@@ -100,4 +108,6 @@
   align-items: center;
   gap: 0.25rem;
+  min-height: 1.25rem;
+  min-width: 7rem;
   color: var(--c-blue);
 }
```

<details>
<summary>Full file after this step</summary>

```css
.card {
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 1rem;
  max-width: 40%;
  margin: 1rem;
}

.img {
  width: 25%;
  height: auto;
}

.card_text {
  display: flex;
  flex-direction: column;
}

.card_lists {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 1.5rem;
}

.recipe_info {
  margin-left: 1.5rem;
}

.recipe_title,
.list_title {
  font-family: var(--ff-acme);
  font-weight: 400;
}

.recipe_title {
  margin: 1rem;
  font-size: 2.5rem;
  border-bottom: 0.25rem solid var(--c-blue);
}

.list_title {
  margin: 0.5rem 0;
  font-size: 1.625rem;
  color: var(--c-blue);
}

.ingredients_list {
  width: 40%;
}

.ingredients_list ul {
  list-style-type: none;
  padding-left: 0;
}

.list_item {
  display: flex;
  margin-bottom: 0.75rem;
}

.list_item span {
  display: block;
}

.list_item .measure {
  width: 25%;
  margin-right: 2rem;
}

.instructions_list {
  width: 50%;
}

.instructions_list ol {
  padding-left: 1.25rem;
}

/* --- user rating --------------------------------------------------------- */
.rating {
  display: flex;
  align-items: center;
  margin: 1rem 0 0 1.5rem;
}

/* Reserving the width means the hearts do not jump sideways
   when a button hides itself. */
.rating_btn_slot {
  display: inline-block;
  width: 2.5rem;
  text-align: center;
}

.rating_btn {
  cursor: pointer;
  border: none;
  background: none;
  font-size: 1rem;
  font-family: inherit;
}

.hearts {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  min-height: 1.25rem;
  min-width: 7rem;
  color: var(--c-blue);
}
```

</details>

**`src/components/RecipeCard/UserRating.jsx`**

What changed:

```diff
@@ -31,9 +31,11 @@
           React renders nothing for false, null and undefined, so
           `count > 0 && <button/>` shows the button only when count > 0. */}
-      {count > 0 && (
-        <button onClick={handleMinusClick} className={styles.rating_btn}>
-          [-]
-        </button>
-      )}
+      <span className={styles.rating_btn_slot}>
+        {count > 0 && (
+          <button onClick={handleMinusClick} className={styles.rating_btn}>
+            [-]
+          </button>
+        )}
+      </span>
 
       <span className={styles.hearts}>
@@ -47,9 +49,11 @@
       </span>
 
-      {count < 5 && (
-        <button onClick={handlePlusClick} className={styles.rating_btn}>
-          [+]
-        </button>
-      )}
+      <span className={styles.rating_btn_slot}>
+        {count < 5 && (
+          <button onClick={handlePlusClick} className={styles.rating_btn}>
+            [+]
+          </button>
+        )}
+      </span>
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {useState} from 'react'
// react-icons bundles a pile of icon sets and makes them all work the same way.
// Install:  npm install react-icons
//
// NOTE: the create-react-app version of this file used
//   import {ReactComponent as Heart} from '@material-design-icons/svg/filled/favorite.svg'
// That `ReactComponent as` syntax is a create-react-app feature and does not
// exist in Vite. react-icons is simpler and is the same library we use in
// week 4, so it is one thing to learn instead of two.
import {FaHeart} from 'react-icons/fa'

import styles from './RecipeCard.module.css'

export default function UserRating() {
  // useState defines a piece of state and gives us back
  //   [ the current value, a function to change it ]
  // The argument is the starting value.
  const [count, setCount] = useState(0)

  const handlePlusClick = () => {
    setCount(count + 1)
  }

  const handleMinusClick = () => {
    setCount(count - 1)
  }

  return (
    <div className={styles.rating}>
      {/* Conditional rendering with &&:
          React renders nothing for false, null and undefined, so
          `count > 0 && <button/>` shows the button only when count > 0. */}
      <span className={styles.rating_btn_slot}>
        {count > 0 && (
          <button onClick={handleMinusClick} className={styles.rating_btn}>
            [-]
          </button>
        )}
      </span>

      <span className={styles.hearts}>
        {/* [...Array(count)] makes an array of `count` empty slots
            so we have something to map over. */}
        {[...Array(count)].map((heart, i) => (
          <span key={i}>
            <FaHeart />
          </span>
        ))}
      </span>

      <span className={styles.rating_btn_slot}>
        {count < 5 && (
          <button onClick={handlePlusClick} className={styles.rating_btn}>
            [+]
          </button>
        )}
      </span>
    </div>
  )
}
```

</details>

---

**Where we landed:** styles that can't collide, and a card that responds to the person using it.

The shape you just learned — *a piece of state, a handler that changes it, and JSX that reads it* — is the shape of every interactive thing you will build from here. Accordions, dropdowns, modals, forms, the whole final project. It doesn't get more complicated than this; it just gets bigger.

**Homework:** style your own recipe card properly, using CSS Modules and the variables in `global.css`. Then add one more piece of state of your own — a show/hide toggle for the instructions, a 'made this' checkbox, anything that changes when clicked.
