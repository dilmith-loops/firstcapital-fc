import fs from 'fs';
import path from 'path';

const personas = [
  {
    key: 'A',
    slug: 'keep-it-cool',
    name: 'The Keep-It-Cool Investor',
    vibe: 'Keep calm. Keep flexible.',
    desc: 'You value safety, liquidity, and stress-free financial peace of mind. You want steady returns with the flexibility to withdraw anytime.'
  },
  {
    key: 'B',
    slug: 'smooth-operator',
    name: 'The Smooth Operator',
    vibe: 'Steady moves. Smarter money.',
    desc: 'You look for balanced growth and smart consistency over short to medium horizons, enjoying predictable performance.'
  },
  {
    key: 'C',
    slug: 'patient-player',
    name: 'The Patient Player',
    vibe: 'Play the long game.',
    desc: 'You understand that real wealth takes discipline and compounding over time, staying steady through market cycles.'
  },
  {
    key: 'D',
    slug: 'opportunity-hunter',
    name: 'The Opportunity Hunter',
    vibe: 'Spot the opportunity. Think long term.',
    desc: 'You are proactive, driven by long-term growth and capital appreciation through market opportunities.'
  }
];

const variants = ['default', 'male', 'female'];

personas.forEach(p => {
  variants.forEach(gender => {
    const filename = gender === 'default' ? `${p.slug}.html` : `${p.slug}-${gender}.html`;
    const shareCardName = gender === 'female' ? `share-${p.slug}-female.jpg` : `share-${p.slug}-male.jpg`;
    
    // Live subfolder URL on Hostinger
    const primaryImgUrl = `https://ai.loopsintegrated.co/fc/firstcapitalpages/assets/${shareCardName}`;
    const pageUrl = `https://ai.loopsintegrated.co/fc/firstcapitalpages/${filename}`;
    
    const title = `I'm a ${p.name}! What's Your Investor Type? | First Capital`;
    const ogTitle = `I'm a ${p.name}! What's Your Investor Type?`;
    const ogDesc = `I just discovered my investor personality with First Capital: ${p.name} - "${p.vibe}". Take the 1-minute quiz to find yours!`;

    const html = `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${ogDesc}" />
  <meta name="author" content="First Capital" />

  <!-- Schema.org markup for Google+ / WhatsApp / Facebook -->
  <meta itemprop="name" content="${ogTitle}" />
  <meta itemprop="description" content="${ogDesc}" />
  <meta itemprop="image" content="${primaryImgUrl}" />

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:site_name" content="First Capital" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${ogDesc}" />
  <meta property="og:image" content="${primaryImgUrl}" />
  <meta property="og:image:secure_url" content="${primaryImgUrl}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="First Capital - ${p.name}" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@firstcapitallk" />
  <meta name="twitter:url" content="${pageUrl}" />
  <meta name="twitter:title" content="${ogTitle}" />
  <meta name="twitter:description" content="${ogDesc}" />
  <meta name="twitter:image" content="${primaryImgUrl}" />
  <link rel="image_src" href="${primaryImgUrl}" />

  <!-- Preload share card -->
  <link rel="preload" as="image" href="./assets/${shareCardName}" />
  <link rel="icon" href="./favicon.png" type="image/png" />
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; text-align: center; padding: 20px;">
  <div style="max-width: 580px; width: 100%; background: #ffffff; color: #0f172a; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4); padding: 0 0 28px 0; text-align: center;">
    <img src="./assets/${shareCardName}" alt="${p.name}" style="width: 100%; height: auto; display: block; border-bottom: 3px solid #f1c91e;" onerror="this.src='./${shareCardName}'" />
    
    <div style="padding: 24px 24px 0 24px;">
      <h1 style="font-size: 22px; font-weight: 800; color: #142d27; margin: 0 0 8px 0;">${ogTitle}</h1>
      <p style="color: #64748b; font-size: 14px; margin: 0 0 20px 0; line-height: 1.5;">
        Take the quick 1-minute First Capital quiz to discover your investor personality and find your match.
      </p>
      
      <div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
        <a href="./index.html?quiz=open" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: calc(100% - 32px); max-width: 380px; padding: 15px 24px; background: #f1c91e; color: #142d27; font-weight: 800; font-size: 15px; border-radius: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(241, 201, 30, 0.35); transition: transform 0.2s;">
          <span>Find My Investor Type →</span>
        </a>
        <a href="./index.html" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: calc(100% - 32px); max-width: 380px; padding: 11px 20px; background: #f1f5f9; color: #334155; font-weight: 700; font-size: 13px; border-radius: 12px; text-decoration: none; border: 1px solid #e2e8f0;">
          <span>← Back to Result Page / Home</span>
        </a>
      </div>
    </div>
  </div>

  <script>
    // Seamless human redirect after a short moment if user is clicking through from a social feed
    (function() {
      var ua = (navigator.userAgent || '').toLowerCase();
      var isSocialScraper = /facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegram|slack|pinterest|bingbot|googlebot/i.test(ua);
      if (!isSocialScraper) {
        setTimeout(function() {
          window.location.replace('./index.html?quiz=open');
        }, 1500);
      }
    })();
  </script>
</body>
</html>
`;

    const targetPath = path.resolve('firstcapitalpages', filename);
    fs.writeFileSync(targetPath, html, 'utf-8');
    console.log('Updated:', filename);
  });
});
