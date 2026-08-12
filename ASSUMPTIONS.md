# Assumptions

## 1. Currency

### Assumption
Financial values are displayed in INR/₹.

### Reason
The implementation stores transaction currency as `INR` in the database model and formats values through the frontend helper that calls `Intl.NumberFormat` with `currency: 'INR'`.

### Impact
All transaction totals, chart values, and dashboard summaries in the UI are intentionally expressed in Indian Rupees.

## 2. Demo User

### Assumption
The application uses a seeded demo user for dashboard and reward flows.

### Reason
The backend seed process creates a user with the email `demo@credora.app`, and reward-related endpoints use that seeded identity as the default user context.

### Impact
The app behaves as a single-user demo environment rather than an authenticated multi-user product.

## 3. Transaction Dataset

### Assumption
The provided transaction dataset is treated as the system of record for the demo environment.

### Reason
The backend seed code loads records from `data/transactions.json`, normalizes their timestamps and categories, and inserts them into PostgreSQL before the app serves dashboard data.

### Impact
The app presents a seeded dataset rather than live banking data or an externally managed transaction feed.

## 4. Duplicate Transaction IDs

### Assumption
Duplicate source IDs are retained as part of the imported source dataset.

### Reason
The seed audit explicitly tracks duplicate values in the `id` field from the source JSON and the database model stores `source_id` separately from the database primary key. The primary key is the local integer `transactions.id` column.

### Impact
The app preserves external source identifiers for data provenance while allowing multiple rows to exist with the same imported source id when present in the source data.

## 5. Missing Categories

### Assumption
Missing, empty, or whitespace-only categories are normalized before insertion.

### Reason
The seed pipeline checks for `None`, empty strings, and whitespace-only values and converts them to the literal value `Uncategorized` using the normalization logic in `backend/app/seed/phase1.py`.

### Impact
Category views and analytics remain stable even when the source dataset contains incomplete category values.

## 6. Reward Coins

### Assumption
Monetary values and reward points are intentionally different concepts.

### Reason
Transactions are priced in INR, while rewards operate on a separate coin-based balance tracked in the user model and reward redemption flow.

### Impact
The dashboard shows monetary totals in INR while reward actions and balances are represented as coins.

## 7. Authentication

### Assumption
Authentication is not implemented for the current assessment scenario.

### Reason
The repository does not contain an auth system, login flow, or protected routes. The implemented product uses the seeded demo user as the operational identity.

### Impact
The app is a demo dashboard and not a production-grade authenticated system.

## 8. Other Product Assumptions

### Assumption
The project is designed as a local developer demo and assessment project rather than a fully deployed production platform.

### Reason
The repo includes local Docker PostgreSQL startup, local FastAPI startup, and local Next.js development setup, but no public deployment configuration or hosted environment.

### Impact
The documentation uses placeholders for deployed URLs and explicitly marks them as TODO.

---

### Assumption
The frontend is intended to use the configured backend through a Next.js rewrite proxy.

### Reason
`frontend/next.config.js` rewrites requests from `/api/:path*` to the configured backend URL and defaults to `http://127.0.0.1:8000` when `NEXT_PUBLIC_API_URL` is unavailable.

### Impact
Frontend API calls are expected to run in a local development context with a backend service available at the configured URL.
