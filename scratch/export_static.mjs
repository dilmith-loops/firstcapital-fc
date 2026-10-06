import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

async function exportStatic() {
  const outDir = path.resolve('firstcapitalpages');
  const assetsDir = path.join(outDir, 'assets');
  const option2Dir = path.join(outDir, 'design-option-2');

  // Ensure directories exist
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.mkdirSync(option2Dir, { recursive: true });

  console.log('Fetching live pre-rendered HTML from local dev server...');
  const [html1, html2] = await Promise.all([
    fetchHtml('http://localhost:8080/'),
    fetchHtml('http://localhost:8080/design-option-2')
  ]);

  // Copy CSS from .output/public/assets or fallback
  const compiledCssFiles = fs.readdirSync('.output/public/assets').filter(f => f.endsWith('.css'));
  if (compiledCssFiles.length > 0) {
    const cssSource = path.join('.output/public/assets', compiledCssFiles[0]);
    fs.copyFileSync(cssSource, path.join(assetsDir, 'styles.css'));
    console.log('Copied compiled CSS to assets/styles.css');
  }

  // Copy Images
  fs.copyFileSync('public/__l5e/assets-v1/4127bce6-999f-469c-8a68-01a4dc912fc9/first-capital-logo.png', path.join(assetsDir, 'first-capital-logo.png'));
  fs.copyFileSync('src/assets/investor-personalities.jpg', path.join(assetsDir, 'investor-personalities.jpg'));
  fs.copyFileSync('src/assets/image.png', path.join(assetsDir, 'image.png'));
  fs.copyFileSync('public/favicon.png', path.join(assetsDir, 'favicon.png'));
  fs.copyFileSync('public/favicon.png', path.join(outDir, 'favicon.png'));
  console.log('Copied all image assets to assets/');

  // Slider interactive script
  const sliderScript = `
<script>
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.testimonial-slider').forEach(function(slider) {
    var active = 0;
    var frame = slider.querySelector('.slider-frame > div');
    if (!frame) return;
    var slides = frame.children;
    var dots = slider.querySelectorAll('.slider-dot');
    var count = slides.length;

    function update(idx) {
      active = (idx + count) % count;
      frame.style.transform = 'translateX(-' + (active * 100) + '%)';
      dots.forEach(function(dot, i) {
        if (i === active) {
          dot.classList.remove('bg-transparent');
          dot.classList.add('bg-primary');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('bg-primary');
          dot.classList.add('bg-transparent');
          dot.removeAttribute('aria-current');
        }
      });
      for (var s = 0; s < slides.length; s++) {
        slides[s].setAttribute('aria-hidden', s !== active);
      }
    }

    var prevBtn = slider.querySelector('button[aria-label="Previous testimonial"]');
    var nextBtn = slider.querySelector('button[aria-label="Next testimonial"]');
    if (prevBtn) prevBtn.addEventListener('click', function() { update(active - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { update(active + 1); });
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() { update(i); });
    });
    setInterval(function() { update(active + 1); }, 6000);
  });
});
</script>
`;

  function cleanHtml(rawHtml, depth = 0) {
    const prefix = depth === 0 ? './' : '../';

    let html = rawHtml;
    // Remove data-tsd-source attributes
    html = html.replace(/\s*data-tsd-source="[^"]*"/g, '');
    // Remove dev styles and vite dev entry scripts
    html = html.replace(/<link[^>]*data-tanstack-router-dev-styles[^>]*>/gi, '');
    html = html.replace(/<link[^>]*href="\/src\/styles\.css"[^>]*>/gi, '');
    html = html.replace(/<script[^>]*virtual:tanstack-start-dev-client-entry[^>]*><\/script>/gi, '');
    html = html.replace(/<script[^>]*data-tsr-stream-part[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<script>document\.currentScript\.remove\(\);[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<script>\(function\(a,f\)[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<!--\/\$--\>/g, '');
    html = html.replace(/<!--\/\*.*?-->/g, '');

    // Add production stylesheet link in <head>
    const cssTag = `<link rel="stylesheet" href="${prefix}assets/styles.css" />`;
    html = html.replace('</head>', `  ${cssTag}\n</head>`);

    // Fix image paths
    html = html.replace(/src="\/__l5e\/assets-v1\/[^"]*\/first-capital-logo\.png"/g, `src="${prefix}assets/first-capital-logo.png"`);
    html = html.replace(/href="\/__l5e\/assets-v1\/[^"]*\/first-capital-logo\.png"/g, `href="${prefix}assets/first-capital-logo.png"`);
    html = html.replace(/src="\/src\/assets\/investor-personalities\.jpg"/g, `src="${prefix}assets/investor-personalities.jpg"`);
    html = html.replace(/href="\/src\/assets\/investor-personalities\.jpg"/g, `href="${prefix}assets/investor-personalities.jpg"`);
    html = html.replace(/src="\/src\/assets\/image\.png"/g, `src="${prefix}assets/image.png"`);
    html = html.replace(/href="\/src\/assets\/image\.png"/g, `href="${prefix}assets/image.png"`);
    html = html.replace(/href="\/favicon\.png"/g, `href="${prefix}favicon.png"`);

    // Clean preload links that pointed to old dev paths
    html = html.replace(/<link rel="preload" as="image" href="\/__l5e\/[^"]*"\/>/gi, `<link rel="preload" as="image" href="${prefix}assets/first-capital-logo.png" />`);
    html = html.replace(/<link rel="preload" as="image" href="\/src\/assets\/investor-personalities\.jpg"\/>/gi, `<link rel="preload" as="image" href="${prefix}assets/investor-personalities.jpg" />`);

    // Insert interactive slider script
    html = html.replace('</body>', `${sliderScript}\n</body>`);

    return html;
  }

  const page1 = cleanHtml(html1, 0);
  const page2 = cleanHtml(html2, 1);

  fs.writeFileSync(path.join(outDir, 'index.html'), page1, 'utf-8');
  fs.writeFileSync(path.join(option2Dir, 'index.html'), page2, 'utf-8');
  console.log('Saved firstcapitalpages/index.html and firstcapitalpages/design-option-2/index.html');

  // Create .htaccess for Hostinger Apache / LiteSpeed
  const htaccess = `# Apache / LiteSpeed configuration for Hostinger subfolder
RewriteEngine On
RewriteBase /firstcapitalpages/

# Serve existing files and directories directly
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Route /design-option-2 cleanly to design-option-2/index.html
RewriteRule ^design-option-2/?$ design-option-2/index.html [L]

# Fallback for SPA routing if needed
RewriteRule ^ index.html [L]

# Enable Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

# Cache headers for static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
`;
  fs.writeFileSync(path.join(outDir, '.htaccess'), htaccess, 'utf-8');
  console.log('Generated firstcapitalpages/.htaccess');
}

exportStatic().catch(err => {
  console.error(err);
  process.exit(1);
});
