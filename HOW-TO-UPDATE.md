# Inner Calm web app: summary and change procedure

*Last updated: 9 November 2026*

This file has two parts. **Part 1** explains what exists and how the pieces fit together. **Part 2** is the procedure to follow every time you change the app. Follow Part 2 step by step and you won't get stuck.

---

## Part 1: What exists

### The pieces at a glance

| What | Where |
|---|---|
| **The app (code) on your Mac** | `~/Documents/BUWI/Research_Development/Webapp/WEBAPP-buchinger-science.com/WEBAPP-TEST` |
| **GitHub (master copy of the code)** | `github.com/buchingerscience/webapp-test` (company account `buchingerscience`, with the SSH key of your MacBook) |
| **Server** | Hostinger VPS `srv852419`, IP `31.97.68.87`, login `ssh root@31.97.68.87` with your SSH key |
| **App folder on the server** | `/var/www/webapp-test` |
| **Server settings (secret)** | `/var/www/webapp-test/.env`: `APP_URL`, `ADMIN_PASSWORD`, Brevo `SMTP_*`, `MAIL_FROM`, `MAIL_REPLY_TO`. Never in git. |
| **Running app** | Docker container `webapp-test` (port 3000, internal only) |
| **Database** | SQLite in the Docker volume `innercalm-data`. It survives redeploys. **Never delete it once real data exists.** |
| **Shared nginx (HTTPS for all 5 sites)** | `/opt/webapp-fast-track/nginx.conf`, which belongs to the FAST-TRACK app |
| **Live site** | https://innercalm.buchinger-science.com |
| **Admin page** | https://innercalm.buchinger-science.com/admin (password = `ADMIN_PASSWORD` in `.env`) |
| **Domain and DNS** | Hostinger → buchinger-science.com → DNS (A records `innercalm` and `test` → `31.97.68.87`, plus Brevo records; `test` is kept as an alias) |
| **Email sending** | Brevo SMTP. Sender `study@buchinger-science.com`, replies go to `buchinger.forschung@gmail.com`. The SMTP key expires after **90 days without sending**. |

### How a change travels

```
Your Mac (WEBAPP-TEST)  →  git push  →  GitHub  →  git pull on the server  →  docker rebuild  →  live site
```

A GitHub Action (`.github/workflows/deploy.yml`) can do the server part automatically on each push, but only if the repo has the secrets `VPS_HOST`, `VPS_USER` and `VPS_SSH_KEY`. Check the **Actions** tab on GitHub after a push. If it isn't green, deploy by hand (Part 2, step 6).

### What the app does today

- **Study:** "Inner Calm", silence and meditation during the fast. One group; everyone gets the guidance.
- **Sign-up:** email and password, consent, then the **welcome questionnaire**:
  - stay dates and clinic
  - WHO-5, PROMIS Meaning & Purpose and personal growth
  - meditation habits
- **Each day from 06:00 (Europe/Berlin):** an email, and the day unlocks with:
  - a theme and an excerpt from Niklaus Brantschen SJ
  - a **moment of stillness** (1 min on days 1–3, 2 min on days 4–6, then 5 min) with a built-in timer and gong
  - a pointer to the clinic's own meditation programme
- **Each evening:** a 90-second journal with clarity, positive emotions, creativity, moments of stillness yesterday, clinic class (and its minutes), and sleep.
- **Longer stays:** from day 9, days 2–8 repeat as "Reinforcement".
- **Departure day:** a closing questionnaire and a take-home card.
- **Admin:** participant list, email log, date corrections, an **Excel export** (with meditation log and summary) and the raw **SQLite** download.
- **Languages:** EN / DE / FR / ES. Design follows the Buchinger CI (brand fonts and logo, "Buchinger Times" style).

### Session history (22 Oct – 9 Nov 2026)

1. **Took over Alfred Holley's setup.**
   - Mapped the 5 apps (FASTEX, FAST-TRACK, ELEVATE, dash-app, report-generator), all on one Hostinger server behind one shared nginx.
   - Got root access with your own SSH key.
2. **Built a test app.** It deploys through the same pipeline from the company GitHub account `buchingerscience`, at innercalm.buchinger-science.com.
3. **Turned it into the Inner Calm study app:** accounts, journey, questionnaires, a 06:00 scheduler, admin and Excel export.
4. **Email** via Brevo, with domain authentication in Hostinger DNS.
5. **Added** the Brantschen 10-day programme, the Buchinger CI, longer daily sittings and meditation questions. Randomisation into two groups was added and then **removed** (back to one group).
6. **Fixed along the way:**
   - stale browser files: every deploy now stamps the files with a version
   - a half-committed update that crashed the server
   - nginx no longer fails when the test app is down
7. **9 Nov:** the moments of stillness patch (from another conversation) was applied, tested and copied to WEBAPP-TEST, ready to push.

---

## Part 2: Procedure for every change

### Step 0: One-time setup (already done, for reference)

- **Node.js LTS** installed on the Mac (nodejs.org), then `npm install` inside WEBAPP-TEST.
- **Your Mac's SSH key** registered on GitHub (account `buchingerscience`) and on the server.

### Step 1: Start from the latest version

Another conversation (or a colleague) may have pushed changes. **Always pull first.**

```bash
cd ~/Documents/BUWI/Research_Development/Webapp/WEBAPP-buchinger-science.com/WEBAPP-TEST
git pull
git status
```

`git status` should say *"nothing to commit, working tree clean"*. If it lists changed files you don't recognise, stop and ask before going further.

### Step 2: Make the change

Choose one of three routes:

**A. You or Claude edit files directly in WEBAPP-TEST.** Where things live:

