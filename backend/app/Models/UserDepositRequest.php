<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDepositRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'mess_id',
        'user_id',
        'transaction_date',
        'type',
        'amount',
        'status',
        'requested_by',
        'approved_by',
        'approved_transaction_id',
        'approved_at',
    ];

    protected $casts = [
        'transaction_date' => 'date:Y-m-d',
        'amount' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function mess(): BelongsTo
    {
        return $this->belongsTo(Mess::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function approvedTransaction(): BelongsTo
    {
        return $this->belongsTo(UserTransaction::class, 'approved_transaction_id');
    }
}
