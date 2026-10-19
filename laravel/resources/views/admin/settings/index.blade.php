@extends('layouts.admin')

@section('title', 'Investor Persona Scoring & Questions')

@section('content')
@php
    $allowedTabs = ['quiz_questions', 'quiz_results', 'investment_options', 'testimonials', 'why_first_capital'];
    $rawTab = request('tab', 'quiz_questions');
    if ($rawTab === 'investment_products') {
        $rawTab = 'investment_options';
    }
    $currentTab = in_array($rawTab, $allowedTabs) ? $rawTab : 'quiz_questions';

    $questions = $settings['quiz_questions'] ?? [];
    $results = $settings['quiz_results'] ?? [];
    $investmentProducts = $settings['investment_products'] ?? [];
    $testimonials = $settings['testimonials'] ?? [];
    $whyReasons = $settings['why_first_capital'] ?? [];

    $personaNames = [
        'A' => 'The Keep-It-Cool Investor',
        'B' => 'The Smooth Operator',
        'C' => 'The Patient Player',
        'D' => 'The Opportunity Hunter',
    ];
@endphp

<div class="space-y-6 max-w-6xl mx-auto">
    <!-- Top Segmented Navigation Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-2">
            <!-- 1. Questions & Scoring Tab -->
            <button type="button" onclick="switchSettingsTab('quiz_questions')" id="tab-btn-quiz_questions"
                    class="settings-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 {{ $currentTab === 'quiz_questions' ? 'bg-[#131F2E] text-amber-400 shadow-sm' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200' }}">
                <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Questions &amp; Scoring ({{ count($questions) }})
            </button>

            <!-- 2. Quiz Result Profiles Tab -->
            <button type="button" onclick="switchSettingsTab('quiz_results')" id="tab-btn-quiz_results"
                    class="settings-tab-btn px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 {{ $currentTab === 'quiz_results' ? 'bg-[#131F2E] text-amber-400 shadow-sm' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200' }}">
                <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                Quiz Result Profiles ({{ count($results) }})
            </button>

            <!-- 3. Investment Products Tab -->
            <button type="button" onclick="switchSettingsTab('investment_options')" id="tab-btn-investment_options"
                    class="settings-tab-btn px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 {{ $currentTab === 'investment_options' ? 'bg-[#131F2E] text-amber-400 shadow-sm' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200' }}">
                <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                Investment Products ({{ count($investmentProducts) }})
            </button>

            <!-- 4. Testimonials Tab -->
            <button type="button" onclick="switchSettingsTab('testimonials')" id="tab-btn-testimonials"
                    class="settings-tab-btn px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 {{ $currentTab === 'testimonials' ? 'bg-[#131F2E] text-amber-400 shadow-sm' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200' }}">
                <svg class="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                Testimonials ({{ count($testimonials) }})
            </button>

            <!-- 5. Why First Capital Tab -->
            <button type="button" onclick="switchSettingsTab('why_first_capital')" id="tab-btn-why_first_capital"
                    class="settings-tab-btn px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 {{ $currentTab === 'why_first_capital' ? 'bg-[#131F2E] text-amber-400 shadow-sm' : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200' }}">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Why First Capital ({{ count($whyReasons) }})
            </button>
        </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 1: QUESTIONS & SCORING WITH WEIGHTS (MATCHING EXACT SCREENSHOT)       -->
    <!-- ========================================================================= -->
    <div id="tab-content-quiz_questions" class="settings-tab-content space-y-6 {{ $currentTab === 'quiz_questions' ? '' : 'hidden' }}">
        <!-- Section Header with Restore Defaults & Add New Question Buttons -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 class="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">Investor Persona Scoring &amp; Questions</h1>
                <p class="text-xs text-slate-500 mt-0.5">Add, edit, and configure investor profiling questions and answer mappings ({{ count($questions) }} active questions)</p>
            </div>

            <div class="flex items-center gap-2.5 self-start sm:self-auto">
                <!-- Restore Defaults Button -->
                <form method="POST" action="{{ route('admin.settings.update') }}" onsubmit="return confirm('Restore all questions and persona scoring weights to standard defaults?');">
                    @csrf
                    <input type="hidden" name="setting_key" value="quiz_questions">
                    <input type="hidden" name="editor_mode" value="visual">
                    <input type="hidden" name="sub_action" value="restore_defaults">
                    <input type="hidden" name="active_tab" value="quiz_questions">
                    <button type="submit" 
                            class="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition">
                        <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                        Restore Defaults
                    </button>
                </form>

                <!-- + Add New Question Button -->
                <button type="button" onclick="openAddQuestionModal()" 
                        class="px-4 py-2 rounded-xl bg-[#F4B41A] hover:bg-[#E5A817] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    + Add New Question
                </button>
            </div>
        </div>

        <!-- Question Cards Stack -->
        <div class="space-y-5">
            @foreach($questions as $idx => $q)
            @php
                $qNum = $idx + 1;
                $qId = $q['id'] ?? $qNum;
                $options = $q['options'] ?? [];
                $optionsByKey = [];
                foreach ($options as $opt) {
                    $k = $opt['key'] ?? '';
                    $optionsByKey[$k] = $opt;
                }
            @endphp
            <div id="q-card-{{ $qId }}" class="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4 transition hover:border-slate-300">
                <!-- Question Card Header -->
                <div class="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div class="flex items-start gap-3">
                        <!-- Black Circle with White Number -->
                        <div class="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center font-mono shrink-0 mt-0.5">
                            {{ $qNum }}
                        </div>
                        <div>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">QUESTION #{{ $qNum }}</span>
                            <h3 class="text-sm sm:text-base font-bold text-slate-900 mt-0.5 leading-snug">
                                {{ $q['question'] ?? '' }}
                            </h3>
                        </div>
                    </div>

                    <!-- Actions (Edit & Delete) -->
                    <div class="flex items-center gap-1.5 shrink-0">
                        <!-- Edit Button -->
                        <button type="button" onclick="openEditQuestionModal({{ $qId }})" 
                                class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition">
                            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            <span>Edit</span>
                        </button>

                        <!-- Delete Button -->
                        <form method="POST" action="{{ route('admin.settings.update') }}" onsubmit="return confirm('Permanently remove Question #{{ $qNum }}?');" class="inline">
                            @csrf
                            <input type="hidden" name="setting_key" value="quiz_questions">
                            <input type="hidden" name="editor_mode" value="visual">
                            <input type="hidden" name="sub_action" value="delete_question">
                            <input type="hidden" name="delete_question_id" value="{{ $qId }}">
                            <input type="hidden" name="active_tab" value="quiz_questions">
                            <button type="submit" class="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition" title="Delete Question">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </form>
                    </div>
                </div>

                <!-- 2x2 Answer Choices Grid with Weights -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    @foreach(['A', 'B', 'C', 'D'] as $optKey)
                    @php
                        $opt = $optionsByKey[$optKey] ?? [];
                        $optText = $opt['text'] ?? '';
                        $weightKey = strtoupper($opt['weight'] ?? $optKey);
                        $personaName = $personaNames[$weightKey] ?? $personaNames['A'];
                    @endphp
                    <div class="bg-slate-50/50 border border-slate-200/80 rounded-xl p-3.5 flex items-start gap-3">
                        <!-- Square Letter Box -->
                        <div class="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-xs font-bold font-mono text-slate-700 shrink-0 mt-0.5 shadow-2xs">
                            {{ $optKey }}
                        </div>
                        <div class="flex-1">
                            <p class="text-xs font-medium text-slate-800 leading-snug">
                                {{ $optText }}
                            </p>
                            <!-- Weights Badge matching uploaded image -->
                            <div class="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50/80 text-blue-700 border border-blue-200/80 font-sans">
                                Weights: {{ $personaName }} ({{ $weightKey }})
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>
            @endforeach
        </div>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 2: QUIZ RESULT PROFILES (4 INVESTOR PERSONALITIES)                    -->
    <!-- ========================================================================= -->
    <div id="tab-content-quiz_results" class="settings-tab-content space-y-6 {{ $currentTab === 'quiz_results' ? '' : 'hidden' }}">
        <form method="POST" action="{{ route('admin.settings.update') }}" class="space-y-5">
            @csrf
            <input type="hidden" name="setting_key" value="quiz_results">
            <input type="hidden" name="editor_mode" value="visual">
            <input type="hidden" name="active_tab" value="quiz_results">

            <!-- Control Bar -->
            <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
                <div>
                    <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
                        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        4 Investor Personalities &amp; Regulated Products
                    </h2>
                    <p class="text-xs text-slate-500 mt-0.5">Customize profile names, investment styles, matched SEC-regulated products, and guide links.</p>
                </div>
                <button type="submit" class="px-5 py-2 rounded-xl bg-[#F4B41A] hover:bg-[#E5A817] text-slate-950 font-bold text-xs transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Save All Personalities
                </button>
            </div>

            <!-- Personality Cards Grid (2x2) -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                @foreach(['A', 'B', 'C', 'D'] as $key)
                @php
                    $p = $results[$key] ?? [];
                    $accentMap = [
                        'A' => ['border' => 'border-emerald-200', 'badge' => 'bg-emerald-50 text-emerald-700 border-emerald-200', 'title' => 'The Keep-It-Cool Investor'],
                        'B' => ['border' => 'border-blue-200', 'badge' => 'bg-blue-50 text-blue-700 border-blue-200', 'title' => 'The Smooth Operator'],
                        'C' => ['border' => 'border-purple-200', 'badge' => 'bg-purple-50 text-purple-700 border-purple-200', 'title' => 'The Patient Player'],
                        'D' => ['border' => 'border-amber-200', 'badge' => 'bg-amber-50 text-amber-800 border-amber-200', 'title' => 'The Opportunity Hunter'],
                    ];
                    $cfg = $accentMap[$key];
                @endphp
                <div class="bg-white border {{ $cfg['border'] }} rounded-2xl p-5 shadow-xs space-y-4">
                    <!-- Profile Header -->
                    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-0.5 rounded-lg font-mono font-bold text-xs border {{ $cfg['badge'] }}">
                                Profile {{ $key }} ({{ $p['number'] ?? '0' . (ord($key)-64) }})
                            </span>
                            <span class="text-xs font-bold text-slate-900 font-display">{{ $p['name'] ?? $cfg['title'] }}</span>
                        </div>
                        <input type="hidden" name="profiles[{{ $key }}][number]" value="{{ $p['number'] ?? '0' . (ord($key)-64) }}">
                        <span class="text-[10px] text-slate-400 font-mono">Code: {{ $key }}</span>
                    </div>

                    <!-- Name & Style -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Personality Name:</label>
                            <input type="text" name="profiles[{{ $key }}][name]" value="{{ $p['name'] ?? '' }}"
                                   class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-400 transition" required>
                        </div>
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Investment Style Tag:</label>
                            <input type="text" name="profiles[{{ $key }}][style]" value="{{ $p['style'] ?? '' }}"
                                   class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:border-amber-400 transition" required>
                        </div>
                    </div>

                    <!-- Matched Product -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Matched Product (Full):</label>
                            <input type="text" name="profiles[{{ $key }}][product]" value="{{ $p['product'] ?? '' }}"
                                   class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[#002D62] font-bold focus:bg-white focus:outline-none focus:border-amber-400 transition" required>
                        </div>
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Product Short Name:</label>
                            <input type="text" name="profiles[{{ $key }}][productShort]" value="{{ $p['productShort'] ?? '' }}"
                                   class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:border-amber-400 transition" required>
                        </div>
                    </div>

                    <!-- Category & Vibe -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Category Type:</label>
                            <select name="profiles[{{ $key }}][productOptionId]" 
                                    class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:border-amber-400 transition">
                                <option value="unit-trust" {{ ($p['productOptionId'] ?? '') === 'unit-trust' ? 'selected' : '' }}>Unit Trust Fund</option>
                                <option value="gov-securities" {{ ($p['productOptionId'] ?? '') === 'gov-securities' ? 'selected' : '' }}>Government Securities / Treasury</option>
                                <option value="equities" {{ ($p['productOptionId'] ?? '') === 'equities' ? 'selected' : '' }}>Stockbroking / Equities</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Campaign Vibe / Hook Phrase:</label>
                            <input type="text" name="profiles[{{ $key }}][vibe]" value="{{ $p['vibe'] ?? '' }}"
                                   class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white focus:outline-none focus:border-amber-400 transition">
                        </div>
                    </div>

                    <!-- Description -->
                    <div>
                        <label class="block text-[11px] font-semibold text-slate-700 mb-1">Personality Profile Description:</label>
                        <textarea name="profiles[{{ $key }}][description]" rows="2"
                                  class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:border-amber-400 transition" required>{{ $p['description'] ?? '' }}</textarea>
                    </div>

                    <!-- Regulatory Disclaimer -->
                    <div>
                        <label class="block text-[11px] font-semibold text-slate-700 mb-1">SEC Regulatory Disclaimer:</label>
                        <textarea name="profiles[{{ $key }}][productDisclaimer]" rows="2"
                                  class="w-full text-[11px] p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 focus:bg-white focus:outline-none focus:border-amber-400 transition">{{ $p['productDisclaimer'] ?? '' }}</textarea>
                    </div>

                    <!-- Procedure Guide PDF -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Guide Document Label:</label>
                            <input type="text" name="profiles[{{ $key }}][procedureGuide][label]" value="{{ $p['procedureGuide']['label'] ?? 'Procedure-Guide.pdf' }}"
                                   class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white focus:outline-none focus:border-amber-400 transition">
                        </div>
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Guide Download URL:</label>
                            <input type="url" name="profiles[{{ $key }}][procedureGuide][url]" value="{{ $p['procedureGuide']['url'] ?? '' }}"
                                   class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white focus:outline-none focus:border-amber-400 transition" placeholder="https://firstcapital.lk/...">
                        </div>
                    </div>
                </div>
                @endforeach
            </div>

            <div class="flex justify-end pt-3">
                <button type="submit" class="px-6 py-2.5 rounded-xl bg-[#F4B41A] hover:bg-[#E5A817] text-slate-950 font-bold text-xs transition shadow-xs flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Save All Personality Outcomes
                </button>
            </div>
        </form>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 3: INVESTMENT PRODUCTS (VISUAL CARDS & EDITORS)                       -->
    <!-- ========================================================================= -->
    <div id="tab-content-investment_options" class="settings-tab-content space-y-6 {{ $currentTab === 'investment_options' ? '' : 'hidden' }}">
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
            <div>
                <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#F4B41A]"></span>
                    Investment Products &amp; Educational Resources
                </h2>
                <p class="text-xs text-slate-500 mt-0.5">Manage the 3 wealth products featured in the campaign, including procedure guides, video explainers, and regulatory disclaimers.</p>
            </div>
        </div>

        <form method="POST" action="{{ route('admin.settings.update') }}" class="space-y-6">
            @csrf
            <input type="hidden" name="setting_key" value="investment_products">
            <input type="hidden" name="editor_mode" value="visual">
            <input type="hidden" name="active_tab" value="investment_options">

            <div class="grid grid-cols-1 gap-6">
                @foreach($investmentProducts as $idx => $prod)
                @php
                    $pId = $prod['id'] ?? ('prod-' . ($idx + 1));
                    $tagsString = is_array($prod['tags'] ?? null) ? implode(', ', $prod['tags']) : ($prod['tags'] ?? '');
                @endphp
                <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                        <div class="flex items-center gap-3">
                            <span class="w-8 h-8 rounded-xl bg-[#131F2E] text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
                                {{ $prod['number'] ?? sprintf('%02d', $idx + 1) }}
                            </span>
                            <div>
                                <h3 class="text-base font-bold text-slate-900 font-display">{{ $prod['title'] ?? 'Product' }}</h3>
                                <span class="font-mono text-[10px] text-slate-400">ID: {{ $pId }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <!-- Left Column: Title & Description -->
                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Product Title</label>
                                <input type="text" name="products[{{ $pId }}][title]" value="{{ $prod['title'] ?? '' }}"
                                       class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-400 transition" required>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Feature Badges / Highlights (comma-separated)</label>
                                <input type="text" name="products[{{ $pId }}][tags]" value="{{ $tagsString }}"
                                       placeholder="e.g. 3 Fund Choices, From LKR 1,000, High Liquidity"
                                       class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:border-amber-400 transition">
                                <p class="text-[10px] text-slate-400 mt-1">Separate badges with commas.</p>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Product Description / Short Copy</label>
                                <textarea name="products[{{ $pId }}][shortCopy]" rows="4"
                                          class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:border-amber-400 transition" required>{{ $prod['shortCopy'] ?? '' }}</textarea>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Regulatory / Product Disclaimer</label>
                                <textarea name="products[{{ $pId }}][disclaimer]" rows="3"
                                          class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 focus:bg-white focus:outline-none focus:border-amber-400 transition">{{ $prod['disclaimer'] ?? '' }}</textarea>
                            </div>
                        </div>

                        <!-- Right Column: Explainer Video & Procedure Guide PDF -->
                        <div class="space-y-4">
                            <!-- Explainer Video Card -->
                            <div class="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                                <h4 class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <svg class="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    Explainer Video
                                </h4>

                                <div>
                                    <label class="block text-[11px] font-medium text-slate-600 mb-1">Video Title / Caption</label>
                                    <input type="text" name="products[{{ $pId }}][video][title]" value="{{ $prod['video']['title'] ?? '' }}"
                                           placeholder="Learn more about this product"
                                           class="w-full text-xs p-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-400 transition">
                                </div>

                                <div class="grid grid-cols-3 gap-2">
                                    <div class="col-span-2">
                                        <label class="block text-[11px] font-medium text-slate-600 mb-1">Video URL (TikTok / YouTube)</label>
                                        <input type="url" name="products[{{ $pId }}][video][url]" value="{{ $prod['video']['url'] ?? '' }}"
                                               placeholder="https://..."
                                               class="w-full text-xs p-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-400 transition">
                                    </div>
                                    <div>
                                        <label class="block text-[11px] font-medium text-slate-600 mb-1">Platform</label>
                                        <select name="products[{{ $pId }}][video][platform]"
                                                class="w-full text-xs p-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-400 transition">
                                            <option value="YouTube" {{ ($prod['video']['platform'] ?? '') === 'YouTube' ? 'selected' : '' }}>YouTube</option>
                                            <option value="TikTok" {{ ($prod['video']['platform'] ?? '') === 'TikTok' ? 'selected' : '' }}>TikTok</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- Procedure Guide PDF Card -->
                            <div class="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3">
                                <h4 class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <svg class="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                                    Procedure Guide (Downloadable PDF)
                                </h4>

                                <div>
                                    <label class="block text-[11px] font-medium text-slate-600 mb-1">Guide Label / Filename</label>
                                    <input type="text" name="products[{{ $pId }}][guideLabel]" value="{{ $prod['guideLabel'] ?? '' }}"
                                           placeholder="Procedure-Guide.pdf"
                                           class="w-full text-xs p-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-400 transition">
                                </div>

                                <div>
                                    <label class="block text-[11px] font-medium text-slate-600 mb-1">Direct PDF URL</label>
                                    <input type="url" name="products[{{ $pId }}][guideUrl]" value="{{ $prod['guideUrl'] ?? '' }}"
                                           placeholder="https://firstcapital.lk/wp-content/uploads/..."
                                           class="w-full text-xs p-2 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-400 transition">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>

            <div class="flex justify-end pt-3">
                <button type="submit" class="px-6 py-2.5 rounded-xl bg-[#F4B41A] hover:bg-[#E5A817] text-slate-950 font-bold text-xs transition shadow-xs flex items-center gap-2 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Save All Investment Products
                </button>
            </div>
        </form>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 3: TESTIMONIALS (VISUAL FORM)                                          -->
    <!-- ========================================================================= -->
    <!-- ========================================================================= -->
    <!-- TAB 3: TESTIMONIALS (VISUAL CARDS & GRID)                                  -->
    <!-- ========================================================================= -->
    <div id="tab-content-testimonials" class="settings-tab-content space-y-6 {{ $currentTab === 'testimonials' ? '' : 'hidden' }}">
        <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
            <div>
                <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#F4B41A]"></span>
                    Client Testimonials &amp; Social Proof
                </h2>
                <p class="text-xs text-slate-500 mt-0.5">Real investor stories displayed on campaign landing pages.</p>
            </div>
            <button type="button" onclick="openAddTestimonialModal()" class="px-5 py-2 rounded-xl bg-[#F4B41A] hover:bg-[#E5A817] text-slate-950 font-bold text-xs transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                Add New Testimonial
            </button>
        </div>

        @if(count($testimonials) === 0)
        <div class="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
            <div class="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            </div>
            <h3 class="text-sm font-bold text-slate-800">No testimonials configured yet</h3>
            <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Add client reviews and ratings to feature them as social proof on your campaign sliders.</p>
            <button type="button" onclick="openAddTestimonialModal()" class="mt-4 px-4 py-2 rounded-xl bg-[#F4B41A] hover:bg-[#E5A817] text-slate-950 font-bold text-xs transition">
                + Add First Testimonial
            </button>
        </div>
        @else
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            @foreach($testimonials as $idx => $t)
            @php
                $name = trim($t['name'] ?? 'Investor');
                $nameParts = array_values(array_filter(explode(' ', $name)));
                if (count($nameParts) >= 2) {
                    $initials = strtoupper(substr($nameParts[0], 0, 1) . substr($nameParts[1], 0, 1));
                } elseif (count($nameParts) === 1) {
                    $initials = strtoupper(substr($nameParts[0], 0, min(2, strlen($nameParts[0]))));
                } else {
                    $initials = 'FC';
                }
                $isLive = ($t['status'] ?? 'Active') === 'Active' && (!isset($t['visible']) || $t['visible'] !== false);
                $rating = max(1, min(5, (int)($t['rating'] ?? 5)));
                
                $rawDate = $t['createdAt'] ?? null;
                $dateDisplay = '13/10/2026';
                if ($rawDate) {
                    try {
                        $dateDisplay = \Carbon\Carbon::parse($rawDate)->format('d/m/Y');
                    } catch (\Throwable $e) {
                        $dateDisplay = '13/10/2026';
                    }
                }
            @endphp
            <div class="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition">
                <div>
                    <!-- Top Row: Avatar + Name/Role on left, Live/Draft Badge on right -->
                    <div class="flex items-start justify-between gap-3 mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-11 h-11 rounded-xl bg-[#131F2E] text-amber-400 font-bold flex items-center justify-center text-sm font-mono tracking-wider shrink-0 shadow-xs">
                                {{ $initials }}
                            </div>
                            <div>
                                <h4 class="text-sm font-bold text-slate-900 leading-snug font-display">{{ $t['name'] ?? 'Investor' }}</h4>
                                <p class="text-xs text-slate-500 leading-normal">{{ $t['role'] ?? 'Client' }}</p>
                            </div>
                        </div>

                        <!-- Status Pill Form: Toggle between Live on Site and Draft -->
                        <form method="POST" action="{{ route('admin.settings.update') }}" class="inline">
                            @csrf
                            <input type="hidden" name="setting_key" value="testimonials">
                            <input type="hidden" name="editor_mode" value="visual">
                            <input type="hidden" name="sub_action" value="toggle_testimonial_status">
                            <input type="hidden" name="active_tab" value="testimonials">
                            <input type="hidden" name="testimonial_id" value="{{ $t['id'] ?? '' }}">
                            @if($isLive)
                                <button type="submit" title="Click to change to Draft" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F8F0] text-[#1E7E51] border border-[#BCE8D0] hover:bg-[#d8f3e5] transition cursor-pointer">
                                    <span class="w-2 h-2 rounded-full bg-[#1E7E51]"></span>
                                    Live on Site
                                </button>
                            @else
                                <button type="submit" title="Click to change to Live on Site" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF7EC] text-[#B45309] border border-[#FDE68A] hover:bg-[#fef0d7] transition cursor-pointer">
                                    <span class="w-2 h-2 rounded-full border border-[#B45309]"></span>
                                    Draft
                                </button>
                            @endif
                        </form>
                    </div>

                    <!-- Stars Row: 5 amber stars + numerical 5.0 -->
                    <div class="flex items-center gap-1 text-amber-400 my-2.5">
                        @for($s = 1; $s <= 5; $s++)
                            <svg class="w-4 h-4 {{ $s <= $rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-slate-200 text-slate-200' }}" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
                            </svg>
                        @endfor
                        <span class="text-xs font-bold text-slate-600 ml-1.5 font-mono">{{ number_format($rating, 1) }}</span>
                    </div>

                    <!-- Quote Box: rounded-xl, light background, quotation mark icon in top right, italic quote -->
                    <div class="bg-slate-50/80 border border-slate-200/70 rounded-xl p-4 relative mb-4">
                        <svg class="absolute top-3 right-3 w-5 h-5 text-slate-300 pointer-events-none fill-current" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                        </svg>
                        <p class="text-xs text-slate-700 italic leading-relaxed pr-6">&ldquo;{{ $t['quote'] ?? '' }}&rdquo;</p>
                    </div>
                </div>

                <!-- Footer: Added date on left, Edit & Delete buttons on right -->
                <div class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span class="text-slate-400 font-medium">Added {{ $dateDisplay }}</span>

                    <div class="flex items-center gap-2">
                        <!-- Edit Button -->
                        <button type="button" onclick="openEditTestimonialModal('{{ $t['id'] ?? '' }}')"
                                class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition shadow-xs flex items-center gap-1.5 cursor-pointer">
                            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            Edit
                        </button>

                        <!-- Delete Button -->
                        <form method="POST" action="{{ route('admin.settings.update') }}" onsubmit="return confirm('Are you sure you want to permanently delete this testimonial from the database?')" class="inline">
                            @csrf
                            <input type="hidden" name="setting_key" value="testimonials">
                            <input type="hidden" name="editor_mode" value="visual">
                            <input type="hidden" name="sub_action" value="delete_testimonial">
                            <input type="hidden" name="active_tab" value="testimonials">
                            <input type="hidden" name="delete_testimonial_id" value="{{ $t['id'] ?? '' }}">
                            <button type="submit" title="Delete testimonial" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition border border-transparent hover:border-rose-200 cursor-pointer">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            @endforeach
        </div>
        @endif
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 4: WHY FIRST CAPITAL (VISUAL FORM)                                     -->
    <!-- ========================================================================= -->
    <div id="tab-content-why_first_capital" class="settings-tab-content space-y-6 {{ $currentTab === 'why_first_capital' ? '' : 'hidden' }}">
        <form method="POST" action="{{ route('admin.settings.update') }}" class="space-y-5">
            @csrf
            <input type="hidden" name="setting_key" value="why_first_capital">
            <input type="hidden" name="editor_mode" value="visual">
            <input type="hidden" name="active_tab" value="why_first_capital">

            <div class="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
                <div>
                    <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
                        <span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                        Why First Capital (Value Propositions)
                    </h2>
                    <p class="text-xs text-slate-500 mt-0.5">8 key differentiators highlighted on campaign landing pages.</p>
                </div>
                <button type="submit" class="px-5 py-2 rounded-xl bg-[#F4B41A] hover:bg-[#E5A817] text-slate-950 font-bold text-xs transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Save Value Propositions
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @foreach($whyReasons as $idx => $r)
                <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                    <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span class="text-xs font-bold text-purple-700 font-mono">#{{ $idx + 1 }} {{ $r['title'] ?? '' }}</span>
                        <input type="hidden" name="reasons[{{ $idx }}][id]" value="{{ $r['id'] ?? ('reason-' . ($idx + 1)) }}">
                        <input type="hidden" name="reasons[{{ $idx }}][order]" value="{{ $r['order'] ?? ($idx + 1) }}">
                        <label class="inline-flex items-center gap-1.5 text-[11px] text-slate-700 cursor-pointer font-medium">
                            <input type="checkbox" name="reasons[{{ $idx }}][visible]" value="1" {{ !empty($r['visible']) ? 'checked' : '' }}
                                   class="rounded border-slate-300 text-amber-500 focus:ring-amber-400">
                            Active
                        </label>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div class="sm:col-span-2">
                            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Headline:</label>
                            <input type="text" name="reasons[{{ $idx }}][title]" value="{{ $r['title'] ?? '' }}"
                                   class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-400 transition" required>
                        </div>
                        <div>
                            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Icon:</label>
                            <input type="text" name="reasons[{{ $idx }}][icon]" value="{{ $r['icon'] ?? 'Sparkles' }}"
                                   class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-mono focus:bg-white focus:outline-none focus:border-amber-400 transition">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[11px] font-semibold text-slate-700 mb-1">Body Copy:</label>
                        <textarea name="reasons[{{ $idx }}][copy]" rows="2"
                                  class="w-full text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:border-amber-400 transition" required>{{ $r['copy'] ?? '' }}</textarea>
                    </div>
                </div>
                @endforeach
            </div>

            <div class="flex justify-end pt-3">
                <button type="submit" class="px-6 py-2.5 rounded-xl bg-[#F4B41A] hover:bg-[#E5A817] text-slate-950 font-bold text-xs transition shadow-xs flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    Save Value Propositions
                </button>
            </div>
        </form>
    </div>
</div>

<!-- ========================================================================= -->
<!-- EDIT / ADD QUESTION MODAL                                                 -->
<!-- ========================================================================= -->
<div id="questionModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs hidden">
    <div class="max-w-2xl w-full bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <form method="POST" action="{{ route('admin.settings.update') }}">
            @csrf
            <input type="hidden" name="setting_key" value="quiz_questions">
            <input type="hidden" name="editor_mode" value="visual">
            <input type="hidden" name="sub_action" value="save_single_question">
            <input type="hidden" name="active_tab" value="quiz_questions">
            <input type="hidden" id="modal_question_id" name="question_id" value="0">

            <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div>
                    <h3 id="modal_title" class="text-sm font-bold text-slate-900 font-display">Edit Question</h3>
                    <p class="text-xs text-slate-500 mt-0.5">Configure prompt text and answer choice personality weights</p>
                </div>
                <button type="button" onclick="closeQuestionModal()" class="text-slate-400 hover:text-slate-600 p-1 text-lg leading-none">&times;</button>
            </div>

            <div class="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
                <!-- Question Prompt -->
                <div>
                    <label class="block text-xs font-bold text-slate-800 mb-1.5">Question Prompt / Headline <span class="text-rose-500">*</span></label>
                    <textarea id="modal_question_prompt" name="question_prompt" rows="2" required
                              class="w-full text-xs p-3 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                              placeholder="e.g. You have some extra money sitting in your account. What's your first thought?"></textarea>
                </div>

                <!-- Answer Choices & Weights -->
                <div class="space-y-3 pt-2 border-t border-slate-100">
                    <span class="block text-xs font-bold text-slate-800">Answer Options &amp; Scoring Weights</span>

                    @foreach(['A', 'B', 'C', 'D'] as $optKey)
                    <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-xs font-mono text-slate-700">Option {{ $optKey }}</span>
                            <div class="flex items-center gap-2">
                                <label class="text-[11px] font-semibold text-slate-500">Scores toward:</label>
                                <select id="modal_opt_{{ $optKey }}_weight" name="option_{{ $optKey }}_weight" 
                                        class="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white text-slate-800 focus:border-amber-400">
                                    <option value="A">The Keep-It-Cool Investor (A)</option>
                                    <option value="B">The Smooth Operator (B)</option>
                                    <option value="C">The Patient Player (C)</option>
                                    <option value="D">The Opportunity Hunter (D)</option>
                                </select>
                            </div>
                        </div>
                        <textarea id="modal_opt_{{ $optKey }}_text" name="option_{{ $optKey }}_text" rows="2" required
                                  class="w-full text-xs p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-amber-400 transition"
                                  placeholder="Option text description..."></textarea>
                    </div>
                    @endforeach
                </div>
            </div>

            <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onclick="closeQuestionModal()" class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition text-xs">
                    Cancel
                </button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-[#F4B41A] hover:bg-[#E5A817] text-slate-950 font-bold text-xs transition shadow-xs">
                    Save Question
                </button>
            </div>
        </form>
    </div>
</div>

<!-- ========================================================================= -->
<!-- EDIT / ADD TESTIMONIAL MODAL                                              -->
<!-- ========================================================================= -->
<div id="testimonialModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs hidden">
    <div class="max-w-xl w-full bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <form method="POST" action="{{ route('admin.settings.update') }}">
            @csrf
            <input type="hidden" name="setting_key" value="testimonials">
            <input type="hidden" name="editor_mode" value="visual">
            <input type="hidden" name="sub_action" value="save_single_testimonial">
            <input type="hidden" name="active_tab" value="testimonials">
            <input type="hidden" id="modal_testimonial_id" name="testimonial_id" value="0">

            <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div>
                    <h3 id="modal_test_title" class="text-sm font-bold text-slate-900 font-display">Edit Testimonial</h3>
                    <p class="text-xs text-slate-500 mt-0.5">Configure client review, star ratings, and site visibility.</p>
                </div>
                <button type="button" onclick="closeTestimonialModal()" class="text-slate-400 hover:text-slate-600 p-1 text-lg leading-none cursor-pointer">&times;</button>
            </div>

            <div class="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                        <label class="block text-xs font-bold text-slate-800 mb-1.5">Client Full Name <span class="text-rose-500">*</span></label>
                        <input type="text" id="modal_test_name" name="name" required
                               class="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                               placeholder="e.g. Achira Paranavithana">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-800 mb-1.5">Role / Designation <span class="text-rose-500">*</span></label>
                        <input type="text" id="modal_test_role" name="role" required
                               class="w-full text-xs p-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                               placeholder="e.g. Investor / First-time investor">
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                        <label class="block text-xs font-bold text-slate-800 mb-1.5">Star Rating <span class="text-rose-500">*</span></label>
                        <select id="modal_test_rating" name="rating"
                                class="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition">
                            <option value="5">★★★★★ 5.0 (5 Stars)</option>
                            <option value="4">★★★★☆ 4.0 (4 Stars)</option>
                            <option value="3">★★★☆☆ 3.0 (3 Stars)</option>
                            <option value="2">★★☆☆☆ 2.0 (2 Stars)</option>
                            <option value="1">★☆☆☆☆ 1.0 (1 Star)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-800 mb-1.5">Visibility / Status <span class="text-rose-500">*</span></label>
                        <select id="modal_test_status" name="status"
                                class="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition">
                            <option value="Active">● Live on Site (Visible on website)</option>
                            <option value="Draft">○ Draft (Hidden from visitors)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-800 mb-1.5">Testimonial Quote <span class="text-rose-500">*</span></label>
                    <textarea id="modal_test_quote" name="quote" rows="4" required
                              class="w-full text-xs p-3 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition leading-relaxed"
                              placeholder="e.g. I started stocks for the first time in Sri Lanka through First Capital..."></textarea>
                </div>
            </div>

            <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onclick="closeTestimonialModal()" class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition text-xs cursor-pointer">
                    Cancel
                </button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-[#F4B41A] hover:bg-[#E5A817] text-slate-950 font-bold text-xs transition shadow-xs cursor-pointer">
                    Save Testimonial
                </button>
            </div>
        </form>
    </div>
</div>

<script>
const QUESTIONS_DATA = @json($questions);
const TESTIMONIALS_DATA = @json($testimonials);

function switchSettingsTab(tabKey) {
    if (tabKey === 'investment_products') {
        tabKey = 'investment_options';
    }

    let activeBtn = document.getElementById('tab-btn-' + tabKey);
    let activeContent = document.getElementById('tab-content-' + tabKey);

    // Fallback to quiz_questions if tab element does not exist so screen is never blank
    if (!activeBtn || !activeContent) {
        tabKey = 'quiz_questions';
        activeBtn = document.getElementById('tab-btn-' + tabKey);
        activeContent = document.getElementById('tab-content-' + tabKey);
    }

    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
        btn.classList.remove('bg-[#131F2E]', 'text-amber-400', 'shadow-sm');
        btn.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
    });
    document.querySelectorAll('.settings-tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    if (activeBtn) {
        activeBtn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');
        activeBtn.classList.add('bg-[#131F2E]', 'text-amber-400', 'shadow-sm');
    }
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }

    const url = new URL(window.location);
    url.searchParams.set('tab', tabKey);
    window.history.replaceState({}, '', url);
}

function openEditQuestionModal(qId) {
    const q = QUESTIONS_DATA.find(item => Number(item.id) === Number(qId));
    if (!q) return;

    document.getElementById('modal_title').innerText = 'Edit Question #' + q.id;
    document.getElementById('modal_question_id').value = q.id;
    document.getElementById('modal_question_prompt').value = q.question || '';

    const optsMap = {};
    (q.options || []).forEach(opt => {
        optsMap[opt.key] = opt;
    });

    ['A', 'B', 'C', 'D'].forEach(key => {
        const opt = optsMap[key] || {};
        const textEl = document.getElementById('modal_opt_' + key + '_text');
        const weightEl = document.getElementById('modal_opt_' + key + '_weight');
        if (textEl) textEl.value = opt.text || '';
        if (weightEl) weightEl.value = opt.weight || key;
    });

    document.getElementById('questionModal').classList.remove('hidden');
}

function openAddQuestionModal() {
    const nextId = QUESTIONS_DATA.length + 1;
    document.getElementById('modal_title').innerText = 'Add New Question (#' + nextId + ')';
    document.getElementById('modal_question_id').value = '0';
    document.getElementById('modal_question_prompt').value = '';

    ['A', 'B', 'C', 'D'].forEach(key => {
        const textEl = document.getElementById('modal_opt_' + key + '_text');
        const weightEl = document.getElementById('modal_opt_' + key + '_weight');
        if (textEl) textEl.value = '';
        if (weightEl) weightEl.value = key;
    });

    document.getElementById('questionModal').classList.remove('hidden');
}

function closeQuestionModal() {
    document.getElementById('questionModal').classList.add('hidden');
}

function openAddTestimonialModal() {
    document.getElementById('modal_test_title').innerText = 'Add New Testimonial';
    document.getElementById('modal_testimonial_id').value = '0';
    document.getElementById('modal_test_name').value = '';
    document.getElementById('modal_test_role').value = '';
    document.getElementById('modal_test_rating').value = '5';
    document.getElementById('modal_test_status').value = 'Active';
    document.getElementById('modal_test_quote').value = '';
    document.getElementById('testimonialModal').classList.remove('hidden');
}

function openEditTestimonialModal(tId) {
    const t = TESTIMONIALS_DATA.find(item => String(item.id) === String(tId));
    if (!t) return;

    document.getElementById('modal_test_title').innerText = 'Edit Testimonial';
    document.getElementById('modal_testimonial_id').value = t.id || '0';
    document.getElementById('modal_test_name').value = t.name || '';
    document.getElementById('modal_test_role').value = t.role || '';
    document.getElementById('modal_test_rating').value = String(t.rating || 5);
    const isLive = (t.status === 'Active' || !t.status) && t.visible !== false;
    document.getElementById('modal_test_status').value = isLive ? 'Active' : 'Draft';
    document.getElementById('modal_test_quote').value = t.quote || '';
    document.getElementById('testimonialModal').classList.remove('hidden');
}

function closeTestimonialModal() {
    document.getElementById('testimonialModal').classList.add('hidden');
}
</script>
@endsection
