# CODShop — Complete Technical Specification
**Version 2.0 — Professional Edition**
**Date:** May 2026 | **Status:** Approved for Development

---

# PART 1 — Product Requirements Document (PRD)

## 1. Executive Summary

CODShop is a **multi-tenant SaaS e-commerce platform** purpose-built for Cash on Delivery (COD) markets — primarily North Africa and the Middle East. It enables merchants to launch a branded online store in minutes, receive orders via **WhatsApp and a quick-order form**, and manage everything from a single dashboard.

Unlike Shopify (complex, designed for card payments), CODShop is:
- **WhatsApp-first**: Orders flow natively into WhatsApp conversations.
- **COD-optimized**: Order lifecycle built for COD (New → Confirmed → Shipped → Delivered).
- **Affordable**: Priced for SMBs in emerging markets (MAD pricing).
- **Fast to launch**: Ready-made store templates, deploy in < 5 minutes.

### Current Project Status

| Layer | Status | Notes |
|-------|--------|-------|
| Laravel 11 Backend API | ✅ Solid | 26 endpoints, Sanctum auth, tenant_id isolation |
| Database Schema | ⚠️ Incomplete | Missing: templates, WhatsApp config, media table, shipping zones |
| React 19 Frontend | 🔶 ~70% | Router, layout, 8 pages, Zustand store — not connected to live backend |
| Admin Dashboard | 🔶 Shell | Pages exist, need backend data wired in |
| Public Storefront | 🔶 Shell | PublicStorePage exists, no templates / quick-order form |

### Key Gaps (from Analysis)
1. **No store template system** — critical for fast merchant onboarding
2. **No WhatsApp deep-link configuration** — the core differentiator, not yet implemented
3. **`images` stored as JSON blob** — needs dedicated `media` table
4. **No shipping/zone management** — COD needs local delivery zones
5. **No SEO metadata fields** on products/storefront (meta_title, og_image, etc.)
6. **No email notification jobs** — OTP exists but order notifications missing
7. **Custom domain verification** stored but DNS propagation check not implemented
8. **No `tenant_settings` table** — WhatsApp number, colors, template config have nowhere to live

---

## 2. Goals & Non-Goals

### MVP Goals
- Multi-tenant store creation with subdomain + custom domain support
- Product catalog with variants and media upload
- WhatsApp quick-order flow + embedded order form
- Admin dashboard: orders, products, customers, stats
- 3 store templates (merchant picks at signup)
- Subscription billing gate (Starter / Pro / Enterprise)
- Super Admin platform oversight panel
- Email OTP verification + password reset

### Non-Goals (MVP)
- In-app payment processing (Stripe, CMI, etc.)
- Native mobile app (iOS/Android)
- Multi-language storefronts
- Dropshipping / supplier integrations
- SMS gateway

---

## 3. User Personas

### 3.1 Merchant (Store Owner)
- Moroccan/Algerian SMB owner, sells via Instagram DMs today
- Non-technical, wants fast simple setup, primary device: smartphone
- Pain: loses track of orders, no organized catalog, manual WhatsApp replies

### 3.2 Store Manager
- Employee hired by merchant to manage daily orders
- Needs order pipeline, customer notes, status updates
- Does NOT have billing/settings access

### 3.3 End Customer (Shopper)
- Visits the store via a shared link or social media
- Wants to browse quickly, order in 2 taps, prefers WhatsApp

### 3.4 Platform Admin (Super Admin)
- CODShop team member — platform analytics, tenant management, plan management

---

## 4. Feature Specifications

### F-01: Merchant Onboarding & Store Creation
**MVP**
- [ ] Registration: name, email, phone, password + OTP email verification
- [ ] Store wizard: store name, slug (auto-generated), WhatsApp number, template picker
- [ ] Subdomain auto-provisioned: `{slug}.codshop.ma`
- [ ] Custom domain input + DNS instructions page
- [ ] Plan selection at signup

**Future:** Google OAuth, multi-store per owner

---

### F-02: Store Templates
**MVP — 3 Templates**

