# Week 04 — The Button Component

*Building a Button you'd actually want to use twice · ~90 min of live coding*

> **Following along at home?** Work through the steps in order. Each step shows what changed, and the full file underneath it. If you get lost, the finished code is in `end-of-class/`.

Today we build the first component of a real component library: a `Button` with colour variants, outline and pill styles, icons, and every event handler a plain `<button>` supports.

Three small libraries show up along the way. Each one arrives because we hit a problem it solves — so if you're wondering why we're installing something, the answer is always in the step before it.

Stuck? Read the error first, then [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

---

## Steps

1. [Start from the starter](#step-1)
2. [Why not just use <button>?](#step-2)
3. [Variants as boolean props](#step-3)
4. [classnames: conditional classes without the mess](#step-4)
5. [Modifiers: rounded and outline](#step-5)
6. [tailwind-merge: settling the fight](#step-6)
7. [What if somebody passes two variants?](#step-7)
8. [onClick is broken (and so is everything else)](#step-8)
9. […but now className collides](#step-9)
10. [Icons, and one global rule](#step-10)
11. [Tidy the demo page](#step-11)

---

<a id="step-1"></a>

## Step 1 — Start from the starter

Copy `starter/comp-lib` out of the class repo into your own folder, then install and run. Don't work inside the class repo — you'll get merge conflicts next time you pull.

Tailwind is already wired up in `vite.config.js` and `src/index.css`. Two things to notice, because every tutorial you find online will be out of date:

- Tailwind v4 is a **Vite plugin**. There is no `tailwind.config.js` and no `postcss.config.js`.
- One `@import 'tailwindcss'` replaces the old `@tailwind base/components/utilities` trio, and theme values live in CSS in an `@theme` block.

```bash
cp -R starter/comp-lib ~/your-hw-repo/
cd ~/your-hw-repo/comp-lib
npm install
npm run dev
```

**`src/index.css`**  — new file

```css
/* Tailwind v4: one import replaces the old
     @tailwind base; @tailwind components; @tailwind utilities;
   trio, and there is no tailwind.config.js to fill in. */
@import 'tailwindcss';

/* Theme values are declared in CSS now instead of a JS config file.
   Anything you put here becomes a utility class. */
@theme {
  --color-brand: #48b2ff;
}
```

**`src/main.jsx`**  — new file

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**`src/App.jsx`**  — new file

```jsx
import ButtonPage from './pages/ButtonPage'

const App = () => {
  return (
    <div className="container mx-auto mt-4">
      <ButtonPage />
    </div>
  )
}

export default App
```

**`src/components/Button.jsx`**  — new file

```jsx
// TODO (in class): build this up together.
const Button = (props) => {
  const {children} = props
  return <button className="px-8 py-3 border">{children}</button>
}

export default Button
```

**`src/pages/ButtonPage.jsx`**  — new file

```jsx
import Button from '../components/Button'

const ButtonPage = () => {
  return (
    <>
      <h1 className="text-3xl mb-4">Button Page!</h1>
      <Button>Buy Now</Button>
    </>
  )
}

export default ButtonPage
```

---

<a id="step-2"></a>

## Step 2 — Why not just use <button>?

Before we write anything: put three buttons on the page with different colours, using plain Tailwind classes on plain `<button>` elements.

It works. So why are we here? Because on a real team, that `bg-blue-500` gets typed by fourteen people in forty places, half of them pick `bg-blue-600` by accident, and when the brand colour changes somebody spends a day with find-and-replace.

A component library is one answer to that: **make the decision once, in one file.**

**`src/pages/ButtonPage.jsx`**

What changed:

```diff
@@ -5,5 +5,15 @@
     <>
       <h1 className="text-3xl mb-4">Button Page!</h1>
-      <Button>Buy Now</Button>
+
+      {/* the version we are NOT going to keep */}
+      <button className="px-8 py-3 border bg-blue-500 border-blue-500 text-white">
+        Buy Now
+      </button>
+      <button className="px-8 py-3 border bg-green-500 border-green-500 text-white">
+        Success
+      </button>
+      <button className="px-8 py-3 border bg-red-600 border-red-600 text-white">
+        Delete
+      </button>
     </>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import Button from '../components/Button'

const ButtonPage = () => {
  return (
    <>
      <h1 className="text-3xl mb-4">Button Page!</h1>

      {/* the version we are NOT going to keep */}
      <button className="px-8 py-3 border bg-blue-500 border-blue-500 text-white">
        Buy Now
      </button>
      <button className="px-8 py-3 border bg-green-500 border-green-500 text-white">
        Success
      </button>
      <button className="px-8 py-3 border bg-red-600 border-red-600 text-white">
        Delete
      </button>
    </>
  )
}

export default ButtonPage
```

</details>

---

<a id="step-3"></a>

## Step 3 — Variants as boolean props

How should somebody *ask* for a blue button? Not by passing `color="blue"` — blue is a colour, not a meaning. They ask for `primary`, `danger`, `success`. The component decides what those look like.

In JSX a bare attribute is shorthand for `={true}`, so `<Button primary>` passes `primary: true`.

First pass: do it the obvious ugly way, with string building. It works, and it's about to get unmanageable.

**`src/components/Button.jsx`**

What changed:

```diff
@@ -1,6 +1,12 @@
-// TODO (in class): build this up together.
 const Button = (props) => {
-  const {children} = props
-  return <button className="px-8 py-3 border">{children}</button>
+  const {children, primary, success, danger} = props
+
+  // The obvious way. Watch how badly this scales.
+  let classes = 'px-8 py-3 border '
+  if (primary) classes += 'bg-blue-500 border-blue-500 text-white'
+  if (success) classes += 'bg-green-500 border-green-500 text-white'
+  if (danger) classes += 'bg-red-600 border-red-600 text-white'
+
+  return <button className={classes}>{children}</button>
 }
 
```

<details>
<summary>Full file after this step</summary>

```jsx
const Button = (props) => {
  const {children, primary, success, danger} = props

  // The obvious way. Watch how badly this scales.
  let classes = 'px-8 py-3 border '
  if (primary) classes += 'bg-blue-500 border-blue-500 text-white'
  if (success) classes += 'bg-green-500 border-green-500 text-white'
  if (danger) classes += 'bg-red-600 border-red-600 text-white'

  return <button className={classes}>{children}</button>
}

export default Button
```

</details>

**`src/pages/ButtonPage.jsx`**

What changed:

```diff
@@ -5,15 +5,7 @@
     <>
       <h1 className="text-3xl mb-4">Button Page!</h1>
-
-      {/* the version we are NOT going to keep */}
-      <button className="px-8 py-3 border bg-blue-500 border-blue-500 text-white">
-        Buy Now
-      </button>
-      <button className="px-8 py-3 border bg-green-500 border-green-500 text-white">
-        Success
-      </button>
-      <button className="px-8 py-3 border bg-red-600 border-red-600 text-white">
-        Delete
-      </button>
+      <Button primary>Buy Now</Button>
+      <Button success>Success</Button>
+      <Button danger>Delete</Button>
     </>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import Button from '../components/Button'

const ButtonPage = () => {
  return (
    <>
      <h1 className="text-3xl mb-4">Button Page!</h1>
      <Button primary>Buy Now</Button>
      <Button success>Success</Button>
      <Button danger>Delete</Button>
    </>
  )
}

export default ButtonPage
```

</details>

---

<a id="step-4"></a>

## Step 4 — classnames: conditional classes without the mess

`classnames` (imported as `cx` by convention) takes an object of `'class name': condition` pairs and returns a string of the classes whose condition was truthy.

```js
cx('px-8', {'bg-blue-500': primary, 'bg-red-600': danger})
```

It also **ignores `undefined` and `null`**, which turns out to matter a lot later. Remember that.

```bash
npm install classnames
```

**`src/components/Button.jsx`**

What changed:

```diff
@@ -1,10 +1,15 @@
+import cx from 'classnames'
+
 const Button = (props) => {
-  const {children, primary, success, danger} = props
+  const {children, primary, secondary, success, warning, danger} = props
 
-  // The obvious way. Watch how badly this scales.
-  let classes = 'px-8 py-3 border '
-  if (primary) classes += 'bg-blue-500 border-blue-500 text-white'
-  if (success) classes += 'bg-green-500 border-green-500 text-white'
-  if (danger) classes += 'bg-red-600 border-red-600 text-white'
+  // For each key/value pair: apply the key if the value is truthy.
+  const classes = cx('px-8 py-3 border', {
+    'bg-blue-500 border-blue-500 text-white': primary,
+    'bg-gray-900 border-gray-900 text-white': secondary,
+    'bg-green-500 border-green-500 text-white': success,
+    'bg-orange-400 border-orange-500 text-white': warning,
+    'bg-red-600 border-red-600 text-white': danger,
+  })
 
   return <button className={classes}>{children}</button>
```

<details>
<summary>Full file after this step</summary>

```jsx
import cx from 'classnames'

const Button = (props) => {
  const {children, primary, secondary, success, warning, danger} = props

  // For each key/value pair: apply the key if the value is truthy.
  const classes = cx('px-8 py-3 border', {
    'bg-blue-500 border-blue-500 text-white': primary,
    'bg-gray-900 border-gray-900 text-white': secondary,
    'bg-green-500 border-green-500 text-white': success,
    'bg-orange-400 border-orange-500 text-white': warning,
    'bg-red-600 border-red-600 text-white': danger,
  })

  return <button className={classes}>{children}</button>
}

export default Button
```

</details>

---

<a id="step-5"></a>

## Step 5 — Modifiers: rounded and outline

Colour variants are mutually exclusive — you pick one. **Modifiers** are different: `rounded` and `outline` combine with any colour.

`outline` needs the text to take the variant's colour instead of white, so the conditions get compound: `outline && primary`.

Save this and look closely at the outline buttons. Something is wrong.

**`src/components/Button.jsx`**

What changed:

```diff
@@ -2,8 +2,17 @@
 
 const Button = (props) => {
-  const {children, primary, secondary, success, warning, danger} = props
+  const {
+    children,
+    primary,
+    secondary,
+    success,
+    warning,
+    danger,
+    rounded,
+    outline,
+  } = props
 
-  // For each key/value pair: apply the key if the value is truthy.
   const classes = cx('px-8 py-3 border', {
+    // colour variants -- pick one
     'bg-blue-500 border-blue-500 text-white': primary,
     'bg-gray-900 border-gray-900 text-white': secondary,
@@ -11,4 +20,12 @@
     'bg-orange-400 border-orange-500 text-white': warning,
     'bg-red-600 border-red-600 text-white': danger,
+    // modifiers -- combine with any colour
+    'rounded-full': rounded,
+    'bg-white': outline,
+    'text-blue-500': outline && primary,
+    'text-gray-900': outline && secondary,
+    'text-green-500': outline && success,
+    'text-orange-400': outline && warning,
+    'text-red-600': outline && danger,
   })
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import cx from 'classnames'

const Button = (props) => {
  const {
    children,
    primary,
    secondary,
    success,
    warning,
    danger,
    rounded,
    outline,
  } = props

  const classes = cx('px-8 py-3 border', {
    // colour variants -- pick one
    'bg-blue-500 border-blue-500 text-white': primary,
    'bg-gray-900 border-gray-900 text-white': secondary,
    'bg-green-500 border-green-500 text-white': success,
    'bg-orange-400 border-orange-500 text-white': warning,
    'bg-red-600 border-red-600 text-white': danger,
    // modifiers -- combine with any colour
    'rounded-full': rounded,
    'bg-white': outline,
    'text-blue-500': outline && primary,
    'text-gray-900': outline && secondary,
    'text-green-500': outline && success,
    'text-orange-400': outline && warning,
    'text-red-600': outline && danger,
  })

  return <button className={classes}>{children}</button>
}

export default Button
```

</details>

**`src/pages/ButtonPage.jsx`**

What changed:

```diff
@@ -6,6 +6,9 @@
       <h1 className="text-3xl mb-4">Button Page!</h1>
       <Button primary>Buy Now</Button>
-      <Button success>Success</Button>
+      <Button secondary rounded>Secondary Button</Button>
       <Button danger>Delete</Button>
+      {/* these two look broken -- why? */}
+      <Button warning outline rounded>Are you sure?</Button>
+      <Button success outline>Success</Button>
     </>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import Button from '../components/Button'

const ButtonPage = () => {
  return (
    <>
      <h1 className="text-3xl mb-4">Button Page!</h1>
      <Button primary>Buy Now</Button>
      <Button secondary rounded>Secondary Button</Button>
      <Button danger>Delete</Button>
      {/* these two look broken -- why? */}
      <Button warning outline rounded>Are you sure?</Button>
      <Button success outline>Success</Button>
    </>
  )
}

export default ButtonPage
```

</details>

---

<a id="step-6"></a>

## Step 6 — tailwind-merge: settling the fight

Our outline buttons get both `text-white` (from the colour variant) and `text-green-500` (from `outline && success`). Both are real classes in the stylesheet. Which wins is decided by **Tailwind's stylesheet order**, not ours — and we lose.

`tailwind-merge` understands Tailwind's class groups. Given two classes that set the same property, it keeps the **last** one and drops the other. Wrap the whole `cx(...)` in `twMerge(...)`.

```bash
npm install tailwind-merge
```

**`src/components/Button.jsx`**

What changed:

```diff
@@ -1,3 +1,7 @@
 import cx from 'classnames'
+// twMerge resolves conflicting tailwind classes -- the last one wins.
+// Without it, an outline button keeps the `text-white` from its
+// colour variant and you get white text on a white background.
+import {twMerge} from 'tailwind-merge'
 
 const Button = (props) => {
@@ -13,20 +17,24 @@
   } = props
 
-  const classes = cx('px-8 py-3 border', {
-    // colour variants -- pick one
-    'bg-blue-500 border-blue-500 text-white': primary,
-    'bg-gray-900 border-gray-900 text-white': secondary,
-    'bg-green-500 border-green-500 text-white': success,
-    'bg-orange-400 border-orange-500 text-white': warning,
-    'bg-red-600 border-red-600 text-white': danger,
-    // modifiers -- combine with any colour
-    'rounded-full': rounded,
-    'bg-white': outline,
-    'text-blue-500': outline && primary,
-    'text-gray-900': outline && secondary,
-    'text-green-500': outline && success,
-    'text-orange-400': outline && warning,
-    'text-red-600': outline && danger,
-  })
+  const baseClass = 'flex items-center px-8 py-3 border'
+
+  const classes = twMerge(
+    cx(baseClass, {
+      // colour variants -- pick one
+      'bg-blue-500 border-blue-500 text-white': primary,
+      'bg-gray-900 border-gray-900 text-white': secondary,
+      'bg-green-500 border-green-500 text-white': success,
+      'bg-orange-400 border-orange-500 text-white': warning,
+      'bg-red-600 border-red-600 text-white': danger,
+      // additional style props
+      'rounded-full': rounded,
+      'bg-white': outline,
+      'text-blue-500': outline && primary,
+      'text-gray-900': outline && secondary,
+      'text-green-500': outline && success,
+      'text-orange-400': outline && warning,
+      'text-red-600': outline && danger,
+    })
+  )
 
   return <button className={classes}>{children}</button>
```

<details>
<summary>Full file after this step</summary>

```jsx
import cx from 'classnames'
// twMerge resolves conflicting tailwind classes -- the last one wins.
// Without it, an outline button keeps the `text-white` from its
// colour variant and you get white text on a white background.
import {twMerge} from 'tailwind-merge'

const Button = (props) => {
  const {
    children,
    primary,
    secondary,
    success,
    warning,
    danger,
    rounded,
    outline,
  } = props

  const baseClass = 'flex items-center px-8 py-3 border'

  const classes = twMerge(
    cx(baseClass, {
      // colour variants -- pick one
      'bg-blue-500 border-blue-500 text-white': primary,
      'bg-gray-900 border-gray-900 text-white': secondary,
      'bg-green-500 border-green-500 text-white': success,
      'bg-orange-400 border-orange-500 text-white': warning,
      'bg-red-600 border-red-600 text-white': danger,
      // additional style props
      'rounded-full': rounded,
      'bg-white': outline,
      'text-blue-500': outline && primary,
      'text-gray-900': outline && secondary,
      'text-green-500': outline && success,
      'text-orange-400': outline && warning,
      'text-red-600': outline && danger,
    })
  )

  return <button className={classes}>{children}</button>
}

export default Button
```

</details>

---

<a id="step-7"></a>

## Step 7 — What if somebody passes two variants?

`<Button primary danger>` is nonsense, but nothing stops it. A component library should say so.

Count the variant booleans and warn in the console when more than one is true.

**A note on `prop-types`:** the library everyone's tutorials use for this is effectively dead. React 19 no longer calls `propTypes` on function components — the checks are silently ignored, which is worse than having none. Do it by hand like this, or use TypeScript, which is where the industry went and which we cover later in the semester.

**`src/components/Button.jsx`**

What changed:

```diff
@@ -4,4 +4,20 @@
 // colour variant and you get white text on a white background.
 import {twMerge} from 'tailwind-merge'
+
+/*
+  NOTE ON PROP-TYPES
+  ------------------
+  Every tutorial you find will validate props with the `prop-types`
+  library:
+
+      import PropTypes from 'prop-types'
+      Button.propTypes = { primary: PropTypes.bool, … }
+
+  React 19 no longer calls propTypes on function components. The checks
+  are silently ignored -- all of the ceremony, none of the safety.
+
+  So: check by hand, like the `count` guard below, or use TypeScript,
+  which is where the industry landed and which we get to later.
+*/
 
 const Button = (props) => {
@@ -16,4 +32,19 @@
     outline,
   } = props
+
+  // Only one colour variant should ever be true at a time.
+  // !! coerces to a boolean, Number turns that into 0 or 1.
+  const count =
+    Number(!!primary) +
+    Number(!!secondary) +
+    Number(!!success) +
+    Number(!!warning) +
+    Number(!!danger)
+
+  if (count > 1) {
+    console.warn(
+      'You silly goose! Only one of primary, secondary, success, warning, danger can be TRUE!'
+    )
+  }
 
   const baseClass = 'flex items-center px-8 py-3 border'
```

<details>
<summary>Full file after this step</summary>

```jsx
import cx from 'classnames'
// twMerge resolves conflicting tailwind classes -- the last one wins.
// Without it, an outline button keeps the `text-white` from its
// colour variant and you get white text on a white background.
import {twMerge} from 'tailwind-merge'

/*
  NOTE ON PROP-TYPES
  ------------------
  Every tutorial you find will validate props with the `prop-types`
  library:

      import PropTypes from 'prop-types'
      Button.propTypes = { primary: PropTypes.bool, … }

  React 19 no longer calls propTypes on function components. The checks
  are silently ignored -- all of the ceremony, none of the safety.

  So: check by hand, like the `count` guard below, or use TypeScript,
  which is where the industry landed and which we get to later.
*/

const Button = (props) => {
  const {
    children,
    primary,
    secondary,
    success,
    warning,
    danger,
    rounded,
    outline,
  } = props

  // Only one colour variant should ever be true at a time.
  // !! coerces to a boolean, Number turns that into 0 or 1.
  const count =
    Number(!!primary) +
    Number(!!secondary) +
    Number(!!success) +
    Number(!!warning) +
    Number(!!danger)

  if (count > 1) {
    console.warn(
      'You silly goose! Only one of primary, secondary, success, warning, danger can be TRUE!'
    )
  }

  const baseClass = 'flex items-center px-8 py-3 border'

  const classes = twMerge(
    cx(baseClass, {
      // colour variants -- pick one
      'bg-blue-500 border-blue-500 text-white': primary,
      'bg-gray-900 border-gray-900 text-white': secondary,
      'bg-green-500 border-green-500 text-white': success,
      'bg-orange-400 border-orange-500 text-white': warning,
      'bg-red-600 border-red-600 text-white': danger,
      // additional style props
      'rounded-full': rounded,
      'bg-white': outline,
      'text-blue-500': outline && primary,
      'text-gray-900': outline && secondary,
      'text-green-500': outline && success,
      'text-orange-400': outline && warning,
      'text-red-600': outline && danger,
    })
  )

  return <button className={classes}>{children}</button>
}

export default Button
```

</details>

---

<a id="step-8"></a>

## Step 8 — onClick is broken (and so is everything else)

Add an `onClick` to one of the buttons on the page. Click it. Nothing happens.

Of course not — we destructured the props we care about and threw the rest away. `onClick` never reaches the real `<button>`.

The rest parameter `...otherProps` collects **everything we didn't name**, and spreading it onto the button forwards the lot: `onClick`, `onMouseOver`, `type`, `disabled`, `aria-label` — things we haven't thought of yet.

**`src/components/Button.jsx`**

What changed:

```diff
@@ -31,4 +31,5 @@
     rounded,
     outline,
+    ...otherProps
   } = props
 
@@ -69,5 +70,12 @@
   )
 
-  return <button className={classes}>{children}</button>
+  // ...otherProps collects everything we did NOT destructure above --
+  // onClick, onMouseOver, type, disabled -- and forwards it to the
+  // real <button>.
+  return (
+    <button {...otherProps} className={classes}>
+      {children}
+    </button>
+  )
 }
 
```

<details>
<summary>Full file after this step</summary>

```jsx
import cx from 'classnames'
// twMerge resolves conflicting tailwind classes -- the last one wins.
// Without it, an outline button keeps the `text-white` from its
// colour variant and you get white text on a white background.
import {twMerge} from 'tailwind-merge'

/*
  NOTE ON PROP-TYPES
  ------------------
  Every tutorial you find will validate props with the `prop-types`
  library:

      import PropTypes from 'prop-types'
      Button.propTypes = { primary: PropTypes.bool, … }

  React 19 no longer calls propTypes on function components. The checks
  are silently ignored -- all of the ceremony, none of the safety.

  So: check by hand, like the `count` guard below, or use TypeScript,
  which is where the industry landed and which we get to later.
*/

const Button = (props) => {
  const {
    children,
    primary,
    secondary,
    success,
    warning,
    danger,
    rounded,
    outline,
    ...otherProps
  } = props

  // Only one colour variant should ever be true at a time.
  // !! coerces to a boolean, Number turns that into 0 or 1.
  const count =
    Number(!!primary) +
    Number(!!secondary) +
    Number(!!success) +
    Number(!!warning) +
    Number(!!danger)

  if (count > 1) {
    console.warn(
      'You silly goose! Only one of primary, secondary, success, warning, danger can be TRUE!'
    )
  }

  const baseClass = 'flex items-center px-8 py-3 border'

  const classes = twMerge(
    cx(baseClass, {
      // colour variants -- pick one
      'bg-blue-500 border-blue-500 text-white': primary,
      'bg-gray-900 border-gray-900 text-white': secondary,
      'bg-green-500 border-green-500 text-white': success,
      'bg-orange-400 border-orange-500 text-white': warning,
      'bg-red-600 border-red-600 text-white': danger,
      // additional style props
      'rounded-full': rounded,
      'bg-white': outline,
      'text-blue-500': outline && primary,
      'text-gray-900': outline && secondary,
      'text-green-500': outline && success,
      'text-orange-400': outline && warning,
      'text-red-600': outline && danger,
    })
  )

  // ...otherProps collects everything we did NOT destructure above --
  // onClick, onMouseOver, type, disabled -- and forwards it to the
  // real <button>.
  return (
    <button {...otherProps} className={classes}>
      {children}
    </button>
  )
}

export default Button
```

</details>

**`src/pages/ButtonPage.jsx`**

What changed:

```diff
@@ -5,8 +5,9 @@
     <>
       <h1 className="text-3xl mb-4">Button Page!</h1>
-      <Button primary>Buy Now</Button>
+      <Button primary onClick={() => console.log('CLICK!')}>
+        Buy Now
+      </Button>
       <Button secondary rounded>Secondary Button</Button>
       <Button danger>Delete</Button>
-      {/* these two look broken -- why? */}
       <Button warning outline rounded>Are you sure?</Button>
       <Button success outline>Success</Button>
```

<details>
<summary>Full file after this step</summary>

```jsx
import Button from '../components/Button'

const ButtonPage = () => {
  return (
    <>
      <h1 className="text-3xl mb-4">Button Page!</h1>
      <Button primary onClick={() => console.log('CLICK!')}>
        Buy Now
      </Button>
      <Button secondary rounded>Secondary Button</Button>
      <Button danger>Delete</Button>
      <Button warning outline rounded>Are you sure?</Button>
      <Button success outline>Success</Button>
    </>
  )
}

export default ButtonPage
```

</details>

---

<a id="step-9"></a>

## Step 9 — …but now className collides

Try `<Button primary className="mb-5">`. The margin doesn't apply — and worse, look at the order of our JSX: `{...otherProps}` spreads a `className`, then our own `className={classes}` overwrites it entirely.

Remember `cx` ignoring `undefined`? Here's the payoff. Put `otherProps.className` **first** inside `cx`, so a caller's classes are part of the merge — present when they pass one, harmlessly ignored when they don't. And because `twMerge` keeps the last of any conflicting pair, their `mb-5` wins over ours.

**`src/components/Button.jsx`**

What changed:

```diff
@@ -51,6 +51,8 @@
   const baseClass = 'flex items-center px-8 py-3 border'
 
+  // classnames ignores undefined and null -- which is why putting the
+  // caller's className first is safe even when they didn't pass one.
   const classes = twMerge(
-    cx(baseClass, {
+    cx(otherProps.className, baseClass, {
       // colour variants -- pick one
       'bg-blue-500 border-blue-500 text-white': primary,
```

<details>
<summary>Full file after this step</summary>

```jsx
import cx from 'classnames'
// twMerge resolves conflicting tailwind classes -- the last one wins.
// Without it, an outline button keeps the `text-white` from its
// colour variant and you get white text on a white background.
import {twMerge} from 'tailwind-merge'

/*
  NOTE ON PROP-TYPES
  ------------------
  Every tutorial you find will validate props with the `prop-types`
  library:

      import PropTypes from 'prop-types'
      Button.propTypes = { primary: PropTypes.bool, … }

  React 19 no longer calls propTypes on function components. The checks
  are silently ignored -- all of the ceremony, none of the safety.

  So: check by hand, like the `count` guard below, or use TypeScript,
  which is where the industry landed and which we get to later.
*/

const Button = (props) => {
  const {
    children,
    primary,
    secondary,
    success,
    warning,
    danger,
    rounded,
    outline,
    ...otherProps
  } = props

  // Only one colour variant should ever be true at a time.
  // !! coerces to a boolean, Number turns that into 0 or 1.
  const count =
    Number(!!primary) +
    Number(!!secondary) +
    Number(!!success) +
    Number(!!warning) +
    Number(!!danger)

  if (count > 1) {
    console.warn(
      'You silly goose! Only one of primary, secondary, success, warning, danger can be TRUE!'
    )
  }

  const baseClass = 'flex items-center px-8 py-3 border'

  // classnames ignores undefined and null -- which is why putting the
  // caller's className first is safe even when they didn't pass one.
  const classes = twMerge(
    cx(otherProps.className, baseClass, {
      // colour variants -- pick one
      'bg-blue-500 border-blue-500 text-white': primary,
      'bg-gray-900 border-gray-900 text-white': secondary,
      'bg-green-500 border-green-500 text-white': success,
      'bg-orange-400 border-orange-500 text-white': warning,
      'bg-red-600 border-red-600 text-white': danger,
      // additional style props
      'rounded-full': rounded,
      'bg-white': outline,
      'text-blue-500': outline && primary,
      'text-gray-900': outline && secondary,
      'text-green-500': outline && success,
      'text-orange-400': outline && warning,
      'text-red-600': outline && danger,
    })
  )

  // ...otherProps collects everything we did NOT destructure above --
  // onClick, onMouseOver, type, disabled -- and forwards it to the
  // real <button>.
  return (
    <button {...otherProps} className={classes}>
      {children}
    </button>
  )
}

export default Button
```

</details>

**`src/pages/ButtonPage.jsx`**

What changed:

```diff
@@ -8,5 +8,8 @@
         Buy Now
       </Button>
-      <Button secondary rounded>Secondary Button</Button>
+      {/* a caller's own class has to survive the merge */}
+      <Button secondary rounded className="mb-5">
+        Secondary Button
+      </Button>
       <Button danger>Delete</Button>
       <Button warning outline rounded>Are you sure?</Button>
```

<details>
<summary>Full file after this step</summary>

```jsx
import Button from '../components/Button'

const ButtonPage = () => {
  return (
    <>
      <h1 className="text-3xl mb-4">Button Page!</h1>
      <Button primary onClick={() => console.log('CLICK!')}>
        Buy Now
      </Button>
      {/* a caller's own class has to survive the merge */}
      <Button secondary rounded className="mb-5">
        Secondary Button
      </Button>
      <Button danger>Delete</Button>
      <Button warning outline rounded>Are you sure?</Button>
      <Button success outline>Success</Button>
    </>
  )
}

export default ButtonPage
```

</details>

---

<a id="step-10"></a>

## Step 10 — Icons, and one global rule

`react-icons` bundles most of the big icon sets — Font Awesome, Material, Github's Octicons — and gives them all the same API. We'll use it again for the Accordion next class.

Icons go in as **children**, at the usage site, not as a prop: the Button doesn't need to know which icon you want.

The icon ends up jammed against the text. You could pass a margin class at every usage — but that's a decision you'd re-make forty times, which is the thing we're here to avoid. One global rule in `index.css` instead.

```bash
npm install react-icons
```

**`src/index.css`**

What changed:

```diff
@@ -10,2 +10,7 @@
 }
 
+/* Give icons inside buttons a little breathing room. */
+button > svg {
+  margin-right: 0.25rem;
+}
+
```

<details>
<summary>Full file after this step</summary>

```css
/* Tailwind v4: one import replaces the old
     @tailwind base; @tailwind components; @tailwind utilities;
   trio, and there is no tailwind.config.js to fill in. */
@import 'tailwindcss';

/* Theme values are declared in CSS now instead of a JS config file.
   Anything you put here becomes a utility class. */
@theme {
  --color-brand: #48b2ff;
}

/* Give icons inside buttons a little breathing room. */
button > svg {
  margin-right: 0.25rem;
}
```

</details>

**`src/pages/ButtonPage.jsx`**

What changed:

```diff
@@ -1,2 +1,3 @@
+import {GoBell, GoTrash} from 'react-icons/go'
 import Button from '../components/Button'
 
@@ -6,4 +7,5 @@
       <h1 className="text-3xl mb-4">Button Page!</h1>
       <Button primary onClick={() => console.log('CLICK!')}>
+        <GoBell />
         Buy Now
       </Button>
@@ -12,5 +14,8 @@
         Secondary Button
       </Button>
-      <Button danger>Delete</Button>
+      <Button danger>
+        <GoTrash />
+        Delete
+      </Button>
       <Button warning outline rounded>Are you sure?</Button>
       <Button success outline>Success</Button>
```

<details>
<summary>Full file after this step</summary>

```jsx
import {GoBell, GoTrash} from 'react-icons/go'
import Button from '../components/Button'

const ButtonPage = () => {
  return (
    <>
      <h1 className="text-3xl mb-4">Button Page!</h1>
      <Button primary onClick={() => console.log('CLICK!')}>
        <GoBell />
        Buy Now
      </Button>
      {/* a caller's own class has to survive the merge */}
      <Button secondary rounded className="mb-5">
        Secondary Button
      </Button>
      <Button danger>
        <GoTrash />
        Delete
      </Button>
      <Button warning outline rounded>Are you sure?</Button>
      <Button success outline>Success</Button>
    </>
  )
}

export default ButtonPage
```

</details>

---

<a id="step-11"></a>

## Step 11 — Tidy the demo page

Last thing: lay the variants out so the page reads as documentation. This *is* the component library — a page that shows every variation, so anyone on the team can see what exists without reading the source.

Next class we add a second component to it, and in week 5 each one gets its own route.

**`src/pages/ButtonPage.jsx`**

What changed:

```diff
@@ -6,18 +6,25 @@
     <>
       <h1 className="text-3xl mb-4">Button Page!</h1>
-      <Button primary onClick={() => console.log('CLICK!')}>
-        <GoBell />
-        Buy Now
-      </Button>
-      {/* a caller's own class has to survive the merge */}
-      <Button secondary rounded className="mb-5">
-        Secondary Button
-      </Button>
-      <Button danger>
-        <GoTrash />
-        Delete
-      </Button>
-      <Button warning outline rounded>Are you sure?</Button>
-      <Button success outline>Success</Button>
+      <div className="mb-2">
+        <Button primary onClick={() => console.log('CLICK!')}>
+          <GoBell />
+          Buy Now
+        </Button>
+      </div>
+      <div className="mb-2">
+        <Button secondary rounded>Secondary Button</Button>
+      </div>
+      <div className="mb-2">
+        <Button danger>
+          <GoTrash />
+          Delete
+        </Button>
+      </div>
+      <div className="mb-2">
+        <Button warning outline rounded>Are you sure?</Button>
+      </div>
+      <div className="mb-2">
+        <Button success outline>Success</Button>
+      </div>
     </>
   )
```

<details>
<summary>Full file after this step</summary>

```jsx
import {GoBell, GoTrash} from 'react-icons/go'
import Button from '../components/Button'

const ButtonPage = () => {
  return (
    <>
      <h1 className="text-3xl mb-4">Button Page!</h1>
      <div className="mb-2">
        <Button primary onClick={() => console.log('CLICK!')}>
          <GoBell />
          Buy Now
        </Button>
      </div>
      <div className="mb-2">
        <Button secondary rounded>Secondary Button</Button>
      </div>
      <div className="mb-2">
        <Button danger>
          <GoTrash />
          Delete
        </Button>
      </div>
      <div className="mb-2">
        <Button warning outline rounded>Are you sure?</Button>
      </div>
      <div className="mb-2">
        <Button success outline>Success</Button>
      </div>
    </>
  )
}

export default ButtonPage
```

</details>

---

**Where we landed:** one component, seven props, and every plain `<button>` feature still intact. Anyone on a team using this gets consistent buttons without deciding anything.

**Homework:** add a `size` prop — `small`, `large` — using the same `cx` object pattern. Then use it on the Button page alongside the existing variants.

Next class we build an Accordion, which is where state enters the component library.
