#!/usr/bin/env python3
"""Extract every image from a PDF and label each by the nearest heading above it.

The heading font is auto-detected: across all pages, find every short text span
(2..60 chars, not pure digits) and bucket spans by (font name, rounded size, flags).
The bucket that appears on the most pages wins. If multiple headings appear on a
page, each image is tagged with the nearest heading whose y-coordinate sits at or
above the image's top edge. If no heading is found above the image on the current
page, the last heading seen on a previous page is reused (covers ads that wrap to
a continuation page).

Usage:
    extract_pdf_images.py <pdf_path> <output_dir>

Prints a JSON summary on stdout (out_dir, image_count, manifest path,
headings_detected). Writes images to <output_dir>/page<NNN>_img<MM>_<slug>.png
and a full manifest to <output_dir>/manifest.json.
"""

from __future__ import annotations

import json
import os
import re
import sys
from collections import defaultdict
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.stderr.write(
        "PyMuPDF is required. Install with: pip install pymupdf\n"
    )
    sys.exit(2)


def detect_heading_font(doc):
    """Return (font_name, size, flags) for the most-pages-seen short-span font."""
    font_pages = defaultdict(set)
    for page_num, page in enumerate(doc):
        d = page.get_text("dict")
        for block in d.get("blocks", []):
            if block.get("type") != 0:
                continue
            for line in block.get("lines", []):
                for span in line.get("spans", []):
                    text = (span.get("text") or "").strip()
                    if not text or len(text) > 60 or len(text) < 2:
                        continue
                    if re.fullmatch(r"\d+", text):
                        continue
                    fkey = (
                        span.get("font") or "",
                        round(float(span.get("size") or 0), 1),
                        int(span.get("flags") or 0),
                    )
                    font_pages[fkey].add(page_num)
    if not font_pages:
        return None
    # Most pages first, tiebreak on larger size (headings tend to be bigger).
    return max(
        font_pages.items(),
        key=lambda kv: (len(kv[1]), kv[0][1]),
    )[0]


def slugify(s, maxlen=30):
    s = re.sub(r"[^A-Za-z0-9]+", "_", s or "").strip("_")
    return (s[:maxlen] or "unlabeled")


def collect_headings(page, heading_font):
    """Return [(y_top, text)] for every line whose spans match the heading font."""
    out = []
    d = page.get_text("dict")
    for block in d.get("blocks", []):
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            parts = []
            line_y = None
            for span in line.get("spans", []):
                text = (span.get("text") or "").strip()
                if not text:
                    continue
                fkey = (
                    span.get("font") or "",
                    round(float(span.get("size") or 0), 1),
                    int(span.get("flags") or 0),
                )
                if fkey == heading_font:
                    parts.append(text)
                    if line_y is None:
                        line_y = span.get("bbox", [0, 0, 0, 0])[1]
            if parts and line_y is not None:
                full = " ".join(parts).strip()
                if 2 <= len(full) <= 80 and not re.fullmatch(r"\d+", full):
                    out.append((float(line_y), full))
    out.sort()
    return out


def extract(pdf_path, out_dir):
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(pdf_path)
    heading_font = detect_heading_font(doc)
    sys.stderr.write(f"Detected heading font: {heading_font}\n")

    manifest = []
    last_heading = None  # carry across pages for continuation layouts

    for page_num, page in enumerate(doc):
        headings = collect_headings(page, heading_font) if heading_font else []

        # Locate every embedded image with its rendered rect on this page.
        image_records = []
        for img in page.get_images(full=True):
            xref = img[0]
            try:
                rects = page.get_image_rects(xref)
            except Exception:
                rects = []
            if not rects:
                rects = [page.rect]
            for rect in rects:
                image_records.append((float(rect.y0), xref, rect))
        image_records.sort(key=lambda r: (r[0], r[1]))

        for img_idx, (y0, xref, rect) in enumerate(image_records):
            heading = None
            for hy, htext in reversed(headings):
                if hy <= y0 + 1.0:  # tiny tolerance for rounding
                    heading = htext
                    break
            if heading is None:
                heading = last_heading
            else:
                last_heading = heading

            try:
                pix = fitz.Pixmap(doc, xref)
                # Convert CMYK or color-with-alpha to plain RGB for clean PNGs.
                if pix.n - pix.alpha >= 4:
                    pix = fitz.Pixmap(fitz.csRGB, pix)
                slug = slugify(heading or "unlabeled")
                fname = f"page{page_num + 1:03d}_img{img_idx + 1:02d}_{slug}.png"
                fpath = out_dir / fname
                pix.save(str(fpath))
                pix = None
                manifest.append({
                    "path": str(fpath),
                    "filename": fname,
                    "page": page_num + 1,
                    "heading": heading or "(unlabeled)",
                    "bbox": [
                        float(rect.x0),
                        float(rect.y0),
                        float(rect.x1),
                        float(rect.y1),
                    ],
                    "width_px": int(rect.width),
                    "height_px": int(rect.height),
                })
            except Exception as e:
                sys.stderr.write(
                    f"Failed to extract image xref={xref} page={page_num + 1}: {e}\n"
                )

    manifest_path = out_dir / "manifest.json"
    manifest_path.write_text(json.dumps({
        "pdf": os.path.abspath(pdf_path),
        "heading_font": list(heading_font) if heading_font else None,
        "images": manifest,
    }, indent=2))

    headings_detected = sorted({m["heading"] for m in manifest})
    framework_counts = {}
    for m in manifest:
        framework_counts[m["heading"]] = framework_counts.get(m["heading"], 0) + 1

    print(json.dumps({
        "out_dir": str(out_dir),
        "image_count": len(manifest),
        "manifest": str(manifest_path),
        "headings_detected": headings_detected,
        "framework_counts": framework_counts,
    }, indent=2))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.stderr.write("Usage: extract_pdf_images.py <pdf_path> <output_dir>\n")
        sys.exit(2)
    extract(sys.argv[1], sys.argv[2])