| Template | Style | Best For |
|----------|-------|----------|
| `Horizon` | Clean minimal, white/blue | Fashion, Accessories |
| `Bolt` | Bold, dark, high-contrast | Electronics, Gadgets |
| `Bloom` | Warm, earthy tones | Beauty, Food, Wellness |

- Templates define: color palette, typography, hero layout, product card style
- Merchant can switch templates from settings (instant, no downtime)
- Template stored as `template_id` in `tenants` table

**Future:** Custom CSS editor, template marketplace, drag-and-drop builder

---

### F-03: Product Catalog
**MVP**
- [ ] CRUD: name, slug, description, price, promotional price, SKU, stock qty
- [ ] Multiple images (upload to R2/MinIO), max 5 per product
- [ ] Product categories (flat for MVP)
- [ ] Product variants (size, color) with individual stock levels
- [ ] SEO fields: meta_title, meta_description, og_image
- [ ] Active/Inactive toggle, product limit enforced per plan

**Future:** Digital products, bundles, inventory alerts, reviews

---

### F-04: WhatsApp Order Flow
> CODShop's **primary differentiator**

**MVP**
- [ ] Merchant configures WhatsApp number in store settings
- [ ] "Order via WhatsApp" button on every product page
- [ ] Pre-filled WhatsApp deep link: `https://wa.me/{phone}?text={message}`
- [ ] Quick Order Form: name, phone, address, qty → API → order status `new`
- [ ] After form submit, option to also open WhatsApp

**Configurable message template:**
```
Bonjour, je voudrai commander:
- Produit: {product_name}
- Variante: {variant}
- Quantité: {qty}
Mon nom: {name} | Mon adresse: {address}
```

**Future:** WhatsApp Business API, automated order confirmations, abandoned cart reminders

---

### F-05: Quick Order Form
**MVP**
- [ ] Mobile-optimized, embedded on product page — no account required
- [ ] Fields: Full name, Phone, City/Address, Quantity, optional note
- [ ] Rate limiting: 5 orders/hour per IP
- [ ] CAPTCHA toggle per merchant

---

### F-06: Order Management Dashboard
**MVP**
- [ ] Order list: filterable by status, date, customer
- [ ] Kanban view: New → Confirmed → Shipped → Delivered / Cancelled
- [ ] Order detail: customer info, items, notes, status change
- [ ] CSV export, bulk status update
- [ ] Order number: `{PREFIX}-{YEAR}-{SEQ}`

**Future:** Driver assignment, shipping labels, return/refund, audit trail

---

### F-07: Customer Management
**MVP**
- [ ] Auto-created from order form (matched by phone number)
- [ ] Profile: name, phone, address history, order count, total spent
- [ ] Customer list with search/filter, blacklist toggle

**Future:** Segmentation, loyalty points, blacklist system

---

### F-08: Analytics & Statistics
**MVP (Merchant)**
- [ ] Revenue today / this week / this month (KPI cards)
- [ ] Revenue chart (last 7/30/90 days)
- [ ] Top products, order status breakdown

**MVP (Super Admin)**
- [ ] Platform MRR, active stores, new this month, churn
- [ ] Top 10 stores by revenue, plan distribution

---

### F-09: Storefront (Public Store)
**MVP**
- [ ] Homepage: hero, featured products, categories grid
- [ ] Category page: filtered product grid
- [ ] Product detail: image gallery, price, variants, WhatsApp button, Quick Order Form
- [ ] Mobile-first, fully responsive
- [ ] Custom domain: `mystore.com` → storefront
- [ ] Subdomain: `{slug}.codshop.ma` → storefront

**SEO (per page)**
- [ ] `<title>`, meta description, Open Graph, Twitter Card, JSON-LD Product schema
- [ ] Canonical URL, XML sitemap, robots.txt
- [ ] **Recommended: Next.js 15 (App Router SSR)** for storefront — critical for SEO

---

### F-10: Subscription & Billing

| Plan | Price | Products | Storage | Custom Domain |
|------|-------|----------|---------|---------------|
| Starter | 99 MAD/mo | 50 | 1 GB | No |
| Professional | 199 MAD/mo | 500 | 10 GB | Yes (1) |
| Enterprise | Custom | Unlimited | 50 GB | Yes (multiple) |

