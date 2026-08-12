# Credora Finance Dashboard

Credora is a finance dashboard for reviewing transactions, tracking spending trends, and redeeming rewards using a real backend data model. The project combines a Next.js frontend with a FastAPI API and PostgreSQL-backed persistence to provide a responsive dashboard experience for transaction analytics and reward management.

## Overview

Credora focuses on helping users monitor financial activity across a transaction feed and convert reward points into available partner offers. The implemented application includes transaction discovery, filtering, sorting, pagination, analytics summaries, reward balances, and reward redemption flows. The frontend is responsive and includes both light and dark visual themes.

## Key Features

### Transaction Management

- Transaction listing from the live API
- Search and filtering by merchant, category, status, date range, and amount range
- Sorting by date or amount in ascending or descending order
- Pagination controls for large result sets
- Transaction detail endpoint access
- Transaction summary cards and recent activity panels

### Analytics

- Recent spend trend visualization
- Category-level spend breakdown
- Dashboard summary metrics built from the available transaction dataset
- Analytics page for reviewing transaction distribution and totals

### Rewards

- Reward catalogue with coin costs
- Current reward balance display
- Reward redemption flow for valid selections
- Redemption validation for insufficient balance, inactive rewards, and duplicate redemptions
- Updated balance state after successful redemption

### UI/UX

- Responsive dashboard layout for desktop, tablet, and mobile screens
- Side navigation and mobile menu patterns
- Light theme and charcoal dark theme styling
- Reusable card-based dashboard components
- Form controls and filtering interfaces designed for readability and accessibility

## Technology Stack

### Frontend

- Next.js 14.2.15
- React 18
- TypeScript
- Tailwind CSS
- CSS custom properties and design tokens

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic and Pydantic Settings
- Alembic for schema migrations

### Database

- PostgreSQL

### Infrastructure

- Docker Compose for PostgreSQL startup
- API proxy configuration in Next.js routing

### Testing

- pytest
- Next.js linting
- TypeScript compiler checks
- Production build validation

### Development Tools

- Node.js and npm
- Python virtual environment
- Alembic migration tooling

## Architecture

```mermaid
flowchart TD
    B[Browser] --> F[Next.js Frontend]
    F --> P[/api rewrite proxy]
    P --> A[FastAPI Backend]
    A --> S[Service Layer]
    S --> R[Repository Layer]
    R --> D[(PostgreSQL)]
```

The application is structured around a browser-facing Next.js dashboard that calls backend endpoints through a local `/api` rewrite. FastAPI provides the route layer and business logic, while SQLAlchemy repositories handle database access. The database stores transactional, user, and reward data in PostgreSQL.

## Project Structure

```text
credora-finance-dashboard/
├── README.md
├── docker-compose.yml
├── backend/
│   ├── .env.example
│   ├── alembic/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── seed/
│   │   ├── services/
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── pytest.ini
│   └── .venv310/
├── data/
│   └── transactions.json
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── .env.example
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── .gitignore
```

## Database

The project uses PostgreSQL as the primary datastore. Data models are defined with SQLAlchemy in the backend and are organized under `backend/app/models`.

Core models in the repository include:

- `User`
  - Stores user email and coin balance.
- `Transaction`
  - Stores merchant, category, status, amount, currency, timestamp, source metadata, and payment details.
- `Reward`
  - Stores reward catalogue entries with name, description, cost, active state, and image metadata.
- `RewardRedemption`
  - Records reward redemptions, user linkage, reward linkage, coin spend amount, and redemption timestamp.

Migrations are managed with Alembic under `backend/alembic`. The configuration file `backend/alembic.ini` points to the database URL used for migrations.

## API Documentation

### Health

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Confirms the API is running. |

### Transactions

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/transactions` | Returns paginated, filterable transaction results. |
| GET | `/api/transactions/{transaction_id}` | Returns a single transaction by ID. |

Query parameters for `GET /api/transactions`:

- `page` — page number, minimum value `1`
- `page_size` — results per page, range `1..100`
- `merchant` — case-insensitive merchant text match
- `category` — exact category match after normalization
- `status` — exact status match after normalization
- `start_date` — inclusive start date filter
- `end_date` — inclusive end date filter
- `min_amount` — minimum amount threshold
- `max_amount` — maximum amount threshold
- `sort_by` — `date` or `amount`
- `sort_order` — `asc` or `desc`

Validation behavior:

- `start_date` must be less than or equal to `end_date`
- `min_amount` must be less than or equal to `max_amount`
- invalid values return `422` validation responses

### Rewards

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/rewards` | Lists active rewards in the catalogue. |
| GET | `/api/rewards/balance` | Returns the current demo user reward balance and available rewards. |
| POST | `/api/rewards/redeem` | Redeems a reward for a user if all validations succeed. |

`POST /api/rewards/redeem` body:

```json
{
  "reward_id": 1,
  "user_id": 1
}
```

Important backend validation outcomes:

