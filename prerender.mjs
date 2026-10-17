// ฝัง HTML ที่เรนเดอร์แล้วลงใน dist/index.html (รันต่อจาก vite build ทั้งสองรอบ)
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const { render } = await import(pathToFileURL('dist-server/entry-server.js').href)
const file = 'dist/index.html'
const html = readFileSync(file, 'utf8')
if (!html.includes('<div id="root"></div>')) throw new Error('ไม่เจอ <div id="root"></div> ใน dist/index.html')
writeFileSync(file, html.replace('<div id="root"></div>', `<div id="root">${render()}</div>`))
rmSync('dist-server', { recursive: true, force: true })
console.log('prerendered', file)
