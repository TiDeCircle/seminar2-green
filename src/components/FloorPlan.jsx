import { useState } from 'react'
import { EVENT } from '../data.js'
import Title from './Title.jsx'

const ZONES = [
  { id: 'stage', label: 'เวที', desc: 'Talk Session กับคุณใบตอง และพิธีกร' },
  { id: 'seats', label: 'ที่นั่งผู้เข้าร่วม', desc: '36 ที่นั่ง แบ่งเป็น 2 ฝั่ง ฝั่งละ 18 ที่' },
  { id: 'press', label: 'Press Zone', desc: 'พื้นที่สำหรับช่างภาพและสื่อ' },
  { id: 'register', label: 'จุดลงทะเบียน', desc: 'ลงทะเบียน Check-in และรับของสมนาคุณ หน้าห้อง' },
  { id: 'door', label: 'ทางเข้า–ออก', desc: 'ประตูฝั่งทางเดิน 3 จุด' },
]

const SEAT_COLS = [0, 1, 2]
const SEAT_ROWS = [0, 1, 2, 3, 4, 5]

export default function FloorPlan() {
  const [active, setActive] = useState(null)
  const on = (id) => (active === null || active === id ? '' : 'is-dim')

  return (
    <section className="section floorplan" id="floorplan">
      <div className="container">
        <div className="section-head reveal">
          <Title tag="Floor Plan" text="ผังห้องสัมมนา" align="center" />
          <p className="muted">{EVENT.room} · {EVENT.building}</p>
        </div>

        <div className="fp">
          <div className="fp__plan reveal">
            <svg viewBox="0 0 760 800" role="img" aria-label={`ผัง${EVENT.room}`}>
              {/* ทางเดิน */}
              <rect x="0" y="0" width="760" height="800" rx="18" className="fp-corridor" />
              <text x="125" y="390" className="fp-corridor-text">ทางเดิน</text>

              {/* ห้อง */}
              <rect x="250" y="16" width="494" height="680" rx="12" className="fp-room" />
              <line x1="744" y1="30" x2="744" y2="680" className="fp-window" />

              {/* ประตู */}
              <g className={`fp-door ${on('door')}`}>
                {[90, 300, 510].map((y) => (
                  <g key={y}>
                    <rect x="242" y={y} width="16" height="110" rx="4" />
                    <path d={`M258 ${y + 8} q 38 40 0 94`} />
                  </g>
                ))}
              </g>

              {/* เวที */}
              <g className={`fp-stage ${on('stage')}`}>
                <rect x="385" y="36" width="230" height="96" rx="14" />
                <text x="500" y="94">เวที</text>
              </g>

              {/* ตู้ด้านข้าง */}
              <g className="fp-storage">
                <rect x="690" y="36" width="36" height="58" rx="4" />
                <rect x="690" y="100" width="36" height="36" rx="4" />
                <rect x="690" y="142" width="36" height="58" rx="4" />
              </g>

              {/* ที่นั่ง */}
              <g className={`fp-seats ${on('seats')}`}>
                {[345, 535].map((bx) =>
                  SEAT_COLS.map((c) =>
                    SEAT_ROWS.map((r) => (
                      <rect key={`${bx}-${c}-${r}`} x={bx + c * 46} y={190 + r * 48} width="34" height="34" rx="8" />
                    )),
                  ),
                )}
              </g>

              {/* Press zone */}
              <g className={`fp-press ${on('press')}`}>
                <rect x="380" y="510" width="240" height="52" rx="12" />
                <text x="500" y="544">Press Zone</text>
              </g>

              {/* จุดลงทะเบียน */}
              <g className={`fp-register ${on('register')}`}>
                <rect x="20" y="722" width="270" height="56" rx="12" />
                <text x="155" y="757">จุดลงทะเบียน</text>
              </g>
            </svg>
          </div>

          <ul className="fp__legend">
            {ZONES.map((z) => (
              <li key={z.id}>
                <button
                  type="button"
                  className={`legend-item legend-item--${z.id} ${active === z.id ? 'is-active' : ''}`}
                  onMouseEnter={() => setActive(z.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(z.id)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive((a) => (a === z.id ? null : z.id))}
                >
                  <span className="legend-item__dot" aria-hidden="true" />
                  <span>
                    <strong>{z.label}</strong>
                    <small>{z.desc}</small>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
