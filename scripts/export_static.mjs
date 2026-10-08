import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { build as viteBuild } from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import tailwindcssPlugin from '@tailwindcss/vite';
import tsconfigPathsPlugin from 'vite-tsconfig-paths';

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

// 1:1 Pixel-Perfect Interactive Quiz Modal matching QuizFlow.tsx exactly
const quizModalHtmlAndScript = `
<!-- Standalone Interactive Quiz Modal (1:1 with QuizFlow.tsx) -->
<div id="fck-quiz-modal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5" style="display:none;" aria-modal="true" role="dialog">
  <div class="relative w-full max-w-4xl max-h-[96vh] flex flex-col bg-white rounded-[28px] sm:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border-0 overflow-hidden font-sans">
    
    <!-- Modal Fixed Header with Close Button -->
    <div class="shrink-0 flex items-center justify-end px-5 sm:px-7 pt-3.5 pb-1 bg-white">
      <button id="fck-modal-close" type="button" aria-label="Close Quiz" class="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>

    <!-- Modal Scrollable Body -->
    <div class="flex-1 overflow-y-auto px-5 sm:px-8 py-6 no-scrollbar" style="scrollbar-width: none; -ms-overflow-style: none;">
      
      <!-- USER DETAILS CAPTURE FORM (After answering all questions) -->
      <div id="fck-step-details" class="animate-in fade-in duration-300 py-1 sm:py-2" style="display:none;">
        <div class="text-center max-w-xl mx-auto mb-7 sm:mb-8">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#142d27] text-xs font-bold mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 text-[#d4af15]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg> Almost Done!
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#142d27] tracking-tight mb-2">
            Tell us about yourself
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Please provide your details so we can calculate your investor personality match and reveal your personalized recommendations.
          </p>
        </div>

        <form id="fck-lead-form" class="max-w-md mx-auto space-y-4">
          <!-- Full Name -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <input
                type="text"
                id="fck-input-name"
                required
                placeholder="e.g. Ruwan Perera"
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white hover:border-slate-400 hover:shadow-sm focus:border-[#f1c91e] focus:bg-white focus:ring-4 focus:ring-[#f1c91e]/25 focus:shadow-md text-sm sm:text-base text-slate-800 placeholder:text-slate-400 shadow-xs transition-all focus:outline-none"
              />
            </div>
          </div>

          <!-- Gender Selection -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Gender <span class="text-rose-500">*</span>
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="fck-gender-male"
                class="flex items-center justify-center py-2.5 px-4 rounded-xl border-2 border-[#f1c91e] bg-[#f1c91e]/15 text-[#142d27] ring-2 ring-[#f1c91e]/40 font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
              >
                <span>Male</span>
              </button>
              <button
                type="button"
                id="fck-gender-female"
                class="flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
              >
                <span>Female</span>
              </button>
            </div>
            <input type="hidden" id="fck-input-gender" value="male" />
          </div>

          <!-- Email Address -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <input
                type="email"
                id="fck-input-email"
                required
                placeholder="e.g. ruwan@example.com"
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white hover:border-slate-400 hover:shadow-sm focus:border-[#f1c91e] focus:bg-white focus:ring-4 focus:ring-[#f1c91e]/25 focus:shadow-md text-sm sm:text-base text-slate-800 placeholder:text-slate-400 shadow-xs transition-all focus:outline-none"
              />
            </div>
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number <span class="text-rose-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <input
                type="tel"
                id="fck-input-phone"
                required
                placeholder="e.g. 077 123 4567"
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white hover:border-slate-400 hover:shadow-sm focus:border-[#f1c91e] focus:bg-white focus:ring-4 focus:ring-[#f1c91e]/25 focus:shadow-md text-sm sm:text-base text-slate-800 placeholder:text-slate-400 shadow-xs transition-all focus:outline-none"
              />
            </div>
          </div>

          <div id="fck-lead-error" class="hidden p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700"></div>

          <div class="pt-2">
            <button
              type="submit"
              class="w-full bg-[#f1c91e] hover:bg-[#e0b815] active:scale-[0.99] text-[#142d27] py-3.5 px-6 rounded-xl font-extrabold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Reveal My Investor Personality</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>

          <div class="mt-3 text-center">
            <button
              type="button"
              id="fck-details-back"
              class="text-xs text-slate-500 hover:text-slate-800 font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> Back to questions
            </button>
          </div>

          <!-- Small Disclaimer Section Under Start Quiz Button -->
          <div class="mt-6 pt-3.5 border-t border-slate-100 text-left">
            <p class="text-[10px] sm:text-[11px] leading-relaxed text-slate-400">
              <strong class="font-semibold text-slate-500">* Disclaimer: </strong>
              This quiz provides only a general indication of your investor profile and potentially suitable investment types. It does not consider your individual financial situation, objectives or needs. Please assess suitability based on your circumstances and seek professional advice where appropriate.
            </p>
          </div>
        </form>
      </div>

      <!-- STEP 1: QUESTION VIEW (Exact 2x2 grid & styling from QuizFlow.tsx) -->
      <div id="fck-step-question" class="animate-in fade-in duration-300 w-full" style="display:none;">
        
        <!-- Progress Bar -->
        <div class="w-full max-w-3xl mx-auto mb-6 sm:mb-8">
          <div class="w-full h-2 bg-slate-200/90 rounded-full overflow-hidden">
            <div id="fck-q-progress" class="h-full rounded-full transition-all duration-500 ease-out bg-[#f1c91e]" style="width: 14%;"></div>
          </div>
          <div class="mt-2 px-0.5 text-left">
            <span id="fck-q-counter" class="text-[11px] sm:text-xs font-bold text-slate-500 tracking-wider">01-07</span>
          </div>
        </div>

        <!-- Question Heading -->
        <div class="mb-6 sm:mb-8 text-center">
          <h2 id="fck-q-text" class="text-xl sm:text-2xl lg:text-[26px] font-bold text-[#142d27] tracking-tight leading-snug max-w-2xl mx-auto">
            Question text
          </h2>
        </div>

        <!-- 4 Options (2x2 grid on desktop!) -->
        <div id="fck-q-options" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-8">
          <!-- Populated dynamically with identical classes -->
        </div>

        <!-- Footer Navigation -->
        <div class="mt-8 sm:mt-10 pt-4 border-t border-slate-100">
          <div class="flex items-center justify-between">
            <button
              id="fck-q-back"
              type="button"
              class="text-slate-500 hover:text-slate-800 font-semibold px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer text-sm sm:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              <span>Back</span>
            </button>

            <button
              id="fck-q-next"
              type="button"
              disabled
              class="bg-[#f1c91e] hover:bg-[#e0b815] active:scale-[0.98] text-[#142d27] px-7 py-3 rounded-xl font-extrabold text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ml-auto"
            >
              <span id="fck-q-next-label">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>

          <!-- Small Disclaimer Under Next Button -->
          <div class="mt-6 pt-3.5 border-t border-slate-100 text-left">
            <p class="text-[10px] sm:text-[11px] leading-relaxed text-slate-400">
              <strong class="font-semibold text-slate-500">* Disclaimer: </strong>
              This quiz provides only a general indication of your investor profile and potentially suitable investment types. It does not consider your individual financial situation, objectives or needs. Please assess suitability based on your circumstances and seek professional advice where appropriate.
            </p>
          </div>
        </div>
      </div>

      <!-- STEP 2: LOADING SCREEN -->
      <div id="fck-step-loading" class="animate-in fade-in duration-300 py-14 sm:py-20 text-center max-w-md mx-auto" style="display:none;">
        <div class="relative size-20 mx-auto mb-6 flex items-center justify-center">
          <div class="absolute inset-0 rounded-full bg-amber-100 animate-ping opacity-35"></div>
          <div class="relative size-16 rounded-full bg-amber-50 border-2 border-[#f1c91e]/40 flex items-center justify-center shadow-xs">
            <svg class="size-8 text-[#d4af15] animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        </div>

        <h3 class="text-xl sm:text-2xl font-extrabold text-[#142d27] mb-2.5 tracking-tight">
          Finding your investor type…
        </h3>
        <p class="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          Evaluating your preferences and matching your profile with First Capital investment options.
        </p>

        <div class="w-48 h-1.5 bg-slate-100 rounded-full mx-auto mt-6 overflow-hidden">
          <div class="h-full bg-[#f1c91e] rounded-full animate-pulse w-full"></div>
        </div>
      </div>

      <!-- STEP 3: RESULTS SCREEN (Exact parity with QuizFlow.tsx) -->
      <div id="fck-step-result" class="animate-in fade-in duration-300 py-0.5 w-full text-left" style="display:none;">
        <div class="grid grid-cols-1 md:grid-cols-[225px_1fr] lg:grid-cols-[245px_1fr] gap-4 sm:gap-5 items-start">
          <!-- Left Column: Character Image Card + Disclaimer Box Underneath -->
          <div class="flex flex-col space-y-2.5 w-full max-w-[225px] lg:max-w-[245px] mx-auto md:mx-0">
            <!-- Character Image Card (Border snugly fits the image) -->
            <div class="w-full rounded-2xl sm:rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm bg-white">
              <img id="fck-res-avatar" src="" alt="Investor Personality" class="w-full h-auto block object-cover transition-transform duration-300 hover:scale-[1.02]" />
            </div>

            <!-- Disclaimer Section - Under the image on desktop -->
            <div class="hidden md:block bg-slate-50 border border-slate-200/90 rounded-xl p-2 sm:p-2.5 text-[8.5px] sm:text-[9.5px] leading-relaxed text-slate-500">
              <p>
                <strong class="font-bold text-slate-700">* Disclaimers: </strong>
                <span id="fck-res-disclaimer"></span>
                <a id="fck-res-guide-link" href="#" target="_blank" rel="noopener noreferrer" class="text-[#1a214c] hover:text-[#e0b815] underline font-semibold ml-1 inline-flex items-center gap-0.5 break-all transition-colors">
                  <span id="fck-res-guide-label"></span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-2.5 inline shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                </a>
              </p>
            </div>
          </div>

          <!-- Right Column: Personality Card, Suggested Match, Action Buttons -->
          <div class="space-y-3 text-left">
            <!-- Persona Card - Deep Navy #1a214c with Name, Gold Quote, and Description -->
            <div class="bg-[#1a214c] text-white rounded-2xl p-4 sm:p-4.5 shadow-md border border-[#1a214c] relative overflow-hidden">
              <h2 id="fck-res-name" class="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight leading-tight">
                The Keep-It-Cool Investor
              </h2>

              <div class="mt-2 inline-block bg-[#e0b815] text-[#1a214c] px-3 py-0.5 rounded-md shadow-xs">
                <p id="fck-res-vibe" class="text-xs sm:text-sm font-black italic">
                  “Keep calm. Keep flexible.”
                </p>
              </div>

              <p id="fck-res-desc" class="mt-2.5 text-slate-100 text-xs sm:text-sm leading-relaxed font-normal">
                You like keeping things simple, flexible and within your comfort zone.
              </p>
            </div>

            <!-- Suggested Investment Match Card -->
            <div class="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 text-slate-500 mb-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 text-[#1a214c] shrink-0 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>
                  <span class="text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-wider">
                    Suggested Investment Match
                  </span>
                </div>
                <p id="fck-res-product" class="text-base sm:text-lg font-extrabold text-[#1a214c] leading-snug">
                  First Capital Money Market Fund (FCMMF)*
                </p>
              </div>

              <button
                id="fck-btn-view-product"
                type="button"
                class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1a214c] hover:bg-[#252f6b] active:scale-[0.98] text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0 self-start sm:self-center border border-[#1a214c]"
              >
                <span>Explore Product</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 text-[#e0b815]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>

            <!-- Heading -->
            <div class="pt-0.5 mb-1">
              <h3 class="text-base sm:text-lg font-extrabold text-[#1a214c]">
                Become an investor today!
              </h3>
            </div>

            <!-- Stacked CTA Buttons -->
            <div class="flex flex-col gap-2 w-full">
              <!-- CTA 1: Speak to someone - Gold #e0b815 -->
              <a
                href="https://firstcapital.lk/contact-us/"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full bg-[#e0b815] hover:bg-[#cba40e] active:scale-[0.99] text-[#1a214c] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center cursor-pointer text-center"
              >
                <span>I would like to speak to someone first</span>
              </a>

              <!-- CTA 2: Create account - Navy #1a214c -->
              <a
                id="fck-btn-open-account"
                href="https://portal.firstcapital.lk/#/sign-up"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full bg-[#1a214c] hover:bg-[#252f6b] active:scale-[0.99] text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center cursor-pointer text-center border border-[#1a214c]"
              >
                <span>I would like to create my account</span>
              </a>
            </div>

            <!-- Footer Action Links: Share & Retake side by side -->
            <div class="pt-1.5 flex items-center justify-center gap-6 sm:gap-10 text-xs">
              <button
                id="fck-btn-share"
                type="button"
                class="inline-flex items-center gap-1.5 font-bold text-xs text-[#1a214c] hover:underline cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 text-[#1a214c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                <span id="fck-share-btn-text">Share Result</span>
              </button>

              <button
                id="fck-btn-retake"
                type="button"
                class="inline-flex items-center gap-1.5 font-bold text-xs text-[#1a214c] hover:underline cursor-pointer transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 text-[#1a214c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                <span>Retake Quiz</span>
              </button>
            </div>

            <!-- Mobile Disclaimer Section - At the bottom of the modal -->
            <div class="block md:hidden mt-4 pt-3 border-t border-slate-100 bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 text-[9px] leading-relaxed text-slate-500">
              <p>
                <strong class="font-bold text-slate-700">* Disclaimers: </strong>
                <span id="fck-res-disclaimer-mob"></span>
                <a id="fck-res-guide-link-mob" href="#" target="_blank" rel="noopener noreferrer" class="text-[#1a214c] hover:text-[#e0b815] underline font-semibold ml-1 inline-flex items-center gap-0.5 break-all transition-colors">
                  <span id="fck-res-guide-label-mob"></span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-2.5 inline shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP 4: IN-MODAL PRODUCT DETAILS (Utilizes 100% modal space with zero backdrop crop) -->
      <div id="fck-step-product-detail" class="animate-in fade-in duration-200 py-1 w-full text-left space-y-5" style="display:none;">
        <!-- Top Navigation Bar -->
        <div class="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <button
            id="fck-btn-back-to-result-top"
            type="button"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1a214c] font-extrabold text-xs transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span>Back to My Result</span>
          </button>
          <span id="fck-prod-opt-badge" class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            Option 01
          </span>
        </div>

        <div>
          <h3 id="fck-prod-title" class="text-2xl sm:text-3xl font-extrabold text-[#1a214c]">
            Unit Trust Funds
          </h3>
        </div>

        <!-- Available Fund Types Section -->
        <div id="fck-prod-funds-sec" class="space-y-3">
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Available Fund Types:
          </h4>
          <div id="fck-prod-funds-grid" class="grid gap-3.5 sm:grid-cols-3">
            <!-- Populated via JS -->
          </div>
        </div>

        <!-- Simply Put Flow Section -->
        <div id="fck-prod-simply-sec" class="space-y-3">
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Simply put:
          </h4>
          <div id="fck-prod-simply-grid" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <!-- Populated via JS -->
          </div>
        </div>

        <!-- Key Benefits Section -->
        <div id="fck-prod-benefits-sec" class="space-y-2.5">
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-500">Key Benefits:</h4>
          <div id="fck-prod-benefits-grid" class="flex flex-wrap gap-2">
            <!-- Populated via JS -->
          </div>
        </div>

        <!-- Video Explainer Card -->
        <div id="fck-prod-video-sec" class="flex flex-wrap items-center justify-between gap-3 border border-amber-200 bg-amber-50/50 rounded-2xl p-4">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-full bg-[#1a214c] flex items-center justify-center text-white shrink-0 shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="size-5 fill-current ml-0.5 text-[#e0b815]" viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3"/></svg>
            </div>
            <div>
              <p id="fck-prod-video-title" class="text-sm font-extrabold text-slate-900">What are Unit Trust Funds?</p>
              <p id="fck-prod-video-sub" class="text-xs text-slate-500">Quick video explanation (TikTok)</p>
            </div>
          </div>
          <a
            id="fck-prod-video-link"
            href="#"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center gap-1.5 text-xs font-extrabold bg-[#1a214c] text-white px-4 py-2 rounded-xl hover:bg-[#252f6b] transition-colors"
          >
            <span>Watch Video</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 text-[#e0b815]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
          </a>
        </div>

        <!-- Dual CTAs -->
        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href="https://portal.firstcapital.lk/#/sign-up"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 bg-[#1a214c] hover:bg-[#252f6b] text-white py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-center shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>I would like to create my account</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-[#e0b815]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          <a
            href="https://firstcapital.lk/contact-us/"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 bg-[#e0b815] hover:bg-[#cba40e] text-[#1a214c] py-3 px-5 rounded-xl font-bold text-xs sm:text-sm text-center shadow-xs transition-colors"
          >
            <span>I would like to speak to someone first</span>
          </a>
        </div>

        <!-- Back to Result Card Button -->
        <div class="pt-2 text-center">
          <button
            id="fck-btn-back-to-result-bottom"
            type="button"
            class="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 py-2 px-4 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span>Back to My Result Card</span>
          </button>
        </div>

        <!-- Disclaimer -->
        <p class="text-[10px] leading-relaxed text-slate-500 border-t border-slate-100 pt-3">
          <span id="fck-prod-disclaimer"></span>
          <a
            id="fck-prod-guide-link"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[#1a214c] hover:text-[#e0b815] underline font-semibold ml-1 inline-flex items-center gap-0.5 break-all"
          >
            <span id="fck-prod-guide-label"></span>
            <svg xmlns="http://www.w3.org/2000/svg" class="size-2.5 inline shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
          </a>
        </p>
      </div>

      <!-- STEP 5: IN-MODAL SHARE POST SCREEN (Seamless full-space view, zero borders, zero nested overlays) -->
      <div id="fck-step-share" class="animate-in fade-in duration-200 py-1 w-full text-left space-y-4" style="display:none;">
        <!-- Top Navigation Bar -->
        <div class="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <button
            id="fck-share-back-top"
            type="button"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1a214c] font-extrabold text-xs transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            <span>Back to My Result</span>
          </button>
          <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
            Share Result
          </span>
        </div>

        <div>
          <h3 class="text-2xl sm:text-3xl font-extrabold text-[#1a214c]">
            Share Your Result
          </h3>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Post your investor personality on social media or download your personalized card.
          </p>
        </div>

        <!-- 2-Column Responsive Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-center pt-2">
          <!-- Left Column: Share Card Preview -->
          <div class="bg-slate-50/80 rounded-2xl p-3.5 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Share Card Preview
              </span>
              <a
                id="fck-share-save-img"
                href="#"
                download=""
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-xs font-bold text-[#1a214c] hover:text-[#e0b815] underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                <span>Save Image</span>
              </a>
            </div>

            <div class="rounded-xl overflow-hidden shadow-xs bg-white">
              <img
                id="fck-share-card-img"
                src=""
                alt="Investor Type Share Card"
                class="w-full h-auto object-cover block"
              />
            </div>
          </div>

          <!-- Right Column: 1-Click Share Actions -->
          <div class="space-y-4 flex flex-col justify-center">
            <div>
              <h4 class="text-sm font-extrabold text-slate-800 mb-2.5">
                Share directly to:
              </h4>
              <div class="space-y-2.5">
                <!-- WhatsApp -->
                <a
                  id="fck-share-whatsapp"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-sm transition-colors"
                >
                  <div class="flex items-center gap-2.5">
                    <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.25-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/></svg>
                    <span>Share on WhatsApp</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>

                <!-- Facebook -->
                <a
                  id="fck-share-facebook"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] font-bold text-sm transition-colors"
                >
                  <div class="flex items-center gap-2.5">
                    <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                    <span>Share on Facebook</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>

                <!-- Copy Post / Link -->
                <button
                  id="fck-share-copy"
                  type="button"
                  class="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1a214c] font-bold text-sm transition-colors cursor-pointer"
                >
                  <div class="flex items-center gap-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    <span id="fck-share-copy-text">Copy Share Post & Link</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="size-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            <div class="pt-2">
              <button
                id="fck-share-back-bottom"
                type="button"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                <span>Back to Result Card</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

    </div>
  </div>
</div>

<script>
(function() {
  var PROFILES = {
    A: {
      number: "01",
      slug: "keep-it-cool",
      name: "The Keep-It-Cool Investor",
      style: "Flexible & Agile",
      product: "First Capital Money Market Fund (FCMMF)*",
      productOptionId: "unit-trust",
      description: "You like keeping things simple, flexible and within your comfort zone. You want your money to work, but you also like knowing you can access it when you need it.",
      vibe: "Keep calm. Keep flexible.",
      disclaimer: "* Disclaimers: Past performance is not an indicator of future performance | Investors are advised to read and understand the contents of Key Investor Information Document (KIID) | The fund is approved by the Securities and Exchange Commission of Sri Lanka (SEC) | Please refer to the Procedure Guide related to Unit Trust to understand our internal procedures related to products and transactions: ",
      guideUrl: "https://firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf",
      guideLabel: "firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf"
    },
    B: {
      number: "02",
      slug: "smooth-operator",
      name: "The Smooth Operator",
      style: "Income-Focused & Flexible",
      product: "First Capital Fixed Income Fund (FCFIF)*",
      productOptionId: "unit-trust",
      description: "You’re looking for the sweet spot between earning a return and keeping your money accessible. You’re not chasing every opportunity - you prefer a more measured approach.",
      vibe: "Thoughtful choices. Smarter Investing.",
      disclaimer: "* Disclaimers: Past performance is not an indicator of future performance | Investors are advised to read and understand the contents of Key Investor Information Document (KIID) | The fund is approved by the Securities and Exchange Commission of Sri Lanka (SEC) | Please refer to the Procedure Guide related to Unit Trust to understand our internal procedures related to products and transactions: ",
      guideUrl: "https://firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf",
      guideLabel: "firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf"
    },
    C: {
      number: "03",
      slug: "patient-player",
      name: "The Patient Player",
      style: "Long-term & income-focused",
      product: "Treasury Bonds*",
      productOptionId: "gov-securities",
      description: "You’re comfortable giving your money time to work. You prefer a defined investment period and regular return as you build towards your bigger financial goals.",
      vibe: "Play the long game.",
      disclaimer: "*Disclaimer: Terms & Conditions apply | Please refer to the Procedure Guide related Treasuries/Government Securities to understand our internal procedures related to products and transactions: ",
      guideUrl: "https://firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf",
      guideLabel: "firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf"
    },
    D: {
      number: "04",
      slug: "opportunity-hunter",
      name: "The Opportunity Hunter",
      style: "Growth-focused",
      product: "Equities*",
      productOptionId: "equities",
      description: "You’re thinking beyond the short term. You’re comfortable with market ups and downs and are focused on growing your wealth over the long run.",
      vibe: "Spot the opportunity. Think long term.",
      disclaimer: "*Disclaimer: Investments are subject to market risks | Please refer to the Procedure Guide related to Stockbrokering/Equities to understand our internal procedures related to products and transactions: ",
      guideUrl: "https://firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf",
      guideLabel: "firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf"
    }
  };

  var OPTION_DETAILS = {
    'unit-trust': {
      number: '01',
      title: 'Unit Trust Funds',
      products: [
        {
          icon: '<svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>',
          title: 'First Capital Money Market Fund',
          tags: ['Short-term', 'Relatively lower risk', 'Withdraw anytime', 'Start with LKR 1,000'],
          copy: 'For investors who want to keep their money accessible while putting it to work.'
        },
        {
          icon: '<svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
          title: 'First Capital Fixed Income Fund',
          tags: ['Medium to long term', 'Access anytime', 'Start with LKR 1,000'],
          copy: 'For investors looking for investment return while keeping access to their money.'
        },
        {
          icon: '<svg xmlns="http://www.w3.org/2000/svg" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 3 18 18"/><path d="m19 9 3 3-3 3"/><path d="m5 15-3-3 3-3"/></svg>',
          title: 'First Capital Equity Fund',
          tags: ['Long-term', 'Growth', 'Market exposure', 'Start with LKR 1,000'],
          copy: 'For investors looking to grow their wealth over the long term through the stock market and who are comfortable with market fluctuations. Key benefits: Start from LKR 1,000 | Withdraw anytime (Withdrawals made within one year are subject to an exit fee).'
        }
      ],
      video: {
        title: 'Learn more about Unit Trust Funds',
        url: 'https://www.tiktok.com/@first.capital/video/7593165117668265223',
        platform: 'TikTok'
      },
      disclaimer: '*Disclaimers: Past performance is not an indicator of future performance | Investors are advised to read and understand the contents of Key Investor Information Document (KIID) | The fund is approved by the Securities and Exchange Commission of Sri Lanka (SEC) | Please refer to the Procedure Guide related to Unit Trust Funds to understand our internal procedures related to products and transactions: ',
      guideUrl: 'https://firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf',
      guideLabel: 'firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf'
    },
    'gov-securities': {
      number: '02',
      title: 'Government Securities',
      simplyPut: 'You invest money → The government uses your money → You receive regular interest → Your investment is repaid at maturity.',
      keyBenefits: ['Government-issued', 'Regular interest', 'Defined maturity', 'Risk-free instrument'],
      video: {
        title: 'Government Securities explained',
        url: 'https://www.youtube.com/shorts/HGL82Tv1wJE',
        platform: 'YouTube'
      },
      disclaimer: '*Disclaimer: Terms & Conditions apply | Please refer to the Procedure Guide related Treasuries/Government Securities to understand our internal procedures related to products and transactions: ',
      guideUrl: 'https://firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf',
      guideLabel: 'firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf'
    },
    'equities': {
      number: '03',
      title: 'Equities',
      simplyPut: 'You buy shares → You own a part of a company → The share value can rise or fall → You can benefit if the value increases.',
      keyBenefits: ['Long-term growth potential', 'Own listed shares', 'Market participation'],
      video: {
        title: 'How do equities work?',
        url: 'https://www.youtube.com/shorts/HGL82Tv1wJE',
        platform: 'YouTube'
      },
      disclaimer: '*Disclaimer: Investments are subject to market risks | Please refer to the Procedure Guide related to Stockbrokering/Equities to understand our internal procedures related to products and transactions: ',
      guideUrl: 'https://firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf',
      guideLabel: 'https://firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf'
    }
  };

  var QUESTIONS = [
    {
      id: 1,
      question: "You have some extra money sitting in your account. What’s your first thought?",
      options: [
        { key: "A", label: "A", text: "I’d keep it somewhere safe, but I want to be able to access it anytime." },
        { key: "B", label: "B", text: "I’m happy to leave it invested for a few months if I can earn a return." },
        { key: "C", label: "C", text: "I’m comfortable leaving it invested for longer if it can grow steadily." },
        { key: "D", label: "D", text: "I’d rather invest for the potential of higher long-term growth" }
      ]
    },
    {
      id: 2,
      question: "How long can you comfortably leave your money invested?",
      options: [
        { key: "A", label: "A", text: "1 - 6 months" },
        { key: "B", label: "B", text: "6 months – 1 year" },
        { key: "C", label: "C", text: "1–2 years" },
        { key: "D", label: "D", text: "More than 2 years" }
      ]
    },
    {
      id: 3,
      question: "Interest rates in the market move up and down frequently. What is your reaction?",
      options: [
        { key: "A", label: "A", text: "I’d probably want to take my money out." },
        { key: "B", label: "B", text: "A little movement is fine, but I prefer stability." },
        { key: "C", label: "C", text: "I can handle some ups and downs if I have a longer-term plan." },
        { key: "D", label: "D", text: "I’m comfortable with bigger ups and downs for the chance of higher growth." }
      ]
    },
    {
      id: 4,
      question: "What is your priority for investing right now?",
      options: [
        { key: "A", label: "A", text: "A financial safety net" },
        { key: "B", label: "B", text: "A goal coming up in the next year or so" },
        { key: "C", label: "C", text: "A bigger milestone in the next few years" },
        { key: "D", label: "D", text: "Long-term wealth and financial freedom" }
      ]
    },
    {
      id: 5,
      question: "What would you say is your pattern for investing?",
      options: [
        { key: "A", label: "A", text: "Setting aside an amount every month" },
        { key: "B", label: "B", text: "Investing when I have some extra money" },
        { key: "C", label: "C", text: "Investing a large amount at once and letting it work" },
        { key: "D", label: "D", text: "Investing when I spot an opportunity I believe in" }
      ]
    },
    {
      id: 6,
      question: "Imagine you have LKR 500,000 ready to invest. Which sounds like you?",
      options: [
        { key: "A", label: "A", text: "Keep it flexible and invest for the short term." },
        { key: "B", label: "B", text: "Aim for a relatively stable return while keeping access to my money." },
        { key: "C", label: "C", text: "Lock it into a longer-term government investment and earn regular interest." },
        { key: "D", label: "D", text: "Invest in shares and stay invested for long-term growth." }
      ]
    },
    {
      id: 7,
      question: "Which statement sounds most like you?",
      options: [
        { key: "A", label: "A", text: "“I like knowing my money is there when I need it.”" },
        { key: "B", label: "B", text: "“I want my money to grow, without taking on too much risk.”" },
        { key: "C", label: "C", text: "“I’m happy to wait if it means building my money for the potential of long-term growth.”" },
        { key: "D", label: "D", text: "“I’m playing the long game when it comes to my wealth.”" }
      ]
    }
  ];

  var modal = document.getElementById('fck-quiz-modal');
  var closeBtn = document.getElementById('fck-modal-close');
  var stepDetails = document.getElementById('fck-step-details');
  var stepQuestion = document.getElementById('fck-step-question');
  var stepLoading = document.getElementById('fck-step-loading');
  var stepResult = document.getElementById('fck-step-result');
  var stepProductDetail = document.getElementById('fck-step-product-detail');
  var btnBackToResultTop = document.getElementById('fck-btn-back-to-result-top');
  var btnBackToResultBottom = document.getElementById('fck-btn-back-to-result-bottom');

  var leadForm = document.getElementById('fck-lead-form');
  var leadError = document.getElementById('fck-lead-error');
  var qCounter = document.getElementById('fck-q-counter');
  var qProgress = document.getElementById('fck-q-progress');
  var qText = document.getElementById('fck-q-text');
  var qOptions = document.getElementById('fck-q-options');
  var qBackBtn = document.getElementById('fck-q-back');
  var qNextBtn = document.getElementById('fck-q-next');
  var qNextLabel = document.getElementById('fck-q-next-label');

  var btnExplore = document.getElementById('fck-btn-explore');
  var btnShare = document.getElementById('fck-btn-share');
  var btnRetake = document.getElementById('fck-btn-retake');

  var disclaimerToggle = document.getElementById('fck-disclaimer-toggle');
  var disclaimerLabel = document.getElementById('fck-disclaimer-toggle-label');
  var disclaimerContent = document.getElementById('fck-disclaimer-content');
  var disclaimerChevron = document.getElementById('fck-disclaimer-chevron');
  var isDisclaimerOpen = false;

  function setDisclaimerOpen(open) {
    isDisclaimerOpen = open;
    if (disclaimerContent) disclaimerContent.style.display = open ? 'block' : 'none';
    if (disclaimerLabel) disclaimerLabel.innerText = open ? 'Hide details' : 'Click to read more';
    if (disclaimerChevron) disclaimerChevron.style.transform = open ? 'rotate(180deg)' : 'none';
  }

  if (disclaimerToggle) {
    disclaimerToggle.addEventListener('click', function() {
      setDisclaimerOpen(!isDisclaimerOpen);
    });
  }

  var currentLead = { name: '', email: '', phone: '' };
  var currentStep = 0;
  var userAnswers = {};

  function openModal() {
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    userAnswers = {};
    if (stepProductDetail) stepProductDetail.style.display = 'none';
    showQuestionScreen(0);
  }

  function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function showDetailsScreen() {
    stepDetails.style.display = 'block';
    stepQuestion.style.display = 'none';
    stepLoading.style.display = 'none';
    stepResult.style.display = 'none';
    if (stepProductDetail) stepProductDetail.style.display = 'none';
  }

  function renderOptions(q) {
    qOptions.innerHTML = '';
    var selectedKey = userAnswers[q.id];

    q.options.forEach(function(opt) {
      var isSelected = selectedKey === opt.key;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'group relative w-full py-4 px-5 sm:px-6 rounded-2xl text-left transition-all duration-200 flex items-center justify-between cursor-pointer ' +
        (isSelected
          ? 'border-2 border-[#f1c91e] bg-amber-50/40 text-[#142d27] font-semibold shadow-sm ring-2 ring-[#f1c91e]/20'
          : 'border border-slate-200/90 bg-white text-slate-700 hover:border-[#f1c91e]/70 hover:bg-slate-50/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md');

      var leftDiv = document.createElement('div');
      leftDiv.className = 'flex items-start gap-3.5 pr-3';

      var badge = document.createElement('span');
      badge.className = 'size-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-colors ' +
        (isSelected
          ? 'bg-[#f1c91e] text-[#142d27] font-extrabold'
          : 'bg-slate-100 text-slate-600 group-hover:bg-[#f1c91e]/20 group-hover:text-[#142d27]');
      badge.innerText = opt.label;

      var textSpan = document.createElement('span');
      textSpan.className = 'text-sm sm:text-base leading-snug';
      textSpan.innerText = opt.text;

      leftDiv.appendChild(badge);
      leftDiv.appendChild(textSpan);

      var checkDiv = document.createElement('div');
      checkDiv.className = 'size-5 shrink-0 rounded-full flex items-center justify-center transition-all ' +
        (isSelected
          ? 'bg-[#f1c91e] text-[#142d27]'
          : 'border border-slate-300 group-hover:border-[#f1c91e]');

      if (isSelected) {
        checkDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="size-3 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
      }

      btn.appendChild(leftDiv);
      btn.appendChild(checkDiv);

      btn.addEventListener('click', function() {
        userAnswers[q.id] = opt.key;
        renderOptions(q);
        qNextBtn.disabled = false;
      });

      qOptions.appendChild(btn);
    });
  }

  function showQuestionScreen(stepIdx) {
    currentStep = stepIdx;
    stepDetails.style.display = 'none';
    stepQuestion.style.display = 'block';
    stepLoading.style.display = 'none';
    stepResult.style.display = 'none';
    if (stepProductDetail) stepProductDetail.style.display = 'none';

    var q = QUESTIONS[stepIdx];
    var numStr = String(stepIdx + 1).padStart(2, '0') + '-07';
    qCounter.innerText = numStr;
    qProgress.style.width = Math.round(((stepIdx + 1) / QUESTIONS.length) * 100) + '%';
    qText.innerText = q.question;

    qNextLabel.innerText = (stepIdx === QUESTIONS.length - 1) ? 'Continue' : 'Next';
    qNextBtn.disabled = !userAnswers[q.id];

    qBackBtn.style.visibility = (stepIdx === 0) ? 'hidden' : 'visible';

    renderOptions(q);
  }

  function calculateResult() {
    var counts = { A: 0, B: 0, C: 0, D: 0 };
    Object.keys(userAnswers).forEach(function(k) {
      var ans = userAnswers[k];
      if (counts[ans] !== undefined) counts[ans]++;
    });

    var maxScore = -1;
    var topKeys = [];
    ['A', 'B', 'C', 'D'].forEach(function(k) {
      if (counts[k] > maxScore) {
        maxScore = counts[k];
        topKeys = [k];
      } else if (counts[k] === maxScore) {
        topKeys.push(k);
      }
    });

    if (topKeys.length === 1) return topKeys[0];

    // Primary tie-breaker: Question 6
    var q6Ans = userAnswers[6];
    if (topKeys.includes(q6Ans)) return q6Ans;

    // Secondary tie-breaker: Question 3
    var q3Ans = userAnswers[3];
    if (topKeys.includes(q3Ans)) return q3Ans;

    return topKeys[0];
  }

  function showLoadingScreen() {
    stepDetails.style.display = 'none';
    stepQuestion.style.display = 'none';
    stepLoading.style.display = 'block';
    stepResult.style.display = 'none';
    if (stepProductDetail) stepProductDetail.style.display = 'none';

    setTimeout(function() {
      var resultKey = calculateResult();
      showResultScreen(resultKey);
    }, 2200);
  }

  var currentResultKey = 'A';

  function showInModalProductDetail(optId, prof) {
    var data = (typeof OPTION_DETAILS !== 'undefined' && OPTION_DETAILS[optId]) ? OPTION_DETAILS[optId] : null;
    if (!data || !stepProductDetail) return;

    stepDetails.style.display = 'none';
    stepQuestion.style.display = 'none';
    stepLoading.style.display = 'none';
    stepResult.style.display = 'none';
    stepProductDetail.style.display = 'block';

    var badge = document.getElementById('fck-prod-opt-badge');
    if (badge) badge.innerText = 'Option ' + data.number;

    var title = document.getElementById('fck-prod-title');
    if (title) title.innerText = data.title;

    // Available Funds
    var fundsSec = document.getElementById('fck-prod-funds-sec');
    var fundsGrid = document.getElementById('fck-prod-funds-grid');
    if (data.products && fundsSec && fundsGrid) {
      fundsSec.style.display = 'block';
      fundsGrid.innerHTML = '';
      data.products.forEach(function(p) {
        var isMatch = prof && prof.product && prof.product.toLowerCase().includes(p.title.toLowerCase().replace(' fund', ''));
        var card = document.createElement('div');
        card.className = 'border rounded-2xl p-4 flex flex-col justify-between transition-all ' +
          (isMatch
            ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-300/40 shadow-xs'
            : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs');
        
        var tagsHtml = p.tags.map(function(t) {
          return '<span class="border border-slate-200 bg-white rounded-md px-2 py-0.5 text-[10px] font-bold text-slate-600">' + t + '</span>';
        }).join('');

        card.innerHTML = '<div>' +
          '<div class="size-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#1a214c] shadow-2xs">' + p.icon + '</div>' +
          '<h5 class="mt-3 text-base font-extrabold text-[#1a214c]">' + p.title + '</h5>' +
          '<p class="mt-1.5 text-xs leading-relaxed text-slate-600">' + p.copy + '</p>' +
          '</div>' +
          '<div class="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-200/60">' + tagsHtml + '</div>';
        fundsGrid.appendChild(card);
      });
    } else if (fundsSec) {
      fundsSec.style.display = 'none';
    }

    // Simply put
    var simplySec = document.getElementById('fck-prod-simply-sec');
    var simplyGrid = document.getElementById('fck-prod-simply-grid');
    if (data.simplyPut && simplySec && simplyGrid) {
      simplySec.style.display = 'block';
      simplyGrid.innerHTML = '';
      var steps = data.simplyPut.split('→');
      steps.forEach(function(step, idx) {
        var card = document.createElement('div');
        card.className = 'flex items-start gap-3 border border-slate-200 bg-slate-50/80 rounded-2xl p-3.5 shadow-2xs';
        card.innerHTML = '<span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1a214c] text-xs font-black text-white">' + (idx + 1) + '</span>' +
          '<span class="text-xs sm:text-sm font-bold text-slate-800 leading-snug">' + step.trim() + '</span>';
        simplyGrid.appendChild(card);
      });
    } else if (simplySec) {
      simplySec.style.display = 'none';
    }

    // Key benefits
    var benefitsSec = document.getElementById('fck-prod-benefits-sec');
    var benefitsGrid = document.getElementById('fck-prod-benefits-grid');
    if (data.keyBenefits && benefitsSec && benefitsGrid) {
      benefitsSec.style.display = 'block';
      benefitsGrid.innerHTML = '';
      data.keyBenefits.forEach(function(b) {
        var bBadge = document.createElement('span');
        bBadge.className = 'border border-slate-200 bg-slate-50 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs';
        bBadge.innerText = '✓ ' + b;
        benefitsGrid.appendChild(bBadge);
      });
    } else if (benefitsSec) {
      benefitsSec.style.display = 'none';
    }

    // Video
    var videoSec = document.getElementById('fck-prod-video-sec');
    if (data.video && videoSec) {
      videoSec.style.display = 'flex';
      var vTitle = document.getElementById('fck-prod-video-title');
      var vSub = document.getElementById('fck-prod-video-sub');
      var vLink = document.getElementById('fck-prod-video-link');
      if (vTitle) vTitle.innerText = data.video.title;
      if (vSub) vSub.innerText = 'Quick video explanation (' + data.video.platform + ')';
      if (vLink) vLink.href = data.video.url;
    } else if (videoSec) {
      videoSec.style.display = 'none';
    }

    // Disclaimer & Guide
    var discl = document.getElementById('fck-prod-disclaimer');
    if (discl) discl.innerText = data.disclaimer;
    var prodGuideLink = document.getElementById('fck-prod-guide-link');
    var prodGuideLabel = document.getElementById('fck-prod-guide-label');
    if (prodGuideLink && data.guideUrl) {
      prodGuideLink.style.display = 'inline-flex';
      prodGuideLink.href = data.guideUrl;
      if (prodGuideLabel) prodGuideLabel.innerText = data.guideLabel || data.guideUrl;
    } else if (prodGuideLink) {
      prodGuideLink.style.display = 'none';
    }
  }

  function backToResult() {
    if (stepProductDetail) stepProductDetail.style.display = 'none';
    if (stepResult) stepResult.style.display = 'block';
  }

  if (btnBackToResultTop) btnBackToResultTop.addEventListener('click', backToResult);
  if (btnBackToResultBottom) btnBackToResultBottom.addEventListener('click', backToResult);

  function showResultScreen(key) {
    currentResultKey = key;
    var prof = PROFILES[key];
    stepDetails.style.display = 'none';
    stepQuestion.style.display = 'none';
    stepLoading.style.display = 'none';
    if (stepProductDetail) stepProductDetail.style.display = 'none';
    stepResult.style.display = 'block';

    var avatarEl = document.getElementById('fck-res-avatar');
    if (avatarEl) {
      var selectedGender = (currentLead && currentLead.gender === 'female') ? 'female' : 'male';
      avatarEl.src = '__PREFIX__' + prof.slug + '-' + selectedGender + '.png';
      avatarEl.alt = prof.name;
      avatarEl.onerror = function() {
        if (this.src.indexOf('assets/') === -1) {
          this.src = '__PREFIX__assets/' + prof.slug + '-' + selectedGender + '.png';
        }
      };
    }

    if (document.getElementById('fck-res-number')) document.getElementById('fck-res-number').innerText = 'Personality ' + prof.number;
    if (document.getElementById('fck-res-style')) document.getElementById('fck-res-style').innerText = prof.style;
    document.getElementById('fck-res-name').innerText = prof.name;
    document.getElementById('fck-res-vibe').innerText = '“' + prof.vibe + '”';
    if (document.getElementById('fck-res-desc')) document.getElementById('fck-res-desc').innerText = prof.description;
    if (document.getElementById('fck-res-product')) document.getElementById('fck-res-product').innerText = prof.product;
    if (document.getElementById('fck-res-disclaimer')) document.getElementById('fck-res-disclaimer').innerText = prof.disclaimer.replace(/^[\\*\\s]*Disclaimers?:?[\\s]*/i, '');
    if (document.getElementById('fck-res-disclaimer-mob')) document.getElementById('fck-res-disclaimer-mob').innerText = prof.disclaimer.replace(/^[\\*\\s]*Disclaimers?:?[\\s]*/i, '');
    
    var viewProductBtn = document.getElementById('fck-btn-view-product');
    if (viewProductBtn) {
      viewProductBtn.onclick = function() {
        showInModalProductDetail(prof.productOptionId, prof);
      };
    }

    var guideLink = document.getElementById('fck-res-guide-link');
    var guideLabel = document.getElementById('fck-res-guide-label');
    if (guideLink && prof.guideUrl) guideLink.href = prof.guideUrl;
    if (guideLabel && prof.guideLabel) guideLabel.innerText = prof.guideLabel;

    var guideLinkMob = document.getElementById('fck-res-guide-link-mob');
    var guideLabelMob = document.getElementById('fck-res-guide-label-mob');
    if (guideLinkMob && prof.guideUrl) guideLinkMob.href = prof.guideUrl;
    if (guideLabelMob && prof.guideLabel) guideLabelMob.innerText = prof.guideLabel;
    if (typeof setDisclaimerOpen === 'function') setDisclaimerOpen(false);

    // Persist lead in localStorage
    try {
      var leads = JSON.parse(localStorage.getItem('fck_quiz_leads') || '[]');
      leads.push({
        id: Date.now().toString(),
        name: currentLead.name,
        email: currentLead.email,
        phone: currentLead.phone,
        gender: currentLead.gender || 'male',
        profile: key,
        product: prof.product,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('fck_quiz_leads', JSON.stringify(leads));

      // Also persist to admin store format so it instantly appears in the Admin Portal
      var adminLeads = JSON.parse(localStorage.getItem('fc_admin_leads') || '[]');
      adminLeads.unshift({
        id: 'FC-' + Math.floor(1000 + Math.random() * 9000),
        createdAt: new Date().toISOString(),
        name: currentLead.name,
        email: currentLead.email,
        phone: currentLead.phone,
        gender: currentLead.gender || 'male',
        profileKey: key,
        profileName: prof.name,
        matchedProduct: prof.product,
        status: 'NEW',
        answers: userAnswers,
        source: 'Landing Page Quiz'
      });
      localStorage.setItem('fc_admin_leads', JSON.stringify(adminLeads));
    } catch(e) {}

    // Send to backend API (Hostinger PHP MySQL or Node server)
    try {
      var leadPayload = {
        name: currentLead.name,
        email: currentLead.email,
        phone: currentLead.phone,
        gender: currentLead.gender || 'male',
        profileKey: key,
        profileName: prof.name,
        matchedProduct: prof.product,
        answers: userAnswers
      };

      fetch('__PREFIX__api/leads.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload)
      }).catch(function() {
        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadPayload)
        }).catch(function() {});
      });
    } catch(e) {}
  }

  var genderMaleBtn = document.getElementById('fck-gender-male');
  var genderFemaleBtn = document.getElementById('fck-gender-female');
  var genderInput = document.getElementById('fck-input-gender');

  function setGender(g) {
    if (genderInput) genderInput.value = g;
    if (genderMaleBtn && genderFemaleBtn) {
      if (g === 'male') {
        genderMaleBtn.className = 'flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#f1c91e] bg-[#f1c91e]/15 text-[#142d27] ring-2 ring-[#f1c91e]/50 font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-xs';
        genderFemaleBtn.className = 'flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-slate-100 text-xs sm:text-sm font-bold transition-all cursor-pointer';
      } else {
        genderFemaleBtn.className = 'flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#f1c91e] bg-[#f1c91e]/15 text-[#142d27] ring-2 ring-[#f1c91e]/50 font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-xs';
        genderMaleBtn.className = 'flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 hover:bg-slate-100 text-xs sm:text-sm font-bold transition-all cursor-pointer';
      }
    }
  }

  if (genderMaleBtn) genderMaleBtn.addEventListener('click', function() { setGender('male'); });
  if (genderFemaleBtn) genderFemaleBtn.addEventListener('click', function() { setGender('female'); });

  // Lead form submit (called after answering all 7 questions)
  if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = document.getElementById('fck-input-name').value.trim();
      var email = document.getElementById('fck-input-email').value.trim();
      var phone = document.getElementById('fck-input-phone').value.trim();
      var gender = (genderInput && genderInput.value) ? genderInput.value : 'male';

      if (!name || !email || !phone) {
        leadError.innerText = 'Please complete all required fields.';
        leadError.classList.remove('hidden');
        return;
      }
      leadError.classList.add('hidden');
      currentLead = { name: name, email: email, phone: phone, gender: gender };
      showLoadingScreen();
    });
  }

  var detailsBackBtn = document.getElementById('fck-details-back');
  if (detailsBackBtn) {
    detailsBackBtn.addEventListener('click', function() {
      showQuestionScreen(QUESTIONS.length - 1);
    });
  }

  if (qBackBtn) {
    qBackBtn.addEventListener('click', function() {
      if (currentStep > 0) {
        showQuestionScreen(currentStep - 1);
      }
    });
  }

  if (qNextBtn) {
    qNextBtn.addEventListener('click', function() {
      if (currentStep < QUESTIONS.length - 1) {
        showQuestionScreen(currentStep + 1);
      } else {
        // If user data is already captured (e.g. retaking quiz), don't ask again and reveal results directly
        if (currentLead && currentLead.name && currentLead.email && currentLead.phone) {
          showLoadingScreen();
        } else {
          showDetailsScreen();
        }
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.style.display !== 'none') closeModal();
  });

  if (btnExplore) {
    btnExplore.addEventListener('click', function() {
      closeModal();
      var optionsSection = document.getElementById('options');
      if (optionsSection) optionsSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnRetake) {
    btnRetake.addEventListener('click', function() {
      userAnswers = {};
      if (stepProductDetail) stepProductDetail.style.display = 'none';
      showQuestionScreen(0);
    });
  }

  var stepShare = document.getElementById('fck-step-share');
  var shareBackTop = document.getElementById('fck-share-back-top');
  var shareBackBottom = document.getElementById('fck-share-back-bottom');
  var shareSaveImg = document.getElementById('fck-share-save-img');
  var shareCardImg = document.getElementById('fck-share-card-img');
  var shareWhatsapp = document.getElementById('fck-share-whatsapp');
  var shareFacebook = document.getElementById('fck-share-facebook');
  var shareCopyBtn = document.getElementById('fck-share-copy');
  var shareCopyText = document.getElementById('fck-share-copy-text');

  function showShareScreen() {
    if (!stepShare || !currentResultKey) return;
    var prof = PROFILES[currentResultKey];
    var gender = (currentLead && currentLead.gender === 'female') ? 'female' : 'male';
    var slug = prof ? (prof.slug || 'keep-it-cool') : 'keep-it-cool';
    var cardImgSrc = '__PREFIX__share-' + slug + '-' + gender + '.jpg';
    var pathname = window.location.pathname;
    var basePath = pathname.substring(0, pathname.lastIndexOf('/') + 1) || '/fc/';
    var isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.indexOf('192.168.') !== -1);
    var shareUrl = (!isLocal && window.location.origin)
      ? (window.location.origin + basePath + slug + '-' + gender + '.html')
      : ('https://ai.loopsintegrated.co/fc/' + slug + '-' + gender + '.html');
    var postText = "I just found my investor personality with First Capital! I'm " + (prof ? prof.name : "") + " - " + (prof ? prof.vibe : "") + ". Find your investor type here: " + shareUrl;

    if (shareCardImg) {
      shareCardImg.src = cardImgSrc;
      shareCardImg.onerror = function() {
        if (this.src.indexOf('assets/') === -1) {
          this.src = '__PREFIX__assets/share-' + slug + '-' + gender + '.jpg';
        }
      };
    }
    if (shareSaveImg) {
      shareSaveImg.href = cardImgSrc;
      shareSaveImg.download = 'first-capital-' + slug + '-' + gender + '.jpg';
    }
    if (shareWhatsapp) shareWhatsapp.href = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(postText);
    if (shareFacebook) shareFacebook.href = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl);

    stepDetails.style.display = 'none';
    stepQuestion.style.display = 'none';
    stepLoading.style.display = 'none';
    stepResult.style.display = 'none';
    if (stepProductDetail) stepProductDetail.style.display = 'none';
    stepShare.style.display = 'block';
  }

  function backFromShare() {
    if (stepShare) stepShare.style.display = 'none';
    if (stepResult) stepResult.style.display = 'block';
  }

  if (btnShare) btnShare.addEventListener('click', showShareScreen);
  if (shareBackTop) shareBackTop.addEventListener('click', backFromShare);
  if (shareBackBottom) shareBackBottom.addEventListener('click', backFromShare);
  if (shareCopyBtn) {
    shareCopyBtn.addEventListener('click', function() {
      if (!currentResultKey) return;
      var prof = PROFILES[currentResultKey];
      var gender = (currentLead && currentLead.gender === 'female') ? 'female' : 'male';
      var slug = prof ? (prof.slug || 'keep-it-cool') : 'keep-it-cool';
      var pathname = window.location.pathname;
      var basePath = pathname.substring(0, pathname.lastIndexOf('/') + 1) || '/fc/';
      var isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.indexOf('192.168.') !== -1);
      var shareUrl = (!isLocal && window.location.origin)
        ? (window.location.origin + basePath + slug + '-' + gender + '.html')
        : ('https://ai.loopsintegrated.co/fc/' + slug + '-' + gender + '.html');
      var postText = "I just found my investor personality with First Capital! I'm " + (prof ? prof.name : "") + " - " + (prof ? prof.vibe : "") + ". Find your investor type here: " + shareUrl;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(postText).then(function() {
          if (shareCopyText) {
            shareCopyText.innerText = 'Copied!';
            setTimeout(function() { shareCopyText.innerText = 'Copy Post'; }, 2500);
          }
        }).catch(function() {});
      }
    });
  }

  function attachQuizTriggers() {
    document.querySelectorAll('button, a, [data-quiz-trigger], #btn-find-investor-type').forEach(function(el) {
      var txt = (el.textContent || el.innerText || '').toLowerCase();
      if (
        txt.includes('find my investor type') ||
        txt.includes('take the quiz') ||
        el.getAttribute('href') === '#quiz' ||
        el.getAttribute('id') === 'btn-find-investor-type' ||
        el.hasAttribute('data-quiz-trigger')
      ) {
        el.setAttribute('data-quiz-bound', 'true');
        el.style.cursor = 'pointer';
        el.onclick = function(ev) {
          if (ev) ev.preventDefault();
          openModal();
          return false;
        };
      }
    });
  }

  // 1. Run immediately as script parses
  attachQuizTriggers();

  // 2. Also run when DOM is interactive/loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachQuizTriggers);
  } else {
    setTimeout(attachQuizTriggers, 50);
  }

  // 3. Global delegated document click listener (catches any click including inner svg/spans across any timing)
  document.addEventListener('click', function(ev) {
    var trigger = ev.target && ev.target.closest ? ev.target.closest('button, a, [data-quiz-trigger], #btn-find-investor-type') : null;
    if (!trigger) return;
    var txt = (trigger.textContent || trigger.innerText || '').toLowerCase();
    if (
      txt.includes('find my investor type') ||
      txt.includes('take the quiz') ||
      trigger.getAttribute('href') === '#quiz' ||
      trigger.getAttribute('id') === 'btn-find-investor-type' ||
      trigger.hasAttribute('data-quiz-trigger')
    ) {
      ev.preventDefault();
      openModal();
    }
  }, true);

  // 4. Auto-open if redirected from a friend's shared post
  if (window.location.search.indexOf('quiz=open') !== -1 || window.location.hash === '#quiz') {
    setTimeout(openModal, 150);
  }

  // 5. Expose globally
  window.openFirstCapitalQuiz = openModal;
})();
</script>
`;

