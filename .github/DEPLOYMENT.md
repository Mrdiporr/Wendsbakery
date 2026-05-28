# Deployment Guide for Wendy's Bakery

Complete guide for setting up and managing automated CI/CD deployments using GitHub Actions.

## 📋 Prerequisites

### 1. GitHub Secrets Configuration

Configure these secrets in your GitHub repository:
**Settings → Secrets and variables → Actions**

#### FTP Credentials (for cPanel file uploads)
- `CPANEL_FTP_HOST`: Your cPanel server hostname (e.g., `your-domain.com`)
- `CPANEL_FTP_USER`: cPanel FTP username
- `CPANEL_FTP_PASSWORD`: cPanel FTP password

#### SSH Credentials (for running commands on server)
- `CPANEL_SSH_HOST`: cPanel server SSH hostname
- `CPANEL_SSH_USER`: SSH username
- `CPANEL_SSH_KEY`: Private SSH key (full content with BEGIN/END lines)

### 2. Generate SSH Keys for cPanel

```bash
# Generate new SSH key pair
ssh-keygen -t rsa -b 4096 -f ~/.ssh/cpanel_deploy -N ""

# View public key - add to cPanel ~/.ssh/authorized_keys
cat ~/.ssh/cpanel_deploy.pub

# View private key - copy to GitHub Secrets
cat ~/.ssh/cpanel_deploy
```

## 🔄 CI/CD Workflows

### `.github/workflows/ci-hub.yml` - Laravel Backend
**Triggers:** Push/PR to `hub/**`, changes to workflow file

**What it does:**
- ✅ Sets up PHP 8.2 environment
- ✅ Installs Composer dependencies (cached)
- ✅ Creates `.env` file from `.env.example`
- ✅ Runs database migrations on SQLite
- ✅ Checks code style with Laravel Pint
- ✅ Lints PHP files
- ✅ Uploads build artifacts for deployment

**Status indicators:**
- 🟢 Green = All checks passed
- 🔴 Red = Build failed (check logs in Actions tab)

### `.github/workflows/ci-storefronts.yml` - Next.js Apps
**Triggers:** Push/PR to `bakery/**`, `fashion/**`, or workflow changes

**What it does (for each app):**
- ✅ Sets up Node.js 18.x
- ✅ Installs npm dependencies (cached)
- ✅ Runs ESLint linting
- ✅ Builds production bundle
- ✅ Caches build artifacts

### `.github/workflows/deploy-cPanel.yml` - Production Deployment
**Triggers:** Push to `main` branch OR manual dispatch

**Deployment sequence:**
1. Deploy Hub (Laravel)
   - Uploads via FTP
   - Runs migrations with `--force`
2. Deploy Bakery (Next.js)
   - Builds locally
   - Uploads to cPanel
   - Restarts PM2 app
3. Deploy Fashion (Next.js)
   - Builds locally
   - Uploads to cPanel
   - Restarts PM2 app

## 🚀 Quick Start

### Step 1: Add GitHub Secrets

Go to: `https://github.com/Mrdiporr/Wendsbakery/settings/secrets/actions`

Click **"New repository secret"** and add each:

```
CPANEL_FTP_HOST=your-domain.com
CPANEL_FTP_USER=ftpusername
CPANEL_FTP_PASSWORD=ftppassword
CPANEL_SSH_HOST=your-domain.com
CPANEL_SSH_USER=sshusername
CPANEL_SSH_KEY=-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
...
-----END RSA PRIVATE KEY-----
```

### Step 2: Merge to Main

```bash
git checkout main
git pull origin main
git merge deployment/github-actions-setup
git push origin main
```

The deployment branch is now live!

### Step 3: Test CI Pipeline

Create a test branch and PR:
```bash
git checkout -b test/verify-ci
echo "# Test" >> hub/README.md
git add hub/README.md
git commit -m "test: verify CI workflow"
git push origin test/verify-ci
```

Go to **Actions** tab and watch the workflow run!

### Step 4: Deploy to Production

Once tests pass on `main`:
```bash
# Any push to main triggers deployment
git push origin main
```

Monitor deployment: **https://github.com/Mrdiporr/Wendsbakery/actions**

## 🛠️ cPanel Server Setup

### Pre-Deployment Checklist

- [ ] PHP 8.2+ installed
- [ ] Composer installed globally
- [ ] Node.js 18.x installed
- [ ] PM2 installed: `npm install -g pm2`
- [ ] PM2 startup configured: `pm2 startup && pm2 save`
- [ ] FTP access enabled
- [ ] SSH access enabled

