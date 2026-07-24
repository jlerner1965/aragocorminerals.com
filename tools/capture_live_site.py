#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import mimetypes
import os
import re
import sys
import time
from collections import deque
from pathlib import Path, PurePosixPath
from urllib.parse import urldefrag, urljoin, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://aragocor-minerals.jlerner1965.chatgpt.site/"
BASE = urlparse(BASE_URL)
OUTPUT = Path("exact-live-site")
TIMEOUT = 45
MAX_URLS = 1000
USER_AGENT = "Mozilla/5.0 (compatible; ExactSiteArchiver/1.0; +https://github.com/jlerner1965/aragocorminerals.com)"

RESOURCE_ATTRS = {
    "img": ("src", "srcset"),
    "source": ("src", "srcset"),
    "video": ("src", "poster"),
    "audio": ("src",),
    "script": ("src",),
    "link": ("href",),
    "iframe": ("src",),
    "embed": ("src",),
    "object": ("data",),
    "input": ("src",),
}

BINARY_EXTS = {
    ".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg", ".ico",
    ".mp4", ".webm", ".mov", ".m4v", ".ogv", ".mp3", ".wav", ".ogg",
    ".pdf", ".zip", ".woff", ".woff2", ".ttf", ".otf", ".eot",
}
TEXT_EXTS = {".html", ".htm", ".css", ".js", ".json", ".xml", ".txt", ".webmanifest"}
ASSET_PATTERN = re.compile(
    r"(?P<q>['\"])(?P<url>(?:\.?\.?/|/)?(?:images|videos|assets|media|css|js|fonts)/[^'\"?#]+(?:\?[^'\"#]*)?)(?P=q)",
    re.IGNORECASE,
)
CSS_URL_PATTERN = re.compile(r"url\(\s*(['\"]?)([^)'\"]+)\1\s*\)", re.IGNORECASE)
CSS_IMPORT_PATTERN = re.compile(r"@import\s+(?:url\()?\s*['\"]([^'\"]+)['\"]", re.IGNORECASE)
HTML_FILE_PATTERN = re.compile(r"(?P<q>['\"])(?P<url>[^'\"#?]+\.html(?:\?[^'\"#]*)?)(?P=q)", re.IGNORECASE)


def canonicalize(raw_url: str, base_url: str) -> str | None:
    raw_url = (raw_url or "").strip()
    if not raw_url or raw_url.startswith(("#", "mailto:", "tel:", "javascript:", "data:", "blob:")):
        return None
    absolute = urljoin(base_url, raw_url)
    absolute, _ = urldefrag(absolute)
    parsed = urlparse(absolute)
    if parsed.scheme not in {"http", "https"}:
        return None
    if parsed.netloc != BASE.netloc:
        return None
    normalized_path = re.sub(r"/{2,}", "/", parsed.path or "/")
    return urlunparse((BASE.scheme, BASE.netloc, normalized_path, "", parsed.query, ""))


def parse_srcset(value: str) -> list[str]:
    urls: list[str] = []
    for item in value.split(","):
        candidate = item.strip().split()[0] if item.strip() else ""
        if candidate:
            urls.append(candidate)
    return urls


def local_path(url: str, content_type: str = "") -> Path:
    parsed = urlparse(url)
    raw_path = parsed.path or "/"
    if raw_path.endswith("/"):
        raw_path += "index.html"
    elif raw_path == "/":
        raw_path = "/index.html"
    name = PurePosixPath(raw_path).name
    suffix = PurePosixPath(raw_path).suffix.lower()
    if not suffix and "text/html" in content_type:
        raw_path = raw_path.rstrip("/") + "/index.html"
    if parsed.query:
        # Preserve the first canonical filename. Query variants are recorded in the manifest.
        pass
    safe_parts = [p for p in PurePosixPath(raw_path).parts if p not in {"/", "", ".", ".."}]
    return OUTPUT.joinpath(*safe_parts)


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def should_parse_html(content_type: str, path: Path) -> bool:
    return "text/html" in content_type or path.suffix.lower() in {".html", ".htm"}


def should_parse_css(content_type: str, path: Path) -> bool:
    return "text/css" in content_type or path.suffix.lower() == ".css"


def should_parse_js(content_type: str, path: Path) -> bool:
    return "javascript" in content_type or path.suffix.lower() in {".js", ".mjs"}


def enqueue_url(queue: deque[str], queued: set[str], raw: str, base_url: str) -> None:
    url = canonicalize(raw, base_url)
    if url and url not in queued:
        queued.add(url)
        queue.append(url)


