import { useEffect, useState } from 'react'
import { SHOW_FLOORPLAN } from '../data.js'

export const NAV = [
  { href: '#about', label: 'About' },
  { href: '#schedule', label: 'Schedule' },
  { href: '#map', label: 'Map' },
  { href: '#floorplan', label: 'Floor Plan' },
].filter((item) => SHOW_FLOORPLAN || item.href !== '#floorplan')

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="header__inner">
        <a href="#top" className="brand" onClick={close}>
          <img
            className="brand__title"
            src="./images/wordmark.webp"
            alt="GREEN IN ACTION"
            width="881"
            height="120"
          />
          <span className="brand__sub">SEMINAR · 20.11.2026</span>
        </a>

        <button
          className="menu-btn"
          aria-label="เปิดเมนู"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className="nav" aria-label="เมนูหลัก">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={close}>
              {item.label}
            </a>
          ))}
          <a href="#register" className="btn btn--gold btn--sm" onClick={close}>
            ลงทะเบียน
          </a>
        </nav>
      </div>
    </header>
  )
}
