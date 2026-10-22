# Inner Calm — study web app

A small web app for the **Inner Calm** pilot (meditation during prolonged fasting, Buchinger Wilhelmi).
Questionnaires follow the study brief *"Flywheel 1 brief on meditation"*, section 18.2.

Live at **https://test.buchinger-science.com** · Admin at **https://test.buchinger-science.com/admin**

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
| `server.js` | API: accounts, journey, answers, admin |
| `src/schedule.js` | Builds the journey from the stay dates |
| `src/scheduler.js` | Checks every minute and sends the 06:00 emails |
| `src/mailer.js` | Email texts (4 languages) and SMTP |
| `src/export.js` | Excel export and scores |
| `public/` | Participant app (`index.html`, `app.js`, `i18n.js`) and admin (`admin.html`, `admin.js`) |

## Before collecting real data

- **Translations:** WHO-5 and PROMIS have official DE/FR/ES versions. Replace the working translations in `shared/questionnaires.js` with the official ones.
- **mPERMA response scale:** the brief says the validated scale must be kept exactly. The app uses 0–10 ("Not at all" → "Completely"), so confirm the anchors.
- **PROMIS scale:** the brief specifies 0–5, while the official PROMIS form uses 1–5. Decide which one to use.
- **Consent text:** the current text is a placeholder for internal testing.
