import { useEffect, useRef, useState } from 'react'
import { EVENT, MAP, SHOW_FLOORPLAN } from '../data.js'

// ทุกตำแหน่งเป็นพิกเซลของภาพพื้นหลัง venue-bg.webp (1920×1077) แล้วแปลงเป็น %
const BG_W = 1920
const BG_H = 1077
const box = (x, y, w, h) => ({
  left: `${(x / BG_W) * 100}%`,
  top: `${(y / BG_H) * 100}%`,
  width: `${(w / BG_W) * 100}%`,
  ...(h ? { height: `${(h / BG_H) * 100}%` } : {}),
})

// ตึก (venue-tower.webp 664×1024) — หน้าต่างกับลิฟต์ใช้พิกเซลของภาพตึก
const TOWER = { x: 734, y: 53, w: 664, h: 1024 }
const inTower = (x, y, w, h) => ({
  left: `${(x / TOWER.w) * 100}%`,
  top: `${(y / TOWER.h) * 100}%`,
  width: `${(w / TOWER.w) * 100}%`,
  height: `${(h / TOWER.h) * 100}%`,
})

// หน้าต่างสีอ่อนในภาพตึก จะค่อย ๆ เปิดไฟสลับกัน
const WINDOWS = [
  { x: 200, y: 220, w: 41, h: 44, delay: 0.2 },
  { x: 445, y: 282, w: 41, h: 45, delay: 1.9 },
  { x: 351, y: 422, w: 41, h: 34, delay: 3.1 },
  { x: 218, y: 753, w: 42, h: 84, delay: 1.1 },
  { x: 468, y: 863, w: 41, h: 84, delay: 2.6 },
]

function Tower() {
  return (
    <div className="map__tower" aria-hidden="true">
      <img src="./images/venue-tower.webp" width={TOWER.w} height={TOWER.h} alt="" loading="lazy" />
      {WINDOWS.map((w, i) => (
        <span
          key={i}
          className="map__window"
          style={{ ...inTower(w.x, w.y, w.w, w.h), animationDelay: `${w.delay}s` }}
        />
      ))}
      {/* ลิฟต์วิ่งขึ้นเสาข้างตึกไปจอดที่ชั้นห้องจัดงาน */}
      <span className="map__lift" style={inTower(67, 0, 19, TOWER.h)}>
        <i />
      </span>
    </div>
  )
}

function RoomLabel() {
  const img = <img src="./images/venue-label-room.webp" width="331" height="114" alt="" loading="lazy" />
  return SHOW_FLOORPLAN ? (
    <a className="map__label map__label--room" href="#floorplan" aria-label={`${EVENT.room} — ดูผังห้อง`}>
      {img}
    </a>
  ) : (
    <img className="map__label map__label--room" src="./images/venue-label-room.webp" width="331" height="114" alt="" loading="lazy" />
  )
}

