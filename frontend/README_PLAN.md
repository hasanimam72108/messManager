# MessManager Frontend Execution Plan (Agent TODO)

This file is a sequenced implementation checklist for future agent handoff.
Scope: frontend-only first (backend later), minimal structural change.

## Goal

Build in this order:

1. SuperAdmin foundation
2. Manager mess request flow
3. Login flow (email + password only)
4. Manager adds users
5. Route guards, redirects, and polish

---

## Current Decisions

- Frontend-only for now (use localStorage/mock state where needed).
- Login has no role selector.
- Register page is for manager mess request.
- Register submit button text must be: `Create Mess`.
- SuperAdmin is the first implementation priority.

---

## Phase 1: SuperAdmin First (Highest Priority)

### 1.1 Add SuperAdmin route area

- Update `src/routes/Routers.jsx`:
  - Add `/super-admin/*` route group.
  - Nest routes:
    - `/super-admin/dashboard`
    - `/super-admin/mess-group`
    - `/super-admin/manager`
    - `/super-admin/system-report`

### 1.2 Add SuperAdmin layout with outlet

- Create `src/layouts/SuperAdminLayout.jsx`.
- It should follow existing dashboard layout patterns (`Outlet`, sidebar, responsive shell).

### 1.3 Add SuperAdmin sidebar/nav

- Create `src/pages/SuperAdmin/Sidebar/Sidebar.jsx`.
- Menu items:
  - Dashboard
  - Mess Group
  - Manager
  - System Report
  - Logout

### 1.4 Add SuperAdmin pages

Create:

- `src/pages/SuperAdmin/Dashboard/Dashboard.jsx`
- `src/pages/SuperAdmin/MessGroup/MessGroup.jsx`
- `src/pages/SuperAdmin/Manager/Manager.jsx`
- `src/pages/SuperAdmin/SystemReport/SystemReport.jsx`

### 1.5 SuperAdmin login redirect

- In login flow, when role is `superAdmin`, redirect to `/super-admin/dashboard`.

Definition of done (Phase 1):

- SuperAdmin can log in and land on dashboard.
- SuperAdmin can navigate all 4 outlets from sidebar.

---

## Phase 2: Register = Manager Mess Request

### 2.1 Update Register form purpose

- Edit `src/pages/Registration/Register.jsx`.
- Replace generic registration fields with manager mess request fields:
  - Mess Name
  - Manager Email
  - (Optional) Manager Name

### 2.2 Update submit CTA text

- Submit button label must be exactly: `Create Mess`.

### 2.3 Request queue behavior

- On submit, store request in local mock state/localStorage as `pending`.
- Show success message: request sent to SuperAdmin.

Definition of done (Phase 2):

- Register page creates a pending mess request.

---

## Phase 3: Login Flow (No Role Selector)

### 3.1 Remove role input from UI

- Edit `src/pages/Login/Login.jsx`.
- Keep only:
  - Email
  - Password

### 3.2 Route by resolved user role

After successful login:

- `superAdmin` -> `/super-admin/dashboard`
- `manager` -> `/manager/dashboard`
- `user` -> `/user/dashboard`

### 3.3 Keep auth state consistent

- Use `src/features/auth/authSlice.js` actions/state.
- Preserve localStorage persistence behavior.

Definition of done (Phase 3):

- Email/password login works without role selection and redirects correctly.

---

## Phase 4: Manager Post-Approval Flow

### 4.1 SuperAdmin approves manager request

- In SuperAdmin area (Dashboard or MessGroup), show pending requests.
- Add approve action.
- On approve: manager can now log in.

### 4.2 Manager adds users

- Update `src/pages/Manager/Dashboard/Members.jsx`.
- Manager can add users by:
  - Name
  - Email

### 4.3 User first login setup

- User logs in with initial credential (mock flow).
- User can see own details in `src/pages/User/Dashboard/Dashboard.jsx`.

Definition of done (Phase 4):

- Approved manager can log in and add users.
- Added user can log in and view own details.

---

## Phase 5: Guards, Redirects, Stability

### 5.1 Protect route areas

- Update `src/routes/RoleProtected.jsx`:
  - SuperAdmin-only routes
  - Manager-only routes
  - User-only routes

### 5.2 Normalize login route path

- Ensure route path is consistently `/login` everywhere.

### 5.3 Fix fallback navigation

- Update redirect targets in:
  - `src/pages/Unauthorized.jsx`
  - `src/pages/NotFound.jsx`
- Use role-based dashboard redirects, not generic `/dashboard`.

Definition of done (Phase 5):

- Unauthorized access is blocked correctly.
- Navigation fallbacks are role-aware and stable.

---

## Optional Phase 6: UI Polish

- Improve home page visual consistency:
  - `src/components/Home/Hero.jsx`
  - `src/components/Home/Navbar.jsx`
  - `src/components/Home/About.jsx`
  - `src/components/Home/Footer.jsx`
- Keep color language consistent and attractive.

---

## Suggested Agent Prompt Template

Use this when delegating to another agent:

"Implement Phase X from `README_PLAN.md` only. Keep changes minimal. Do not refactor unrelated files. After changes, run diagnostics and report files changed + what remains."

---

## Quick Execution Order

1. Phase 1
2. Phase 2
3. Phase 3
4. Phase 4
5. Phase 5
6. Phase 6 (optional)
