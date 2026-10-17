import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// ตอน build เนื้อหาถูกเรนเดอร์ไว้ใน HTML แล้ว (prerender.mjs) ส่วนตอน npm run dev ยังว่างอยู่
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
