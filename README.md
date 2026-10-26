# Inner Calm — study web app

A small web app for the **Inner Calm** pilot (meditation during prolonged fasting, Buchinger Wilhelmi).
Questionnaires follow the study brief *"Flywheel 1 brief on meditation"*, section 18.2. Colours follow the Buchinger Corporate Identity Guidelines (Dark Blue `#000051`, Off-white `#fcfaf2`, secondary colours used sparingly).

Live at **https://test.buchinger-science.com** · Admin at **https://test.buchinger-science.com/admin**

## The meditation programme

Each day of the stay has a short practice inspired by Father **Niklaus Brantschen SJ**, from his lecture *"Fasting and Silence: Twin Companions"*. The text lives in `shared/programme.js`.

- **Day *k* opens at 06:00** with three elements: a short theme, an excerpt and **one seated meditation of 15 minutes (Days 1–3) or 20 minutes (Days 4–10)**, plus a timer tip. Days 2, 4 and 8 add a one-line *Also today* suggestion (a walk without the phone, a silent meal, an hour of digital silence) that does not count as meditation time. Reading takes about a minute, and the page closes with *"Your practice for today is ready. You can now put your phone away."*
- The **evening journal** (Q2) sits below it, folded behind one button so the morning screen stays short.
- **Progression of the sittings:** simply sitting → sitting with impulses → the breath → voluntary silence → observing thoughts → listening inward → the present moment → protected time → no objective → choosing one practice to keep.
- **Stays shorter than 10 days** get Day 10 ("Taking silence with you") on their last day. **After Day 10** there is no new practice; the page says the programme has ended.
- **No gamification:** no quizzes, badges, streaks, points or sharing, and the only email is the 06:00 one.

## Measuring meditation

- **Daily journal (Q2), day *k*:** *"Did you meditate yesterday ({date})?"* and, if yes, total minutes. The date is printed in the question, so answers stay unambiguous even when filled in late. Day 1 refers to the day before arrival (programme day 0).
- **Closing questionnaire:** asks the same about the last programme day.
- **Welcome questionnaire:** meditation background, shown after the well-being scales so it doesn't colour them: ever practised, years, frequency in the past month, usual minutes, main style, retreat experience, and expectation that daily meditation will help.
- **Export:** a `meditation_log` sheet (one row per participant per day) and a `meditation_summary` sheet (programme days, days reported, days meditated, **days with ≥ 15 min**, total minutes, mean minutes).

## What a participant sees

1. **Create an account.** They enter an email and password and tick the consent box.
2. **Welcome questionnaire (Q1, baseline).** They give their clinic, arrival date and departure date, then answer WHO-5, PROMIS Meaning & Purpose 4a and the personal-growth items.
3. **Their fasting journey.** This is a timeline that unlocks day by day:
   - **Day 1 … Day n: daily journal (Q2).** Each one opens at 06:00 on its day and an email is sent. The questions cover clarity, positive emotions, creativity, meditation yes/no and minutes, and sleep.
   - **Departure day: closing questionnaire (Q1, end).** Same questions as at baseline.
4. Once a questionnaire is saved it is **locked and read-only**.
5. The **EN / DE / FR / ES** buttons switch the language. Emails are sent in the language the participant last chose.

## Study timeline (the rules in the code)

| Questionnaire | Opens | Can be answered until | Email |
|---|---|---|---|
| Q1 baseline | at sign-up | — | none |
| Q2 Day *k* (D1 = arrival day … Dn = day before departure) | day *k*, 06:00 | end of departure day, then **missed** | 06:00 on day *k* |
| Q1 end | departure day, 06:00 | departure + 7 days | 06:00 on departure day |

