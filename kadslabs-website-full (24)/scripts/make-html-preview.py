#!/usr/bin/env python3
"""Create a self-contained static HTML preview from the Next.js export."""
import base64
from pathlib import Path
from bs4 import BeautifulSoup
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
OUT = ROOT / "kadslabs-website.html"


def mime_for(path: Path) -> str:
    ext = path.suffix.lower()
    return {
        ".png": "image/png",
        ".svg": "image/svg+xml",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".webp": "image/webp",
    }.get(ext, "application/octet-stream")


def to_data_uri(path: Path) -> str:
    data = path.read_bytes()
    if path.suffix.lower() == ".svg":
        try:
            text = data.decode("utf-8")
            encoded = (
                text.replace("%", "%25")
                .replace('"', "%22")
                .replace("#", "%23")
                .replace("<", "%3C")
                .replace(">", "%3E")
                .replace("&", "%26")
                .replace("\n", "%0A")
                .replace("\r", "")
            )
            return f"data:image/svg+xml;charset=utf-8,{encoded}"
        except UnicodeDecodeError:
            pass
    return f"data:{mime_for(path)};base64,{base64.b64encode(data).decode('ascii')}"


def make_resized_logo(src: Path, dest: Path, size: int = 128) -> None:
    img = Image.open(src).convert("RGBA")
    img.thumbnail((size, size), Image.Resampling.LANCZOS)
    img.save(dest, "PNG", optimize=True)


