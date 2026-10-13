import { useEffect, useRef, useState } from 'react'

// หน้าผู้จัดทำเว็บ (ซ่อนไว้) — เปิดด้วยรหัสลับ
//   คีย์บอร์ด: ↑ ↑ ↓ ↓ ← → ← → B A
//   มือถือ: แตะโลโก้ที่ footer 5 ครั้งติดกัน
const CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
const TAPS = 5

// ลิงก์บนการ์ด (พิกเซลของภาพ dev-credits.webp 1320×600)
const IMG_W = 1320
const IMG_H = 600
const fb = (name) => `https://www.facebook.com/search/top?q=${encodeURIComponent(name)}`
const LINKS = [
  { label: 'Instagram ไทด์', href: 'https://www.instagram.com/tidenattapop/', x: 118, y: 385, w: 150 },
  { label: 'Facebook ไทด์', href: fb('Tide Nattapop'), x: 118, y: 419, w: 156 },
  { label: 'Instagram ไตเติ้ล', href: 'https://www.instagram.com/titlxz_/', x: 498, y: 385, w: 92 },
  { label: 'Facebook ไตเติ้ล', href: fb('Napat Taseeta'), x: 498, y: 419, w: 156 },
  { label: 'Instagram สตาร์ท', href: 'https://www.instagram.com/sa_tart_quarterback_001/', x: 878, y: 385, w: 248 },
  { label: 'Facebook สตาร์ท', href: fb('Start Start'), x: 878, y: 419, w: 122 },
]
const ROW_H = 24

export default function DevCredits() {
  const [open, setOpen] = useState(false)
  const closeRef = useRef(null)

  useEffect(() => {
    let pos = 0
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      pos = key === CODE[pos] ? pos + 1 : key === CODE[0] ? 1 : 0
      if (pos === CODE.length) {
        pos = 0
        setOpen(true)
      }
    }

    let taps = 0
    let timer = 0
    const onTap = (e) => {
      if (!e.target.closest('.footer__logo')) return
      taps += 1
      clearTimeout(timer)
      timer = setTimeout(() => (taps = 0), 1500)
      if (taps >= TAPS) {
        taps = 0
        setOpen(true)
      }
    }

    window.addEventListener('keydown', onKey)
    document.addEventListener('click', onTap)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onTap)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  return (
    <div className="credits" role="dialog" aria-modal="true" aria-label="Website Developer" onClick={() => setOpen(false)}>
      <div className="credits__card" onClick={(e) => e.stopPropagation()}>
        <img
          src="./images/dev-credits.webp"
          width={IMG_W}
          height={IMG_H}
          alt="Website Developer: ไทด์ (Developer), ไตเติ้ล (Designer), สตาร์ท (Project Director) — Communication and New Media, Digital Advertising"
        />
        {LINKS.map((l) => (
          <a
            key={l.label}
            className="credits__link"
            href={l.href}
            target="_blank"
            rel="noreferrer"
            aria-label={l.label}
            style={{
              left: `${(l.x / IMG_W) * 100}%`,
              top: `${(l.y / IMG_H) * 100}%`,
              width: `${(l.w / IMG_W) * 100}%`,
              height: `${(ROW_H / IMG_H) * 100}%`,
            }}
          />
        ))}
        <button ref={closeRef} className="credits__close" type="button" onClick={() => setOpen(false)} aria-label="ปิด">
          ×
        </button>
      </div>
    </div>
  )
}