- The time zone is `Europe/Berlin` (CET/CEST). It applies to both clinics, and summer/winter time is handled automatically.
- **No reminders.** Each new email acts as the reminder.
- If someone signs up late, the days already passed are open straight away but get no email.
- If the server is down at 06:00, that day's email goes out once the server is back, on the same day. Emails are never sent twice.
- These rules can be changed in `src/schedule.js` (days) and in `OPEN_HOUR` / `STUDY_TZ` (time).

## Admin page (`/admin`)

- **Excel export** with four sheets:
  - `participants`: the only sheet containing emails
  - `Q1_baseline_end`: answers plus WHO-5 raw/percent, the Meaning & Purpose sum and the growth mean
  - `Q2_daily`: answers plus the clarity mean and the positive-emotion mean
  - `schedule`: every planned questionnaire with its status, for feasibility analysis
- **Database (.sqlite)**: a consistent copy of the complete raw database.
- **Correct dates**: if someone entered the wrong dates or extends their stay, the unanswered part of the journey is rebuilt. Answered questionnaires are kept.
- **Email log**: the last 100 emails with their status. As long as SMTP isn't configured, emails are only *logged* here, with their link, so you can test without sending anything.

## Server setup (once)

On the server, inside `/var/www/webapp-test`:

```bash
cp .env.example .env
nano .env          # set ADMIN_PASSWORD (and later the Brevo settings)
docker compose up -d --build
```

The database lives in the Docker volume `innercalm-data`, so it survives redeploys. Never delete that volume.

## Brevo (email sending)

1. Create a free account at **brevo.com**. The free plan allows 300 emails a day.
2. **Authenticate the domain.** Go to *Senders, Domains & Dedicated IPs → Domains → Add a domain* and enter `buchinger-science.com`. Brevo shows 3–4 DNS records (a `brevo-code` TXT, DKIM and DMARC). Add each one in **Hostinger → buchinger-science.com → DNS**, then click *Authenticate* in Brevo. DNS can take up to an hour.
3. **Add the sender.** Under *Senders*, add `study@buchinger-science.com` with the name "Inner Calm Study".
4. **Create an SMTP key.** Under *SMTP & API → SMTP*, note the **login** (it looks like `xxxx@smtp-brevo.com`) and create an **SMTP key**.
5. Put these values in the server `.env`:
   ```
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_USER=<login>
   SMTP_PASS=<SMTP key>
   ```
   Then run `docker compose up -d`. The admin page banner turns green.
6. To test, use *Forgot your password?* with your own account and check that the email arrives.

## Development (on a Mac)

```bash
npm install
ADMIN_PASSWORD=localtest123 npm run dev     # http://localhost:3000
```

## Files

| Path | Purpose |
|---|---|
| `shared/questionnaires.js` | All items, scales and translations; used by both browser and server |
| `shared/programme.js` | The 10-day meditation programme (EN/DE/FR/ES) and the day-to-practice rule |
| `server.js` | API: accounts, journey, answers, admin |
| `src/schedule.js` | Builds the journey from the stay dates |
| `src/scheduler.js` | Checks every minute and sends the 06:00 emails |
| `src/mailer.js` | Email texts (4 languages) and SMTP |
| `src/export.js` | Excel export and scores |
| `public/` | Participant app (`index.html`, `app.js`, `i18n.js`) and admin (`admin.html`, `admin.js`) |

## Before collecting real data

- **Programme translations:** Father Brantschen lectured in German, so check the German excerpts against the original lecture if possible. The Hilde Domin line (Day 9) is quoted only in English, from the supplied text; the translations describe her image instead of quoting the poem, which is still under copyright.

- **Translations:** WHO-5 and PROMIS have official DE/FR/ES versions. Replace the working translations in `shared/questionnaires.js` with the official ones.
- **mPERMA response scale:** the brief says the validated scale must be kept exactly. The app uses 0–10 ("Not at all" → "Completely"), so confirm the anchors.
- **PROMIS scale:** the brief specifies 0–5, while the official PROMIS form uses 1–5. Decide which one to use.
- **Consent text:** the current text is a placeholder for internal testing.
