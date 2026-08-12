# Technical Decisions

## 1. State Management

### Decision
The frontend uses React local state via `useState`, `useEffect`, and `useMemo` hooks instead of a global state library.

### Why
The dashboard is composed of a small number of data-loading flows and route-level components. Local component state is sufficient for transaction loading, reward polling, filter state, redemption state, and theme handling.

### Alternative Considered
A global store such as Redux, Zustand, or a context-heavy state layer.

### Trade-off
This keeps the solution lightweight and easy to trace, but it does not provide a large-scale app state architecture for a more complex multi-feature product.

## 2. API Integration

### Decision
The frontend communicates with FastAPI through the Next.js rewrite proxy at `/api/*` and the `fetch` helper in `frontend/lib/api.ts`.

### Why
The project config rewrites `/api/:path*` to the configured backend URL, which keeps the frontend codepath stable while allowing the API host to be configured by environment variables.

### Alternative Considered
Directly calling the backend host from every frontend component.

### Trade-off
This keeps API usage consistent and environment-friendly, but it adds a proxy layer that must be configured correctly in local/dev environments.

## 3. Pagination vs Virtualization

### Decision
Transactions are paginated on the backend and consumed page-by-page in the frontend rather than virtualized.

### Why
The API already exposes `page`, `page_size`, `total`, and `total_pages` and the repository implements server-side filtering and sorting. This matches the dataset size and keeps result logic precise.

### Alternative Considered
Virtualization or client-side rendering of the full transaction list.

### Trade-off
This keeps memory usage low and makes filtering and backend validation predictable, but it limits the UI to page-based browsing rather than a continuous scrolling list.

## 4. Database Schema

### Decision
The schema is normalized into separate tables for users, transactions, rewards, and reward redemptions.

### Why
Each domain is logically distinct: user balances and identity, transaction history, reward catalog, and reward redemption history all require different responsibilities and constraints.

### Alternative Considered
A single flat table or merged reward history into transaction records.

### Trade-off
This improves clarity and query correctness, but requires more relational joins and a more deliberate migration and seed setup.

## 5. Duplicate Source IDs

### Decision
The project keeps `source_id` as a source-derived field and uses a separate database primary key (`id`) for each row.

### Why
The source dataset may contain duplicate external identifiers, and the schema explicitly preserves those values while assigning a unique internal database row id for each inserted record.

### Alternative Considered
Using `source_id` as the primary key.

### Trade-off
This preserves the source data faithfully, but it means duplicate external IDs can exist across different database rows when the source contains duplicates.

## 6. Timestamp Normalization

### Decision
The seed pipeline normalizes mixed timestamp formats into UTC-aware Python datetimes before writing to PostgreSQL.

### Why
The source dataset contains mixed timestamp representations, including ISO-8601 strings, slash-delimited values, and epoch-style values. Normalizing them enables consistent sorting and filtering by date.

### Alternative Considered
Storing raw strings without normalization.

### Trade-off
This adds complexity to the seed code but creates consistent API behavior for date filters and transaction chronology.

## 7. Missing Category Normalization

### Decision
Missing or blank category values are normalized to `Uncategorized`.

### Why
The seed logic checks for `None`, empty strings, and whitespace-only category values and converts them before insertion. This keeps analytics and category grouping stable.

### Alternative Considered
Leaving category values as `null` or empty strings throughout the app.

### Trade-off
This makes category charts cleaner and easier to read, but it introduces a synthetic category label instead of preserving the raw missing value.

## 8. Service / Repository Separation

### Decision
The backend separates the request/service layer from direct database access through repositories.

### Why
This enforces a cleaner structure in which service classes orchestrate business rules while repository classes encapsulate query logic and persistence operations.

### Alternative Considered
Putting business logic directly into route handlers.

### Trade-off
The code is easier to test and reason about, but it introduces additional layers to navigate.

## 9. API Validation

### Decision
The API uses FastAPI validation with query constraints and explicit HTTP exceptions for invalid ranges and invalid payloads.

### Why
The route layer enforces page bounds, amount comparisons, sorting choices, and request schema validation before processing requests. This prevents invalid queries from reaching downstream logic.

### Alternative Considered
Relying only on frontend validation and permissive backend acceptance.

### Trade-off
This produces cleaner error responses and safer inputs, while requiring predictable validation semantics in the API contract.

## 10. Responsive UI

### Decision
The dashboard uses a responsive, mobile-first layout with Tailwind CSS and a collapsible navigation pattern for smaller screens.

### Why
The app includes a sidebar, mobile drawer menu, and adaptive cards to support desktop, tablet, and mobile readability without a full redesign per breakpoint.

### Alternative Considered
A single desktop-only layout with overflow-based adaptation.

### Trade-off
The UI remains accessible across screen sizes, but the layout requires deliberate adjustments to avoid cramped mobile interfaces.

## 11. Theme System

### Decision
The theme system uses CSS custom properties and a small toggle component backed by `localStorage` and `matchMedia`.

### Why
The app defines light and dark color palettes in `frontend/app/globals.css` and switches the `data-theme` attribute on the document root. The stored preference persists across sessions via browser local storage.

### Alternative Considered
Hardcoded dark-only or light-only styling.

### Trade-off
This creates a polished, configurable interface, while adding a small amount of client-side behavior for theme state.

## 12. Testing Strategy

### Decision
The project uses a mix of backend pytest checks, frontend lint/type/build validation, and runtime smoke testing.

### Why
The repository includes API regression tests for transactions and rewards, plus frontend checks for syntax, static typing, and production build health. These checks help catch issues across the stack and confirm that the app behaves coherently with the live backend contract.

### Alternative Considered
Testing only the UI or only the API.

### Trade-off
This provides stronger product confidence, but it requires multiple verification pipelines and a disciplined local setup.
