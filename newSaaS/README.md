# 🚀 CODShop SaaS — E-Commerce Platform for Cash on Delivery

A multi-tenant SaaS platform for creating e-commerce stores specializing in **Cash on Delivery (COD)** with **WhatsApp** integration. Think Shopify, but simpler and focused on COD markets.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Laravel 11 (PHP 8.2+) |
| **Frontend** | React 19 + TypeScript + Vite |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **Styling** | Tailwind CSS |
| **State** | Zustand |
| **Auth** | Laravel Sanctum (token-based) |

## ⚠️ Project Status

| Component | Status | Details |
|-----------|--------|---------|
| **Backend API** | ✅ Done | 9 models, 6 controllers, 5 services, 26 endpoints, 12 migrations, seeders |
| **Database** | ✅ Done | SQLite (dev), multi-tenant schema with `tenant_id` isolation |
| **Frontend API Client** | ✅ Done | Full Axios client covering all 26 endpoints |
| **Frontend Auth Store** | ✅ Done | Zustand store for login/register state |
| **Frontend Pages** | 🔶 Partial | 3 pages built (Login, Register, PublicStore) — not wired into router |
| **Frontend App Shell** | ❌ Not started | `App.tsx` is still Vite boilerplate — no routing, no layout |
| **Admin Dashboard** | ❌ Not started | No dashboard, products, orders, customers, or stats pages |
| **Tailwind Config** | ❌ Not started | Tailwind is installed but not configured (no `tailwind.config.js` in frontend) |

> **Bottom line:** The backend API is production-ready. The frontend is ~30% done — the API client and a few pages exist, but nothing is wired together. You'll see the default Vite/Laravel welcome pages when you run it.

## Project Structure

```
newSaaS/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/   # 26 API endpoints
│   │   ├── Models/                 # 9 models
│   │   ├── Services/               # Business logic
│   │   └── Http/Middleware/         # Tenant isolation
│   ├── database/
│   │   ├── migrations/             # 12 migrations
│   │   └── seeders/                # Plans + test user
│   └── routes/api.php
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── services/           # API client (Axios)
│   │   └── store/              # Zustand state
│   └── vite.config.ts
│
├── docker-compose.yml          # Full stack (PostgreSQL, Redis, MinIO, Nginx)
└── README.md                   # ← You are here
```

## ⚡ Quick Start (SQLite — No Docker Needed)

### Prerequisites

- **PHP 8.2+** with `pdo_sqlite` extension
- **Composer**
- **Node.js 20+** and **npm**

### 1. Install Backend

```bash
cd backend
composer install
```

### 2. Setup Environment

The `.env` file is already configured for SQLite. If you need a fresh one:

```bash
cp .env.example .env
php artisan key:generate
```

Make sure `.env` has:
```
DB_CONNECTION=sqlite
```

### 3. Run Migrations + Seed

```bash
php artisan migrate:fresh --seed
```

This creates the SQLite database with:
- Subscription plans (Starter, Professional, Enterprise)
- A test user: `test@example.com` / `password` (SUPER_ADMIN)

### 4. Start the Backend

```bash
php artisan serve
```

API running at **http://localhost:8000**

### 5. Start the Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

App running at **http://localhost:5173**

### 6. Open the App

Visit **http://localhost:5173** in your browser. Login with:
- **Email:** `test@example.com`
- **Password:** `password`

---

## 🐳 Docker Setup (Full Stack — Production)

For the full stack with PostgreSQL, Redis, MinIO, and Nginx:

```bash
docker-compose up -d
docker-compose exec backend php artisan migrate --seed
```

| Service | Port | Purpose |
|---------|------|---------|
| Frontend | 5173 | React app |
| Backend | 8000 | Laravel API |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache & queues |
| MinIO | 9000/9001 | Object storage |
| Nginx | 80/443 | Reverse proxy |

---

## 🔌 API Endpoints (26 total)

### Auth
```
POST /api/auth/register         # Register
POST /api/auth/login            # Login → returns token
POST /api/auth/verify-otp       # Verify email
POST /api/auth/resend-otp       # Resend OTP
POST /api/auth/forgot-password  # Reset password
POST /api/auth/logout           # Logout
```

### Stores
```
GET    /api/stores/plans                       # List plans
POST   /api/stores                             # Create store
GET    /api/stores/current                     # Get my store
PUT    /api/stores/current                     # Update store
POST   /api/stores/current/custom-domain       # Connect domain
POST   /api/stores/current/renew-subscription  # Renew
```

### Products
```
GET    /api/products        # List
POST   /api/products        # Create
GET    /api/products/:id    # Detail
PUT    /api/products/:id    # Update
DELETE /api/products/:id    # Delete
```

### Orders
```
GET    /api/orders              # List (filterable)
POST   /api/orders              # Create
GET    /api/orders/:id          # Detail
PUT    /api/orders/:id/status   # Update status
```

### Customers
```
GET /api/customers              # List
GET /api/customers/:id          # Detail
GET /api/customers/:id/orders   # Customer's orders
```

### Statistics
```
GET /api/statistics/tenant  # Store stats
GET /api/statistics/admin   # Platform stats (Super Admin)
```

---

## 🏗️ Architecture

### Multi-Tenancy
Every table has `tenant_id` for complete data isolation. Middleware automatically scopes all queries to the authenticated tenant.

### Roles
| Role | Access |
|------|--------|
| `SUPER_ADMIN` | Platform-wide management |
| `STORE_OWNER` | Full store management |
| `STORE_MANAGER` | Limited store operations |

### Database Tables (10)
`users` · `tenants` · `products` · `categories` · `variants` · `orders` · `order_items` · `customers` · `plans` · `cache`

### Subscription Plans
| Plan | Price | Duration |
|------|-------|----------|
| Starter | 99 MAD | 3 months |
| Professional | 199 MAD | 6 months |
| Enterprise | Custom | Custom |

---

## 🗺️ Roadmap

- [ ] Payment gateway (Stripe/PayPal)
- [ ] SMS notifications
- [ ] Template customization engine
- [ ] Shipping integration
- [ ] Mobile apps (iOS/Android)
- [ ] Webhook system
- [ ] Multi-language support

## 📄 License

MIT
