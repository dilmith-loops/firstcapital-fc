async function check() {
  const headers = {
    'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'Accept': '*/*'
  };

  try {
    const r1 = await fetch('https://ai.loopsintegrated.co/assets/og-image.jpg', { headers });
    console.log('GET /assets/og-image.jpg:', r1.status, r1.headers.get('content-type'), r1.headers.get('content-length'));
  } catch (err) {
    console.log('Error GET /assets/og-image.jpg:', err.message);
  }

  try {
    const r2 = await fetch('https://ai.loopsintegrated.co/og-image.jpg', { headers });
    console.log('GET /og-image.jpg:', r2.status, r2.headers.get('content-type'), r2.headers.get('content-length'));
  } catch (err) {
    console.log('Error GET /og-image.jpg:', err.message);
  }

  try {
    const r3 = await fetch('https://ai.loopsintegrated.co/', { headers });
    const text = await r3.text();
    console.log('GET / status:', r3.status);
    const matches = text.match(/<meta[^>]+(?:og:image|twitter:image)[^>]+>/gi);
    console.log('Meta tags on live site:', matches);
  } catch (err) {
    console.log('Error GET /:', err.message);
  }
}

check();