async function exportStatic() {
  const outDir = path.resolve('firstcapitalpages');
  const assetsDir = path.join(outDir, 'assets');
  const option2Dir = path.join(outDir, 'design-option-2');
  const apiDir = path.join(outDir, 'api');

  // Clean stale build artifacts in firstcapitalpages/assets to keep bundle lightweight
  if (fs.existsSync(assetsDir)) {
    fs.rmSync(assetsDir, { recursive: true, force: true });
  }

  // Ensure directories exist
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.mkdirSync(option2Dir, { recursive: true });
  fs.mkdirSync(apiDir, { recursive: true });

  console.log('Fetching live pre-rendered HTML from local dev server...');
  const [html1, html2] = await Promise.all([
    fetchHtml('http://localhost:8080/'),
    fetchHtml('http://localhost:8080/design-option-2')
  ]);

  // Copy CSS from .output/public/assets or fallback
  let compiledCssContent = '';
  const compiledCssFiles = fs.readdirSync('.output/public/assets').filter(f => f.endsWith('.css'));
  if (compiledCssFiles.length > 0) {
    const cssSource = path.join('.output/public/assets', compiledCssFiles[0]);
    compiledCssContent = fs.readFileSync(cssSource, 'utf-8');
    fs.writeFileSync(path.join(assetsDir, 'styles.css'), compiledCssContent, 'utf-8');
    fs.writeFileSync(path.join(outDir, 'styles.css'), compiledCssContent, 'utf-8');
    fs.writeFileSync(path.join(option2Dir, 'styles.css'), compiledCssContent, 'utf-8');
    console.log('Copied and inlined compiled CSS to assets/styles.css, styles.css, and design-option-2/styles.css');
  }

  // Copy Images to both assets/ and root outDir for 100% resilient path resolution
  const copyDual = (src, destFilename) => {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(assetsDir, destFilename));
      fs.copyFileSync(src, path.join(outDir, destFilename));
    }
  };

  copyDual('public/__l5e/assets-v1/4127bce6-999f-469c-8a68-01a4dc912fc9/first-capital-logo.png', 'first-capital-logo.png');
  copyDual('public/male.png', 'male.png');
  copyDual('public/female.png', 'female.png');
  copyDual('src/assets/investors.png', 'investors.png');
  copyDual('src/assets/investors.png', 'FCmain.png');
  copyDual('src/assets/investor-personalities.jpg', 'investor-personalities.jpg');
  copyDual('src/assets/image.png', 'image.png');
  copyDual('public/og-image.jpg', 'og-image.jpg');
  copyDual('public/favicon.png', 'favicon.png');

  ['01', '02', '03', '04'].forEach(num => {
    copyDual(`src/assets/investor-type-${num}.png`, `investor-type-${num}.png`);
    copyDual(`src/assets/investor-type-${num}-male.png`, `investor-type-${num}-male.png`);
    copyDual(`src/assets/investor-type-${num}-female.png`, `investor-type-${num}-female.png`);
  });

  ['keep-it-cool', 'smooth-operator', 'patient-player', 'opportunity-hunter'].forEach(slug => {
    copyDual(`src/assets/${slug}-male.png`, `${slug}-male.png`);
    copyDual(`src/assets/${slug}-female.png`, `${slug}-female.png`);
  });
  
  const personalityDefs = [
    { slug: 'keep-it-cool', name: 'The Keep-It-Cool Investor', vibe: 'Keep calm. Keep flexible.' },
    { slug: 'smooth-operator', name: 'The Smooth Operator', vibe: 'Steady moves. Smarter money.' },
    { slug: 'patient-player', name: 'The Patient Player', vibe: 'Play the long game.' },
    { slug: 'opportunity-hunter', name: 'The Opportunity Hunter', vibe: 'Spot the opportunity. Think long term.' }
  ];

  personalityDefs.forEach(p => {
    ['', '-male', '-female'].forEach(variant => {
      const cardName = `share-${p.slug}${variant}.jpg`;
      if (fs.existsSync(`src/assets/${cardName}`)) {
        fs.copyFileSync(`src/assets/${cardName}`, path.join(assetsDir, cardName));
        fs.copyFileSync(`src/assets/${cardName}`, path.join(outDir, cardName));
      }
    });

    // Generate individual share pages for social media cards (default, male, female)
    ['', '-male', '-female'].forEach(variant => {
      const pageFile = `${p.slug}${variant}.html`;
      const cardFile = variant ? `share-${p.slug}${variant}.jpg` : `share-${p.slug}.jpg`;
      const cleanName = p.name.replace(/^The\s+/, '');
      const sharePageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>I'm a ${cleanName}! What's Your Investor Type? | First Capital</title>
  <meta name="description" content="I just discovered my investor personality with First Capital: ${p.name}. Find your investor type here!" />

  <!-- Open Graph / WhatsApp / Facebook -->
  <meta property="og:site_name" content="First Capital" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://ai.loopsintegrated.co/fc/${pageFile}" />
  <meta property="og:title" content="I'm a ${cleanName}! What's Your Investor Type?" />
  <meta property="og:description" content="I just discovered my investor personality with First Capital: ${p.name} - &quot;${p.vibe}&quot;. Find your investor type here!" />
  <meta property="og:image" content="https://ai.loopsintegrated.co/fc/assets/${cardFile}" />
  <meta property="og:image:secure_url" content="https://ai.loopsintegrated.co/fc/assets/${cardFile}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="First Capital - ${p.name}" />

  <!-- Schema.org / WhatsApp fallback -->
  <meta itemprop="name" content="I'm a ${cleanName}! What's Your Investor Type?" />
  <meta itemprop="description" content="I just discovered my investor personality with First Capital: ${p.name}. Find your investor type here!" />
  <meta itemprop="image" content="https://ai.loopsintegrated.co/fc/assets/${cardFile}" />
  <link rel="image_src" href="https://ai.loopsintegrated.co/fc/assets/${cardFile}" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://ai.loopsintegrated.co/fc/${pageFile}" />
  <meta name="twitter:title" content="I'm a ${cleanName}! What's Your Investor Type?" />
  <meta name="twitter:description" content="I just discovered my investor personality: ${p.name}. What's yours? Take the 1-minute quiz!" />
  <meta name="twitter:image" content="https://ai.loopsintegrated.co/fc/assets/${cardFile}" />

  <!-- Preload share card -->
  <link rel="preload" as="image" href="./assets/${cardFile}" />
  <link rel="icon" href="./favicon.png" type="image/png" />
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; text-align: center; padding: 20px;">
  <div style="max-width: 580px; width: 100%; background: #ffffff; color: #0f172a; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4); padding: 0 0 28px 0; text-align: center;">
    <img src="./assets/${cardFile}" alt="${p.name}" style="width: 100%; height: auto; display: block; border-bottom: 3px solid #f1c91e;" />
    
    <div style="padding: 24px 24px 0 24px;">
      <h1 style="font-size: 22px; font-weight: 800; color: #142d27; margin: 0 0 8px 0;">I'm a ${p.name}!</h1>
      <p style="color: #64748b; font-size: 14px; margin: 0 0 20px 0; line-height: 1.5;">
        Take the quick 1-minute First Capital quiz to discover your investor personality and find your match.
      </p>
      
      <div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
        <a href="./index.html?quiz=open" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: calc(100% - 32px); max-width: 380px; padding: 15px 24px; background: #f1c91e; color: #142d27; font-weight: 800; font-size: 15px; border-radius: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(241, 201, 30, 0.35); transition: transform 0.2s;">
          <span>Find My Investor Type →</span>
        </a>
        <a href="./index.html" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: calc(100% - 32px); max-width: 380px; padding: 11px 20px; background: #f1f5f9; color: #334155; font-weight: 700; font-size: 13px; border-radius: 12px; text-decoration: none; border: 1px solid #e2e8f0;">
          <span>← Back to Result Page / Home</span>
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;
      fs.writeFileSync(path.join(outDir, pageFile), sharePageHtml, 'utf-8');
    });
  });

  fs.copyFileSync('public/favicon.png', path.join(assetsDir, 'favicon.png'));
  fs.copyFileSync('public/favicon.png', path.join(outDir, 'favicon.png'));
  console.log('Copied all image assets and created share pages in outDir');

  // Slider interactive script
  const sliderScript = `
<script>
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.testimonial-slider').forEach(function(slider) {
    var active = 0;
    var frame = slider.querySelector('.slider-frame > div');
    if (!frame) return;
    var slides = frame.children;
    var dots = slider.querySelectorAll('.slider-dot');
    var count = slides.length;

    function update(idx) {
      active = (idx + count) % count;
      frame.style.transform = 'translateX(-' + (active * 100) + '%)';
      dots.forEach(function(dot, i) {
        if (i === active) {
          dot.classList.remove('bg-transparent');
          dot.classList.add('bg-primary');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('bg-primary');
          dot.classList.add('bg-transparent');
          dot.removeAttribute('aria-current');
        }
      });
      for (var s = 0; s < slides.length; s++) {
        slides[s].setAttribute('aria-hidden', s !== active);
      }
    }

    var prevBtn = slider.querySelector('button[aria-label="Previous testimonial"]');
    var nextBtn = slider.querySelector('button[aria-label="Next testimonial"]');
    if (prevBtn) prevBtn.addEventListener('click', function() { update(active - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { update(active + 1); });
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() { update(i); });
    });
    setInterval(function() { update(active + 1); }, 6000);
  });
});
</script>
`;

