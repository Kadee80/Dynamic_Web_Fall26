# Midterm Project — an app with a purpose

**25% of your grade.**

| | |
|---|---|
| **Present in class** | Tuesday, Week 09 |
| **Code due** | Friday of Week 09, midnight |

Presenting is what marks the midterm on time. Code is graded from whatever is
pushed to your repo by Friday, so the days after you present are still build
time.

## The project

**Take the todo list and make it an app that is about something.**

Not "a todo list." A reading list. A recipe box. A practice log. A shot list. A
plant-watering schedule. A gear checklist for a trip. Something a specific
person would actually open — ideally you.

You are starting from code you already wrote, which is the point: the midterm
is not about starting over, it is about whether you can take a working app and
make it *yours*.

## What it has to do

**1. At least one more input than the title.**

This is the requirement that makes it your app instead of ours. A real,
controlled form control, not just more text:

- a **date** — when is it due, when did you read it, when was it watered
- a **select** — category, status, room, genre, difficulty
- a **number** — pages, minutes, servings, reps
- a **textarea** — notes
- a **checkbox** — done, favourite, packed

It has to work end to end:

- [ ] controlled — `value` and `onChange`, the way every input you have built
      this semester works
- [ ] **saved to the server** and still correct after a refresh
- [ ] **visible in the list**, not just stored
- [ ] **editable**, not only set once at creation

One done properly beats three done halfway.

**2. Full CRUD, persisted.** Create, read, update, delete — all four, all
surviving a refresh. This already works; do not break it.

**3. The three states.** Loading, empty, and error. The error message should
tell the user something true and useful. "Is `npm run server` running?" counts.

**4. Styled like somebody meant it.** This is the other half of the grade and
it is the half people skip.

Default Tailwind spacing on a white page is where you *start*, not where you
stop. A deliberate app has: a real title, type that establishes a hierarchy, a
colour choice that suits the subject, consistent spacing, and states that look
intentional — including what it looks like with nothing in it.

Ask yourself: if a stranger opened this, would they know what it is for inside
five seconds?

**5. A `README.md`** in the project folder:

- what the app is for and who would use it
- how to run it — both commands, including `npm run server`
- **props or Context, and why you chose it.** One honest paragraph. Either
  answer is correct; having a reason is the requirement
- what you would add with another week

## What is being graded

| | |
|---|---|
| **It works** | CRUD persists, the new input works end to end, no console errors |
| **State lives in the right place** | Not everything in `App`, not everything in Context. You can explain each choice |
| **Components do one job** | Split sensibly, props named for what they are, no 200-line files |
| **It looks deliberate** | Somebody made design decisions and they hold together |
| **It is documented** | The README answers the questions above |

## The presentation

Five minutes, live demo, in class Tuesday of Week 09.

- show the app and say who it is for
- add something, edit it, delete it, refresh
- show **one piece of code you are pleased with** and explain how it works. If
  you cannot explain it, do not show it
- say what was hardest

Laptops closed while other people present. Participation is 25% of your grade
and this is one of the days it is most visible.

## Scope, honestly

This should be a **one-screen app, done well**. Not multiple pages, not
authentication, not a real database. You have about two weeks alongside other
coursework.

If you want the stretch: filtering, sorting, a search box, a second extra
input, optimistic updates, keyboard shortcuts. All optional, all noticed, none
of them a substitute for the five requirements above.

## Allowed and encouraged

- Starting from your Week 06 or Week 07 code. That is the assignment, not
  cheating.
- Looking things up, reading docs, adapting a tutorial — as long as **you can
  explain every line you keep.** If you cannot explain it, you cannot submit
  it.
- Asking me. Email with a link to the relevant files in your repo and the
  specific problem, and we will sort it out.

## Submitting

A `MIDTERM` folder in your class repo, with the project inside it and
`node_modules` gitignored. Push early and often — "it was on my laptop" is not
a version of "it was in the repo."
