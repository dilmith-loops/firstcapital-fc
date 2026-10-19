<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-50">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>@yield('title', 'Admin Portal') | First Capital Investor Week</title>
    <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        fc: {
                            navy: '#0A1E38',
                            dark: '#0F172A',
                            surface: '#FFFFFF',
                            border: '#E2E8F0',
                            gold: '#E5A823',
                            goldHover: '#CF9317',
                            goldLight: '#FEF3C7',
                        }
                    },
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
                        display: ['"Space Grotesk"', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    <style>
        [x-cloak] { display: none !important; }
        ::-webkit-scrollbar { width: 7px; height: 7px; }
        ::-webkit-scrollbar-track { background: #F1F5F9; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #E5A823; }
    </style>
    @stack('styles')
</head>
<body class="min-h-full font-sans text-slate-800 bg-[#F8FAFC] antialiased flex flex-col">
    <!-- Top White Navigation Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Brand Logo -->
                <div class="flex items-center space-x-4">
                    <a href="{{ route('admin.leads.index') }}" class="flex items-center space-x-3 transition-transform hover:scale-102">
                        <img src="{{ asset('first-capital-logo.png') }}" alt="First Capital" class="h-8 sm:h-9 w-auto object-contain">
                    </a>
                </div>

                <!-- Right Quick Actions -->
                <div class="flex items-center space-x-2.5 sm:space-x-3">
                    <!-- Public Website Button -->
                    <a href="{{ route('campaign.home') }}" target="_blank" 
                       class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-300 transition shadow-xs">
                        <span>Public Website</span>
                        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    </a>

                    <!-- Export Leads Gold Button -->
                    <a href="{{ route('admin.leads.export') }}" 
                       class="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-lg transition shadow-xs">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        <span>Export Leads</span>
                    </a>

                    <!-- Sign Out Button -->
                    <form method="POST" action="{{ route('admin.logout') }}" class="inline">
                        @csrf
                        <button type="submit" 
                                class="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-white hover:bg-rose-50 rounded-lg border border-rose-200 transition" 
                                title="Sign Out">
                            <svg class="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                            <span>Sign Out</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </header>

    <!-- App Body: 2-Column Layout -->
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div class="flex flex-col lg:flex-row gap-6 items-start">
            
            <!-- LEFT SIDEBAR -->
            <aside class="w-full lg:w-64 shrink-0 space-y-4">
                <!-- User & Navigation Card -->
                <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                    <!-- Signed In As Header -->
                    <div class="pb-3 border-b border-slate-100">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">SIGNED IN AS</span>
                        <div class="text-xs font-bold text-slate-900 truncate font-mono">
                            {{ Auth::user()->email ?? 'admin@firstcapital.lk' }}
                        </div>
                    </div>

                    <!-- Navigation Items List -->
                    <nav class="mt-3 space-y-1 text-xs">
                        <!-- 1. Leads & Submissions -->
                        <a href="{{ route('admin.leads.index') }}" 
                           class="flex items-center justify-between px-3 py-2.5 rounded-xl transition font-semibold {{ request()->routeIs('admin.leads.*') ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' }}">
                            <div class="flex items-center space-x-2.5">
                                <svg class="w-4 h-4 {{ request()->routeIs('admin.leads.*') ? 'text-amber-400' : 'text-slate-400' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                                <span>Leads & Submissions</span>
                            </div>
                            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold {{ request()->routeIs('admin.leads.*') ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600' }}">
                                {{ $sidebarTotalLeads ?? 17 }}
                            </span>
                        </a>

                        <!-- 2. Investment Products -->
                        <a href="{{ route('admin.settings.index', ['tab' => 'investment_options']) }}" 
                           class="flex items-center justify-between px-3 py-2.5 rounded-xl transition font-medium {{ request()->query('tab') === 'investment_options' ? 'bg-[#0F172A] text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' }}">
                            <div class="flex items-center space-x-2.5">
                                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                <span>Investment Products</span>
                            </div>
                            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">3</span>
                        </a>

                        <!-- 3. Quiz Configuration -->
                        <a href="{{ route('admin.settings.index', ['tab' => 'quiz_questions']) }}" 
                           class="flex items-center justify-between px-3 py-2.5 rounded-xl transition font-medium {{ (request()->routeIs('admin.settings.index') && (request()->query('tab') === 'quiz_questions' || !request()->query('tab'))) ? 'bg-[#0F172A] text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' }}">
                            <div class="flex items-center space-x-2.5">
                                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                <span>Quiz Configuration</span>
                            </div>
                            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                                {{ $sidebarQuestionsCount ?? 7 }} Qs
                            </span>
                        </a>

                        <!-- 4. Testimonials -->
                        <a href="{{ route('admin.settings.index', ['tab' => 'testimonials']) }}" 
                           class="flex items-center justify-between px-3 py-2.5 rounded-xl transition font-medium {{ request()->query('tab') === 'testimonials' ? 'bg-[#0F172A] text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' }}">
                            <div class="flex items-center space-x-2.5">
                                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                                <span>Testimonials</span>
                            </div>
                            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                                {{ $sidebarTestimonialsCount ?? 4 }}
                            </span>
                        </a>

                        <!-- 5. Why First Capital -->
                        <a href="{{ route('admin.settings.index', ['tab' => 'why_first_capital']) }}" 
                           class="flex items-center justify-between px-3 py-2.5 rounded-xl transition font-medium {{ request()->query('tab') === 'why_first_capital' ? 'bg-[#0F172A] text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' }}">
                            <div class="flex items-center space-x-2.5">
                                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                                <span>Why First Capital</span>
                            </div>
                            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {{ $sidebarReasonsCount ?? 4 }}/8
                            </span>
                        </a>

                        <!-- 6. Settings & Logs / Security -->
                        <a href="{{ route('admin.settings.system') }}" 
                           class="flex items-center justify-between px-3 py-2.5 rounded-xl transition font-medium {{ request()->routeIs('admin.settings.system') ? 'bg-[#0F172A] text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' }}">
                            <div class="flex items-center space-x-2.5">
                                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                <span>Settings & Logs</span>
                            </div>
                        </a>

                        @if(Auth::user()->isSuperAdmin())
                        <!-- 7. Administrator Accounts -->
                        <a href="{{ route('admin.users.index') }}" 
                           class="flex items-center justify-between px-3 py-2.5 rounded-xl transition font-medium {{ request()->routeIs('admin.users.*') ? 'bg-[#0F172A] text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' }}">
                            <div class="flex items-center space-x-2.5">
                                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                <span>Administrators</span>
                            </div>
                            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                                {{ $sidebarAdminCount ?? 1 }}
                            </span>
                        </a>
                        @endif

                        <!-- 8. My Profile -->
                        <a href="{{ route('admin.profile') }}" 
                           class="flex items-center justify-between px-3 py-2.5 rounded-xl transition font-medium {{ request()->routeIs('admin.profile') ? 'bg-[#0F172A] text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' }}">
                            <div class="flex items-center space-x-2.5">
                                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                <span>My Profile</span>
                            </div>
                        </a>
                    </nav>

                    <!-- Add Manual Lead Button -->
                    <div class="pt-4 mt-3 border-t border-slate-100">
                        <button type="button" onclick="window.triggerOpenManualLeadModal ? window.triggerOpenManualLeadModal() : window.location.href='{{ route('admin.leads.index') }}#add-lead'"
                                class="w-full py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs">
                            <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            <span>Add Manual Lead</span>
                        </button>
                    </div>
                </div>
            </aside>

            <!-- RIGHT MAIN CONTENT -->
            <main class="flex-1 min-w-0 w-full space-y-5">
                <!-- Notifications -->
                @if(session('success'))
                <div class="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
                    <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        <span>{{ session('success') }}</span>
                    </div>
                </div>
                @endif

                @if(session('error'))
                <div class="flex items-center justify-between p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold shadow-xs">
                    <div class="flex items-center space-x-2">
                        <svg class="w-4 h-4 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        <span>{{ session('error') }}</span>
                    </div>
                </div>
                @endif

                @if($errors->any())
                <div class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs shadow-xs">
                    <ul class="list-disc list-inside space-y-1">
                        @foreach($errors->all() as $err)
                            <li>{{ $err }}</li>
                        @endforeach
                    </ul>
                </div>
                @endif

                <!-- Yield Specific Page Content -->
                @yield('content')
            </main>
        </div>
    </div>

    <!-- Minimal Light Footer -->
    <footer class="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500 mt-auto">
        <div class="max-w-[1600px] mx-auto px-4 flex items-center justify-center">
            <span>&copy; {{ date('Y') }} First Capital Holdings PLC. Licensed & Regulated by SEC Sri Lanka.</span>
        </div>
    </footer>

    @stack('scripts')
</body>
</html>
