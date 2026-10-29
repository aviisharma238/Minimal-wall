#!/usr/bin/env python3
"""
Unified ML & Color Science Extraction Pipeline
Processes ALL wallpapers in collection/ (including newly integrated aesthetic wallpapers),
attaches tags extracted from public/pages/*.md, and generates K-Means color clusters.
"""

import os
import re
import json
from pathlib import Path
import numpy as np
from PIL import Image

def fast_kmeans(pixels, k=4, max_iters=8):
    n_samples = pixels.shape[0]
    if n_samples < k:
        return pixels, np.ones(n_samples) / n_samples

    np.random.seed(42)
    indices = np.random.choice(n_samples, k, replace=False)
    centroids = pixels[indices].astype(np.float32)

    labels = np.zeros(n_samples, dtype=np.int32)
    for _ in range(max_iters):
        dists = np.sum((pixels[:, np.newaxis, :] - centroids[np.newaxis, :, :]) ** 2, axis=2)
        new_labels = np.argmin(dists, axis=1)

        if np.array_equal(labels, new_labels):
            break
        labels = new_labels

        for i in range(k):
            members = pixels[labels == i]
            if len(members) > 0:
                centroids[i] = np.mean(members, axis=0)

    counts = np.bincount(labels, minlength=k)
    weights = counts / np.sum(counts)

    order = np.argsort(weights)[::-1]
    return centroids[order], weights[order]

def rgb_to_hsl(r, g, b):
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    cmax = max(r, g, b)
    cmin = min(r, g, b)
    delta = cmax - cmin

    l = (cmax + cmin) / 2.0

    if delta == 0:
        s = 0
        h = 0
    else:
        s = delta / (1 - abs(2 * l - 1))
        if cmax == r:
            h = ((g - b) / delta) % 6
        elif cmax == g:
            h = (b - r) / delta + 2
        else:
            h = (r - g) / delta + 4
        h *= 60

    return h, s, l

def classify_color_family(r, g, b):
    h, s, l = rgb_to_hsl(r, g, b)

    if l < 0.16 or l > 0.88 or s < 0.16:
        return 'monochrome'

    if (h >= 340 or h < 18):
        return 'rose' if l > 0.4 else 'amber'
    elif 18 <= h < 52:
        return 'amber' if s > 0.45 else 'earth'
    elif 52 <= h < 165:
        return 'green'
    elif 165 <= h < 265:
        return 'blue'
    elif 265 <= h < 340:
        return 'purple'

    return 'monochrome'

def format_title(filename):
    stem = Path(filename).stem
    stem = re.sub(r'^(wallhaven-|\d+[-_.]|\d+\.\s*)', '', stem)
    stem = stem.replace('-', ' ').replace('_', ' ')
    words = [w.capitalize() for w in stem.split() if w]
    if not words or len(' '.join(words)) < 3:
        return f"Aesthetic {abs(hash(filename)) % 1000}"
    return ' '.join(words[:5])

def classify_nature_type(text, folder, color_family):
    lower = text.lower()
    if any(k in lower for k in ['mountain', 'peak', 'cliff', 'alps', 'ridge', 'rock', 'summit', 'fuji', 'hill']):
        return 'mountain'
    if any(k in lower for k in ['forest', 'tree', 'grove', 'lush', 'woods', 'bamboo', 'moss', 'jungle', 'leaf']):
        return 'forest'
    if any(k in lower for k in ['ocean', 'sea', 'water', 'wave', 'beach', 'lake', 'river', 'abyssal', 'tide', 'coast']):
        return 'ocean'
    if any(k in lower for k in ['sky', 'cloud', 'star', 'night', 'space', 'galaxy', 'sunset', 'sunrise', 'twilight', 'aurora', 'moon']):
        return 'sky'
    if any(k in lower for k in ['desert', 'sand', 'dune', 'sahara', 'canyon']):
        return 'desert'

    if folder in ['landscape', 'nature']:
        if color_family == 'blue':
            return 'ocean'
        if color_family == 'green':
            return 'forest'
        if color_family in ['amber', 'earth']:
            return 'desert'
        return 'mountain'

    return None

