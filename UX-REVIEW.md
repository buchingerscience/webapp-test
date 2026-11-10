# Inner Calm: UX/UI review, November 2026

**Goal (client brief):** the text is too bulky, some parts have too much text, and the app should be intuitive.

**Method:** five improvement loops.
- **Expert pair:** Ana (UX, health apps for older adults, content design) and Jonas (UI, editorial brand systems, accessibility). They audited, discussed and specified the changes, and the changes were implemented.
- **Patient panel:** six regular-guest personas tested each version from phone screenshots in four languages, at iPhone SE size and at 130% zoom. The panel was run by a separate reviewer that only saw the screens, not the design reasoning.
  - Ingrid, 71, DE, iPhone SE
  - Michel, 58, FR, impatient
  - Carmen, 64, ES, arthritis
  - Thomas, 45, sceptical
  - Margaret, 77, low vision
  - Lena, 38, meditates daily
- **Automated test bench, each round:**
  - word counts and scroll length
  - sideways overflow in all four languages
  - whether "Open today" and Start appear on the first screen of a small phone
  - counter/button collisions
  - a full regression run: sign-up, steps, journal, closing questionnaire, timer, language switch, admin export

**Fixed by the study:** questionnaire wording, response options, item order and timing. `shared/questionnaires.js` is byte-for-byte unchanged.

## Results

### Panel scores (Clarity / Effort / Calm and look / Would use daily)

| Guest | v0 | v1 | v2 | v3 | v4 | v5 |
|---|---|---|---|---|---|---|
| Ingrid (DE, SE) | 4/5/7/5 | 7/7/8/7 | 8/7/8/8 | 9/8/9/8 | 9/8/9/8 | 9/8/9/8 |
| Michel (FR) | 5/4/7/4 | 7/6/8/5 | 9/8/8/7 | 8/7/8/7 | 8/8/8/7 | 8/8/8/8 |
| Carmen (ES) | 6/5/7/5 | 7/7/8/7 | 8/8/8/8 | 8/7/8/8 | 9/8/8/8 | 9/8/8/8 |
| Thomas | 6/4/6/4 | 7/6/7/6 | 8/8/8/7 | 9/8/8/7 | 9/8/8/8 | 9/8/8/8 |
| Margaret (130%) | 4/4/6/4 | 6/6/7/5 | 7/7/8/6 | 8/6/8/6 | 8/7/8/7 | 8/8/8/7 |
| Lena | 6/6/7/6 | 8/7/8/7 | 9/8/8/8 | 9/8/8/8 | 9/8/9/8 | 9/8/9/8 |
| **"Ready to stop?"** | 0/6 | 2/6 | 4/6 | 3/6 | 6/6 | **6/6** |

In v3 the vote dipped to 3/6 because of one new bug: the journal counter collided with the save button on narrow phones. It was fixed in v4.

### Less text, less scrolling (English, 390 px phone)

| Screen | Words before → after | Phone screens before → after |
|---|---|---|
| Journey | 325 → 173 | 3.3 → 2.0 |
| Day page | 279 → 176 | 3.1 → 2.0 |
| Day page + journal | 533 → 272 (journal is now its own view) | 5.9 → 3.6 |
| Welcome questionnaire | 501 on one page → 5 short steps | 6.6 → 1–3 per step |
| Departure day | 610 → 221 + 2 short steps | 7.2 → 3.1, then 1.3–1.4 per step |
| Register | 112 → 69 | unchanged |

## What changed, by round

### v1 (expert audit + panel baseline)

- **Journey:**
  - a "Today" card with one button
  - one-line day rows
  - "Day 5 of 10" instead of "1 of 12 completed"
  - the long intro moved behind "How it works"
- **Day page:**
  - smaller header
  - "Today's thought" with the first paragraph and "Read the full thought"
  - the moment of stillness as numbered steps, with Start right below
  - the timer opens full screen
  - "Looking for more?" shrunk to one line
- **Questionnaires:**
  - welcome and closing split into steps ("Step 2 of 5")
  - compact WHO-5 options
  - 0–10 scales on two rows of large buttons
  - calmer save note
  - departure: questionnaire first, take-home card after saving
- **Register:** consent as three bullets, with the full text one tap away.
- **Everywhere:** darker secondary text and language-correct quotation marks.

### v2

- **Day page:** the moment of stillness and Start come first, and the day's theme sits in the header.
- **Journal:**
  - opens as its own view
  - "x of 10 answered" counter
  - Save stays an outline button until everything is answered
- **Journey:**
  - today also stays in the list
  - no guilt-inducing markers on earlier days
  - reinforcement days say "Repeat of day 2"
- **Header:** compact language selector, and log out moved to the bottom.
- **Take-home quote:** now starts at the beginning of the passage, not mid-thought on "Both may offer…".

### v3

- **Overflow:** fixed German sideways overflow.
- **Large text:** the journey's header was trimmed so "Open today" stays on the first screen at 130% zoom.
- **Departure ending:** no repetition.
- **Buttons:** Previous and Save side by side.
- **Journey:** darker locked days.

### v4

- **Save bar:** counter on its own line above a full-width Save.
- **Journal header:** compact while the journal is open, so the first question is visible at 130%.

### v5

- **Polish:**
  - the "saved" notice now sits inside the page
  - typographic apostrophes in French and Spanish
  - one consistent label style for all scales
- **Accessibility, required by the experts before sign-off:**
  - the countdown is no longer read out every second by screen readers
  - the breathing animation respects "reduce motion"
  - focus moves into the timer and back out, and Escape closes it
  - stronger focus ring

## Sign-off

- **Patient panel:** 6/6 "ready to stop improving".
- **Ana (UX):** "We did our best: yes. The brief is met with evidence, and the study's integrity is intact."
- **Jonas (UI):** "Yes, conditionally on the four accessibility fixes." All four are implemented and checked automatically.

## For the study team to decide (not design work)

1. **Consent text:** ethics or legal should approve the three-bullet summary. The full text remains one tap away.
2. **Translations:** official DE/FR/ES versions of WHO-5 and PROMIS, and confirmation of the mPERMA anchors (already flagged in the code).
3. **Programme content:** approve the take-home quote change: the full closing passage, "Fasting and silence are twin companions…", instead of starting at "Both may offer…".
4. **Practice instructions:** the panel found step 1 of some moments of stillness to be framing rather than an instruction ("Just as the body takes a rest…"). This is Gilbert Grimeau's content and was left unchanged.
5. **Practice length:** guests can switch the timer to 1, 2 or 5 minutes. This existed before; the study lead should confirm it is fine.

## Known minor points, deliberately left

- The timer's four corner arrows feel slightly "app-y" to Lena, who said she can live with them.
- At 130% zoom in German, the practice steps start just below the first screen. Start itself is visible.

## Terminology (10 Nov 2026)

"Meditation snacks" was renamed to fit the clinical concept and the brand tone. The new names are:

| Language | Name |
|---|---|
| EN | moment(s) of stillness |
| DE | Moment(e) der Stille |
| FR | instant(s) de quiétude |
| ES | momento(s) de quietud |

The rename covers the interface, the programme, the morning emails and the journal question on yesterday's practice. The comparison with "exercise snacks" was removed from the introduction.

Internal field names (`snacks_yesterday`, `snack_band` and the Excel columns derived from them) are unchanged, so data and analysis scripts stay compatible.