**MVP**
- [ ] Plan gating via middleware
- [ ] Expired stores → read-only mode
- [ ] Super Admin can manually extend/change plans

**Future:** Stripe/CMI billing, promo codes, annual discount

---

### F-11: Media Library
**MVP**
- [ ] Upload JPEG/PNG/WebP, max 2MB, max 5 per product
- [ ] Auto-resize to 800px max on upload
- [ ] Store to Cloudflare R2 (prod) / MinIO (dev)
- [ ] Storage quota enforced per plan

---

### F-12: Authentication & Security
**MVP**
- [ ] Sanctum token auth, Email OTP (6-digit, 10 min), password reset
- [ ] RBAC: SUPER_ADMIN / STORE_OWNER / STORE_MANAGER
- [ ] Rate limiting (60 req/min), CORS, HTTPS enforced
- [ ] TenantScope on all authenticated queries

---

### F-13: Notifications
**MVP**
- [ ] Email: OTP, password reset, new order notification to merchant
- [ ] In-app unread orders badge

**Future:** SMS, WhatsApp Business API, web push

---

### F-14: Staff Management
**MVP**
- [ ] Store owner invites staff via email → STORE_MANAGER role
- [ ] Pending invites, revoke access

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Storefront LCP < 2s on 4G; API reads < 200ms |
| Scalability | Stateless API, Redis sessions, horizontal scaling via Docker |
| Security | OWASP Top 10, PII encryption, daily PostgreSQL backups |
| Availability | 99.5% SLA, health check endpoints |
| Compliance | GDPR-ready (export/delete), cookie consent on storefronts |

---

## 6. Glossary

| Term | Definition |
|------|-----------|
| Tenant | A merchant store on the platform |
| Storefront | The public-facing e-commerce website |
| Slug | URL-safe store identifier (`mon-magasin`) |
| COD | Cash on Delivery |
| WhatsApp Deep Link | `wa.me` URL that opens a pre-filled WhatsApp chat |

---

---

# PART 2 — High-Level System Architecture

## 1. Multi-Tenancy Strategy

**Approach: Shared Database + Row-Level Isolation (`tenant_id`)**

- All tenant-scoped tables have `tenant_id` FK
- `TenantScope` Eloquent global scope auto-applied to all models
- Middleware resolves tenant from `Host` header on every request

```
Request → Nginx → TenantScopeMiddleware (resolve from Host header)
                         ↓
                   app('tenant') set globally
                         ↓
             All Eloquent queries auto-scoped to tenant_id
```

**Why not DB-per-tenant?** Provisioning complexity, migration management across 100s of DBs, shared DB scales to 10k+ stores before needing to shard.

---

## 2. Domain Routing

### Subdomain (Default)
- Pattern: `{slug}.codshop.ma`
- DNS: Single wildcard A record `*.codshop.ma → server IP`
- Nginx wildcard `*.codshop.ma` → proxy to Laravel + React

### Custom Domain (Pro/Enterprise)
- Merchant adds A record → server IP
- Backend verifies DNS propagation via queue job
- SSL: certbot Let's Encrypt per custom domain (`certbot certonly -d {domain}`)

### Nginx Setup (simplified)
```nginx
# Wildcard subdomain
server {
    server_name ~^(?<slug>.+)\.codshop\.ma$;
    location /api/ { proxy_pass http://backend:8000; }
    location /     { proxy_pass http://frontend:3000; }
}
# Custom domain catch-all
server {
    server_name _;
    location /api/ { proxy_pass http://backend:8000; }
    location /     { proxy_pass http://frontend:3000; }
}
# Admin panel
server {
    server_name app.codshop.ma;
    location /api/ { proxy_pass http://backend:8000; }
    location /     { proxy_pass http://frontend:3000; }
}
```

---

## 3. Application Structure

