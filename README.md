# Credora Finance Dashboard

> A modern, responsive finance dashboard for transaction management, spending analytics, and reward redemption.

Credora is a full-stack finance management application built with **Next.js, FastAPI, and PostgreSQL**. It provides a responsive dashboard for reviewing financial transactions, analyzing spending patterns, and redeeming rewards through a real backend API and persistent PostgreSQL database.

The application supports transaction filtering, sorting, pagination, analytics, reward management, redemption validation, INR formatting, and light/dark themes.

---

## 🚀 Live Demo

### Frontend

🔗 **Live Application:**  
https://credora-finance-dashboard-dqy0lu62r-prijithjohns-projects.vercel.app/

### Backend API

🔗 **FastAPI Backend:**  
https://backend-x4k3.onrender.com

### API Health

🔗 **Health Check:**  
https://backend-x4k3.onrender.com/health

### Demo Video

🎥 **Walkthrough:**  
https://drive.google.com/file/d/1azwUT_ZrrrPty8z2viSWIWC34leqyR9z/view?usp=sharing

---

## ✨ Features

### 📊 Dashboard
- Financial overview dashboard
- Total spending and transaction summaries
- Recent transaction activity
- Spending trend visualization
- Category-based spending analysis
- Responsive dashboard layout
- Light and charcoal dark themes

### 💳 Transaction Management
- Transaction listing from PostgreSQL
- Search by merchant
- Filter by category and status
- Date-range filtering
- Minimum and maximum amount filters
- Sorting by date or amount
- Ascending and descending sorting
- Pagination
- Individual transaction details
- Loading, empty, and error states

### 🎁 Rewards
- Reward catalogue
- Reward coin costs
- Current reward balance
- Reward redemption
- Insufficient-balance validation
- Inactive-reward validation
- Duplicate-redemption validation
- Automatic balance update after redemption

### 🎨 UI / UX
- Minimalist fintech-inspired interface
- Responsive desktop, tablet, and mobile layouts
- Light theme
- Charcoal dark theme
- Reusable UI components
- Accessible form controls
- Keyboard-friendly interactions
- INR currency formatting

---

# 🏗️ Architecture

```mermaid
flowchart TD
    U[User Browser] --> F[Next.js Frontend]
    F --> P[API Rewrite / Proxy]
    P --> B[FastAPI Backend]
    B --> S[Service Layer]
    S --> R[Repository Layer]
    R --> D[(Supabase PostgreSQL)]
    B --> V[Pydantic Validation]
```

### Architecture Flow

```text
Browser
   │
   ▼
Next.js / React
   │
   │ /api/*
   ▼
FastAPI
   │
   ├── API Routes
   ├── Pydantic Schemas
   ├── Service Layer
   └── Repository Layer
            │
            ▼
      PostgreSQL
       (Supabase)
```

---

# 🛠️ Technology Stack

## Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- CSS Custom Properties
- Design Tokens

## Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Pydantic Settings
- Alembic
- Uvicorn

## Database
- PostgreSQL
- Supabase PostgreSQL

## Testing
- pytest
- TypeScript strict checking
- ESLint
- Next.js production build

## Deployment
- Vercel — Frontend
- Render — Backend
- Supabase — PostgreSQL

---

# 📁 Project Structure

```text
credora-finance-dashboard/
│
├── README.md
├── ASSUMPTIONS.md
├── DECISIONS.md
├── AI-USAGE.md
├── docker-compose.yml
│
├── backend/
│   ├── alembic/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── seed/
│   │   └── services/
│   ├── tests/
│   ├── requirements.txt
│   ├── alembic.ini
│   └── runtime.txt
│
├── data/
│   └── transactions.json
│
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    ├── public/
    ├── next.config.js
    ├── package.json
    └── tsconfig.json
```

---

# 🗄️ Database

Credora uses **PostgreSQL** as its persistent datastore.

The deployed application uses:

```text
Supabase PostgreSQL
```

### Core entities

#### User
- User identity
- Reward coin balance

