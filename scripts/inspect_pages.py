import re
from pathlib import Path
from collections import Counter

pages_dir = Path("public/pages")
images_dir = Path("public/images")

image_metadata = {}

for md_file in pages_dir.glob("*.md"):
    text = md_file.read_text(encoding="utf-8", errors="ignore")
    # Matches:
    # tags: `tag1` `tag2`
    # <img src=".../images/filename.ext">
    pattern = r"tags:\s*([^\n\r]+)[\r\n]+<img\s+src=[\"']([^\"']+)[\"']"
    matches = re.findall(pattern, text)
    for tags_str, img_url in matches:
        filename = Path(img_url).name
        tags = [t.strip().lower() for t in re.findall(r"`([^`]+)`", tags_str)]
        image_metadata[filename] = {
            "tags": tags,
            "page": md_file.stem,
        }

print(f"Total image metadata parsed: {len(image_metadata)}")
existing_images = list(images_dir.glob("*"))
print(f"Total images in public/images: {len(existing_images)}")

matched = [f for f in existing_images if f.name in image_metadata]
print(f"Matched images with tags: {len(matched)}")

all_tags = [t for meta in image_metadata.values() for t in meta["tags"]]
print(f"Top 20 tags: {Counter(all_tags).most_common(20)}")