### Backend: Laravel 11
```
backend/app/
├── Http/Controllers/Api/
│   ├── Auth/AuthController.php
│   ├── Admin/          (ProductController, OrderController, CustomerController,
│   │                    StoreController, CategoryController, MediaController,
│   │                    StatisticsController, StaffController)
│   ├── Storefront/     (StoreController, ProductController, OrderController)
│   └── SuperAdmin/     (TenantController, PlatformStatsController)
├── Http/Middleware/
│   ├── TenantScopeMiddleware.php
│   ├── CheckSubscriptionActive.php
│   ├── EnsureRole.php
│   └── RateLimitQuickOrder.php
├── Models/             (Tenant, User, Plan, Template, Product, Category,
│                        Variant, Media, Order, OrderItem, Customer,
│                        TenantSetting, ShippingZone, StaffInvitation)
├── Services/           (TenantService, OrderService, MediaService,
│                        WhatsAppService, DomainVerificationService)
├── Jobs/               (SendOrderNotificationEmail, ProcessMediaUpload,
│                        VerifyCustomDomain)
└── Scopes/TenantScope.php
```

### Frontend: React 19 + Vite (Admin) / Next.js 15 (Storefront)
```
frontend/src/
├── App.tsx                    ← Router wired ✅
├── components/DashboardLayout ← Sidebar layout ✅
├── pages/
│   ├── LoginPage.tsx          ✅
│   ├── RegisterPage.tsx       ✅
│   ├── DashboardPage.tsx      ✅ (KPI cards, quick actions)
│   ├── ProductsPage.tsx       ✅ (needs image upload)
│   ├── OrdersPage.tsx         ✅ (needs kanban)
│   ├── CustomersPage.tsx      ✅
│   ├── StatsPage.tsx          ✅
│   └── PublicStorePage.tsx    🔶 (needs templates + quick-order form)
├── services/api.ts            ← Full Axios client ✅
└── store/authStore.ts         ← Zustand auth ✅
```

---

## 4. Infrastructure (Docker Compose)

| Service | Purpose |
|---------|---------|
| `backend` | Laravel 11 (PHP-FPM) |
| `frontend` | Vite (dev) / Nginx static (prod) |
| `postgres` | PostgreSQL 16 — primary DB |
| `redis` | Cache + queues + rate limiting |
| `minio` | Local S3-compatible object storage |
| `nginx` | Reverse proxy + SSL termination |
| `queue-worker` | Laravel Horizon queue processing |
| `scheduler` | `artisan schedule:run` (cron) |

**CDN Storage:** Cloudflare R2 (prod) — bucket `codshop-media`
- URL pattern: `https://cdn.codshop.ma/{tenant_id}/{filename}`
- Local dev: MinIO at `http://localhost:9000`

---

## 5. Storefront Rendering Recommendation

> **Use Next.js 15 (App Router SSR) for the public storefront.**

```
Browser → mystore.com/products/[slug]
              ↓
    Next.js middleware → detectTenant(Host header)
              ↓
    page.tsx → fetch /api/storefront/products/{slug}
              ↓
    generateMetadata() → og:title, og:image, JSON-LD
              ↓
    HTML rendered server-side → Google indexes ✅
```

The admin dashboard stays in Vite/React 19.

---

---

# PART 3 — Database Schema

**DBMS:** PostgreSQL 16
**Strategy:** Shared DB, `tenant_id` row-level isolation everywhere

## Tables Overview

| Table | Scope | Status |
|-------|-------|--------|
| `plans` | Platform | Exists ✅ |
| `templates` | Platform | **NEW** |
| `users` | Platform | Exists ✅ (extend) |
| `tenants` | Platform | Exists ✅ (extend) |
| `tenant_settings` | Per tenant | **NEW** |
| `categories` | Per tenant | Exists ✅ |
| `products` | Per tenant | Exists ✅ (extend) |
| `media` | Per tenant | **NEW** (replaces images JSON) |
| `variants` | Per tenant | Exists ✅ |
| `customers` | Per tenant | Exists ✅ (extend) |
| `orders` | Per tenant | Exists ✅ (extend) |
| `order_items` | Per tenant | Exists ✅ (extend) |
| `shipping_zones` | Per tenant | **NEW** |
| `staff_invitations` | Per tenant | **NEW** |

## Key Schema Changes Needed

