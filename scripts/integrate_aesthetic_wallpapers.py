#!/usr/bin/env python3
"""
Integrates images from public/images/ into collection/ categorized by style & type.
Extracts rich tags and categories from public/pages/*.md files.
"""

import os
import re
import shutil
from pathlib import Path

def parse_pages_metadata(pages_dir):
    image_metadata = {}
    pattern = re.compile(
        r"tags:\s*([^\n\r]+)(?:[\r\n\s]|<br\s*/?>)*<img\s+src=[\"']([^\"']+)[\"']",
        re.IGNORECASE
    )

    for md_file in pages_dir.glob("*.md"):
        content = md_file.read_text(encoding="utf-8", errors="ignore")
        for match in pattern.finditer(content):
            tags_str = match.group(1)
            img_url = match.group(2)
            fname = Path(img_url).name
            tags = [t.strip().lower() for t in re.findall(r"`([^`]+)`", tags_str)]
            
            # Record format hints
            source = md_file.stem.lower()
            format_hint = None
            if "mobile" in source:
                format_hint = "9:16"
            elif "ultrawide" in source:
                format_hint = "21:9"
            elif "desktop" in source:
                format_hint = "16:9"

            if fname not in image_metadata:
                image_metadata[fname] = {
                    "tags": set(tags),
                    "source_pages": [md_file.stem],
                    "format_hint": format_hint
                }
            else:
                image_metadata[fname]["tags"].update(tags)
                image_metadata[fname]["source_pages"].append(md_file.stem)
                if format_hint and not image_metadata[fname]["format_hint"]:
                    image_metadata[fname]["format_hint"] = format_hint

    return image_metadata

def classify_style(tags, filename):
    fname = filename.lower()
    tag_set = set(tags)

    if any(t in tag_set for t in ['anime', 'manga', 'girl', 'samurai', 'sakura', 'japan', 'waifu', 'ghibli']) or \
       any(k in fname for k in ['anime', 'girl', 'samurai', 'sakura', 'japan', 'manga']):
        return 'anime'

    if any(t in tag_set for t in ['nord', 'arctic', 'frost', 'snow', 'cold']) or \
       any(k in fname for k in ['nord', 'arctic', 'frost', 'snow']):
        return 'nord'

    if any(t in tag_set for t in ['space', 'astronaut', 'alien', 'planet', 'stars', 'galaxy', 'saturn', 'nebula', 'cosmic']) or \
       any(k in fname for k in ['space', 'astronaut', 'alien', 'planet', 'galaxy']):
        return 'space'

    if any(t in tag_set for t in ['cyberpunk', 'neon', 'city', 'tokyonight', 'synthwave', 'car', 'pixelart']) or \
       any(k in fname for k in ['cyberpunk', 'neon', 'city', 'tokyonight', 'synthwave', 'pixel']):
        return 'cyberpunk'

    if any(t in tag_set for t in ['nature', 'landscape', 'mountain', 'forest', 'waves', 'lake', 'sea', 'river', 'sunset', 'sunrise']) or \
       any(k in fname for k in ['nature', 'mountain', 'forest', 'waves', 'lake', 'sea', 'river', 'sunset']):
        return 'landscape'

    if any(t in tag_set for t in ['dark', 'black', 'oled', 'monochrome', 'white', 'light', 'gray', 'grey']) or \
       any(k in fname for k in ['dark', 'black', 'oled', 'monochrome', 'gray']):
        return 'monochrome'

    if any(t in tag_set for t in ['minimal', 'circuit', 'system', 'arch', 'linux', 'simple', 'abstract', 'gradient']) or \
       any(k in fname for k in ['minimal', 'circuit', 'system', 'arch', 'linux', 'abstract', 'gradient']):
        return 'minimal'

    return 'misc'

def main():
    root = Path(__file__).resolve().parent.parent
    pages_dir = root / "public" / "pages"
    images_dir = root / "public" / "images"
    collection_dir = root / "collection"

    print("Parsing metadata from public/pages/*.md ...")
    metadata = parse_pages_metadata(pages_dir)
    print(f"Parsed metadata for {len(metadata)} unique wallpaper filenames.")

    extensions = {'.png', '.jpg', '.jpeg', '.webp'}
    source_images = [p for p in images_dir.glob('*') if p.suffix.lower() in extensions]
    print(f"Found {len(source_images)} images in public/images/ to organize.")

    category_counts = {}
    copied_count = 0

    for img_path in source_images:
        meta = metadata.get(img_path.name, {"tags": set(), "format_hint": None})
        tags = list(meta["tags"])
        
        # Infer extra tags from filename
        stem_tags = re.findall(r'[a-zA-Z]{3,}', img_path.stem.lower())
        for st in stem_tags:
            if len(tags) < 10 and st not in tags:
                tags.append(st)

        style = classify_style(tags, img_path.name)
        target_dir = collection_dir / style
        target_dir.mkdir(parents=True, exist_ok=True)

        target_file = target_dir / img_path.name
        # Copy image if not present or destination smaller
        if not target_file.exists() or target_file.stat().st_size != img_path.stat().st_size:
            shutil.copy2(img_path, target_file)
            copied_count += 1

        category_counts[style] = category_counts.get(style, 0) + 1

    print("\nOrganization Complete:")
    print(f"Copied/Updated: {copied_count} photos into collection/")
    print("Breakdown by Style / Type:")
    for style, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  - collection/{style}/: {count} wallpapers")

    # Save extra tags map to a json file so analyze_collection can inject them
    tag_export = {}
    for fname, data in metadata.items():
        tag_export[fname] = {
            "tags": list(data["tags"]),
            "format_hint": data["format_hint"]
        }
    
    tags_file = root / "data" / "aesthetic_tags.json"
    import json
    tags_file.parent.mkdir(parents=True, exist_ok=True)
    with open(tags_file, "w", encoding="utf-8") as f:
        json.dump(tag_export, f, indent=2)
    print(f"\nSaved tag metadata export to {tags_file}")

if __name__ == "__main__":
    main()