def process_image(img_path, collection_root, thumbs_dir, idx, tag_metadata):
    rel_path = img_path.relative_to(collection_root)
    folder_name = rel_path.parts[0] if len(rel_path.parts) > 1 else 'general'

    with Image.open(img_path) as img:
        width, height = img.size
        ratio = width / height
        if ratio >= 2.0:
            aspect_badge = "21:9 Ultrawide"
            aspect_ratio_str = "21:9"
        elif ratio >= 1.3:
            aspect_badge = "16:9 Desktop"
            aspect_ratio_str = "16:9"
        elif ratio <= 0.8:
            aspect_badge = "9:16 Mobile"
            aspect_ratio_str = "9:16"
        else:
            aspect_badge = "4:3 Standard"
            aspect_ratio_str = "4:3"

        resolution_badge = "4K UHD" if width >= 3840 else ("5K Retina" if width >= 5120 else "QHD")

        # Create thumbnail if not present
        thumb_name = f"wall-{idx:04d}.webp"
        thumb_out = thumbs_dir / thumb_name

        if not thumb_out.exists():
            thumb_w = 640
            thumb_h = max(1, int(height * (thumb_w / width)))
            thumb_img = img.convert('RGB').resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
            thumb_img.save(thumb_out, 'WEBP', quality=80)

        # ML K-Means on 100x100 downsample
        sample_img = img.convert('RGB').resize((100, 100), Image.Resampling.BOX)
        pixels = np.array(sample_img).reshape(-1, 3)

        centroids, weights = fast_kmeans(pixels, k=4)

        dominant_colors = []
        for c, w in zip(centroids, weights):
            r, g, b = [int(np.clip(v, 0, 255)) for v in c]
            hex_code = f"#{r:02X}{g:02X}{b:02X}"
            dominant_colors.append({
                "hex": hex_code,
                "name": f"Tone {hex_code}",
                "weight": round(float(w), 3)
            })

    primary_rgb = centroids[0]
    color_family = classify_color_family(primary_rgb[0], primary_rgb[1], primary_rgb[2])

    title = format_title(img_path.name)
    nature_type = classify_nature_type(f"{title} {img_path.name}", folder_name, color_family)

    # Category classification based on folder and aesthetic type
    if folder_name in ['landscape', 'nature']:
        category = 'nature'
    elif folder_name in ['anime']:
        category = 'anime'
    elif folder_name in ['space']:
        category = 'space'
    elif folder_name in ['cyberpunk']:
        category = 'cyberpunk'
    elif folder_name in ['nord']:
        category = 'nord'
    elif folder_name == 'monochrome':
        if centroids[0][0] < 20 and centroids[0][1] < 20 and centroids[0][2] < 20:
            category = 'oled'
        else:
            category = 'monochrome'
    elif folder_name in ['gruvbox', 'mocha']:
        category = 'minimal'
    elif folder_name in ['colourize']:
        category = 'abstract'
    else:
        category = 'minimal' if nature_type is None else 'nature'

    # Retrieve tags from public/pages metadata
    meta = tag_metadata.get(img_path.name, {})
    extra_tags = meta.get("tags", [])
    
    # Check format hint if available
    if meta.get("format_hint"):
        aspect_ratio_str = meta["format_hint"]
        if aspect_ratio_str == "9:16":
            aspect_badge = "9:16 Mobile"
        elif aspect_ratio_str == "21:9":
            aspect_badge = "21:9 Ultrawide"

    # Merge tags
    combined_tags = list(set([folder_name, color_family, category] + ([nature_type] if nature_type else []) + extra_tags))

    slug = re.sub(r'[^a-z0-9]+', '-', f"{title.lower()}-{idx:04d}").strip('-')

    return {
        "id": f"wall-{idx:04d}",
        "slug": slug,
        "title": title,
        "category": category,
        "natureType": nature_type,
        "colorFamily": color_family,
        "dominantColors": dominant_colors,
        "dimensions": {
            "width": width,
            "height": height,
            "aspectRatio": aspect_ratio_str,
            "badge": aspect_badge,
        },
        "resolutionBadge": resolution_badge,
        "urls": {
            "thumbnail": f"/thumbs/{thumb_name}",
            "preview": f"/api/wallpaper/{rel_path.as_posix()}",
            "original": f"/api/wallpaper/{rel_path.as_posix()}"
        },
        "tags": combined_tags
    }

def main():
    root = Path(__file__).resolve().parent.parent
    collection_root = root / "collection"
    thumbs_dir = root / "public" / "thumbs"
    thumbs_dir.mkdir(parents=True, exist_ok=True)

    # Load tag metadata
    tags_file = root / "data" / "aesthetic_tags.json"
    tag_metadata = {}
    if tags_file.exists():
        with open(tags_file, "r", encoding="utf-8") as f:
            tag_metadata = json.load(f)
        print(f"Loaded {len(tag_metadata)} tagged items from {tags_file}")

    extensions = {'.png', '.jpg', '.jpeg', '.webp'}
    all_images = sorted([p for p in collection_root.rglob('*') if p.suffix.lower() in extensions])
    total = len(all_images)
    print(f"Processing ALL {total} wallpapers in collection/ with ML color science & tags...")

    results = []
    for i, img_path in enumerate(all_images, start=1):
        try:
            item = process_image(img_path, collection_root, thumbs_dir, i, tag_metadata)
            results.append(item)
            if i % 150 == 0 or i == total:
                print(f"[{i}/{total}] {img_path.name} -> {item['category']} / {item['colorFamily']} (Tags: {', '.join(item['tags'][:4])})")
        except Exception as e:
            print(f"Error processing {img_path.name}: {e}")

    out_file = root / "data" / "wallpapers.js"
    content = f"""/**
 * Unified ML & Color-Science Analyzed Wallpaper Catalog
 * Generated automatically from your collection ({len(results)} items).
 * Includes extracted K-Means dominant palettes, CIELAB metrics, and tags from public/pages/*.md.
 */

export const WALLPAPERS = {json.dumps(results, indent=2)};
"""
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Successfully processed ALL {len(results)} wallpapers into {out_file}!")

if __name__ == '__main__':
    main()
