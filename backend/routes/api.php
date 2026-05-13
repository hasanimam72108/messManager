<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\MealController;
use App\Http\Controllers\Api\ManagementController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/register', [AuthController::class, 'registerRequest']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'profile']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/password/first-login', [AuthController::class, 'completeFirstLoginPasswordSetup']);

    Route::prefix('admin')->group(function () {
        Route::get('/mess-requests', [ManagementController::class, 'messRequests']);
        Route::post('/mess-requests/{messRequest}/approve', [ManagementController::class, 'approveMessRequest']);
        Route::post('/mess-requests/{messRequest}/reject', [ManagementController::class, 'rejectMessRequest']);
        Route::get('/managers', [ManagementController::class, 'managers']);
        Route::get('/system-report', [ManagementController::class, 'systemReport']);
        Route::get('/messes-with-details', [ManagementController::class, 'messesWithDetails']);
        Route::delete('/messes/{mess}', [ManagementController::class, 'destroyMessAsAdmin']);
        Route::delete('/managers/{manager}', [ManagementController::class, 'destroyManagerAsAdmin']);
    });

    Route::prefix('manager')->group(function () {
        Route::get('/mess', [ManagementController::class, 'managerMess']);
        Route::put('/mess', [ManagementController::class, 'updateManagerMess']);
        Route::delete('/mess', [ManagementController::class, 'destroyManagerMess']);
        Route::get('/members', [ManagementController::class, 'members']);
        Route::post('/members', [ManagementController::class, 'storeMember']);
        Route::put('/members/{member}', [ManagementController::class, 'updateMember']);
        Route::delete('/members/{member}', [ManagementController::class, 'destroyMember']);
        Route::get('/deposit-requests', [ExpenseController::class, 'pendingDepositRequests']);
        Route::post('/deposit-requests/{depositRequest}/approve', [ExpenseController::class, 'approvePendingDeposit']);

        Route::get('/dashboard/stats', [ExpenseController::class, 'dashboardStats']);
        Route::get('/meals/daily', [ExpenseController::class, 'managerDailyMeals']);
        Route::get('/fixed-costs', [ExpenseController::class, 'fixedCosts']);
        Route::get('/expenses/summary', [ExpenseController::class, 'monthlyExpenseSummary']);
        Route::put('/fixed-costs', [ExpenseController::class, 'upsertFixedCosts']);
        Route::post('/expenses', [ExpenseController::class, 'storeExpense']);
    });

    // User-specific dashboard stats (authenticated users)
    Route::get('/user/dashboard/stats', [ExpenseController::class, 'userDashboardStats']);
    Route::get('/user/bill/summary', [ExpenseController::class, 'userBillSummary']);
    Route::get('/user/transactions', [ExpenseController::class, 'userTransactions']);
    Route::post('/user/transactions', [ExpenseController::class, 'storeUserDeposit']);

    Route::prefix('user')->group(function () {
        Route::get('/meals', [MealController::class, 'index']);
        Route::post('/meals', [MealController::class, 'store']);
    });
});
