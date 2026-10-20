import { useEffect, useState } from 'react'
import { PLEDGES, ACTIVITIES, LINKS } from '../data.js'
import { Stars } from './Schedule.jsx'
import Title from './Title.jsx'

const STORAGE_KEY = 'gia-pledge'
const VARIANT_KEY = 'gia-pledge-variant'
// ชุดข้อมูลที่ผู้ใช้คนนี้เคยเปิดไปแล้วของไพ่แต่ละใบ { [id]: [index, ...] }
const SEEN_KEY = 'gia-pledge-seen'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

function save(key, value) {
  try {
    value === null ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ไม่มี storage ก็ใช้งานได้ปกติ */
  }
}

// สุ่มชุดข้อมูลที่ยังไม่เคยเปิด พอเปิดครบทุกชุดแล้วจึงเริ่มรอบใหม่ (และไม่ให้ซ้ำกับชุดล่าสุด)
function drawVariant(p) {
  const seen = load(SEEN_KEY, {})
  let used = Array.isArray(seen[p.id]) ? seen[p.id] : []
  if (used.length >= p.variants.length) used = used.slice(-1)
  const pool = p.variants.map((_, i) => i).filter((i) => !used.includes(i))
  const pick = pool[Math.floor(Math.random() * pool.length)]
  save(SEEN_KEY, { ...seen, [p.id]: [...used, pick] })
  return pick
}

export default function Register() {
  const [picked, setPicked] = useState(null)
  // ชุดข้อมูลที่โชว์อยู่หลังไพ่แต่ละใบ เก็บไว้แม้คว่ำไพ่ เพื่อไม่ให้ข้อความเปลี่ยนระหว่างพลิก
  const [shown, setShown] = useState({})

  useEffect(() => {
    const id = load(STORAGE_KEY, null)
    const p = PLEDGES.find((x) => x.id === id)
    if (!p) return
    const v = load(VARIANT_KEY, 0)
    setPicked(id)
    setShown({ [id]: p.variants[v] ? v : 0 })
  }, [])

  // ไพ่ที่เลือกจะเปิดค้างไว้ กดใบอื่นเพื่อเปลี่ยน หรือกดใบเดิมซ้ำเพื่อคว่ำกลับเป็นค่าเริ่มต้น
  // เปิดไพ่แต่ละครั้งจะสุ่มชุดข้อมูลใหม่
  const choose = (p) => {
    if (picked === p.id) {
      setPicked(null)
      save(STORAGE_KEY, null)
      save(VARIANT_KEY, null)
      return
    }
    const v = drawVariant(p)
    setPicked(p.id)
    setShown((prev) => ({ ...prev, [p.id]: v }))
    save(STORAGE_KEY, p.id)
    save(VARIANT_KEY, v)
  }

  const variantOf = (p) => p.variants[shown[p.id] ?? 0]
  const pledge = PLEDGES.find((p) => p.id === picked)
  const pending = (url) => !url || url === '#'

  return (
    <section className="section register night" id="register">
      <Stars />
      <div className="container">
        <h2 className="kv-title reveal">
          <img
            src="./images/kv-title.webp"
            alt="พฤติกรรมไหนที่คุณอยากเริ่มเปลี่ยน — Change"
            loading="lazy"
          />
        </h2>
        <p className="register__hint reveal">แตะเพื่อเปิดไพ่ 1 ใบที่คุณอยากเริ่มทำ แล้วนำไปเขียนบน Green Pledge Board ในวันงาน</p>

        <div className="cards" role="radiogroup" aria-label="เลือกพฤติกรรมที่อยากเริ่มเปลี่ยน">
          {PLEDGES.map((p, i) => (
            // reveal อยู่ที่ตัวห่อ เพราะ className ของปุ่มเปลี่ยนตอนเลือก แล้ว React จะลบ is-visible ทิ้งจนไพ่หายไป
            <div className="card-slot reveal" key={p.id} style={{ '--d': `${i * 70}ms` }}>
              <button
                type="button"
                role="radio"
                aria-checked={picked === p.id}
                className={`card ${picked === p.id ? 'is-picked' : ''} ${picked && picked !== p.id ? 'is-faded' : ''}`}
                onClick={() => choose(p)}
              >
                <span className="card__inner">
                  <span className="card__face card__face--front">
                    <img src={`./images/${p.img}.webp`} alt={p.label} loading="lazy" width="600" height="924" />
                  </span>
                  <span className="card__face card__face--back" aria-hidden={picked !== p.id}>
                    <span className="card__star">✦</span>
                    <strong className="card__title">{p.label}</strong>
                    <span className="card__case">{variantOf(p).case}</span>
                    <span className="card__detail">{variantOf(p).detail}</span>
                    <span className="card__tips">
                      {variantOf(p).tips.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </span>
                  </span>
                </span>
              </button>
            </div>
          ))}
        </div>

        <div className={`pledge ${pledge ? 'is-shown' : ''}`} aria-live="polite">
          {pledge && (
            <>
              <p className="pledge__label">My Green Pledge ✦</p>
              <p className="pledge__text" key={`${pledge.id}-${shown[pledge.id]}`}>“ฉันจะ{variantOf(pledge).pledge}”</p>
            </>
          )}
        </div>

        <div className="register__panel reveal">
          <div className="register__copy">
            <Title as="h3" size="sm" tone="gold" tag="Register" text="พร้อมลงมือแล้ว มาเจอกันในงาน!" />
            <p className="muted-light">
              ลงทะเบียนเข้างานผ่าน Google Forms (Check-in) และทำแบบประเมินความพึงพอใจหลังจบงาน (Check-out)
            </p>
          </div>
          <div className="register__actions">
            <figure className="qr">
              <img src="./images/qr-checkin.png" alt="QR Code ลงทะเบียน Check-in" width="740" height="740" loading="lazy" />
              <figcaption>สแกนเพื่อ Check-in</figcaption>
            </figure>
            <a
              className={`btn btn--gold btn--lg ${pending(LINKS.checkIn) ? 'is-pending' : ''}`}
              href={LINKS.checkIn}
              target={pending(LINKS.checkIn) ? undefined : '_blank'}
              rel="noreferrer"
              aria-disabled={pending(LINKS.checkIn)}
              onClick={(e) => pending(LINKS.checkIn) && e.preventDefault()}
            >
              Check-in ลงทะเบียน
              {pending(LINKS.checkIn) && <small>เปิดให้ลงทะเบียนเร็ว ๆ นี้</small>}
            </a>
            <a
              className={`btn btn--ghost btn--lg ${pending(LINKS.checkOut) ? 'is-pending' : ''}`}
              href={LINKS.checkOut}
              target={pending(LINKS.checkOut) ? undefined : '_blank'}
              rel="noreferrer"
              aria-disabled={pending(LINKS.checkOut)}
              onClick={(e) => pending(LINKS.checkOut) && e.preventDefault()}
            >
              Check-out แบบประเมิน
              {pending(LINKS.checkOut) && <small>เปิดหลังจบงาน</small>}
            </a>
          </div>
        </div>

        <div className="activities">
          {ACTIVITIES.map((a, i) => (
            <article className="activity reveal" key={a.title} style={{ '--d': `${i * 90}ms` }}>
              <h4>{a.title}</h4>
              <p>{a.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
