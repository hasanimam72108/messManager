# MessManager — Project Overview

MessManager is a full‑stack web application for managing a shared **mess** (meal system) for a group of people. It tracks daily meals, bazaar/other expenses, monthly fixed costs, and member deposits, then calculates monthly summaries and per‑member bills.

## What problem it solves

In a mess, people usually need to answer:

- Who ate how many meals this month?
- How much money was spent on bazaar vs other costs?
- What is the **current meal rate** (cost per meal)?
- How much does each member owe after deposits?

MessManager centralizes those records and provides dashboards for admins/managers and members.

## Core features

- **Mess creation request + approval workflow**
  - A manager requests a new mess.
  - A super admin approves/rejects the request.

- **Role-based dashboards**
  - Super admin: pending mess requests, managers, system report, list of mess groups.
  - Manager: members management, monthly dashboard stats, expenses, fixed costs, pending deposit approvals.
  - User/member: meal entry, bill summary, transactions, deposit requests.

- **Meal tracking** (per user, per day)
  - Meal types: `Lunch`, `Dinner`, `Off`.
  - Quantity is stored (and for `Off`, quantity is stored as `0`).

- **Expenses** (mess-level)
  - Manager can add any expense entries.
  - Expense title `Bazaar` (case-insensitive) is treated as meal/bazaar expense for meal-rate calculation.

- **Monthly fixed costs** (mess-level, per month)
  - Stored per month key `YYYY-MM`:
    - Rent
    - Khala
    - Utilities
    - WiFi
  - Split equally across members.

- **Deposits with approval**
  - Users submit deposit requests.
  - Manager approves them.
  - Approval creates a transaction and updates the running balance.

## Tech stack

### Backend

- **Laravel 10** (PHP 8.1+)
- **Laravel Sanctum** for token-based auth
- **MySQL** (default Laravel DB connection)

The backend is a REST API under `/api` (see `backend/routes/api.php`).

### Frontend

- **React 19** + **Vite**
- **Redux Toolkit + RTK Query** (API calls + caching)
- **React Router**
- **Tailwind CSS**

The frontend stores the auth token in localStorage and sends it as `Authorization: Bearer <token>`.

## Repo layout

- `backend/` — Laravel API (controllers, models, migrations, seeders)
- `frontend/` — React SPA (routes, layouts, pages, RTK Query slices)
- `Diagram/` — diagrams/notes
- `docs/` — documentation (this file)

## Roles & permissions

The system uses three roles:

- `superAdmin`
  - Approves/rejects mess creation requests
  - Views managers/mess groups/system report

- `manager`
  - Owns/manages one mess group
  - Adds/edits/deletes members
  - Adds expenses and monthly fixed costs
  - Approves member deposit requests

- `user` (member)
  - Adds meals
  - Views bill summary + transactions
  - Requests deposits (needs manager approval)

## How the main flows work

### 1) Manager requests a mess (public)

- `POST /api/register`
  - Body: `messName`, `managerEmail`, optional `managerName`
  - Creates a **pending** `MessRequest`

### 2) Super admin approves the request

- `POST /api/admin/mess-requests/{id}/approve`
  - Creates the `Mess`
  - Creates the manager `User`
  - Returns a **temporary password** for the manager

### 3) First login password setup

Newly created accounts can be flagged with `mustChangePassword`.

- `POST /api/password/first-login`
  - Auth required
  - Sets a new password and clears `mustChangePassword`

### 4) Manager adds members

- `POST /api/manager/members`
  - Creates `user` accounts with a temporary password
  - Members also complete first-login password setup

### 5) Members add meals

- `GET /api/user/meals?monthKey=YYYY-MM`
- `POST /api/user/meals`

### 6) Deposits

- Member requests deposit:
  - `POST /api/user/transactions` → creates a pending deposit request
- Manager approves:
  - `POST /api/manager/deposit-requests/{id}/approve` → creates a transaction and updates balance

## Billing & calculation rules (monthly)

For a given month key `YYYY-MM`:

### Meal rate (dynamic, bazaar-based)

- Bazaar expenses are expenses where title is `Bazaar` (case-insensitive).
- Let:
  - `bazaarTotal` = sum of bazaar expenses in the month
  - `totalMealsAllMembers` = total meal quantity across all members in the month

Then:

- $\text{costPerMeal} = \frac{\text{bazaarTotal}}{\text{totalMealsAllMembers}}$ (if total meals > 0)

### User bill

- `mealSubtotal = userTotalMeals × costPerMeal`
- `fixedShareTotal = fixedTotal / memberCount` (equal split)
- `totalBill = mealSubtotal + fixedShareTotal`

Paid and due are computed from approved transactions inside the selected month.

## Quick local setup

### Backend (Laravel)

From `backend/`:

1. `composer install`
2. Copy `.env.example` → `.env`
3. Generate app key: `php artisan key:generate`
4. Configure DB in `.env`
5. Run migrations + seeds: `php artisan migrate --seed`
6. Start server: `php artisan serve`

Seeder note (local/dev): `backend/database/seeders/DatabaseSeeder.php` creates a default super admin:

- Email: `superadmin@mess.com`
- Password: `admin123`

(You can override via env vars `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`.)

### Frontend (React)

From `frontend/`:

1. `npm install`
2. `npm run dev`

Optional env:

- `VITE_REACT_APP_BACKEND_URL` (defaults to `http://127.0.0.1:8000`)

## Notes for new contributors

- Backend endpoints are grouped by role in `backend/routes/api.php`.
- The frontend API layer is in `frontend/src/features/api/apiSlice.js` and feature endpoints are injected via RTK Query.
- Some UI behavior is described in `frontend/README_PLAN.md` (execution plan / handoff checklist).
