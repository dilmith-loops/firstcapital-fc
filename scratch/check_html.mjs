import http from 'node:http';

function get(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    });
  });
}

async function run() {
  const p1 = await get('http://localhost:8080/');
  const p2 = await get('http://localhost:8080/design-option-2');
  console.log('Page 1 length:', p1.length, 'Page 2 length:', p2.length);

  const re = /(?:src|href)="([^"]+)"/g;
  const urls = new Set();
  let m;
  while ((m = re.exec(p1)) !== null) {
    if (
      !m[1].startsWith('http') &&
      !m[1].startsWith('#') &&
      !m[1].startsWith('tel:') &&
      !m[1].startsWith('mailto:')
    ) {
      urls.add(m[1]);
    }
  }
  console.log('Page 1 local links/scripts:', Array.from(urls));
}

run();
