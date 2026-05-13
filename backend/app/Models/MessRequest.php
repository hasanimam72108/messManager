<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MessRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'mess_name',
        'manager_name',
        'manager_email',
        'password',
        'status',
        'approved_mess_id',
        'manager_user_id',
        'approved_by',
        'approved_at',
        'rejected_at',
        'rejection_reason',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    public function approvedMess(): BelongsTo
    {
        return $this->belongsTo(Mess::class, 'approved_mess_id');
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_user_id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}