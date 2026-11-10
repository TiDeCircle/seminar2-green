import { COLLAB } from '../data.js'
import { ICONS } from './Footer.jsx'

const LABELS = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok' }

// ช่วงสุดท้ายก่อน footer: ชวนไปรู้จัก O-SHOO The Ocean (ใช้โปสเตอร์เป็นพื้นหลัง)
export default function Collab() {
  return (
    <section className="collab" id="collab" aria-labelledby="collab-title">
      <img className="collab__bg" src="./images/collab-oshoo.webp" alt="" aria-hidden="true" loading="lazy" />
      <div className="container collab__inner">
        <div className="collab__text reveal">
          <p className="collab__tag">Collaboration</p>
          <h2 id="collab-title" className="collab__title">{COLLAB.name}</h2>
          <p className="collab__quote">“{COLLAB.quote}”</p>
          <dl className="collab__meanings">
            {COLLAB.meanings.map((m) => (
              <div key={m.word}>
                <dt>{m.word}</dt>
                <dd>ภาษากะเหรี่ยงแปลว่า “{m.meaning}”</dd>
              </div>
            ))}
          </dl>
          <div className="collab__social">
            {Object.entries(COLLAB.social).map(([key, url]) => (
              <a
                key={key}
                className={`btn btn--sm collab__btn ${url ? '' : 'is-pending'}`}
                href={url || '#'}
                target={url ? '_blank' : undefined}
                rel="noreferrer"
                aria-disabled={!url}
                onClick={(e) => !url && e.preventDefault()}
              >
                <span className="collab__btn-row">
                  {ICONS[key]}
                  {LABELS[key]}
                </span>
                {!url && <small>เร็ว ๆ นี้</small>}
              </a>
            ))}
          </div>
        </div>
        <img
          className="collab__poster reveal"
          src="./images/collab-oshoo.webp"
          alt="โปสเตอร์ O-SHOO The Ocean จุดประกายจาก…ปลายดอย"
          width="693"
          height="865"
          loading="lazy"
          style={{ '--d': '120ms' }}
        />
      </div>
    </section>
  )
}
