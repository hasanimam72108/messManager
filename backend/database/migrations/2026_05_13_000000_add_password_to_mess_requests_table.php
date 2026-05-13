<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mess_requests', function (Blueprint $table) {
            $table->string('password')->nullable()->after('manager_email');
        });
    }

    public function down(): void
    {
        Schema::table('mess_requests', function (Blueprint $table) {
            $table->dropColumn('password');
        });
    }
};
