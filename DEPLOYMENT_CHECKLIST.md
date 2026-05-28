# Deployment Checklist - Wendsbakery

Use this checklist to ensure all applications are properly configured and deployed.

## Pre-Deployment (Local)

### Hub (Laravel)
- [ ] Clone repository: `git clone https://github.com/Mrdiporr/Wendsbakery.git`
- [ ] Navigate to hub: `cd hub`
- [ ] Run `composer install`
- [ ] Verify `.env` file exists with production settings
- [ ] Generate app key: `php artisan key:generate`
- [ ] Create SQLite database: `touch database/database.sqlite`
- [ ] Run migrations locally: `php artisan migrate`
- [ ] Test locally: `php artisan serve`

### Bakery Storefront
- [ ] Navigate to bakery: `cd ../bakery`
- [ ] Run `npm install`
- [ ] Verify `.env.local` file exists
- [ ] Build for production: `npm run build`
- [ ] Verify `.next/` build directory created
- [ ] Test build locally: `npm start`

### Fashion Storefront
- [ ] Navigate to fashion: `cd ../fashion`
- [ ] Run `npm install`
- [ ] Verify `.env.local` file exists
- [ ] Build for production: `npm run build`
- [ ] Verify `.next/` build directory created
- [ ] Test build locally: `npm start`

---

## cPanel Deployment

### Step 1: Domain & Subdomain Setup
- [ ] Create main domain: `wendysbakehouse.com`
- [ ] Create subdomain: `hub.wendysbakehouse.com`
- [ ] Create subdomain: `fashion.wendysbakehouse.com`
- [ ] Configure DNS (if needed)
- [ ] Wait for propagation (~24 hours)

### Step 2: Hub Deployment

#### Upload Files
- [ ] Create directory: `/home/username/hub/`
- [ ] Upload all hub files via FTP/File Manager
- [ ] Ensure `public/` directory exists
- [ ] Verify `.env` file is uploaded

#### Server Configuration
- [ ] Point `hub.wendysbakehouse.com` document root to `/home/username/hub/public`
- [ ] Set permissions: `chmod -R 775 storage bootstrap/cache`
- [ ] Create SQLite database on server: `touch /home/username/hub/database/database.sqlite`

#### Install & Migrate
- [ ] Connect via SSH/cPanel Terminal
- [ ] Run: `cd /home/username/hub`
- [ ] Run: `composer install --optimize-autoloader --no-dev`
- [ ] Run: `php artisan migrate --force`
- [ ] Verify no errors

#### Verification
- [ ] Access `https://hub.wendysbakehouse.com` in browser
- [ ] Verify no 500 errors
- [ ] Check cPanel error logs if issues occur

### Step 3: Bakery Deployment

#### Upload Files
- [ ] Create directory: `/home/username/bakery-store/`
- [ ] Upload from local `bakery/` directory:
  - [ ] `.next/` (built directory)
  - [ ] `public/` (static files)
  - [ ] `package.json`
  - [ ] `server.js`
  - [ ] `next.config.ts`
  - [ ] `.env.local`

#### cPanel Node.js Setup
- [ ] Open cPanel → Find "Setup Node.js App"
- [ ] Click "Create Application"
- [ ] Set values:
  - Application root: `/home/username/bakery-store`
  - Application URL: `wendysbakehouse.com`
  - Application startup file: `server.js`
  - Node.js version: `18.x` (or higher)
  - Application mode: `Production`
- [ ] Add Environment Variables:
  ```
  NODE_ENV=production
  NEXT_PUBLIC_ADMIN_API_URL=https://hub.wendysbakehouse.com
  NEXT_PUBLIC_STORE_ID=bakery
  ```

#### Initialize & Start
- [ ] Click "Run JS Script" to run `npm install`
- [ ] Click "Start App"
- [ ] Wait 30 seconds for app to start

#### Verification
- [ ] Access `https://wendysbakehouse.com` in browser
- [ ] Verify page loads (may show "loading" briefly)
- [ ] Check that products load from Hub API
- [ ] Verify no console errors in browser dev tools

### Step 4: Fashion Deployment

