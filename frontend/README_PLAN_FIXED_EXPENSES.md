# MessManager — Fixed Expenses (Monthly) Execution Plan (Agent TODO)

This file is a sequenced implementation checklist for adding monthly fixed expenses (House Rent / Khala / Utilities combined / WiFi) into the existing meal + deposit flow.
Scope: frontend-only first (localStorage + mock backend), minimal structural change.

---

## Goal

- Manager can add/edit fixed expenses **once per month** (4 fields).
- Expenses are calculated **per category** and then combined into totals.
- User bill = meal subtotal + per-member fixed share.
- User can deposit money and due amount decreases.

---

## Current Decisions

- Fixed expenses are **mess-level** (shared), not user-level.
- Entry frequency: monthly (per month overwrite/update).
- Split rule: **equal per member**.
- Utilities = Gas + Electricity + Water combined into a single monthly amount.
- Frontend-only using `mockBackend.js` + `localStorage`.
- Deposit UI already exists in `Balance` page.

---

## Phase 1: Data Model (localStorage) + Helpers

### 1.1 Add a storage key for fixed expenses

- [ ] In `mockBackend.js`, add a new `STORAGE_KEYS` entry (example name: `MESS_MONTHLY_FIXED_COSTS`).
- [ ] Decide the localStorage value shape:
  - `messId -> monthKey(YYYY-MM) -> { rent, khala, utilities, wifi, updatedAt }`
- [ ] Default: missing month data returns zeros.

### 1.2 Add month helpers

- [ ] Add `getCurrentMonthKey()` → returns `YYYY-MM`.
- [ ] Add `normalizeMonthKey(value)` → trims, validates, falls back to current month.

Definition of done (Phase 1)

- Data can be stored and retrieved by messId + monthKey.

---

## Phase 2: Mock Backend APIs (CRUD) + Validation

### 2.1 Read API

- [ ] Implement `getFixedCostsByMess({ messId, monthKey })`.
  - Returns `{ rent: 0, khala: 0, utilities: 0, wifi: 0 }` when not found.

### 2.2 Write API (manager-only)

- [ ] Implement `upsertFixedCostsByManager({ managerUserId, monthKey, rent, khala, utilities, wifi })`.
  - Resolve manager → `messId`
  - Validate: amounts are numbers and `>= 0`
  - Write to `messId + monthKey` (overwrite/update)

Definition of done (Phase 2)

- Manager can save monthly fixed expenses and read them back.

---

## Phase 3: Calculations (Per Category + Totals) + User Billing

### 3.1 Member count

- [ ] Implement `getMemberCountByMessId(messId)` using members stored in localStorage.

### 3.2 Fixed expense totals

- [ ] Implement `getFixedTotals({ messId, monthKey })`:
  - `fixedBreakdown = { rent, khala, utilities, wifi }`
  - `fixedTotal = rent + khala + utilities + wifi`

### 3.3 Per-member share (per category + total)

- [ ] Implement `getFixedSharePerMember({ messId, monthKey })`:
  - `memberCount`
  - `shareBreakdown = { rentShare, khalaShare, utilitiesShare, wifiShare }`
  - `fixedShareTotal = fixedTotal / memberCount`
  - If `memberCount === 0`, all shares are 0

### 3.4 User monthly bill details (deposit-aware)

- [ ] Implement `getUserMonthlyBillDetails({ userId, monthKey })`:
  - `totalMeals` (recommended: filter meal entries by `date.startsWith(monthKey)`)
  - `costPerMeal` (keep existing mock rate initially)
  - `mealSubtotal = totalMeals * costPerMeal`
  - `fixedShareTotal` (+ `shareBreakdown`)
  - `totalBill = mealSubtotal + fixedShareTotal`
  - `paidAmount` (sum of deposits; recommended month filter)
  - `dueAmount = max(totalBill - paidAmount, 0)`

### 3.5 Hook existing UI to the new bill logic

- [ ] Refactor `getUserDashboardStats(userId)` to use current-month `getUserMonthlyBillDetails`.
  - Keep `currentBalance` based on transaction balance as-is.

Definition of done (Phase 3)

- User bill totals and due amount are computed consistently.

---

## Phase 4: Manager UI — Monthly Fixed Expense Entry

### 4.1 Reuse Add Expense page as monthly fixed editor

- [ ] Update `AddExpense.jsx`:
  - Month selector (input type="month")
  - Inputs: House Rent, Khala Bill, Utilities (combined), WiFi Bill
  - Load existing values for selected month (read API)
  - Save calls `upsertFixedCostsByManager`
  - Show category-wise amounts + `fixedTotal`

Definition of done (Phase 4)

- Manager can set/edit monthly fixed expenses from the UI.

---

## Phase 5: Manager UI — Monthly Report (Dynamic)

### 5.1 Provide manager report stats in mock backend

- [ ] Implement `getMessMonthlyReportStatsByManager({ managerUserId, monthKey })` in `mockBackend.js`:
  - `memberCount`
  - `fixedBreakdown`, `fixedTotal`
  - `totalMealsAllMembers` (sum across members; month filtered recommended)
  - `mealCostTotal = totalMealsAllMembers * costPerMeal` (initially)
  - `totalExpenses = mealCostTotal + fixedTotal`
  - `breakdownRows` for table (Meal cost, Rent, Khala, Utilities, WiFi)

### 5.2 Update Monthly Report page

- [ ] Update `MonthlyReport.jsx`:
  - Replace hardcoded numbers with `getMessMonthlyReportStatsByManager`
  - Display per-category rows + percentages based on `totalExpenses`

Definition of done (Phase 5)

- Monthly Report shows correct fixed breakdown + totals.

---

## Phase 6: User UI — Bill Breakdown + Deposit Effect

### 6.1 Show fixed share details in My Bill

- [ ] Update `MyBill.jsx`:
  - Add lines for:
    - Meal subtotal
    - Fixed share total
    - (Optional but recommended) Rent share / Khala share / Utilities share / WiFi share
  - Ensure Total Bill / Paid Amount / Remaining Due are consistent

### 6.2 Verify deposits reduce due

- [ ] Verify `Balance.jsx` deposit flow updates `paidAmount` and reduces `dueAmount`.

Definition of done (Phase 6)

- User can see separate bill components; deposit reduces remaining amount.

---

## Optional Phase 7: Sync hardcoded dashboard cards

- [ ] Update manager dashboard cards to remove hardcoded totals (optional, to avoid mismatch).

---

## Verification

### Commands

- [ ] `cd frontend && npm run lint`
- [ ] `cd frontend && npm run build`

### Manual checks

- [ ] Manager sets current month fixed expenses → Monthly Report breakdown matches values
- [ ] User adds meals → My Bill meal subtotal increases correctly
- [ ] User adds deposit → Remaining due decreases

---

## Out of Scope (for now)

- Bazaar expense entry persistence and true meal-rate derivation from bazar total.
- Backend APIs (RTK Query) for fixed expenses (future).

---

## Suggested Agent Prompt Template

"Implement Phases 1–6 from this plan only. Keep changes minimal. Do not refactor unrelated files. After changes, run `npm run lint` and `npm run build`, then report files changed + what remains."
