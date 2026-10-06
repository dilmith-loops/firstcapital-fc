from PIL import Image, ImageFilter
from collections import deque
import shutil

# 1. Backup original
shutil.copyfile('public/image.png', 'public/image_original.png')

img = Image.open('public/image.png').convert('RGB')
w, h = img.size
pixels = img.load()

# Reference cyan
# Most edge pixels are around R: 1-9, G: 178-194, B: 243-252
def is_definitely_bg(r, g, b):
    # Pure or near-pure background cyan
    return r < 40 and g > 150 and b > 210 and (b - r > 180)

visited = bytearray(w * h)
is_bg = bytearray(w * h)
queue = deque()

# Seed borders
for x in range(w):
    for y in (0, h - 1):
        idx = y * w + x
        if not visited[idx]:
            visited[idx] = 1
            if is_definitely_bg(*pixels[x, y]):
                is_bg[idx] = 1
                queue.append((x, y))

for y in range(h):
    for x in (0, w - 1):
        idx = y * w + x
        if not visited[idx]:
            visited[idx] = 1
            if is_definitely_bg(*pixels[x, y]):
                is_bg[idx] = 1
                queue.append((x, y))

while queue:
    x, y = queue.popleft()
    for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
        if 0 <= nx < w and 0 <= ny < h:
            nidx = ny * w + nx
            if not visited[nidx]:
                visited[nidx] = 1
                if is_definitely_bg(*pixels[nx, ny]):
                    is_bg[nidx] = 1
                    queue.append((nx, ny))

# Now create an alpha mask
# Start with alpha: 0 for bg, 255 for non-bg
alpha_img = Image.new('L', (w, h), 255)
alpha_pixels = alpha_img.load()
for y in range(h):
    for x in range(w):
        if is_bg[y * w + x]:
            alpha_pixels[x, y] = 0

# For anti-aliased edges:
# Find pixels within distance 2 of background and calculate alpha based on cyan fraction
for y in range(1, h - 1):
    for x in range(1, w - 1):
        if not is_bg[y * w + x]:
            # Check if neighboring background
            has_bg_neighbor = any(
                is_bg[(y + dy) * w + (x + dx)]
                for dx, dy in ((-1,0), (1,0), (0,-1), (0,1), (-1,-1), (1,-1), (-1,1), (1,1))
            )
            if has_bg_neighbor:
                r, g, b = pixels[x, y]
                # If this pixel has high cyan tint, it's partially transparent
                # Background cyan has roughly: R:4, G:186, B:247
                # Foreground border is typically white (255,255,255) or black (0,0,0) or colored
                if b > 200 and g > 130 and r < 80:
                    # Very close to cyan, blend out
                    cyan_factor = (b - r) / 255.0 # close to 1 for cyan
                    alpha_val = int(max(0, min(255, (1.0 - cyan_factor * 0.8) * 255)))
                    alpha_pixels[x, y] = alpha_val

# Apply slight Gaussian blur on alpha for ultra-smooth edge (radius 0.6)
smoothed_alpha = alpha_img.filter(ImageFilter.GaussianBlur(radius=0.5))

# Create RGBA output
out = Image.new('RGBA', (w, h))
out.paste(img, (0, 0))
out.putalpha(smoothed_alpha)

# Also let's defringe edge pixels so cyan halo is removed
out_pixels = out.load()
for y in range(h):
    for x in range(w):
        r, g, b, a = out_pixels[x, y]
        if 0 < a < 255:
            # If the pixel is semi-transparent and cyan-tinted, shift towards white
            if b > g and b > r + 30:
                # remove cyan fringe
                out_pixels[x, y] = (min(255, r + 60), min(255, g + 20), b, a)

out.save('public/image.png')
out.save('src/assets/image.png')
print('Successfully saved transparent image to public/image.png and src/assets/image.png')
