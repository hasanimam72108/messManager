# MessManager Project Details

## Overview

MessManager is a full-stack mess management system for tracking meals, expenses, deposits, fixed monthly costs, member balances, and monthly settlements inside a shared mess. The app is centered around three roles: `superAdmin`, `manager`, and `user`.

The codebase is split into two main parts:

- `backend/` - a Laravel API that handles authentication, mess approval, member management, meal tracking, expenses, deposits, balance calculations, refunds, and reporting
- `frontend/` - a React + Vite single-page app that provides public pages and role-based dashboards

## Roles

### Super Admin

The super admin controls the overall system. This role reviews mess creation requests, approves or rejects them, and can activate or deactivate messes and manager accounts.

### Manager

The manager owns a mess after approval. This role manages members, records expenses, sets monthly fixed costs, reviews deposits, inspects member financials, and now records refunds for extra paid amounts.

### User / Member

The user is a mess member. Members log meals, view bills, see transaction history, request deposits, and monitor their monthly balance and dues.

## Core Workflow

### 1. Manager submits a mess creation request

A public registration form lets a manager submit a new mess request. The request includes:

- mess name
- manager name
- manager email
- password
- confirm password

This creates a pending `MessRequest` record in the backend.

### 2. Super admin approves or rejects the request

The super admin reviews pending mess requests. On approval:

- a `Mess` record is created
- a manager `User` account is created for the mess
- the mess request is marked approved
- the manager receives the created credentials

On rejection, the request is marked rejected and no mess is created.

### 3. First-login password setup

Newly created accounts can be forced to set a new password on first login.

- if `must_change_password` is enabled, the user must set a new password
- the password setup endpoint accepts both camelCase and snake_case field names
- after a successful setup, the flag is cleared

### 4. Manager adds members

After login, the manager can create members by entering name and email.

- a temporary password is generated automatically
- the account is created with role `user`
- the member is flagged for first-login password setup

### 5. Members log meals

Members can add meal entries individually or in bulk.

- meal types: `Lunch`, `Dinner`, `Off`
- meal quantity is stored per date
- bulk meal entry supports date ranges and optional overwrite

### 6. Manager handles mess money

Managers can:

- add expenses
- define monthly fixed costs
- approve deposit requests
- view member financial summaries
- view monthly dashboard totals
- view daily meal breakdowns
- record manual refunds for overpaid members

### 7. Members request deposits

Members submit deposit requests. The manager approves them, which creates a transaction and updates the member balance.

## Backend Features

### Authentication

The backend uses Laravel Sanctum token authentication.

Available auth actions:

- register a mess request
- login
- logout
- view profile
- complete first-login password setup

### Access control

The backend applies role and account-status checks.

- super admin routes require the super admin role
- manager routes require the manager role
- user routes require the user role
- inactive accounts and inactive messes are blocked where relevant

### Mess request management

The super admin can:

- list mess requests
- filter requests by status
- approve a request
- reject a request
- view managers
- view mess groups with member counts
- generate a system report
- activate or deactivate messes
- activate or deactivate managers

### Manager operations

The manager can:

- fetch the assigned mess
- rename the mess
- delete the mess
- list members in the mess
- add a member
- edit a member
- delete a member
- review pending deposit requests
- approve a deposit request
- view dashboard stats
- view daily meals summary
- manage monthly fixed costs
- add expenses
- view monthly expense summaries
- list expenses for a month
- view member financial breakdowns
- record refunds for members with extra paid amounts

### Member operations

Members can:

- view their monthly meal list
- add a meal entry
- add meal entries in bulk
- delete future meal entries
- view dashboard stats
- view bill summary
- view transaction history
- request a deposit

## Backend API Routes

### Public routes

- `POST /api/register` - submit a mess creation request
- `POST /api/login` - login and receive a Sanctum token

### Authenticated routes

- `POST /api/logout` - revoke the current token
- `GET /api/user` - current user profile
- `GET /api/profile` - current user profile
- `POST /api/password/first-login` - complete first-login password setup

### Super admin routes

- `GET /api/admin/mess-requests`
- `POST /api/admin/mess-requests/{messRequest}/approve`
- `POST /api/admin/mess-requests/{messRequest}/reject`
- `GET /api/admin/managers`
- `GET /api/admin/system-report`
- `GET /api/admin/messes-with-details`
- `PATCH /api/admin/messes/{mess}/toggle-status`
- `PATCH /api/admin/managers/{manager}/toggle-status`

### Manager routes

