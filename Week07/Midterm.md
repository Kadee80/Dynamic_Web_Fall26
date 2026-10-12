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

## Start with the user story, not the field

Everyone has to add **at least one new field** to the app. The thing that
decides *which* field is a **user story** — a sentence in the shape:

> **As a** [kind of person], **I want to** [do something], **so that** [reason].

Real ones:

> As someone with too many half-read books, I want to record what page I
> stopped on, so that I can pick one back up without hunting for my place.

> As someone who cooks the same six things, I want to tag each recipe with how
> long it takes, so that I can find something quick on a weeknight.

The field falls out of the story. "Page number" is a number input because the
story is about a number. "How long it takes" is a select with a few sensible
options, not free text, because the story is about filtering later.

**Write the story first.** If you pick the field first you will end up with a
field nobody needed, and it shows.

## What it has to do

**1. Your new field, working end to end.**

A real, controlled form control — a **date**, a **select**, a **number**, a
**textarea**, a **checkbox** — not just a second box for more text.

- [ ] controlled — `value` and `onChange`, the way every input you have built
      this semester works
- [ ] **saved to the server** and still correct after a refresh
- [ ] **visible in the list**, not just stored
- [ ] **editable**, not only set once at creation
- [ ] **it serves the user story.** You can say which sentence it came from

One field done properly beats three done halfway.

**2. Full CRUD, persisted.** Create, read, update, delete — all four, all
surviving a refresh. This already works; do not break it.

**3. The three states.** Loading, empty, and error. The error message should
tell the user something true and useful. "Is `npm run server` running?" counts.

**4. Styled, and working on a phone.** This is the other half of the grade and
it is the half people skip.

Default Tailwind spacing on a white page is where you *start*, not where you
stop. A deliberate app has: a real title, type that establishes a hierarchy, a
colour choice that suits the subject, consistent spacing, and states that look
intentional — including what it looks like with nothing in it.

**It has to hold up at phone width.** You will demo it in a narrow viewport, so
build it that way rather than discovering the problem on the day.

Ask yourself: if a stranger opened this, would they know what it is for inside
five seconds?

**5. Two checklists.** See below — these are a deliverable, not a suggestion.

**6. A `README.md`** in the project folder:

- what the app is for and who would use it
- **your user story**
- how to run it — both commands, including `npm run server`
- **props or Context, and why you chose it.** One honest paragraph. Either
  answer is correct; having a reason is the requirement
- what you would add with another week

## The two checklists

This is the part people find most useful afterwards, so do it properly.

**Before you write any code**, write a **developer checklist**: every step you
think it will take to add your field. Be specific. "Add the input to
TodoCreate." "Add the field to the POST body." "Show it in TodoItem."

**After it works**, write a **revised checklist** of what you *actually* had to
do.

Then compare them. **What did you forget?** Almost everybody forgets at least
one of these:

- the field has to be in the *edit* form too, not just the create form
- PUT replaces the whole record, so the field has to be in that request
- the existing rows in `db.json` do not have the field at all — what does your
  app render for them?
- an empty value is not the same as zero or "not set"

The gap between your two lists is the most interesting thing you will produce
this semester. Put both in the README, and talk about the gap when you present.

## The presentation

**Five minutes, in class Tuesday of Week 09.** A slide deck is strongly
recommended — it keeps you to time and stops the demo from wandering.

Cover, in this order:

1. **Elevator pitch** — one to three sentences. What the app is and who it is
   for.
2. **Your user story**, and the field it produced.
3. **Your developer checklist** — what you thought it would take.
4. **Your revised checklist** — what it actually took, and what you forgot.
5. **Live demo.** Add something, edit it, delete it, refresh. **Show it at
   phone size** — use the responsive mode in Chrome dev tools, or just drag
   your window narrow and portrait. Check this works *before* class.
6. **Code walkthrough of the new field.** Where it lives in the form, how it
   gets to the server, how it comes back, and how it serves the story. If you
   cannot explain a line, do not show it.

Laptops closed while other people present. Participation is 25% of your grade
and this is one of the days it is most visible.

## What is being graded

| | |
|---|---|
| **It works** | CRUD persists, the new field works end to end, no console errors |
| **It is driven by the story** | The field answers a real need, not "I needed a field" |
| **State lives in the right place** | Not everything in `App`, not everything in Context. You can explain each choice |
| **Components do one job** | Split sensibly, props named for what they are, no 200-line files |
| **It looks deliberate, and works small** | Design decisions that hold together, at laptop and phone width |
| **It is documented** | README with the story, both checklists, and the props/Context reasoning |

## Scope, honestly

This should be a **one-screen app, done well**. Not multiple pages, not
authentication, not a real database. You have about two weeks alongside other
coursework.

If you want the stretch: filtering or sorting *by your new field* (which is the
natural payoff of the user story), a search box, a second field, optimistic
updates. All optional, all noticed, none of them a substitute for the six
requirements above.

## Allowed and encouraged

- Starting from your Week 06 or Week 07 code. That is the assignment, not
  cheating.
- Looking things up, reading docs, adapting a tutorial — as long as **you can
  explain every line you keep.** If you cannot explain it, you cannot submit
  it.
- Asking me. Email with a link to the relevant files in your repo and the
  specific problem, and we will sort it out.

## Submitting

A `MIDTERM` folder in your class repo, with the project inside it,
`node_modules` gitignored, and your slides (or a markdown version of them) in
the folder too. Push early and often — "it was on my laptop" is not a version
of "it was in the repo."