#### Transaction
- Merchant
- Category
- Status
- Amount
- Currency
- Timestamp
- Source metadata
- Payment information

#### Reward
- Reward name
- Description
- Coin cost
- Active status
- Image metadata

#### RewardRedemption
- User
- Reward
- Coin cost
- Redemption timestamp

---

# 🔌 API Documentation

## Health

```http
GET /health
```

Returns the backend health status.

## Transactions

### Get transactions

```http
GET /api/transactions
```

Supports:

```text
page
page_size
merchant
category
status
start_date
end_date
min_amount
max_amount
sort_by
sort_order
```

Example:

```http
GET /api/transactions?page=1&page_size=20&sort_by=date&sort_order=desc
```

### Get transaction

```http
GET /api/transactions/{transaction_id}
```

---

# 🎁 Rewards API

### Get rewards

```http
GET /api/rewards
```

### Get balance

```http
GET /api/rewards/balance
```

### Redeem reward

```http
POST /api/rewards/redeem
```

Request:

```json
{
  "reward_id": 1,
  "user_id": 1
}
```

### Redemption validation

The backend handles:
- Invalid users
- Invalid rewards
- Inactive rewards
- Insufficient balance
- Duplicate redemption
- Invalid request payloads

A successful redemption:

```text
Validate request
      ↓
Validate user
      ↓
Validate reward
      ↓
Check balance
      ↓
Check duplicate redemption
      ↓
Create redemption
      ↓
Deduct coins
      ↓
Return updated balance
```

---

# 💰 Currency

The dashboard uses **Indian Rupees (INR)**.

Examples:

```text
₹1,250
₹24,500
₹85,750
```

Financial values are formatted consistently throughout the dashboard and analytics views.

---

# 🌓 Theming

Credora provides two visual themes.

### Light Mode
- Warm off-white background
- White surfaces
- Charcoal typography
- Subtle borders
- Restrained green accents

### Dark Mode
- Charcoal background
- Muted dark surfaces
- Soft light typography
- Restrained green accents
- No pitch-black treatment

The goal is a clean, premium fintech appearance rather than an overly saturated dashboard.

---

# 📱 Responsive Design

The application was tested across:

```text
1440 × 900
1280 × 800
1024 × 768
768 × 1024
430 × 932
390 × 844
360 × 800
```

Responsive behavior includes:
- Adaptive dashboard layout
- Mobile navigation
- Responsive cards
- Responsive transaction tables
- Mobile-friendly filters
- Responsive reward cards
- No intentional horizontal overflow

---

# 🧪 Testing & Verification

## Frontend

```bash
cd frontend

npm run lint
npm run typecheck
npm run build
```

## Backend

```bash
cd backend

.venv310\Scripts\python.exe -m pytest -q
```

### Current verification

| Check | Result |
|---|---|
| Frontend lint | ✅ Passed |
| TypeScript | ✅ Passed |
| Production build | ✅ Passed |
| Backend tests | ✅ 32 passed |
| Transaction API | ✅ Verified |
| Rewards API | ✅ Verified |
| Reward redemption | ✅ Verified |
| Responsive UI | ✅ Verified |
| Light/Dark mode | ✅ Verified |
| Production backend | ✅ Deployed |

---

# 🚀 Local Development

## Prerequisites

- Python 3.10+
- Node.js
- npm
- PostgreSQL or Docker

## 1. Start PostgreSQL

```bash
docker compose up -d postgres
```

## 2. Configure Backend

```bash
cd backend
```

Create `.env`:

```env
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:PORT/DATABASE
```

For local development, use your local PostgreSQL configuration.

## 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

## 4. Run Migrations

```bash
alembic upgrade head
```

## 5. Seed Database

```bash
python app/seed/phase1.py
```

This initializes the demo data, rewards, and transaction dataset.

## 6. Start Backend

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend:

```text
http://127.0.0.1:8000
```

## 7. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

If required:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

# 🌐 Production Deployment

## Frontend

The frontend is deployed using:

```text
Vercel
```

