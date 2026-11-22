import Icon from './Icon.jsx'
import { home } from '../navigation.js'

const sections = [
  { label: 'Số liệu tổng quan', icon: 'chart', empty: 'Chưa có số liệu', tone: 'violet' },
  { label: 'Hoạt động gần đây', icon: 'clock', empty: 'Chưa có hoạt động', tone: 'teal' },
  { label: 'Thông báo', icon: 'bell', empty: 'Chưa có thông báo', tone: 'amber' },
]

export function HomePage() {
  return (
    <>
      <section className="welcome">
        <div className="welcome-copy">
          <h1>Chào mừng đến với<br className="welcome-break" /> trang quản lý trường THPT</h1>
          <p>Mỗi ngày là một cơ hội để xây dựng môi trường học tập tốt hơn.</p>
        </div>
        <div className="welcome-art" aria-hidden="true"><Icon name="school" /></div>
      </section>
      <section className="overview" aria-labelledby="overview-heading">
        <h2 id="overview-heading">Tổng quan</h2>
        <div className="overview-grid">
          {sections.map(({ label, icon, empty, tone }) => (
            <section className="overview-card" key={label}>
              <span className={`card-icon ${tone}`}><Icon name={icon} /></span>
              <h3>{label}</h3>
              <p>{empty}</p>
            </section>
          ))}
        </div>
      </section>
    </>
  )
}

export function PlaceholderPage({ page }) {
  return (
    <section className="placeholder">
      <span className="card-icon violet"><Icon name={page.icon} /></span>
      <h1>{page.label}</h1>
      <p>Chức năng đang được phát triển</p>
      <a className="return-link" href={home.href}>Về trang chủ</a>
    </section>
  )
}