- `404` if the user, reward, or demo user is missing
- `400` if the reward is inactive or the user has insufficient balance
- `409` if the same reward has already been redeemed by the same user
- `422` for invalid request payloads
- `500` for unexpected internal failure

## Transaction Filters

The implementation supports the following confirmed filters and sorting options on the transactions API:

| Parameter | Description |
|---|---|
| `page` | Page number for pagination |
| `page_size` | Number of results requested per page |
| `merchant` | Filter by merchant text |
| `category` | Filter by transaction category |
| `status` | Filter by transaction status |
| `start_date` | Inclusive lower date boundary |
| `end_date` | Inclusive upper date boundary |
| `min_amount` | Minimum transaction value |
| `max_amount` | Maximum transaction value |
| `sort_by` | `date` or `amount` |
| `sort_order` | `asc` or `desc` |

## Reward Redemption Workflow

The actual redemption flow is implemented as follows:

1. The frontend loads the rewards catalogue and the current balance.
2. A user selects a reward they can afford.
3. The UI sends a POST request to `/api/rewards/redeem` with `reward_id` and `user_id`.
4. The FastAPI backend validates the reward, user, active status, balance, and duplicate redemption state.
5. If valid, the repository creates a `RewardRedemption` record and decrements the user coin balance.
6. The API responds with the result, including the remaining balance.
7. The UI refreshes the displayed reward and balance state.

This behavior is enforced in the service layer and protected by the repository-level duplicate-check logic.

## Local Development

### Prerequisites

- Python 3.10-compatible environment
- Node.js and npm
- PostgreSQL instance or Docker Compose-based PostgreSQL service

### Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# set DATABASE_URL=<your_database_url>

alembic upgrade head
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The repository includes a sample backend environment file at `backend/.env.example`. The application also uses `DATABASE_URL` from the environment to connect to PostgreSQL.

### Frontend

```bash
cd frontend
npm install
# optional, if the backend is not running on the default port
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm run dev -- --hostname 127.0.0.1 --port 3001
```

The frontend config in `frontend/next.config.js` proxies `/api/*` requests to the configured backend URL. If `NEXT_PUBLIC_API_URL` is not set, it falls back to `http://127.0.0.1:8000`.

## Docker

A Docker Compose file is present at the repository root and defines a PostgreSQL service:

```bash
docker compose up -d postgres
```

The configured database service exposes PostgreSQL on port `5432` with the following environment values:

- Database: `credora`
- User: `postgres`
- Password: `postgres`

This repository currently includes the database container definition; it does not include a complete multi-service application container stack for the frontend and backend.

## Testing

The project includes frontend and backend verification commands that are reflected in the repository configuration and current validation workflow.

### Frontend validation

```bash
cd frontend
npm run lint
npm run typecheck
npm run build
```

### Backend validation

```bash
cd backend
.venv310\Scripts\python.exe -m pytest -q
```

## Responsive Design

The dashboard is implemented to support desktop, tablet, and mobile layouts. The user experience includes responsive navigation patterns, adaptive card layouts, transaction filtering panels, and mobile-friendly reward interactions. The styling aims to avoid intentional horizontal overflow while maintaining readable spacing across breakpoints.

## Theming

The UI implements both a light theme and a charcoal dark theme through the global CSS design tokens. The current implementation includes theme-specific color variables and a theme toggle in the dashboard shell. Theme persistence is not explicitly confirmed in the inspected code beyond the styling system itself.

## Currency

The application uses Indian Rupees as its currency and displays values using the `INR`/`₹` format in the dashboard and analytics outputs.

## Error Handling

The implemented behavior includes the following observed states:

- Loading states while API data is being fetched
- Empty and fallback states for missing card data
- Error states with retry actions when API requests fail
- Validation errors for invalid query parameters or invalid redemption requests
- Redemption-specific errors for insufficient balance, inactive rewards, and duplicate reward claims

## Test / Verification Summary

| Area | Status |
|---|---|
| Frontend lint | Passed |
| TypeScript | Passed |
| Production build | Passed |
| Backend tests | Passed |
| Transaction API | Verified |
| Rewards API | Verified |
| Redemption | Verified |
| Responsive UI | Verified |
| Light/Dark mode | Verified |

## Security

- Do not commit `.env` files or secrets into the repository.
- Keep database credentials and production secrets outside source control.
- Use environment variables for configuration values.
- Validate API inputs on the backend before processing requests.
- Keep sensitive configuration in local or deployment-specific secret stores.

No authentication or authorization layer is implemented in the repo as part of the current product scope.

## Future Improvements

The following areas are realistic next steps but are not implemented in the current codebase:

- Authentication and user identity management
- Richer analytics and reporting exports
- Notifications for key events and rewards activity
- CI/CD automation for automated deployments
- Production deployment orchestration and observability

## Screenshots

Screenshots can be added here for:

- Dashboard
- Transactions
- Rewards
- Analytics
- Light/Dark themes

## Demo / Deployment

> Live deployment: Not currently provided.

## License

No explicit license file is present in the repository root. License details should be confirmed before any public distribution or reuse.
