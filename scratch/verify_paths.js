import fs from 'node:fs';

const page1 = fs.readFileSync('firstcapitalpages/index.html', 'utf8');
const page2 = fs.readFileSync('firstcapitalpages/design-option-2/index.html', 'utf8');

console.log('Page 1 matches:');
console.log(page1.match(/(?:src|href)="[^"]*investor-type[^"]*"/g));

console.log('Page 2 matches:');
console.log(page2.match(/(?:src|href)="[^"]*investor-type[^"]*"/g));
