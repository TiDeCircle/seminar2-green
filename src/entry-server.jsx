import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'

// ใช้ตอน build เท่านั้น: เรนเดอร์หน้าเว็บเป็น HTML ให้ Google อ่านเนื้อหาได้โดยไม่ต้องรัน JS
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
