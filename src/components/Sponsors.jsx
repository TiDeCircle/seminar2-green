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

// กังหันยืนบนเนินของ footer (โคนเสาถูกเนินบังเอง) left เป็น % ของความกว้าง, size คูณความสูงพื้นฐาน
const TURBINES = [
  { left: 9, size: 1, speed: 8 },
  { left: 21, size: 0.66, speed: 7 },
  { left: 80, size: 0.72, speed: 6.5 },
  { left: 90, size: 1.12, speed: 9 },
]

// พื้นที่โลโก้ที่ต้องการ (px²) โลโก้ทรงสูงจะสูงกว่า โลโก้ทรงยาวจะเตี้ยกว่า แต่ดูหนักพอ ๆ กัน
const LOGO_AREA = 13000

function Logo({ sponsor }) {
  const { width: w, height: h, weight = 1 } = sponsor
  const logoH = Math.round(Math.sqrt(LOGO_AREA / (w / h)) * weight)
  const img = (
    <img
      src={sponsor.logo}
      alt={sponsor.name}
      width={w}
      height={h}
      loading="lazy"
      style={{ '--logo-h': `${logoH}px` }}
    />
  )
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
        {TURBINES.map((t, i) => (
          <div key={i} className="sponsors__turbine" style={{ left: `${t.left}%`, '--size': t.size }}>
            <img className="sponsors__tower" src="./images/turbine-tower.webp" alt="" loading="lazy" />
            <img
              className="sponsors__rotor"
              src="./images/guest-rotor.webp"
              alt=""
              loading="lazy"
              style={{ animationDuration: `${t.speed}s` }}
            />
          </div>
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
