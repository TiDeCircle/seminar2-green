import { EVENT, EVENT_START, EVENT_END } from '../data.js'
import { useCountdown } from '../hooks.js'

const pad = (n) => String(n).padStart(2, '0')

// กังหันแต่ละต้น (หน่วย % ของภาพพื้นหลัง 2400×1000)
// left/top = ตำแหน่งดุมใบพัด, towerH = จากดุมถึงโคนเสาบนเนินหญ้า, speed = วินาทีต่อรอบ
const TURBINES = [
  { left: 9.784, top: 28.741, rotor: 16.358, towerW: 2.963, towerH: 47.63, speed: 7, delay: -1.2 },
  { left: 34.691, top: 45.111, rotor: 11.018, towerW: 2.068, towerH: 31.926, speed: 5.5, delay: -3.1 },
  { left: 65.556, top: 32.593, rotor: 15.807, towerW: 2.901, towerH: 46.37, speed: 8, delay: -0.4 },
  { left: 83.827, top: 43.185, rotor: 10.849, towerW: 2.037, towerH: 31.778, speed: 6, delay: -2.5 },
  { left: 100.525, top: 33.111, rotor: 15.68, towerW: 2.87, towerH: 43.481, speed: 7.5, delay: -4.6 },
]

// เมฆแต่ละก้อน (หน่วย % ของภาพ) — edge: ก้อนที่ชิดขอบภาพจะลอยออกทางขอบเท่านั้น จะได้ไม่เห็นรอยตัด
const CLOUDS = [
  { src: 'cloud-1', left: 15.864, top: 0, width: 30.741, speed: 22, delay: -4 },
  { src: 'cloud-2', left: 58.858, top: 0, width: 27.932, speed: 26, delay: -11 },
  { src: 'cloud-3', left: 0, top: 5.63, width: 23.426, speed: 20, delay: -7, edge: 'left' },
  { src: 'cloud-4', left: 61.79, top: 5.926, width: 38.21, speed: 30, delay: -2, edge: 'right' },
  { src: 'cloud-5', left: 0, top: 28.222, width: 28.426, speed: 24, delay: -15, edge: 'left' },
  { src: 'cloud-6', left: 72.963, top: 34.889, width: 27.037, speed: 21, delay: -9, edge: 'right' },
  { src: 'cloud-7', left: 28.765, top: 35.333, width: 17.963, speed: 16, delay: -5 },
]

export default function Hero() {
  const t = useCountdown(EVENT_START)
  const ended = Date.now() > new Date(EVENT_END).getTime()

  const units = [
    { value: t.days, label: 'วัน' },
    { value: t.hours, label: 'ชั่วโมง' },
    { value: t.minutes, label: 'นาที' },
    { value: t.seconds, label: 'วินาที' },
  ]

  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__scene">
          <img className="hero__sky" src="./images/hero-sky.webp" alt="" width="2400" height="1000" />
          {CLOUDS.map((c) => (
            <img
              key={c.src}
              className={`cloud ${c.edge ? `cloud--${c.edge}` : ''}`}
              src={`./images/${c.src}.webp`}
              alt=""
              style={{
                left: `${c.left}%`,
                top: `${c.top}%`,
                width: `${c.width}%`,
                animationDuration: `${c.speed}s`,
                animationDelay: `${c.delay}s`,
              }}
            />
          ))}
          <img className="hero__ground" src="./images/hero-hills.webp" alt="" />
          {TURBINES.map((t, i) => (
            <div key={i}>
              <img
                className="turbine__tower"
                src="./images/turbine-tower.webp"
                alt=""
                style={{ left: `${t.left}%`, top: `${t.top}%`, width: `${t.towerW}%`, height: `${t.towerH}%` }}
              />
              <img
                className="turbine__rotor"
                src="./images/turbine-rotor.webp"
                alt=""
                style={{
                  left: `${t.left}%`,
                  top: `${t.top}%`,
                  width: `${t.rotor}%`,
                  animationDuration: `${t.speed}s`,
                  animationDelay: `${t.delay}s`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="hero__content">
        <h1 className="hero__logo">
          <img src="./images/logo.webp" alt="Green in Action" width="1400" height="584" />
        </h1>
        <p className="hero__tagline">
          เมื่อความคิดเรื่องความยั่งยืน <br className="br-mobile" />
          ไม่ได้หยุดอยู่แค่คำพูด
        </p>

        <div className="hero__pill">
          <span>{EVENT.dateShort}</span>
          <span className="dot" aria-hidden="true" />
          <span>{EVENT.time}</span>
          <span className="dot" aria-hidden="true" />
          <span>{EVENT.room}</span>
        </div>

        {t.done ? (
          <p className="hero__live">{ended ? 'ขอบคุณทุกคนที่มาร่วมงาน 💚' : 'งานกำลังดำเนินอยู่ตอนนี้!'}</p>
        ) : (
          <div className="countdown" role="timer" aria-label="นับถอยหลังสู่วันงาน">
            {units.map((u) => (
              <div className="countdown__box" key={u.label}>
                <span className="countdown__num">{pad(u.value)}</span>
                <span className="countdown__label">{u.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="hero__cta">
          <a href="#register" className="btn btn--gold">ลงทะเบียนเข้าร่วม</a>
          <a href="#schedule" className="btn btn--ghost">ดูกำหนดการ</a>
        </div>
      </div>
      <img className="hero__hills" src="./images/hills.webp" alt="" aria-hidden="true" />
    </section>
  )
}
