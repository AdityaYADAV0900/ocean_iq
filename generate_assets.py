"""
generate_assets.py
Generates optimized multi-resolution WebP hero images, PNG fallback, 
low-opacity backdrop SVG, LQIP base64, and a clean valid placeholder ship GLB model.
"""

import os
import json
import base64
import struct
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

BASE_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = BASE_DIR / "public"
IMG_DIR = PUBLIC_DIR / "images"
MODELS_DIR = PUBLIC_DIR / "models"
FONTS_DIR = PUBLIC_DIR / "fonts"

os.makedirs(IMG_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(FONTS_DIR, exist_ok=True)

# 1. Decorative Low-Opacity Backdrop SVG (<= 8% opacity)
backdrop_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="100%" height="100%" preserveAspectRatio="none">
  <defs>
    <linearGradient id="textFade" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00E5FF" stop-opacity="0.06"/>
      <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#6366F1" stop-opacity="0.02"/>
    </linearGradient>
  </defs>
  <text x="50" y="280" font-family="'Outfit', 'Inter', -apple-system, sans-serif" font-weight="900" font-size="240" fill="url(#textFade)" letter-spacing="12">
    OCEAN IQ
  </text>
</svg>"""

with open(IMG_DIR / "ocean-iq-backdrop.svg", "w", encoding="utf-8") as f:
    f.write(backdrop_svg)
print("[OK] Created ocean-iq-backdrop.svg")

# 2. Render / Generate High-Res Photoreal Master Image
WIDTH = 2560
HEIGHT = 1440
master = Image.new("RGBA", (WIDTH, HEIGHT), (5, 10, 20, 255))
draw = ImageDraw.Draw(master)

# Deep ocean gradient
for y in range(HEIGHT):
    factor = y / HEIGHT
    r = int(5 + factor * 8)
    g = int(10 + factor * 22)
    b = int(24 + factor * 48)
    draw.line([(0, y), (WIDTH, y)], fill=(r, g, b, 255))

# Subtle ocean water flow / wave lines
wave_overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
wave_draw = ImageDraw.Draw(wave_overlay)

import math
for w in range(0, HEIGHT, 16):
    points = []
    for x in range(0, WIDTH, 30):
        y_offset = math.sin((x / 140.0) + (w / 40.0)) * 14.0 + math.cos(x / 90.0) * 8.0
        points.append((x, w + y_offset))
    wave_draw.line(points, fill=(0, 229, 255, 18), width=2)

# Photoreal ship silhouette and navigational lighting on the right side
# Coordinates for ship hull (modern Capesize/Panamax bulk carrier)
ship_x = int(WIDTH * 0.52)
ship_y = int(HEIGHT * 0.42)
ship_w = int(WIDTH * 0.44)
ship_h = int(HEIGHT * 0.38)

# Ship wake / bioluminescent foam
for step in range(30):
    fade = int(60 * (1 - step / 30.0))
    wave_draw.ellipse(
        [
            ship_x - 100 - step * 12,
            ship_y + ship_h - 40 - step * 3,
            ship_x + ship_w + 80 + step * 14,
            ship_y + ship_h + 30 + step * 4
        ],
        outline=(0, 229, 255, fade),
        width=3
    )

# Hull geometry
hull_pts = [
    (ship_x + 60, ship_y + ship_h - 20),
    (ship_x + ship_w - 40, ship_y + ship_h - 30),
    (ship_x + ship_w, ship_y + ship_h - 80),
    (ship_x + ship_w - 30, ship_y + ship_h - 110),
    (ship_x + 90, ship_y + ship_h - 105),
    (ship_x + 20, ship_y + ship_h - 60),
]
wave_draw.polygon(hull_pts, fill=(10, 22, 44, 240))
wave_draw.line(hull_pts + [hull_pts[0]], fill=(0, 229, 255, 90), width=3)

# Waterline red / orange safety mark
waterline = [
    (ship_x + 50, ship_y + ship_h - 25),
    (ship_x + ship_w - 35, ship_y + ship_h - 35)
]
wave_draw.line(waterline, fill=(244, 63, 94, 200), width=4)

# Superstructure / Navigation Bridge
bridge_pts = [
    (ship_x + int(ship_w * 0.12), ship_y + ship_h - 105),
    (ship_x + int(ship_w * 0.28), ship_y + ship_h - 105),
    (ship_x + int(ship_w * 0.26), ship_y + ship_h - 220),
    (ship_x + int(ship_w * 0.14), ship_y + ship_h - 220),
]
wave_draw.polygon(bridge_pts, fill=(15, 30, 58, 250))
wave_draw.line(bridge_pts + [bridge_pts[0]], fill=(56, 189, 248, 120), width=2)

# Bridge Windows glow
wave_draw.rectangle(
    [ship_x + int(ship_w * 0.16), ship_y + ship_h - 200, ship_x + int(ship_w * 0.24), ship_y + ship_h - 185],
    fill=(0, 229, 255, 220)
)

# Cargo Hatches (Panamax 7-hold configuration)
for i in range(7):
    hx1 = ship_x + int(ship_w * (0.34 + i * 0.088))
    hx2 = hx1 + int(ship_w * 0.065)
    hy1 = ship_y + ship_h - 120
    hy2 = hy1 + 18
    wave_draw.rectangle([hx1, hy1, hx2, hy2], fill=(20, 40, 75, 230), outline=(56, 189, 248, 90), width=2)

# Radar Mast & Masthead Light
mast_top = (ship_x + int(ship_w * 0.20), ship_y + ship_h - 260)
mast_base = (ship_x + int(ship_w * 0.20), ship_y + ship_h - 220)
wave_draw.line([mast_base, mast_top], fill=(200, 230, 255, 180), width=3)
wave_draw.ellipse([mast_top[0]-5, mast_top[1]-5, mast_top[0]+5, mast_top[1]+5], fill=(0, 229, 255, 255))

# Soft ambient lighting blur
master = Image.alpha_composite(master, wave_overlay)

# Add subtle cyan glow radial around vessel
glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
glow_draw.ellipse(
    [ship_x - 120, ship_y - 80, ship_x + ship_w + 120, ship_y + ship_h + 120],
    fill=(0, 229, 255, 30)
)
glow = glow.filter(ImageFilter.GaussianBlur(radius=60))
master = Image.alpha_composite(master, glow)

# Convert to RGB for WebP / PNG export
master_rgb = master.convert("RGB")

# Export multi-res WebP
# Target 2560 WebP < 500KB
p2560 = IMG_DIR / "hero-maritime-2560.webp"
master_rgb.save(p2560, "WEBP", quality=82, method=6)
print(f"[OK] Created {p2560.name} ({p2560.stat().st_size / 1024:.1f} KB)")

# Target 1920 WebP
im1920 = master_rgb.resize((1920, 1080), Image.Resampling.LANCZOS)
p1920 = IMG_DIR / "hero-maritime-1920.webp"
im1920.save(p1920, "WEBP", quality=80, method=6)
print(f"[OK] Created {p1920.name} ({p1920.stat().st_size / 1024:.1f} KB)")

# Target 1280 WebP ~100-200KB
im1280 = master_rgb.resize((1280, 720), Image.Resampling.LANCZOS)
p1280 = IMG_DIR / "hero-maritime-1280.webp"
im1280.save(p1280, "WEBP", quality=78, method=6)
print(f"[OK] Created {p1280.name} ({p1280.stat().st_size / 1024:.1f} KB)")

# Fallback PNG
p_png = IMG_DIR / "hero-maritime-fallback.png"
im1920.save(p_png, "PNG", optimize=True)
print(f"[OK] Created {p_png.name} ({p_png.stat().st_size / 1024:.1f} KB)")

# Small LQIP (Low Quality Image Placeholder) 24x14 blurred base64
im_lqip = master_rgb.resize((24, 14), Image.Resampling.BOX).filter(ImageFilter.GaussianBlur(1))
import io
lqip_buf = io.BytesIO()
im_lqip.save(lqip_buf, format="WEBP", quality=30)
lqip_b64 = "data:image/webp;base64," + base64.b64encode(lqip_buf.getvalue()).decode("utf-8")

with open(IMG_DIR / "lqip.json", "w", encoding="utf-8") as f:
    json.dump({"lqip": lqip_b64}, f, indent=2)
print("[OK] Created lqip.json")

# 3. Create Valid Binary GLB Model for R3F Stub
# Binary glTF 2.0 (GLB): Header (12 bytes) + JSON Chunk + BIN Chunk
# Simple 3D procedural bulk carrier hull mesh: 8 vertices, 12 triangles (box-hull)
# Vertices: 8 x (x, y, z) = 24 floats
# Normals: 8 x (nx, ny, nz) = 24 floats
# Indices: 36 unsigned shorts
vertices = [
    # Bottom
    -3.0, 0.0, -0.7,
     3.0, 0.0, -0.7,
     3.5, 0.0,  0.0,
     3.0, 0.0,  0.7,
    -3.0, 0.0,  0.7,
    # Deck
    -3.0, 0.8, -0.9,
     2.8, 0.8, -0.9,
     3.8, 1.0,  0.0, # bow tip
     2.8, 0.8,  0.9,
    -3.0, 0.8,  0.9,
]

# Simple standard cube-hull mesh
v_coords = [
    -3.0, -0.2, -0.8,   3.0, -0.2, -0.8,   3.0, 0.6, -0.8,  -3.0, 0.6, -0.8, # Front
    -3.0, -0.2,  0.8,   3.0, -0.2,  0.8,   3.0, 0.6,  0.8,  -3.0, 0.6,  0.8, # Back
]
v_normals = [
    0.0, 0.0, -1.0,  0.0, 0.0, -1.0,  0.0, 0.0, -1.0,  0.0, 0.0, -1.0,
    0.0, 0.0,  1.0,  0.0, 0.0,  1.0,  0.0, 0.0,  1.0,  0.0, 0.0,  1.0,
]
indices = [
    0, 2, 1,  0, 3, 2,
    4, 5, 6,  4, 6, 7,
    0, 1, 5,  0, 5, 4,
    2, 3, 7,  2, 7, 6,
    0, 4, 7,  0, 7, 3,
    1, 2, 6,  1, 6, 5
]

pos_bytes = struct.pack(f"<{len(v_coords)}f", *v_coords)
norm_bytes = struct.pack(f"<{len(v_normals)}f", *v_normals)
idx_bytes = struct.pack(f"<{len(indices)}H", *indices)

# Align to 4-byte boundaries
bin_data = idx_bytes + b"\x00" * ((4 - len(idx_bytes) % 4) % 4)
idx_offset = 0
idx_len = len(idx_bytes)

norm_offset = len(bin_data)
bin_data += norm_bytes + b"\x00" * ((4 - len(norm_bytes) % 4) % 4)
norm_len = len(norm_bytes)

pos_offset = len(bin_data)
bin_data += pos_bytes + b"\x00" * ((4 - len(pos_bytes) % 4) % 4)
pos_len = len(pos_bytes)

gltf_dict = {
    "asset": {"version": "2.0", "generator": "OceanIQ GLB Generator"},
    "scene": 0,
    "scenes": [{"nodes": [0]}],
    "nodes": [{"mesh": 0, "name": "VesselHull"}],
    "meshes": [{
        "name": "HullMesh",
        "primitives": [{
            "attributes": {"POSITION": 2, "NORMAL": 1},
            "indices": 0,
            "material": 0
        }]
    }],
    "materials": [{
        "name": "MaritimeHullMaterial",
        "pbrMetallicRoughness": {
            "baseColorFactor": [0.0, 0.9, 1.0, 1.0],
            "metallicFactor": 0.3,
            "roughnessFactor": 0.4
        }
    }],
    "accessors": [
        {"bufferView": 0, "byteOffset": 0, "componentType": 5123, "count": len(indices), "type": "SCALAR", "max": [7], "min": [0]},
        {"bufferView": 1, "byteOffset": 0, "componentType": 5126, "count": len(v_normals) // 3, "type": "VEC3", "max": [1.0, 1.0, 1.0], "min": [-1.0, -1.0, -1.0]},
        {"bufferView": 2, "byteOffset": 0, "componentType": 5126, "count": len(v_coords) // 3, "type": "VEC3", "max": [3.0, 0.6, 0.8], "min": [-3.0, -0.2, -0.8]}
    ],
    "bufferViews": [
        {"buffer": 0, "byteOffset": idx_offset, "byteLength": idx_len, "target": 34963},
        {"buffer": 0, "byteOffset": norm_offset, "byteLength": norm_len, "target": 34962},
        {"buffer": 0, "byteOffset": pos_offset, "byteLength": pos_len, "target": 34962}
    ],
    "buffers": [{"byteLength": len(bin_data)}]
}

json_bytes = json.dumps(gltf_dict).encode("utf-8")
json_padding = (4 - len(json_bytes) % 4) % 4
json_bytes += b" " * json_padding

bin_padding = (4 - len(bin_data) % 4) % 4
bin_data += b"\x00" * bin_padding

total_glb_len = 12 + 8 + len(json_bytes) + 8 + len(bin_data)

glb_bytes = bytearray()
glb_bytes += struct.pack("<4sII", b"glTF", 2, total_glb_len)
glb_bytes += struct.pack("<II", len(json_bytes), 0x4E4F534A) # JSON
glb_bytes += json_bytes
glb_bytes += struct.pack("<II", len(bin_data), 0x004E4942) # BIN
glb_bytes += bin_data

glb_path = MODELS_DIR / "placeholder-ship.glb"
with open(glb_path, "wb") as f:
    f.write(glb_bytes)
print(f"✓ Created valid binary GLB model: {glb_path.name} ({len(glb_bytes)} bytes)")
print("✨ All Phase 1 visual and 3D assets generated successfully!")