Live URL:

```text
https://credora-finance-dashboard-dqy0lu62r-prijithjohns-projects.vercel.app/
```

## Backend

The backend is deployed using:

```text
Render
```

Live URL:

```text
https://backend-x4k3.onrender.com
```

## Database

The production database uses:

```text
Supabase PostgreSQL
```

### Production architecture

```text
             ┌─────────────────┐
             │     Vercel      │
             │  Next.js App    │
             └────────┬────────┘
                      │
                      │ HTTPS
                      ▼
             ┌─────────────────┐
             │     Render      │
             │ FastAPI Backend │
             └────────┬────────┘
                      │
                      │ PostgreSQL
                      ▼
             ┌─────────────────┐
             │    Supabase     │
             │   PostgreSQL    │
             └─────────────────┘
```

---

# 📸 Screenshots

## Dashboard

![Credora Dashboard](docs/Dashboard.png)

## Transactions

![Transactions](docs/Transaction.png)

## Analytics

![Analytics](docs/Analysis.png)

## Rewards

![Rewards](docs/Rewards.png)

## Light Mode

![Light Mode](docs/Mode.png)

## Dark Mode

![Dark Mode](docs/Dashboard.png)

---

# 🎥 Demo Video

A short walkthrough demonstrates:

1. Dashboard overview
2. Transaction filtering
3. Transaction sorting
4. Analytics
5. Reward catalogue
6. Reward redemption
7. Balance update
8. Light/dark theme
9. Responsive layout

**Watch the demo:**

(https://drive.google.com/file/d/1azwUT_ZrrrPty8z2viSWIWC34leqyR9z/view?usp=sharing)

---

# 🤖 AI Usage

AI tools were used as development assistance during implementation.

They were primarily used for:
- Reviewing implementation approaches
- Debugging development issues
- Generating/refining UI components
- Reviewing API behavior
- Improving documentation
- Suggesting test scenarios

All generated or suggested changes were reviewed, tested, and integrated manually.

See:
- [`AI-USAGE.md`](AI-USAGE.md)
- [`ASSUMPTIONS.md`](ASSUMPTIONS.md)
- [`DECISIONS.md`](DECISIONS.md)

---

# 🔐 Security

- Secrets are stored through environment variables.
- `.env` files are excluded from source control.
- Production database credentials are not committed.
- Backend validates API inputs.
- Database access is handled through SQLAlchemy.
- No production credentials are included in this repository.

### Authentication

Authentication and user session management are **not part of the current product scope**.

---

# ✅ Done

- PostgreSQL-backed transaction management
- Transaction API
- Transaction pagination
- Transaction filtering
- Transaction sorting
- Transaction details
- Spending analytics
- Category breakdown
- Rewards catalogue
- Reward balance
- Reward redemption
- Redemption validation
- Balance updates
- INR formatting
- Responsive dashboard
- Mobile layout
- Light theme
- Charcoal dark theme
- Reusable UI components
- Backend tests
- Frontend linting
- TypeScript validation
- Production build
- Supabase PostgreSQL
- Render backend deployment
- Vercel frontend deployment

---

# ⚠️ Not Done / Future Improvements

The following are intentionally outside the current scope:

- Authentication and authorization
- Multiple user accounts
- Advanced financial reporting
- Export to CSV/PDF
- Notifications
- Production-grade observability
- Automated CI/CD pipeline
- Advanced role-based access control

---

# 📝 Known Issues

- The current product uses a demo-user flow rather than full authentication.
- Reward redemption is tied to the implemented demo-user/product scope.
- Advanced production observability is not included.

---

# 📚 Project Documentation

Additional project documentation:

- [`ASSUMPTIONS.md`](ASSUMPTIONS.md) — product assumptions made where the brief was ambiguous
- [`DECISIONS.md`](DECISIONS.md) — important technical decisions and rationale
- [`AI-USAGE.md`](AI-USAGE.md) — AI-assisted development disclosure

---

# 📄 License

No explicit license is currently defined for this repository.
