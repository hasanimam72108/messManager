<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Expense;
use App\Models\FixedCost;
use App\Models\Meal;
use App\Models\Mess;
use App\Models\MessRequest;
use App\Models\User;
use App\Models\UserDepositRequest;
use App\Models\UserTransaction;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::transaction(function (): void {
            $superAdmin = User::firstOrCreate(
                ['email' => env('SUPER_ADMIN_EMAIL', 'superadmin@mess.com')],
                [
                    'name' => 'Super Admin',
                    'password' => env('SUPER_ADMIN_PASSWORD', 'admin123'),
                    'role' => User::ROLE_SUPER_ADMIN,
                    'mess_id' => null,
                    'must_change_password' => false,
                ],
            );

            $messRequest = MessRequest::firstOrCreate(
                ['manager_email' => 'manager1@mess.com'],
                [
                    'mess_name' => 'Green Leaf Mess',
                    'manager_name' => 'Manager One',
                    'status' => 'pending',
                ],
            );

            $mess = Mess::firstOrCreate(
                ['name' => 'Green Leaf Mess'],
                [
                    'manager_user_id' => null,
                    'mess_request_id' => $messRequest->id,
                ],
            );

            $manager = User::firstOrCreate(
                ['email' => 'manager1@mess.com'],
                [
                    'name' => 'Manager One',
                    'password' => 'manager123',
                    'phone' => '01700000001',
                    'role' => User::ROLE_MANAGER,
                    'mess_id' => $mess->id,
                    'must_change_password' => true,
                ],
            );

            $memberOne = User::firstOrCreate(
                ['email' => 'member1@mess.com'],
                [
                    'name' => 'Member One',
                    'password' => 'member123',
                    'phone' => '01700000002',
                    'role' => User::ROLE_USER,
                    'mess_id' => $mess->id,
                    'must_change_password' => true,
                ],
            );

            $memberTwo = User::firstOrCreate(
                ['email' => 'member2@mess.com'],
                [
                    'name' => 'Member Two',
                    'password' => 'member123',
                    'phone' => '01700000003',
                    'role' => User::ROLE_USER,
                    'mess_id' => $mess->id,
                    'must_change_password' => true,
                ],
            );

            $mess->update(['manager_user_id' => $manager->id]);
            $messRequest->update([
                'status' => 'approved',
                'approved_mess_id' => $mess->id,
                'manager_user_id' => $manager->id,
                'approved_by' => $superAdmin->id,
                'approved_at' => now(),
            ]);

            FixedCost::firstOrCreate(
                ['mess_id' => $mess->id, 'month_key' => now()->format('Y-m')],
                [
                    'rent' => 12000,
                    'khala' => 2500,
                    'utilities' => 1800,
                    'wifi' => 800,
                    'created_by' => $manager->id,
                    'updated_by' => $manager->id,
                ],
            );

            Expense::firstOrCreate(
                ['mess_id' => $mess->id, 'title' => 'Groceries', 'expense_date' => now()->toDateString()],
                [
                    'created_by' => $manager->id,
                    'amount' => 3200,
                    'description' => 'Weekly grocery purchase for the mess.',
                ],
            );

            Expense::firstOrCreate(
                ['mess_id' => $mess->id, 'title' => 'Gas Refill', 'expense_date' => now()->subDay()->toDateString()],
                [
                    'created_by' => $manager->id,
                    'amount' => 950,
                    'description' => 'Cooking gas refill.',
                ],
            );

            Meal::firstOrCreate(
                ['mess_id' => $mess->id, 'user_id' => $memberOne->id, 'meal_date' => now()->toDateString(), 'meal_type' => 'Lunch'],
                [
                    'quantity' => 1,
                    'created_by' => $manager->id,
                ],
            );

            Meal::firstOrCreate(
                ['mess_id' => $mess->id, 'user_id' => $memberTwo->id, 'meal_date' => now()->toDateString(), 'meal_type' => 'Dinner'],
                [
                    'quantity' => 1,
                    'created_by' => $manager->id,
                ],
            );

            Meal::firstOrCreate(
                ['mess_id' => $mess->id, 'user_id' => $memberOne->id, 'meal_date' => now()->subDay()->toDateString(), 'meal_type' => 'Dinner'],
                [
                    'quantity' => 1,
                    'created_by' => $manager->id,
                ],
            );

            $startingBalance = 5000;

            UserTransaction::firstOrCreate(
                ['mess_id' => $mess->id, 'user_id' => $memberOne->id, 'transaction_date' => now()->subDay()->toDateString(), 'type' => 'Deposit', 'amount' => 3000],
                [
                    'balance' => $startingBalance,
                    'created_by' => $manager->id,
                ],
            );

            UserTransaction::firstOrCreate(
                ['mess_id' => $mess->id, 'user_id' => $memberTwo->id, 'transaction_date' => now()->subDay()->toDateString(), 'type' => 'Deposit', 'amount' => 2500],
                [
                    'balance' => 2500,
                    'created_by' => $manager->id,
                ],
            );

            UserTransaction::firstOrCreate(
                ['mess_id' => $mess->id, 'user_id' => $memberOne->id, 'transaction_date' => now()->toDateString(), 'type' => 'Meal Charge', 'amount' => 180],
                [
                    'balance' => $startingBalance - 180,
                    'created_by' => $manager->id,
                ],
            );

            UserDepositRequest::firstOrCreate(
                ['mess_id' => $mess->id, 'user_id' => $memberTwo->id, 'transaction_date' => now()->toDateString(), 'amount' => 1500],
                [
                    'type' => 'Deposit',
                    'status' => 'approved',
                    'requested_by' => $memberTwo->id,
                    'approved_by' => $manager->id,
                    'approved_transaction_id' => null,
                    'approved_at' => now(),
                ],
            );
        });
    }
}