- `GET /api/manager/mess`
- `PUT /api/manager/mess`
- `DELETE /api/manager/mess`
- `GET /api/manager/members`
- `POST /api/manager/members`
- `PUT /api/manager/members/{member}`
- `DELETE /api/manager/members/{member}`
- `GET /api/manager/deposit-requests`
- `POST /api/manager/deposit-requests/{depositRequest}/approve`
- `GET /api/manager/dashboard/stats`
- `GET /api/manager/meals/daily`
- `GET /api/manager/fixed-costs`
- `PUT /api/manager/fixed-costs`
- `GET /api/manager/expenses/summary`
- `GET /api/manager/expenses/list`
- `GET /api/manager/financials/members`
- `POST /api/manager/financials/members/{member}/refund`
- `POST /api/manager/expenses`

### User routes

- `GET /api/user/dashboard/stats`
- `GET /api/user/bill/summary`
- `GET /api/user/transactions`
- `POST /api/user/transactions`
- `GET /api/user/meals`
- `POST /api/user/meals`
- `POST /api/user/meals/bulk`
- `DELETE /api/user/meals`

## Frontend Structure

The React app is a role-based SPA built with React Router, Redux Toolkit, and RTK Query.

### Global app behavior

- the app is wrapped in Redux `Provider`
- routing is handled by `BrowserRouter`
- API requests use RTK Query
- the auth token is stored in `localStorage`
- the token is sent as `Authorization: Bearer <token>` on API calls
- toast notifications are shown with `react-hot-toast`

### Route protection

Protected routes are handled by a role guard.

- unauthenticated users are redirected to `/login`
- users without the required role are redirected to `/unauthorized`
- each role is routed to its own dashboard home path after login

### Public frontend pages

- `/` - home page or role redirect when logged in
- `/home` - public landing page
- `/login` - login form
- `/register` - mess creation request form
- `/unauthorized` - access denied page
- `/404` - not found page

### Super admin frontend pages

- `/super-admin/dashboard` - overview of requests, messes, and system stats
- `/super-admin/mess-group` - mess groups listing/details
- `/super-admin/manager` - manager details page

### Manager frontend pages

- `/manager/dashboard` - manager overview dashboard
- `/manager/members` - member management
- `/manager/members-financials` - member-level financial report and refund settlement
- `/manager/add-expense` - create expense entry
- `/manager/expense-list` - list expenses for a month
- `/manager/meals-chart` - daily meal chart and breakdown
- `/manager/monthly-report` - monthly financial report
- `/manager/mess-settings` - mess settings and maintenance

### User frontend pages

- `/user/dashboard` - member dashboard and quick summary
- `/user/meal-entry` - meal entry screen
- `/user/meal-chart` - meal chart and history
- `/user/my-bill` - bill summary and dues
- `/user/balance` - balance and transaction view

## Frontend Authentication Flow

### Login

- the user enters email and password
- the frontend calls the login API
- the returned token and user object are stored in Redux and `localStorage`
- the user is redirected to the correct dashboard based on role

### Registration request

- the manager fills the public registration form
- the form sends a mess request to the backend
- the frontend shows success or validation errors

### Route redirection

After login, the app redirects to:

- `superAdmin` -> `/super-admin/dashboard`
- `manager` -> `/manager/dashboard`
- `user` -> `/user/dashboard`

## Data Model Overview

### User

Stores authentication and role data.

Important fields and behavior:

- name
- email
- phone
- password
- role
- mess relation
- `must_change_password`
- active/inactive status

A user can belong to a mess, manage a mess, have meals, and have transactions.

### Mess

Represents a shared mess group.

Important relations:

- manager user
- original mess request
- many member users
- many meal entries

### MessRequest

Stores the public mess creation request.

Important fields:

- mess name
- manager name
- manager email
- password hash
- status
- approved mess reference
- approving user reference
- approved/rejected timestamps

### Meal

Stores meal records.

Important fields:

- mess id
- user id
- meal date
- meal type
- quantity
- created by

### Expense

Stores mess-level expenses.

Important fields:

- mess id
- created by
- title
- amount
- expense date
- description

### FixedCost

Stores monthly recurring costs.

Important fields:

- mess id
- month key in `YYYY-MM`
- rent
- khala
- utilities
- wifi
- created by
- updated by

### UserTransaction

Stores member financial transactions.

Important fields:

- mess id
- user id
- transaction date
- type
- amount
- balance
- created by

These records now cover:

- member deposits
- approved deposit requests
- meal expense transactions
- fixed expense transactions
- refund transactions recorded by the manager

