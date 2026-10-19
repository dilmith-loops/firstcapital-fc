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

class AuthController extends Controller
{
    /**
     * Show admin login form.
     */
    public function showLogin(): View|RedirectResponse
    {
        if (Auth::guard('admin')->check()) {
            return redirect()->route('admin.leads.index');
        }

        if (AdminAccount::count() === 0) {
            return redirect()->route('admin.setup');
        }

        return view('admin.auth.login');
    }

    /**
     * Process admin login attempt.
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $remember = $request->boolean('remember');

        if (Auth::guard('admin')->attempt([
            'email' => strtolower(trim($credentials['email'])),
            'password' => $credentials['password'],
            'status' => 'Active',
        ], $remember)) {
            $user = Auth::guard('admin')->user();
            if ($user instanceof AdminAccount) {
                $user->update(['last_login' => now()]);
            }

            $request->session()->regenerate();

            return redirect()->route('admin.leads.index')
                ->with('success', 'Welcome back, ' . $user->name . '!');
        }

        return back()
            ->withInput($request->only('email', 'remember'))
            ->withErrors(['email' => 'Invalid email address, password, or account is suspended.']);
    }

    /**
     * Show initial one-time administrator setup screen.
     */
    public function showSetup(): View|RedirectResponse
    {
        if (AdminAccount::count() > 0) {
            return redirect()->route('admin.login')
                ->with('error', 'Administrator setup has already been completed.');
        }

        return view('admin.auth.setup');
    }

    /**
     * Execute one-time initial administrator bootstrap.
     */
    public function setup(Request $request): RedirectResponse
    {
        if (AdminAccount::count() > 0) {
            abort(403, 'Administrator setup is closed.');
        }

        $expectedToken = config('security.setup_token');
        if (empty($expectedToken) || strlen($expectedToken) < 16) {
            return back()->withErrors(['token' => 'Admin setup token is not properly configured on server.']);
        }

        $request->validate([
            'token' => ['required', 'string'],
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'unique:admin_accounts,email', 'max:150'],
            'password' => ['required', 'confirmed', Password::min(10)->letters()->numbers()],
        ]);

        if (!hash_equals($expectedToken, trim($request->input('token')))) {
            return back()->withInput()->withErrors(['token' => 'Invalid Setup Token. Please check ADMIN_SETUP_TOKEN.']);
        }

        $admin = AdminAccount::create([
            'name' => trim($request->input('name')),
            'email' => strtolower(trim($request->input('email'))),
            'password_hash' => Hash::make($request->input('password')),
            'role' => 'Super Admin',
            'status' => 'Active',
            'last_login' => now(),
        ]);

        Auth::guard('admin')->login($admin);
        $request->session()->regenerate();

        return redirect()->route('admin.leads.index')
            ->with('success', 'Super Admin account created successfully! Welcome to First Capital Admin Portal.');
    }

    /**
     * Log out admin user.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login')
            ->with('success', 'You have been logged out securely.');
    }
}
