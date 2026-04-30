<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\FixedCost;
use App\Models\Meal;
use App\Models\User;
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

        $expenseTotal = round($monthlyExpenses->sum('amount'), 2);
        $expenseBreakdownRows = $monthlyExpenses
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

        $totalExpenses = round($mealCostTotal + $fixedTotal + $expenseTotal, 2);
        $fixedCostPerPerson = $memberCount > 0 ? round($fixedTotal / $memberCount, 2) : 0;

        return response()->json([
            'data' => [
                'monthKey' => $monthKey,
                'memberCount' => $memberCount,
                'totalMealsAllMembers' => $totalMealsAllMembers,
                'costPerMeal' => self::COST_PER_MEAL,
                'mealCostTotal' => $mealCostTotal,
                'expenseTotal' => $expenseTotal,
                'expenseBreakdownRows' => $expenseBreakdownRows,
                'fixedBreakdown' => $fixedBreakdown,
                'fixedTotal' => $fixedTotal,
                'fixedCostPerPerson' => $fixedCostPerPerson,
                'totalExpenses' => $totalExpenses,
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
}
