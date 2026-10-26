# Week 09 — Forms, continued

*The back half of the Week 08 forms class: errors people can read, and a submit button that cannot save twice · ~60 min*

> **Start from where we stopped.** Copy
> `Week08/end-of-class/week08-forms/` into your own repo — that is the exact
> project as we left it in class, mid-sentence. `npm install`, then
> `npm run dev`.

We got as far as the `validate()` function. Which means the form **already
knows** what is wrong with it — and refuses to submit when something is — and
the person filling it in **cannot see any of that**.

Today we fix that, and then make the submit button honest about what is
happening while it saves.

| Steps | Worth protecting |
|---|---|
| **1–4** | The must-do. At the end of step 4 the form is usable. |
| **5–6** | Errors that reach everybody, and submitting once. |
| **7** | The midterm checklist. Do this one even if we run out of everything else. |
| **8** | A read, not a lesson. |

Stuck? Read the error first, then [TROUBLESHOOTING.md](../../TROUBLESHOOTING.md).

---

## Steps

1. [The bug we left in](#step-1)
2. [`onBlur`, and the right moment](#step-2)
3. [The red border](#step-3)
4. [Saying it in words](#step-4)
5. [Errors that reach everybody](#step-5)
6. [Submitting once](#step-6)
7. [Adding a field to your midterm](#step-7)
8. [Controlled, uncontrolled, and libraries](#step-8)

---

<a id="step-1"></a>

## Step 1 — The bug we left in

Run the project and submit the form completely empty.

**Nothing happens.** No book is added, and nothing on the page tells you why.

Look at why, in `handleSubmit`:

```jsx
if (Object.keys(errors).length > 0) {
  return
}
```

`Object.keys(errors)` gives an array of the keys in the errors object, so
`.length` is how many rules failed. One or more, and we `return` — leaving the
function early, before `onAdd` is ever called.

That part is right. What is missing is everything that would **show** the
errors. We already have the two pieces:

```jsx
const [touched, setTouched] = useState({})
const errors = validate(values)

const showError = (field) => {
  return touched[field] ? errors[field] : undefined
}
```

`showError` is written and **never called anywhere**. `touched` is set and
never read. A commented-out `fieldClass` is sitting below `handleSubmit`.

That is today: connect what is already there.

> **A form that silently refuses to submit is worse than one with no validation
> at all.** With no validation you get a server error. With this, the user
> clicks the button, nothing moves, and they conclude your site is broken.

---

<a id="step-2"></a>

## Step 2 — `onBlur`, and the right moment

Why not just show every error immediately? Because the form would start
shouting at somebody who has typed one letter of their name. "A book needs a
title" while they are mid-word is not help, it is nagging.

**`touched` is the answer, and `onBlur` is what fills it in.** `blur` fires
when a field **loses focus** — when the user has finished with it and moved
on:

```jsx
const handleBlur = (event) => {
  setTouched({
    ...touched,
    [event.target.name]: true,
  })
}
```

Same shape as `handleChange`: spread what is already there, then set one key
using the input's `name`. One handler for every field.

Put `onBlur={handleBlur}` on the four fields that have rules — title, author,
pages and dateStarted:

```jsx
<input
  required
  maxLength="120"
  id="title"
  name="title"
  value={values.title}
  onChange={handleChange}
  onBlur={handleBlur}
  className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
/>
```

Nothing visible yet — `showError` still is not called. But open React DevTools
or drop a `console.log(touched)` in and tab through the form: the object fills
up as you leave each field.

**And `handleSubmit` already does the other half:**

```jsx
setTouched({title: true, author: true, pages: true, dateStarted: true})
```

On submit, everything counts as touched — otherwise a field the user never
visited fails with no explanation, which is the worst case of all.

---

<a id="step-3"></a>

## Step 3 — The red border

Uncomment `fieldClass`, below `handleSubmit`:

```jsx
const fieldClass = (field) => {
  const base = 'mt-1 w-full rounded border px-3 py-2'

  return showError(field)
    ? `${base} border-red-500 bg-red-50`
    : `${base} border-gray-300`
}
```

A function that **returns a string of class names**, with a ternary choosing
between two endings. Note `base` has `border` but no colour in it — the colour
is the only thing that changes.

Now use it. On those same four fields, replace the hard-coded `className` with
a call:

```jsx
className={fieldClass('title')}
```

Watch the braces: `className="..."` is a string, `className={...}` is
JavaScript. Changing one to the other is the step people miss.

Save. Click into Title, click out again without typing, and **the field goes
red**. Type a letter and it goes back.

One thing to notice while you are looking at it: the border is red *because
`touched.title` is true and `errors.title` exists*. Nothing anywhere set a
"show the error" flag. **The error state is worked out from the values on every
render**, which is why it can never be out of date.

---

<a id="step-4"></a>

## Step 4 — Saying it in words

A red border says *something is wrong*. It does not say what, and roughly one
man in twelve cannot reliably see that it went red at all.

**Colour is never the only signal.** Under each of the four fields:

```jsx
{showError('title') && (
  <p className="mt-1 text-sm text-red-700">{errors.title}</p>
)}
```

`&&` renders the thing on the right only when the left is truthy — the
conditional-render pattern you have been using since the todo list's empty
state.

Then one attribute on the `<form>` itself:

```jsx
<form onSubmit={handleSubmit} noValidate className="space-y-4">
```

**`noValidate` turns off the browser's own validation bubbles.** We are taking
over, and without it you get two sets of messages fighting — ours, and the
browser's, in its own words and its own position, which you cannot style.

Keep the `required` and `maxLength` attributes. They still tell assistive
technology what is expected, and they still work if your JavaScript fails to
load. You are turning off the *bubbles*, not the information.

**Submit the empty form now.** Four red fields, four messages, and the form
explaining itself. That is the step that makes it feel finished.

---

<a id="step-5"></a>

## Step 5 — Errors that reach everybody

Two attributes, and they are the difference between a form that works for
everyone and one that works for people who can see it.

```jsx
<input
  id="title"
  name="title"
  value={values.title}
  onChange={handleChange}
  onBlur={handleBlur}
  aria-invalid={showError('title') ? true : undefined}
  aria-describedby={showError('title') ? 'title-error' : undefined}
  className={fieldClass('title')}
/>
{showError('title') && (
  <p id="title-error" className="mt-1 text-sm text-red-700">
    {errors.title}
  </p>
)}
```

- **`aria-invalid`** announces that this field is wrong. That is what the red
  border means; this is how you say it out loud.
- **`aria-describedby`** points at the **`id` of the element holding the
  message**, so a screen reader reads the error straight after the field's
  name. Note the `id` on the `<p>` — the link only works if they match.

**Why `undefined` rather than `false`?** Because `aria-describedby=""` is a
broken reference to nothing, and React leaves an attribute out entirely when
its value is `undefined`. The ternary is doing real work.

Three rules worth keeping for the rest of your career:

- the message lives **next to the field**, not in a summary at the top
- it says **what to do**, not that something is invalid
- **the field keeps what the user typed.** Never clear a field because it was
  wrong

---

<a id="step-6"></a>

## Step 6 — Submitting once

A real save takes time and can fail. Right now `onAdd` is instant, which is a
lie your midterm does not tell — yours is `await axios.post(...)`.

Make `App`'s `addBook` honest:

```jsx
const addBook = async (book) => {
  // stands in for the network. In your midterm this line is the axios call.
  await new Promise((resolve) => setTimeout(resolve, 800))
  setBooks([...books, {...book, id: Date.now()}])
}
```

Then two more pieces of state in `BookForm`:

```jsx
const [isSubmitting, setIsSubmitting] = useState(false)
const [submitError, setSubmitError] = useState(null)
```

And `handleSubmit` becomes `async`:

```jsx
const handleSubmit = async (event) => {
  event.preventDefault()
  setTouched({title: true, author: true, pages: true, dateStarted: true})

  if (Object.keys(errors).length > 0) {
    return
  }

  setIsSubmitting(true)
  setSubmitError(null)

  try {
    await onAdd({
      ...values,
      pages: Number(values.pages) || 0,
      rating: Number(values.rating),
    })
    setValues(EMPTY)
    setTouched({})
  } catch (err) {
    console.error(err)
    setSubmitError('Could not save that. Your text is still here — try again.')
  } finally {
    setIsSubmitting(false)
  }
}
```

And the button:

```jsx
{submitError && (
  <p className="rounded bg-red-50 p-3 text-sm text-red-700">{submitError}</p>
)}

<button
  disabled={isSubmitting}
  className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
>
  {isSubmitting ? 'Saving...' : 'Add book'}
</button>
```

**Four things are happening, and all four matter:**

- **`disabled={isSubmitting}`.** Without it, an impatient double-click sends
  two requests and saves two copies. This is a bug in production software you
  have used this week.
- **The label changes.** Something visibly happened; the button is not just
  dead.
- **`finally`** puts `isSubmitting` back to `false` whether the save worked or
  blew up. Without it, one failure leaves the button disabled forever.
- **`setValues(EMPTY)` is inside the `try`, after the `await`.** If the save
  fails, their typing is still there — and the message says so, because that is
  the first thing they will worry about.

Test it properly: `throw new Error('nope')` at the top of `addBook`, submit,
and check the form is still full and the button is alive again.

---

<a id="step-7"></a>

## Step 7 — Adding a field to your midterm

**Read this one.** It is the requirement, and it is four places. Miss one and
the field half-works, which is harder to debug than a field that does not work
at all.

**1. The create form.** The input, a `label` with `htmlFor`, the field in your
state object, and `name` matching the key.

**2. The request.** In `api.js`, the field has to be in the body you send:

```js
export const createTodo = async (title, priority) => {
  const response = await axios.post(`${BASE}/todos`, {
    title,
    priority,
    done: false,
  })
  return response.data
}
```

Check `db.json` afterwards. **If it is not in the file, it was never sent.**

**3. The list.** Somewhere the user can see it. A field that is stored and
never shown is not a feature.

**4. The edit form.** The one everybody forgets. It needs the input, the
existing value loaded into it, and the field included in the update — and
remember from Week 06 that **`PUT` replaces the whole record while `PATCH`
merges**. A `PUT` missing your new field will quietly delete it, and it will
look like a server bug.

One more that is easy to miss: **the rows already in `db.json` do not have your
field at all.** What does your app render for them? `undefined` is not a good
answer, and `|| ''` or `?? 'Not set'` takes one line.

Then go back to the **checklist you wrote before you started** and write down
what the work actually took. The gap between the two lists is graded, and
nobody's lists match.

---

<a id="step-8"></a>

## Step 8 — Controlled, uncontrolled, and libraries

Two honest footnotes.

**Uncontrolled inputs.** You can let the DOM keep the value and read it only on
submit, with `FormData` or a `ref`. Less code, and genuinely fine for a search
box. But you cannot validate as they type, cannot disable a button until the
form is valid, and cannot show a character counter — because React does not
know the value. **Controlled is the default for anything you care about.**

**Form libraries.** `react-hook-form` and `formik` exist and a lot of real
codebases use them. They do what you just did: values, touched, errors, submit
state. For a twenty-field form with conditional sections, use one.

They are also unreadable until you have hand-rolled this once — which you now
have. You know what `touched` is for, so `formState.touchedFields` is a name
rather than a mystery.

**What to take away:** a form is state, a change handler, validation, and a
submit that tells the truth about what is happening. Every library is a nicer
way to write those four things.

---

## Where we landed

- **`onBlur` + `touched`** — a message appears when the user leaves a field,
  not while they are typing in it
- **`fieldClass`** — a function returning class names, with a ternary
- **`&&` to render a message**, next to its field, in words
- **`noValidate`** — our messages, not the browser's bubbles
- **`aria-invalid` / `aria-describedby`** — so the error reaches people who
  cannot see the red border
- **`disabled={isSubmitting}`**, a label that changes, `finally`, and **never
  clearing the form until the save worked**

**Homework:** [HW.md](../HW.md) — which is the midterm, due Friday midnight.
