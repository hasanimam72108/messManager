<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mess;
use App\Models\MessRequest;
use App\Models\Meal;
use App\Models\User;
use App\Models\UserTransaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ManagementController extends Controller
{
    public function messRequests(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_SUPER_ADMIN);

        $status = $request->query('status');

        $messRequests = MessRequest::query()
            ->when($status, fn ($query) => $query->where('status', $status))
            ->latest()
            ->get()
            ->map(fn (MessRequest $messRequest) => $this->formatMessRequest($messRequest))
            ->values();

        return response()->json([
            'data' => $messRequests,
        ]);
    }

    public function approveMessRequest(Request $request, MessRequest $messRequest): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_SUPER_ADMIN);

        if ($messRequest->status !== 'pending') {
            throw ValidationException::withMessages([
                'messRequest' => 'Only pending requests can be approved.',
            ]);
        }

        if (User::where('email', $messRequest->manager_email)->exists()) {
            throw ValidationException::withMessages([
                'managerEmail' => 'A user with this email already exists.',
            ]);
        }

        [$mess, $manager] = DB::transaction(function () use ($messRequest, $request) {
            $mess = Mess::create([
                'name' => $messRequest->mess_name,
                'manager_user_id' => null,
                'mess_request_id' => $messRequest->id,
            ]);

            $manager = User::create([
                'name' => $messRequest->manager_name ?: 'Manager',
                'email' => $messRequest->manager_email,
                'password' => $messRequest->password,
                'role' => User::ROLE_MANAGER,
                'mess_id' => $mess->id,
                'must_change_password' => false,
            ]);

            $mess->forceFill([
                'manager_user_id' => $manager->id,
            ])->save();

            $messRequest->forceFill([
                'status' => 'approved',
                'approved_mess_id' => $mess->id,
                'manager_user_id' => $manager->id,
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
                'rejected_at' => null,
                'rejection_reason' => null,
            ])->save();

            return [$mess, $manager];
        });

        return response()->json([
            'message' => 'Mess request approved successfully.',
            'mess' => $this->formatMess($mess->fresh(['manager', 'request'])),
            'manager' => $this->formatUser($manager->fresh(['mess'])),
            'request' => $this->formatMessRequest($messRequest->fresh()),
        ]);
    }

    public function rejectMessRequest(Request $request, MessRequest $messRequest): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_SUPER_ADMIN);

        if ($messRequest->status !== 'pending') {
            throw ValidationException::withMessages([
                'messRequest' => 'Only pending requests can be rejected.',
            ]);
        }

        $messRequest->forceFill([
            'status' => 'rejected',
            'approved_mess_id' => null,
            'approved_by' => $request->user()->id,
            'rejected_at' => now(),
        ])->save();

        return response()->json([
            'message' => 'Mess request rejected successfully.',
            'request' => $this->formatMessRequest($messRequest->fresh()),
        ]);
    }

    public function managers(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_SUPER_ADMIN);

        $managers = User::query()
            ->with('mess')
            ->role(User::ROLE_MANAGER)
            ->latest()
            ->get()
            ->map(fn (User $manager) => $this->formatUser($manager))
            ->values();

        return response()->json([
            'data' => $managers,
        ]);
    }

    public function managerMess(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);

        $mess = $this->resolveManagedMess($request->user());

        return response()->json([
            'data' => $this->formatMess($mess),
        ]);
    }

    public function updateManagerMess(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);

        $mess = $this->resolveManagedMess($request->user());

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:messes,name,'.$mess->id],
        ]);

        $mess->forceFill([
            'name' => trim($data['name']),
        ])->save();

        return response()->json([
            'message' => 'Mess name updated successfully.',
            'mess' => $this->formatMess($mess->fresh(['manager', 'request'])),
        ]);
    }

    public function destroyManagerMess(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);

        $mess = $this->resolveManagedMess($request->user());
        $mess->delete();

        return response()->json([
            'message' => 'Mess deleted successfully.',
        ]);
    }

    public function members(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);

        $members = User::query()
            ->with('mess')
            ->where('role', User::ROLE_USER)
            ->where('mess_id', $request->user()->mess_id)
            ->latest()
            ->get()
            ->map(fn (User $member) => $this->formatUser($member))
            ->values();

        return response()->json([
            'data' => $members,
        ]);
    }

    public function storeMember(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
        ]);

        if (! $request->user()->mess_id) {
            throw ValidationException::withMessages([
                'mess' => 'Manager mess not found.',
            ]);
        }

        $normalizedEmail = Str::lower(trim($data['email']));

        if (User::where('email', $normalizedEmail)->exists()) {
            throw ValidationException::withMessages([
                'email' => 'A user with this email already exists.',
            ]);
        }

        $tempPassword = sprintf('Member%04d', random_int(1000, 9999));

        $member = User::create([
            'name' => trim($data['name']),
            'email' => $normalizedEmail,
            'password' => $tempPassword,
            'role' => User::ROLE_USER,
            'mess_id' => $request->user()->mess_id,
            'must_change_password' => true,
        ]);

        return response()->json([
            'message' => 'Member added successfully.',
            'tempPassword' => $tempPassword,
            'user' => $this->formatUser($member->fresh(['mess'])),
        ], 201);
    }

    public function updateMember(Request $request, User $member): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);
        $this->ensureMemberBelongsToManager($request->user(), $member);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
        ]);

        $normalizedEmail = Str::lower(trim($data['email']));

        if (User::query()
            ->where('email', $normalizedEmail)
            ->where('id', '!=', $member->id)
            ->exists()) {
            throw ValidationException::withMessages([
                'email' => 'A user with this email already exists.',
            ]);
        }

        $member->forceFill([
            'name' => trim($data['name']),
            'email' => $normalizedEmail,
        ])->save();

        return response()->json([
            'message' => 'Member updated successfully.',
            'user' => $this->formatUser($member->fresh(['mess'])),
        ]);
    }

    public function destroyMember(Request $request, User $member): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_MANAGER);
        $this->ensureMemberBelongsToManager($request->user(), $member);

        $member->delete();

        return response()->json([
            'message' => 'Member deleted successfully.',
        ]);
    }

    public function destroyMessAsAdmin(Request $request, Mess $mess): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_SUPER_ADMIN);

        $mess->delete();

        return response()->json([
            'message' => 'Mess deleted successfully.',
        ]);
    }

    public function destroyManagerAsAdmin(Request $request, User $manager): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_SUPER_ADMIN);

        if ($manager->role !== User::ROLE_MANAGER) {
            abort(404, 'Manager not found.');
        }

        if ($manager->mess_id) {
            throw ValidationException::withMessages([
                'manager' => 'Manager cannot be deleted until their mess is deleted first.',
            ]);
        }

        $manager->delete();

        return response()->json([
            'message' => 'Manager deleted successfully.',
        ]);
    }

    private function ensureRole(?User $user, string $role): void
    {
        if (! $user || $user->role !== $role) {
            abort(403, 'You are not authorized to perform this action.');
        }
    }

    private function ensureMemberBelongsToManager(User $manager, User $member): void
    {
        if ($member->role !== User::ROLE_USER || (int) $member->mess_id !== (int) $manager->mess_id) {
            abort(404, 'Member not found.');
        }
    }

    private function resolveManagedMess(User $manager): Mess
    {
        $mess = Mess::query()->with(['manager', 'request'])->find($manager->mess_id);

        if (! $mess || (int) $mess->manager_user_id !== (int) $manager->id) {
            abort(404, 'Mess not found.');
        }

        return $mess;
    }

    private function formatUser(User $user): array
    {
        $user->loadMissing('mess');
        $totalMeals = (float) $user->meals()->sum('quantity');
        $currentBalance = (float) ($user->transactions()->latest('transaction_date')->latest('id')->value('balance') ?? 0);

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'messId' => $user->mess_id,
            'messName' => $user->mess?->name,
            'mustChangePassword' => (bool) $user->must_change_password,
            'totalMeals' => $totalMeals,
            'balance' => $currentBalance,
        ];
    }

    private function formatMess(Mess $mess): array
    {
        $mess->loadMissing('manager', 'request');

        return [
            'id' => $mess->id,
            'name' => $mess->name,
            'managerUserId' => $mess->manager_user_id,
            'managerName' => $mess->manager?->name,
            'managerEmail' => $mess->manager?->email,
            'requestId' => $mess->mess_request_id,
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

    public function systemReport(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_SUPER_ADMIN);

        $totalMesses = Mess::count();
        $totalManagers = User::where('role', User::ROLE_MANAGER)->count();
        $totalUsers = User::where('role', User::ROLE_USER)->count();
        $pendingRequests = MessRequest::where('status', 'pending')->count();

        return response()->json([
            'data' => [
                'totalMesses' => $totalMesses,
                'totalManagers' => $totalManagers,
                'totalUsers' => $totalUsers,
                'pendingRequests' => $pendingRequests,
            ],
        ]);
    }

    public function messesWithDetails(Request $request): JsonResponse
    {
        $this->ensureRole($request->user(), User::ROLE_SUPER_ADMIN);

        $messes = Mess::query()
            ->with(['manager', 'members'])
            ->latest()
            ->get()
            ->map(function (Mess $mess) {
                return [
                    'id' => $mess->id,
                    'name' => $mess->name,
                    'managerName' => $mess->manager?->name ?? 'N/A',
                    'managerEmail' => $mess->manager?->email ?? 'N/A',
                    'memberCount' => $mess->members()->where('role', User::ROLE_USER)->count(),
                ];
            })
            ->values();

        return response()->json([
            'data' => $messes,
        ]);
    }
}