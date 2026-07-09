import { chromium } from 'playwright'
import { mkdir, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

// Element-clipped screenshots of the gallery for the styling feedback loop.
// Captures each stage (one component scenario) as its own small PNG, so images
// stay well under the per-image token cap. Requires the gallery running:
//   pnpm dev:ui        # http://localhost:5199
//   pnpm --filter @geonode/ui shots [component] [--scenario=x] [--theme=light,dark]
//
// Args:
//   [component]       first positional; isolates one group (?only=<slug>)
//   --scenario=<name> one scenario within it
//   --theme=a,b       light | dark | auto (default: light)
//   --url=<url>       gallery base (default http://localhost:5199 or $SHOTS_URL)
//   --width=<px>      viewport width (default 1000; deviceScaleFactor is 1 so
//                     1 CSS px = 1 image px, keeping shots small)

const HERE = dirname(fileURLToPath(import.meta.url))
const OUT = join(HERE, '__shots__')

const argv = process.argv.slice(2)
const positional = argv.filter((a) => !a.startsWith('--'))
const flags = Object.fromEntries(
  argv
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [k, v] = a.slice(2).split('=')
      return [k, v ?? true]
    }),
)

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const BASE = flags.url || process.env.SHOTS_URL || 'http://localhost:5199'
const only = positional[0] || flags.only
const scenario = flags.scenario
const themes = String(flags.theme || 'light').split(',')
const WIDTH = Number(flags.width || 1000)

const browser = await chromium.launch().catch((err) => {
  console.error('Could not launch Chromium. Install it once with:\n  pnpm exec playwright install chromium')
  throw err
})

try {
  await rm(OUT, { recursive: true, force: true })
  const context = await browser.newContext({ viewport: { width: WIDTH, height: 900 }, deviceScaleFactor: 1 })
  const page = await context.newPage()

  for (const theme of themes) {
    const url = new URL(BASE)
    url.searchParams.set('theme', theme)
    if (only) url.searchParams.set('only', slug(only))
    if (scenario) url.searchParams.set('scenario', slug(scenario))

    const resp = await page.goto(url.href, { waitUntil: 'load' }).catch(() => null)
    if (!resp) {
      console.error(`Cannot reach ${BASE} - start the gallery first:\n  pnpm dev:ui`)
      process.exit(1)
    }
    await page.waitForSelector('[data-stage]', { timeout: 5000 })

    const dir = join(OUT, theme)
    await mkdir(dir, { recursive: true })
    for (const stage of await page.$$('[data-stage]')) {
      const id = await stage.getAttribute('data-stage')
      await stage.screenshot({ path: join(dir, `${id}.png`) })
      console.log(`${theme}/${id}.png`)
    }
  }
} finally {
  await browser.close()
}
