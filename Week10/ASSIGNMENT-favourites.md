# Assignment: the favourites slice

**Due before class on Tuesday 24 November.**

This is the exercise from the end of Week 10 that we ran out of time for. You
are doing it at home instead, so it is written out in much more detail than I
would have given you in the room, and it goes further than the ten minute
version would have.

Read this whole page before you start. The order matters.

**Parts 1 to 4 contain nothing new.** Every line you need is a line you already
wrote during the print shop build. If you catch yourself reaching for syntax
you have not seen in this class, stop and re-read step 9 and step 10 of
[README.md](README.md). You have talked yourself into something harder than
the assignment.

**Parts 5 to 7 are the assignment.** They are design questions, and they are
the reason this is worth a week rather than ten minutes. Leave yourself time
for them. I am more interested in a half-built filter with a clear argument
attached than a finished one you cannot explain.

---

## Where to start

Use your own print shop from Week 10. If yours is in a state you do not trust,
copy the finished one and work on that:

```bash
cd ~/path/to/your-hw-repo
cp -R ~/path/to/DynamicWebF26/Week10/end-of-class/bauhaus-prints ./favourites
cd favourites
npm install
npm run dev
```

Either way, before you write anything, open the app and confirm the cart, the
colour filter and the devtools all still work. Debugging two things at once is
how an hour becomes an evening.

The shape you are adding to:

```
src/
├── store.js                   two keys today, three by the end
├── data/prints.js             the catalogue. NOT state. This matters later.
├── features/cartSlice.js      items, and three selectors
├── features/uiSlice.js        colourFilter, and one selector
└── components/
    ├── Header.jsx             reads two numbers, does no arithmetic
    ├── Catalog.jsx            the grid, the filter buttons, the Add buttons
    └── Cart.jsx
```

---

## Part 1: the slice

Create `src/features/favouritesSlice.js`.

- [ ] A slice named `favourites`.
- [ ] Its `initialState` holds **a list of print ids**. Not the prints
      themselves, and not a true/false flag on each print. An array of strings
      like `['p1', 'p4']`. Part 7 asks you why, so make a note of what you
      think while you are writing it.
- [ ] **One** reducer, `favouriteToggled`. It takes an id as its payload. If
      the id is already in the list, it comes out. If it is not, it goes in.
- [ ] Export the action creator.
- [ ] Export the slice reducer as the default export.

Two things that will come up:

**One reducer or two?** You may find yourself wanting `favouriteAdded` and
`favouriteRemoved`. That is not wrong, and plenty of real apps do it. But ask
yourself what the button would have to know in order to pick between them, and
where that knowledge would have to live. Then decide, and write one sentence in
a comment saying which you chose and why.

**Immer.** `push` works. Reassigning `state.ids` to a filtered copy works. Doing
one and then returning the other in the same reducer does not. Pick a style per
branch and stay in it.

## Part 2: register it

- [ ] Add the reducer to `store.js` under the key `favourites`.
- [ ] Open the Redux devtools and confirm a third branch has appeared in the
      state tree, with an empty array inside it.

Do not skip the second half of that. This is the step that half the room
forgets, and the error it produces (`Cannot read properties of undefined`)
reads like a problem in the component, which is where you will waste the
evening.

## Part 3: the star

In `Catalog.jsx`, each print already has an **Add** button. Add a second one
next to it.

- [ ] Clicking it dispatches `favouriteToggled` with **that print's id**.
- [ ] Its appearance changes depending on whether that print is currently a
      favourite. A filled box, a different background, the word FAV in reverse,
      whatever you like. It must be visible across the room.
- [ ] **The filled state is read from the store.** Not from `useState`, not
      from a variable in the component.

That last bullet is the one I will look at first. There is a quick way to check
you got it right: favourite a print, then click the **blue** filter, then click
**all** again. If the star is still filled, your state is in the right place.
If it emptied, it was living in the component and React threw it away when the
list re-rendered.

You will need `selectFavouriteIds` from your slice, and a way to ask whether
this print's id is in that array. One method, no loop.

## Part 4: the count

The header shows a cart count and a cart total. Add a third box: how many
prints are favourited.

- [ ] The number comes from a **selector you write in `favouritesSlice.js`**,
      next to the other one.
- [ ] `Header.jsx` does no arithmetic. It asks for a number and is told one.

You did exactly this in step 10 with `selectCartCount`. Go and look at it.

## Part 5: checkpoint

Before you go on, open the Redux devtools and do this, in order:

