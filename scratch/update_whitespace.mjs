import fs from 'node:fs';

['firstcapitalpages/index.html', 'firstcapitalpages/design-option-2/index.html'].forEach(fp => {
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');
  const target = '<strong class="font-bold text-foreground">do the same with investing?</strong>';
  const replacement = '<strong class="whitespace-nowrap font-bold text-foreground">do the same with investing?</strong>';
  if (html.includes(target)) {
    html = html.replace(target, replacement);
    fs.writeFileSync(fp, html, 'utf8');
    console.log('Updated in', fp);
  } else {
    console.log('Target not found in', fp);
  }
});
