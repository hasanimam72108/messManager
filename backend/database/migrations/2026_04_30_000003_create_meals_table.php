<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mess_id')->constrained('messes')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('meal_date');
            $table->string('meal_type', 20)->default('Lunch');
            $table->decimal('quantity', 12, 2)->default(1);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['mess_id', 'meal_date']);
            $table->index(['user_id', 'meal_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meals');
    }
};