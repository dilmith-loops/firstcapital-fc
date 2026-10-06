import os
from PIL import Image, ImageDraw, ImageFont

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
        "style": "Flexible and Agile",
        "vibe": "Keep calm. Keep flexible.",
    },
    {
        "key": "B",
        "num": "02",
        "slug": "smooth-operator",
        "name": "The Smooth Operator",
        "h1": "I'm a Smooth",
        "h2": "Operator!",
        "style": "Steady and Flexible",
        "vibe": "Steady moves. Smarter money.",
    },
    {
        "key": "C",
        "num": "03",
        "slug": "patient-player",
        "name": "The Patient Player",
        "h1": "I'm a Patient",
        "h2": "Player!",
        "style": "Long-Term and Income-Focused",
        "vibe": "Play the long game.",
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
    },
]

NAVY = (26, 33, 76)       # #1a214c
GOLD = (241, 201, 30)     # #f1c91e
GOLD_LIGHT = (254, 243, 199)

male_img_path = "src/assets/male.png"
female_img_path = "src/assets/female.png"

def make_card(p, gender):
    W, H = 1200, 630
    card = Image.new("RGB", (W, H), (255, 255, 255))
    draw = ImageDraw.Draw(card)

    # Background subtle ambient shapes
    draw.rectangle([(0, 0), (W, H)], fill=(255, 255, 255))
    draw.ellipse([(650, -80), (1300, 580)], fill=(248, 250, 254))
    draw.polygon([(1050, 380), (1200, 630), (900, 630)], fill=GOLD_LIGHT)

    # Bottom brand bar (Gold)
    draw.rectangle([(0, 616), (W, H)], fill=GOLD)

    # First Capital logo
    if os.path.exists("src/assets/first-capital-logo.png"):
        logo = Image.open("src/assets/first-capital-logo.png")
        lw = 240
        lh = int(logo.height * (lw / logo.width))
        logo_resized = logo.resize((lw, lh), Image.Resampling.LANCZOS)
        card.paste(logo_resized, (60, 44), logo_resized if logo_resized.mode == "RGBA" else None)

    # Fonts
    f_badge = ImageFont.truetype(font_bold, 14)
    f_main = ImageFont.truetype(font_bold, 46)
    f_vibe = ImageFont.truetype(font_bold, 21)
    f_ask = ImageFont.truetype(font_bold, 30)
    f_sub = ImageFont.truetype(font_reg, 16)

    # Personality badge (Navy Theme pill with Gold text)
    badge_text = f"PERSONALITY {p['num']} • {p['style'].upper()}"
    badge_w = int(draw.textlength(badge_text, font=f_badge))
    bx, by = 60, 138
    draw.rounded_rectangle([(bx, by), (bx + badge_w + 24, by + 32)], radius=16, fill=NAVY)
    draw.text((bx + 12, by + 7), badge_text, fill=GOLD, font=f_badge)

    # Main Headline (Dark Navy #1a214c)
    draw.text((60, 192), p["h1"], fill=NAVY, font=f_main)
    draw.text((60, 250), p["h2"], fill=NAVY, font=f_main)

    # Gold Vibe Quote pill
    vibe_text = f"“{p['vibe']}”"
    vw = int(draw.textlength(vibe_text, font=f_vibe))
    vx, vy = 60, 322
    draw.rounded_rectangle([(vx, vy), (vx + vw + 24, vy + 36)], radius=8, fill=GOLD)
    draw.text((vx + 12, vy + 6), vibe_text, fill=NAVY, font=f_vibe)

    # Divider & CTA
    draw.line([(60, 395), (380, 395)], fill=(226, 232, 240), width=2)
    draw.text((60, 420), "What's your investor type?", fill=NAVY, font=f_ask)
    draw.text((60, 468), "Find your investor type and investment match at firstcapital.lk", fill=(100, 116, 139), font=f_sub)

    # Right side: Load male.png or female.png and fit inside a framed card
    char_src = female_img_path if gender == "female" else male_img_path
    if os.path.exists(char_src):
        char_img = Image.open(char_src).convert("RGBA")
        
        # Frame dimensions on right side
        fw, fh = 420, 525
        fx, fy = 720, 50

        # Fit image maintaining 1122:1402 aspect ratio
        img_w, img_h = char_img.size
        target_h = fh - 10
        target_w = int(img_w * (target_h / img_h))
        char_resized = char_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

        # Rounded rectangle mask for character card
        frame_mask = Image.new("L", (target_w, target_h), 0)
        mask_draw = ImageDraw.Draw(frame_mask)
        mask_draw.rounded_rectangle([(0, 0), (target_w, target_h)], radius=24, fill=255)

        # Card container with subtle shadow and border
        card_x = fx + (fw - target_w) // 2
        card_y = fy + (fh - target_h) // 2

        # Outer border
        draw.rounded_rectangle([(card_x - 3, card_y - 3), (card_x + target_w + 3, card_y + target_h + 3)], radius=26, fill=GOLD)
        draw.rounded_rectangle([(card_x - 1, card_y - 1), (card_x + target_w + 1, card_y + target_h + 1)], radius=25, fill=(255, 255, 255))

        # Paste character
        char_card = Image.new("RGBA", (target_w, target_h), (255, 255, 255, 255))
        char_card.paste(char_resized, (0, 0), char_resized)
        char_card.putalpha(frame_mask)
        card.paste(char_card, (card_x, card_y), char_card)

    # Save to all required output directories
    names = [f"share-{p['slug']}-{gender}.jpg"]
    if gender == "male":
        names.append(f"share-{p['slug']}.jpg")

    for base_name in names:
        dirs = [
            "src/assets",
            "public",
            "firstcapitalpages/assets",
            "firstcapitalpages",
            "firstcapitalpages/admin/assets",
        ]
        for d in dirs:
            os.makedirs(d, exist_ok=True)
            out_path = os.path.join(d, base_name)
            card.save(out_path, "JPEG", quality=95)
            print(f"Saved: {out_path}")

if __name__ == "__main__":
    for prof in PROFILES:
        for g in ["male", "female"]:
            make_card(prof, g)
    print("All gender share cards generated successfully!")