### `tenants` — Add columns:
```sql
template_id              BIGINT FK → templates
custom_domain_verified_at TIMESTAMPTZ NULL
subscription_start_date  TIMESTAMPTZ
ssl_issued_at            TIMESTAMPTZ NULL
```

### `tenant_settings` — NEW table:
```sql
tenant_id                BIGINT FK UNIQUE
whatsapp_number          VARCHAR(30)        -- E.164: +212600000000
whatsapp_message_template TEXT
store_logo_url           TEXT
store_banner_url         TEXT
primary_color            VARCHAR(7)         -- Hex color
accent_color             VARCHAR(7)
font_family              VARCHAR(100)
seo_title                VARCHAR(255)
seo_description          TEXT
quick_order_form_enabled BOOLEAN DEFAULT true
captcha_enabled          BOOLEAN DEFAULT false
```

### `products` — Add columns, remove `images` JSON:
```sql
meta_title               VARCHAR(255) NULL
meta_description         TEXT NULL
og_image_url             TEXT NULL
is_featured              BOOLEAN DEFAULT false
sort_order               INT DEFAULT 0
weight_grams             INT NULL
-- REMOVE: images JSON column → move to `media` table
```

### `media` — NEW table (replaces images JSON):
```sql
id, tenant_id, mediable_type, mediable_id,
filename, storage_path, url, mime_type,
size_bytes, width, height, alt_text, sort_order
```

### `orders` — Add columns:
```sql
source           ENUM('quick_form','whatsapp','manual')
subtotal         DECIMAL(12,2)
shipping_cost    DECIMAL(10,2) DEFAULT 0
shipping_address TEXT
shipping_city    VARCHAR(100)
customer_note    TEXT NULL
assigned_to      BIGINT FK → users NULL
confirmed_at     TIMESTAMPTZ NULL
```

### `order_items` — Add snapshot columns:
```sql
product_name  VARCHAR(255)   -- snapshot at order time
variant_name  VARCHAR(255) NULL
unit_price    DECIMAL(10,2)  -- snapshot at order time
```

### `customers` — Add columns:
```sql
city           VARCHAR(100) NULL
is_blacklisted BOOLEAN DEFAULT false
```

## Tenant Isolation in Code

```php
// TenantScope.php — auto-applied to all tenant-scoped models
class TenantScope implements Scope {
    public function apply(Builder $builder, Model $model): void {
        if ($tenant = app('tenant')) {
            $builder->where($model->getTable() . '.tenant_id', $tenant->id);
        }
    }
}

// In each model:
protected static function booted(): void {
    static::addGlobalScope(new TenantScope());
    static::creating(fn($m) => $m->tenant_id ??= app('tenant')?->id);
}
```

---

---

# PART 4 — Development Roadmap

## Sprint 0 — Foundation Fixes (1 week)

### Backend
- [ ] Add missing DB columns (migrations for tenants, products, customers, orders, order_items)
- [ ] Create new tables: `templates`, `tenant_settings`, `media`, `shipping_zones`, `staff_invitations`
- [ ] Implement `TenantScope` global Eloquent scope on all tenant models
- [ ] Remove `images` JSON from products → migrate to `media` table
- [ ] Update seeders: TemplateSeeder (Horizon, Bolt, Bloom), update PlanSeeder
- [ ] Setup Laravel Horizon for queue management

### Frontend
- [ ] Fix Tailwind CSS (ensure PostCSS pipeline works, test classes render)
- [ ] Verify all page imports compile without errors
- [ ] Connect `.env` → `VITE_API_URL=http://localhost:8000/api`
- [ ] Run `npm install` and start `npm run dev`

---

## Sprint 1 — Auth + Store Setup (1.5 weeks)

### Backend
- [ ] Email sending via Laravel Notifications (Mailtrap dev)
- [ ] Staff invitation endpoint + accept flow
- [ ] `POST /api/stores` — store wizard (creates tenant + tenant_settings in one transaction)
- [ ] `GET /api/storefront/store` — public store config endpoint

### Frontend Admin
- [ ] Login page → wired to backend, token persisted
- [ ] Register page → store wizard (name, email, phone, password, store name, WhatsApp, template picker)
- [ ] OTP verification page
- [ ] Forgot/Reset password pages

