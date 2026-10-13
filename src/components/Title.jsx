// หัวข้อสไตล์สติกเกอร์ vector: ตัวอักษรไล่สี + ขอบขาวหนา + ดาวประกาย (ล้อกับ asset หัวข้อ)
const Sparkle = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z" />
  </svg>
)

export default function Title({ text, tag, tone = 'green', size = 'lg', as: Tag = 'h2', align = 'left' }) {
  return (
    <div className={`vhead vhead--${align}`}>
      {tag && <span className="vtag">{tag}</span>}
      <Tag className={`vtitle vtitle--${tone} vtitle--${size}`} data-text={text}>
        <span className="vtitle__fill">{text}</span>
        <Sparkle className="vtitle__spark vtitle__spark--a" />
        <Sparkle className="vtitle__spark vtitle__spark--b" />
        <Sparkle className="vtitle__spark vtitle__spark--c" />
      </Tag>
    </div>
  )
}
