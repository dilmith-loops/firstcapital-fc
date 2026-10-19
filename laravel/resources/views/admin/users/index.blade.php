@extends('layouts.admin')

@section('title', 'Administrator Accounts')

@section('content')
<div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">Administrator Management</h1>
            <p class="text-xs text-slate-500 mt-0.5">Manage corporate access, roles, and status for First Capital portal operators</p>
        </div>

        <div class="flex items-center gap-2.5">
            <a href="{{ route('admin.profile') }}" 
               class="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition shadow-xs">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                <span>Edit My Profile</span>
            </a>
            <button type="button" onclick="document.getElementById('createUserModal').classList.remove('hidden')" 
                    class="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 transition shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                <span>Add Administrator</span>
            </button>
        </div>
    </div>

    <!-- Administrators Table -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
                <thead>
                    <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                        <th class="py-3 px-4">Operator Name</th>
                        <th class="py-3 px-4">Corporate Email</th>
                        <th class="py-3 px-4">Assigned Role</th>
                        <th class="py-3 px-4">Account Status</th>
                        <th class="py-3 px-4">Last Activity</th>
                        <th class="py-3 px-4">Created</th>
                        <th class="py-3 px-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @foreach($users as $user)
                    <tr class="hover:bg-slate-50/80 transition">
                        <!-- Name -->
                        <td class="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2.5">
                            <div class="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                                {{ strtoupper(substr($user->name, 0, 1)) }}
                            </div>
                            <span>{{ $user->name }}</span>
                            @if($user->id === Auth::id())
                                <span class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono border border-slate-200">(You)</span>
                            @endif
                        </td>

                        <!-- Email -->
                        <td class="py-3.5 px-4 text-slate-600 font-mono">
                            {{ $user->email }}
                        </td>

                        <!-- Role -->
                        <td class="py-3.5 px-4">
                            <span class="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold 
                                @if($user->role === 'Super Admin') bg-rose-50 text-rose-700 border border-rose-200
                                @elseif($user->role === 'Manager') bg-indigo-50 text-indigo-700 border border-indigo-200
                                @elseif($user->role === 'Wealth Advisor') bg-emerald-50 text-emerald-700 border border-emerald-200
                                @else bg-slate-100 text-slate-700 border border-slate-200
                                @endif">
                                {{ $user->role }}
                            </span>
                        </td>

                        <!-- Status -->
                        <td class="py-3.5 px-4">
                            <span class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold 
                                {{ $user->status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200' }}">
                                <span class="w-1.5 h-1.5 rounded-full {{ $user->status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500' }}"></span>
                                <span>{{ $user->status }}</span>
                            </span>
                        </td>

                        <!-- Last Activity -->
                        <td class="py-3.5 px-4 text-slate-500">
                            {{ $user->last_login ? $user->last_login->diffForHumans() : 'Never logged in' }}
                        </td>

                        <!-- Created -->
                        <td class="py-3.5 px-4 text-slate-500">
                            {{ $user->created_at->format('M d, Y') }}
                        </td>

                        <!-- Actions -->
                        <td class="py-3.5 px-4 text-right whitespace-nowrap">
                            @if($user->id === Auth::id())
                            <div class="flex items-center justify-end space-x-2">
                                <a href="{{ route('admin.profile') }}" 
                                   class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 transition shadow-xs">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                    <span>Edit Profile</span>
                                </a>
                            </div>
                            @else
                            <div class="flex items-center justify-end space-x-2">
                                <!-- Edit Button -->
                                <button type="button" 
                                        onclick="openEditUserModal({{ $user->id }}, '{{ addslashes($user->name) }}', '{{ addslashes($user->email) }}', '{{ $user->role }}', '{{ $user->status }}')"
                                        class="px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition" 
                                        title="Edit Operator">
                                    Edit
                                </button>

                                <!-- Status Toggle Form -->
                                <form method="POST" action="{{ route('admin.users.update', $user) }}" class="inline">
                                    @csrf
                                    @method('PUT')
                                    <input type="hidden" name="role" value="{{ $user->role }}">
                                    <input type="hidden" name="status" value="{{ $user->status === 'Active' ? 'Suspended' : 'Active' }}">
                                    <button type="submit" 
                                            class="px-2 py-1 rounded text-[11px] font-semibold border transition
                                            {{ $user->status === 'Active' ? 'text-amber-700 border-amber-300 bg-amber-50 hover:bg-amber-100' : 'text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100' }}">
                                        {{ $user->status === 'Active' ? 'Suspend' : 'Activate' }}
                                    </button>
                                </form>

                                <!-- Delete Form -->
                                <form method="POST" action="{{ route('admin.users.destroy', $user) }}" onsubmit="return confirm('Permanently remove {{ $user->name }}?');" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Delete Operator">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                    </button>
                                </form>
                            </div>
                            @endif
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Add Administrator Modal -->
<div id="createUserModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs hidden">
    <div class="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <h3 class="text-sm font-bold text-slate-900 font-display">Create New Administrator</h3>
            <button onclick="document.getElementById('createUserModal').classList.add('hidden')" class="text-slate-400 hover:text-slate-600 p-1 text-lg leading-none">&times;</button>
        </div>

        <form method="POST" action="{{ route('admin.users.store') }}" class="p-6 space-y-4 text-xs">
            @csrf
            <div>
                <label for="new_name" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input type="text" id="new_name" name="name" required placeholder="e.g. Kasun Fernando"
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400">
            </div>

            <div>
                <label for="new_email" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Corporate Email</label>
                <input type="email" id="new_email" name="email" required placeholder="k.fernando@firstcapital.lk"
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400">
            </div>

            <div>
                <label for="new_role" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Role & Permissions</label>
                <select id="new_role" name="role" required class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400">
                    <option value="Manager">Manager (View, Update, Export Leads)</option>
                    <option value="Wealth Advisor">Wealth Advisor (View, Follow Up Leads)</option>
                    <option value="Viewer">Viewer (Read-Only Lead Access)</option>
                    <option value="Super Admin">Super Admin (Full Platform Control)</option>
                </select>
            </div>

            <div>
                <label for="new_password" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Temporary Password (Min. 10 chars)</label>
                <input type="password" id="new_password" name="password" required placeholder="••••••••••••"
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400">
            </div>

            <div class="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button type="button" onclick="document.getElementById('createUserModal').classList.add('hidden')" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition">
                    Cancel
                </button>
                <button type="submit" class="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold transition shadow-sm">
                    Create Administrator
                </button>
            </div>
        </form>
    </div>
</div>

<!-- Edit Administrator Modal -->
<div id="editUserModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs hidden">
    <div class="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <h3 class="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                <span>Edit Administrator</span>
            </h3>
            <button onclick="closeEditUserModal()" class="text-slate-400 hover:text-slate-600 p-1 text-lg leading-none">&times;</button>
        </div>

        <form id="editUserForm" method="POST" action="" class="p-6 space-y-4 text-xs">
            @csrf
            @method('PUT')

            <div>
                <label for="edit_name" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                <input type="text" id="edit_name" name="name" required
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400">
            </div>

            <div>
                <label for="edit_email" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Corporate Email</label>
                <input type="email" id="edit_email" name="email" required
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400">
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label for="edit_role" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Role</label>
                    <select id="edit_role" name="role" required class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400">
                        <option value="Manager">Manager</option>
                        <option value="Wealth Advisor">Wealth Advisor</option>
                        <option value="Viewer">Viewer</option>
                        <option value="Super Admin">Super Admin</option>
                    </select>
                </div>
                <div>
                    <label for="edit_status" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Status</label>
                    <select id="edit_status" name="status" required class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400">
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                </div>
            </div>

            <div>
                <label for="edit_password" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Reset Password (Optional)</label>
                <input type="password" id="edit_password" name="password" placeholder="Leave blank to keep current"
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400">
                <span class="text-[10px] text-slate-400 block mt-1">Min. 10 chars with numbers & letters</span>
            </div>

            <div class="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button type="button" onclick="closeEditUserModal()" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition">
                    Cancel
                </button>
                <button type="submit" class="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold transition shadow-sm">
                    Save Changes
                </button>
            </div>
        </form>
    </div>
</div>

<script>
    function openEditUserModal(id, name, email, role, status) {
        document.getElementById('editUserForm').action = '/admin/users/' + id;
        document.getElementById('edit_name').value = name;
        document.getElementById('edit_email').value = email;
        document.getElementById('edit_role').value = role;
        document.getElementById('edit_status').value = status;
        document.getElementById('edit_password').value = '';
        document.getElementById('editUserModal').classList.remove('hidden');
    }

    function closeEditUserModal() {
        document.getElementById('editUserModal').classList.add('hidden');
    }
</script>
@endsection
