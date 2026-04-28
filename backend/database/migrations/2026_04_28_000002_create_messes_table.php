<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('manager_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('mess_request_id')->nullable()->constrained('mess_requests')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messes');
    }
};