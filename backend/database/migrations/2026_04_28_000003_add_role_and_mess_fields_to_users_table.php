<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user')->after('password');
            $table->foreignId('mess_id')->nullable()->after('role')->constrained('messes')->nullOnDelete();
            $table->boolean('must_change_password')->default(false)->after('mess_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('mess_id');
            $table->dropColumn(['role', 'must_change_password']);
        });
    }
};