#### Upload Files
- [ ] Create directory: `/home/username/fashion-store/`
- [ ] Upload from local `fashion/` directory:
  - [ ] `.next/` (built directory)
  - [ ] `public/` (static files)
  - [ ] `package.json`
  - [ ] `server.js`
  - [ ] `next.config.ts`
  - [ ] `.env.local`

#### cPanel Node.js Setup
- [ ] Open cPanel → Find "Setup Node.js App"
- [ ] Click "Create Application"
- [ ] Set values:
  - Application root: `/home/username/fashion-store`
  - Application URL: `fashion.wendysbakehouse.com`
  - Application startup file: `server.js`
  - Node.js version: `18.x` (or higher)
  - Application mode: `Production`
- [ ] Add Environment Variables:
  ```
  NODE_ENV=production
  NEXT_PUBLIC_ADMIN_API_URL=https://hub.wendysbakehouse.com
  NEXT_PUBLIC_STORE_ID=fashion
  ```

#### Initialize & Start
- [ ] Click "Run JS Script" to run `npm install`
- [ ] Click "Start App"
- [ ] Wait 30 seconds for app to start

#### Verification
- [ ] Access `https://fashion.wendysbakehouse.com` in browser
- [ ] Verify page loads (may show "loading" briefly)
- [ ] Check that products load from Hub API
- [ ] Verify no console errors in browser dev tools

---

## WooCommerce Integration Setup

- [ ] Access WooCommerce admin dashboard
- [ ] Go to **WooCommerce > Settings > Advanced > Webhooks**
- [ ] Click "Add webhook"
- [ ] Configure Bakery webhook:
  - [ ] **Event**: `Product updated`
  - [ ] **Delivery URL**: `https://hub.wendysbakehouse.com/api/webhooks/woocommerce/bakery`
  - [ ] **Secret**: `test-secret`
  - [ ] **Status**: `Active`
  - [ ] Save
- [ ] Configure Fashion webhook:
  - [ ] **Event**: `Product updated`
  - [ ] **Delivery URL**: `https://hub.wendysbakehouse.com/api/webhooks/woocommerce/fashion`
  - [ ] **Secret**: `test-secret`
  - [ ] **Status**: `Active`
  - [ ] Save
- [ ] Test by updating a product in WooCommerce
- [ ] Verify data syncs to Hub API

---

## Final Testing & Verification

### Hub API
- [ ] `/api/health` returns 200
- [ ] `/api/products` returns product list
- [ ] `/api/webhooks/woocommerce/*` accepts POST requests

### Bakery Storefront
- [ ] Homepage loads without errors
- [ ] Products display correctly
- [ ] Product detail pages work
- [ ] Navigation works
- [ ] Responsive design works on mobile

### Fashion Storefront
- [ ] Homepage loads without errors
- [ ] Products display correctly
- [ ] Product detail pages work
- [ ] Navigation works
- [ ] Responsive design works on mobile

### Cross-Domain Communication
- [ ] Both storefronts fetch data from Hub
- [ ] Store IDs are correctly passed in headers
- [ ] CORS headers are properly configured (if needed)

---

## Troubleshooting Guide

### If Hub shows 500 error:
1. Check cPanel error logs
2. Verify database path in `.env` is absolute
3. Ensure `storage/` and `bootstrap/cache` are writable
4. Check PHP version is 8.2+

### If Storefronts show 500 error:
1. Check Node.js app logs in cPanel
2. Verify `.env.local` variables are set
3. Ensure `npm install` completed successfully
4. Check `NEXT_PUBLIC_ADMIN_API_URL` is correct

### If products don't load:
1. Verify Hub is accessible from storefront
2. Check browser console for CORS errors
3. Verify `NEXT_PUBLIC_STORE_ID` matches Hub expectations
4. Check network tab in browser dev tools

### If webhooks aren't triggering:
1. Verify webhook URL is publicly accessible
2. Check Hub logs for webhook requests
3. Ensure WooCommerce has network access to Hub
4. Verify `WC_WEBHOOK_SECRET` matches in Hub `.env`

---

## Post-Deployment

- [ ] All three apps are live and accessible
- [ ] SSL certificates are valid (green HTTPS)
- [ ] Analytics/monitoring configured (if needed)
- [ ] Backup strategy implemented
- [ ] Team notified of go-live

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Notes**: 
```

```

---

**Status**: ⬜ Pending | 🟨 In Progress | ✅ Complete
