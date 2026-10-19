@extends('layouts.admin')

@section('title', 'Edit Administrator Profile')

@section('content')
<div class="space-y-5">
    <!-- Breadcrumb & Page Title -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <div class="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                <a href="{{ route('admin.leads.index') }}" class="hover:text-amber-600 transition">Portal</a>
                <span>/</span>
                @if(Auth::user()->isSuperAdmin())
                <a href="{{ route('admin.users.index') }}" class="hover:text-amber-600 transition">Administrators</a>
                <span>/</span>
                @endif
                <span class="text-slate-800 font-medium">My Profile</span>
            </div>
            <h1 class="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">Edit Profile & Security</h1>
            <p class="text-xs text-slate-500 mt-0.5">Manage your administrator account credentials and password</p>
        </div>

        <div>
            @if(Auth::user()->isSuperAdmin())
            <a href="{{ route('admin.users.index') }}" class="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition shadow-xs">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                <span>Back to Administrators</span>
            </a>
            @else
            <a href="{{ route('admin.leads.index') }}" class="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition shadow-xs">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                <span>Back to Dashboard</span>
            </a>
            @endif
        </div>
    </div>

    <!-- Profile Overview Card -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div class="flex items-center space-x-4">
                <div class="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-2xl shadow-sm font-display">
                    {{ strtoupper(substr($user->name, 0, 1)) }}
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <h2 class="text-lg font-bold text-slate-900">{{ $user->name }}</h2>
                        <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono border border-slate-200">ID #{{ $user->id }}</span>
                    </div>
                    <p class="text-xs text-slate-500 font-mono mt-0.5">{{ $user->email }}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold 
                            @if($user->role === 'Super Admin') bg-rose-50 text-rose-700 border border-rose-200
                            @elseif($user->role === 'Manager') bg-indigo-50 text-indigo-700 border border-indigo-200
                            @elseif($user->role === 'Wealth Advisor') bg-emerald-50 text-emerald-700 border border-emerald-200
                            @else bg-slate-100 text-slate-700 border border-slate-200
                            @endif">
                            {{ $user->role }}
                        </span>
                        <span class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>{{ $user->status }}</span>
                        </span>
                    </div>
                </div>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-500 space-y-1 w-full sm:w-auto">
                <div class="flex justify-between sm:justify-start gap-4">
                    <span class="text-slate-400">Last Activity:</span>
                    <span class="text-slate-800 font-semibold">{{ $user->last_login ? $user->last_login->diffForHumans() : 'Just now' }}</span>
                </div>
                <div class="flex justify-between sm:justify-start gap-4">
                    <span class="text-slate-400">Account Created:</span>
                    <span class="text-slate-800 font-semibold">{{ $user->created_at->format('M d, Y') }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Profile Form -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <form method="POST" action="{{ route('admin.profile.update') }}" class="divide-y divide-slate-100">
            @csrf
            @method('PUT')

            <!-- Section 1: Personal Details -->
            <div class="p-6 sm:p-8 space-y-5">
                <div>
                    <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        Operator Information
                    </h3>
                    <p class="text-xs text-slate-500 mt-1">Update your display name and corporate contact email.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    <div>
                        <label for="name" class="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name <span class="text-rose-500">*</span></label>
                        <input type="text" id="name" name="name" value="{{ old('name', $user->name) }}" required
                               class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition placeholder-slate-400">
                        @error('name')
                        <p class="text-rose-500 text-xs mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <label for="email" class="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Corporate Email <span class="text-rose-500">*</span></label>
                        <input type="email" id="email" name="email" value="{{ old('email', $user->email) }}" required
                               class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition placeholder-slate-400">
                        @error('email')
                        <p class="text-rose-500 text-xs mt-1">{{ $message }}</p>
                        @enderror
                    </div>
                </div>
            </div>

            <!-- Section 2: Password Change -->
            <div class="p-6 sm:p-8 space-y-5">
                <div>
                    <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                        Security & Password Update
                    </h3>
                    <p class="text-xs text-slate-500 mt-1">Leave blank if you do not wish to change your password. Minimum 10 characters with numbers and letters.</p>
                </div>

                <div class="space-y-4 text-xs">
                    <div>
                        <label for="current_password" class="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Current Password</label>
                        <div class="relative max-w-md">
                            <input type="password" id="current_password" name="current_password" autocomplete="current-password"
                                   placeholder="Enter current password to authorize change"
                                   class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition pr-10 placeholder-slate-400">
                            <button type="button" onclick="toggleField('current_password')" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            </button>
                        </div>
                        @error('current_password')
                        <p class="text-rose-500 text-xs mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                        <div>
                            <label for="new_password" class="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">New Secure Password</label>
                            <div class="relative">
                                <input type="password" id="new_password" name="new_password" autocomplete="new-password"
                                       placeholder="••••••••••••"
                                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition pr-10 placeholder-slate-400">
                                <button type="button" onclick="toggleField('new_password')" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                </button>
                            </div>
                            @error('new_password')
                            <p class="text-rose-500 text-xs mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="new_password_confirmation" class="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                            <div class="relative">
                                <input type="password" id="new_password_confirmation" name="new_password_confirmation" autocomplete="new-password"
                                       placeholder="••••••••••••"
                                       class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition pr-10 placeholder-slate-400">
                                <button type="button" onclick="toggleField('new_password_confirmation')" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Action -->
            <div class="p-6 sm:p-8 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                <span class="text-xs text-slate-400">Passwords are securely hashed with Bcrypt (cost 12).</span>
                <button type="submit" 
                        class="px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-500 text-slate-950 transition-all shadow-sm inline-flex items-center space-x-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <span>Save Profile Changes</span>
                </button>
            </div>
        </form>
    </div>
</div>

<script>
    function toggleField(fieldId) {
        const input = document.getElementById(fieldId);
        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
        }
    }
</script>
@endsection