### UserDepositRequest

Stores pending deposit requests before approval.

Important fields:

- mess id
- user id
- transaction date
- type
- amount
- status
- requested by
- approved by
- approved transaction reference
- approved timestamp

## Billing And Calculation Rules

### Monthly meal rate

The system calculates the meal rate from monthly meal-related expense pools and total meal counts.

- meal expense pool is summed for the month
- total meal quantity is summed for the month
- `costPerMeal = mealExpensePool / totalMealsAllMembers` when meals exist

### Fixed costs

Fixed monthly costs are split equally among members.

- rent
- khala
- utilities
- wifi

### Member bill

For each member in a month:

- `mealSubtotal = totalMeals * costPerMeal`
- `fixedShareTotal = fixedTotal / memberCount`
- `totalBill = mealSubtotal + fixedShareTotal`
- `paidAmount` comes from approved transactions in the selected month
- `dueAmount` is the remaining amount after paid values are applied

### Member balance

Balances are based on transaction history.

- the latest transaction balance is used as current balance
- deposits and other approved transaction types update the balance
- refunds are recorded as negative transactions and reduce the running balance

### Refund settlement logic

When the manager records a refund for a member with extra paid amount:

- the member must have a positive extra paid amount for the selected month
- the refund amount cannot exceed that extra amount
- the refund is applied first against meal extra, then against fixed extra
- the backend creates separate negative transactions for meal and fixed portions
- the settlement response returns updated paid totals and status

This ensures meal and fixed deposits are reduced separately instead of treating the refund as a single undifferentiated transaction.

## Meal Entry Rules

### Single meal entry

- future dates only are allowed for normal meal entry handling
- lunch and dinner entries require quantity of at least 1
- `Off` entries are stored with quantity `0`

### Bulk meal entry

- date range must be valid
- start date must not be after end date
- only future dates can be added
- range cannot exceed 90 days
- duplicate entries can be skipped or overwritten

### Meal deletion

- only future lunch/dinner entries can be deleted
- deletions are restricted to the current user and mess

## Deposit And Approval Rules

### Member deposit request

Members submit a request with:

- amount
- optional date
- optional type

The request starts as `pending`.

### Manager approval

When the manager approves a pending request:

- a `UserTransaction` record is created
- the running balance is recalculated
- the deposit request becomes `approved`
- the approved transaction id is stored on the request

## Financial Summary Screens

### Manager member financials screen

The member financials page shows:

- meal breakdown per member
- fixed breakdown per member
- combined settlement summary
- extra paid status
- refund action for members with positive extra

The refund modal on this page now mirrors the user payment modal style:

- three gateway tiles for Hand Cash, Mobile Banking, and Card / Bank
- mobile banking provider tiles for Bkash, Nagad, and Rocket
- phone number input with mobile-number validation styling
- PIN field hidden until mobile banking is selected
- card fields shown only when card settlement is selected

### User balance screen

The user balance page shows:

- total deposit for the month
- separate meal expense and fixed expense deposit flows
- payment gateway selection
- transaction history

The payment gateway UI uses the same logo assets from `frontend/public`.

## UI Components And Layouts

The frontend is organized by role and screen type.

- public landing components live under `components/Home`
- shared interface parts live under `components`
- role layouts live under `layouts`
- route protection lives under `routes`
- feature state lives under `features`
- reusable helpers live under `utils`

## Implementation Notes

- The frontend uses React Router for page navigation.
- The backend is the source of truth for calculations and approvals.
- Month-based features consistently use `YYYY-MM` as the month key.
- The app uses API endpoint prefixes grouped by role: `admin`, `manager`, and `user`.
- Refunds and deposit actions are recorded through `UserTransaction` so the history remains auditable.
- Current refund and payment flows rely on the same asset set in `frontend/public` for consistent UI.

## Recent Updates

The latest project updates added or adjusted the following behavior:

- manager refund settlement for overpaid members
- refund allocation split between meal and fixed portions
- refund gateway UI aligned with the user payment modal
- mobile banking input validation for phone numbers starting with `01` and 11 digits long
- PIN fields kept empty by default and protected from browser autofill
- zero balances rendered as `0.00` instead of `-0.00`
- zero extra statuses shown as `Settled` instead of `Due`

## Project Summary

MessManager is a role-based production-style mess accounting system with approval workflows, meal accounting, deposits, expense tracking, fixed cost distribution, refund settlement, and month-based financial reporting. The backend handles all authoritative calculations, while the frontend focuses on role-specific user experiences and dashboard workflows.
