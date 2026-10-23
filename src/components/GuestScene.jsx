// ฉากวิทยากร: ซ้อน layer ตามไฟล์ Post_3 (ผืนผ้าใบ 12180 × 5400)
// x / y / w เป็น % ของผืนผ้าใบ เรียงจากหลังไปหน้า
const LAYERS = [
  { name: 'cloud-l', x: 6.96, y: -9.63, w: 27.17, kind: 'cloud' },
  { name: 'cloud-r', x: 66.44, y: -5.26, w: 22.94, kind: 'cloud' },
  { name: 'frame', x: 32.12, y: 9.85, w: 35.76, kind: 'rise' },
  { name: 'stamp-1', x: -9.13, y: 16.3, w: 22.75, kind: 'stamp', rot: -8, alt: 'คุณใบตองในชุดเสื้อกั๊กสีขาวกับกางเกงขากว้าง' },
  { name: 'stamp-2', x: 8.54, y: 1.7, w: 22.83, kind: 'stamp', rot: 6, alt: 'คุณใบตองในชุดไทยประยุกต์' },
  { name: 'stamp-3', x: 28.9, y: 20.3, w: 17.63, kind: 'stamp', rot: -6, alt: 'คุณใบตองถ่ายเซลฟี่ข้างรูปปั้นสีทอง' },
  { name: 'stamp-4', x: 56.42, y: 13.78, w: 14.11, kind: 'stamp', rot: 5, alt: 'คุณใบตองนั่งเท้าคางในเสื้อไหมพรม' },
  { name: 'stamp-5', x: 72.35, y: 31.7, w: 16.13, kind: 'stamp', rot: -5, alt: 'คุณใบตองนั่งพักบนสนามหญ้า' },
  { name: 'stamp-6', x: 89, y: 15.56, w: 18.38, kind: 'stamp', rot: 7, alt: 'คุณใบตองวิ่งในชุดสีขาว' },
  { name: 'name', x: 33.83, y: 16.3, w: 11.87, kind: 'pop', alt: 'วิทยากร คุณใบตอง จรีรัตน์ เพชรโสม' },
  { name: 'title', x: 53.79, y: 66.15, w: 12.78, kind: 'pop', alt: 'Miss Earth Fire 2021' },
  { name: 'portrait', x: 41.18, y: 5.33, w: 18.6, kind: 'rise', alt: 'คุณใบตอง จรีรัตน์ เพชรโสม ในชุดประกวด Miss Earth Thailand 2021' },
  { name: 'bush-1', x: 30.21, y: 83.7, w: 13.43, kind: 'bush' },
  { name: 'bush-2', x: 53.2, y: 80.89, w: 17.87, kind: 'bush' },
  { name: 'bush-3', x: 67.03, y: 73.63, w: 39.47, kind: 'bush' },
  { name: 'bush-4', x: -10.57, y: 68.44, w: 36.47, kind: 'bush' },
]

export default function GuestScene() {
  return (
    <div className="guest reveal" role="group" aria-label="วิทยากร คุณใบตอง จรีรัตน์ เพชรโสม">
      <div className="guest__canvas">
        <img className="guest__bg" src="./images/guest-bg.webp" alt="" width="3045" height="1350" loading="lazy" />
        {LAYERS.map((l, i) => (
          <img
            key={l.name}
            className={`guest__layer guest__layer--${l.kind}`}
            src={`./images/guest-${l.name}.webp`}
            alt={l.alt || ''}
            loading="lazy"
            style={{ left: `${l.x}%`, top: `${l.y}%`, width: `${l.w}%`, '--d': `${i * 70}ms`, '--rot': `${l.rot || 0}deg` }}
          />
        ))}
      </div>
    </div>
  )
}
