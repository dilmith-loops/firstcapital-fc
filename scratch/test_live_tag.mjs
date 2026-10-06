async function run() {
  const res = await fetch('https://ai.loopsintegrated.co/firstcapitalpages/index.html');
  const text = await res.text();
  const match = text.match(/<meta property="og:image"[^>]+>/gi);
  console.log('Match on live server:', match);
}
run();
