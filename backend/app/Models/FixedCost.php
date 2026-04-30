<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FixedCost extends Model
{
    use HasFactory;

    protected $fillable = [
        'mess_id',
        'month_key',
        'rent',
        'khala',
        'utilities',
        'wifi',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'rent' => 'decimal:2',
        'khala' => 'decimal:2',
        'utilities' => 'decimal:2',
        'wifi' => 'decimal:2',
    ];

    public function mess(): BelongsTo
    {
        return $this->belongsTo(Mess::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