const optionModalHtmlAndScript = `
<!-- INVESTMENT OPTION DETAIL MODAL FOR STATIC EXPORT -->
<div id="fck-option-modal" class="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6" style="display:none;">
  <div id="fck-option-backdrop" class="fixed inset-0 bg-black/80 transition-opacity"></div>
  <div class="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar bg-background border border-border p-6 sm:p-8 shadow-2xl" style="scrollbar-width: none; -ms-overflow-style: none;">
    <button id="fck-option-close" class="absolute right-4 top-4 size-8 border border-primary text-primary hover:bg-primary/10 flex items-center justify-center cursor-pointer transition-colors" aria-label="Close">
      <svg class="size-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
    <div id="fck-option-body" class="space-y-6"></div>
  </div>
</div>

<script>
(function() {
  var iconDollar = '<svg xmlns="http://www.w3.org/2000/svg" class="size-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>';
  var iconShield = '<svg xmlns="http://www.w3.org/2000/svg" class="size-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>';
  var iconChart = '<svg xmlns="http://www.w3.org/2000/svg" class="size-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/></svg>';

  var optionsData = {
    'unit-trust': {
      number: '01',
      title: 'Unit Trust Funds',
      fullCopy: '',
      products: [
        {
          icon: iconDollar,
          title: 'Money Market Fund',
          copy: 'For investors who want to keep their money accessible while putting it to work.',
          tags: ['Short-term', 'Relatively lower risk', 'Withdraw anytime', 'Start with LKR 1,000']
        },
        {
          icon: iconShield,
          title: 'Fixed Income Fund',
          copy: 'For investors looking for relatively stable returns while keeping access to their money.',
          tags: ['Medium to long term', 'Relatively stable returns', 'Access anytime', 'Start with LKR 1,000']
        },
        {
          icon: iconChart,
          title: 'Equity Fund',
          copy: 'For investors looking to grow their wealth over the long term through the stock market and who are comfortable with market fluctuations.',
          tags: ['Long-term', 'Growth', 'Market exposure', 'Start with LKR 1,000']
        }
      ],
      video: {
        title: 'What are Unit Trust Funds?',
        url: 'https://www.tiktok.com/@first.capital/video/7593165117668265223',
        platform: 'TikTok'
      },
      disclaimer: '*Disclaimers: Past performance is not an indicator of future performance | Investors are advised to read and understand the contents of Key Investor Information Document (KIID) | The fund is approved by the Securities and Exchange Commission of Sri Lanka (SEC) | Please refer to the Procedure Guide related to Unit Trust Funds to understand our internal procedures related to products and transactions: ',
      guideUrl: 'https://firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf',
      guideLabel: 'firstcapital.lk/wp-content/uploads/2026/02/FCAM-UT-Procedure-Guide-to-Investors.pdf'
    },
    'gov-securities': {
      number: '02',
      title: 'Government Securities',
      fullCopy: '',
      simplyPut: 'You invest → the government uses your money → you receive interest → your investment is repaid at maturity.',
      keyBenefits: ['Government-issued', 'Regular interest', 'Defined maturity', 'Risk-free instrument'],
      video: {
        title: 'Government Securities explained',
        url: 'https://www.youtube.com/shorts/HGL82Tv1wJE',
        platform: 'YouTube'
      },
      disclaimer: '*Disclaimer: Terms & Conditions apply | Please refer to the Procedure Guide related Treasuries/Government Securities to understand our internal procedures related to products and transactions: ',
      guideUrl: 'https://firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf',
      guideLabel: 'firstcapital.lk/wp-content/uploads/2026/07/Information-Memorandum-FCT.pdf'
    },
    'equities': {
      number: '03',
      title: 'Equities',
      fullCopy: '',
      simplyPut: 'You buy shares → you own a small part of a company → the share value can rise or fall → you can benefit if the value increases.',
      keyBenefits: ['Long-term growth potential', 'Own listed shares', 'Market participation'],
      video: {
        title: 'How do equities work?',
        url: 'https://www.youtube.com/shorts/HGL82Tv1wJE',
        platform: 'YouTube'
      },
      disclaimer: '*Disclaimer: Investments are subject to market risks | Please refer to the Procedure Guide related to Stockbrokering/Equities to understand our internal procedures related to products and transactions: ',
      guideUrl: 'https://firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf',
      guideLabel: 'https://firstcapital.lk/wp-content/uploads/2026/09/FCE-procedure-guide_.pdf'
    }
  };

  var modal = document.getElementById('fck-option-modal');
  var backdrop = document.getElementById('fck-option-backdrop');
  var closeBtn = document.getElementById('fck-option-close');
  var bodyContainer = document.getElementById('fck-option-body');

  function openOptionModal(optId) {
    var data = optionsData[optId];
    if (!data || !modal || !bodyContainer) return;

    var html = '<div class="space-y-6 text-left">';
    html += '<div class="space-y-2">' +
      '<div class="flex items-center gap-2">' +
        '<span class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Investment Option Details</span>' +
      '</div>' +
      '<h3 class="text-2xl sm:text-3xl font-extrabold text-[#1a214c]">' + data.title + '</h3>' +
      (data.fullCopy ? '<p class="text-sm sm:text-base text-muted-foreground leading-relaxed pt-1">' + data.fullCopy + '</p>' : '') +
    '</div>';

    if (data.products) {
      html += '<div class="space-y-3">' +
        '<h4 class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Available Fund Types:</h4>' +
        '<div class="grid gap-3 sm:grid-cols-3">';
      data.products.forEach(function(p) {
        html += '<div class="border border-border bg-card p-4 flex flex-col justify-between">' +
          '<div>' +
            p.icon +
            '<h5 class="mt-3 text-base font-extrabold">' + p.title + '</h5>' +
            '<p class="mt-2 text-xs leading-5 text-muted-foreground">' + p.copy + '</p>' +
          '</div>' +
          '<div class="mt-4 flex flex-wrap gap-1">';
        p.tags.forEach(function(t) {
          html += '<span class="border border-border bg-secondary px-1.5 py-0.5 text-[9px] font-bold">' + t + '</span>';
        });
        html += '</div></div>';
      });
      html += '</div></div>';
    }

    if (data.simplyPut) {
      var steps = data.simplyPut.split('→');
      html += '<div class="space-y-2.5">' +
        '<h4 class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Simply put:</h4>' +
        '<div class="flex flex-wrap items-center gap-2 sm:gap-2.5">';
      steps.forEach(function(step, idx) {
        html += '<div class="flex items-center gap-2 sm:gap-2.5">' +
          '<div class="flex items-center gap-2 border border-border bg-card px-3.5 py-2 shadow-xs">' +
            '<span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground">' + (idx + 1) + '</span>' +
            '<span class="text-xs sm:text-sm font-bold text-foreground">' + step.trim() + '</span>' +
          '</div>' +
          (idx < steps.length - 1 ? '<svg xmlns="http://www.w3.org/2000/svg" class="size-4 shrink-0 text-primary stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>' : '') +
        '</div>';
      });
      html += '</div></div>';
    }

    if (data.keyBenefits) {
      html += '<div class="space-y-2">' +
        '<h4 class="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Key Benefits:</h4>' +
        '<div class="flex flex-wrap gap-2">';
      data.keyBenefits.forEach(function(b) {
        html += '<span class="border border-border bg-card px-3 py-1.5 text-xs sm:text-sm font-bold text-foreground">' + b + '</span>';
      });
      html += '</div></div>';
    }

    if (data.video) {
      html += '<div class="flex flex-wrap items-center justify-between gap-3 border border-primary/30 bg-primary/5 p-3.5">' +
        '<div class="flex items-center gap-2.5">' +
          '<div class="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">' +
            '<svg xmlns="http://www.w3.org/2000/svg" class="size-4 fill-current ml-0.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>' +
          '</div>' +
          '<div>' +
            '<p class="text-xs font-bold text-foreground">' + data.video.title + '</p>' +
            '<p class="text-[10px] text-muted-foreground">Quick video explanation (' + data.video.platform + ')</p>' +
          '</div>' +
        '</div>' +
        '<a href="' + data.video.url + '" target="_blank" rel="noreferrer" class="inline-flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground px-3.5 py-1.5 hover:bg-primary/90 transition-colors">Watch Video <svg xmlns="http://www.w3.org/2000/svg" class="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg></a>' +
      '</div>';
    }

    html += '<div class="flex flex-col sm:flex-row gap-3 pt-2">' +
      '<a href="https://portal.firstcapital.lk/#/sign-up" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center bg-primary text-primary-foreground font-extrabold py-3 px-4 text-xs sm:text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors flex-1 text-center">I WOULD LIKE TO CREATE MY ACCOUNT →</a>' +
      '<a href="https://firstcapital.lk/contact-us/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center border border-primary bg-background text-primary font-extrabold py-3 px-4 text-xs sm:text-sm uppercase tracking-wider hover:bg-primary/10 transition-colors flex-1 text-center">I WOULD LIKE TO SPEAK TO SOMEONE FIRST</a>' +
    '</div>';

    html += '<p class="text-[10px] sm:text-[11px] leading-relaxed text-muted-foreground border-t border-border pt-3">' +
      '<span>' + data.disclaimer + '</span>' +
      (data.guideUrl ? ' <a href="' + data.guideUrl + '" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-semibold ml-1 inline-flex items-center gap-0.5 break-all">' + (data.guideLabel || data.guideUrl) + ' <svg xmlns="http://www.w3.org/2000/svg" class="size-2.5 inline shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg></a>' : '') +
    '</p>';
    html += '</div>';

    bodyContainer.innerHTML = html;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeOptionModal() {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  if (backdrop) backdrop.addEventListener('click', closeOptionModal);
  if (closeBtn) closeBtn.addEventListener('click', closeOptionModal);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeOptionModal();
  });

  function initOptionCards() {
    var cards = document.querySelectorAll('[data-option-id]');
    cards.forEach(function(card) {
      card.addEventListener('click', function() {
        var optId = card.getAttribute('data-option-id');
        openOptionModal(optId);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOptionCards);
  } else {
    initOptionCards();
  }
})();
</script>
`;

  function cleanHtml(rawHtml, depth = 0) {
    const prefix = depth === 0 ? './' : '../';

    let html = rawHtml;
    // Remove data-tsd-source attributes
    html = html.replace(/\s*data-tsd-source="[^"]*"/g, '');
    // Remove dev styles, modulepreload links, and vite dev entry scripts
    html = html.replace(/<link[^>]*data-tanstack-router-dev-styles[^>]*\/?>/gi, '');
    html = html.replace(/<link[^>]*modulepreload[^>]*\/?>/gi, '');
    html = html.replace(/<link[^>]*href="\/src\/styles\.css"[^>]*\/?>/gi, '');
    html = html.replace(/<script[^>]*virtual:tanstack-start-dev-client-entry[^>]*><\/script>/gi, '');
    html = html.replace(/<script[^>]*data-tsr-stream-part[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<script>document\.currentScript\.remove\(\);[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<script>\(function\(a,f\)[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<!--\/\$--\>/g, '');
    html = html.replace(/<!--\/\*.*?-->/g, '');

    // Add production inlined stylesheet (100% fail-safe against 404s/subfolders) plus external links
    const cssTag = `  <style id="fck-critical-styles">
${compiledCssContent}
  </style>
  <link rel="stylesheet" href="${prefix}assets/styles.css" />
  <link rel="stylesheet" href="${prefix}styles.css" />
  <link rel="image_src" href="https://ai.loopsintegrated.co/fc/assets/og-image.jpg" />
  <script>
    // Universal image recovery: seamlessly switches between ./assets/ and ./ if hosting folder is flattened
    document.addEventListener('error', function(e) {
      if (e.target && e.target.tagName === 'IMG') {
        var img = e.target;
        if (!img.dataset.fckRetried) {
          img.dataset.fckRetried = '1';
          var s = img.getAttribute('src') || '';
          if (s.indexOf('assets/') !== -1) {
            img.src = '${prefix}' + s.split('assets/').pop();
          } else {
            var filename = s.split('/').pop().split('?')[0];
            img.src = '${prefix}assets/' + filename;
          }
        }
      }
    }, true);
  </script>`;
    html = html.replace('</head>', `${cssTag}\n</head>`);
    html = html.replace(/https:\/\/ai\.loopsintegrated\.co\/assets\/og-image\.jpg/g, 'https://ai.loopsintegrated.co/fc/assets/og-image.jpg');
    html = html.replace(/https:\/\/ai\.loopsintegrated\.co\/firstcapitalpages\/assets\/og-image\.jpg/g, 'https://ai.loopsintegrated.co/fc/assets/og-image.jpg');

    // Fix image paths robustly (use direct prefix paths matching uploaded files with cache busting)
    html = html.replace(/src="[^"]*first-capital-logo\.png[^"]*"/gi, `src="${prefix}first-capital-logo.png?v=1"`);
    html = html.replace(/href="[^"]*first-capital-logo\.png[^"]*"/gi, `href="${prefix}first-capital-logo.png?v=1"`);
    html = html.replace(/src="[^"]*FCmain\.png[^"]*"/gi, `src="${prefix}FCmain.png?v=2"`);
    html = html.replace(/href="[^"]*FCmain\.png[^"]*"/gi, `href="${prefix}FCmain.png?v=2"`);
    html = html.replace(/src="[^"]*investors\.png[^"]*"/gi, `src="${prefix}FCmain.png?v=2"`);
    html = html.replace(/href="[^"]*investors\.png[^"]*"/gi, `href="${prefix}FCmain.png?v=2"`);
    html = html.replace(/src="[^"]*investor-personalities\.jpg[^"]*"/gi, `src="${prefix}FCmain.png?v=2"`);
    html = html.replace(/href="[^"]*investor-personalities\.jpg[^"]*"/gi, `href="${prefix}FCmain.png?v=2"`);
    html = html.replace(/src="[^"]*\/assets\/image\.png[^"]*"/gi, `src="${prefix}image.png?v=1"`);
    html = html.replace(/href="[^"]*\/assets\/image\.png[^"]*"/gi, `href="${prefix}image.png?v=1"`);
    html = html.replace(/src="\/favicon\.png[^"]*"/gi, `src="${prefix}favicon.png?v=1"`);
    html = html.replace(/href="\/favicon\.png[^"]*"/gi, `href="${prefix}favicon.png?v=1"`);

    // Fix investor type avatar icons (01, 02, 03, 04)
    for (let i = 1; i <= 4; i++) {
      const num = String(i).padStart(2, '0');
      const filename = `investor-type-${num}.png`;
      html = html.replace(new RegExp(`src="[^"]*investor-type-${num}\\.png[^"]*"`, 'gi'), `src="${prefix}${filename}?v=1"`);
      html = html.replace(new RegExp(`href="[^"]*investor-type-${num}\\.png[^"]*"`, 'gi'), `href="${prefix}${filename}?v=1"`);
    }

    // Clean preload links that pointed to old dev paths or unused hidden elements
    html = html.replace(/<link rel="preload" as="image"[^>]*investor-type-[^>]*\/?>/gi, '');
    html = html.replace(/<link rel="preload" as="image"[^>]*FCmain[^>]*\/?>/gi, `<link rel="preload" as="image" href="${prefix}FCmain.png?v=2" />`);
    html = html.replace(/<link rel="preload" as="image"[^>]*first-capital-logo[^>]*\/?>/gi, `<link rel="preload" as="image" href="${prefix}first-capital-logo.png?v=1" />`);
    html = html.replace(/<link rel="preload" as="image"[^>]*investors[^>]*\/?>/gi, `<link rel="preload" as="image" href="${prefix}FCmain.png?v=2" />`);

    // Fix Admin link in footer if present
    html = html.replace(/href="\/admin"/g, `href="${prefix}admin"`);

    // Insert interactive slider script, Quiz Modal, and Investment Option Modal
    const modalFormatted = quizModalHtmlAndScript.replace(/__PREFIX__/g, prefix);
    html = html.replace('</body>', `${sliderScript}\n${modalFormatted}\n${optionModalHtmlAndScript}\n</body>`);

    return html;
  }

  const page1 = cleanHtml(html1, 0);
  const page2 = cleanHtml(html2, 1);

  fs.writeFileSync(path.join(outDir, 'index.html'), page1, 'utf-8');
  fs.writeFileSync(path.join(option2Dir, 'index.html'), page2, 'utf-8');
  console.log('Saved firstcapitalpages/index.html and firstcapitalpages/design-option-2/index.html');

  // Generate 4 dedicated personality share landing pages with specific OG images & crawler optimization
  const SHARE_PROFILES = [
    {
      slug: 'keep-it-cool',
      name: 'The Keep-It-Cool Investor',
      style: 'Flexible & Agile',
      vibe: 'Keep calm. Keep flexible.',
      card: 'share-keep-it-cool.jpg'
    },
    {
      slug: 'smooth-operator',
      name: 'The Smooth Operator',
      style: 'Steady & Flexible',
      vibe: 'Steady moves. Smarter money.',
      card: 'share-smooth-operator.jpg'
    },
    {
      slug: 'patient-player',
      name: 'The Patient Player',
      style: 'Long-term & income-focused',
      vibe: 'Play the long game.',
      card: 'share-patient-player.jpg'
    },
    {
      slug: 'opportunity-hunter',
      name: 'The Opportunity Hunter',
      style: 'Growth-focused',
      vibe: 'Spot the opportunity. Think long term.',
      card: 'share-opportunity-hunter.jpg'
    }
  ];

  for (const sp of SHARE_PROFILES) {
    const cleanName = sp.name.replace(/^The\s+/, '');
    
    // Generate 3 variations: default, -male, -female
    const variants = [
      { filename: `${sp.slug}.html`, card: sp.card, urlSlug: sp.slug },
      { filename: `${sp.slug}-male.html`, card: `share-${sp.slug}-male.jpg`, urlSlug: `${sp.slug}-male` },
      { filename: `${sp.slug}-female.html`, card: `share-${sp.slug}-female.jpg`, urlSlug: `${sp.slug}-female` }
    ];

    for (const v of variants) {
      const shareHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>I'm a ${cleanName}! What's Your Investor Type? | First Capital</title>
  <meta name="description" content="I just discovered my investor personality with First Capital: ${sp.name} (${sp.style}). “${sp.vibe}” What's yours? Take the 1-minute quiz!" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://ai.loopsintegrated.co/fc/${v.urlSlug}.html" />
  <meta property="og:title" content="I'm a ${cleanName}! What's Your Investor Type?" />
  <meta property="og:description" content="I just discovered my investor personality: ${sp.name} (${sp.style}) • “${sp.vibe}”. Take the 1-minute quiz to find out yours!" />
  <meta property="og:image" content="https://ai.loopsintegrated.co/fc/${v.card}" />
  <meta property="og:image:secure_url" content="https://ai.loopsintegrated.co/fc/${v.card}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="First Capital - ${sp.name}" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://ai.loopsintegrated.co/fc/${v.urlSlug}.html" />
  <meta name="twitter:title" content="I'm a ${cleanName}! What's Your Investor Type?" />
  <meta name="twitter:description" content="I just discovered my investor personality: ${sp.name} (${sp.style}). What's yours? Take the 1-minute quiz!" />
  <meta name="twitter:image" content="https://ai.loopsintegrated.co/fc/${v.card}" />
  <link rel="image_src" href="https://ai.loopsintegrated.co/fc/${v.card}" />

  <!-- Preload share card -->
  <link rel="preload" as="image" href="./${v.card}" />
  <link rel="icon" href="./favicon.png" type="image/png" />
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; text-align: center; padding: 20px;">
  <div style="max-width: 580px; width: 100%; background: #ffffff; color: #0f172a; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4); padding: 0 0 28px 0; text-align: center;">
    <img src="./${v.card}" alt="${sp.name}" style="width: 100%; height: auto; display: block; border-bottom: 3px solid #f1c91e;" onerror="this.src='./assets/${v.card}'" />
    
    <div style="padding: 24px 24px 0 24px;">
      <h1 style="font-size: 22px; font-weight: 800; color: #142d27; margin: 0 0 8px 0;">I'm a ${cleanName}!</h1>
      <p style="color: #64748b; font-size: 14px; margin: 0 0 20px 0; line-height: 1.5;">
        Take the quick 1-minute First Capital quiz to discover your investor personality and find your match.
      </p>
      
      <a href="./index.html?quiz=open" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: calc(100% - 32px); max-width: 380px; padding: 16px 28px; background: #f1c91e; color: #142d27; font-weight: 800; font-size: 16px; border-radius: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(241, 201, 30, 0.35); transition: transform 0.2s;">
        <span>Find My Investor Type →</span>
      </a>
    </div>
  </div>

  <script>
    // Seamless human redirect after a short moment if user is clicking through from a social feed
    (function() {
      var ua = (navigator.userAgent || '').toLowerCase();
      var isSocialScraper = /facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegram|slack|pinterest|bingbot|googlebot/i.test(ua);
      if (!isSocialScraper) {
        setTimeout(function() {
          window.location.replace('./index.html?quiz=open');
        }, 1200);
      }
    })();
  </script>
</body>
</html>`;

      fs.writeFileSync(path.join(outDir, v.filename), shareHtml, 'utf-8');
    }
  }
  console.log('Saved all 12 individual personality share landing pages with custom OG tags');

  // Bundle and Export Standalone Admin Portal
  console.log('Building and exporting standalone Admin Portal...');
  const adminOutDir = path.join(outDir, 'admin');
  if (!fs.existsSync(adminOutDir)) {
    fs.mkdirSync(adminOutDir, { recursive: true });
  }

  await viteBuild({
    base: './',
    configFile: false,
    plugins: [
      reactPlugin(),
      tailwindcssPlugin(),
      tsconfigPathsPlugin()
    ],
    build: {
      outDir: adminOutDir,
      emptyOutDir: false,
      rollupOptions: {
        input: {
          index: path.resolve('admin.html')
        }
      }
    }
  });

  const builtAdminHtml = path.join(adminOutDir, 'admin.html');
  const adminIndexHtml = path.join(adminOutDir, 'index.html');
  if (fs.existsSync(builtAdminHtml)) {
    fs.copyFileSync(builtAdminHtml, adminIndexHtml);
  }
  console.log('Admin Portal successfully built into firstcapitalpages/admin/index.html');

  // Copy logo and favicon to admin directory directly
  if (fs.existsSync('public/first-capital-logo.png')) {
    fs.copyFileSync('public/first-capital-logo.png', path.join(adminOutDir, 'first-capital-logo.png'));
  }
  if (fs.existsSync('public/favicon.png')) {
    fs.copyFileSync('public/favicon.png', path.join(adminOutDir, 'favicon.png'));
  }

  // Copy all assets from admin/assets into main assets/ so ANY relative or root request resolves
  const adminAssetsDir = path.join(adminOutDir, 'assets');
  const mainAssetsDir = path.join(outDir, 'assets');
  if (fs.existsSync(adminAssetsDir)) {
    if (fs.existsSync('public/first-capital-logo.png')) {
      fs.copyFileSync('public/first-capital-logo.png', path.join(adminAssetsDir, 'first-capital-logo.png'));
    }
    if (fs.existsSync('public/favicon.png')) {
      fs.copyFileSync('public/favicon.png', path.join(adminAssetsDir, 'favicon.png'));
    }
    const adminAssets = fs.readdirSync(adminAssetsDir);
    for (const f of adminAssets) {
      fs.copyFileSync(path.join(adminAssetsDir, f), path.join(mainAssetsDir, f));
    }
    console.log('Copied admin bundle assets into main assets/ directory for dual-path resolution.');
  }

  // Create .htaccess for Hostinger Apache / LiteSpeed
  const htaccess = `# Apache / LiteSpeed configuration for Hostinger subfolder
<IfModule mod_rewrite.c>
  RewriteEngine On
  DirectoryIndex index.html

  # 1. Serve existing files and directories directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # 1b. Dual-path fallback: If assets/filename.png is requested but only filename.png exists
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^assets/(.+)$ $1 [L]

  # 1c. Dual-path fallback: If filename.png is requested but only assets/filename.png exists
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^([^/]+\\.(png|jpg|jpeg|svg|gif|webp|ico))$ assets/$1 [L]

  # 2. Do NOT rewrite backend scripts
  RewriteRule \\.(php|json)$ - [L]

  # 3. Enforce trailing slash for /admin so browser resolves relative assets to /admin/assets/
  RewriteRule ^admin$ admin/ [R=301,L]
  RewriteRule ^admin\\.html$ admin/ [R=301,L]
  RewriteRule ^admin/?$ admin/index.html [L]

  # 4. Route /design-option-2 cleanly
  RewriteRule ^design-option-2$ design-option-2/ [R=301,L]
  RewriteRule ^design-option-2/?$ design-option-2/index.html [L]

  # 5. Route personality share links cleanly
  RewriteRule ^(keep-it-cool|smooth-operator|patient-player|opportunity-hunter)(-(?:male|female))?/?$ $1$2.html [L]
</IfModule>

# Enable Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

# Cache headers for static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
`;
  fs.writeFileSync(path.join(outDir, '.htaccess'), htaccess, 'utf-8');
  console.log('Generated firstcapitalpages/.htaccess');

  // Also sync key static pages and folders to root so hosting in /fc/ serves directly from root
  try {
    fs.copyFileSync(path.join(outDir, 'index.html'), path.resolve('index.html'));
    if (fs.existsSync(path.join(outDir, 'styles.css'))) {
      fs.copyFileSync(path.join(outDir, 'styles.css'), path.resolve('styles.css'));
    }
    const copyRecursive = (src, dest) => {
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      for (const item of fs.readdirSync(src)) {
        const s = path.join(src, item);
        const d = path.join(dest, item);
        if (fs.statSync(s).isDirectory()) {
          copyRecursive(s, d);
        } else {
          fs.copyFileSync(s, d);
        }
      }
    };
    copyRecursive(path.join(outDir, 'design-option-2'), path.resolve('design-option-2'));
    copyRecursive(path.join(outDir, 'admin'), path.resolve('admin'));
    copyRecursive(path.join(outDir, 'assets'), path.resolve('assets'));
    copyRecursive(path.join(outDir, 'api'), path.resolve('api'));
    console.log('Synchronized static bundles to root for instant /fc/ hosting.');
  } catch (syncErr) {
    console.log('Note on root sync:', syncErr.message);
  }

  try {
    const { execSync } = await import('node:child_process');
    execSync('python scripts/zip.py', { stdio: 'inherit' });
  } catch (e) {
    console.log('Note: could not auto-zip, folder firstcapitalpages is ready.');
  }
}

exportStatic().catch(err => {
  console.error(err);
  process.exit(1);
});
