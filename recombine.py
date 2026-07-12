#!/usr/bin/env python3
"""Recombine split base64 parts into the original ZIP file.
Place all *_partN.txt files in the same folder and run:
    python3 recombine.py
"""
import base64
from pathlib import Path

for prefix, out_name in [('kadslabs_website', 'kadslabs-website.zip'), ('kadslabs_source', 'kadslabs-website-full.zip')]:
    parts = sorted(Path('.').glob(f'{prefix}_part*.txt'))
    if not parts:
        continue
    raw = b''
    for p in parts:
        raw += base64.b64decode(p.read_text(encoding='utf-8'))
    Path(out_name).write_bytes(raw)
    print(f'Recreated {out_name} ({len(raw):,} bytes)')
