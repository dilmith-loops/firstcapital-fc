import fs from 'node:fs';

const oldHtml = `            <p class="mt-2 text-[11px] leading-relaxed text-slate-500">
              <span id="fck-res-disclaimer"></span>
              <a id="fck-res-guide-link" href="#" target="_blank" rel="noopener noreferrer" class="text-emerald-800 hover:text-emerald-950 underline font-semibold ml-1 inline-flex items-center gap-0.5 break-all">
                <span id="fck-res-guide-label"></span>
                <svg xmlns="http://www.w3.org/2000/svg" class="size-3 inline shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
              </a>
            </p>`;

const newHtml = `            <div class="mt-2.5 pt-2 border-t border-slate-200/70">
              <button
                id="fck-disclaimer-toggle"
                type="button"
                class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer group"
                aria-expanded="false"
              >
                <span>* Disclaimers:</span>
                <span id="fck-disclaimer-toggle-label" class="text-emerald-800 underline group-hover:text-emerald-950 font-bold">Click to read more</span>
                <svg id="fck-disclaimer-chevron" xmlns="http://www.w3.org/2000/svg" class="size-3 text-slate-400 group-hover:text-slate-700 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div id="fck-disclaimer-content" class="mt-2 text-[10px] sm:text-[11px] leading-relaxed text-slate-500 border-l-2 border-emerald-600/40 pl-2.5 py-0.5" style="display:none;">
                <p>
                  <span id="fck-res-disclaimer"></span>
                  <a id="fck-res-guide-link" href="#" target="_blank" rel="noopener noreferrer" class="text-emerald-800 hover:text-emerald-950 underline font-semibold ml-1 inline-flex items-center gap-0.5 break-all">
                    <span id="fck-res-guide-label"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-2.5 inline shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                  </a>
                </p>
              </div>
            </div>`;

const oldJsVar = `  var btnRetake = document.getElementById('fck-btn-retake');

  var currentLead = { name: '', email: '', phone: '' };`;

const newJsVar = `  var btnRetake = document.getElementById('fck-btn-retake');

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

  var currentLead = { name: '', email: '', phone: '' };`;

const oldGuideLabel = `    guideLabel.innerText = prof.guideLabel;`;
const newGuideLabel = `    guideLabel.innerText = prof.guideLabel;
    setDisclaimerOpen(false);`;

['firstcapitalpages/index.html', 'firstcapitalpages/design-option-2/index.html'].forEach(fp => {
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');

  if (html.includes(oldHtml)) {
    html = html.replace(oldHtml, newHtml);
  }
  if (html.includes(oldJsVar)) {
    html = html.replace(oldJsVar, newJsVar);
  }
  if (html.includes(oldGuideLabel)) {
    html = html.replace(oldGuideLabel, newGuideLabel);
  }

  fs.writeFileSync(fp, html, 'utf8');
  console.log('Updated', fp);
});
