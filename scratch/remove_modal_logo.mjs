import fs from 'node:fs';

const oldHeaderRegex = /<!-- Modal Fixed Header -->\s*<div class="shrink-0 flex items-center justify-between px-6 sm:px-8 py-3\.5 sm:py-4 border-b border-slate-100 bg-white">\s*<img src="[^"]*assets\/first-capital-logo\.png"[^>]*\/>\s*(<button id="fck-modal-close"[\s\S]*?<\/button>)\s*<\/div>/;

const newHeader = `<!-- Modal Fixed Header with Close Button -->
    <div class="shrink-0 flex items-center justify-end px-5 sm:px-7 pt-3.5 pb-1 bg-white">
      $1
    </div>`;

['firstcapitalpages/index.html', 'firstcapitalpages/design-option-2/index.html'].forEach(fp => {
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');
  if (oldHeaderRegex.test(html)) {
    html = html.replace(oldHeaderRegex, newHeader);
    fs.writeFileSync(fp, html, 'utf8');
    console.log('Successfully updated modal header in', fp);
  } else {
    console.log('Regex did not match in', fp);
  }
});