**Deliverable:** Merchant registers → verifies email → creates store → sees dashboard

---

## Sprint 2 — Admin Dashboard (2 weeks)

### Products
- [ ] Product list (paginated, filterable, searchable)
- [ ] Product create/edit form (name, description, price, promo, variants, category)
- [ ] Multi-image upload (drag & drop, reorder, delete)
- [ ] Category CRUD
- [ ] Product limit enforcement UI

### Orders
- [ ] Order list table (filter by status/date)
- [ ] Kanban board (drag-and-drop status update)
- [ ] Order detail (items, customer, notes, status timeline)
- [ ] Bulk status update + CSV export

### Customers
- [ ] Customer list (search by name/phone), blacklist toggle
- [ ] Customer profile → order history

### Settings
- [ ] Store info (name, logo, banner)
- [ ] WhatsApp settings (number, message template preview)
- [ ] Template switcher (3 templates, preview + apply)
- [ ] Custom domain connect + DNS instructions modal
- [ ] Staff management (invite, list, revoke)

**Deliverable:** Full functional merchant admin dashboard

---

## Sprint 3 — Public Storefront (2 weeks)

### New Backend Endpoints (Storefront — no auth)
- [ ] `GET /api/storefront/store` — store config, theme, WhatsApp number
- [ ] `GET /api/storefront/products?page&category&search`
- [ ] `GET /api/storefront/products/{slug}`
- [ ] `GET /api/storefront/categories`
- [ ] `POST /api/storefront/orders` — quick order form submit

### Frontend Storefront (Next.js 15)
- [ ] Tenant detection via Next.js middleware (hostname → API call)
- [ ] Home: hero, featured products, categories
- [ ] Category page: product grid, filters
- [ ] Product detail: image gallery, variants, WhatsApp button, Quick Order Form
- [ ] Order success page
- [ ] 3 templates: Horizon / Bolt / Bloom (CSS variables per template)
- [ ] `generateMetadata()`, JSON-LD, sitemap.xml, robots.txt

**Deliverable:** SEO-optimized storefront, WhatsApp ordering, quick-order form live

---

## Sprint 4 — Media + Shipping Zones (1 week)

- [ ] `POST /api/media/upload` → MinIO/R2, auto-resize > 800px
- [ ] Storage quota middleware
- [ ] Shipping zone CRUD (city list + cost)
- [ ] Auto-calculate shipping cost in quick order form

---

## Sprint 5 — Billing + Notifications + Super Admin (1.5 weeks)

- [ ] `CheckSubscriptionActive` middleware (read-only on expiry)
- [ ] New order email → merchant (queued job)
- [ ] In-app unread orders badge
- [ ] Super Admin panel: platform stats, tenant management, plan CRUD

---

## Sprint 6 — Production Deployment (1 week)

- [ ] Docker multi-stage production build
- [ ] Nginx SSL (certbot wildcard + custom domains)
- [ ] Full API documentation (Scribe)
- [ ] Performance audit: N+1 queries, DB indexes
- [ ] OWASP security checklist

---

## Future Sprints (Post-MVP)

| Feature | Effort |
|---------|--------|
| CMI / Stripe payment | 2 weeks |
| SMS notifications | 1 week |
| Customer accounts/login | 2 weeks |
| Multi-language (AR/FR/EN) | 2 weeks |
| WhatsApp Business API (WABA) | 3 weeks |
| React Native mobile app | 8-12 weeks |
| Template marketplace | 4 weeks |
| Bulk product CSV import | 1 week |

---

## Immediate Next Step

**Start today with Sprint 0:**

```bash
# 1. Backend — setup .env and run migrations
cd backend
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed

# 2. Start backend
php artisan serve   # → http://localhost:8000

# 3. Frontend — install and run
cd ../frontend
npm install
npm run dev         # → http://localhost:5173

# Login: test@example.com / password
```

> The backend API is ready. The frontend pages are built. The main work is wiring them together (Sprint 1), then building the templates + WhatsApp flow (Sprint 3). Start with the storefront quick-order form — that's the core CODShop differentiator.