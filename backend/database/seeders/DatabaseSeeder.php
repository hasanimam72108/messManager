<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => env('SUPER_ADMIN_EMAIL', 'superadmin@mess.com')],
            [
                'name' => 'Super Admin',
                'password' => env('SUPER_ADMIN_PASSWORD', 'admin123'),
                'role' => User::ROLE_SUPER_ADMIN,
                'mess_id' => null,
                'must_change_password' => false,
            ],
        );
    }
}
