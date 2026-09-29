# Homework — Week 5 (due before next Tuesday's class)

Both of this week's projects get one more feature. Neither is big; both are the
same question in different clothes — *what changed, and what should happen
because it changed?*

## 1. The memory game: make it yours, and keep score

**Your own artwork.** Four square images of anything — your photographs, your
drawings, four screenshots of your midterm wireframes. Drop them in
`src/assets/`, change the imports and the `cardImages` array, and nothing else
should need touching. If it does, something is more hard-coded than it should
be.

**A best score.** Under the turn counter, show the lowest number of turns you
have won in this session, and update it when somebody beats it. New Game must
*not* reset it.

You already have everything you need for this. The only real question is the
one from class: which piece of state does the check watch, and where does the
check live?

## 2. The image search: credit the photographer

Unsplash's API terms actually require this, so it is a real requirement and not
a made-up exercise. Under each photo, show the photographer's name as a link to
their Unsplash profile.

Everything you need is already in the response — look at one photo object in
the console and find `user.name` and `user.links.html`. Open it in a new tab:

```jsx
<a href={...} target="_blank" rel="noreferrer">
```

While you are in there: put the search term in a heading above the results, so
the page says what it is showing.

## 3. Search something on load

Right now the image search is empty until somebody types. Give it a default
search — `useEffect(() => { ... }, [])`, the form that runs once when the
component mounts.

Careful: you are calling an API inside an effect, with a 50-per-hour budget. An
effect with the **wrong** dependency array here can fire on every render and
burn the whole hour in seconds. Check the network tab and count the requests.

## 4. Answer these in a comment

At the top of the file you changed, in your own words:

- Which dependency array did each of your effects use, and why that one?
- What would happen if you put `images` in the dependency array of the effect
  in #3?

## Extra, not required

- **A best score that survives a refresh.** Which means storing it outside
  React. Look up `localStorage.setItem` and `localStorage.getItem`, and think
  about when each one should run.
- **More cards.** Six pairs instead of four, without rewriting the logic.
- **A loading skeleton** instead of the word "Searching..." — grey boxes the
  size the photos will be.
- **Debounce the search**, so it fires as you type but only once you stop for
  half a second. This is a real technique with a real name; look it up.

---

## Submitting

Both projects go in your class repo, in their own folders.

```bash
git add .
git commit -m "week 5 homework"
git push
```

Then open your repo on github.com and check three things: the files are there,
`node_modules` is **not**, and neither is your `.env.local`. If you can see your
Unsplash key on GitHub, delete the key in your Unsplash dashboard and generate
a new one — that one is gone.
