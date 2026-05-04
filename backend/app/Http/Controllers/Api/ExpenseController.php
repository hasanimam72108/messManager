<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\FixedCost;
use App\Models\Meal;
use App\Models\User;
use App\Models\UserTransaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ExpenseController extends Controller
{
    private const COST_PER_MEAL = 72.22;

    public function fixedCosts(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);

        $user = $request->user();

        if (! $user->mess_id) {
            throw ValidationException::withMessages([
                'mess' => 'Manager mess not found.',
            ]);
        }

        $data = $request->validate([
            'monthKey' => ['nullable', 'string'],
            'month_key' => ['nullable', 'string'],
        ]);

        $monthKey = $this->normalizeMonthKey(
            $data['monthKey'] ?? $data['month_key'] ?? now()->format('Y-m')
        );

        $fixedCost = FixedCost::query()
            ->where('mess_id', $user->mess_id)
            ->where('month_key', $monthKey)
            ->first();

        return response()->json([
            'data' => $this->formatFixedCost($fixedCost, $monthKey),
        ]);
    }

    public function upsertFixedCosts(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);

        $user = $request->user();

        if (! $user->mess_id) {
            throw ValidationException::withMessages([
                'mess' => 'Manager mess not found.',
            ]);
        }

        $data = $request->validate([
            'monthKey' => ['required', 'string'],
            'month_key' => ['nullable', 'string'],
            'rent' => ['required', 'numeric', 'min:0'],
            'khala' => ['required', 'numeric', 'min:0'],
            'utilities' => ['required', 'numeric', 'min:0'],
            'wifi' => ['required', 'numeric', 'min:0'],
        ]);

        $monthKey = $this->normalizeMonthKey($data['monthKey'] ?? $data['month_key']);

        $fixedCost = FixedCost::query()->firstOrNew([
            'mess_id' => $user->mess_id,
            'month_key' => $monthKey,
        ]);

        if (! $fixedCost->exists) {
            $fixedCost->created_by = $user->id;
        }

        $fixedCost->forceFill([
            'rent' => $data['rent'],
            'khala' => $data['khala'],
            'utilities' => $data['utilities'],
            'wifi' => $data['wifi'],
            'updated_by' => $user->id,
        ])->save();

        return response()->json([
            'message' => 'Monthly fixed expenses saved.',
            'data' => $this->formatFixedCost($fixedCost->fresh(), $monthKey),
        ]);
    }

    public function storeExpense(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);

        $user = $request->user();

        if (! $user->mess_id) {
            throw ValidationException::withMessages([
                'mess' => 'Manager mess not found.',
            ]);
        }

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'date' => ['required', 'date'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $expense = Expense::create([
            'mess_id' => $user->mess_id,
            'created_by' => $user->id,
            'title' => trim($data['title']),
            'amount' => $data['amount'],
            'expense_date' => $data['date'],
            'description' => trim($data['description'] ?? '') ?: null,
        ]);

        return response()->json([
            'message' => 'Expense added.',
            'data' => $this->formatExpense($expense->fresh()),
        ], 201);
    }

    public function monthlyExpenseSummary(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);

        $user = $request->user();

        if (! $user->mess_id) {
            throw ValidationException::withMessages([
                'mess' => 'Manager mess not found.',
            ]);
        }

        $data = $request->validate([
            'monthKey' => ['nullable', 'string'],
            'month_key' => ['nullable', 'string'],
        ]);

        $monthKey = $this->normalizeMonthKey(
            $data['monthKey'] ?? $data['month_key'] ?? now()->format('Y-m')
        );
        $monthStart = Carbon::createFromFormat('Y-m', $monthKey)->startOfMonth();
        $monthEnd = Carbon::createFromFormat('Y-m', $monthKey)->endOfMonth();

        $bazaarExpenses = Expense::query()
            ->where('mess_id', $user->mess_id)
            ->whereBetween('expense_date', [$monthStart, $monthEnd])
            ->whereRaw('LOWER(title) = ?', ['bazaar']);

        return response()->json([
            'data' => [
                'monthKey' => $monthKey,
                'bazaarTotal' => (float) $bazaarExpenses->sum('amount'),
                'bazaarCount' => (int) $bazaarExpenses->count(),
            ],
        ]);
    }

    public function dashboardStats(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);

        $user = $request->user();

        if (! $user->mess_id) {
            throw ValidationException::withMessages([
                'mess' => 'Manager mess not found.',
            ]);
        }

        $data = $request->validate([
            'monthKey' => ['nullable', 'string'],
            'month_key' => ['nullable', 'string'],
        ]);

        $monthKey = $this->normalizeMonthKey(
            $data['monthKey'] ?? $data['month_key'] ?? now()->format('Y-m')
        );
        $monthStart = Carbon::createFromFormat('Y-m', $monthKey)->startOfMonth();
        $monthEnd = Carbon::createFromFormat('Y-m', $monthKey)->endOfMonth();

        $memberCount = User::query()
            ->role(User::ROLE_USER)
            ->where('mess_id', $user->mess_id)
            ->count();

        $fixedCost = FixedCost::query()
            ->where('mess_id', $user->mess_id)
            ->where('month_key', $monthKey)
            ->first();

        $fixedBreakdown = [
            'rent' => (float) ($fixedCost?->rent ?? 0),
            'khala' => (float) ($fixedCost?->khala ?? 0),
            'utilities' => (float) ($fixedCost?->utilities ?? 0),
            'wifi' => (float) ($fixedCost?->wifi ?? 0),
        ];
        $fixedTotal = round(array_sum($fixedBreakdown), 2);

        $totalMealsAllMembers = (float) Meal::query()
            ->where('mess_id', $user->mess_id)
            ->whereBetween('meal_date', [$monthStart, $monthEnd])
            ->sum('quantity');

        $mealCostTotal = round($totalMealsAllMembers * self::COST_PER_MEAL, 2);

        $monthlyExpenses = Expense::query()
            ->where('mess_id', $user->mess_id)
            ->whereBetween('expense_date', [$monthStart, $monthEnd])
            ->get(['title', 'amount']);

        // Separate bazaar (meal) expenses from other expenses to avoid double-counting
        $bazaarExpenses = $monthlyExpenses->filter(fn ($e) => strtolower(trim((string) $e->title)) === 'bazaar');
        $otherExpenses = $monthlyExpenses->filter(fn ($e) => strtolower(trim((string) $e->title)) !== 'bazaar');

        $bazaarTotal = round($bazaarExpenses->sum('amount'), 2);
        $otherExpensesTotal = round($otherExpenses->sum('amount'), 2);

        // Compute dynamic cost per meal from bazaar total
        $costPerMeal = $totalMealsAllMembers > 0 ? round($bazaarTotal / $totalMealsAllMembers, 2) : 0;
        $mealCostTotal = round($costPerMeal * $totalMealsAllMembers, 2);

        $expenseBreakdownRows = $otherExpenses
            ->groupBy(fn ($expense) => trim(strtolower((string) $expense->title)))
            ->map(function ($items, $category) {
                $displayName = collect($items)->first()?->title ?? $category;

                return [
                    'category' => $displayName,
                    'amount' => round($items->sum('amount'), 2),
                ];
            })
            ->values()
            ->all();

        $totalExpenses = round($mealCostTotal + $fixedTotal + $otherExpensesTotal, 2);
        $fixedCostPerPerson = $memberCount > 0 ? round($fixedTotal / $memberCount, 2) : 0;
        $recentActivity = $this->buildRecentActivityFeed($user->mess_id, $monthStart, $monthEnd);

        return response()->json([
            'data' => [
                'monthKey' => $monthKey,
                'memberCount' => $memberCount,
                'totalMealsAllMembers' => $totalMealsAllMembers,
                'costPerMeal' => $costPerMeal,
                'mealCostTotal' => $mealCostTotal,
                'expenseTotal' => $otherExpensesTotal,
                'expenseBreakdownRows' => $expenseBreakdownRows,
                'fixedBreakdown' => $fixedBreakdown,
                'fixedTotal' => $fixedTotal,
                'fixedCostPerPerson' => $fixedCostPerPerson,
                'totalExpenses' => $totalExpenses,
                'recentActivity' => $recentActivity,
                'breakdownRows' => [
                    ['category' => 'Meal cost', 'amount' => $mealCostTotal],
                    ['category' => 'House Rent', 'amount' => $fixedBreakdown['rent']],
                    ['category' => 'Khala', 'amount' => $fixedBreakdown['khala']],
                    ['category' => 'Utilities', 'amount' => $fixedBreakdown['utilities']],
                    ['category' => 'WiFi', 'amount' => $fixedBreakdown['wifi']],
                    ...$expenseBreakdownRows,
                ],
            ],
        ]);
    }

    private function buildRecentActivityFeed(int $messId, Carbon $monthStart, Carbon $monthEnd): array
    {
        return collect()
            ->merge($this->recentMealActivities($messId, $monthStart, $monthEnd))
            ->merge($this->recentExpenseActivities($messId, $monthStart, $monthEnd))
            ->merge($this->recentTransactionActivities($messId, $monthStart, $monthEnd))
            ->sortByDesc('sortKey')
            ->take(6)
            ->values()
            ->map(function (array $item) {
                unset($item['sortKey']);

                return $item;
            })
            ->all();
    }

    private function recentMealActivities(int $messId, Carbon $monthStart, Carbon $monthEnd)
    {
        return Meal::query()
            ->with(['user', 'createdBy'])
            ->where('mess_id', $messId)
            ->whereBetween('meal_date', [$monthStart, $monthEnd])
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(fn (Meal $meal) => $this->formatMealActivity($meal));
    }

    private function recentExpenseActivities(int $messId, Carbon $monthStart, Carbon $monthEnd)
    {
        return Expense::query()
            ->with('createdBy')
            ->where('mess_id', $messId)
            ->whereBetween('expense_date', [$monthStart, $monthEnd])
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(fn (Expense $expense) => $this->formatExpenseActivity($expense));
    }

    private function recentTransactionActivities(int $messId, Carbon $monthStart, Carbon $monthEnd)
    {
        return UserTransaction::query()
            ->with(['user', 'createdBy'])
            ->where('mess_id', $messId)
            ->whereBetween('transaction_date', [$monthStart, $monthEnd])
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(fn (UserTransaction $transaction) => $this->formatTransactionActivity($transaction));
    }

    private function formatMealActivity(Meal $meal): array
    {
        $actor = $meal->createdBy ?? $meal->user;
        $actorName = $actor?->name ?? 'Unknown user';
        $mealType = strtolower(trim((string) $meal->meal_type));
        $quantity = $this->formatQuantity($meal->quantity);
        $title = $mealType === 'off'
            ? 'Marked off duty'
            : sprintf('Added %s %s', $quantity, $mealType);

        return [
            'id' => 'meal-' . $meal->id,
            'type' => 'meal',
            'name' => $actorName,
            'title' => $title,
            'description' => $mealType === 'off'
                ? 'Meal off was recorded for the day.'
                : sprintf('%s recorded for %s', ucfirst($mealType), $actorName),
            'amount' => null,
            'timeLabel' => $meal->created_at?->diffForHumans(),
            'createdAt' => $meal->created_at?->toIso8601String(),
            'avatarInitials' => $this->buildInitials($actorName),
            'sortKey' => $meal->created_at?->getTimestamp() ?? 0,
        ];
    }

    private function formatExpenseActivity(Expense $expense): array
    {
        $actorName = $expense->createdBy?->name ?? 'Unknown user';

        return [
            'id' => 'expense-' . $expense->id,
            'type' => 'expense',
            'name' => $actorName,
            'title' => sprintf('Added expense %s', $this->formatMoney($expense->amount)),
            'description' => $expense->title,
            'amount' => (float) $expense->amount,
            'timeLabel' => $expense->created_at?->diffForHumans(),
            'createdAt' => $expense->created_at?->toIso8601String(),
            'avatarInitials' => $this->buildInitials($actorName),
            'sortKey' => $expense->created_at?->getTimestamp() ?? 0,
        ];
    }

    private function formatTransactionActivity(UserTransaction $transaction): array
    {
        $actor = $transaction->createdBy ?? $transaction->user;
        $actorName = $actor?->name ?? 'Unknown user';

        return [
            'id' => 'transaction-' . $transaction->id,
            'type' => 'transaction',
            'name' => $actorName,
            'title' => sprintf('Added deposit %s', $this->formatMoney($transaction->amount)),
            'description' => sprintf('Balance updated to %s', $this->formatMoney($transaction->balance)),
            'amount' => (float) $transaction->amount,
            'timeLabel' => $transaction->created_at?->diffForHumans(),
            'createdAt' => $transaction->created_at?->toIso8601String(),
            'avatarInitials' => $this->buildInitials($actorName),
            'sortKey' => $transaction->created_at?->getTimestamp() ?? 0,
        ];
    }

    private function buildInitials(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];
        $initials = collect($parts)
            ->filter()
            ->take(2)
            ->map(fn (string $part) => strtoupper(substr($part, 0, 1)))
            ->implode('');

        return $initials !== '' ? $initials : 'NA';
    }

    private function formatMoney(float|int|string $amount): string
    {
        return '৳' . number_format((float) $amount, 2, '.', '');
    }

    private function formatQuantity(float|int|string $quantity): string
    {
        $value = (float) $quantity;

        return abs($value - round($value)) < 0.001
            ? (string) (int) round($value)
            : rtrim(rtrim(number_format($value, 2, '.', ''), '0'), '.');
    }

    public function userDashboardStats(Request $request): JsonResponse
    {
        $summary = $this->buildUserBillSummary($request);

        return response()->json([
            'data' => $summary,
        ]);
    }

    public function userBillSummary(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->buildUserBillSummary($request),
        ]);
    }

    public function userTransactions(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_USER);

        $user = $request->user();

        if (! $user->mess_id) {
            throw ValidationException::withMessages([
                'mess' => 'User mess not found.',
            ]);
        }

        $transactions = UserTransaction::query()
            ->where('user_id', $user->id)
            ->orderByDesc('transaction_date')
            ->orderByDesc('id')
            ->get()
            ->map(fn (UserTransaction $transaction) => $this->formatUserTransaction($transaction))
            ->values();

        return response()->json([
            'data' => $transactions,
        ]);
    }

    public function storeUserDeposit(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_USER);

        $user = $request->user();

        if (! $user->mess_id) {
            throw ValidationException::withMessages([
                'mess' => 'User mess not found.',
            ]);
        }

        $data = $request->validate([
            'amount' => ['required', 'numeric', 'gt:0'],
            'date' => ['nullable', 'date'],
        ]);

        $previousBalance = (float) (UserTransaction::query()
            ->where('user_id', $user->id)
            ->orderByDesc('transaction_date')
            ->orderByDesc('id')
            ->value('balance') ?? 0);

        $amount = round((float) $data['amount'], 2);
        $nextBalance = round($previousBalance + $amount, 2);

        $transaction = UserTransaction::create([
            'mess_id' => $user->mess_id,
            'user_id' => $user->id,
            'transaction_date' => $data['date'] ?? now()->format('Y-m-d'),
            'type' => 'Deposit',
            'amount' => $amount,
            'balance' => $nextBalance,
            'created_by' => $user->id,
        ]);

        return response()->json([
            'message' => 'Deposit added successfully.',
            'data' => $this->formatUserTransaction($transaction->fresh()),
        ], 201);
    }

    private function buildUserBillSummary(Request $request): array
    {
        $user = $request->user();

        if (! $user || ! $user->mess_id) {
            throw ValidationException::withMessages([
                'mess' => 'User mess not found.',
            ]);
        }

        $data = $request->validate([
            'monthKey' => ['nullable', 'string'],
            'month_key' => ['nullable', 'string'],
        ]);

        $monthKey = $this->normalizeMonthKey(
            $data['monthKey'] ?? $data['month_key'] ?? now()->format('Y-m')
        );
        $monthStart = Carbon::createFromFormat('Y-m', $monthKey)->startOfMonth();
        $monthEnd = Carbon::createFromFormat('Y-m', $monthKey)->endOfMonth();

        $memberCount = User::query()
            ->role(User::ROLE_USER)
            ->where('mess_id', $user->mess_id)
            ->count();

        $fixedCost = FixedCost::query()
            ->where('mess_id', $user->mess_id)
            ->where('month_key', $monthKey)
            ->first();

        $fixedBreakdown = [
            'rent' => (float) ($fixedCost?->rent ?? 0),
            'khala' => (float) ($fixedCost?->khala ?? 0),
            'utilities' => (float) ($fixedCost?->utilities ?? 0),
            'wifi' => (float) ($fixedCost?->wifi ?? 0),
        ];
        $fixedTotal = round(array_sum($fixedBreakdown), 2);

        $totalMealsAllMembers = (float) Meal::query()
            ->where('mess_id', $user->mess_id)
            ->whereBetween('meal_date', [$monthStart, $monthEnd])
            ->sum('quantity');

        $userMeals = Meal::query()
            ->where('user_id', $user->id)
            ->whereBetween('meal_date', [$monthStart, $monthEnd])
            ->get(['meal_type', 'quantity']);

        $totalMeals = (float) $userMeals->sum('quantity');

        $mealBreakdown = $userMeals->reduce(
            function (array $carry, Meal $meal) {
                $mealType = strtolower(trim((string) $meal->meal_type));
                $quantity = (float) $meal->quantity;

                if ($mealType === 'lunch') {
                    $carry['lunch'] += $quantity;
                } elseif ($mealType === 'dinner') {
                    $carry['dinner'] += $quantity;
                } elseif ($mealType === 'off') {
                    $carry['off'] += 1;
                }

                return $carry;
            },
            ['lunch' => 0, 'dinner' => 0, 'off' => 0]
        );

        $monthlyExpenses = Expense::query()
            ->where('mess_id', $user->mess_id)
            ->whereBetween('expense_date', [$monthStart, $monthEnd])
            ->get(['title', 'amount']);

        $bazaarExpenses = $monthlyExpenses->filter(fn ($e) => strtolower(trim((string) $e->title)) === 'bazaar');

        $bazaarTotal = round($bazaarExpenses->sum('amount'), 2);

        $costPerMeal = $totalMealsAllMembers > 0 ? round($bazaarTotal / $totalMealsAllMembers, 2) : 0;
        $mealSubtotal = round($costPerMeal * $totalMeals, 2);

        $fixedShareTotal = $memberCount > 0 ? round($fixedTotal / $memberCount, 2) : 0;

        $paidAmount = (float) UserTransaction::query()
            ->where('user_id', $user->id)
            ->where('type', 'Deposit')
            ->whereBetween('transaction_date', [$monthStart, $monthEnd])
            ->sum('amount');

        $currentBalance = (float) (UserTransaction::query()
            ->where('user_id', $user->id)
            ->orderByDesc('transaction_date')
            ->orderByDesc('id')
            ->value('balance') ?? 0);

        $totalBill = round($mealSubtotal + $fixedShareTotal, 2);
        $dueAmount = max(round($totalBill - $paidAmount, 2), 0);

        return [
            'monthKey' => $monthKey,
            'totalMeals' => $totalMeals,
            'costPerMeal' => $costPerMeal,
            'mealSubtotal' => $mealSubtotal,
            'fixedShareTotal' => $fixedShareTotal,
            'shareBreakdown' => [
                'rentShare' => $memberCount > 0 ? round($fixedBreakdown['rent'] / $memberCount, 2) : 0,
                'khalaShare' => $memberCount > 0 ? round($fixedBreakdown['khala'] / $memberCount, 2) : 0,
                'utilitiesShare' => $memberCount > 0 ? round($fixedBreakdown['utilities'] / $memberCount, 2) : 0,
                'wifiShare' => $memberCount > 0 ? round($fixedBreakdown['wifi'] / $memberCount, 2) : 0,
            ],
            'totalBill' => $totalBill,
            'paidAmount' => round($paidAmount, 2),
            'currentBalance' => round($currentBalance, 2),
            'dueAmount' => $dueAmount,
            'mealBreakdown' => $mealBreakdown,
        ];
    }

    private function normalizeMonthKey(?string $value): string
    {
        $value = trim((string) $value);

        if (! preg_match('/^\d{4}-\d{2}$/', $value)) {
            throw ValidationException::withMessages([
                'monthKey' => 'Month must be in YYYY-MM format.',
            ]);
        }

        [$year, $month] = explode('-', $value, 2);
        $monthNum = (int) $month;

        if ($monthNum < 1 || $monthNum > 12) {
            throw ValidationException::withMessages([
                'monthKey' => 'Month must be a valid month (01-12).',
            ]);
        }

        return sprintf('%04d-%02d', (int) $year, $monthNum);
    }

    private function ensureRole(?User $user, string $role): void
    {
        if (! $user || $user->role !== $role) {
            abort(403, 'You are not authorized to perform this action.');
        }
    }

    private function formatFixedCost(?FixedCost $fixedCost, string $monthKey): array
    {
        return [
            'monthKey' => $monthKey,
            'rent' => (float) ($fixedCost?->rent ?? 0),
            'khala' => (float) ($fixedCost?->khala ?? 0),
            'utilities' => (float) ($fixedCost?->utilities ?? 0),
            'wifi' => (float) ($fixedCost?->wifi ?? 0),
        ];
    }

    private function formatExpense(Expense $expense): array
    {
        return [
            'id' => $expense->id,
            'messId' => $expense->mess_id,
            'title' => $expense->title,
            'amount' => (float) $expense->amount,
            'date' => $expense->expense_date?->format('Y-m-d'),
            'description' => $expense->description,
            'createdBy' => $expense->created_by,
            'createdAt' => $expense->created_at?->toIso8601String(),
        ];
    }

    private function formatUserTransaction(UserTransaction $transaction): array
    {
        return [
            'id' => $transaction->id,
            'messId' => $transaction->mess_id,
            'userId' => $transaction->user_id,
            'date' => $transaction->transaction_date?->format('Y-m-d'),
            'type' => $transaction->type,
            'amount' => (float) $transaction->amount,
            'balance' => (float) $transaction->balance,
            'createdBy' => $transaction->created_by,
            'createdAt' => $transaction->created_at?->toIso8601String(),
        ];
    }
}
