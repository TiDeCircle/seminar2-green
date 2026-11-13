import { SPONSORS } from '../data.js'
import Title from './Title.jsx'

// จำนวนช่องว่างที่แสดงไว้ก่อนได้โลโก้จริง
const PLACEHOLDERS = 4

// เมฆชุดเดียวกับ hero ใช้ก้อนที่ไม่ถูกตัดขอบ (cloud-7, cloud-6) วางซ้ำแล้วกลับด้านบางก้อน
const CLOUDS = [
  { src: 'cloud-7', left: 7, top: 8, width: 27, speed: 22, delay: -4 },
  { src: 'cloud-7', left: 64, top: 3, width: 25, speed: 26, delay: -11, flip: true },
  { src: 'cloud-6', left: 58, top: 34, width: 24, speed: 20, delay: -7 },
  { src: 'cloud-7', left: 4, top: 52, width: 32, speed: 24, delay: -15 },
  { src: 'cloud-7', left: 54, top: 68, width: 32, speed: 18, delay: -9, flip: true },
]

function Logo({ sponsor }) {
  const img = <img src={sponsor.logo} alt={sponsor.name} loading="lazy" />
  return sponsor.url ? (
    <a className="sponsor" href={sponsor.url} target="_blank" rel="noreferrer">
      {img}
    </a>
  ) : (
    <div className="sponsor">{img}</div>
  )
}

export default function Sponsors() {
  const empty = SPONSORS.length === 0

  return (
    <section className="section sponsors" id="sponsors">
      <div className="sponsors__sky" aria-hidden="true">
        {CLOUDS.map((c, i) => (
          <img
            key={i}
            className={`cloud ${c.flip ? 'cloud--flip' : ''}`}
            src={`./images/${c.src}.webp`}
            alt=""
            loading="lazy"
            style={{
              left: `${c.left}%`,
              top: `${c.top}%`,
              width: `${c.width}%`,
              animationDuration: `${c.speed}s`,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="container">
        <div className="section-head reveal">
          <Title tag="Sponsors" text="ขอบคุณผู้สนับสนุน" align="center" />
          <p className="muted">ขอบคุณทุกการสนับสนุนที่ทำให้ Green in Action เกิดขึ้นได้จริง</p>
        </div>

        <ul className={`sponsors__grid reveal ${empty ? 'is-empty' : ''}`}>
          {empty
            ? Array.from({ length: PLACEHOLDERS }, (_, i) => (
                <li key={i} className="sponsor sponsor--slot">
                  <span>พื้นที่โลโก้ผู้สนับสนุน</span>
                </li>
              ))
            : SPONSORS.map((s) => (
                <li key={s.name}>
                  <Logo sponsor={s} />
                </li>
              ))}
        </ul>
      </div>
    </section>
  )
}
