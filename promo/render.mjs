// เรนเดอร์ index.html ทีละเฟรมแล้วส่งเข้า ffmpeg
//   node render.mjs                 -> out/green-in-action-promo.mp4 (พร้อมเสียงถ้ามี out/sfx.wav)
//   node render.mjs --stills 2,6,12 -> out/still-<t>.png สำหรับตรวจภาพ
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import os from 'node:os'

const here = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(here, 'out')
mkdirSync(out, { recursive: true })

const FPS = 30
const args = process.argv.slice(2)
const stillsArg = args.includes('--stills') ? args[args.indexOf('--stills') + 1] : null

const exe =
  process.env.CHROME_PATH ||
  path.join(os.homedir(), '.cache/ms-playwright/chromium-1248/chrome-linux64/chrome')

const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })
await page.goto(pathToFileURL(path.join(here, 'index.html')).href)
await page.evaluate(() => window.ready)
const stage = page.locator('#stage')
const duration = await page.evaluate(() => window.DURATION)

if (stillsArg) {
  for (const t of stillsArg.split(',').map(Number)) {
    await page.evaluate((t) => window.render(t), t)
    await stage.screenshot({ path: path.join(out, `still-${t}.png`) })
    console.log('still', t)
  }
  await browser.close()
  process.exit(0)
}

const silent = path.join(out, 'video-silent.mp4')
const ff = spawn('ffmpeg', [
  '-y', '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  silent,
], { stdio: ['pipe', 'inherit', 'inherit'] })

const frames = Math.round(duration * FPS)
const started = Date.now()
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.render(t), i / FPS)
  const buf = await stage.screenshot({ type: 'png' })
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r))
  if (i % 60 === 0) console.log(`frame ${i}/${frames}  ${((Date.now() - started) / 1000).toFixed(0)}s`)
}
ff.stdin.end()
await new Promise((r) => ff.on('close', r))
await browser.close()

const sfx = path.join(out, 'sfx.wav')
const final = path.join(out, 'green-in-action-promo.mp4')
if (existsSync(sfx)) {
  await new Promise((r, j) =>
    spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-i', sfx, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', final], { stdio: 'inherit' })
      .on('close', (c) => (c === 0 ? r() : j(new Error('mux failed')))),
  )
} else {
  await new Promise((r) => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', silent, '-c', 'copy', final]).on('close', r))
}
console.log('done ->', final)