def extract_from_html(text: str, page_url: str) -> tuple[list[str], list[str]]:
    page_links: list[str] = []
    resources: list[str] = []
    soup = BeautifulSoup(text, "html.parser")

    for tag in soup.find_all("a", href=True):
        href = tag.get("href", "")
        url = canonicalize(href, page_url)
        if not url:
            continue
        path = urlparse(url).path.lower()
        suffix = PurePosixPath(path).suffix.lower()
        if not suffix or suffix in {".html", ".htm"} or path.endswith("/"):
            page_links.append(url)
        elif suffix in BINARY_EXTS | TEXT_EXTS:
            resources.append(url)

    for tag_name, attrs in RESOURCE_ATTRS.items():
        for tag in soup.find_all(tag_name):
            for attr in attrs:
                value = tag.get(attr)
                if not value:
                    continue
                candidates = parse_srcset(value) if attr == "srcset" else [value]
                for candidate in candidates:
                    url = canonicalize(candidate, page_url)
                    if url:
                        resources.append(url)

    # Inline style blocks and style attributes.
    css_fragments = [tag.get_text("\n") for tag in soup.find_all("style")]
    css_fragments.extend(tag.get("style", "") for tag in soup.find_all(style=True))
    for css in css_fragments:
        for _, raw in CSS_URL_PATTERN.findall(css):
            url = canonicalize(raw, page_url)
            if url:
                resources.append(url)

    # Catch local asset references rendered or inserted by inline JavaScript.
    for pattern in (ASSET_PATTERN, HTML_FILE_PATTERN):
        for match in pattern.finditer(text):
            url = canonicalize(match.group("url"), page_url)
            if not url:
                continue
            if urlparse(url).path.lower().endswith((".html", ".htm")):
                page_links.append(url)
            else:
                resources.append(url)

    return page_links, resources


def extract_from_css(text: str, css_url: str) -> list[str]:
    urls: list[str] = []
    for _, raw in CSS_URL_PATTERN.findall(text):
        url = canonicalize(raw, css_url)
        if url:
            urls.append(url)
    for raw in CSS_IMPORT_PATTERN.findall(text):
        url = canonicalize(raw, css_url)
        if url:
            urls.append(url)
    return urls


def extract_from_js(text: str, js_url: str) -> list[str]:
    urls: list[str] = []
    for pattern in (ASSET_PATTERN, HTML_FILE_PATTERN):
        for match in pattern.finditer(text):
            url = canonicalize(match.group("url"), js_url)
            if url:
                urls.append(url)
    return urls


def main() -> int:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT, "Accept": "*/*"})

    queue: deque[str] = deque()
    queued: set[str] = set()
    visited: set[str] = set()
    manifest: list[dict] = []
    failures: list[dict] = []

    enqueue_url(queue, queued, BASE_URL, BASE_URL)
    for standard in ("robots.txt", "sitemap.xml"):
        enqueue_url(queue, queued, standard, BASE_URL)

    while queue and len(visited) < MAX_URLS:
        url = queue.popleft()
        if url in visited:
            continue
        visited.add(url)
        try:
            response = session.get(url, timeout=TIMEOUT, allow_redirects=True)
        except Exception as exc:
            failures.append({"url": url, "error": repr(exc)})
            continue

        content_type = response.headers.get("content-type", "").split(";", 1)[0].strip().lower()
        if response.status_code >= 400:
            # Optional well-known files may legitimately be absent.
            if urlparse(url).path not in {"/robots.txt", "/sitemap.xml"}:
                failures.append({"url": url, "status": response.status_code})
            continue

        data = response.content
        path = local_path(url, content_type)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)

        record = {
            "url": url,
            "final_url": response.url,
            "path": path.relative_to(OUTPUT).as_posix(),
            "status": response.status_code,
            "content_type": content_type,
            "size_bytes": len(data),
            "sha256": sha256_bytes(data),
        }
        manifest.append(record)

        encoding = response.encoding or response.apparent_encoding or "utf-8"
        try:
            text = data.decode(encoding, errors="replace")
        except LookupError:
            text = data.decode("utf-8", errors="replace")

        if should_parse_html(content_type, path):
            page_links, resources = extract_from_html(text, response.url)
            for found in page_links + resources:
                enqueue_url(queue, queued, found, response.url)
            # Seed sitemap URLs when available.
            if path.name == "sitemap.xml":
                for loc in re.findall(r"<loc>\s*(.*?)\s*</loc>", text, flags=re.I | re.S):
                    enqueue_url(queue, queued, loc, response.url)
        elif should_parse_css(content_type, path):
            for found in extract_from_css(text, response.url):
                enqueue_url(queue, queued, found, response.url)
        elif should_parse_js(content_type, path):
            for found in extract_from_js(text, response.url):
                enqueue_url(queue, queued, found, response.url)

        time.sleep(0.05)

    index = OUTPUT / "index.html"
    if not index.exists():
        print("ERROR: live homepage was not captured", file=sys.stderr)
        return 2
    homepage = index.read_text(encoding="utf-8", errors="replace")
    expected = "Natural oolitic aragonite, sized to your process."
    if expected not in homepage:
        print(f"ERROR: homepage validation text not found: {expected}", file=sys.stderr)
        return 3

    html_paths = sorted({m["path"] for m in manifest if m["content_type"] == "text/html" or m["path"].endswith((".html", ".htm"))})
    images = sorted({m["path"] for m in manifest if m["path"].lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg", ".ico"))})
    videos = sorted({m["path"] for m in manifest if m["path"].lower().endswith((".mp4", ".webm", ".mov", ".m4v", ".ogv"))})

    summary = {
        "source": BASE_URL,
        "captured_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "homepage_validation": expected,
        "files_downloaded": len(manifest),
        "html_pages": html_paths,
        "image_assets": images,
        "video_assets": videos,
        "failures": failures,
        "files": sorted(manifest, key=lambda item: item["path"]),
    }
    (OUTPUT / "capture-manifest.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")

    # Fail on any referenced internal resource that could not be fetched.
    if failures:
        print(json.dumps(failures, indent=2), file=sys.stderr)
        return 4

    print(json.dumps({
        "files": len(manifest),
        "html_pages": len(html_paths),
        "images": len(images),
        "videos": len(videos),
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
