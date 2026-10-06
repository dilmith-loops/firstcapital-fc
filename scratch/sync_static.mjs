import fs from 'node:fs';

function updateFile(filePath, assetPrefix) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  const startMarker = '<div class="relative z-20 -mt-6 grid grid-cols-2 border border-border bg-background sm:grid-cols-4">';
  const endMarker = 'Opportunity Hunter</p></div></div>';

  const startIdx = html.indexOf(startMarker);
  if (startIdx === -1) {
    console.log('Start marker not found in', filePath);
    return;
  }
  const endIdx = html.indexOf(endMarker, startIdx);
  if (endIdx === -1) {
    console.log('End marker not found in', filePath);
    return;
  }

  const fullEndIdx = endIdx + endMarker.length;

  const newSnippet = `${startMarker}
<div class="flex flex-col p-3 sm:p-4"><div class="mb-2.5 size-11 sm:size-14 shrink-0 overflow-hidden rounded-full border-2 border-primary/40 bg-secondary/30 shadow-xs"><img src="${assetPrefix}investor-type-01.png" alt="Keep-It-Cool" class="size-full object-cover" width="56" height="56"/></div><span class="text-[10px] font-bold text-muted-foreground">01</span><p class="mt-1 text-xs font-extrabold leading-tight sm:text-sm">Keep-It-Cool</p></div>
<div class="flex flex-col p-3 sm:p-4 border-l border-border sm:border-l"><div class="mb-2.5 size-11 sm:size-14 shrink-0 overflow-hidden rounded-full border-2 border-primary/40 bg-secondary/30 shadow-xs"><img src="${assetPrefix}investor-type-02.png" alt="Smooth Operator" class="size-full object-cover" width="56" height="56"/></div><span class="text-[10px] font-bold text-muted-foreground">02</span><p class="mt-1 text-xs font-extrabold leading-tight sm:text-sm">Smooth Operator</p></div>
<div class="flex flex-col p-3 sm:p-4 border-t border-border sm:border-t-0 sm:border-l"><div class="mb-2.5 size-11 sm:size-14 shrink-0 overflow-hidden rounded-full border-2 border-primary/40 bg-secondary/30 shadow-xs"><img src="${assetPrefix}investor-type-03.png" alt="Patient Player" class="size-full object-cover" width="56" height="56"/></div><span class="text-[10px] font-bold text-muted-foreground">03</span><p class="mt-1 text-xs font-extrabold leading-tight sm:text-sm">Patient Player</p></div>
<div class="flex flex-col p-3 sm:p-4 border-l border-t border-border sm:border-t-0 sm:border-l"><div class="mb-2.5 size-11 sm:size-14 shrink-0 overflow-hidden rounded-full border-2 border-primary/40 bg-secondary/30 shadow-xs"><img src="${assetPrefix}investor-type-04.png" alt="Opportunity Hunter" class="size-full object-cover" width="56" height="56"/></div><span class="text-[10px] font-bold text-muted-foreground">04</span><p class="mt-1 text-xs font-extrabold leading-tight sm:text-sm">Opportunity Hunter</p></div>
</div>`;

  html = html.substring(0, startIdx) + newSnippet + html.substring(fullEndIdx);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Successfully updated', filePath);
}

updateFile('firstcapitalpages/index.html', './assets/');
updateFile('firstcapitalpages/design-option-2/index.html', '../assets/');
