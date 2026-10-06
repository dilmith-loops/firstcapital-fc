import fs from 'node:fs';

const oldButtons = `          <!-- CTA 1 and CTA 2 -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
            <button
              id="fck-btn-explore"
              type="button"
              class="w-full sm:w-auto bg-[#f1c91e] hover:bg-[#e0b815] active:scale-[0.98] text-[#142d27] px-6 py-2.5 sm:py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore My Investment Match</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>

            <button
              id="fck-btn-share"
              type="button"
              class="w-full sm:w-auto border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg id="fck-share-icon" xmlns="http://www.w3.org/2000/svg" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
              <span id="fck-share-text">Share Your Result</span>
            </button>
          </div>`;

const newButtons = `          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-2.5 mb-3 w-full">
            <button
              id="fck-btn-explore"
              type="button"
              class="w-full sm:w-auto flex-1 bg-[#f1c91e] hover:bg-[#e0b815] active:scale-[0.98] text-[#142d27] px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore My Investment Match</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>

            <a
              id="fck-btn-open-account"
              href="https://portal.firstcapital.lk/#/sign-up"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full sm:w-auto flex-1 bg-[#f1c91e] hover:bg-[#e0b815] active:scale-[0.98] text-[#142d27] px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <span>I’m Ready to Open an Account</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>

          <div class="flex items-center justify-center mb-3">
            <button
              id="fck-btn-share"
              type="button"
              class="w-full sm:w-auto border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg id="fck-share-icon" xmlns="http://www.w3.org/2000/svg" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
              <span id="fck-share-text">Share Your Result</span>
            </button>
          </div>`;

['firstcapitalpages/index.html', 'firstcapitalpages/design-option-2/index.html'].forEach(fp => {
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes(oldButtons)) {
    html = html.replace(oldButtons, newButtons);
    fs.writeFileSync(fp, html, 'utf8');
    console.log('Updated buttons in', fp);
  } else {
    console.log('Old buttons not found directly in', fp);
  }
});
