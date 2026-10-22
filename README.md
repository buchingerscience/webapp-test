# WEBAPP-TEST — minimal app on the Buchinger Science pipeline

Same chain as the other apps: **git push → GitHub Actions → SSH into VPS → git pull + docker compose → shared nginx → https://test.buchinger-science.com**

No dependencies: `server.js` uses only Node's built-in `http`. Health check at `/health`.

## One-time setup

### 1. DNS (Hostinger → buchinger-science.com → Gérer le nom de domaine → DNS)
Add an **A** record: name `test`, points to `31.97.68.87`, default TTL.

### 2. GitHub (your account)
Create a new **public** repo `webapp-test` (nothing secret in it), empty — no README.
From this folder on your Mac:
```bash
git init && git add . && git commit -m "Initial test app"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/webapp-test.git
git push -u origin main
```
(The first Actions run will fail — secrets aren't set yet. That's expected.)

### 3. Deploy key: GitHub Actions → VPS (on the server)
```bash
ssh-keygen -t ed25519 -f ~/.ssh/robin-github-deploy -N "" -C robin-github-deploy
cat ~/.ssh/robin-github-deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/robin-github-deploy        # copy the whole private key, BEGIN…END lines included
```
GitHub repo → Settings → Secrets and variables → Actions → New repository secret:
- `VPS_HOST` = `31.97.68.87`
- `VPS_USER` = `root`
- `VPS_SSH_KEY` = the private key you just copied

### 4. First deploy (on the server)
```bash
git clone https://github.com/<YOUR-USERNAME>/webapp-test.git /var/www/webapp-test
cd /var/www/webapp-test && docker compose up -d --build
docker ps | grep webapp-test
```
Must be done BEFORE nginx: nginx refuses to load a config pointing at a container that doesn't exist.

### 5. nginx + HTTPS certificate (on the server)
The shared nginx config is `/opt/webapp-fast-track/nginx.conf` — it serves ALL five apps. Always back up and run `nginx -t` before reloading. Edit with `nano` (not vim: the file is bind-mounted into the container).
```bash
cd /opt/webapp-fast-track
cp nginx.conf nginx.conf.bak-$(date +%F)
nano nginx.conf
```
a) Paste `nginx/1-http-block.conf` just after the elevate HTTPS block (before `# --- report...`). Save (Ctrl+O, Enter, Ctrl+X).
```bash
docker compose exec nginx nginx -t && docker compose exec nginx nginx -s reload
docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
  -d test.buchinger-science.com --email admin@buchinger-science.com --agree-tos --no-eff-email
```
b) Paste `nginx/2-https-block.conf` right after the block from a), then:
```bash
docker compose exec nginx nginx -t && docker compose exec nginx nginx -s reload
```
If `nginx -t` ever fails: `cp nginx.conf.bak-<date> nginx.conf` and nothing has been broken (you only reload after a passing test).

Open https://test.buchinger-science.com

## Day-to-day
Edit → `git push` → GitHub Actions deploys automatically (repo → Actions tab to watch).
