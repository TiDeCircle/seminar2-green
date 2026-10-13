import { EVENT, MAP, SHOW_FLOORPLAN } from '../data.js'
import Title from './Title.jsx'

export default function MapSection() {
  const q = encodeURIComponent(MAP.query)
  const embed = `https://maps.google.com/maps?q=${q}&z=16&output=embed`
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`

  return (
    <section className="section map" id="map">
      <img className="map__turbine" src="./images/turbine.webp" alt="" aria-hidden="true" loading="lazy" />
      <div className="container map__grid">
        <div className="map__info reveal">
          <Title tag="Map" text="สถานที่จัดงาน" />
          <dl className="info-list">
            <div>
              <dt>วันที่</dt>
              <dd>{EVENT.dateTh}</dd>
            </div>
            <div>
              <dt>เวลา</dt>
              <dd>{EVENT.time} <small>(เปิดลงทะเบียน 08.30 น.)</small></dd>
            </div>
            <div>
              <dt>สถานที่</dt>
              <dd>
                {EVENT.room}
                <br />
                {EVENT.building}
              </dd>
            </div>
          </dl>
          <div className="map__actions">
            <a className="btn btn--green" href={directions} target="_blank" rel="noreferrer">
              นำทางด้วย Google Maps
            </a>
            {SHOW_FLOORPLAN && (
              <a className="btn btn--outline" href="#floorplan">ดูผังห้อง</a>
            )}
          </div>
          <p className="tip">💧 อย่าลืมพกขวดน้ำส่วนตัวมา รับสติกเกอร์พิเศษ!</p>
        </div>
        <div className="map__frame reveal">
          <iframe
            title="แผนที่ อาคาร Tourism Tower (A5) มหาวิทยาลัยกรุงเทพ"
            src={embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
