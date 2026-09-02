# JavaScript Warm-Up (15 min, in pairs)

These six things account for most of the JavaScript you'll write in this class.
Not "JavaScript in general" — these six, specifically, because you'll need every
one of them next week.

Work in pairs. Open your browser console (`Cmd/Ctrl + Option/Shift + J`) or a
StackBlitz file and actually run them. Don't just read.

---

### 1. Arrow functions

```js
// these two do the same thing
function double(n) {
  return n * 2
}

const double = (n) => n * 2
```

**Try it:** rewrite this as an arrow function.

```js
function shout(word) {
  return word.toUpperCase() + '!'
}
```

---

### 2. Destructuring

Pulling values out of an object into their own variables.

```js
const recipe = {title: 'Pancakes', servings: 4}

// the long way
const title = recipe.title

// destructuring
const {title, servings} = recipe
```

**Try it:** given `const user = {name: 'Ada', role: 'admin'}`, pull `name` and
`role` out in one line.

---

### 3. Template literals

Backticks, not quotes. `${}` drops a value in.

```js
const name = 'Ada'
const greeting = `Hello, ${name}! You have ${2 + 3} messages.`
```

**Try it:** build the string `"Pancakes serves 4"` out of the `recipe` object
above.

---

### 4. `.map()`

Takes an array, runs a function on every item, gives you back a **new** array of
the results. The original is untouched. This is how every list in React gets
rendered.

```js
const nums = [1, 2, 3]
const doubled = nums.map((n) => n * 2) // [2, 4, 6]
```

**Try it:**

```js
const ingredients = ['butter', 'milk', 'egg']
// make: ['BUTTER', 'MILK', 'EGG']
```

**Then try:** turn `['butter', 'milk']` into
`['<li>butter</li>', '<li>milk</li>']`. Sit with that one for a second — that is
almost exactly what React does.

---

### 5. Spread `...`

Copies the contents of an array or object into a new one.

```js
const a = [1, 2]
const b = [...a, 3] // [1, 2, 3]

const base = {color: 'red'}
const shirt = {...base, size: 'M'} // {color: 'red', size: 'M'}
```

**Try it:** make an array of five empty slots with `[...Array(5)]`. What do you
get? Why might that be useful for drawing five stars?

---

### 6. Ternary and `&&`

Two ways to choose a value in one line.

```js
// ternary:  condition ? ifTrue : ifFalse
const label = isOpen ? 'Close' : 'Open'

// &&  gives back the last value if everything before it is truthy,
//     otherwise the first falsy one
const maybe = isLoggedIn && 'Welcome back'
```

**Try it:** given `const count = 0`, what does `count > 0 && 'has items'`
evaluate to? What about when `count = 3`?

React renders nothing at all for `false`, `null` and `undefined` — which is
exactly why `&&` is the standard way to show or hide something.

---

## If any of these felt shaky

That's genuinely useful information and I'd rather know now than in week 6. Come
tell me, or send me a note — I'll point you at a couple of hours of practice
that will make the rest of the semester dramatically easier. This is a very
normal place to need a refresher and it is not a reflection of whether you can
do this class.
