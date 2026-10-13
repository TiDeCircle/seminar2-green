import { OBJECTIVES, TOPICS, AUDIENCE, SPEAKER, LINKS } from '../data.js'
import Title from './Title.jsx'

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about__intro">
          <div className="reveal">
            <Title tag="About the seminar" text="ความยั่งยืน เริ่มได้จากชีวิตของเรา" />
            <p className="lead">
              ประเด็นสิ่งแวดล้อมและความยั่งยืนเป็นเรื่องที่ทุกคนมีส่วนร่วมได้ แต่การเปลี่ยนแปลงไม่ได้เกิดจากการรับรู้หรือการพูดถึงปัญหาเพียงอย่างเดียว
              ต้องอาศัยการลงมือทำอย่างต่อเนื่อง
            </p>
            <p>
              งานสัมมนา <strong>“GREEN IN ACTION”</strong> ชวนคนรุ่นใหม่มองความยั่งยืนเป็นเรื่องใกล้ตัว สนุก และทำได้จริง
              ผ่านเรื่องเล่าจากประสบการณ์ลงมือทำจริงของคุณใบตอง จรีรัตน์ เพชรโสม — ได้เห็นว่าการเลือกกิน ใช้ ซื้อ และใช้ชีวิตในแต่ละวัน
              ส่งผลต่อสุขภาพของตัวเองและโลกไปพร้อมกัน และในฐานะนักนิเทศศาสตร์ เราใช้การสื่อสารเป็นเครื่องมือส่งต่อประเด็นนี้ได้อย่างไร
            </p>
            <ul className="chips" aria-label="กลุ่มเป้าหมาย">
              {AUDIENCE.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <img
            className="about__sticker reveal"
            src="./images/sustainable-longevity.webp"
            alt="Sustainable & Longevity คืออะไร?"
            width="900"
            height="868"
            loading="lazy"
          />
        </div>

        <div className="objectives">
          {OBJECTIVES.map((o, i) => (
            <article className="objective reveal" key={i} style={{ '--d': `${i * 90}ms` }}>
              <span className="objective__num">0{i + 1}</span>
              <p>{o}</p>
            </article>
          ))}
        </div>

        <article className="speaker reveal" aria-labelledby="speaker-name">
          <div className="speaker__photo">
            <img
              src="./images/speaker-portrait.webp"
              alt="คุณใบตอง จรีรัตน์ เพชรโสม ในชุดประกวด Miss Earth Thailand 2021"
              width="836"
              height="1255"
              loading="lazy"
            />
            <span className="speaker__badge">Guest Speaker</span>
          </div>
          <div className="speaker__body">
            <p className="eyebrow eyebrow--gold">{SPEAKER.tagline}</p>
            <h3 id="speaker-name" className="speaker__name">{SPEAKER.name}</h3>
            <p className="speaker__en">{SPEAKER.nameEn}</p>
            <p>{SPEAKER.bio}</p>
            <ul className="speaker__list">
              {SPEAKER.achievements.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <div className="speaker__stats">
              {SPEAKER.stats.map((s) => (
                <div key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
              <a href={LINKS.instagram} target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
                @baitong__j
              </a>
            </div>
            <blockquote className="speaker__quote">“{SPEAKER.quote}”</blockquote>
          </div>
        </article>

        <div className="gallery">
          <img src="./images/speaker-mangrove.webp" alt="คุณใบตองลงพื้นที่ปลูกป่าชายเลน" loading="lazy" className="reveal" />
          <img src="./images/speaker-stage.webp" alt="คุณใบตองขึ้นพูดบนเวที" loading="lazy" className="reveal" />
          <img src="./images/speaker-rooftop.webp" alt="คุณใบตองในสวนบนดาดฟ้า" loading="lazy" className="reveal" />
        </div>

        <div className="topics">
          <div className="topics__head reveal">
            <Title as="h3" size="sm" tag="Talk Session" text="รักษ์โลกแบบไม่ต้องเป๊ะ เริ่มได้จากชีวิตของเรา" />
            <p>วงพูดคุยระหว่างพิธีกรและคุณใบตอง ผ่าน 3 ประเด็น ก่อนเปิดให้ผู้เข้าร่วมซักถามและแลกเปลี่ยนมุมมองโดยตรง</p>
          </div>
          <ol className="topics__list">
            {TOPICS.map((t, i) => (
              <li className="topic reveal" key={t.title} style={{ '--d': `${i * 90}ms` }}>
                <span className="topic__num">{i + 1}</span>
                <div>
                  <h4>{t.title}</h4>
                  <p>{t.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