export default function MapSection() {
  const q = encodeURIComponent(MAP.query)
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${q}`
  const embed = `https://maps.google.com/maps?q=${q}&z=16&output=embed`
  const artRef = useRef(null)
  const [visible, setVisible] = useState(false)

  // เล่นแอนิเมชันตึกโผล่ตอนเลื่อนมาถึง
  useEffect(() => {
    const el = artRef.current
    // มือถือเรียงเป็นแนวตั้ง ตึกอยู่ล่างสุด เลยรอให้เลื่อนถึงตัวตึกก่อน
    const mobileTower = el.querySelector('.map__m-tower')
    const target = mobileTower.offsetParent ? mobileTower : el
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(target)
    return () => io.disconnect()
  }, [])

  // ขยับเมาส์แล้วตึกกับป้ายเลื่อนคนละระยะ ให้ดูมีมิติ (เฉพาะจอที่ใช้เมาส์)
  useEffect(() => {
    const el = artRef.current
    const ok = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!ok.matches) return
    let frame = 0
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const mx = ((e.clientX - r.left) / r.width) * 2 - 1
      const my = ((e.clientY - r.top) / r.height) * 2 - 1
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--mx', mx.toFixed(3))
        el.style.setProperty('--my', my.toFixed(3))
      })
    }
    const onLeave = () => {
      el.style.setProperty('--mx', 0)
      el.style.setProperty('--my', 0)
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <section className="map" id="map">
      <h2 className="sr-only">สถานที่จัดงานสัมมนา</h2>
      <p className="sr-only">
        {EVENT.dateTh} เวลา {EVENT.time} ณ {EVENT.room} {EVENT.building}
      </p>
      <div ref={artRef} className={`map__art ${visible ? 'is-visible' : ''}`}>
        <img
          className="map__bg"
          src="./images/venue-bg.webp"
          width={BG_W}
          height={BG_H}
          alt="สถานที่จัดงานสัมมนา พร้อมแผนที่วิธีการเดินทางมาตึก A5 Tourism Tower"
          loading="lazy"
        />

        {/* หัวข้อและแผนที่เส้นทางเป็นเลเยอร์ 4x วางทับพื้น (พื้นหลังลบของเดิมที่ฝังในภาพออกแล้ว) */}
        <img className="map__piece" style={box(97, 147, 626, 273)} src="./images/venue-m-title.webp" width="1212" height="528" alt="" />
        <img className="map__piece" style={box(1436, 199, 398, 68)} src="./images/venue-m-head.webp" width="1026" height="176" alt="" />
        <img className="map__piece" style={box(1475, 255, 320, 63)} src="./images/venue-m-pill.webp" width="826" height="163" alt="" />
        <img className="map__piece" style={box(1425, 353, 419, 525)} src="./images/venue-m-map.webp" width="1079" height="1354" alt="" />
        <img className="map__piece" style={box(1484, 910, 303, 27)} src="./images/venue-m-legend.webp" width="782" height="70" alt="" />

        {/* คลื่นวงกลมใต้หมุด A5 บนแผนที่ด้านขวา */}
        <span className="map__ping" style={box(1545, 572, 44, 24)} aria-hidden="true">
          <i />
          <i />
        </span>

        <div className="map__layer map__layer--tower" style={box(TOWER.x, TOWER.y, TOWER.w)} aria-hidden="true">
          <Tower />
        </div>

        <div className="map__layer map__layer--label" style={box(880, 124, 262)} aria-hidden="true">
          <img className="map__label map__label--tower" src="./images/venue-label-tower.webp" width="262" height="106" alt="" loading="lazy" />
        </div>

        <div className="map__layer map__layer--label" style={box(964, 646, 331)}>
          <RoomLabel />
        </div>

        <a className="map__gmaps" style={box(262, 455, 299, 54)} href={directions} target="_blank" rel="noreferrer">
          GOOGLE MAPS
        </a>
        {/* แผนที่ Google จริง วางทับรูปแผนที่ในภาพ เลื่อน/ซูมดูได้ */}
        <div className="map__embed" style={box(110, 560, 606, 428)}>
          <iframe
            title="แผนที่ อาคาร Tourism Tower (A5) มหาวิทยาลัยกรุงเทพ"
            src={embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* มือถือ: ประกอบจากเลเยอร์แยก (ขนาดอิงเฟรมดีไซน์กว้าง 402px)
            ไฟล์ venue-m-*.webp เป็น export 4x */}
        <div className="map__m">
          {/* เมฆหลังหัวข้อ ตามดีไซน์ (ใช้เมฆชุดเดียวกับ Hero) */}
          <img className="map__m-cloud" src="./images/cloud-1.webp" width="738" height="236" alt="" aria-hidden="true" loading="lazy" />
          <img className="map__m-title" src="./images/venue-m-title.webp" width="1212" height="528" alt="" loading="lazy" />
          <img className="map__m-head" src="./images/venue-m-head.webp" width="1026" height="176" alt="" loading="lazy" />
          <img className="map__m-pill" src="./images/venue-m-pill.webp" width="826" height="163" alt="" loading="lazy" />
          <div className="map__m-route">
            <img
              src="./images/venue-m-map.webp"
              width="1079"
              height="1354"
              alt="แผนที่วิธีการเดินทางมาตึก A5 Tourism Tower"
              loading="lazy"
            />
            {/* คลื่นใต้หมุด A5 เหมือนในจอคอม (พิกเซลของดีไซน์ 1x 270×339 ภาพจริงเป็น 4x) */}
            <span
              className="map__ping"
              style={{ left: `${(78 / 270) * 100}%`, top: `${(141.5 / 339) * 100}%`, width: `${(27 / 270) * 100}%`, height: `${(15 / 339) * 100}%` }}
              aria-hidden="true"
            >
              <i />
              <i />
            </span>
          </div>
          <img
            className="map__m-legend"
            src="./images/venue-m-legend.webp"
            width="782"
            height="70"
            alt="สัญลักษณ์: สีน้ำเงินคือลานจอดรถ หมุดเขียวคือ A5 Tourism Tower"
            loading="lazy"
          />
          <a className="map__m-gmaps" href={directions} target="_blank" rel="noreferrer">
            GOOGLE MAPS
          </a>
          <div className="map__m-embed">
            <iframe
              title="แผนที่ อาคาร Tourism Tower (A5) มหาวิทยาลัยกรุงเทพ"
              src={embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="map__m-tower">
            <Tower />
            <div className="map__m-label map__m-label--tower" aria-hidden="true">
              <img className="map__label map__label--tower" src="./images/venue-label-tower.webp" width="262" height="106" alt="" loading="lazy" />
            </div>
            <div className="map__m-label map__m-label--room">
              <RoomLabel />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
