<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class EnsureActiveAccount
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        if ($user->role === User::ROLE_SUPER_ADMIN) {
            return $next($request);
        }

        $user->loadMissing('mess');

        if ($user->role === User::ROLE_MANAGER) {
            if (! $user->is_active || ! $user->mess?->is_active) {
                abort(403, 'Your account and mess are deactivated. Please contact the super admin.');
            }

            return $next($request);
        }

        if (! $user->is_active) {
            abort(403, 'Your account is deactivated. Please contact the super admin.');
        }

        if ($user->mess_id && ! $user->mess?->is_active) {
            abort(403, 'Your mess is deactivated. Please contact the super admin.');
        }

        return $next($request);
    }
}
