from PIL import Image, ImageDraw
import os

img = Image.open('src/assets/investor-personalities.jpg')

targets = [
    { 'num': '01', 'name': 'keep-it-cool', 'box': (200, 30, 480, 310) },
    { 'num': '02', 'name': 'smooth-operator', 'box': (435, 85, 715, 365) },
    { 'num': '03', 'name': 'patient-player', 'box': (700, 40, 980, 320) },
    { 'num': '04', 'name': 'opportunity-hunter', 'box': (965, 95, 1255, 385) },
]

size = 400
mask = Image.new('L', (size, size), 0)
draw = ImageDraw.Draw(mask)
draw.ellipse((0, 0, size, size), fill=255)

for t in targets:
    cropped = img.crop(t['box'])
    im = cropped.resize((size, size), Image.Resampling.LANCZOS).convert('RGBA')
    
    # Save circular transparent PNG
    circle_im = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    circle_im.paste(im, (0, 0), mask)
    
    filename = f"investor-type-{t['num']}.png"
    circle_path = os.path.join('src', 'assets', filename)
    circle_im.save(circle_path, 'PNG', optimize=True)
    print(f"Saved {circle_path}")

    pub_path = os.path.join('public', filename)
    circle_im.save(pub_path, 'PNG', optimize=True)
    
    fcp_path = os.path.join('firstcapitalpages', 'assets', filename)
    if os.path.exists('firstcapitalpages/assets'):
        circle_im.save(fcp_path, 'PNG', optimize=True)

print("All assets saved successfully!")
