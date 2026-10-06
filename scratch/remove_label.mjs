import fs from 'node:fs';

['firstcapitalpages/index.html', 'firstcapitalpages/design-option-2/index.html'].forEach(fp => {
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');
  const target = '<p class="mb-4 text-xs font-extrabold uppercase text-muted-foreground">First Capital Investor Week</p>';
  if (html.includes(target)) {
    html = html.replace(target, '');
    fs.writeFileSync(fp, html, 'utf8');
    console.log('Removed from', fp);
  } else {
    console.log('Not found in', fp);
  }
});
