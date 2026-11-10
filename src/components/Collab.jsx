import { useEffect, useRef, useState } from 'react'
import { COLLAB } from '../data.js'
import { ICONS } from './Footer.jsx'

const LABELS = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok' }

// ตำแหน่งการ์ดตามลำดับในกอง (0 = ใบหน้าสุด) x / y เป็น % ของขนาดการ์ด, r เป็นองศา
const FAN = [
  { x: 0, y: 0, r: -2 },
  { x: 7, y: -3, r: 6 },
  { x: -8, y: 2, r: -8 },
  { x: 11, y: -5, r: 10 },
  { x: -11, y: 4, r: -12 },
  { x: 4, y: -7, r: 3 },
  { x: -4, y: 6, r: -5 },
  { x: 13, y: -1, r: 14 },
  { x: -13, y: 2, r: -15 },
  { x: 9, y: 5, r: 8 },
]

// รูปแรกเป็นโปสเตอร์หลักของ O-SHOO ตามด้วยโพสต์ทั้งหมด
const CARDS = [
  { src: './images/collab-oshoo.webp', alt: 'โปสเตอร์ O-SHOO The Ocean จุดประกายจาก…ปลายดอย' },
  ...COLLAB.posts.map((alt, i) => ({ src: `./images/partner-${i + 1}.webp`, alt })),
]

const INTERVAL_MS = 3200

// กองรูปซ้อน: ใบหน้าสุดจะถูกส่งไปไว้ท้ายกองเองทุก ๆ INTERVAL_MS
function PartnerStack() {
  const [front, setFront] = useState(0)
  const wrap = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let visible = false
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(wrap.current)
    const id = setInterval(() => {
      if (!visible || document.hidden) return
      setFront((f) => f + 1)
    }, INTERVAL_MS)
    return () => {
      clearInterval(id)
      io.disconnect()
    }
  }, [])

  // front นับเพิ่มไปเรื่อย ๆ ใบที่เพิ่งถูกส่งไปท้ายกองคือใบก่อนหน้า
  const top = front % CARDS.length
  const leaving = front > 0 ? (front - 1) % CARDS.length : null

  return (
    <div ref={wrap} className="pstack-wrap reveal">
      <div className="pstack">
        {CARDS.map((c, i) => {
          const pos = (i - top + CARDS.length) % CARDS.length
          const f = FAN[pos % FAN.length]
          return (
            <figure
              key={c.src}
              className={`pstack__card ${pos === 0 ? 'is-front' : ''} ${leaving === i ? 'is-leaving' : ''}`}
              style={{ '--x': `${f.x}%`, '--y': `${f.y}%`, '--r': `${f.r}deg`, '--z': CARDS.length - pos, '--d': `${pos * 60}ms` }}
              aria-hidden={pos !== 0}
            >
              <img src={c.src} alt={c.alt} width="800" height="1000" loading="lazy" />
            </figure>
          )
        })}
      </div>
    </div>
  )
}

// ช่วงสุดท้ายก่อน footer: ชวนไปรู้จัก O-SHOO The Ocean (ใช้โปสเตอร์เป็นพื้นหลัง)
export default function Collab() {
  return (
    <section className="collab" id="collab" aria-labelledby="collab-title">
      <img className="collab__bg" src="./images/collab-oshoo.webp" alt="" aria-hidden="true" loading="lazy" />
      <div className="container collab__inner">
        <div className="collab__text reveal">
          <p className="collab__tag">Partner</p>
          <h2 id="collab-title" className="collab__title">{COLLAB.name}</h2>
          <p className="collab__quote">“{COLLAB.quote}”</p>
          <dl className="collab__meanings">
            {COLLAB.meanings.map((m) => (
              <div key={m.word}>
                <dt>{m.word}</dt>
                <dd>ภาษากะเหรี่ยงแปลว่า “{m.meaning}”</dd>
              </div>
            ))}
          </dl>
          <div className="collab__social">
            {Object.entries(COLLAB.social).map(([key, url]) => (
              <a
                key={key}
                className={`btn btn--sm collab__btn ${url ? '' : 'is-pending'}`}
                href={url || '#'}
                target={url ? '_blank' : undefined}
                rel="noreferrer"
                aria-disabled={!url}
                onClick={(e) => !url && e.preventDefault()}
              >
                <span className="collab__btn-row">
                  {ICONS[key]}
                  {LABELS[key]}
                </span>
                {!url && <small>เร็ว ๆ นี้</small>}
              </a>
            ))}
          </div>
        </div>
        <PartnerStack />
      </div>
    </section>
  )
}
