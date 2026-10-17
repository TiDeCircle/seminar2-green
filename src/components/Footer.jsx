import { EVENT, SOCIAL } from '../data.js'
import { NAV } from './Header.jsx'

const ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.6 3c.3 2.3 1.6 3.8 3.9 4v3.2c-1.4.1-2.7-.3-3.9-1v6.1c0 4.9-5.3 6.9-8.6 4.3-2.6-2-2.6-6.3.3-8 1.1-.7 2.5-.9 3.8-.6v3.3c-.4-.1-.9-.2-1.4-.1-1.5.2-2.3 1.6-1.8 3 .6 1.6 3 1.9 4 .5.3-.5.4-1 .4-1.6V3h3.3z"
      />
    </svg>
  ),
}

const SOCIAL_LABELS = { instagram: 'Instagram', tiktok: 'TikTok' }

export default function Footer() {
  return (
    <footer className="footer">
      <img className="footer__hills" src="./images/hills.webp" alt="" aria-hidden="true" loading="lazy" />
      <div className="footer__body">
        <div className="container footer__grid">
          <img
            className="footer__logo"
            src="./images/logo-outline.webp"
            alt="Green in Action"
            width="700"
            height="292"
            loading="lazy"
          />
          <div className="footer__info">
            <p className="footer__course">{EVENT.course}</p>
            <p className="footer__meta">
              {EVENT.dateTh} · {EVENT.time}
              <br />
              {EVENT.room} <span className="footer__building">{EVENT.building}</span>
            </p>
          </div>
          <div className="footer__cta">
            <a href="#register" className="footer__btn">ลงทะเบียน</a>
            <div className="footer__social">
              {Object.entries(SOCIAL)
                .filter(([, url]) => url)
                .map(([key, url]) => (
                  <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={SOCIAL_LABELS[key]}>
                    {ICONS[key]}
                  </a>
                ))}
            </div>
          </div>
          <nav className="footer__nav" aria-label="เมนูท้ายเว็บ">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <p className="footer__bottom">© 2026 Green In Action Space. All rights reserved</p>
      </div>
    </footer>
  )
}
