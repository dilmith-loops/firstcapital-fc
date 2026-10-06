async function testAssets() {
  const urls = [
    'https://ai.loopsintegrated.co/assets/first-capital-logo.png',
    'https://ai.loopsintegrated.co/assets/investor-personalities.jpg',
    'https://ai.loopsintegrated.co/first-capital-logo.png',
    'https://ai.loopsintegrated.co/firstcapitalpages/assets/first-capital-logo.png',
    'https://ai.loopsintegrated.co/firstcapitalpages/index.html'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      console.log(url, '-->', res.status, res.headers.get('content-type'), res.headers.get('content-length'));
    } catch(e) {
      console.log(url, '--> Error:', e.message);
    }
  }
}

testAssets();
