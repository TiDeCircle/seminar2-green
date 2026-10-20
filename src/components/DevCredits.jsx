import { useEffect, useRef, useState } from 'react'

// หน้าผู้จัดทำเว็บ (ซ่อนไว้) — เปิดด้วยรหัสลับ
//   คีย์บอร์ด: ↑ ↑ ↓ ↓ ← → ← → B A
//   มือถือ: แตะโลโก้ที่ footer 5 ครั้งติดกัน
const CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
const TAPS = 5

// ข้อมูลผู้จัดทำ — fb คือชื่อที่โชว์ ถ้ามี fbUrl จะลิงก์ไปโปรไฟล์ตรง ๆ ไม่งั้นจะไปหน้าค้นหาชื่อใน Facebook
const fb = (name) => `https://www.facebook.com/search/top?q=${encodeURIComponent(name)}`
const PEOPLE = [
  {
    name: 'ไทด์',
    role: 'Developer',
    photo: 'dev-photo-tide',
    ig: 'tidenattapop',
    fb: 'Tide Nattapop',
  },
  {
    name: 'ไตเติ้ล',
    role: 'Designer',
    photo: 'dev-photo-title',
    ig: 'titlxz_',
    fb: 'Napat Taseeta',
    fbUrl: 'https://www.facebook.com/Nptsx',
  },
  {
    name: 'สตาร์ท',
    role: 'Project Director',
    photo: 'dev-photo-start',
    ig: 'sa_tart_quarterback_001',
    fb: 'Start Start',
  },
]
const igUrl = (handle) => `https://www.instagram.com/${handle}/`

function IgIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id="credits-ig" cx="30%" cy="107%" r="150%">
          <stop offset="0" stopColor="#fdf497" />
          <stop offset="0.1" stopColor="#fdf497" />
          <stop offset="0.5" stopColor="#fd5949" />
          <stop offset="0.68" stopColor="#d6249f" />
          <stop offset="1" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill="url(#credits-ig)" />
      <rect x="6.5" y="6.5" width="11" height="11" rx="3.4" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.6" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="15.3" cy="8.7" r="0.85" fill="#fff" />
    </svg>
  )
}

function FbIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M13.3 19.5v-6h2l.3-2.4h-2.3V9.6c0-.7.2-1.2 1.2-1.2h1.2V6.3c-.2 0-1-.1-1.8-.1-1.8 0-3 1.1-3 3.1v1.8h-2v2.4h2v6z"
        fill="#fff"
      />
    </svg>
  )
}

function CreditsContent({ onClose, closeRef }) {
  return (
    <div className="mcredits">
      <h2 className="mcredits__title">
        WEBSITE
        <br />
        DEVELOPER
      </h2>
      {PEOPLE.map((p, i) => (
        <article className="mcredits__card" key={p.name} style={{ '--d': `${120 + i * 90}ms` }}>
          <img className="mcredits__photo" src={`./images/${p.photo}.webp`} alt={p.name} width="97" height="97" />
          <div className="mcredits__info">
            <h3 className="mcredits__name">{p.name}</h3>
            <p className="mcredits__major">
              <small>Communication and New Media</small>
              Digital Advertising
            </p>
            <p className="mcredits__role">{p.role}</p>
          </div>
          <ul className="mcredits__links">
            <li>
              <a href={igUrl(p.ig)} target="_blank" rel="noreferrer" aria-label={`Instagram ${p.name}`}>
                <IgIcon />/{p.ig}
              </a>
            </li>
            <li>
              <a href={p.fbUrl ?? fb(p.fb)} target="_blank" rel="noreferrer" aria-label={`Facebook ${p.name}`}>
                <FbIcon />/{p.fb}
              </a>
            </li>
          </ul>
        </article>
      ))}
      <button ref={closeRef} className="mcredits__close" type="button" onClick={onClose}>
        Close
      </button>
    </div>
  )
}

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
    // preventScroll: ปุ่ม Close อยู่ล่างสุด ถ้าเลื่อนไปหาปุ่ม หัวข้อจะหลุดขอบบนในจอเตี้ย
    closeRef.current?.focus({ preventScroll: true })
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  if (!open) return null

  // ทุกขนาดจอ: เบลอหน้าเว็บด้านหลัง แล้ววางการ์ดกระจก (มือถือเรียงแนวตั้ง จอใหญ่เรียง 3 ใบในแถวเดียว)
  return (
    <div
      className="credits"
      role="dialog"
      aria-modal="true"
      aria-label="Website Developer"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <CreditsContent onClose={() => setOpen(false)} closeRef={closeRef} />
    </div>
  )
}
