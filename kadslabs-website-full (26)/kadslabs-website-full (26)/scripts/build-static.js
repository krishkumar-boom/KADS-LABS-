// scripts/build-static.js
// Runs a Next.js static export (output:'export', distDir:'dist') while
// temporarily moving app/api/ aside so API routes don't break static export.
// API routes can never be part of a static export (they need a Node server),
// and Next.js refuses to compile any route under app/api/ when output:'export'
// is set — even if the route itself returns static JSON. Moving the directory
// is the official-safe workaround that preserves the source tree.
//
// Usage (from package.json):
//   "build:static": "node scripts/build-static.js && node scripts/fix-paths.js"
const { spawnSync } = require("child_process")
const fs = require("fs")
const path = require("path")

const projectRoot = path.resolve(__dirname, "..")
const apiDir = path.join(projectRoot, "app", "api")
const apiHiddenDir = path.join(projectRoot, "app", "_api_disabled")

function log(msg) {
  // eslint-disable-next-line no-console
  console.log(`[build-static] ${msg}`)
}

function restore() {
  if (fs.existsSync(apiHiddenDir) && !fs.existsSync(apiDir)) {
    fs.renameSync(apiHiddenDir, apiDir)
    log("restored app/api/")
  }
}

function fail(err) {
  restore()
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
}

async function main() {
  const hasApi = fs.existsSync(apiDir)
  if (hasApi) {
    if (fs.existsSync(apiHiddenDir)) {
      // Clean up stale leftovers from a prior crashed run
      fs.rmSync(apiHiddenDir, { recursive: true, force: true })
    }
    fs.renameSync(apiDir, apiHiddenDir)
    log("moved app/api/ -> app/_api_disabled/ for static build")
  } else {
    log("no app/api/ directory found — building as-is")
  }

  // Make sure env is set (belt & suspenders — also set in package.json)
  process.env.NEXT_STATIC_EXPORT = "true"

  const res = spawnSync("npx", ["next", "build"], {
    cwd: projectRoot,
    stdio: "inherit",
    env: { ...process.env, NEXT_STATIC_EXPORT: "true" },
  })

  restore()

  if (res.status !== 0) {
    process.exit(res.status || 1)
  }
}

main().catch(fail)

// Safety net: restore on unexpected exit
process.on("SIGINT", () => { restore(); process.exit(130) })
process.on("uncaughtException", fail)
