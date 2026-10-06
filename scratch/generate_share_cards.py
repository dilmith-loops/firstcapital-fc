from PIL import Image, ImageDraw, ImageFont
import os

font_bold = "C:/Windows/Fonts/segoeuib.ttf"
font_reg = "C:/Windows/Fonts/segoeui.ttf"

PROFILES = [
    {
        "key": "A",
        "num": "01",
        "slug": "keep-it-cool",
        "name": "The Keep-It-Cool Investor",
        "h1": "I'm a Keep-It-Cool",
        "h2": "Investor!",
        "style": "Flexible & Agile",
        "vibe": "Keep calm. Keep flexible.",
        "male_src": "src/assets/keep-it-cool-male.png",
        "female_src": "src/assets/keep-it-cool-female.png",
    },
    {
        "key": "B",
        "num": "02",
        "slug": "smooth-operator",
        "name": "The Smooth Operator",
        "h1": "I'm a Smooth",
        "h2": "Operator!",
        "style": "Steady & Flexible",
        "vibe": "Steady moves. Smarter money.",
        "male_src": "src/assets/smooth-operator-male.png",
        "female_src": "src/assets/smooth-operator-female.png",
    },
    {
        "key": "C",
        "num": "03",
        "slug": "patient-player",
        "name": "The Patient Player",
        "h1": "I'm a Patient",
        "h2": "Player!",
        "style": "Long-Term & Income-Focused",
        "vibe": "Play the long game.",
        "male_src": "src/assets/patient-player-male.png",
        "female_src": "src/assets/patient-player-female.png",
    },
    {
        "key": "D",
        "num": "04",
        "slug": "opportunity-hunter",
        "name": "The Opportunity Hunter",
        "h1": "I'm an Opportunity",
        "h2": "Hunter!",
        "style": "Growth-Focused",
        "vibe": "Spot the opportunity. Think long term.",
        "male_src": "src/assets/opportunity-hunter-male.png",
        "female_src": "src/assets/opportunity-hunter-female.png",
    },
]

NAVY_COLOR = (26, 33, 76)  # #1a214c

def make_card(p, gender="male", is_default=False):
    src_path = p[f"{gender}_src"]
    W, H = 1200, 630
    card = Image.new("RGB", (W, H), (255, 255, 255))
    draw = ImageDraw.Draw(card)

    # Soft subtle background elements
    glow_box = [(680, -50), (1280, 550)]
    draw.ellipse(glow_box, fill=(254, 250, 235))

    # Second geometric accent shape
    draw.polygon([(1100, 400), (1250, 630), (950, 630)], fill=(254, 243, 199))

    # Bottom gold brand bar
    draw.rectangle([(0, 618), (W, H)], fill=(241, 201, 30))

    # First Capital logo
    if os.path.exists("src/assets/first-capital-logo.png"):
        logo = Image.open("src/assets/first-capital-logo.png")
        lw = 250
        lh = int(logo.height * (lw / logo.width))
        logo_resized = logo.resize((lw, lh), Image.Resampling.LANCZOS)
        card.paste(logo_resized, (60, 52), logo_resized if logo_resized.mode == "RGBA" else None)

    # Fonts
    f_main = ImageFont.truetype(font_bold, 50)
    f_vibe = ImageFont.truetype(font_bold, 24)
    f_ask = ImageFont.truetype(font_bold, 34)

    # Main Headline in #1a214c
    draw.text((60, 165), p["h1"], fill=NAVY_COLOR, font=f_main)
    draw.text((60, 230), p["h2"], fill=NAVY_COLOR, font=f_main)

    # Vibe quote in #1a214c
    draw.text((60, 315), f"“{p['vibe']}”", fill=NAVY_COLOR, font=f_vibe)

    # Divider & Challenge
    draw.line([(60, 385), (360, 385)], fill=(226, 232, 240), width=2)
    draw.text((60, 420), "What's your investor type?", fill=(180, 83, 9), font=f_ask)

    # Avatar on right: Create a clean circular masked portrait with gold ring
    if os.path.exists(src_path):
        raw_char = Image.open(src_path).convert("RGBA")
        
        # Crop head & upper body
        w, h = raw_char.size
        crop_size = min(w, h)
        cropped_char = raw_char.crop((0, 0, w, int(crop_size * 0.88)))
        
        # Scale to circle dimension
        circle_dim = 440
        char_scaled = cropped_char.resize((circle_dim, circle_dim), Image.Resampling.LANCZOS)
        
        # Create circular mask
        mask = Image.new("L", (circle_dim, circle_dim), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse((0, 0, circle_dim, circle_dim), fill=255)
        
        # Circular image with clean white background
        circ_img = Image.new("RGBA", (circle_dim, circle_dim), (255, 255, 255, 255))
        circ_img.paste(char_scaled, (0, 0), char_scaled if char_scaled.mode == "RGBA" else None)
        circ_img.putalpha(mask)

        ring_x = 710
        ring_y = 95
        
        # Outer decorative gold rings
        draw.ellipse([(ring_x - 14, ring_y - 14), (ring_x + circle_dim + 14, ring_y + circle_dim + 14)], fill=(241, 201, 30))
        draw.ellipse([(ring_x - 4, ring_y - 4), (ring_x + circle_dim + 4, ring_y + circle_dim + 4)], fill=(255, 255, 255))

        card.paste(circ_img, (ring_x, ring_y), circ_img)

    # Output paths
    names_to_save = []
    if is_default:
        names_to_save.append(f"share-{p['slug']}.jpg")
    names_to_save.append(f"share-{p['slug']}-{gender}.jpg")

    for base_name in names_to_save:
        paths = [
            f"src/assets/{base_name}",
            f"public/{base_name}",
            f"public/assets/{base_name}",
            f"firstcapitalpages/assets/{base_name}",
            f"firstcapitalpages/{base_name}",
        ]

        for pt in paths:
            os.makedirs(os.path.dirname(pt), exist_ok=True)
            card.save(pt, "JPEG", quality=90, optimize=True, progressive=True)
            print(f"Saved: {pt}")

for prof in PROFILES:
    make_card(prof, gender="male", is_default=True)
    make_card(prof, gender="female", is_default=False)

print("All persona and gender share cards generated successfully!")