| What | File |
|---|---|
| Programme texts | `shared/programme.js` |
| Questions | `shared/questionnaires.js` |
| Interface texts | `public/i18n.js` |
| Look | `public/styles.css` |
| Emails | `src/mailer.js` |

**B. You received a `.patch` file** (e.g. from another conversation). Put it in WEBAPP-TEST, then:

```bash
git am --3way name-of-file.patch
```

This applies the change *and* commits it with its own description; skip step 4 afterwards. If it reports a conflict, run `git am --abort` (which puts everything back) and send the patch to Claude.

**C. Ask Claude in a conversation linked to your Mac.** Ask it to "apply, test locally, and verify the files landed in WEBAPP-TEST".

### Step 3: Check it on your Mac before anything goes live

```bash
ADMIN_PASSWORD=localtest123 npm run dev
```

- Open **http://localhost:3000** and **http://localhost:3000/admin** (password `localtest123`).
- Create a test account. Use an **arrival date a few days in the past**, so several days are unlocked.
- Click through: welcome questionnaire → a day → journal → admin export.
- Stop with **Ctrl + C**.

Local test data lives in the `data/` folder, which is never pushed and never reaches the live site. Emails are not sent locally; they appear in the local admin email log.

### Step 4: Save the change and send it to GitHub

```bash
git add -A
git status
git commit -m "Short description of the change"
git push
```

`git status` shows exactly what will be sent; check that no unexpected files are listed. `git push` should end with `main -> main`.

> **Lesson from 26 Oct:** commit **all** changed files together. A half-committed update (some files new, some old) crashed the live app with `ERR_MODULE_NOT_FOUND`. `git add -A` avoids this.

### Step 5: Did GitHub deploy it automatically?

On github.com → `buchingerscience/webapp-test` → **Actions**:

- **Green tick:** go to step 7.
- **Red cross, or nothing ran:** step 6.

### Step 6: Deploy by hand on the server

```bash
ssh root@31.97.68.87
```
then paste as **one line**:
```bash
cd /var/www/webapp-test && git pull && docker compose up -d --build --force-recreate && sleep 5 && docker ps --filter name=webapp-test --format "{{.Status}}"
```

- **Expected:** `Up … (health: starting)` or `Up … (healthy)`.
- **`--force-recreate` is required.** Without it, the old version can keep running.
- **No nginx reload is needed** (fixed on 26 Oct).

### Step 7: Check the live site

- Open https://innercalm.buchinger-science.com. Thanks to the version stamps, a normal refresh is enough.
- Create a test account and look at the part you changed.
- Check the admin page still loads.

---

## When something goes wrong

| What you see | What it means | What to do |
|---|---|---|
| **502 Bad Gateway** | The app container is down or crashing | On the server: `docker logs webapp-test --tail 20`. The error is at the bottom; send it to Claude. |
| `ERR_MODULE_NOT_FOUND` in the logs | Some files were committed without others | On the Mac: `git status`, then `git add -A && git commit -m "Complete update" && git push`, then step 6 again |
| The site still shows the old version | Container not recreated | Step 6 again (with `--force-recreate`) |
| The terminal shows `>` and waits | A pasted command was cut or has stray characters | Press **Ctrl + C** and paste again as one line |
| `git push` → *Authentication failed* | GitHub doesn't recognise the Mac | `ssh -T git@github.com` should answer "Hi buchingerscience!". The remote must be `git@github.com:buchingerscience/webapp-test.git`. |
| `git pull` on the Mac → *conflict* | Someone else changed the same lines | Don't force anything. Send the output to Claude. |
| Emails stop arriving | Brevo SMTP key expired (90 days without sending) or Brevo issue | Admin page → email log → status/error. Make a new key in Brevo (SMTP & API → SMTP) and replace `SMTP_PASS` in `/var/www/webapp-test/.env`, then `docker compose up -d --force-recreate` |
| You need to undo the last change | — | On the Mac: `git revert HEAD` (creates an "undo" commit), `git push`, then step 6 |

---

## Never do this

- **Never delete the `innercalm-data` volume** once real participants exist. It contains all the answers. Before risky changes, download a backup from the admin page (Database .sqlite).
- **Never put `.env` (passwords, Brevo key) into git.** It lives only on the server.
- **Shared nginx config:** `/opt/webapp-fast-track/nginx.conf` serves **all five sites**. Always back it up, run `docker compose exec nginx nginx -t` before reloading, and never edit it with `vim` or `sed -i`: the file is mounted into Docker, so use `nano`, or write the new content into the existing file.
- **Never edit code directly on the server.** Changes always go Mac → GitHub → server. Otherwise the next `git pull` on the server fails.

---

## Before the first real participant

- **Wipe the test data** (on the server; this permanently deletes all accounts and answers):
  ```bash
  cd /var/www/webapp-test && docker compose down && docker volume rm innercalm-data && docker compose up -d
  ```
- **Questionnaires and texts:**
  - Official DE/FR/ES translations of WHO-5 and PROMIS
  - Confirm the mPERMA response anchors
  - PROMIS scale: 0–5 (as in the brief) or the official 1–5?
  - WHO-5 "last two weeks" at the end of a short stay
  - Final consent text
- **Brevo:** send a real test email (Forgot password) and check it isn't in spam.

## Open items from the takeover of Alfred Holley's setup

- **Server access:** remove his old SSH keys from the server (`~/.ssh/authorized_keys`: the key without a name and possibly `forschung@…`) once his repos have moved.
- **Repos:** transfer his GitHub repos (FASTEX, FAST-TRACK, ELEVATE, dash-app, report-generator) to the `buchingerscience` organisation and re-enter their deploy secrets.
- **Notices:** check who reads `admin@buchinger-science.com` (Let's Encrypt certificate notices).
- **Hosting:** the Hostinger server is not HDS-certified. Check hosting requirements before collecting identifiable health data.
