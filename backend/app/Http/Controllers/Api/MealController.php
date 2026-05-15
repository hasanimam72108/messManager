<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Meal;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MealController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_USER);

        $user = $request->user();

        if (! $user->mess_id) {
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

        $meals = Meal::query()
            ->where('mess_id', $user->mess_id)
            ->where('user_id', $user->id)
            ->whereBetween('meal_date', [$monthStart, $monthEnd])
            ->orderByDesc('meal_date')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Meal $meal) => $this->formatMeal($meal))
            ->values();

        return response()->json([
            'data' => $meals,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_USER);

        $user = $request->user();

        if (! $user->mess_id) {
            throw ValidationException::withMessages([
                'mess' => 'User mess not found.',
            ]);
        }

        $data = $request->validate([
            'date' => ['required', 'date'],
            'mealType' => ['required', 'in:Lunch,Dinner,Off'],
            'meal_type' => ['nullable', 'in:Lunch,Dinner,Off'],
            'quantity' => ['required', 'numeric', 'min:0'],
        ]);

        $mealType = $data['mealType'] ?? $data['meal_type'];
        $quantity = (float) $data['quantity'];

        if ($mealType !== 'Off' && $quantity < 1) {
            throw ValidationException::withMessages([
                'quantity' => 'Quantity must be at least 1 for meal entries.',
            ]);
        }

        $meal = Meal::create([
            'mess_id' => $user->mess_id,
            'user_id' => $user->id,
            'meal_date' => $data['date'],
            'meal_type' => $mealType,
            'quantity' => $mealType === 'Off' ? 0 : $quantity,
            'created_by' => $user->id,
        ]);

        return response()->json([
            'message' => 'Meal added successfully.',
            'data' => $this->formatMeal($meal->fresh()),
        ], 201);
    }

    public function destroy(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_USER);

        $user = $request->user();

        if (! $user->mess_id) {
            throw ValidationException::withMessages([
                'mess' => 'User mess not found.',
            ]);
        }

        $data = $request->validate([
            'date' => ['required', 'date'],
            'mealType' => ['required', 'in:Lunch,Dinner'],
            'meal_type' => ['nullable', 'in:Lunch,Dinner'],
        ]);

        $mealDate = Carbon::parse($data['date'])->startOfDay();
        $mealType = $data['mealType'] ?? $data['meal_type'];

        if ($mealDate->lte(now()->startOfDay())) {
            throw ValidationException::withMessages([
                'date' => 'Only future meal dates can be deleted.',
            ]);
        }

        $deletedCount = Meal::query()
            ->where('mess_id', $user->mess_id)
            ->where('user_id', $user->id)
            ->whereDate('meal_date', $mealDate->toDateString())
            ->where('meal_type', $mealType)
            ->delete();

        if ($deletedCount === 0) {
            throw ValidationException::withMessages([
                'date' => 'No meal entries found for the selected meal type and date.',
            ]);
        }

        return response()->json([
            'message' => 'Meal entry deleted successfully.',
        ]);
    }

    private function ensureRole(?User $user, string $role): void
    {
        if (! $user || $user->role !== $role) {
            abort(403, 'You are not authorized to perform this action.');
        }
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

    private function formatMeal(Meal $meal): array
    {
        return [
            'id' => $meal->id,
            'messId' => $meal->mess_id,
            'userId' => $meal->user_id,
            'date' => $meal->meal_date?->format('Y-m-d'),
            'mealType' => $meal->meal_type,
            'quantity' => (float) $meal->quantity,
            'createdBy' => $meal->created_by,
            'createdAt' => $meal->created_at?->toIso8601String(),
        ];
    }
}