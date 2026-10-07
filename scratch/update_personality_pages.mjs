import fs from 'fs';
import path from 'path';

const personas = [
  {
    key: 'A',
    slug: 'keep-it-cool',
    name: 'The Keep-It-Cool Investor',
    vibe: 'Keep calm. Keep flexible.',
  },
  {
    key: 'B',
    slug: 'smooth-operator',
    name: 'The Smooth Operator',
    vibe: 'Thoughtful choices. Smarter Investing.',
  },
  {
    key: 'C',
    slug: 'patient-player',
    name: 'The Patient Player',
    vibe: 'Play the long game.',
  },
  {
    key: 'D',
    slug: 'opportunity-hunter',
    name: 'The Opportunity Hunter',
    vibe: 'Spot the opportunity. Think long term.',
  }
];

const variants = ['default', 'male', 'female'];

personas.forEach(p => {
  variants.forEach(gender => {
    const filename = gender === 'default' ? `${p.slug}.html` : `${p.slug}-${gender}.html`;
    const shareCardName = gender === 'female' ? `share-${p.slug}-female.jpg` : `share-${p.slug}-male.jpg`;
    
    // Direct clean image URLs without query string for WhatsApp scraper compatibility
    const primaryImgUrl = `https://ai.loopsintegrated.co/fc/firstcapitalpages/assets/${shareCardName}`;
    const pageUrl = `https://ai.loopsintegrated.co/fc/firstcapitalpages/${filename}`;
    
    const pageTitle = `I'm ${p.name}! What's Your Investor Personality? | First Capital`;
    const ogTitle = `I'm ${p.name}! What's Your Investor Personality?`;
    const cleanDesc = `I just discovered my investor personality with First Capital: ${p.name} (${p.vibe}). Take the 1-minute quiz to find yours!`;

    const html = `<!DOCTYPE html>
<html lang="en" prefix="og: http://ogp.me/ns#">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pageTitle}</title>

  <!-- WhatsApp & Facebook Primary Image (must be first in head) -->
  <meta property="og:image" content="${primaryImgUrl}" />
  <meta property="og:image:secure_url" content="${primaryImgUrl}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="First Capital - ${p.name}" />
  <link rel="image_src" href="${primaryImgUrl}" />
  <meta itemprop="image" content="${primaryImgUrl}" />

  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${cleanDesc}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:site_name" content="First Capital" />
  <meta property="og:type" content="website" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${ogTitle}" />
  <meta name="twitter:description" content="${cleanDesc}" />
  <meta name="twitter:image" content="${primaryImgUrl}" />
  <meta name="twitter:url" content="${pageUrl}" />

  <!-- Standard Meta -->
  <meta name="title" content="${ogTitle}" />
  <meta name="description" content="${cleanDesc}" />
  <meta itemprop="name" content="${ogTitle}" />
  <meta itemprop="description" content="${cleanDesc}" />

  <!-- Preload share card -->
  <link rel="preload" as="image" href="./assets/${shareCardName}" />
  <link rel="icon" href="./favicon.png" type="image/png" />
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; text-align: center; padding: 20px;">
  <div style="max-width: 580px; width: 100%; background: #ffffff; color: #0f172a; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.4); padding: 0 0 28px 0; text-align: center;">
    <img src="./assets/${shareCardName}" alt="${p.name}" style="width: 100%; height: auto; display: block; border-bottom: 3px solid #f1c91e;" onerror="this.src='./${shareCardName}'" />
    
    <div style="padding: 24px 24px 0 24px;">
      <h1 style="font-size: 22px; font-weight: 800; color: #142d27; margin: 0 0 8px 0;">${ogTitle}</h1>
      <p style="color: #64748b; font-size: 14px; margin: 0 0 22px 0; line-height: 1.5;">
        Take the quick 1-minute First Capital quiz to discover your investor personality and find your match.
      </p>
      
      <div style="display: flex; justify-content: center;">
        <a href="./index.html?quiz=open" style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: calc(100% - 32px); max-width: 380px; padding: 15px 24px; background: #f1c91e; color: #142d27; font-weight: 800; font-size: 15px; border-radius: 14px; text-decoration: none; box-shadow: 0 4px 12px rgba(241, 201, 30, 0.35); transition: transform 0.2s;">
          <span>Find My Investor Personality →</span>
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`;

    const targetPath = path.resolve('firstcapitalpages', filename);
    fs.writeFileSync(targetPath, html, 'utf-8');
    console.log('Updated:', filename);
  });
});
