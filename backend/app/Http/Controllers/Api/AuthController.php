<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MessRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function registerRequest(Request $request): JsonResponse
    {
        $data = $request->validate([
            'messName' => ['required', 'string', 'max:255'],
            'managerName' => ['nullable', 'string', 'max:255'],
            'managerEmail' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:6'],
            'confirmPassword' => ['required', 'string', 'same:password'],
        ]);

        $normalizedEmail = Str::lower(trim($data['managerEmail']));

        if (User::where('email', $normalizedEmail)->exists()) {
            throw ValidationException::withMessages([
                'managerEmail' => 'A user with this email already exists.',
            ]);
        }

        if (MessRequest::query()
            ->where('manager_email', $normalizedEmail)
            ->where('status', 'pending')
            ->exists()) {
            throw ValidationException::withMessages([
                'managerEmail' => 'A pending request already exists for this email.',
            ]);
        }

        $messRequest = MessRequest::create([
            'mess_name' => trim($data['messName']),
            'manager_name' => trim($data['managerName'] ?? ''),
            'manager_email' => $normalizedEmail,
            'password' => Hash::make($data['password']),
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Mess request submitted successfully.',
            'request' => $this->formatMessRequest($messRequest),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::query()->where('email', Str::lower(trim($data['email'])))->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'The provided credentials are incorrect.',
            ]);
        }

        $this->ensureActiveAccess($user);

        $token = $user->createToken('mess-manager')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->formatUser($user),
        ]);
    }

    public function profile(Request $request): JsonResponse
    {
        $this->ensureActiveAccess($request->user());

        return response()->json([
            'user' => $this->formatUser($request->user()),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    public function completeFirstLoginPasswordSetup(Request $request): JsonResponse
    {
        $data = $request->validate([
            'newPassword' => ['nullable', 'string', 'min:6'],
            'new_password' => ['nullable', 'string', 'min:6'],
            'password' => ['nullable', 'string', 'min:6'],
            'currentPassword' => ['nullable', 'string'],
            'current_password' => ['nullable', 'string'],
        ]);

        $newPassword = $data['newPassword']
            ?? $data['new_password']
            ?? $data['password']
            ?? null;

        if (! $newPassword) {
            throw ValidationException::withMessages([
                'newPassword' => 'A new password is required.',
            ]);
        }

        $user = $request->user();

        $this->ensureActiveAccess($user);

        $currentPassword = $data['currentPassword']
            ?? $data['current_password']
            ?? null;

        if (! $user->must_change_password) {
            if (! $currentPassword || ! Hash::check($currentPassword, $user->password)) {
                throw ValidationException::withMessages([
                    'currentPassword' => 'Current password is invalid.',
                ]);
            }
        }

        $user->forceFill([
            'password' => $newPassword,
            'must_change_password' => false,
        ])->save();

        return response()->json([
            'message' => 'Password updated successfully.',
            'user' => $this->formatUser($user->fresh()),
        ]);
    }

    private function formatUser(User $user): array
    {
        $user->loadMissing('mess');

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'messId' => $user->mess_id,
            'messName' => $user->mess?->name,
            'mustChangePassword' => (bool) $user->must_change_password,
        ];
    }

    private function formatMessRequest(MessRequest $messRequest): array
    {
        return [
            'id' => $messRequest->id,
            'messName' => $messRequest->mess_name,
            'managerName' => $messRequest->manager_name,
            'managerEmail' => $messRequest->manager_email,
            'status' => $messRequest->status,
            'approvedMessId' => $messRequest->approved_mess_id,
        ];
    }

    private function ensureActiveAccess(?User $user): void
    {
        if (! $user) {
            abort(401, 'Unauthenticated.');
        }

        if ($user->role === User::ROLE_SUPER_ADMIN) {
            return;
        }

        $user->loadMissing('mess');

        if ($user->role === User::ROLE_MANAGER) {
            if (! $user->is_active || ! $user->mess?->is_active) {
                abort(403, 'Your account and mess are deactivated. Please contact the super admin.');
            }

            return;
        }

        if (! $user->is_active) {
            abort(403, 'Your account is deactivated. Please contact the super admin.');
        }

        if ($user->mess_id && ! $user->mess?->is_active) {
            abort(403, 'Your mess is deactivated. Please contact the super admin.');
        }
    }
}