# MessManager

A full-stack mess management system for shared messes (hostel / bachelor kitchens). It tracks meals,
expenses, monthly fixed costs, member deposits, balances, dues, and month-end settlements — with an
approval workflow for creating a mess and for accepting member deposits.

The backend is the single source of truth for every calculation and approval. The frontend is a
role-based single page app that consumes the API.

---

## Table of Contents

- [Overview](#overview)
- [Roles](#roles)
- [Core Workflow](#core-workflow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Demo Accounts](#demo-accounts)
- [Environment Variables](#environment-variables)
- [Frontend Routes](#frontend-routes)
- [API Reference](#api-reference)
- [Data Model](#data-model)
- [Billing and Calculation Rules](#billing-and-calculation-rules)
- [Business Rules](#business-rules)
- [Diagrams](#diagrams)
- [Documentation](#documentation)
- [Development Notes](#development-notes)

---

## Overview

A mess is a shared kitchen where several members eat together and split the cost. MessManager solves
the monthly accounting problem behind that:

- Members log which meals they ate on which day.
- The manager records grocery/market expenses and monthly fixed costs (rent, khala, utilities, wifi).
- At month end the system derives a **cost per meal** from the expense pool, splits fixed costs
  equally, and produces a per-member bill.
- Members deposit money against their bill; the manager approves each deposit, which writes an
  auditable transaction and updates the running balance.
- Members who overpaid can be refunded, with the refund split correctly between the meal portion and
  the fixed portion.

---

## Roles

| Role | Description |
| --- | --- |
| `superAdmin` | Controls the platform. Reviews mess creation requests, approves or rejects them, and activates/deactivates messes and manager accounts. |
| `manager` | Owns one mess. Manages members, records expenses and fixed costs, approves deposit requests, inspects member financials, and issues refunds. |
| `user` | A mess member. Logs meals, views bill and dues, requests deposits, and tracks balance and transaction history. |

---

## Core Workflow

1. **Mess request** — a manager submits the public registration form (mess name, manager name,
   email, password). This creates a `pending` `MessRequest`.
2. **Approval** — the super admin approves or rejects. On approval a `Mess` and a manager `User` are
   created inside one database transaction and linked to each other.
3. **First-login password setup** — accounts flagged with `must_change_password` must set a new
   password before continuing.
4. **Members** — the manager adds members by name and email. A temporary password is generated and
   the member is flagged for first-login password setup.
5. **Meals** — members log meals per date, either one entry at a time or in bulk over a date range.
6. **Money** — the manager records expenses and monthly fixed costs; members submit deposit
   requests; the manager approves them into transactions.
7. **Settlement** — the monthly report shows each member's bill, paid amount, due, and extra.
   Overpaid members can be refunded.

---

## Tech Stack

**Backend**

- PHP `^8.1`, Laravel `^10.10`
- Laravel Sanctum `^3.3` (bearer token auth)
- MySQL by default; any Laravel-supported driver works

**Frontend**

- React `19`, Vite `8`
- Redux Toolkit + RTK Query
- React Router `7`
- Tailwind CSS `4`
- `react-hot-toast`, `lucide-react`

---

## Project Structure

```
messManager/
├── backend/                        Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── AuthController.php         login, register request, profile, password setup
│   │   │   │   ├── ManagementController.php   mess requests, messes, members, activation
│   │   │   │   ├── ExpenseController.php      expenses, fixed costs, deposits, financials, refunds
│   │   │   │   └── MealController.php         meal list, single entry, bulk entry, delete
│   │   │   └── Middleware/EnsureActiveAccount.php
│   │   └── Models/                 User, Mess, MessRequest, Meal, Expense,
│   │                               FixedCost, UserTransaction, UserDepositRequest
│   ├── database/migrations/
│   ├── database/seeders/DatabaseSeeder.php
│   └── routes/api.php
│
├── frontend/                       React + Vite SPA
│   └── src/
│       ├── app/                    App.jsx, store.js
│       ├── features/               RTK Query apiSlice + auth / expenses / management / user slices
│       ├── layouts/                MainLayout, DashboardLayout, SuperAdminLayout, UserLayout
│       ├── routes/                 Routers.jsx, Protected.jsx, RoleProtected.jsx
│       ├── pages/                  Home, Login, Registration, SuperAdmin, Manager, User
│       ├── components/             shared UI and landing page sections
│       ├── hooks/                  useAuth.js
│       └── utils/                  roleBasedNavigation.jsx
│
├── Diagram/                        UML and design diagrams (SVG, PNG, JPG)
├── docs/                           Report, presentation, project overview
└── PROJECT_DETAILS.md              Detailed feature-by-feature specification
```

---

## Getting Started

### Prerequisites

- PHP 8.1+ with the usual Laravel extensions
- Composer
- Node.js 18+ and npm
- MySQL 8 or MariaDB

### 1. Backend

```bash
cd backend
composer install

# copy the env file  (Windows CMD: copy .env.example .env)
cp .env.example .env
php artisan key:generate
```

Edit `backend/.env` and point it at your database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mess_manager
DB_USERNAME=root
DB_PASSWORD=
```

Create the schema and load demo data:

```bash
php artisan migrate --seed
php artisan serve          # http://127.0.0.1:8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

`frontend/.env` points the SPA at the API:

```env
VITE_REACT_APP_BACKEND_URL=http://127.0.0.1:8000
```

The value may be given with or without a trailing `/api` — the client normalises it.

> **CORS** — `backend/config/cors.php` allows `http://localhost:5173` and `http://127.0.0.1:5173`.
> If you run Vite on a different port or host, add it there.

### Available scripts

| Location | Command | Purpose |
| --- | --- | --- |
| `frontend` | `npm run dev` | Vite dev server |
| `frontend` | `npm run build` | Production build |
| `frontend` | `npm run preview` | Preview the production build |
| `frontend` | `npm run lint` | ESLint |
| `backend` | `php artisan serve` | Dev API server |
| `backend` | `php artisan migrate --seed` | Migrate and seed |
| `backend` | `php artisan test` | PHPUnit test suite |

---

## Demo Accounts

Created by `php artisan migrate --seed`:

| Role | Email | Password | Note |
| --- | --- | --- | --- |
| Super Admin | `superadmin@mess.com` | `admin123` | Overridable via `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` |
| Manager | `manager1@mess.com` | `manager123` | Forced to change password on first login |
| Member | `member1@mess.com` | `member123` | Forced to change password on first login |
| Member | `member2@mess.com` | `member123` | Forced to change password on first login |

The seeder also creates a sample mess (*Green Leaf Mess*), fixed costs for the current month, two
expenses, a few meals, and starter transactions.

> These are development credentials. Change them before deploying anywhere real.

---

## Environment Variables

### Backend (`backend/.env`)

| Key | Description |
| --- | --- |
| `APP_KEY` | Generated by `php artisan key:generate` |
| `APP_URL` | Base URL of the API |
| `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Database connection |
| `SUPER_ADMIN_EMAIL` | Optional — seeded super admin email (default `superadmin@mess.com`) |
| `SUPER_ADMIN_PASSWORD` | Optional — seeded super admin password (default `admin123`) |

### Frontend (`frontend/.env`)

| Key | Description |
| --- | --- |
| `VITE_REACT_APP_BACKEND_URL` | API base URL. Defaults to `http://127.0.0.1:8000` when unset. |

---

## Frontend Routes

**Public**

| Path | Page |
| --- | --- |
| `/` | Redirects to the role dashboard when logged in, otherwise the landing page |
| `/home` | Public landing page |
| `/login` | Login |
| `/register` | Mess creation request form |
| `/unauthorized` | Access denied |
| `/404`, `*` | Not found |

**Super admin** (`superAdmin`)

| Path | Page |
| --- | --- |
| `/super-admin/dashboard` | Requests, messes, and system stats |
| `/super-admin/mess-group` | Mess groups with member counts |
| `/super-admin/manager` | Manager details and activation |

**Manager** (`manager`)

| Path | Page |
| --- | --- |
| `/manager/dashboard` | Monthly overview |
| `/manager/members` | Member management |
| `/manager/members-financials` | Per-member financials and refund settlement |
| `/manager/add-expense` | Create an expense |
| `/manager/expense-list` | Expenses for a month |
| `/manager/meals-chart` | Daily meal breakdown |
| `/manager/monthly-report` | Monthly financial report |
| `/manager/mess-settings` | Mess settings and fixed costs |

**Member** (`user`)

| Path | Page |
| --- | --- |
| `/user/dashboard` | Member summary |
| `/user/meal-entry` | Log meals (single / bulk) |
| `/user/meal-chart` | Meal history |
| `/user/my-bill` | Bill summary and dues |
| `/user/balance` | Balance, deposit, transaction history |

Route protection lives in `src/routes/RoleProtected.jsx`: unauthenticated visitors are sent to
`/login`, wrong-role visitors to `/unauthorized`. After login each role lands on its own dashboard.

---

## API Reference

All routes are prefixed with `/api`. Authenticated routes require
`Authorization: Bearer <token>`. Every authenticated route also passes through the `active.account`
middleware, which blocks deactivated users and users of a deactivated mess.

### Public

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/register` | Submit a mess creation request |
| `POST` | `/login` | Log in, receive a Sanctum token |

### Authenticated (any role)

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/logout` | Revoke the current token |
| `GET` | `/user`, `/profile` | Current user profile |
| `POST` | `/password/first-login` | Complete first-login password setup |

### Super admin

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/admin/mess-requests` | List mess requests, filterable by status |
| `POST` | `/admin/mess-requests/{messRequest}/approve` | Approve — creates the mess and manager account |
| `POST` | `/admin/mess-requests/{messRequest}/reject` | Reject a pending request |
| `GET` | `/admin/managers` | List managers |
| `GET` | `/admin/system-report` | System-wide report |
| `GET` | `/admin/messes-with-details` | Messes with member counts |
| `PATCH` | `/admin/messes/{mess}/toggle-status` | Activate / deactivate a mess and its manager |
| `PATCH` | `/admin/managers/{manager}/toggle-status` | Activate / deactivate a manager and their mess |

### Manager

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/manager/mess` | Assigned mess |
| `PUT` | `/manager/mess` | Rename the mess |
| `DELETE` | `/manager/mess` | Delete the mess |
| `GET` | `/manager/members` | List members |
| `POST` | `/manager/members` | Add a member, returns a temporary password |
| `PUT` | `/manager/members/{member}` | Edit a member |
| `DELETE` | `/manager/members/{member}` | Remove a member |
| `GET` | `/manager/deposit-requests` | Pending deposit requests |
| `POST` | `/manager/deposit-requests/{depositRequest}/approve` | Approve a deposit into a transaction |
| `GET` | `/manager/dashboard/stats` | Monthly dashboard totals |
| `GET` | `/manager/meals/daily` | Daily meal breakdown |
| `GET` | `/manager/fixed-costs` | Fixed costs for a month |
| `PUT` | `/manager/fixed-costs` | Create or update monthly fixed costs |
| `POST` | `/manager/expenses` | Add an expense |
| `GET` | `/manager/expenses/summary` | Monthly expense summary |
| `GET` | `/manager/expenses/list` | Expenses for a month |
| `GET` | `/manager/financials/members` | Per-member bill / paid / due / extra |
| `POST` | `/manager/financials/members/{member}/refund` | Refund a member's extra paid amount |

### Member

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/user/dashboard/stats` | Member dashboard totals |
| `GET` | `/user/bill/summary` | Bill summary for a month |
| `GET` | `/user/transactions` | Transaction history |
| `POST` | `/user/transactions` | Submit a deposit request |
| `GET` | `/user/meals` | Meals for a month |
| `POST` | `/user/meals` | Add a single meal entry |
| `POST` | `/user/meals/bulk` | Add meal entries over a date range |
| `DELETE` | `/user/meals` | Delete a future meal entry |

Month-based endpoints accept a `monthKey` (or `month_key`) in `YYYY-MM` format and default to the
current month.

---

## Data Model

| Model | Purpose | Key fields |
| --- | --- | --- |
| `User` | Auth and role data | `name`, `email`, `phone`, `password`, `role`, `mess_id`, `must_change_password`, `is_active` |
| `Mess` | A shared mess group | `name`, `manager_user_id`, `mess_request_id`, `is_active` |
| `MessRequest` | Public mess creation request | `mess_name`, `manager_name`, `manager_email`, `password`, `status`, `approved_mess_id`, `approved_by`, `approved_at`, `rejected_at` |
| `Meal` | One meal record | `mess_id`, `user_id`, `meal_date`, `meal_type`, `quantity`, `created_by` |
| `Expense` | Mess-level expense | `mess_id`, `title`, `amount`, `expense_date`, `description`, `created_by` |
| `FixedCost` | Monthly recurring cost | `mess_id`, `month_key`, `rent`, `khala`, `utilities`, `wifi`, `created_by`, `updated_by` |
| `UserTransaction` | Member ledger entry | `mess_id`, `user_id`, `transaction_date`, `type`, `amount`, `balance`, `created_by` |
| `UserDepositRequest` | Deposit awaiting approval | `mess_id`, `user_id`, `transaction_date`, `type`, `amount`, `status`, `requested_by`, `approved_by`, `approved_transaction_id`, `approved_at` |

Roles are constants on the `User` model: `ROLE_SUPER_ADMIN` (`superAdmin`), `ROLE_MANAGER`
(`manager`), `ROLE_USER` (`user`). Passwords use Laravel's `hashed` cast, so plain values assigned to
`password` are hashed automatically.

`UserTransaction` records cover member deposits, approved deposit requests, meal expense payments,
fixed expense payments, and refunds — so the full money trail stays auditable.

---

## Billing and Calculation Rules

All figures are computed on the backend for a given `monthKey`.

**Meal rate**

```
costPerMeal = totalMonthlyExpenses / totalMealsOfAllMembers      (0 when no meals exist)
```

**Fixed costs** — split equally across members:

```
fixedTotal         = rent + khala + utilities + wifi
fixedCostPerPerson = fixedTotal / memberCount
```

**Per-member bill**

```
mealSubtotal = memberMeals * costPerMeal
totalBill    = mealSubtotal + fixedCostPerPerson
paid         = sum of the member's approved transactions in that month
due          = max(0, totalBill - paid)
extra        = paid - totalBill
```

**Settlement status**

| Condition | Status |
| --- | --- |
| `extra > 0` | Pending Refund |
| `extra < 0` | Due |
| `extra = 0` | Settled |

**Balance** — derived from transaction history; the latest transaction's `balance` is the current
balance. Deposits increase it; refunds are written as negative transactions and reduce it.

**Refund allocation** — when the manager refunds an overpaid member:

- the member must have a positive `extra` for the selected month
- the refund cannot exceed that `extra`
- it is applied against the **meal** extra first, then against the **fixed** extra
- separate negative transactions are written for the meal and fixed portions, so the two deposit
  pools stay individually correct instead of being lumped together

---

## Business Rules

**Meal entry**

- Meal types: `Lunch`, `Dinner`, `Off`
- `Lunch` and `Dinner` require a quantity of at least 1; `Off` is stored with quantity `0`
- A single entry accepts any valid date
- Bulk entry: the range must start tomorrow or later, the start date must not be after the end date,
  the range cannot exceed 90 days, and duplicates can be skipped or overwritten
- Only future `Lunch` / `Dinner` entries can be deleted, and only by the owning member

**Deposits**

- A member submits an amount plus an optional date and type; the request starts as `pending`
- Only the mess's own manager can approve it, and only while it is still `pending`
- Approval creates a `UserTransaction`, recalculates the running balance, and stores the transaction
  id on the request

**Accounts**

- New manager and member accounts are flagged `must_change_password`
- Deactivating a mess deactivates its manager, and deactivating a manager deactivates their mess
- Inactive users and users of an inactive mess are blocked by the `active.account` middleware

---

## Diagrams

UML and design artefacts live in [`Diagram/`](Diagram/).

**Activity diagrams** — [`Diagram/Activity/`](Diagram/Activity/)

| File | Flow |
| --- | --- |
| `activity_meal_entry 1.jpg` | Member meal entry — single day and date range, with override |
| `activity_payment_processing 1.jpg` | Member deposit against meal cost and fixed cost |
| `activity_mess_registration_approval.svg` | Mess request, validation, super admin approve / reject |
| `activity_deposit_approval.svg` | Deposit request, manager guards, transaction, balance update |
| `activity_monthly_billing.svg` | Month selection, meal rate, per-member bill, settlement status |

**Other diagrams** — `Diagram/`

- `use_case_diagram.svg`, `class_diagram.svg`, `sequence_diagram.svg`
- `entity_relationship_picture_style.svg`
- `dfd_level_0_context.svg`, `dfd_level_1_main.svg`, `dfd_level_2_*.svg`
- `Swimlane/` — auth, mess creation, member management, meal tracking, deposit approval, expense reports
- `CRC/` — CRC cards for the 12 core classes

---

## Documentation

| File | Contents |
| --- | --- |
| [`PROJECT_DETAILS.md`](PROJECT_DETAILS.md) | Full feature-by-feature specification |
| [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md) | Condensed overview |
| [`docs/REPORT_STRUCTURE.md`](docs/REPORT_STRUCTURE.md) | Chapter-by-chapter outline for the practicum report |
| `docs/Practicum_Report_Hasan_Imam.pdf` | Practicum report |
| `docs/MessManager_Presentation_Hasan_Imam.pptx` | Project presentation |

---

## Development Notes

- The backend is authoritative for every calculation and approval; the frontend never derives money
  values on its own.
- Month-based features consistently use `YYYY-MM` as the month key.
- API endpoints are grouped by role prefix: `admin`, `manager`, `user`.
- Multi-step writes (mess approval, deposit approval, refunds, status toggles) run inside database
  transactions.
- Several endpoints accept both camelCase and snake_case field names for compatibility.
- The auth token is kept in Redux and mirrored to `localStorage`; RTK Query attaches it as a bearer
  header on every request.
- `frontend/.env` is currently committed for local convenience — move it to `.gitignore` and use
  per-environment values before deploying.
