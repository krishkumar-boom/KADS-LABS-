#!/usr/bin/env node
/**
 * Optimize logo PNGs into WebP + compressed PNG fallbacks.
 * Run: node scripts/optimize-images.js
 */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const PUBLIC = path.join(__dirname, '..', 'public')

const targets = [
  { src: 'logo.png', sizes: [512, 256, 192, 128, 64, 32] },
  { src: 'logo-media.png', sizes: [256, 128, 64] },
  { src: 'logo-tech.png', sizes: [256, 128, 64] },
]

async function optimize() {
  for (const t of targets) {
    const fullSrc = path.join(PUBLIC, t.src)
    if (!fs.existsSync(fullSrc)) {
      console.log('skip missing:', t.src)
      continue
    }
    const base = path.parse(t.src).name
    for (const size of t.sizes) {
      // Compressed PNG fallback (for Safari <16 / older browsers)
      await sharp(fullSrc)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ quality: 80, compressionLevel: 9, palette: false })
        .toFile(path.join(PUBLIC, `${base}-${size}.png`))

      // WebP (modern browsers — ~60-80% smaller)
      await sharp(fullSrc)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 82, lossless: false, effort: 6 })
        .toFile(path.join(PUBLIC, `${base}-${size}.webp`))
    }
    // Full-size optimized webp
    await sharp(fullSrc)
      .webp({ quality: 85, effort: 6 })
      .toFile(path.join(PUBLIC, `${base}.webp`))

    const stat = fs.statSync(fullSrc)
    console.log(`optimized ${t.src}: ${(stat.size/1024).toFixed(0)}KB original -> WebP variants`)
  }

  // Generate a favicon.ico (32x32 PNG works as icon too, modern browsers accept .png favicon)
  // We'll create 32x32 PNG favicon
  await sharp(path.join(PUBLIC, 'logo.png'))
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 90 })
    .toFile(path.join(PUBLIC, 'favicon-32.png'))
  await sharp(path.join(PUBLIC, 'logo.png'))
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 90 })
    .toFile(path.join(PUBLIC, 'favicon-16.png'))
  await sharp(path.join(PUBLIC, 'logo.png'))
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 90 })
    .toFile(path.join(PUBLIC, 'apple-touch-icon.png'))
  await sharp(path.join(PUBLIC, 'logo.png'))
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 90 })
    .toFile(path.join(PUBLIC, 'icon-192.png'))
  await sharp(path.join(PUBLIC, 'logo.png'))
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 90 })
    .toFile(path.join(PUBLIC, 'icon-512.png'))

  console.log('done!')
}

optimize().catch(e => { console.error(e); process.exit(1) })
