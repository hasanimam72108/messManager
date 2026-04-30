<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fixed_costs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mess_id')->constrained('messes')->cascadeOnDelete();
            $table->string('month_key', 7);
            $table->decimal('rent', 12, 2)->default(0);
            $table->decimal('khala', 12, 2)->default(0);
            $table->decimal('utilities', 12, 2)->default(0);
            $table->decimal('wifi', 12, 2)->default(0);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['mess_id', 'month_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fixed_costs');
    }
};
