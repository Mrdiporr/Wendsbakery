### Recommended Subdomain Mapping
- **Admin Hub (API)**: `hub.wendysbakehouse.com`
- **Fashion Store**: `fashion.wendysbakehouse.com`
- **Bakery Store**: `wendysbakehouse.com` (Main Domain) or `bakery.wendysbakehouse.com`

### 1. Laravel Admin Dashboard (The Hub)

The Hub acts as the central API and management layer.

### Files to Upload
Upload the contents of the `hub` directory to your server (e.g., in a folder named `hub` in your home directory, NOT directly in `public_html`).

**Exclude these folders from upload:**
- `node_modules/`
- `vendor/`
- `storage/framework/cache/data/*`
- `storage/framework/sessions/*`
- `storage/framework/views/*`
- `.git/`

### Server Configuration
1. **Subdomain**: Create a subdomain named `hub.wendysbakehouse.com`.
2. **Document Root**: Point the subdomain's document root to the `public/` folder within your uploaded files (e.g., `/home/username/hub/public`).
3. **Environment**: Rename `.env.example` to `.env` on the server and update:
   - `APP_URL=https://hub.wendysbakehouse.com`
   - `DB_DATABASE=/home/username/hub/database/database.sqlite` (Ensure the path is absolute)
   - `WC_WEBHOOK_SECRET=test-secret` (Must match what you use in WooCommerce)
4. **Permissions**: Ensure `storage/` and `bootstrap/cache/` are writable by the server (usually `775`).
5. **Install Dependencies**: In the cPanel Terminal, run:
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan migrate --force
   ```

---

## 2. Next.js Storefronts (Bakery & Fashion)

Both storefronts follow the same process. Perform these steps for each.

### Local Preparation
Before uploading, you must generate the production build on your local machine:
```bash
npm run build
```

### Files to Upload
Upload these files from the `bakery` or `fashion` directory to their respective application folders on the server:
- `.next/` (The generated build)
- `public/`
- `package.json`
- `server.js`
- `next.config.ts` (or `.js`)
- `.env` (Make sure production values are set)
- `node_modules/` (Optional: you can also run `npm install` in cPanel)

### cPanel Node.js Setup
1. **Setup Node.js App**: In cPanel, search for "Setup Node.js App".
2. **Create Application**:
   - **Node.js version**: 18.x or higher.
   - **Application mode**: `Production`.
   - **Application root**: The folder where you uploaded the files (e.g., `bakery-store`).
   - **Application URL**: `wendysbakehouse.com` (Bakery) or `fashion.wendysbakehouse.com` (Fashion).
   - **Application startup file**: `server.js`.
3. **Environment Variables**: Add these in the "Environment variables" section:
   - `NODE_ENV`: `production`
   - `NEXT_PUBLIC_ADMIN_API_URL`: `https://hub.wendysbakehouse.com`
   - `NEXT_PUBLIC_STORE_ID`: `bakery` or `fashion`
4. **Initialize**: Click "Run JS Script" and select `npm install`.
5. **Start**: Click "Start App".

---

## 3. Webhook Configuration (WooCommerce)

To ensure the "Hub" stays synced with your WooCommerce store:
1. Go to **WooCommerce > Settings > Advanced > Webhooks**.
2. Create a new webhook:
   - **Topic**: `Product updated`.
   - **Delivery URL**: `https://hub.wendysbakehouse.com/api/webhooks/woocommerce/bakery` (or `fashion`).
   - **Secret**: `test-secret` (Matches your Hub `.env`).
   - **Status**: `Active`.

---

## Final Checklist
- [ ] Laravel Hub is accessible at its subdomain.
- [ ] Storefronts correctly fetch products from the Hub URL.
- [ ] `X-Store-ID` headers are being passed correctly (handled by `api-client.ts`).
- [ ] Database path in Laravel `.env` is absolute.
