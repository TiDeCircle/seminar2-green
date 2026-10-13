import { EVENT, TEAM } from '../data.js'

export default function Footer() {
  return (
    <footer className="footer">
      <img className="footer__hills" src="./images/hills.webp" alt="" aria-hidden="true" loading="lazy" />
      <div className="footer__body">
        <div className="container footer__grid">
          <div>
            <img className="footer__logo" src="./images/logo.webp" alt="Green in Action" loading="lazy" />
            <p className="footer__course">{EVENT.course}</p>
            <p className="footer__meta">
              {EVENT.dateTh} · {EVENT.time}
              <br />
              {EVENT.room} {EVENT.building}
            </p>
          </div>
          <div>
            <h2 className="footer__head">ทีมผู้จัดงาน</h2>
            <ul className="team">
              {TEAM.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="footer__bottom">© 2026 Green in Action · Healthy for me, sustainable for Earth.</p>
      </div>
    </footer>
  )
}
