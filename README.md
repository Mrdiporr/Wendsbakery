# Wendy's Bakery - Multi-Store E-Commerce Platform

A full-stack e-commerce platform for managing multiple storefronts (Bakery & Fashion) with a centralized admin hub.

## 🏗️ Architecture

```
Wendy's Bakery
├── hub/                    # Laravel 11 API & Admin Backend
│   ├── routes/api.php      # RESTful API endpoints
│   ├── config/             # App configuration
│   └── database/           # SQLite database + migrations
├── bakery/                 # Next.js 16 Bakery Storefront
│   ├── src/               # React components
│   └── public/            # Static assets
├── fashion/               # Next.js 16 Fashion Storefront
│   ├── src/               # React components
│   └── public/            # Static assets
└── .github/workflows/     # CI/CD automation
```

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Node.js 18.x+
- Composer
- SQLite (for development)

### Local Development

1. **Clone & Setup Hub**
```bash
cd hub
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
# Hub runs on http://localhost:8000
```

2. **Setup Bakery Storefront**
```bash
cd bakery
cp .env.example .env
npm install
npm run dev
# Bakery runs on http://localhost:3000
```

3. **Setup Fashion Storefront**
```bash
cd fashion
cp .env.example .env
npm install
npm run dev
# Fashion runs on http://localhost:3001
```

## 📋 Key Features

### Hub (API)
- ✅ Multi-store product management
- ✅ RESTful API with X-Store-ID routing
- ✅ SQLite database
- ✅ Laravel Sanctum authentication
- ✅ WooCommerce webhook integration (planned)

### Storefronts
- ✅ Next.js for fast, SEO-friendly pages
- ✅ Server-side rendering (SSR)
- ✅ Image optimization
- ✅ Responsive design

## 🔧 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Required Header
```
X-Store-ID: bakery  (or 'fashion')
```

### Endpoints

#### Get All Products
```
GET /products
Response: { data: [...], meta: { store, count } }
```

#### Get Product by ID
```
GET /products/:id
Response: { data: {...} }
```

#### Get Categories
```
GET /categories
Response: { data: [...] }
```

#### Create Order
```
POST /orders
Headers: 
  - Idempotency-Key: unique-request-id
  - X-Store-ID: bakery
Body: {
  email, phone, fulfillment_method, items[],
  delivery_address?, special_instructions?
}
```

## 📦 Database Schema

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  store_id TEXT,
  name TEXT,
  sku TEXT UNIQUE,
  description TEXT,
  base_price_cents INTEGER,
  image_url TEXT,
  status VARCHAR(20),
  metadata_json JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  store_id TEXT,
  order_number TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  fulfillment_method VARCHAR(20),
  status VARCHAR(20),
  total_cents INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🚢 Deployment

### To cPanel

See [DEPLOYMENT.md](.github/DEPLOYMENT.md) for complete setup guide.

**Quick steps:**
1. Set GitHub secrets (FTP & SSH credentials)
2. Merge `deployment/github-actions-setup` branch to `main`
3. Push to `main` to trigger automatic deployment
4. Workflows run automatically on merge

### Deployment Subdomains
- **Hub**: `hub.wendysbakehouse.com`
- **Bakery**: `wendysbakehouse.com` or `bakery.wendysbakehouse.com`
- **Fashion**: `fashion.wendysbakehouse.com`

## 🔄 CI/CD Pipeline

### Workflows (in `.github/workflows/`)

1. **ci-hub.yml** - Tests & builds Laravel backend
   - PHP linting
   - Code style checks (Pint)
   - Database migration testing
   - Artifact upload

2. **ci-storefronts.yml** - Tests & builds Next.js frontends
   - ESLint checks
   - Next.js production build
   - Build artifact caching

3. **deploy-cPanel.yml** - Automatic deployment to production
   - FTP upload
   - Database migrations
   - App restarts

**Triggers**: 
- CI runs on PRs and push to `main`/`development`
- Deployment runs on push to `main`

## 🛡️ Security

- ✅ Environment variables for secrets (never commit `.env`)
- ✅ Laravel Sanctum for API authentication
- ✅ CORS configured for cross-origin requests
- ✅ SQL injection prevention (Eloquent ORM)
- ✅ CSRF protection on forms

## 📝 Known Issues & TODOs

### Critical
- [ ] Implement proper API authentication (currently using X-Store-ID header only)
- [ ] Add order validation & inventory checks
- [ ] Create database migrations
- [ ] Add comprehensive error handling

### High Priority
- [ ] Implement `/quotes` endpoint
- [ ] Add CORS middleware
- [ ] Add logging/monitoring
- [ ] Write unit tests

### Medium Priority
- [ ] WooCommerce webhook integration
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Admin dashboard UI

## 📚 Documentation

- [Deployment Guide](.github/DEPLOYMENT.md)
- [API Documentation](#-api-documentation)
- [INSTRUCTIONS.md](INSTRUCTIONS.md) - Server setup guide

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test locally
3. Push and create a Pull Request
4. CI/CD pipeline runs automatically
5. Once approved and CI passes, merge to `main`

## 📄 License

MIT License - feel free to use this project for commercial purposes.

## 👨‍💼 Author

**Wendy's Bakery** - Built with ❤️ for e-commerce

---

## Next Steps

1. ✅ Read [DEPLOYMENT.md](.github/DEPLOYMENT.md)
2. ✅ Set up GitHub Secrets for deployment
3. ✅ Test CI/CD on a feature branch
4. ✅ Deploy to production

**Questions?** Check the docs or open an issue!