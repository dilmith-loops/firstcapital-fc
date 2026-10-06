from PIL import Image, ImageDraw, ImageFont
import os

# Create 1200x630 canvas
canvas = Image.new('RGB', (1200, 630), (254, 254, 254))

# Load characters image
chars = Image.open('src/assets/investor-personalities.jpg')
# Resize characters image to fit within height 590 while keeping aspect ratio
chars_ratio = chars.width / chars.height
new_h = 590
new_w = int(new_h * chars_ratio)
chars_resized = chars.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Position characters slightly to the right or center
# If new_w is ~786, centered: x = (1200 - new_w) // 2 = ~207
x = (1200 - new_w) // 2
y = 630 - new_h  # align to bottom

canvas.paste(chars_resized, (x, y))

# Add a subtle gold brand stripe at bottom
draw = ImageDraw.Draw(canvas)
draw.rectangle([(0, 620), (1200, 630)], fill=(241, 201, 30))

# Also paste logo if available
if os.path.exists('src/assets/first-capital-logo.png'):
    logo = Image.open('src/assets/first-capital-logo.png')
    logo_w = 260
    logo_h = int(logo.height * (logo_w / logo.width))
    logo_resized = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    canvas.paste(logo_resized, (40, 40), logo_resized if logo_resized.mode == 'RGBA' else None)

# Save
canvas.save('src/assets/og-image.jpg', 'JPEG', quality=95)
canvas.save('public/og-image.jpg', 'JPEG', quality=95)
os.makedirs('firstcapitalpages/assets', exist_ok=True)
canvas.save('firstcapitalpages/assets/og-image.jpg', 'JPEG', quality=95)
canvas.save('firstcapitalpages/og-image.jpg', 'JPEG', quality=95)

print('Generated 1200x630 og-image.jpg successfully!')
