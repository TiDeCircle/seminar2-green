import { useEffect, useRef } from 'react'

const MIN_THUMB = 48
const HIDE_AFTER = 1100

// แถบเลื่อนลอยแบบ Mac แทนแถบของเบราว์เซอร์ (เฉพาะจอที่ใช้เมาส์)
// โผล่ตอนเลื่อนหรือเอาเมาส์มาใกล้ขอบขวา ลากเพื่อเลื่อนหน้าได้
export default function ScrollBar() {
  const trackRef = useRef(null)
  const thumbRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    if (!mq.matches) return

    const root = document.documentElement
    const track = trackRef.current
    const thumb = thumbRef.current
    root.classList.add('has-scrollbar')

    let thumbH = 0
    let hideTimer = 0
    let frame = 0
    let drag = null

    const maxScroll = () => root.scrollHeight - window.innerHeight
    const travel = () => window.innerHeight - thumbH

    const layout = () => {
      const vh = window.innerHeight
      const max = maxScroll()
      track.hidden = max <= 0
      if (max <= 0) return
      thumbH = Math.max(MIN_THUMB, (vh * vh) / root.scrollHeight)
      thumb.style.height = `${thumbH}px`
      thumb.style.transform = `translateY(${(window.scrollY / max) * travel()}px)`
    }

    const show = () => {
      track.classList.add('is-active')
      clearTimeout(hideTimer)
      hideTimer = setTimeout(() => {
        if (!drag && !track.matches(':hover')) track.classList.remove('is-active')
      }, HIDE_AFTER)
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(layout)
      show()
    }

    const scrollToY = (y) => window.scrollTo({ top: y, behavior: 'instant' })

    const onThumbDown = (e) => {
      e.preventDefault()
      e.stopPropagation()
      thumb.setPointerCapture(e.pointerId)
      drag = { y: e.clientY, scroll: window.scrollY }
      track.classList.add('is-dragging')
    }

    const onThumbMove = (e) => {
      if (!drag) return
      scrollToY(drag.scroll + ((e.clientY - drag.y) * maxScroll()) / travel())
    }

    const onThumbUp = () => {
      drag = null
      track.classList.remove('is-dragging')
      show()
    }

    // กดที่รางว่าง ๆ = กระโดดไปตำแหน่งนั้น
    const onTrackDown = (e) => {
      if (e.target !== track) return
      scrollToY(((e.clientY - thumbH / 2) / travel()) * maxScroll())
    }

    const ro = new ResizeObserver(layout)
    ro.observe(document.body)

    layout()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', layout)
    track.addEventListener('pointerenter', show)
    track.addEventListener('pointerleave', show)
    track.addEventListener('pointerdown', onTrackDown)
    thumb.addEventListener('pointerdown', onThumbDown)
    thumb.addEventListener('pointermove', onThumbMove)
    thumb.addEventListener('pointerup', onThumbUp)
    thumb.addEventListener('pointercancel', onThumbUp)

    return () => {
      root.classList.remove('has-scrollbar')
      clearTimeout(hideTimer)
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', layout)
      track.removeEventListener('pointerenter', show)
      track.removeEventListener('pointerleave', show)
      track.removeEventListener('pointerdown', onTrackDown)
      thumb.removeEventListener('pointerdown', onThumbDown)
      thumb.removeEventListener('pointermove', onThumbMove)
      thumb.removeEventListener('pointerup', onThumbUp)
      thumb.removeEventListener('pointercancel', onThumbUp)
    }
  }, [])

  return (
    <div ref={trackRef} className="scrollbar" aria-hidden="true">
      <div ref={thumbRef} className="scrollbar__thumb" />
    </div>
  )
}