1. Favourite one print. **Read the action type off the devtools** and write it
   down somewhere. Part 7 asks for it, and I want you to read it rather than
   guess it.
2. Favourite a second one. The `ids` array should now have two entries.
3. Un-favourite the first. It should have one, and it should be the second id,
   not the first.
4. Add something to the cart. Does the `favourites` branch change? It must not.
5. Drag the devtools slider back to the start and forward again. Does the app
   survive it?

If any of those five is wrong, fix it now. Everything below is built on top.

---

## Part 6: show only favourites

Add a control that filters the catalogue down to favourited prints only.

Before you write a line of it, answer this in a comment at the top of the file
you are about to change:

- [ ] **Which slice does "am I currently showing only favourites" belong in?**

It is one of the two you now have, and it is not a toss-up. Think about what
each slice is *for*. One of them owns a fact about the prints. The other owns a
fact about what you are currently looking at. Write two or three sentences. If
you argue yourself into the other answer than the one I have in mind and the
argument is good, you get the marks.

Then build it:

- [ ] The control, wherever it makes sense next to the existing filter buttons.
- [ ] It filters the grid.

And now the part that is actually hard:

- [ ] **Two filters now exist at once.** Colour and favourites. Decide what
      happens when both are on. Blue *and* favourited? Favourited, ignoring
      colour? Does turning one on turn the other off?

      There is no right answer. There is only a decision, and it has to be
      written down. Add it to the same comment: what you chose, and what you
      think the user expects.

- [ ] Decide **where the combining happens**: in `Catalog.jsx` where the
      existing colour filter runs, or in a selector. Say which and why.

      Be honest in this one. There is a real argument for each, and one of them
      runs into something awkward that you will only find by trying it. If you
      hit that wall, describe it. Hitting it is worth more than avoiding it.

## Part 7: three questions

Answer these in a file called `ANSWERS.md` at the top of your project. Two or
three sentences each. Full sentences, not notes.

- [ ] **1. What is the action type string your toggle dispatches, and where do
      its two halves come from?** You wrote it down in Part 5. Now say where
      each piece of it came from, without looking it up.

- [ ] **2. Why a list of ids, rather than a `favourite: true` flag on each
      print?**

      Before you answer: open `src/data/prints.js` and read the comment at the
      top. Then ask yourself what you would have to do first in order to put a
      flag on a print, and what you would own afterwards that you do not own
      now. The strongest version of this answer does not talk about which is
      tidier. It talks about what the store would then be responsible for.

- [ ] **3. A print is removed from the catalogue, and somebody had favourited
      it. What happens to your app?**

      Try it. Delete a print from `prints.js` after favouriting it. Describe
      what you see and explain why. Then say in one sentence what a real app
      would do about it. You are not required to fix it.

## Part 8: optional, and worth doing

Pick one if you have time. Say in `ANSWERS.md` which you tried.

- **Clear all favourites.** Two lines, and a reminder of how cheap a reducer is
  once the shape is right.
- **Make it survive a reload.** You cannot do this with anything I have shown
  you. Finding out exactly where you get stuck, and being able to describe the
  shape of the missing piece, is worth more than finishing it. This is where
  the course goes next.

---

## What I am looking at, in order

1. The filled star reads from the store, not from component state. (Part 3)
2. The count comes from a selector in the slice. (Part 4)
3. The reducer is one toggle, and it is honest about mutation. (Part 1)
4. Part 6's comment exists and makes an argument.
5. Question 2 is about ownership of data, not about tidiness.

Parts 1 to 5 working and Parts 6 to 7 thought about beats all eight parts
written quickly.

## If it breaks

| What you see | Almost always |
|---|---|
| `Cannot read properties of undefined (reading 'ids')` | The reducer is not registered in `store.js` |
| The same, but it **is** registered | The key in the store and the path in your selector disagree. `favourites:` in one, `state.favourite.ids` in the other |
| Star fills, then empties when you change the colour filter | The filled state is in `useState` instead of the store. Part 3 |
| Click does nothing, no error in the console | `dispatch(favouriteToggled)` without calling it, or you passed the whole `print` where the reducer expects `print.id` |
| Toggling adds but never removes | You are comparing an object against an id somewhere |
| State updates but the screen does not | You reassigned the array outside Immer's reach, or the component is not subscribed with `useSelector` |

If none of those is it, read the error out loud before you message me. It is
right about half the time.

## Submitting

```bash
git add .
git commit -m "favourites slice assignment"
git push
```

Check on github.com that `ANSWERS.md` actually went up, and that `node_modules`
did not.
