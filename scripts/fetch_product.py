#!/usr/bin/env python3
"""Fetch a product page (Shopify-aware) and download the primary product image.

Usage:
    fetch_product.py <product_url> <output_dir>

Writes:
    page.html              raw HTML of the product page
    product.json           full Shopify product payload (if <url>.json works)
    product_image.<ext>    the primary product image (first listed)
    product_summary.json   { url, title, price, currency, images, primary_image_path }

Prints product_summary.json on stdout.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path


# A real-browser UA + matching headers — many storefronts (Shopify with bot
# protection, Cloudflare, etc.) 403 anything that self-identifies as a bot,
# including the obvious "compatible; static-remix/1.0" we used to send.
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)
DEFAULT_HEADERS = {
    "User-Agent": UA,
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;q=0.9,"
        "image/avif,image/webp,image/apng,*/*;q=0.8"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "identity",
}


def http_get(url, timeout=30, extra_headers=None):
    headers = dict(DEFAULT_HEADERS)
    if extra_headers:
        headers.update(extra_headers)
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read(), resp.headers.get("Content-Type", "")


def safe_decode(b):
    try:
        return b.decode("utf-8")
    except UnicodeDecodeError:
        return b.decode("utf-8", errors="replace")


def try_shopify_json(url):
    """Try <product_url>.json which Shopify exposes by default. Returns dict or None."""
    base = url.split("?")[0].split("#")[0].rstrip("/")
    json_url = base + ".json"
    try:
        body, _ = http_get(json_url, extra_headers={"Accept": "application/json"})
        data = json.loads(body.decode("utf-8"))
        return data, body
    except Exception as e:
        sys.stderr.write(f"No Shopify .json at {json_url}: {e}\n")
        return None, None


def extract_from_html(html):
    """Pull title / price / og:image as a fallback when .json is unavailable."""
    out = {"title": None, "price": None, "currency": None, "images": []}

    m = re.search(r"<title[^>]*>([^<]+)</title>", html, re.I)
    if m:
        out["title"] = re.sub(r"\s+", " ", m.group(1)).strip()

    m = re.search(
        r'<meta[^>]+property=["\']og:price:amount["\'][^>]+content=["\']([^"\']+)["\']',
        html, re.I,
    )
    if m:
        out["price"] = m.group(1).strip()
    m = re.search(
        r'<meta[^>]+property=["\']og:price:currency["\'][^>]+content=["\']([^"\']+)["\']',
        html, re.I,
    )
    if m:
        out["currency"] = m.group(1).strip()

    for m in re.finditer(
        r'<meta[^>]+property=["\']og:image(?::secure_url)?["\'][^>]+content=["\']([^"\']+)["\']',
        html, re.I,
    ):
        out["images"].append(m.group(1).strip())
    for m in re.finditer(
        r'<link[^>]+rel=["\']image_src["\'][^>]+href=["\']([^"\']+)["\']',
        html, re.I,
    ):
        out["images"].append(m.group(1).strip())

    # Deduplicate while preserving order.
    seen, uniq = set(), []
    for u in out["images"]:
        if u not in seen:
            seen.add(u)
            uniq.append(u)
    out["images"] = uniq
    return out


def normalize_image_url(u, page_url):
    if u.startswith("//"):
        return "https:" + u
    if u.startswith("http"):
        return u
    return urllib.parse.urljoin(page_url, u)


def image_extension(url, content_type=""):
    m = re.search(r"\.(jpg|jpeg|png|webp|gif)(?:[\?#]|$)", url, re.I)
    if m:
        return m.group(1).lower().replace("jpeg", "jpg")
    if "png" in content_type:
        return "png"
    if "webp" in content_type:
        return "webp"
    if "gif" in content_type:
        return "gif"
    return "jpg"


def main(url, out_dir):
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    summary = {
        "url": url,
        "title": None,
        "price": None,
        "currency": None,
        "images": [],
        "primary_image_path": None,
        "source": None,
    }

    # 1. Fetch the HTML (best-effort — some sites block direct curl).
    html = ""
    try:
        body, _ = http_get(url)
        html = safe_decode(body)
        (out_dir / "page.html").write_text(html, encoding="utf-8")
    except Exception as e:
        sys.stderr.write(f"Failed to fetch HTML: {e}\n")

    # 2. Try Shopify .json first — that's the one place that gives clean
    #    structured price + every variant + all image URLs.
    shopify, raw = try_shopify_json(url)
    if shopify and raw:
        (out_dir / "product.json").write_bytes(raw)
        prod = shopify.get("product", {}) or {}
        summary["title"] = prod.get("title") or summary["title"]
        for v in prod.get("variants", []) or []:
            if v.get("price"):
                summary["price"] = v["price"]
                break
        for img in prod.get("images", []) or []:
            src = img.get("src")
            if src:
                summary["images"].append(src)
        if summary["images"]:
            summary["source"] = "shopify-json"

    # 3. If Shopify didn't yield images, fall back to HTML scraping.
    if not summary["images"] and html:
        scraped = extract_from_html(html)
        summary["title"] = summary["title"] or scraped["title"]
        summary["price"] = summary["price"] or scraped["price"]
        summary["currency"] = summary["currency"] or scraped["currency"]
        summary["images"] = scraped["images"]
        if summary["images"]:
            summary["source"] = "html-meta"

    # Backfill title from <title> if still missing.
    if not summary["title"] and html:
        m = re.search(r"<title[^>]*>([^<]+)</title>", html, re.I)
        if m:
            summary["title"] = re.sub(r"\s+", " ", m.group(1)).strip()

    # 4. Download the first usable image.
    for img_url in summary["images"]:
        full = normalize_image_url(img_url, url)
        try:
            body, ct = http_get(full)
            ext = image_extension(full, ct)
            dest = out_dir / f"product_image.{ext}"
            dest.write_bytes(body)
            summary["primary_image_path"] = str(dest)
            break
        except Exception as e:
            sys.stderr.write(f"Failed to download {full}: {e}\n")

    (out_dir / "product_summary.json").write_text(json.dumps(summary, indent=2))
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.stderr.write("Usage: fetch_product.py <product_url> <output_dir>\n")
        sys.exit(2)
    main(sys.argv[1], sys.argv[2])