### Create Application Directories

```bash
# SSH into cPanel server
ssh user@your-domain.com

# Create app directories
mkdir -p ~/hub
mkdir -p ~/bakery-store
mkdir -p ~/fashion-store

# Set permissions
chmod 755 ~/hub ~/bakery-store ~/fashion-store
```

### Environment Files

**`~/hub/.env`** (created manually on server)
```
APP_NAME="Wendy's Bakery Hub"
APP_ENV=production
APP_KEY=base64:YOUR_KEY_HERE
APP_DEBUG=false
APP_URL=https://hub.wendysbakehouse.com

DB_CONNECTION=sqlite
DB_DATABASE=/home/username/hub/database/database.sqlite

WC_WEBHOOK_SECRET=your-secret

SANCTUM_STATEFUL_DOMAINS=wendysbakehouse.com,bakery.wendysbakehouse.com,fashion.wendysbakehouse.com
```

**`~/bakery-store/.env`**
```
NODE_ENV=production
NEXT_PUBLIC_ADMIN_API_URL=https://hub.wendysbakehouse.com/api
NEXT_PUBLIC_STORE_ID=bakery
PORT=3001
```

**`~/fashion-store/.env`**
```
NODE_ENV=production
NEXT_PUBLIC_ADMIN_API_URL=https://hub.wendysbakehouse.com/api
NEXT_PUBLIC_STORE_ID=fashion
PORT=3002
```

### PM2 App Configuration

Create `~/ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'bakery-store',
      script: './bakery-store/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'fashion-store',
      script: './fashion-store/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production' }
    }
  ]
};
```

Start apps:
```bash
pm2 start ecosystem.config.js
pm2 save
```

## 📊 Monitoring Deployments

### Real-time Logs
**GitHub Actions:** https://github.com/Mrdiporr/Wendsbakery/actions

### Server Logs
```bash
# SSH into cPanel
ssh user@your-domain.com

# Laravel logs
tail -f ~/hub/storage/logs/laravel.log

# PM2 logs
pm2 logs
pm2 logs bakery-store
pm2 logs fashion-store
```

## ❌ Troubleshooting

### FTP Connection Fails
```
Error: Failed to connect to FTP server
```
**Fix:**
- Verify FTP credentials in GitHub Secrets
- Check FTP is enabled: cPanel → FTP Accounts
- Ensure firewall allows port 21

### SSH Connection Fails
```
Error: ssh: connect to host [domain] port 22: Connection refused
```
**Fix:**
- Verify SSH credentials
- Check SSH is enabled: cPanel → SSH Access
- Test manually: `ssh -i ~/.ssh/cpanel_deploy user@host`

### Database Migration Fails
```
Error: Unable to locate migration files
```
**Fix:**
- Ensure `APP_KEY` is set in `.env`
- Check database file permissions: `chmod 666 ~/hub/database/database.sqlite`
- Manually run: `ssh ... php ~/hub/artisan migrate --force`

### Node.js App Won't Start
```
Error: Port 3001 already in use
```
**Fix:**
- Check PM2 status: `pm2 list`
- Kill existing process: `pm2 delete bakery-store && pm2 save`
- Check `.env` PORT is correct
- View logs: `pm2 logs bakery-store`

## 🔐 Security Best Practices

⚠️ **Never commit secrets** to the repository

✅ **Use GitHub Secrets** for all sensitive data

✅ **Rotate SSH keys** every 6 months

✅ **Limit FTP access** to necessary directories

✅ **Use strong passwords** for FTP/SSH

✅ **Enable HTTPS** on all production domains

✅ **Whitelist IPs** if possible

## 📝 Workflow Status Badges

Add to `README.md`:
```markdown
[![CI - Hub](https://github.com/Mrdiporr/Wendsbakery/actions/workflows/ci-hub.yml/badge.svg)](https://github.com/Mrdiporr/Wendsbakery/actions/workflows/ci-hub.yml)
[![CI - Storefronts](https://github.com/Mrdiporr/Wendsbakery/actions/workflows/ci-storefronts.yml/badge.svg)](https://github.com/Mrdiporr/Wendsbakery/actions/workflows/ci-storefronts.yml)
[![Deploy](https://github.com/Mrdiporr/Wendsbakery/actions/workflows/deploy-cPanel.yml/badge.svg)](https://github.com/Mrdiporr/Wendsbakery/actions/workflows/deploy-cPanel.yml)
```

## 📞 Support & Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Laravel Documentation](https://laravel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/)

---

**Need help?** Open an issue on GitHub or check the workflow logs in the Actions tab!