def main():
    if not DIST.exists():
        raise SystemExit(f"dist/ folder not found at {DIST}")

    soup = BeautifulSoup((DIST / "index.html").read_text(encoding="utf-8"), "lxml")

    # Use a small logo preview so the single HTML file stays lightweight
    logo_src = DIST / "logo.png"
    preview_logo = ROOT / "logo-preview.png"
    make_resized_logo(logo_src, preview_logo, size=128)
    logo_data = to_data_uri(preview_logo)

    # Inline CSS
    for link in list(soup.find_all("link", rel="stylesheet")):
        href = link.get("href") or ""
        if href.startswith("./") or href.startswith("/"):
            css_path = DIST / href.lstrip("./").lstrip("/")
            if css_path.exists():
                style = soup.new_tag("style")
                style.string = css_path.read_text(encoding="utf-8")
                link.replace_with(style)
            else:
                link.decompose()

    # Remove preloads and manifest
    for link in list(soup.find_all("link", rel="preload")):
        link.decompose()
    for link in list(soup.find_all("link", rel="manifest")):
        link.decompose()

    # Replace local image/link assets with data URIs. Use the small logo preview
    # for every logo.png reference so the file does not bloat.
    for tag in soup.find_all(["link", "img"]):
        attr = "href" if tag.name == "link" else "src"
        val = tag.get(attr) or ""
        if not val.startswith("./") and not val.startswith("/"):
            continue
        asset_path = DIST / val.lstrip("./").lstrip("/")
        if not asset_path.exists():
            continue
        if asset_path.name == "logo.png":
            tag[attr] = logo_data
        else:
            tag[attr] = to_data_uri(asset_path)

    # Remove all scripts (Next.js hydration, chunks, etc.) except JSON-LD.
    for script in list(soup.find_all("script")):
        if script.get("type") == "application/ld+json":
            continue
        script.decompose()

    # Force the loading overlay off and reveal animated elements.
    extra = soup.new_tag("style")
    extra.string = """
        .js-loading { display: none !important; }
        html, body { scroll-behavior: smooth; }
        [style*="opacity:0"] { opacity: 1 !important; transform: none !important; }
        [style*="transform:translateY(20px)"] { transform: none !important; }
        [style*="transform:scale(0.8)"] { transform: none !important; }
        [style*="transform:translateY(-100px)"] { transform: none !important; }
        .html-theme-toggle { position: fixed; bottom: 20px; right: 20px; z-index: 9999; width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(37,99,235,0.3); background: rgba(15,23,42,0.8); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.2); backdrop-filter: blur(10px); transition: all 0.3s ease; }
        .html-theme-toggle:hover { transform: scale(1.1); box-shadow: 0 0 20px rgba(37,99,235,0.4); }
        .light .html-theme-toggle { background: rgba(255,255,255,0.85); color: #0f172a; border-color: rgba(15,23,42,0.15); }
        .html-theme-toggle svg { width: 22px; height: 22px; }
        .html-language-toggle { position: fixed; bottom: 20px; right: 72px; z-index: 9999; height: 44px; padding: 0 14px; border-radius: 22px; border: 1px solid rgba(37,99,235,0.3); background: rgba(15,23,42,0.8); color: #fff; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); backdrop-filter: blur(10px); transition: all 0.3s ease; font-size: 13px; font-weight: 600; }
        .html-language-toggle:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(37,99,235,0.4); }
        .light .html-language-toggle { background: rgba(255,255,255,0.85); color: #0f172a; border-color: rgba(15,23,42,0.15); }
        .html-hindi-note { display: none; position: fixed; bottom: 72px; right: 20px; max-width: 260px; padding: 12px 14px; border-radius: 12px; background: rgba(37,99,235,0.95); color: #fff; font-size: 13px; line-height: 1.5; z-index: 9998; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
        .light .html-hindi-note { background: rgba(37,99,235,0.95); color: #fff; }
        .html-hindi-active .html-hindi-note { display: block; }
    """
    if soup.head:
        soup.head.append(extra)
    if soup.title:
        soup.title.string = "KADS LABS | Static HTML Preview"

    # Add a vanilla JS theme toggle for the static HTML preview.
    theme_script = soup.new_tag("script")
    theme_script.string = """
        (function(){
            var key = 'kads-theme';
            var stored = localStorage.getItem(key);
            var resolved = stored === 'light' ? 'light' : 'dark';
            document.documentElement.classList.add(resolved);
            var meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.content = resolved === 'dark' ? '#050B18' : '#f8fafc';
            var btn = document.createElement('button');
            btn.className = 'html-theme-toggle';
            btn.setAttribute('aria-label', 'Toggle theme');
            btn.innerHTML = resolved === 'dark' ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
            btn.onclick = function(){
                var isDark = document.documentElement.classList.contains('dark');
                var next = isDark ? 'light' : 'dark';
                document.documentElement.classList.remove('dark','light');
                document.documentElement.classList.add(next);
                localStorage.setItem(key, next);
                if (meta) meta.content = next === 'dark' ? '#050B18' : '#f8fafc';
                btn.setAttribute('aria-label', next === 'dark' ? 'Switch to light' : 'Switch to dark');
                btn.innerHTML = next === 'dark' ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
            };
            document.body.appendChild(btn);
        })();
    """
    if soup.body:
        soup.body.append(theme_script)

    # Add a vanilla JS language toggle for the static HTML preview.
    lang_script = soup.new_tag("script")
    lang_script.string = """
        (function(){
            var langKey = 'kads-language';
            var lang = localStorage.getItem(langKey) || 'en';
            document.documentElement.setAttribute('lang', lang);
            var btn = document.createElement('button');
            btn.className = 'html-language-toggle';
            btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg><span>' + (lang === 'hi' ? 'हिंदी' : 'EN') + '</span>';
            btn.onclick = function(){
                lang = lang === 'hi' ? 'en' : 'hi';
                localStorage.setItem(langKey, lang);
                document.documentElement.setAttribute('lang', lang);
                btn.querySelector('span').textContent = lang === 'hi' ? 'हिंदी' : 'EN';
                document.documentElement.classList.toggle('html-hindi-active', lang === 'hi');
            };
            document.body.appendChild(btn);
            var note = document.createElement('div');
            note.className = 'html-hindi-note';
            note.innerHTML = '🇮🇳 <strong>हिंदी भाषा चालू है</strong><br>पूर्ण हिंदी अनुवाद के लिए कृपया ZIP से फुल ऐप खोलें।';
            document.body.appendChild(note);
            document.documentElement.classList.toggle('html-hindi-active', lang === 'hi');
        })();
    """
    if soup.body:
        soup.body.append(lang_script)

    OUT.write_text("<!DOCTYPE html>\n" + str(soup), encoding="utf-8")
    print(f"Created {OUT} ({OUT.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
