<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\View\View;

class ProfileController extends Controller
{
    /**
     * Show administrator profile edit screen.
     */
    public function edit(): View
    {
        /** @var AdminAccount $user */
        $user = Auth::guard('admin')->user();

        return view('admin.profile.edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update administrator personal profile and optional password change.
     */
    public function update(Request $request): RedirectResponse
    {
        /** @var AdminAccount $user */
        $user = Auth::guard('admin')->user();

        $rules = [
            'name' => ['required', 'string', 'max:100'],
            'email' => [
                'required',
                'email',
                'max:150',
                Rule::unique('admin_accounts', 'email')->ignore($user->id),
            ],
        ];

        // If user wants to change password
        if ($request->filled('new_password') || $request->filled('current_password')) {
            $rules['current_password'] = ['required', 'string'];
            $rules['new_password'] = [
                'required',
                'string',
                'confirmed',
                Password::min(10)->letters()->numbers(),
            ];
        }

        $validated = $request->validate($rules);

        // Verify current password if password change requested
        if ($request->filled('new_password')) {
            if (!Hash::check($validated['current_password'], $user->getAuthPassword())) {
                return back()
                    ->withInput($request->except(['current_password', 'new_password', 'new_password_confirmation']))
                    ->withErrors(['current_password' => 'The current password you provided does not match our records.']);
            }

            $user->password_hash = Hash::make($validated['new_password']);
        }

        $user->name = trim($validated['name']);
        $user->email = strtolower(trim($validated['email']));
        $user->save();

        return back()->with('success', 'Your administrator profile has been updated successfully.');
    }
}
