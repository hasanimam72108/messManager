<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mess extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'manager_user_id',
        'mess_request_id',
    ];

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_user_id');
    }

    public function request(): BelongsTo
    {
        return $this->belongsTo(MessRequest::class, 'mess_request_id');
    }

    public function members(): HasMany
    {
        return $this->hasMany(User::class, 'mess_id');
    }
}