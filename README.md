# 🍰 Wendsbakery - Multi-Store E-Commerce Platform

A modern, scalable e-commerce platform featuring a Laravel API backend and multiple Next.js storefronts.

## 🏗️ Architecture

```
Wendsbakery/
├── hub/          # Laravel API Backend
├── bakery/       # Next.js Bakery Storefront  
├── fashion/      # Next.js Fashion Storefront
└── docs/         # Documentation
```

### Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Hub** | Laravel 11 + Inertia.js | Admin API & Product Management |
| **Bakery** | Next.js 16 + React 19 | Bakery Product Storefront |
| **Fashion** | Next.js 16 + React 19 | Fashion Product Storefront |

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Node.js 18+
- npm/yarn
- Composer

### Local Development

```bash
# Clone repository
git clone https://github.com/Mrdiporr/Wendsbakery.git
cd Wendsbakery

# 1. Setup Hub (Laravel Backend)
cd hub
composer install
php artisan key:generate
php artisan migrate
php artisan serve

# 2. Setup Bakery (in new terminal)
cd ../bakery
npm install
npm run dev

# 3. Setup Fashion (in new terminal)
cd ../fashion
npm install
npm run dev
```

**Endpoints:**
- Hub API: `http://localhost:8000`
- Bakery: `http://localhost:3000`
- Fashion: `http://localhost:3001`

---

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup and deployment guide
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step deployment checklist
- **[INSTRUCTIONS.md](./INSTRUCTIONS.md)** - Original deployment instructions
- **[Hub README](./hub/README.md)** - Hub/API documentation
- **[Bakery README](./bakery/README.md)** - Bakery storefront details
- **[Fashion README](./fashion/README.md)** - Fashion storefront details

---

## 🌐 Domains

| Service | Domain |
|---------|--------|
| **Hub API** | `https://hub.wendysbakehouse.com` |
| **Bakery Store** | `https://wendysbakehouse.com` |
| **Fashion Store** | `https://fashion.wendysbakehouse.com` |

---

## 🔧 Project Structure

### Hub (Laravel)
- RESTful API for product management
- WooCommerce webhook integration
- SQLite database
- Inertia.js for React integration
- Sanctum authentication

### Bakery Storefront (Next.js)
- Server-side rendering
- TypeScript support
- Tailwind CSS styling
- API client for Hub integration
- Production-ready build

### Fashion Storefront (Next.js)
- Identical to Bakery
- Separate store ID for multi-tenancy
- Shared API infrastructure

---

## 📦 Dependencies

### Hub
- `laravel/framework` ^11.31
- `laravel/sanctum` ^4.0
- `inertiajs/inertia-laravel` ^2.0
- `tightenco/ziggy` ^2.0

### Storefronts
- `next` 16.2.4
- `react` 19.2.4
- `react-dom` 19.2.4
- `typescript` ^5
- `tailwindcss` ^3 (Hub only)

---

## 🚢 Deployment

### Using cPanel

1. **Build locally:**
   ```bash
   cd bakery && npm run build && cd ../fashion && npm run build
   ```

2. **Upload to cPanel:**
   - Hub �� `/home/username/hub/`
   - Bakery → `/home/username/bakery-store/`
   - Fashion → `/home/username/fashion-store/`

3. **Configure subdomains:**
   - `hub.wendysbakehouse.com` → Hub public directory
   - `wendysbakehouse.com` → Bakery Node.js app
   - `fashion.wendysbakehouse.com` → Fashion Node.js app

4. **Install dependencies:**
   ```bash
   cd hub && composer install --optimize-autoloader --no-dev
   cd bakery && npm install && cd ../fashion && npm install
   ```

5. **Run migrations:**
   ```bash
   php artisan migrate --force
   ```

See **[SETUP.md](./SETUP.md)** and **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** for detailed instructions.

---

## 🔗 API Integration

### Hub Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products` | GET | Fetch all products |
| `/api/products/{id}` | GET | Fetch single product |
| `/api/webhooks/woocommerce/{store}` | POST | Receive WooCommerce updates |

### Required Headers

```
X-Store-ID: bakery  # or 'fashion'
```

---

## 🔐 Environment Variables

### Hub (.env)
```env
APP_URL=https://hub.wendysbakehouse.com
DB_DATABASE=/home/username/hub/database/database.sqlite
WC_WEBHOOK_SECRET=test-secret
```

### Storefronts (.env.local)
```env
NODE_ENV=production
NEXT_PUBLIC_ADMIN_API_URL=https://hub.wendysbakehouse.com
NEXT_PUBLIC_STORE_ID=bakery  # or 'fashion'
```

---

## 🧪 Build & Test

Automated builds run on push to `main` and `develop` branches:

```bash
# Validate Hub
php artisan config:cache

# Build Bakery
npm run build

# Build Fashion
npm run build
```

View workflow status: [GitHub Actions](https://github.com/Mrdiporr/Wendsbakery/actions)

---

## 📋 File Uploads to Exclude

When deploying, exclude:
- `node_modules/`
- `vendor/`
- `.git/`
- `storage/framework/cache/data/*`
- `storage/framework/sessions/*`
- `storage/framework/views/*`
- `.env` (create on server)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit pull request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Support

- **Setup Issues**: See [SETUP.md](./SETUP.md)
- **Deployment Help**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **General Questions**: Open an issue on GitHub

---

## 📅 Recent Updates

- ✅ Multi-storefront support with separate store IDs
- ✅ Environment configuration files added
- ✅ Comprehensive deployment documentation
- ✅ GitHub Actions CI/CD workflow
- ✅ WooCommerce webhook integration ready

---

**Repository**: https://github.com/Mrdiporr/Wendsbakery  
**Last Updated**: 2026-05-28
