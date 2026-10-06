import fs from 'node:fs';

const targetBadge = `          <!-- Profile Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 mb-2.5">`;

const replacementWithAvatar = `          <!-- Character Avatar Icon -->
          <div class="mx-auto mb-3.5 size-20 sm:size-24 rounded-full overflow-hidden border-2 border-[#f1c91e]/60 bg-amber-50/50 shadow-md ring-4 ring-[#f1c91e]/20">
            <img id="fck-res-avatar" src="" alt="Investor Personality" class="size-full object-cover" width="96" height="96" />
          </div>

          <!-- Profile Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 mb-2.5">`;

const retakeRegex = /<!-- Retake Button -->\s*<div>\s*<button\s*id="fck-btn-retake"[\s\S]*?<\/button>\s*<\/div>/;

const jsShowResultTarget = `    document.getElementById('fck-res-number').innerText = 'Personality ' + prof.number;`;

const jsShowResultReplacement = (assetPrefix) => `    var avatarEl = document.getElementById('fck-res-avatar');
    if (avatarEl) {
      avatarEl.src = '${assetPrefix}investor-type-' + prof.number + '.png';
      avatarEl.alt = prof.name;
    }
    document.getElementById('fck-res-number').innerText = 'Personality ' + prof.number;`;

const files = [
  { path: 'firstcapitalpages/index.html', prefix: './assets/' },
  { path: 'firstcapitalpages/design-option-2/index.html', prefix: '../assets/' }
];

files.forEach(({ path, prefix }) => {
  if (!fs.existsSync(path)) return;
  let html = fs.readFileSync(path, 'utf8');

  if (html.includes(targetBadge)) {
    html = html.replace(targetBadge, replacementWithAvatar);
  }

  if (retakeRegex.test(html)) {
    html = html.replace(retakeRegex, '');
  }

  if (html.includes(jsShowResultTarget)) {
    html = html.replace(jsShowResultTarget, jsShowResultReplacement(prefix));
  }

  fs.writeFileSync(path, html, 'utf8');
  console.log('Updated', path);
});
