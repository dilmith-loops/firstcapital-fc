<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\View\View;

class UserController extends Controller
{
    /**
     * List all administrators (Super Admin only).
     */
    public function index(): View
    {
        $this->authorizeSuperAdmin();
        $users = AdminAccount::orderBy('created_at', 'desc')->get();

        return view('admin.users.index', [
            'users' => $users,
            'roles' => ['Super Admin', 'Manager', 'Wealth Advisor', 'Viewer'],
        ]);
    }

    /**
     * Create a new administrator account.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorizeSuperAdmin();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'unique:admin_accounts,email', 'max:150'],
            'password' => ['required', Password::min(10)->letters()->numbers()],
            'role' => ['required', 'string', 'in:Super Admin,Manager,Wealth Advisor,Viewer'],
        ]);

        AdminAccount::create([
            'name' => trim($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'password_hash' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'status' => 'Active',
        ]);

        return back()->with('success', "Administrator account for {$validated['name']} created successfully.");
    }

    /**
     * Update an administrator's profile, role, status, or password.
     */
    public function update(Request $request, AdminAccount $user): RedirectResponse
    {
        $this->authorizeSuperAdmin();

        $rules = [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'email' => [
                'sometimes',
                'required',
                'email',
                'max:150',
                \Illuminate\Validation\Rule::unique('admin_accounts', 'email')->ignore($user->id),
            ],
            'role' => ['required', 'string', 'in:Super Admin,Manager,Wealth Advisor,Viewer'],
            'status' => ['required', 'string', 'in:Active,Suspended'],
        ];

        if ($request->filled('password')) {
            $rules['password'] = [Password::min(10)->letters()->numbers()];
        }

        $validated = $request->validate($rules);

        // Prevent Super Admin from demoting or suspending own account
        if ($user->id === Auth::id() && ($validated['status'] !== 'Active' || $validated['role'] !== 'Super Admin')) {
            return back()->with('error', 'You cannot change your own status or demote your own Super Admin role.');
        }

        $updates = [
            'role' => $validated['role'],
            'status' => $validated['status'],
        ];

        if (isset($validated['name'])) {
            $updates['name'] = trim($validated['name']);
        }

        if (isset($validated['email'])) {
            $updates['email'] = strtolower(trim($validated['email']));
        }

        if ($request->filled('password')) {
            $updates['password_hash'] = Hash::make($validated['password']);
        }

        $user->update($updates);

        return back()->with('success', "Updated administrator account for {$user->name}.");
    }

    /**
     * Delete an administrator account.
     */
    public function destroy(AdminAccount $user): RedirectResponse
    {
        $this->authorizeSuperAdmin();

        if ($user->id === Auth::id()) {
            return back()->with('error', 'You cannot delete your own administrator account.');
        }

        $name = $user->name;
        $user->delete();

        return back()->with('success', "Administrator account for {$name} has been removed.");
    }

    protected function authorizeSuperAdmin(): void
    {
        $user = Auth::user();
        if (!$user instanceof AdminAccount || !$user->isSuperAdmin()) {
            abort(403, 'Super Admin privileges required to manage administrator accounts.');
        }
    }
}
