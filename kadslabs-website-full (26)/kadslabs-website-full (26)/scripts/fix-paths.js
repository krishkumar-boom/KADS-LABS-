const fs = require('fs')
const path = require('path')

const distDir = path.join(__dirname, '..', 'dist')

function fixHtmlPaths(filePath, depth) {
  let content = fs.readFileSync(filePath, 'utf8')

  const prefix = depth === 0 ? './' : '../'.repeat(depth)

  // Fix absolute Next.js asset paths in HTML attributes
  content = content.replace(/href="\/_next\//g, `href="${prefix}_next/`)
  content = content.replace(/src="\/_next\//g, `src="${prefix}_next/`)
  content = content.replace(/src="\/logo\.png"/g, `src="${prefix}logo.png"`)
  content = content.replace(/href="\/logo\.png"/g, `href="${prefix}logo.png"`)
  content = content.replace(/src="\/team\//g, `src="${prefix}team/`)
  content = content.replace(/href="\/team\//g, `href="${prefix}team/`)
  content = content.replace(/href="\/manifest\.json"/g, `href="${prefix}manifest.json"`)
  content = content.replace(/src="\/sw\.js"/g, `src="${prefix}sw.js"`)

  // Fix escaped JSON paths inside Next.js inline __next_f scripts (e.g. \"/_next/...\")
  content = content.replace(/\\"\/_next\//g, `\\"${prefix}_next/`)
  content = content.replace(/\\"\/logo\.png\\"/g, `\\"${prefix}logo.png\\"`)
  content = content.replace(/\\"\/team\//g, `\\"${prefix}team/`)
  content = content.replace(/\\"\/manifest\.json\\"/g, `\\"${prefix}manifest.json\\"`)
  content = content.replace(/\\"\/sw\.js\\"/g, `\\"${prefix}sw.js\\"`)

  // Fix unescaped JSON paths inside inline scripts (e.g. \"/_next/...\")
  content = content.replace(/\\"\/logo\.png"/g, `\\"${prefix}logo.png"`)
  content = content.replace(/\\"\/manifest\.json"/g, `\\"${prefix}manifest.json"`)
  content = content.replace(/\\"\/sw\.js"/g, `\\"${prefix}sw.js"`)
  content = content.replace(/\\"\/_next\//g, `\\"${prefix}_next/`)
  content = content.replace(/\\"\/team\//g, `\\"${prefix}team/`)

  fs.writeFileSync(filePath, content)
  console.log(`Fixed paths in ${filePath}`)
}

function walkHtml(dir, depth = 0) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkHtml(fullPath, depth + 1)
    } else if (entry.name.endsWith('.html') || entry.name.endsWith('.txt')) {
      fixHtmlPaths(fullPath, depth)
    }
  }
}

// Fix JS chunks that contain absolute image references.
function fixJsChunks() {
  const chunksDir = path.join(distDir, '_next', 'static', 'chunks')
  if (!fs.existsSync(chunksDir)) return

  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.name.endsWith('.js')) {
        let content = fs.readFileSync(fullPath, 'utf8')
        const original = content
        // For admin-specific chunk: relative to admin/index.html
        const isAdminChunk = fullPath.includes(path.join('app', 'admin'))
        if (isAdminChunk) {
          content = content.replace(/"\/team\//g, '"../team/')
          content = content.replace(/"\/logo\.png"/g, '"../logo.png"')
          content = content.replace(/"\/manifest\.json"/g, '"../manifest.json"')
          content = content.replace(/"\/sw\.js"/g, '"../sw.js"')
        } else {
          // For main page chunks: relative to index.html
          content = content.replace(/"\/team\//g, '"./team/')
          content = content.replace(/"\/logo\.png"/g, '"./logo.png"')
          content = content.replace(/"\/manifest\.json"/g, '"./manifest.json"')
          content = content.replace(/"\/sw\.js"/g, '"./sw.js"')
        }
        if (content !== original) {
          fs.writeFileSync(fullPath, content)
          console.log(`Fixed JS paths in ${fullPath}`)
        }
      }
    }
  }

  walk(chunksDir)
}

walkHtml(distDir)
fixJsChunks()

// Write a fresh VERSION file into dist/ with build timestamp — used by service worker
// for cache invalidation on every deployment
const version = `${Date.now()}-${(process.env.VERCEL_GIT_COMMIT_SHA || 'local').slice(0, 7)}`
fs.writeFileSync(path.join(distDir, 'VERSION'), version + '\n')
// Also update public/VERSION so non-deployed copies get new version
fs.writeFileSync(path.join(__dirname, '..', 'public', 'VERSION'), version + '\n')
console.log('Version stamped:', version)

// Copy Vercel + Netlify config files into dist for proper cache headers on static hosts
const copyIfExists = (src, dest) => {
  const s = path.join(__dirname, '..', src)
  const d = path.join(distDir, dest)
  if (fs.existsSync(s)) fs.copyFileSync(s, d)
}
copyIfExists('vercel.json', 'vercel.json')
copyIfExists('public/_headers', '_headers')
copyIfExists('public/robots.txt', 'robots.txt')
copyIfExists('public/sitemap.xml', 'sitemap.xml')
copyIfExists('public/manifest.json', 'manifest.json')

console.log('Path fixing complete.')
