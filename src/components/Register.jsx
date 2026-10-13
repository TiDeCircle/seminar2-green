import { useEffect, useState } from 'react'
import { PLEDGES, ACTIVITIES, LINKS } from '../data.js'
import { Stars } from './Schedule.jsx'
import Title from './Title.jsx'

const STORAGE_KEY = 'gia-pledge'

function readPledge() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export default function Register() {
  const [picked, setPicked] = useState(null)

  useEffect(() => {
    setPicked(readPledge())
  }, [])

  const choose = (id) => {
    const next = picked === id ? null : id
    setPicked(next)
    try {
      next ? localStorage.setItem(STORAGE_KEY, next) : localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ไม่มี storage ก็ใช้งานได้ปกติ */
    }
  }

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
        <p className="register__hint reveal">เลือก 1 การ์ดที่คุณอยากเริ่มทำ แล้วนำไปเขียนบน Green Pledge Board ในวันงาน</p>

        <div className="cards" role="radiogroup" aria-label="เลือกพฤติกรรมที่อยากเริ่มเปลี่ยน">
          {PLEDGES.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={picked === p.id}
              className={`card reveal ${picked === p.id ? 'is-picked' : ''} ${picked && picked !== p.id ? 'is-faded' : ''}`}
              style={{ '--d': `${i * 70}ms` }}
              onClick={() => choose(p.id)}
            >
              <img src={`./images/${p.img}.webp`} alt={p.label} loading="lazy" width="600" height="924" />
            </button>
          ))}
        </div>

        <div className={`pledge ${pledge ? 'is-shown' : ''}`} aria-live="polite">
          {pledge && (
            <>
              <p className="pledge__label">My Green Pledge ✦</p>
              <p className="pledge__text">“ฉันจะ{pledge.pledge}”</p>
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
