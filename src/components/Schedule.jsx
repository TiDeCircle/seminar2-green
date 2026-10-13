import { SCHEDULE, EVENT } from '../data.js'
import Title from './Title.jsx'

export default function Schedule() {
  return (
    <section className="section schedule night" id="schedule">
      <Stars />
      <div className="container">
        <div className="section-head reveal">
          <Title tag="Schedule" text="กำหนดการ" tone="gold" align="center" />
          <p className="muted-light">{EVENT.dateTh}</p>
        </div>

        <ol className="timeline">
          {SCHEDULE.map((item, i) => (
            <li
              key={item.time}
              className={`timeline__item reveal ${item.highlight ? 'is-highlight' : ''}`}
              style={{ '--d': `${i * 50}ms` }}
            >
              <time className="timeline__time">{item.time}</time>
              <div className="timeline__body">
                <h3>{item.title}</h3>
                {item.note && <p>{item.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// ดาวประกายแบบเดียวกับการ์ด asset
export function Stars() {
  return (
    <div className="stars" aria-hidden="true">
      {Array.from({ length: 14 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={`star star--${i}`}>
          <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z" />
        </svg>
      ))}
    </div>
  )
}
