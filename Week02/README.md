# Week 02 — HTML to JSX, and Componentisation

*Your recipe card becomes a React app, then gets broken into components · ~75 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

Today your homework becomes a React app — and then we take it apart into small reusable pieces.

Bring the HTML recipe card you wrote. You'll be converting **your own file**, so your screen won't look identical to mine, and that's fine. The steps below are the shape; your recipe is the content.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [New project, cleared out](#step-1)
2. [Make a RecipeCard component and use it](#step-2)
3. [Paste the homework in and convert it to JSX](#step-3)
4. [Fix the image: import it](#step-4)
5. [Separate the content from the markup](#step-5)
6. [Render the title, description and image from data](#step-6)
7. [map() the ingredients](#step-7)
8. [Now you do the instructions](#step-8)
9. [Extract InstructionsList, and meet props](#step-9)
10. [Destructure the props](#step-10)
11. [Your turn: extract the other three](#step-11)
12. [One more: Card, and the children prop](#step-12)
13. [Hang some CSS on it](#step-13)

---

<a id="step-1"></a>

## Step 1 — New project, cleared out

Same three commands as last week, new project name. We are doing it from scratch again on purpose — you should be able to start a React project without looking it up.

Then set up `main.jsx` and `global.css` exactly like last week, and drop the pancake image into `src/assets/`.

```bash
npm create vite@latest recipe-card -- --template react
cd recipe-card
npm install
rm src/App.css src/index.css
npm run dev
```

**`src/main.jsx`**  — new file

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './global.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**`src/global.css`**  — new file

```css
@import url('https://fonts.googleapis.com/css2?family=Acme&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');

body {
  font-family: 'Open Sans', sans-serif;
  background-color: #f4f4f4;
}

/* CSS custom properties (variables). Defined once, used everywhere. */
:root {
  --c-blue: #48b2ff;
  --ff-acme: 'Acme', sans-serif;
}
```

**`src/App.jsx`**  — new file

```jsx
function App() {
  return <div>Hello App!</div>
}

export default App
```

---

<a id="step-2"></a>

## Step 2 — Make a RecipeCard component and use it

`App` is going to stay almost empty all semester — it is the front door, not the house. Everything real goes in a component.

The folder is `components/RecipeCard/` and the file inside is `index.jsx`. When a folder has an `index` file, you can import the **folder** and it finds it: `'./components/RecipeCard'`, no filename needed.

**`src/App.jsx`**

What changed:

```diff
@@ -1,4 +1,6 @@
+import RecipeCard from './components/RecipeCard'
+
 function App() {
-  return <div>Hello App!</div>
+  return <RecipeCard />
 }
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import RecipeCard from './components/RecipeCard'

function App() {
  return <RecipeCard />
}

export default App
```

</details>

**`src/components/RecipeCard/index.jsx`**  — new file

```jsx
export default function RecipeCard() {
  return <div>My recipe card goes here.</div>
}
```

---

<a id="step-3"></a>

## Step 3 — Paste the homework in and convert it to JSX

Open your homework HTML, copy everything inside `<body>`, and paste it in. It will break. Fix it together:

- `class` becomes **`className`** (`class` is a reserved word in JS)
- every tag closes — `<img>` becomes `<img />`, `<br>` becomes `<br />`
- `for` becomes `htmlFor`
- one parent element, same rule as last week
- `style="color: red"` becomes `style={{color: 'red'}}` — an object, not a string

**`src/components/RecipeCard/index.jsx`**

What changed:

```diff
@@ -1,4 +1,25 @@
 export default function RecipeCard() {
-  return <div>My recipe card goes here.</div>
+  return (
+    <div>
+      <img src="pancake.jpg" alt="buttermilk pancakes" />
+      <h2>Buttermilk Pancakes</h2>
+      <p>
+        Some sort of lovely description about the best buttermilk
+        pancakes in the world.
+      </p>
+      <h3>Ingredients</h3>
+      <ul>
+        <li>3/4 cup Melted butter</li>
+        <li>2 tbsp Whole milk</li>
+        <li>1 Egg</li>
+      </ul>
+      <h3>Instructions</h3>
+      <ol>
+        <li>Melt butter</li>
+        <li>Beat lightly: milk, butter, egg</li>
+        <li>Mix</li>
+      </ol>
+    </div>
+  )
 }
 
```

<details>
<summary>Full file after this step</summary>

```jsx
export default function RecipeCard() {
  return (
    <div>
      <img src="pancake.jpg" alt="buttermilk pancakes" />
      <h2>Buttermilk Pancakes</h2>
      <p>
        Some sort of lovely description about the best buttermilk
        pancakes in the world.
      </p>
      <h3>Ingredients</h3>
      <ul>
        <li>3/4 cup Melted butter</li>
        <li>2 tbsp Whole milk</li>
        <li>1 Egg</li>
      </ul>
      <h3>Instructions</h3>
      <ol>
        <li>Melt butter</li>
        <li>Beat lightly: milk, butter, egg</li>
        <li>Mix</li>
      </ol>
    </div>
  )
}
```

</details>

---

<a id="step-4"></a>

## Step 4 — Fix the image: import it

`src="pancake.jpg"` doesn't work, because the browser looks for that file at the url — and there's nothing there. Images are **imported**, like any other module. What comes back is a url string that Vite manages for you.

If you find a tutorial that says `require('./pancake.jpg')`, that's the old create-react-app way. `require` doesn't exist here.

**`src/components/RecipeCard/index.jsx`**

What changed:

```diff
@@ -1,6 +1,9 @@
+// Images get imported. What comes back is a url string.
+import PANCAKE from '../../assets/pancake.jpg'
+
 export default function RecipeCard() {
   return (
     <div>
-      <img src="pancake.jpg" alt="buttermilk pancakes" />
+      <img src={PANCAKE} alt="buttermilk pancakes" />
       <h2>Buttermilk Pancakes</h2>
       <p>
```

<details>
<summary>Full file after this step</summary>

```jsx
// Images get imported. What comes back is a url string.
import PANCAKE from '../../assets/pancake.jpg'

export default function RecipeCard() {
  return (
    <div>
      <img src={PANCAKE} alt="buttermilk pancakes" />
      <h2>Buttermilk Pancakes</h2>
      <p>
        Some sort of lovely description about the best buttermilk
        pancakes in the world.
      </p>
      <h3>Ingredients</h3>
      <ul>
        <li>3/4 cup Melted butter</li>
        <li>2 tbsp Whole milk</li>
        <li>1 Egg</li>
      </ul>
      <h3>Instructions</h3>
      <ol>
        <li>Melt butter</li>
        <li>Beat lightly: milk, butter, egg</li>
        <li>Mix</li>
      </ol>
    </div>
  )
}
```

</details>

---

<a id="step-5"></a>

## Step 5 — Separate the content from the markup

Right now the recipe is *welded* to the layout. If we wanted a second recipe we'd copy the whole component.

So: pull the content out into a plain JavaScript object in its own file. This is a **named** export — note the `export const`, which is why it gets imported with curly braces in a moment.

**`src/components/RecipeCard/recipe-data.js`**  — new file

```js
// Importing the image gives us back a url string that Vite knows how to
// serve in dev and how to fingerprint at build time.
// NOTE: the old create-react-app version of this file used
//   imgSrc: require('../../assets/pancake.jpg')
// require() does not exist in a Vite project. Always use import.
import PANCAKE from '../../assets/pancake.jpg'

export const RECIPE = {
  title: 'Buttermilk Pancakes',
  imgSrc: PANCAKE,
  description:
    'Some sort of lovely description about the best buttermilk pancakes in the world.',
  ingredients: [
    {measure: '3/4 cup', item: 'Melted butter'},
    {measure: '2 tbsp', item: 'Whole milk'},
    {measure: '1', item: 'Egg'},
    {measure: '3/4 cup', item: 'All purpose flour'},
    {measure: '2 tsp', item: 'Baking powder'},
    {measure: '2 tbsp', item: 'Sugar'},
    {measure: '1/2 tsp', item: 'Salt'},
  ],
  instructions: [
    'Melt butter',
    'Beat lightly: milk, butter, egg',
    'Add: flour, baking powder, sugar, salt',
    'Mix',
    'Melt a little butter in the pan',
    'Drop batter by tablespoon into the pan',
    'Turn pancakes over when the top is full of little holes and the base is golden',
  ],
}
```

---

<a id="step-6"></a>

## Step 6 — Render the title, description and image from data

`import {RECIPE}` — **with** curly braces, because it was a named export. Default exports (our components) don't take braces; named ones do. This is the single most common import error you will hit.

Now every hardcoded string that lives in the data gets replaced by `{RECIPE.something}`.

**`src/components/RecipeCard/index.jsx`**

What changed:

```diff
@@ -1,14 +1,11 @@
-// Images get imported. What comes back is a url string.
-import PANCAKE from '../../assets/pancake.jpg'
+// A NAMED export needs the exact name and curly braces.
+import {RECIPE} from './recipe-data'
 
 export default function RecipeCard() {
   return (
     <div>
-      <img src={PANCAKE} alt="buttermilk pancakes" />
-      <h2>Buttermilk Pancakes</h2>
-      <p>
-        Some sort of lovely description about the best buttermilk
-        pancakes in the world.
-      </p>
+      <img src={RECIPE.imgSrc} alt="buttermilk pancakes" />
+      <h2>{RECIPE.title}</h2>
+      <p>{RECIPE.description}</p>
       <h3>Ingredients</h3>
       <ul>
```

<details>
<summary>Full file after this step</summary>

```jsx
// A NAMED export needs the exact name and curly braces.
import {RECIPE} from './recipe-data'

export default function RecipeCard() {
  return (
    <div>
      <img src={RECIPE.imgSrc} alt="buttermilk pancakes" />
      <h2>{RECIPE.title}</h2>
      <p>{RECIPE.description}</p>
      <h3>Ingredients</h3>
      <ul>
        <li>3/4 cup Melted butter</li>
        <li>2 tbsp Whole milk</li>
        <li>1 Egg</li>
      </ul>
      <h3>Instructions</h3>
      <ol>
        <li>Melt butter</li>
        <li>Beat lightly: milk, butter, egg</li>
        <li>Mix</li>
      </ol>
    </div>
  )
}
```

</details>

---

<a id="step-7"></a>

## Step 7 — map() the ingredients

This is the one. `.map()` takes an array of data and gives back an array of JSX — and React knows how to render an array.

Every mapped item needs a **`key`**, so React can tell which item is which when the list changes. Using the index is fine for a list that never reorders. Leave it out and React will tell you off in the console.

**`src/components/RecipeCard/index.jsx`**

What changed:

```diff
@@ -10,7 +10,12 @@
       <h3>Ingredients</h3>
       <ul>
-        <li>3/4 cup Melted butter</li>
-        <li>2 tbsp Whole milk</li>
-        <li>1 Egg</li>
+        {/* map: an array of data becomes an array of JSX.
+            Every item needs a unique key. */}
+        {RECIPE.ingredients.map((i, index) => (
+          <li key={index}>
+            <span>{i.measure}</span>
+            <span>{i.item}</span>
+          </li>
+        ))}
       </ul>
       <h3>Instructions</h3>
```

<details>
<summary>Full file after this step</summary>

```jsx
// A NAMED export needs the exact name and curly braces.
import {RECIPE} from './recipe-data'

export default function RecipeCard() {
  return (
    <div>
      <img src={RECIPE.imgSrc} alt="buttermilk pancakes" />
      <h2>{RECIPE.title}</h2>
      <p>{RECIPE.description}</p>
      <h3>Ingredients</h3>
      <ul>
        {/* map: an array of data becomes an array of JSX.
            Every item needs a unique key. */}
        {RECIPE.ingredients.map((i, index) => (
          <li key={index}>
            <span>{i.measure}</span>
            <span>{i.item}</span>
          </li>
        ))}
      </ul>
      <h3>Instructions</h3>
      <ol>
        <li>Melt butter</li>
        <li>Beat lightly: milk, butter, egg</li>
        <li>Mix</li>
      </ol>
    </div>
  )
}
```

</details>

---

<a id="step-8"></a>

## Step 8 — Now you do the instructions

Same move, simpler data — instructions are just strings, so there's no `.measure` or `.item`, only the item itself.

Give it a go before you look at mine.

**`src/components/RecipeCard/index.jsx`**

What changed:

```diff
@@ -21,7 +21,7 @@
       <h3>Instructions</h3>
       <ol>
-        <li>Melt butter</li>
-        <li>Beat lightly: milk, butter, egg</li>
-        <li>Mix</li>
+        {RECIPE.instructions.map((i, index) => (
+          <li key={index}>{i}</li>
+        ))}
       </ol>
     </div>
```

<details>
<summary>Full file after this step</summary>

```jsx
// A NAMED export needs the exact name and curly braces.
import {RECIPE} from './recipe-data'

export default function RecipeCard() {
  return (
    <div>
      <img src={RECIPE.imgSrc} alt="buttermilk pancakes" />
      <h2>{RECIPE.title}</h2>
      <p>{RECIPE.description}</p>
      <h3>Ingredients</h3>
      <ul>
        {/* map: an array of data becomes an array of JSX.
            Every item needs a unique key. */}
        {RECIPE.ingredients.map((i, index) => (
          <li key={index}>
            <span>{i.measure}</span>
            <span>{i.item}</span>
          </li>
        ))}
      </ul>
      <h3>Instructions</h3>
      <ol>
        {RECIPE.instructions.map((i, index) => (
          <li key={index}>{i}</li>
        ))}
      </ol>
    </div>
  )
}
```

</details>

---

<a id="step-9"></a>

## Step 9 — Extract InstructionsList, and meet props

Our one component is doing five jobs. Time to break it up — and the moment we do, the new component needs a way to receive the data.

That's **props**. We hand data down from parent to child as attributes: `<InstructionsList instructions={RECIPE.instructions} />`. Inside the child, everything arrives in one object called `props`.

Props go **one way**: down. A child can never change what its parent gave it.

**`src/components/RecipeCard/InstructionsList.jsx`**  — new file

```jsx
// Everything the parent passes in arrives in one object: props.
export default function InstructionsList(props) {
  return (
    <div>
      <h3>Instructions</h3>
      <ol>
        {props.instructions.map((i, index) => (
          <li key={index}>{i}</li>
        ))}
      </ol>
    </div>
  )
}
```

**`src/components/RecipeCard/index.jsx`**

What changed:

```diff
@@ -1,4 +1,6 @@
 // A NAMED export needs the exact name and curly braces.
 import {RECIPE} from './recipe-data'
+// A DEFAULT export: no braces, and we can call it what we like.
+import InstructionsList from './InstructionsList'
 
 export default function RecipeCard() {
@@ -19,10 +21,5 @@
         ))}
       </ul>
-      <h3>Instructions</h3>
-      <ol>
-        {RECIPE.instructions.map((i, index) => (
-          <li key={index}>{i}</li>
-        ))}
-      </ol>
+      <InstructionsList instructions={RECIPE.instructions} />
     </div>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
// A NAMED export needs the exact name and curly braces.
import {RECIPE} from './recipe-data'
// A DEFAULT export: no braces, and we can call it what we like.
import InstructionsList from './InstructionsList'

export default function RecipeCard() {
  return (
    <div>
      <img src={RECIPE.imgSrc} alt="buttermilk pancakes" />
      <h2>{RECIPE.title}</h2>
      <p>{RECIPE.description}</p>
      <h3>Ingredients</h3>
      <ul>
        {/* map: an array of data becomes an array of JSX.
            Every item needs a unique key. */}
        {RECIPE.ingredients.map((i, index) => (
          <li key={index}>
            <span>{i.measure}</span>
            <span>{i.item}</span>
          </li>
        ))}
      </ul>
      <InstructionsList instructions={RECIPE.instructions} />
    </div>
  )
}
```

</details>

---

<a id="step-10"></a>

## Step 10 — Destructure the props

`props.instructions` works fine, but once a component takes four or five props it gets noisy. Pull them off the object at the top instead — exactly the destructuring from the day-1 warm-up.

This is a style choice, not a rule. But it's the style you'll see in every codebase you land in, so we'll use it from here on.

**`src/components/RecipeCard/InstructionsList.jsx`**

What changed:

```diff
@@ -1,9 +1,11 @@
-// Everything the parent passes in arrives in one object: props.
 export default function InstructionsList(props) {
+  // destructuring: pull instructions off the props object
+  const {instructions} = props
+
   return (
     <div>
       <h3>Instructions</h3>
       <ol>
-        {props.instructions.map((i, index) => (
+        {instructions.map((i, index) => (
           <li key={index}>{i}</li>
         ))}
```

<details>
<summary>Full file after this step</summary>

```jsx
export default function InstructionsList(props) {
  // destructuring: pull instructions off the props object
  const {instructions} = props

  return (
    <div>
      <h3>Instructions</h3>
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

---

<a id="step-11"></a>

## Step 11 — Your turn: extract the other three

Same move, three more times. `IngredientsList`, `RecipeInfo` (title + description) and `RecipeImg`.

Work out for each one: what does it need from the parent? That's its props.

**`src/components/RecipeCard/IngredientsList.jsx`**  — new file

```jsx
export default function IngredientsList(props) {
  const {ingredients} = props

  return (
    <div>
      <h3>Ingredients</h3>
      <ul>
        {ingredients.map((i, index) => (
          <li key={index}>
            <span>{i.measure}</span>
            <span>{i.item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

**`src/components/RecipeCard/RecipeInfo.jsx`**  — new file

```jsx
export default function RecipeInfo(props) {
  // destructuring: pull title and description off the props object
  const {title, description} = props

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}
```

**`src/components/RecipeCard/RecipeImg.jsx`**  — new file

```jsx
export default function RecipeImg(props) {
  return <img src={props.imgSrc} alt="buttermilk pancakes" />
}
```

**`src/components/RecipeCard/index.jsx`**

What changed:

```diff
@@ -1,5 +1,8 @@
 // A NAMED export needs the exact name and curly braces.
 import {RECIPE} from './recipe-data'
-// A DEFAULT export: no braces, and we can call it what we like.
+// These are all default exports, so we can name them whatever we like.
+import RecipeImg from './RecipeImg'
+import RecipeInfo from './RecipeInfo'
+import IngredientsList from './IngredientsList'
 import InstructionsList from './InstructionsList'
 
@@ -7,18 +10,7 @@
   return (
     <div>
-      <img src={RECIPE.imgSrc} alt="buttermilk pancakes" />
-      <h2>{RECIPE.title}</h2>
-      <p>{RECIPE.description}</p>
-      <h3>Ingredients</h3>
-      <ul>
-        {/* map: an array of data becomes an array of JSX.
-            Every item needs a unique key. */}
-        {RECIPE.ingredients.map((i, index) => (
-          <li key={index}>
-            <span>{i.measure}</span>
-            <span>{i.item}</span>
-          </li>
-        ))}
-      </ul>
+      <RecipeImg imgSrc={RECIPE.imgSrc} />
+      <RecipeInfo title={RECIPE.title} description={RECIPE.description} />
+      <IngredientsList ingredients={RECIPE.ingredients} />
       <InstructionsList instructions={RECIPE.instructions} />
     </div>
```

<details>
<summary>Full file after this step</summary>

```jsx
// A NAMED export needs the exact name and curly braces.
import {RECIPE} from './recipe-data'
// These are all default exports, so we can name them whatever we like.
import RecipeImg from './RecipeImg'
import RecipeInfo from './RecipeInfo'
import IngredientsList from './IngredientsList'
import InstructionsList from './InstructionsList'

export default function RecipeCard() {
  return (
    <div>
      <RecipeImg imgSrc={RECIPE.imgSrc} />
      <RecipeInfo title={RECIPE.title} description={RECIPE.description} />
      <IngredientsList ingredients={RECIPE.ingredients} />
      <InstructionsList instructions={RECIPE.instructions} />
    </div>
  )
}
```

</details>

---

<a id="step-12"></a>

## Step 12 — One more: Card, and the children prop

The outer `<div>` is really 'a white box with rounded corners and a shadow'. That's not recipe-specific at all — it's a **Card**, and every website has one.

But it doesn't take data, it takes *other components*. That's what **`children`** is: a prop you get for free, holding whatever sits between the opening and closing tags.

**`src/components/RecipeCard/Card.jsx`**  — new file

```jsx
// `children` is a prop we get for free. It is whatever we put between
// the opening and closing <Card> tags.
// Hmm. This looks like a reusable UI component... hold that thought.
export default function Card(props) {
  const {children} = props
  return <div className="card">{children}</div>
}
```

**`src/components/RecipeCard/index.jsx`**

What changed:

```diff
@@ -1,5 +1,6 @@
-// A NAMED export needs the exact name and curly braces.
+// A named export needs the exact name and curly braces.
 import {RECIPE} from './recipe-data'
 // These are all default exports, so we can name them whatever we like.
+import Card from './Card'
 import RecipeImg from './RecipeImg'
 import RecipeInfo from './RecipeInfo'
@@ -9,10 +10,14 @@
 export default function RecipeCard() {
   return (
-    <div>
+    <Card>
       <RecipeImg imgSrc={RECIPE.imgSrc} />
-      <RecipeInfo title={RECIPE.title} description={RECIPE.description} />
-      <IngredientsList ingredients={RECIPE.ingredients} />
-      <InstructionsList instructions={RECIPE.instructions} />
-    </div>
+      <div className="card_text">
+        <RecipeInfo title={RECIPE.title} description={RECIPE.description} />
+        <div className="card_lists">
+          <IngredientsList ingredients={RECIPE.ingredients} />
+          <InstructionsList instructions={RECIPE.instructions} />
+        </div>
+      </div>
+    </Card>
   )
 }
```

<details>
<summary>Full file after this step</summary>

```jsx
// A named export needs the exact name and curly braces.
import {RECIPE} from './recipe-data'
// These are all default exports, so we can name them whatever we like.
import Card from './Card'
import RecipeImg from './RecipeImg'
import RecipeInfo from './RecipeInfo'
import IngredientsList from './IngredientsList'
import InstructionsList from './InstructionsList'

export default function RecipeCard() {
  return (
    <Card>
      <RecipeImg imgSrc={RECIPE.imgSrc} />
      <div className="card_text">
        <RecipeInfo title={RECIPE.title} description={RECIPE.description} />
        <div className="card_lists">
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

<a id="step-13"></a>

## Step 13 — Hang some CSS on it

Last thing: a stylesheet and the class names to hook it up. Plain CSS for now — imported straight into the component files.

Notice `styles.css` uses `var(--c-blue)` and `var(--ff-acme)` from `global.css`. Change the variable in one place, everything follows. Next week we scope this properly with CSS Modules.

**`src/components/RecipeCard/styles.css`**  — new file

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
```

**`src/components/RecipeCard/index.jsx`**

What changed:

```diff
@@ -7,4 +7,5 @@
 import IngredientsList from './IngredientsList'
 import InstructionsList from './InstructionsList'
+import './styles.css'
 
 export default function RecipeCard() {
```

<details>
<summary>Full file after this step</summary>

```jsx
// A named export needs the exact name and curly braces.
import {RECIPE} from './recipe-data'
// These are all default exports, so we can name them whatever we like.
import Card from './Card'
import RecipeImg from './RecipeImg'
import RecipeInfo from './RecipeInfo'
import IngredientsList from './IngredientsList'
import InstructionsList from './InstructionsList'
import './styles.css'

export default function RecipeCard() {
  return (
    <Card>
      <RecipeImg imgSrc={RECIPE.imgSrc} />
      <div className="card_text">
        <RecipeInfo title={RECIPE.title} description={RECIPE.description} />
        <div className="card_lists">
          <IngredientsList ingredients={RECIPE.ingredients} />
          <InstructionsList instructions={RECIPE.instructions} />
        </div>
      </div>
    </Card>
  )
}
```

</details>

**`src/components/RecipeCard/Card.jsx`**

What changed:

```diff
@@ -1,2 +1,4 @@
+import './styles.css'
+
 // `children` is a prop we get for free. It is whatever we put between
 // the opening and closing <Card> tags.
```

<details>
<summary>Full file after this step</summary>

```jsx
import './styles.css'

// `children` is a prop we get for free. It is whatever we put between
// the opening and closing <Card> tags.
// Hmm. This looks like a reusable UI component... hold that thought.
export default function Card(props) {
  const {children} = props
  return <div className="card">{children}</div>
}
```

</details>

**`src/components/RecipeCard/RecipeImg.jsx`**

What changed:

```diff
@@ -1,4 +1,6 @@
+import './styles.css'
+
 export default function RecipeImg(props) {
-  return <img src={props.imgSrc} alt="buttermilk pancakes" />
+  return <img src={props.imgSrc} alt="buttermilk pancakes" className="img" />
 }
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import './styles.css'

export default function RecipeImg(props) {
  return <img src={props.imgSrc} alt="buttermilk pancakes" className="img" />
}
```

</details>

**`src/components/RecipeCard/RecipeInfo.jsx`**

What changed:

```diff
@@ -1,2 +1,4 @@
+import './styles.css'
+
 export default function RecipeInfo(props) {
   // destructuring: pull title and description off the props object
@@ -4,6 +6,6 @@
 
   return (
-    <div>
-      <h2>{title}</h2>
+    <div className="recipe_info">
+      <h2 className="recipe_title">{title}</h2>
       <p>{description}</p>
     </div>
```

<details>
<summary>Full file after this step</summary>

```jsx
import './styles.css'

export default function RecipeInfo(props) {
  // destructuring: pull title and description off the props object
  const {title, description} = props

  return (
    <div className="recipe_info">
      <h2 className="recipe_title">{title}</h2>
      <p>{description}</p>
    </div>
  )
}
```

</details>

**`src/components/RecipeCard/IngredientsList.jsx`**

What changed:

```diff
@@ -1,12 +1,16 @@
+import './styles.css'
+
 export default function IngredientsList(props) {
   const {ingredients} = props
 
   return (
-    <div>
-      <h3>Ingredients</h3>
+    <div className="ingredients_list">
+      <h3 className="list_title">Ingredients</h3>
       <ul>
+        {/* map turns an array of data into an array of JSX.
+            Every item in a mapped list needs a unique `key`. */}
         {ingredients.map((i, index) => (
-          <li key={index}>
-            <span>{i.measure}</span>
+          <li key={index} className="list_item">
+            <span className="measure">{i.measure}</span>
             <span>{i.item}</span>
           </li>
```

<details>
<summary>Full file after this step</summary>

```jsx
import './styles.css'

export default function IngredientsList(props) {
  const {ingredients} = props

  return (
    <div className="ingredients_list">
      <h3 className="list_title">Ingredients</h3>
      <ul>
        {/* map turns an array of data into an array of JSX.
            Every item in a mapped list needs a unique `key`. */}
        {ingredients.map((i, index) => (
          <li key={index} className="list_item">
            <span className="measure">{i.measure}</span>
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
@@ -1,9 +1,10 @@
+import './styles.css'
+
 export default function InstructionsList(props) {
-  // destructuring: pull instructions off the props object
   const {instructions} = props
 
   return (
-    <div>
-      <h3>Instructions</h3>
+    <div className="instructions_list">
+      <h3 className="list_title">Instructions</h3>
       <ol>
         {instructions.map((i, index) => (
```

<details>
<summary>Full file after this step</summary>

```jsx
import './styles.css'

export default function InstructionsList(props) {
  const {instructions} = props

  return (
    <div className="instructions_list">
      <h3 className="list_title">Instructions</h3>
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

---

**Where we landed:** one giant hardcoded component became six small ones, all fed from a single data file. Changing the recipe now means editing `recipe-data.js` and nothing else.

Worth sitting with: what would it take to render a *second* recipe? That's where we pick up next week.

**Homework:** style your own card. As you write the CSS, think about which values would want to be variables across a whole cookbook site.
