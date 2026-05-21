<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\FixedCost;
use App\Models\Meal;
use App\Models\User;
use App\Models\UserDepositRequest;
use App\Models\UserTransaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function expensesList(Request $request): JsonResponse
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

        $expenses = Expense::query()
            ->where('mess_id', $user->mess_id)
            ->whereBetween('expense_date', [$monthStart, $monthEnd])
            ->orderBy('expense_date', 'desc')
            ->get()
            ->map(function ($expense) {
                return [
                    'id' => $expense->id,
                    'title' => $expense->title,
                    'amount' => (float) $expense->amount,
                    'date' => $expense->expense_date->format('Y-m-d'),
                    'description' => $expense->description ?? '',
                ];
            });

        return response()->json([
            'data' => [
                'monthKey' => $monthKey,
                'expenses' => $expenses,
                'total' => (float) $expenses->sum('amount'),
                'count' => $expenses->count(),
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

    public function managerDailyMeals(Request $request): JsonResponse
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

        $meals = Meal::query()
            ->with('user:id,name')
            ->where('mess_id', $user->mess_id)
            ->whereBetween('meal_date', [$monthStart, $monthEnd])
            ->orderBy('meal_date')
            ->orderBy('id')
            ->get();

        $dateBuckets = [];
        $totalMealsAllDates = 0;

        foreach ($meals as $meal) {
            $date = $meal->meal_date?->format('Y-m-d');

            if (! $date) {
                continue;
            }

            if (! isset($dateBuckets[$date])) {
                $dateBuckets[$date] = [
                    'date' => $date,
                    'totalMeals' => 0,
                    'members' => [],
                ];
            }

            $quantity = (float) $meal->quantity;
            $memberKey = (int) $meal->user_id;
            $mealType = strtolower(trim((string) $meal->meal_type));

            $dateBuckets[$date]['totalMeals'] += $quantity;
            $totalMealsAllDates += $quantity;

            if (! isset($dateBuckets[$date]['members'][$memberKey])) {
                $dateBuckets[$date]['members'][$memberKey] = [
                    'userId' => $memberKey,
                    'name' => $meal->user?->name ?? 'Unknown user',
                    'totalMeals' => 0,
                    'lunchMeals' => 0,
                    'dinnerMeals' => 0,
                    'offEntries' => 0,
                ];
            }

            $dateBuckets[$date]['members'][$memberKey]['totalMeals'] += $quantity;

            if ($mealType === 'lunch') {
                $dateBuckets[$date]['members'][$memberKey]['lunchMeals'] += $quantity;
            } elseif ($mealType === 'dinner') {
                $dateBuckets[$date]['members'][$memberKey]['dinnerMeals'] += $quantity;
            } elseif ($mealType === 'off') {
                $dateBuckets[$date]['members'][$memberKey]['offEntries'] += 1;
            }
        }

        $dailyRows = collect($dateBuckets)
            ->map(function (array $bucket) {
                $members = collect($bucket['members'])
                    ->map(function (array $member) {
                        return [
                            'userId' => $member['userId'],
                            'name' => $member['name'],
                            'totalMeals' => round((float) $member['totalMeals'], 2),
                            'lunchMeals' => round((float) $member['lunchMeals'], 2),
                            'dinnerMeals' => round((float) $member['dinnerMeals'], 2),
                            'offEntries' => (int) $member['offEntries'],
                        ];
                    })
                    ->sortByDesc('totalMeals')
                    ->values()
                    ->all();

                return [
                    'date' => $bucket['date'],
                    'totalMeals' => round((float) $bucket['totalMeals'], 2),
                    'members' => $members,
                ];
            })
            ->sortBy('date')
            ->values()
            ->all();

        return response()->json([
            'data' => [
                'monthKey' => $monthKey,
                'totalMealsAllDates' => round($totalMealsAllDates, 2),
                'activeDates' => count($dailyRows),
                'dateOptions' => array_values(array_map(fn (array $row) => $row['date'], $dailyRows)),
                'dailyRows' => $dailyRows,
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
        $transactionType = $transaction->type ?: 'Deposit';

        return [
            'id' => 'transaction-' . $transaction->id,
            'type' => 'transaction',
            'name' => $actorName,
            'title' => sprintf('Added %s %s', $transactionType, $this->formatMoney($transaction->amount)),
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

    public function pendingDepositRequests(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);

        $user = $request->user();

        if (! $user->mess_id) {
            throw ValidationException::withMessages([
                'mess' => 'Manager mess not found.',
            ]);
        }

        $requests = UserDepositRequest::query()
            ->with('user')
            ->where('mess_id', $user->mess_id)
            ->where('status', 'pending')
            ->orderBy('transaction_date')
            ->orderBy('id')
            ->get()
            ->map(fn (UserDepositRequest $depositRequest) => $this->formatUserDepositRequest($depositRequest))
            ->values();

        return response()->json([
            'data' => $requests,
        ]);
    }

    public function approvePendingDeposit(Request $request, UserDepositRequest $depositRequest): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);

        $manager = $request->user();

        if (! $manager->mess_id) {
            throw ValidationException::withMessages([
                'mess' => 'Manager mess not found.',
            ]);
        }

        if ((int) $depositRequest->mess_id !== (int) $manager->mess_id) {
            abort(404, 'Deposit request not found.');
        }

        if ($depositRequest->status !== 'pending') {
            throw ValidationException::withMessages([
                'depositRequest' => 'Only pending requests can be approved.',
            ]);
        }

        [$approvedRequest, $transaction] = DB::transaction(function () use ($depositRequest, $manager) {
            $previousBalance = (float) (UserTransaction::query()
                ->where('user_id', $depositRequest->user_id)
                ->orderByDesc('transaction_date')
                ->orderByDesc('id')
                ->value('balance') ?? 0);

            $amount = round((float) $depositRequest->amount, 2);
            $nextBalance = round($previousBalance + $amount, 2);

            $transaction = UserTransaction::create([
                'mess_id' => $depositRequest->mess_id,
                'user_id' => $depositRequest->user_id,
                'transaction_date' => $depositRequest->transaction_date?->format('Y-m-d') ?? now()->format('Y-m-d'),
                'type' => $depositRequest->type,
                'amount' => $amount,
                'balance' => $nextBalance,
                'created_by' => $manager->id,
            ]);

            $depositRequest->forceFill([
                'status' => 'approved',
                'approved_by' => $manager->id,
                'approved_transaction_id' => $transaction->id,
                'approved_at' => now(),
            ])->save();

            return [$depositRequest->fresh(['user']), $transaction->fresh()];
        });

        return response()->json([
            'message' => 'Deposit request approved successfully.',
            'request' => $this->formatUserDepositRequest($approvedRequest),
            'data' => $this->formatUserTransaction($transaction),
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
            'type' => ['nullable', 'string', 'in:Deposit,Meals Expense,Fixed Expense'],
        ]);

        $depositRequest = UserDepositRequest::create([
            'mess_id' => $user->mess_id,
            'user_id' => $user->id,
            'transaction_date' => $data['date'] ?? now()->format('Y-m-d'),
            'type' => $data['type'] ?? 'Deposit',
            'amount' => round((float) $data['amount'], 2),
            'status' => 'pending',
            'requested_by' => $user->id,
        ]);

        return response()->json([
            'message' => 'Deposit request sent for manager approval.',
            'data' => $this->formatUserDepositRequest($depositRequest->fresh(['user'])),
        ], 201);
    }

    public function membersFinancials(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);

        $manager = $request->user();

        if (! $manager->mess_id) {
            abort(400, 'Your manager account is not assigned to any mess.');
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

        // Get all members in this mess
        $members = User::query()
            ->role(User::ROLE_USER)
            ->where('mess_id', $manager->mess_id)
            ->get();

        $memberCount = $members->count();

        // Get fixed costs for the month
        $fixedCost = FixedCost::query()
            ->where('mess_id', $manager->mess_id)
            ->where('month_key', $monthKey)
            ->first();

        $fixedBreakdown = [
            'rent' => (float) ($fixedCost?->rent ?? 0),
            'khala' => (float) ($fixedCost?->khala ?? 0),
            'utilities' => (float) ($fixedCost?->utilities ?? 0),
            'wifi' => (float) ($fixedCost?->wifi ?? 0),
        ];
        $fixedTotal = round(array_sum($fixedBreakdown), 2);
        $fixedCostPerPerson = $memberCount > 0 ? round($fixedTotal / $memberCount, 2) : 0;

        // Get all meals for this mess in this month
        $totalMealsAllMembers = (float) Meal::query()
            ->where('mess_id', $manager->mess_id)
            ->whereBetween('meal_date', [$monthStart, $monthEnd])
            ->sum('quantity');

        $costPerMeal = $totalMealsAllMembers > 0 ? round(
            Expense::query()
                ->where('mess_id', $manager->mess_id)
                ->whereBetween('expense_date', [$monthStart, $monthEnd])
                ->sum('amount') / $totalMealsAllMembers,
            2
        ) : 0;

        // Calculate per-member financials
        $membersData = [];
        $totalCostAllMembers = 0;
        $totalPaidAllMembers = 0;
        $totalDueAllMembers = 0;

        foreach ($members as $member) {
            // Member's meals count
            $memberMeals = (float) Meal::query()
                ->where('user_id', $member->id)
                ->whereBetween('meal_date', [$monthStart, $monthEnd])
                ->sum('quantity');

            // Member's meal cost
            $memberMealCost = round($memberMeals * $costPerMeal, 2);

            // Total cost for member
            $memberTotalCost = round($memberMealCost + $fixedCostPerPerson, 2);

            // Member's paid amount broken down by type
            $memberTransactions = UserTransaction::query()
                ->where('user_id', $member->id)
                ->where('mess_id', $manager->mess_id)
                ->whereBetween('transaction_date', [$monthStart, $monthEnd])
                ->get(['type', 'amount']);

            $memberPaidMeal  = round((float) $memberTransactions->where('type', 'Meals Expense')->sum('amount'), 2);
            $memberPaidFixed = round((float) $memberTransactions->where('type', 'Fixed Expense')->sum('amount'), 2);
            $memberPaid      = round($memberTransactions->sum('amount'), 2);
            $memberExtra     = round($memberPaid - $memberTotalCost, 2);

            // Member's due amount
            $memberDue = max(0, round($memberTotalCost - $memberPaid, 2));

            // Month-specific balance: Paid - (Paid(Meal) + Paid(Fixed))
            // All three values are already filtered to the selected month
            $memberBalance = round($memberPaid - $memberPaidMeal - $memberPaidFixed, 2);

            // Last payment date (all-time, not month-filtered)
            $lastPayment = UserTransaction::query()
                ->where('user_id', $member->id)
                ->where('mess_id', $manager->mess_id)
                ->latest('transaction_date')
                ->latest('id')
                ->value('transaction_date');

            $membersData[] = [
                'id'          => $member->id,
                'name'        => $member->name,
                'email'       => $member->email,
                'totalMeals'  => $memberMeals,
                'bill'        => $memberTotalCost,
                'totalCost'   => $memberTotalCost,
                'paid'        => $memberPaid,
                'paidMeal'    => $memberPaidMeal,
                'paidFixed'   => $memberPaidFixed,
                'extra'       => $memberExtra,
                'status'      => $memberExtra > 0 ? 'Pending Refund' : ($memberExtra < 0 ? 'Due' : 'Settled'),
                'balance'     => $memberBalance,
                'due'         => $memberDue,
                'lastPayment' => $lastPayment?->format('Y-m-d'),
            ];

            $totalCostAllMembers += $memberTotalCost;
            $totalPaidAllMembers += $memberPaid;
            $totalDueAllMembers += $memberDue;
        }

        return response()->json([
            'data' => [
                'monthKey' => $monthKey,
                'costPerMeal' => $costPerMeal,
                'fixedTotal' => $fixedTotal,
                'fixedCostPerPerson' => $fixedCostPerPerson,
                'totals' => [
                    'cost' => round($totalCostAllMembers, 2),
                    'paid' => round($totalPaidAllMembers, 2),
                    'due' => round($totalDueAllMembers, 2),
                ],
                'members' => $membersData,
            ],
        ]);
    }

    public function refundMemberExtra(Request $request, User $member): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);

        $manager = $request->user();

        if (! $manager->mess_id) {
            abort(400, 'Your manager account is not assigned to any mess.');
        }

        if ($member->role !== User::ROLE_USER || (int) $member->mess_id !== (int) $manager->mess_id) {
            abort(404, 'Member not found.');
        }

        $data = $request->validate([
            'monthKey' => ['required', 'string'],
            'month_key' => ['nullable', 'string'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'method' => ['required', 'string', 'in:Cash,Bkash,Bank'],
        ]);

        $monthKey = $this->normalizeMonthKey($data['monthKey'] ?? $data['month_key']);
        $monthStart = Carbon::createFromFormat('Y-m', $monthKey)->startOfMonth();
        $monthEnd = Carbon::createFromFormat('Y-m', $monthKey)->endOfMonth();

        $membersCount = User::query()
            ->role(User::ROLE_USER)
            ->where('mess_id', $manager->mess_id)
            ->count();

        $fixedCost = FixedCost::query()
            ->where('mess_id', $manager->mess_id)
            ->where('month_key', $monthKey)
            ->first();

        $fixedTotal = round(
            (float) ($fixedCost?->rent ?? 0)
            + (float) ($fixedCost?->khala ?? 0)
            + (float) ($fixedCost?->utilities ?? 0)
            + (float) ($fixedCost?->wifi ?? 0),
            2
        );
        $fixedCostPerPerson = $membersCount > 0 ? round($fixedTotal / $membersCount, 2) : 0;

        $totalMealsAllMembers = (float) Meal::query()
            ->where('mess_id', $manager->mess_id)
            ->whereBetween('meal_date', [$monthStart, $monthEnd])
            ->sum('quantity');

        $costPerMeal = $totalMealsAllMembers > 0 ? round(
            Expense::query()
                ->where('mess_id', $manager->mess_id)
                ->whereBetween('expense_date', [$monthStart, $monthEnd])
                ->sum('amount') / $totalMealsAllMembers,
            2
        ) : 0;

        $memberMeals = (float) Meal::query()
            ->where('user_id', $member->id)
            ->whereBetween('meal_date', [$monthStart, $monthEnd])
            ->sum('quantity');

        $memberBill = round(($memberMeals * $costPerMeal) + $fixedCostPerPerson, 2);

        $memberPaid = round((float) UserTransaction::query()
            ->where('user_id', $member->id)
            ->where('mess_id', $manager->mess_id)
            ->whereBetween('transaction_date', [$monthStart, $monthEnd])
            ->sum('amount'), 2);

        // Also compute category-specific paid amounts for this month
        $memberTransactions = UserTransaction::query()
            ->where('user_id', $member->id)
            ->where('mess_id', $manager->mess_id)
            ->whereBetween('transaction_date', [$monthStart, $monthEnd])
            ->get(['type', 'amount']);

        $memberPaidMeal  = round((float) $memberTransactions->where('type', 'Meals Expense')->sum('amount'), 2);
        $memberPaidFixed = round((float) $memberTransactions->where('type', 'Fixed Expense')->sum('amount'), 2);

        $memberExtra = round($memberPaid - $memberBill, 2);

        if ($memberExtra <= 0) {
            throw ValidationException::withMessages([
                'amount' => 'This member has no extra paid amount to refund for the selected month.',
            ]);
        }

        $refundAmount = round((float) $data['amount'], 2);

        if ($refundAmount > $memberExtra) {
            throw ValidationException::withMessages([
                'amount' => 'Refund amount cannot be greater than the current extra paid amount.',
            ]);
        }

        // Calculate category-specific extras
        $mealExtra = max(0, round($memberPaidMeal - round($memberMeals * $costPerMeal, 2), 2));
        $fixedExtra = max(0, round($memberPaidFixed - $fixedCostPerPerson, 2));

        // Allocate refund across meal then fixed until amount consumed
        $remaining = $refundAmount;
        $mealRefund = 0;
        $fixedRefund = 0;

        if ($mealExtra > 0) {
            $mealRefund = (float) min($remaining, $mealExtra);
            $remaining = round($remaining - $mealRefund, 2);
        }

        if ($remaining > 0 && $fixedExtra > 0) {
            $fixedRefund = (float) min($remaining, $fixedExtra);
            $remaining = round($remaining - $fixedRefund, 2);
        }

        $createdTransactions = [];

        DB::transaction(function () use (&$createdTransactions, $manager, $member, $mealRefund, $fixedRefund) {
            $previousBalance = (float) (UserTransaction::query()
                ->where('user_id', $member->id)
                ->where('mess_id', $manager->mess_id)
                ->orderByDesc('transaction_date')
                ->orderByDesc('id')
                ->value('balance') ?? 0);

            // Create meal refund transaction (negative) if applicable
            if ($mealRefund > 0) {
                $previousBalance = round($previousBalance - $mealRefund, 2);

                $tx = UserTransaction::create([
                    'mess_id' => $manager->mess_id,
                    'user_id' => $member->id,
                    'transaction_date' => now()->format('Y-m-d'),
                    'type' => 'Meals Expense',
                    'amount' => -1 * $mealRefund,
                    'balance' => $previousBalance,
                    'created_by' => $manager->id,
                ]);

                $createdTransactions[] = $tx->fresh();
            }

            // Create fixed refund transaction (negative) if applicable
            if ($fixedRefund > 0) {
                $previousBalance = round($previousBalance - $fixedRefund, 2);

                $tx = UserTransaction::create([
                    'mess_id' => $manager->mess_id,
                    'user_id' => $member->id,
                    'transaction_date' => now()->format('Y-m-d'),
                    'type' => 'Fixed Expense',
                    'amount' => -1 * $fixedRefund,
                    'balance' => $previousBalance,
                    'created_by' => $manager->id,
                ]);

                $createdTransactions[] = $tx->fresh();
            }
        });

        $updatedPaidMeal = round($memberPaidMeal - $mealRefund, 2);
        $updatedPaidFixed = round($memberPaidFixed - $fixedRefund, 2);
        $updatedPaid = round($memberPaid - ($mealRefund + $fixedRefund), 2);
        $updatedExtra = round($updatedPaid - $memberBill, 2);

        return response()->json([
            'message' => 'Refund recorded successfully.',
            'method' => $data['method'],
            'transactions' => array_map(fn($t) => $this->formatUserTransaction($t), $createdTransactions),
            'settlement' => [
                'memberId' => $member->id,
                'memberName' => $member->name,
                'monthKey' => $monthKey,
                'paidMeal' => $updatedPaidMeal,
                'paidFixed' => $updatedPaidFixed,
                'paid' => $updatedPaid,
                'bill' => $memberBill,
                'extra' => $updatedExtra,
                'status' => $updatedExtra > 0 ? 'Pending Refund' : ($updatedExtra < 0 ? 'Due' : 'Settled'),
            ],
        ]);
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

        $mealPaidAmount = (float) UserTransaction::query()
            ->where('user_id', $user->id)
            ->whereIn('type', ['Deposit', 'Meals Expense'])
            ->whereBetween('transaction_date', [$monthStart, $monthEnd])
            ->sum('amount');

        $fixedPaidAmount = (float) UserTransaction::query()
            ->where('user_id', $user->id)
            ->where('type', 'Fixed Expense')
            ->whereBetween('transaction_date', [$monthStart, $monthEnd])
            ->sum('amount');

        $paidAmount = round($mealPaidAmount + $fixedPaidAmount, 2);

        $currentBalance = (float) (UserTransaction::query()
            ->where('user_id', $user->id)
            ->orderByDesc('transaction_date')
            ->orderByDesc('id')
            ->value('balance') ?? 0);

        $mealDueAmount = max(round($mealSubtotal - $mealPaidAmount, 2), 0);
        $fixedDueAmount = max(round($fixedShareTotal - $fixedPaidAmount, 2), 0);

        $totalBill = round($mealSubtotal + $fixedShareTotal, 2);
        $dueAmount = round($mealDueAmount + $fixedDueAmount, 2);

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
            'paidAmount' => $paidAmount,
            'mealPaidAmount' => round($mealPaidAmount, 2),
            'fixedPaidAmount' => round($fixedPaidAmount, 2),
            'currentBalance' => round($currentBalance, 2),
            'dueAmount' => $dueAmount,
            'mealDueAmount' => $mealDueAmount,
            'fixedDueAmount' => $fixedDueAmount,
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

    private function formatUserDepositRequest(UserDepositRequest $depositRequest): array
    {
        return [
            'id' => $depositRequest->id,
            'messId' => $depositRequest->mess_id,
            'userId' => $depositRequest->user_id,
            'userName' => $depositRequest->user?->name,
            'userEmail' => $depositRequest->user?->email,
            'date' => $depositRequest->transaction_date?->format('Y-m-d'),
            'type' => $depositRequest->type,
            'amount' => (float) $depositRequest->amount,
            'status' => $depositRequest->status,
            'approvedBy' => $depositRequest->approved_by,
            'approvedAt' => $depositRequest->approved_at?->toIso8601String(),
            'createdAt' => $depositRequest->created_at?->toIso8601String(),
        ];
    }
}
