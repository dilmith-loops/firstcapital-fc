@extends('layouts.admin')

@section('title', 'Investor Leads & Quiz Submissions')

@section('content')
<div class="space-y-5">
    <!-- Top Bar: Title & Action Buttons -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">Investor Leads & Quiz Submissions</h1>
            <p class="text-xs text-slate-500 mt-0.5">Manage and follow up on client quiz answers and consultation inquiries</p>
        </div>

        <div class="flex items-center space-x-2.5">
            <!-- Refresh Button -->
            <button type="button" onclick="window.location.reload()" 
                    class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-xs" 
                    title="Refresh Data">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </button>

            <!-- Export CSV Button -->
            <a href="{{ route('admin.leads.export', request()->query()) }}" 
               class="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition shadow-xs">
                <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                <span>Export CSV</span>
            </a>

            <!-- + New Lead Button -->
            <button type="button" onclick="openManualLeadModal()" 
                    class="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold transition shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                <span>New Lead</span>
            </button>
        </div>
    </div>

    <!-- 1. Total Leads Metric Card -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-3.5">
            <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center font-bold">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
            <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TOTAL LEADS</span>
                <span class="text-3xl font-extrabold font-display text-slate-900 leading-none mt-0.5 block">{{ $totalLeads }}</span>
            </div>
        </div>

        <!-- Status Breakdown Pills -->
        <div class="flex flex-wrap items-center gap-2.5">
            <a href="{{ route('admin.leads.index', ['status' => 'NEW']) }}" 
               class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition {{ request()->query('status') === 'NEW' ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100' }}">
                <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>{{ $newLeads }} New</span>
            </a>

            <a href="{{ route('admin.leads.index', ['status' => 'CONTACTED']) }}" 
               class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition {{ request()->query('status') === 'CONTACTED' ? 'bg-purple-600 text-white shadow-xs' : 'bg-purple-50 text-purple-700 border border-purple-200/80 hover:bg-purple-100' }}">
                <svg class="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                <span>{{ $contactedLeads }} Contacted</span>
            </a>

            <a href="{{ route('admin.leads.index', ['status' => 'CONVERTED']) }}" 
               class="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition {{ request()->query('status') === 'CONVERTED' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100' }}">
                <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>{{ $convertedLeads }} Converted</span>
            </a>
        </div>
    </div>

    <!-- 2. Investor Persona Distribution Card -->
    <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
            <h2 class="text-sm font-bold text-slate-900 font-display">Investor Persona Distribution</h2>
            <p class="text-xs text-slate-500">Breakdown of completed quiz results across all 4 personas</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <!-- 01 The Keep-It-Cool Investor -->
            <div class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono font-bold text-[10px]">01</span>
                        <span class="text-xl font-bold font-display text-slate-900">{{ $countA }}</span>
                    </div>
                    <h3 class="text-xs font-bold text-slate-900">The Keep-It-Cool Investor</h3>
                    <p class="text-[11px] text-slate-500">Flexible & Agile</p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-200/60">
                    <div class="flex items-center justify-between text-[10px] text-slate-600 mb-1.5">
                        <span class="truncate pr-1">First Capital Money Market Fund (FCMMF)*</span>
                        <span class="font-bold text-slate-900">{{ $pctA }}%</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-400 rounded-full" style="width: {{ $pctA }}%"></div>
                    </div>
                </div>
            </div>

            <!-- 02 The Smooth Operator -->
            <div class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono font-bold text-[10px]">02</span>
                        <span class="text-xl font-bold font-display text-slate-900">{{ $countB }}</span>
                    </div>
                    <h3 class="text-xs font-bold text-slate-900">The Smooth Operator</h3>
                    <p class="text-[11px] text-slate-500">Income-Focused & Flexible</p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-200/60">
                    <div class="flex items-center justify-between text-[10px] text-slate-600 mb-1.5">
                        <span class="truncate pr-1">First Capital Fixed Income Fund (FCFIF)*</span>
                        <span class="font-bold text-slate-900">{{ $pctB }}%</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-400 rounded-full" style="width: {{ $pctB }}%"></div>
                    </div>
                </div>
            </div>

            <!-- 03 The Patient Player -->
            <div class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono font-bold text-[10px]">03</span>
                        <span class="text-xl font-bold font-display text-slate-900">{{ $countC }}</span>
                    </div>
                    <h3 class="text-xs font-bold text-slate-900">The Patient Player</h3>
                    <p class="text-[11px] text-slate-500">Long-term & income-focused</p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-200/60">
                    <div class="flex items-center justify-between text-[10px] text-slate-600 mb-1.5">
                        <span class="truncate pr-1">Treasury Bonds*</span>
                        <span class="font-bold text-slate-900">{{ $pctC }}%</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-400 rounded-full" style="width: {{ $pctC }}%"></div>
                    </div>
                </div>
            </div>

            <!-- 04 The Opportunity Hunter -->
            <div class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="px-2 py-0.5 rounded bg-slate-900 text-amber-400 font-mono font-bold text-[10px]">04</span>
                        <span class="text-xl font-bold font-display text-slate-900">{{ $countD }}</span>
                    </div>
                    <h3 class="text-xs font-bold text-slate-900">The Opportunity Hunter</h3>
                    <p class="text-[11px] text-slate-500">Growth-focused</p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-200/60">
                    <div class="flex items-center justify-between text-[10px] text-slate-600 mb-1.5">
                        <span class="truncate pr-1">Equities*</span>
                        <span class="font-bold text-slate-900">{{ $pctD }}%</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-400 rounded-full" style="width: {{ $pctD }}%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 3. Search & Filter Bar Card -->
    <div class="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
        <form method="GET" action="{{ route('admin.leads.index') }}" class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <!-- Search Keyword -->
            <div class="relative w-full sm:max-w-md">
                <input type="text" name="search" value="{{ $search }}" 
                       placeholder="Search by name, email, phone, ID..." 
                       class="w-full px-3.5 py-2 pl-9 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:bg-white transition">
                <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>

            <!-- Filters -->
            <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <div class="flex items-center gap-1.5 text-xs text-slate-500">
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                    <span class="font-medium text-slate-500">Filter:</span>
                </div>

                <!-- Personality Filter -->
                <select name="profile" onchange="this.form.submit()" class="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-amber-400 focus:bg-white cursor-pointer font-medium">
                    <option value="">All Personalities</option>
                    <option value="keep-it-cool" {{ $profile === 'keep-it-cool' ? 'selected' : '' }}>Keep-It-Cool</option>
                    <option value="smooth-operator" {{ $profile === 'smooth-operator' ? 'selected' : '' }}>Smooth Operator</option>
                    <option value="patient-player" {{ $profile === 'patient-player' ? 'selected' : '' }}>Patient Player</option>
                    <option value="opportunity-hunter" {{ $profile === 'opportunity-hunter' ? 'selected' : '' }}>Opportunity Hunter</option>
                </select>

                <!-- Status Filter -->
                <select name="status" onchange="this.form.submit()" class="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-amber-400 focus:bg-white cursor-pointer font-medium">
                    <option value="">All Statuses</option>
                    @foreach($statuses as $k => $label)
                        <option value="{{ $k }}" {{ $status === $k ? 'selected' : '' }}>{{ $label }}</option>
                    @endforeach
                </select>

                @if($search || $status || $profile)
                <a href="{{ route('admin.leads.index') }}" class="p-2 text-slate-400 hover:text-slate-600 rounded-lg" title="Clear Filters">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </a>
                @endif
            </div>
        </form>
    </div>

    <!-- 4. Leads Table Card -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
                <thead>
                    <tr class="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                        <th class="py-3 px-4">Lead / ID</th>
                        <th class="py-3 px-4">Investor Personality</th>
                        <th class="py-3 px-4">Matched Fund</th>
                        <th class="py-3 px-4">Contact Info</th>
                        <th class="py-3 px-4">Status</th>
                        <th class="py-3 px-4">Date</th>
                        <th class="py-3 px-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-xs">
                    @forelse($leads as $lead)
                    <tr class="hover:bg-slate-50/80 transition group">
                        <!-- Lead / ID -->
                        <td class="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                            <span class="block">{{ $lead->name }}</span>
                            <span class="text-[11px] font-mono text-slate-400 font-normal">FC-{{ $lead->id }}</span>
                        </td>

                        <!-- Investor Personality -->
                        <td class="py-3.5 px-4 whitespace-nowrap">
                            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold
                                @if(in_array($lead->result_code, ['A', 'keep-it-cool'])) bg-sky-50 text-sky-700 border border-sky-200/80
                                @elseif(in_array($lead->result_code, ['B', 'smooth-operator'])) bg-indigo-50 text-indigo-700 border border-indigo-200/80
                                @elseif(in_array($lead->result_code, ['C', 'patient-player'])) bg-amber-50 text-amber-800 border border-amber-200/80
                                @elseif(in_array($lead->result_code, ['D', 'opportunity-hunter'])) bg-emerald-50 text-emerald-700 border border-emerald-200/80
                                @else bg-slate-100 text-slate-700 border border-slate-200
                                @endif">
                                {{ $lead->result_profile ?: 'Investor' }}
                            </span>
                        </td>

                        <!-- Matched Fund -->
                        <td class="py-3.5 px-4 text-slate-700 font-medium">
                            <span class="truncate block max-w-xs" title="{{ $lead->matched_product }}">{{ $lead->matched_product ?: 'Money Market Fund' }}</span>
                        </td>

                        <!-- Contact Info -->
                        <td class="py-3.5 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px] space-y-0.5">
                            <div class="flex items-center space-x-1.5">
                                <svg class="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                <span>{{ $lead->phone }}</span>
                            </div>
                            <div class="flex items-center space-x-1.5">
                                <svg class="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                <span class="truncate max-w-[170px]" title="{{ $lead->email }}">{{ $lead->email }}</span>
                            </div>
                        </td>

                        <!-- Status Inline Dropdown -->
                        <td class="py-3.5 px-4 whitespace-nowrap">
                            <form method="POST" action="{{ route('admin.leads.update', $lead) }}" class="inline">
                                @csrf
                                <select name="status" onchange="this.form.submit()" 
                                        class="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer shadow-2xs">
                                    <option value="NEW" {{ $lead->status === 'NEW' ? 'selected' : '' }}>New</option>
                                    <option value="CONTACTED" {{ $lead->status === 'CONTACTED' ? 'selected' : '' }}>Contacted</option>
                                    <option value="QUALIFIED" {{ $lead->status === 'QUALIFIED' ? 'selected' : '' }}>Qualified</option>
                                    <option value="CONVERTED" {{ $lead->status === 'CONVERTED' ? 'selected' : '' }}>Converted</option>
                                    <option value="CLOSED" {{ $lead->status === 'CLOSED' ? 'selected' : '' }}>Closed</option>
                                </select>
                            </form>
                        </td>

                        <!-- Date -->
                        <td class="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                            {{ $lead->created_at->format('d M') }}
                        </td>

                        <!-- Actions -->
                        <td class="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                            <!-- View Modal Button -->
                            <button type="button" onclick="viewLeadDetail({{ $lead->id }})" 
                                    class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition" 
                                    title="View Full Answers">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            </button>

                            <!-- Delete Button -->
                            <form method="POST" action="{{ route('admin.leads.destroy', $lead) }}" 
                                  onsubmit="return confirm('Permanently remove lead FC-{{ $lead->id }} ({{ $lead->name }})?');" 
                                  class="inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition" title="Delete Lead">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                </button>
                            </form>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7" class="py-12 text-center text-slate-400">
                            <svg class="w-10 h-10 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            <p class="font-medium text-xs">No leads matching your search criteria.</p>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($leads->hasPages())
        <div class="p-4 border-t border-slate-200 bg-slate-50/50">
            {{ $leads->links() }}
        </div>
        @endif
    </div>
</div>

<!-- Add Manual Lead Modal -->
<div id="manualLeadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs hidden">
    <div class="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <h3 class="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                <span>Add Manual Prospect Lead</span>
            </h3>
            <button onclick="closeManualLeadModal()" class="text-slate-400 hover:text-slate-600 p-1 text-lg leading-none">&times;</button>
        </div>

        <form method="POST" action="{{ route('admin.leads.store') }}" class="p-6 space-y-4 text-xs">
            @csrf
            <div>
                <label for="lead_name" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name <span class="text-rose-500">*</span></label>
                <input type="text" id="lead_name" name="name" required placeholder="e.g. Kasun Silva"
                       class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label for="lead_email" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Email <span class="text-rose-500">*</span></label>
                    <input type="email" id="lead_email" name="email" required placeholder="kasun@gmail.com"
                           class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
                </div>
                <div>
                    <label for="lead_phone" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Phone <span class="text-rose-500">*</span></label>
                    <input type="text" id="lead_phone" name="phone" required placeholder="0771234567"
                           class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
                </div>
            </div>

            <div>
                <label for="lead_result" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Persona & Investment Match <span class="text-rose-500">*</span></label>
                <select id="lead_result" name="result_code" required class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400">
                    <option value="keep-it-cool">01 - The Keep-It-Cool Investor (Money Market Fund)</option>
                    <option value="smooth-operator">02 - The Smooth Operator (Fixed Income Fund)</option>
                    <option value="patient-player">03 - The Patient Player (Treasury Bonds)</option>
                    <option value="opportunity-hunter">04 - The Opportunity Hunter (Equities)</option>
                </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label for="lead_status" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Initial Status</label>
                    <select id="lead_status" name="status" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400">
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="QUALIFIED">Qualified</option>
                        <option value="CONVERTED">Converted</option>
                    </select>
                </div>
                <div>
                    <label for="lead_gender" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Gender</label>
                    <select id="lead_gender" name="gender" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
            </div>

            <div>
                <label for="lead_notes" class="block font-bold text-slate-700 uppercase tracking-wider mb-1">Advisor Notes</label>
                <textarea id="lead_notes" name="notes" rows="2" placeholder="Initial discussion notes or client requirements..."
                          class="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400"></textarea>
            </div>

            <div class="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button type="button" onclick="closeManualLeadModal()" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition">
                    Cancel
                </button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold transition shadow-sm">
                    Save Prospect Lead
                </button>
            </div>
        </form>
    </div>
</div>

<!-- Lead Detail Modal -->
<div id="leadDetailModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs hidden">
    <div class="max-w-xl w-full bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div>
                <h3 id="modalLeadName" class="text-sm font-bold text-slate-900 font-display">Lead Details</h3>
                <span id="modalLeadId" class="text-xs font-mono text-slate-400"></span>
            </div>
            <button onclick="closeLeadDetailModal()" class="text-slate-400 hover:text-slate-600 p-1 text-lg leading-none">&times;</button>
        </div>

        <div class="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
            <!-- Contact Card -->
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                        <span id="modalLeadEmail" class="font-mono text-slate-800 font-medium select-all"></span>
                    </div>
                    <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                        <span id="modalLeadPhone" class="font-mono text-slate-800 font-medium select-all"></span>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                    <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Personality Profile</span>
                        <span id="modalLeadProfile" class="font-bold text-amber-700"></span>
                    </div>
                    <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Matched Product</span>
                        <span id="modalLeadProduct" class="font-semibold text-slate-800"></span>
                    </div>
                </div>
            </div>

            <!-- Quiz Answers -->
            <div>
                <h4 class="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">Quiz Responses</h4>
                <div id="modalLeadAnswers" class="space-y-2 text-xs">
                    <p class="text-slate-400 italic">Loading answers...</p>
                </div>
            </div>

            <!-- Notes Section -->
            <div id="modalLeadNotesBlock">
                <h4 class="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">Advisory Notes</h4>
                <div id="modalLeadNotes" class="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-slate-700 leading-relaxed"></div>
            </div>
        </div>

        <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button onclick="closeLeadDetailModal()" class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition">
                Close
            </button>
        </div>
    </div>
</div>

<script>
    function openManualLeadModal() {
        document.getElementById('manualLeadModal').classList.remove('hidden');
    }
    function closeManualLeadModal() {
        document.getElementById('manualLeadModal').classList.add('hidden');
    }
    window.triggerOpenManualLeadModal = openManualLeadModal;

    function viewLeadDetail(leadId) {
        fetch('/admin/leads/' + leadId)
            .then(res => res.json())
            .then(data => {
                if (!data.success) return;
                const lead = data.lead;
                document.getElementById('modalLeadName').innerText = lead.name;
                document.getElementById('modalLeadId').innerText = lead.id + ' • ' + lead.created_at;
                document.getElementById('modalLeadEmail').innerText = lead.email;
                document.getElementById('modalLeadPhone').innerText = lead.phone;
                document.getElementById('modalLeadProfile').innerText = lead.result_profile || 'Not Set';
                document.getElementById('modalLeadProduct').innerText = lead.matched_product || 'General';

                const answersEl = document.getElementById('modalLeadAnswers');
                answersEl.innerHTML = '';
                if (lead.answers && Array.isArray(lead.answers) && lead.answers.length > 0) {
                    lead.answers.forEach((ans, i) => {
                        const div = document.createElement('div');
                        div.className = 'p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center';
                        div.innerHTML = `<span class="font-medium text-slate-700">Q${ans.questionId || (i+1)}</span><span class="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono">Option ${ans.selected || ans.key || '-'}</span>`;
                        answersEl.appendChild(div);
                    });
                } else {
                    answersEl.innerHTML = '<p class="text-slate-400 italic">No individual answers recorded for this entry.</p>';
                }

                const notesBlock = document.getElementById('modalLeadNotesBlock');
                const notesEl = document.getElementById('modalLeadNotes');
                if (lead.notes) {
                    notesBlock.classList.remove('hidden');
                    notesEl.innerText = lead.notes;
                } else {
                    notesBlock.classList.add('hidden');
                }

                document.getElementById('leadDetailModal').classList.remove('hidden');
            })
            .catch(err => {
                console.error(err);
                alert('Could not load lead details.');
            });
    }

    function closeLeadDetailModal() {
        document.getElementById('leadDetailModal').classList.add('hidden');
    }

    if (window.location.hash === '#add-lead') {
        openManualLeadModal();
    }
</script>
@endsection
